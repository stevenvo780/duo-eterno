/**
 * Hook centralizado para manejar el loop principal del juego
 * Combina todos los sistemas en un único intervalo optimizado
 */

import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import type { GameState } from '../types';
import { getGameIntervals, gameConfig } from '../config/gameConfig';
import { shouldUpdateAutopoiesis, measureExecutionTime } from '../utils/performanceOptimizer';
import { applyHybridDecay, applySurvivalCosts } from '../utils/activityDynamics';
import { HEALTH_CONFIG, RESONANCE_THRESHOLDS } from '../constants/gameConstants';
import { logGeneral } from '../utils/logger';
import { dynamicsLogger } from '../utils/dynamicsLogger';
import type { Entity, EntityMood } from '../types';

interface LoopStats {
  totalTicks: number;
  autopoiesisTicks: number;
  movementTicks: number;
  clockTicks: number;
  lastTickTime: number;
}

export const useUnifiedGameLoop = () => {
  const { gameState, dispatch } = useGame();

  const gameStateRef = useRef<GameState>(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  const intervalRef = useRef<number | undefined>(undefined);
  const loopStatsRef = useRef<LoopStats>({
    totalTicks: 0,
    autopoiesisTicks: 0,
    movementTicks: 0,
    clockTicks: 0,
    lastTickTime: Date.now()
  });

  // Función para calcular el mood optimizado
  const calculateOptimizedMood = (stats: Entity['stats'], resonance: number): EntityMood => {
    const criticalFactors = [
      stats.hunger > 85,
      stats.sleepiness > 85,
      stats.loneliness > 85,
      stats.energy < 15,
      stats.money < 10
    ].filter(Boolean).length;
    if (criticalFactors >= 2) return 'ANXIOUS';
    const positiveScore = (stats.happiness + stats.energy + Math.min(100, stats.money)) / 3;
    const negativeScore = (stats.hunger + stats.sleepiness + stats.boredom + stats.loneliness) / 4;
    const bondBonus = resonance > 70 ? 15 : resonance < 30 ? -10 : 0;
    const moodScore = positiveScore - negativeScore + bondBonus;
    if (moodScore > 50 && stats.energy > 60) return 'EXCITED';
    if (moodScore > 25) return 'CONTENT';
    if (moodScore > 5) return 'CALM';
    if (moodScore > -15) return 'TIRED';
    return 'SAD';
  };

  useEffect(() => {
    const { gameClockInterval } = getGameIntervals();
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = now - loopStatsRef.current.lastTickTime;
      const loopStats = loopStatsRef.current;
      
      // Throttling de performance
      if (deltaTime < gameClockInterval * 0.8) return;
      
      loopStats.lastTickTime = now;
      loopStats.totalTicks++;

      measureExecutionTime('unified-game-loop', () => {
        // Ejecutar tick base
        dispatch({ type: 'TICK', payload: deltaTime });
        
        const livingEntities = gameStateRef.current.entities.filter(entity => !entity.isDead);

        // ================= ESTADOS POR RESONANCIA =================
        const resonanceLevel = gameStateRef.current.resonance;
        const nowMs = now;
        for (const entity of livingEntities) {
          if (resonanceLevel <= 0) {
            if (entity.state !== 'FADING') {
              dispatch({
                type: 'UPDATE_ENTITY_STATE',
                payload: { entityId: entity.id, state: 'FADING' }
              });
            } else if (nowMs - entity.lastStateChange > 10000) {
              dispatch({ type: 'KILL_ENTITY', payload: { entityId: entity.id } });
            }
          } else if (resonanceLevel < RESONANCE_THRESHOLDS.CRITICAL) {
            if (entity.state !== 'LOW_RESONANCE' && entity.state !== 'FADING') {
              dispatch({
                type: 'UPDATE_ENTITY_STATE',
                payload: { entityId: entity.id, state: 'LOW_RESONANCE' }
              });
            }
          } else {
            if (entity.state === 'LOW_RESONANCE' || entity.state === 'FADING') {
              dispatch({
                type: 'UPDATE_ENTITY_STATE',
                payload: { entityId: entity.id, state: 'IDLE' }
              });
            }
          }
        }
        
        // ============ AUTOPOIESIS (cada tick si las condiciones lo permiten) ============
        if (shouldUpdateAutopoiesis() && livingEntities.length > 0) {
          loopStats.autopoiesisTicks++;
          
          measureExecutionTime('autopoiesis-system', () => {
            for (const entity of livingEntities) {
              // Aplicar decay híbrido
              const newStats = applyHybridDecay(
                entity.stats, 
                entity.activity, 
                deltaTime
              );
              
              // Aplicar costos de supervivencia
              const finalStats = applySurvivalCosts(newStats, deltaTime);
              
              // Detectar estadísticas críticas
              const criticalStats = Object.entries(finalStats)
                .filter(([key, value]) => {
                  if (key === 'money') return false;
                  // REPARACIÓN: Lógica correcta para detectar stats críticas
                  if (key === 'health') return value < 20; // Health crítica bajo 20
                  if (key === 'energy') return value < 30; // Energy crítica bajo 30
                  if (key === 'happiness') return value < 35; // Happiness crítica bajo 35
                  // Para hunger, sleepiness, boredom, loneliness: crítico sobre 75
                  return value > 75;
                })
                .map(([key]) => key);
              
              if (criticalStats.length > 0) {
                dynamicsLogger.logStatsCritical(entity.id, criticalStats, finalStats);
                
                // REPARACIÓN EMERGENCIA: Reset a valores seguros si hay demasiadas críticas
                if (criticalStats.length >= 3) {
                  dispatch({
                    type: 'UPDATE_ENTITY_STATS',
                    payload: { 
                      entityId: entity.id, 
                      stats: {
                        hunger: 40,
                        sleepiness: 40, 
                        energy: 60,
                        happiness: 60,
                        boredom: 30,
                        loneliness: 35,
                        money: Math.max(20, finalStats.money),
                        health: Math.max(50, finalStats.health)
                      }
                    }
                  });
                  continue; // Skip normal stat updates for this entity
                }
              }
              
              // Actualizar stats si hay cambios significativos
              const hasSignificantChanges = Object.keys(finalStats).some(key => {
                const statKey = key as keyof Entity['stats'];
                return Math.abs(finalStats[statKey] - entity.stats[statKey]) > 0.1;
              });
              
              if (hasSignificantChanges) {
                const statChanges: Partial<Entity['stats']> = {};
                Object.keys(finalStats).forEach(key => {
                  const statKey = key as keyof Entity['stats'];
                  const change = finalStats[statKey] - entity.stats[statKey];
                  if (Math.abs(change) > 0.1) {
                    statChanges[statKey] = entity.stats[statKey] + change;
                  }
                });
                
                dispatch({
                  type: 'UPDATE_ENTITY_STATS',
                  payload: { entityId: entity.id, stats: statChanges }
                });
              }
              
              // Actualizar mood
              const newMood = calculateOptimizedMood(finalStats, gameStateRef.current.resonance);
              if (newMood !== entity.mood) {
                dynamicsLogger.logMoodChange(entity.id, entity.mood, newMood, finalStats);
                dispatch({
                  type: 'UPDATE_ENTITY_MOOD',
                  payload: { entityId: entity.id, mood: newMood }
                });
              }
            }
          });
        }
        
        // ============ GAME CLOCK EVENTS (cada ciertos ticks) ============
        loopStats.clockTicks++;
        
        // Verificar salud (cada 4 ticks)
        if (loopStats.totalTicks % 4 === 0) {
          measureExecutionTime('death-check', () => {
            for (const entity of livingEntities) {
              const criticalCount = [
                entity.stats.hunger > 95,
                entity.stats.sleepiness > 95,
                entity.stats.loneliness > 95,
                entity.stats.energy < 5
              ].filter(Boolean).length;

              let healthChange = (deltaTime / 1000) * HEALTH_CONFIG.RECOVERY_RATE;
              if (criticalCount > 0) {
                const decay = criticalCount * HEALTH_CONFIG.DECAY_PER_CRITICAL * (deltaTime / 1000);
                healthChange = -decay;
              }

              const newHealth = Math.max(0, Math.min(100, entity.stats.health + healthChange));

              if (Math.abs(newHealth - entity.stats.health) > 0.01) {
                dispatch({
                  type: 'UPDATE_ENTITY_STATS',
                  payload: { entityId: entity.id, stats: { health: newHealth } }
                });
              }

              if (newHealth <= 0) {
                dynamicsLogger.logEntityDeath(entity.id, 'estadísticas críticas', entity.stats);
                dispatch({ type: 'KILL_ENTITY', payload: { entityId: entity.id } });
                logGeneral.warn(`Entidad murió: ${entity.id}`, { stats: entity.stats });
              } else if (Math.abs(newHealth - entity.stats.health) > 1) {
                // Log cambios significativos de salud
                const factors = [];
                if (criticalCount > 0) factors.push(`${criticalCount} stats críticas`);
                else factors.push('recuperación natural');
                dynamicsLogger.logHealthChange(entity.id, entity.stats.health, newHealth, factors);
              }
            }
          });
        }
        
        // Actualizar tiempo juntos y resonancia (cada 2 ticks)
        if (loopStats.totalTicks % 2 === 0 && livingEntities.length === 2) {
          const [entity1, entity2] = livingEntities;
          const distance = Math.sqrt(
            Math.pow(entity1.position.x - entity2.position.x, 2) +
            Math.pow(entity1.position.y - entity2.position.y, 2)
          );
          
          // Distancia de vinculación ajustable
          const BOND_DISTANCE = 80;
          const CLOSE_DISTANCE = 50; // Distancia muy cercana para bonus extra
          
          if (distance < BOND_DISTANCE) {
            // Actualizar tiempo juntos
            dispatch({
              type: 'UPDATE_TOGETHER_TIME',
              payload: gameStateRef.current.togetherTime + gameClockInterval
            });
            
            // Calcular incremento de resonancia basado en la proximidad y deltaTime
            const proximityBonus = distance < CLOSE_DISTANCE ? 1.5 : 1.0;
            const baseResonanceIncrement = (deltaTime / 1000) * 2.0 * proximityBonus * gameConfig.gameSpeedMultiplier;
            
            // Sistema de mood bonus más permisivo
            let moodBonus = 1.0;
            if ((entity1.mood === 'HAPPY' || entity1.mood === 'EXCITED') &&
                (entity2.mood === 'HAPPY' || entity2.mood === 'EXCITED')) {
              moodBonus = 1.5; // Bonus alto para ambos felices
            } else if ((entity1.mood === 'CONTENT' || entity1.mood === 'CALM') ||
                      (entity2.mood === 'CONTENT' || entity2.mood === 'CALM')) {
              moodBonus = 1.2; // Bonus moderado si al menos uno está bien
            } else if (entity1.mood !== 'SAD' && entity2.mood !== 'SAD') {
              moodBonus = 1.0; // Incremento normal si no están tristes
            } else {
              moodBonus = 0.5; // Reducción si están tristes, pero aún hay incremento
            }
            
            const finalResonanceIncrement = baseResonanceIncrement * moodBonus;
            
            // Aplicar incremento con límite máximo
            const newResonance = Math.min(100, gameStateRef.current.resonance + finalResonanceIncrement);
            
            // DEBUG: Log todos los incrementos para diagnosticar
            if (loopStats.totalTicks % 20 === 0) {
              // Detalle de resonancia para diagnóstico
            }
            
            if (finalResonanceIncrement > 0.001) { // Solo actualizar si hay cambio significativo
              dynamicsLogger.logResonanceChange(
                gameStateRef.current.resonance, 
                newResonance, 
                'proximidad y mood bonus', 
                [entity1, entity2]
              );
              
              dispatch({ 
                type: 'UPDATE_RESONANCE', 
                payload: newResonance 
              });
              
              // Log efecto de proximidad
              dynamicsLogger.logProximityEffect([entity1, entity2], distance, 'BONDING');
              
              if (gameConfig.debugMode && loopStats.totalTicks % 10 === 0) {
                logGeneral.debug('Nutriendo vínculo', { 
                  distance: distance.toFixed(1),
                  resonance: gameStateRef.current.resonance.toFixed(2),
                  increment: finalResonanceIncrement.toFixed(4),
                  newResonance: newResonance.toFixed(2)
                });
              }
            }
          } else if (distance > BOND_DISTANCE * 2) {
            // Decay de resonancia cuando están muy lejos (más suave)
            const resonanceDecay = (deltaTime / 1000) * 0.2 * gameConfig.gameSpeedMultiplier;
            const newResonance = Math.max(0, gameStateRef.current.resonance - resonanceDecay);
            
            if (resonanceDecay > 0.001) {
              dynamicsLogger.logResonanceChange(
                gameStateRef.current.resonance,
                newResonance,
                'separación excesiva',
                [entity1, entity2]
              );
              
              dynamicsLogger.logProximityEffect([entity1, entity2], distance, 'SEPARATION');
              
              dispatch({ 
                type: 'UPDATE_RESONANCE', 
                payload: newResonance 
              });
            }
          }
        }
        
        // Auto-save (cada 20 ticks)
        if (loopStats.totalTicks % 20 === 0) {
          try {
            localStorage.setItem('duoEternoState', JSON.stringify({
              ...gameStateRef.current,
              lastSave: now
            }));
            logGeneral.debug('Auto-guardado realizado');
          } catch (error) {
            logGeneral.error('Error en auto-guardado', error);
          }
        }
        
        // Tomar snapshots regulares (cada 50 ticks)
        if (loopStats.totalTicks % 50 === 0) {
          livingEntities.forEach(entity => {
            dynamicsLogger.takeEntitySnapshot(entity);
          });
          
          dynamicsLogger.takeSystemSnapshot(
            gameStateRef.current.resonance,
            gameStateRef.current.togetherTime,
            gameStateRef.current.cycles,
            gameStateRef.current.entities
          );
        }
        
        // Log de estadísticas de performance (cada 100 ticks)
        if (gameConfig.debugMode && loopStats.totalTicks % 100 === 0) {
          logGeneral.info('Estadísticas del loop unificado', {
            totalTicks: loopStats.totalTicks,
            autopoiesisTicks: loopStats.autopoiesisTicks,
            efficiency: (loopStats.autopoiesisTicks / loopStats.totalTicks * 100).toFixed(1) + '%'
          });
          
          // Mostrar reporte de dinámicas en consola si es necesario
        }
      });
    }, gameClockInterval);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [dispatch]);

  return {
    stats: loopStatsRef.current
  };
};
