/**
 * Hook centralizado para manejar el loop principal del juego
 * Combina todos los sistemas en un único intervalo optimizado
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import type { GameState } from '../types';
import { getGameIntervals, gameConfig } from '../config/gameConfig';
import { shouldUpdateAutopoiesis, measureExecutionTime } from '../utils/performanceOptimizer';
import { applyHybridDecay, applySurvivalCosts, ACTIVITY_EFFECTS, mapActivityToPreferredZone } from '../utils/activityDynamics';
import { getEntityZone } from '../utils/mapGeneration';
import { getActivitySession } from '../utils/aiDecisionEngine';
import {
  HEALTH_CONFIG,
  RESONANCE_THRESHOLDS,
  FADING_TIMEOUT_MS,
  FADING_RECOVERY_THRESHOLD
} from '../constants/gameConstants';
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

  // Calcula el mood en base a stats y resonancia
  const calculateOptimizedMood = (stats: Entity['stats'], resonance: number): EntityMood => {
    const criticalFactors = [
      stats.hunger < 15,
      stats.sleepiness < 15,
      stats.loneliness < 15,
      stats.energy < 15,
      stats.money < 10
    ].filter(Boolean).length;
    if (criticalFactors >= 2) return 'ANXIOUS';
    const positiveScore = (stats.happiness + stats.energy + Math.min(100, stats.money)) / 3;
    const negativeScore = (100 - stats.hunger + 100 - stats.sleepiness + 100 - stats.boredom + 100 - stats.loneliness) / 4;
    const bondBonus = resonance > 70 ? 15 : resonance < 30 ? -10 : 0;
    const moodScore = positiveScore - negativeScore + bondBonus;
    if (moodScore > 50 && stats.energy > 60) return 'EXCITED';
    if (moodScore > 25) return 'CONTENT';
    if (moodScore > 5) return 'CALM';
    if (moodScore > -15) return 'TIRED';
    return 'SAD';
  };

  // Maneja transiciones de estado basadas en la resonancia del vínculo
  const updateResonanceStates = useCallback(
    (entities: Entity[], resonanceLevel: number, nowMs: number) => {
      for (const entity of entities) {
      if (resonanceLevel <= 0) {
        if (entity.state !== 'FADING') {
          dispatch({
            type: 'UPDATE_ENTITY_STATE',
            payload: { entityId: entity.id, state: 'FADING' }
          });
        } else if (nowMs - entity.lastStateChange > FADING_TIMEOUT_MS) {
          dispatch({ type: 'KILL_ENTITY', payload: { entityId: entity.id } });
        }
      } else if (entity.state === 'FADING') {
        if (resonanceLevel > FADING_RECOVERY_THRESHOLD) {
          dispatch({
            type: 'UPDATE_ENTITY_STATE',
            payload: { entityId: entity.id, state: 'IDLE' }
          });
        }
      } else if (resonanceLevel < RESONANCE_THRESHOLDS.CRITICAL) {
        if (entity.state !== 'LOW_RESONANCE') {
          dispatch({
            type: 'UPDATE_ENTITY_STATE',
            payload: { entityId: entity.id, state: 'LOW_RESONANCE' }
          });
        }
      } else if (entity.state === 'LOW_RESONANCE') {
        dispatch({
          type: 'UPDATE_ENTITY_STATE',
          payload: { entityId: entity.id, state: 'IDLE' }
        });
      }
    }
  }, [dispatch]);

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

        // Estados por resonancia
        updateResonanceStates(
          livingEntities,
          gameStateRef.current.resonance,
          now
        );
        
        // Actualizar stats de autopoiesis
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
              
              // Aplicar efectos de actividad (perMinute + costos + immediate)
              const statsAfterActivity = { ...newStats };
              const session = getActivitySession(entity.id);
              if (session) {
                const effects = ACTIVITY_EFFECTS[session.activity];
                const timeSpent = now - session.startTime;
                let efficiency = effects.efficiencyOverTime(timeSpent);

                // Bonus/penalty por estar en zona preferida
                const preferredZone = mapActivityToPreferredZone(session.activity);
                const inPreferred = (() => {
                  const z = getEntityZone(entity.position, gameStateRef.current.zones);
                  return z && preferredZone && z.type === preferredZone;
                })();
                efficiency *= inPreferred ? 1.15 : 0.9;

                const dtMin = (deltaTime / 60000) * gameConfig.gameSpeedMultiplier;
                Object.entries(effects.perMinute).forEach(([k, perMin]) => {
                  const key = k as keyof Entity['stats'];
                  const delta = perMin * efficiency * dtMin;
                  const next = (statsAfterActivity[key] as number) + delta;
                  statsAfterActivity[key] = (key === 'money'
                    ? Math.max(0, next)
                    : Math.max(0, Math.min(100, next))) as number;
                });

                if (effects.cost) {
                  Object.entries(effects.cost).forEach(([k, cost]) => {
                    const key = k as keyof Entity['stats'];
                    if (key === 'money') {
                      const next = (statsAfterActivity[key] as number) - cost * dtMin;
                      statsAfterActivity[key] = Math.max(0, next) as number;
                    }
                  });
                }

                if (!session.immediateApplied) {
                  Object.entries(effects.immediate).forEach(([k, imm]) => {
                    const key = k as keyof Entity['stats'];
                    const next = (statsAfterActivity[key] as number) + imm;
                    statsAfterActivity[key] = (key === 'money'
                      ? Math.max(0, next)
                      : Math.max(0, Math.min(100, next))) as number;
                  });
                  session.immediateApplied = true;
                }

                // Actualiza efectividad/satisfacción simple
                const gainKeys = Object.keys(effects.perMinute);
                const deltaScore = gainKeys.reduce((acc, k) => {
                  const key = k as keyof Entity['stats'];
                  return acc + ((statsAfterActivity[key] as number) - (entity.stats[key] as number));
                }, 0);
                session.effectiveness = Math.max(0, Math.min(1, 0.5 + deltaScore / 200));
                session.satisfactionLevel = Math.max(0, Math.min(1, session.satisfactionLevel * 0.8 + session.effectiveness * 0.2));
              }

              // Aplicar costos de supervivencia
              const finalStats = applySurvivalCosts(statsAfterActivity, deltaTime);
              
              // Detectar estadísticas críticas
              const criticalStats = Object.entries(finalStats)
                .filter(([key, value]) => {
                  if (key === 'money') return false;
                  if (key === 'health') return value < 20;
                  if (key === 'energy') return value < 30;
                  if (key === 'happiness') return value < 35;
                  return value < 25;
                })
                .map(([key]) => key);
              
              if (criticalStats.length > 0) {
                dynamicsLogger.logStatsCritical(entity.id, criticalStats, finalStats);
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
        
        // Eventos del reloj de juego
        loopStats.clockTicks++;
        
        // Verificar salud (cada 4 ticks)
        if (loopStats.totalTicks % 4 === 0) {
          measureExecutionTime('death-check', () => {
            for (const entity of livingEntities) {
              const criticalCount = [
                entity.stats.hunger < 5,
                entity.stats.sleepiness < 5,
                entity.stats.loneliness < 5,
                entity.stats.energy < 5
              ].filter(Boolean).length;

              // Recuperación sujeta a resonancia; mayor vínculo ayuda
              let healthChange = (deltaTime / 1000) * (HEALTH_CONFIG.RECOVERY_RATE + (gameStateRef.current.resonance - 50) / 1000);
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

          // Constantes del modelo unificado (pueden parametrizarse en config/env más adelante)
          const BOND_DISTANCE = 80; // distancia de referencia
          const dtSec = deltaTime / 1000;
          const BOND_GAIN_PER_SEC = 1.8;       // ganancia base por cercanía
          const SEPARATION_DECAY_PER_SEC = 0.2; // pérdida base por separación
          const STRESS_DECAY_PER_SEC = 0.3;     // pérdida por cada agente con stat crítica
          const DISTANCE_SCALE = 30;            // suaviza la transición de cercanía
          const JOINT_BONUS_UNIT = 0.3;         // bonus por actividad/zona conjunta

          // Factor de cercanía en [0,1] usando sigmoide centrada en BOND_DISTANCE
          const closeness = 1 / (1 + Math.exp((distance - BOND_DISTANCE) / Math.max(1, DISTANCE_SCALE)));

          // Tiempo juntos si hay suficiente cercanía
          if (closeness > 0.6) {
            dispatch({
              type: 'UPDATE_TOGETHER_TIME',
              payload: gameStateRef.current.togetherTime + gameClockInterval
            });
          }

          // Factor de humor (idéntica lógica previa, consolidada)
          let moodBonus = 1.0;
          if ((entity1.mood === 'HAPPY' || entity1.mood === 'EXCITED') &&
              (entity2.mood === 'HAPPY' || entity2.mood === 'EXCITED')) {
            moodBonus = 1.5;
          } else if ((entity1.mood === 'CONTENT' || entity1.mood === 'CALM') ||
                     (entity2.mood === 'CONTENT' || entity2.mood === 'CALM')) {
            moodBonus = 1.2;
          } else if (entity1.mood === 'SAD' || entity2.mood === 'SAD') {
            moodBonus = 0.7;
          }

          // Sinergia por actividad y zona compartida
          const sameActivity = entity1.activity === entity2.activity && ['SOCIALIZING','DANCING','CONTEMPLATING','MEDITATING','RESTING'].includes(entity1.activity);
          const zone1 = getEntityZone(entity1.position, gameStateRef.current.zones);
          const zone2 = getEntityZone(entity2.position, gameStateRef.current.zones);
          const sameSocialZone = zone1 && zone2 && zone1.id === zone2.id && (zone1.type === 'social' || zone1.type === 'comfort');
          const synergy = 1 + JOINT_BONUS_UNIT * ((sameActivity ? 1 : 0) + (sameSocialZone ? 1 : 0));

          // Estrés por stats críticas
          const critical1 = (entity1.stats.hunger < 15 || entity1.stats.sleepiness < 15 || entity1.stats.loneliness < 15 || entity1.stats.energy < 15);
          const critical2 = (entity2.stats.hunger < 15 || entity2.stats.sleepiness < 15 || entity2.stats.loneliness < 15 || entity2.stats.energy < 15);
          const stressCount = (critical1 ? 1 : 0) + (critical2 ? 1 : 0);

          // Ecuación unificada: crecimiento saturante por cercanía y humor, y decaimientos por separación y estrés
          const R = gameStateRef.current.resonance;
          const gain = BOND_GAIN_PER_SEC * closeness * moodBonus * synergy * (1 - R / 100);
          const sep = SEPARATION_DECAY_PER_SEC * (1 - closeness) * (R / 100);
          const stress = STRESS_DECAY_PER_SEC * stressCount * (R / 100);
          const dR = dtSec * (gain - sep - stress);
          const newResonance = Math.max(0, Math.min(100, R + dR));

          if (Math.abs(newResonance - R) > 0.001) {
            dynamicsLogger.logResonanceChange(
              R,
              newResonance,
              'modelo unificado de resonancia',
              [entity1, entity2]
            );
            dispatch({ type: 'UPDATE_RESONANCE', payload: newResonance });

            if (closeness > 0.6) {
              dynamicsLogger.logProximityEffect([entity1, entity2], distance, 'BONDING');
            } else if (closeness < 0.2) {
              dynamicsLogger.logProximityEffect([entity1, entity2], distance, 'SEPARATION');
            }

            if (gameConfig.debugMode && loopStats.totalTicks % 10 === 0) {
              logGeneral.debug('Resonancia (unificada)', {
                distance: distance.toFixed(1),
                closeness: closeness.toFixed(2),
                dR: dR.toFixed(4),
                newResonance: newResonance.toFixed(2)
              });
            }
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
  }, [dispatch, updateResonanceStates]);

  return {
    stats: loopStatsRef.current
  };
};
