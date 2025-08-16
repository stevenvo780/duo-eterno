/**
 * 🚀 FASE 1: Unified Game Loop Optimizado con Memory Management
 * 
 * Optimizaciones implementadas según el Plan de Trabajo:
 * - ✅ Memory leak fixes con cleanup completo
 * - ✅ Integración con batching system para reducir re-renders
 * - ✅ Logger optimizado con throttling automático
 * - ✅ Performance monitoring y adaptive throttling
 * - ✅ Proper interval cleanup y resource management
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import { useBatchedGameLoop } from './useBatchedGameLoop';
import type { GameState, Entity, EntityMood } from '../types';
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
import { optimizedDynamicsLogger } from '../utils/optimizedDynamicsLogger';

interface LoopStats {
  totalTicks: number;
  autopoiesisTicks: number;
  movementTicks: number;
  clockTicks: number;
  lastTickTime: number;
  averageTickDuration: number;
  memoryUsage: number;
}

interface CleanupFunction {
  (): void;
}

export const useOptimizedUnifiedGameLoop = () => {
  const { gameState, dispatch } = useGame();
  
  // Batching system para optimizar state updates
  const batcher = useBatchedGameLoop(dispatch);

  // Refs para state management y cleanup
  const gameStateRef = useRef<GameState>(gameState);
  const intervalRef = useRef<number | undefined>(undefined);
  const cleanupFunctions = useRef<CleanupFunction[]>([]);
  const loopStatsRef = useRef<LoopStats>({
    totalTicks: 0,
    autopoiesisTicks: 0,
    movementTicks: 0,
    clockTicks: 0,
    lastTickTime: Date.now(),
    averageTickDuration: 0,
    memoryUsage: 0
  });

  // Update game state ref when state changes
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // === UTILITY FUNCTIONS ===
  
  // Registrar función de cleanup para evitar memory leaks
  const registerCleanup = useCallback((cleanupFn: CleanupFunction) => {
    cleanupFunctions.current.push(cleanupFn);
  }, []);

  // Calcula el mood optimizado en base a stats y resonancia
  const calculateOptimizedMood = useCallback((stats: Entity['stats'], resonance: number): EntityMood => {
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
  }, []);

  // Maneja transiciones de estado basadas en la resonancia del vínculo
  const updateResonanceStates = useCallback(
    (entities: Entity[], resonanceLevel: number, nowMs: number) => {
      for (const entity of entities) {
        if (resonanceLevel <= 0) {
          if (entity.state !== 'FADING') {
            batcher.batchEntityStateUpdate(entity.id, 'FADING', 'CRITICAL');
          } else if (nowMs - entity.lastStateChange > FADING_TIMEOUT_MS) {
            dispatch({ type: 'KILL_ENTITY', payload: { entityId: entity.id } });
          }
        } else if (entity.state === 'FADING') {
          if (resonanceLevel > FADING_RECOVERY_THRESHOLD) {
            batcher.batchEntityStateUpdate(entity.id, 'IDLE', 'CRITICAL');
          }
        } else if (resonanceLevel < RESONANCE_THRESHOLDS.CRITICAL) {
          if (entity.state !== 'LOW_RESONANCE') {
            batcher.batchEntityStateUpdate(entity.id, 'LOW_RESONANCE', 'HIGH');
          }
        } else if (entity.state === 'LOW_RESONANCE') {
          batcher.batchEntityStateUpdate(entity.id, 'IDLE', 'HIGH');
        }
      }
    }, [batcher, dispatch]);

  // === MAIN GAME LOOP ===
  useEffect(() => {
    const { gameClockInterval } = getGameIntervals();
    
    console.log('🚀 Iniciando Unified Game Loop Optimizado:', {
      interval: gameClockInterval,
      batchingEnabled: true,
      loggerOptimized: true
    });

    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const loopStats = loopStatsRef.current;
      const deltaTime = now - loopStats.lastTickTime;
      
      // Throttling de performance - skip si el frame es muy rápido
      if (deltaTime < gameClockInterval * 0.8) return;
      
      const tickStartTime = performance.now();
      loopStats.lastTickTime = now;
      loopStats.totalTicks++;

      measureExecutionTime('optimized-unified-game-loop', () => {
        // Ejecutar tick base - DESPACHAR TICK para incrementar cycles
        dispatch({ type: 'TICK', payload: deltaTime });
        loopStats.clockTicks++;
        
        const livingEntities = gameStateRef.current.entities.filter(entity => !entity.isDead);

        // Estados por resonancia
        updateResonanceStates(
          livingEntities,
          gameStateRef.current.resonance,
          now
        );
        
        // Actualizar stats de autopoiesis (con throttling)
        if (shouldUpdateAutopoiesis() && livingEntities.length > 0) {
          loopStats.autopoiesisTicks++;
          
          measureExecutionTime('autopoiesis-system-optimized', () => {
            for (const entity of livingEntities) {
              // Aplicar decay híbrido
              const newStats = applyHybridDecay(
                entity.stats, 
                entity.activity, 
                deltaTime
              );
              
              // Aplicar efectos de actividad
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

                // Aplicar costos si existen
                if (effects.cost) {
                  Object.entries(effects.cost).forEach(([k, cost]) => {
                    const key = k as keyof Entity['stats'];
                    if (key === 'money') {
                      const next = (statsAfterActivity[key] as number) - cost * dtMin;
                      statsAfterActivity[key] = Math.max(0, next) as number;
                    }
                  });
                }

                // Aplicar efectos inmediatos una sola vez
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
                optimizedDynamicsLogger.logStatsCritical(entity.id, criticalStats, finalStats);
              }
              
              // Batch update stats si hay cambios significativos
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
                
                batcher.batchEntityStatsUpdate(entity.id, statChanges, 'MEDIUM');
              }
              
              // Actualizar mood usando batching
              const newMood = calculateOptimizedMood(finalStats, gameStateRef.current.resonance);
              if (newMood !== entity.mood) {
                optimizedDynamicsLogger.logMoodChange(entity.id, entity.mood, newMood, finalStats);
                batcher.batchEntityMoodUpdate(entity.id, newMood, 'MEDIUM');
              }
            }
          });
        }
        
        // Verificar salud (cada 4 ticks)
        if (loopStats.totalTicks % 4 === 0) {
          measureExecutionTime('health-check-optimized', () => {
            for (const entity of livingEntities) {
              const criticalCount = [
                entity.stats.hunger < 5,
                entity.stats.sleepiness < 5,
                entity.stats.loneliness < 5,
                entity.stats.energy < 5
              ].filter(Boolean).length;

              // Recuperación sujeta a resonancia
              let healthChange = (deltaTime / 1000) * (HEALTH_CONFIG.RECOVERY_RATE + (gameStateRef.current.resonance - 50) / 1000);

              if (criticalCount > 0) {
                const decay = criticalCount * HEALTH_CONFIG.DECAY_PER_CRITICAL * (deltaTime / 1000);
                healthChange = -decay;
              }

              const newHealth = Math.max(0, Math.min(100, entity.stats.health + healthChange));

              if (Math.abs(newHealth - entity.stats.health) > 0.01) {
                batcher.batchEntityStatsUpdate(entity.id, { health: newHealth }, 'HIGH');
              }

              if (newHealth <= 0) {
                optimizedDynamicsLogger.logEntityDeath(entity.id, 'estadísticas críticas', entity.stats);
                dispatch({ type: 'KILL_ENTITY', payload: { entityId: entity.id } });
                logGeneral.warn(`Entidad murió: ${entity.id}`, { stats: entity.stats });
              } else if (Math.abs(newHealth - entity.stats.health) > 1) {
                const factors = [];
                if (criticalCount > 0) factors.push(`${criticalCount} stats críticas`);
                else factors.push('recuperación natural');
                optimizedDynamicsLogger.logHealthChange(entity.id, entity.stats.health, newHealth, factors);
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

          // Constantes del modelo unificado
          const BOND_DISTANCE = 80;
          const dtSec = deltaTime / 1000;
          const BOND_GAIN_PER_SEC = 1.8;
          const SEPARATION_DECAY_PER_SEC = 0.2;
          const STRESS_DECAY_PER_SEC = 0.3;
          const DISTANCE_SCALE = 30;
          const JOINT_BONUS_UNIT = 0.3;

          // Factor de cercanía usando sigmoide
          const closeness = 1 / (1 + Math.exp((distance - BOND_DISTANCE) / Math.max(1, DISTANCE_SCALE)));

          // Tiempo juntos si hay suficiente cercanía
          if (closeness > 0.6) {
            dispatch({
              type: 'UPDATE_TOGETHER_TIME',
              payload: gameStateRef.current.togetherTime + gameClockInterval
            });
          }

          // Factor de humor
          const avg1 = (entity1.stats.happiness + entity1.stats.energy) / 2;
          const avg2 = (entity2.stats.happiness + entity2.stats.energy) / 2;
          const moodBonus = 1 + 0.4 * ((avg1 + avg2 - 100) / 100);

          // Bonus por actividades/zonas conjuntas
          const sameActivity = entity1.activity === entity2.activity;
          const zone1 = getEntityZone(entity1.position, gameStateRef.current.zones);
          const zone2 = getEntityZone(entity2.position, gameStateRef.current.zones);
          const sameSocialZone = zone1 && zone2 && zone1.id === zone2.id && (zone1.type === 'social' || zone1.type === 'comfort');
          const synergy = 1 + JOINT_BONUS_UNIT * ((sameActivity ? 1 : 0) + (sameSocialZone ? 1 : 0));

          // Estrés por stats críticas
          const critical1 = (entity1.stats.hunger < 15 || entity1.stats.sleepiness < 15 || entity1.stats.loneliness < 15 || entity1.stats.energy < 15);
          const critical2 = (entity2.stats.hunger < 15 || entity2.stats.sleepiness < 15 || entity2.stats.loneliness < 15 || entity2.stats.energy < 15);
          const stressCount = (critical1 ? 1 : 0) + (critical2 ? 1 : 0);

          // Ecuación unificada de resonancia
          const R = gameStateRef.current.resonance;
          const gain = BOND_GAIN_PER_SEC * closeness * moodBonus * synergy * (1 - R / 100);
          const sep = SEPARATION_DECAY_PER_SEC * (1 - closeness) * (R / 100);
          const stress = STRESS_DECAY_PER_SEC * stressCount * (R / 100);
          const dR = dtSec * (gain - sep - stress);
          const newResonance = Math.max(0, Math.min(100, R + dR));

          if (Math.abs(newResonance - R) > 0.001) {
            optimizedDynamicsLogger.logResonanceChange(
              R,
              newResonance,
              'modelo unificado de resonancia',
              [entity1, entity2]
            );
            batcher.batchResonanceUpdate(newResonance, 'HIGH');

            // Log proximity effects (throttled)
            if (closeness > 0.6) {
              optimizedDynamicsLogger.logProximityEffect([entity1, entity2], distance, 'BONDING');
            } else if (closeness < 0.2) {
              optimizedDynamicsLogger.logProximityEffect([entity1, entity2], distance, 'SEPARATION');
            }
          }
        }
        
        // Tomar snapshots regulares (cada 50 ticks)
        if (loopStats.totalTicks % 50 === 0) {
          livingEntities.forEach(entity => {
            optimizedDynamicsLogger.takeEntitySnapshot(entity);
          });
          
          optimizedDynamicsLogger.takeSystemSnapshot(
            gameStateRef.current.resonance,
            gameStateRef.current.togetherTime,
            gameStateRef.current.cycles,
            gameStateRef.current.entities
          );
        }
      });

      // Update performance stats
      const tickDuration = performance.now() - tickStartTime;
      loopStats.averageTickDuration = (loopStats.averageTickDuration * (loopStats.totalTicks - 1) + tickDuration) / loopStats.totalTicks;
      
      // Monitor memory usage from logger
      if (loopStats.totalTicks % 100 === 0) {
        const memoryStats = optimizedDynamicsLogger.getCurrentMemoryStats();
        loopStats.memoryUsage = memoryStats.totalMemoryMB;
        
        if (gameConfig.debugMode) {
          logGeneral.info('Optimized Loop Stats', {
            totalTicks: loopStats.totalTicks,
            autopoiesisTicks: loopStats.autopoiesisTicks,
            avgTickDuration: `${loopStats.averageTickDuration.toFixed(2)}ms`,
            loggerMemory: `${memoryStats.totalMemoryMB.toFixed(2)}MB`,
            batchingStats: batcher.performanceStats
          });
        }
      }
      
      // Force flush batched updates if we have a lot pending
      if (batcher.pendingUpdatesCount > 20) {
        batcher.forceFlush();
      }
      
    }, gameClockInterval);

    // Register cleanup function
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
    registerCleanup(cleanup);

    return cleanup;
  }, [
    dispatch,
    updateResonanceStates,
    calculateOptimizedMood,
    batcher,
    registerCleanup
  ]);

  // === CLEANUP EFFECT ===
  useEffect(() => {
    return () => {
      console.log('🧹 Limpiando Unified Game Loop Optimizado...');
      
      // Execute all registered cleanup functions
      cleanupFunctions.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      });
      cleanupFunctions.current = [];
      
      // Clear main interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      
      // Force flush any pending batched updates
      batcher.forceFlush();
      
      // Final cleanup of logger
      optimizedDynamicsLogger.forceCleanup();
      
      console.log('✅ Cleanup completado');
    };
  }, [batcher]);

  return {
    stats: loopStatsRef.current,
    memoryStats: optimizedDynamicsLogger.getCurrentMemoryStats(),
    batchingStats: batcher.performanceStats,
    forceFlush: batcher.forceFlush,
    registerCleanup
  };
};
