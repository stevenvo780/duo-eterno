/**
 * Hook centralizado para manejar el loop principal del juego
 * Combina todos los sistemas en un único intervalo optimizado
 */

import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { useUpgrades } from './useUpgrades';
import { getGameIntervals, gameConfig } from '../config/gameConfig';
import { shouldUpdateAutopoiesis, measureExecutionTime } from '../utils/performanceOptimizer';
import { createUpgradeEffectsContext } from '../utils/upgradeEffects';
import { makeIntelligentDecision } from '../utils/aiDecisionEngine';
import { applyHybridDecay, applySurvivalCosts } from '../utils/activityDynamics';
import { logGeneral } from '../utils/logger';
import type { Entity, EntityMood } from '../types';

interface GameLoopStats {
  totalTicks: number;
  autopoiesisTicks: number;
  movementTicks: number;
  clockTicks: number;
  lastTickTime: number;
}

export const useUnifiedGameLoop = () => {
  const { gameState, dispatch } = useGame();
  const { getUpgradeEffect } = useUpgrades();
  
  const intervalRef = useRef<number | undefined>(undefined);
  const statsRef = useRef<GameLoopStats>({
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
    if (stats.energy < 20) return 'TIRED';
    if (stats.loneliness > 80 && resonance < 30) return 'SAD';
    
    const positiveScore = (stats.happiness + stats.energy + Math.min(100, stats.money)) / 3;
    const negativeScore = (stats.hunger + stats.sleepiness + stats.boredom + stats.loneliness) / 4;
    const bondBonus = resonance > 70 ? 15 : resonance < 30 ? -10 : 0;
    
    const moodScore = positiveScore - negativeScore + bondBonus;
    
    if (moodScore > 50 && stats.energy > 60) return 'EXCITED';
    if (moodScore > 25) return 'HAPPY';
    if (moodScore > 5) return 'CONTENT';
    if (moodScore > -15) return 'CALM';
    return 'SAD';
  };

  useEffect(() => {
    const { gameClockInterval } = getGameIntervals();
    const upgradeEffects = createUpgradeEffectsContext(getUpgradeEffect);
    
    logGeneral.info('Iniciando loop unificado del juego', { interval: gameClockInterval });
    
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = now - statsRef.current.lastTickTime;
      const stats = statsRef.current;
      
      // Throttling de performance
      if (deltaTime < gameClockInterval * 0.8) return;
      
      stats.lastTickTime = now;
      stats.totalTicks++;

      measureExecutionTime('unified-game-loop', () => {
        // Ejecutar tick base
        dispatch({ type: 'TICK' });
        
        const livingEntities = gameState.entities.filter(entity => !entity.isDead);
        
        // ============ AUTOPOIESIS (cada tick si las condiciones lo permiten) ============
        if (shouldUpdateAutopoiesis() && livingEntities.length > 0) {
          stats.autopoiesisTicks++;
          
          measureExecutionTime('autopoiesis-system', () => {
            for (const entity of livingEntities) {
              // Aplicar decay híbrido
              const newStats = applyHybridDecay(
                entity.stats, 
                entity.activity, 
                deltaTime, 
                upgradeEffects
              );
              
              // Aplicar costos de supervivencia
              const finalStats = applySurvivalCosts(newStats, deltaTime);
              
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
              const newMood = calculateOptimizedMood(finalStats, gameState.resonance);
              if (newMood !== entity.mood) {
                dispatch({
                  type: 'UPDATE_ENTITY_MOOD',
                  payload: { entityId: entity.id, mood: newMood }
                });
              }
            }
          });
        }
        
        // ============ AI DECISIONS (cada 3 ticks) ============
        if (stats.totalTicks % 3 === 0 && livingEntities.length > 0) {
          measureExecutionTime('ai-decisions', () => {
            for (const entity of livingEntities) {
              const companion = livingEntities.find(e => e.id !== entity.id) || null;
              const newActivity = makeIntelligentDecision(entity, companion, now);
              
              if (newActivity !== entity.activity) {
                dispatch({
                  type: 'UPDATE_ENTITY_ACTIVITY',
                  payload: { entityId: entity.id, activity: newActivity }
                });
                
                logGeneral.debug(`Cambio de actividad: ${entity.id}`, { 
                  from: entity.activity, 
                  to: newActivity 
                });
              }
            }
          });
        }
        
        // ============ GAME CLOCK EVENTS (cada ciertos ticks) ============
        stats.clockTicks++;
        
        // Verificar muerte (cada 4 ticks)
        if (stats.totalTicks % 4 === 0) {
          measureExecutionTime('death-check', () => {
            // ... lógica de verificación de muerte ...
            for (const entity of livingEntities) {
              const criticalStats = [
                entity.stats.hunger > 95,
                entity.stats.sleepiness > 95,
                entity.stats.loneliness > 95,
                entity.stats.energy < 5
              ].filter(Boolean).length;
              
              if (criticalStats >= 2) {
                const deathProbability = 0.08 * gameConfig.criticalEventProbability;
                if (Math.random() < deathProbability) {
                  dispatch({ type: 'KILL_ENTITY', payload: { entityId: entity.id } });
                  logGeneral.warn(`Entidad murió: ${entity.id}`, { stats: entity.stats });
                }
              }
            }
          });
        }
        
        // Actualizar tiempo juntos (cada 2 ticks)
        if (stats.totalTicks % 2 === 0 && livingEntities.length === 2) {
          const [entity1, entity2] = livingEntities;
          const distance = Math.sqrt(
            Math.pow(entity1.position.x - entity2.position.x, 2) +
            Math.pow(entity1.position.y - entity2.position.y, 2)
          );
          
          if (distance < 80) {
            dispatch({ 
              type: 'UPDATE_TOGETHER_TIME', 
              payload: gameState.togetherTime + gameClockInterval 
            });
          }
        }
        
        // Auto-save (cada 20 ticks)
        if (stats.totalTicks % 20 === 0) {
          try {
            localStorage.setItem('duoEternoState', JSON.stringify({
              ...gameState,
              lastSave: now
            }));
            logGeneral.debug('Auto-guardado realizado');
          } catch (error) {
            logGeneral.error('Error en auto-guardado', error);
          }
        }
        
        // Log de estadísticas de performance (cada 100 ticks)
        if (gameConfig.debugMode && stats.totalTicks % 100 === 0) {
          logGeneral.info('Estadísticas del loop unificado', {
            totalTicks: stats.totalTicks,
            autopoiesisTicks: stats.autopoiesisTicks,
            efficiency: (stats.autopoiesisTicks / stats.totalTicks * 100).toFixed(1) + '%'
          });
        }
      });
      
    }, gameClockInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        logGeneral.info('Loop unificado del juego detenido', { 
          totalTicks: statsRef.current.totalTicks 
        });
      }
    };
  }, [gameState.entities, gameState.resonance, dispatch, getUpgradeEffect]);

  return {
    stats: statsRef.current
  };
};
