import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { gameConfig, getGameIntervals } from '../config/gameConfig';
import { useUpgrades } from './useUpgrades';
import { 
  createUpgradeEffectsContext,
  applyUpgradeToSurvivalRate,
  applyUpgradeToResonanceGain,
  applyUpgradeToMoneyGeneration,
  getAutoActivityChance
} from '../utils/upgradeEffects';
import { logStorage } from '../utils/logger';
import { ACTIVITY_DYNAMICS } from '../utils/activityDynamics';
import type { EntityActivity, GameState } from '../types';

export const useGameClock = () => {
  const { gameState, dispatch } = useGame();
  const { getUpgradeEffect } = useUpgrades();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastTickTime = useRef<number>(Date.now());
  const tickCounter = useRef<number>(0);
  const gameStateRef = useRef<GameState>(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const { gameClockInterval } = getGameIntervals();
    
    // Crear contexto de efectos de upgrades
    const upgradeEffects = createUpgradeEffectsContext(getUpgradeEffect);
    
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastTickTime.current;
      
      // Throttling optimizado para mejor rendimiento
      if (deltaTime < gameClockInterval * 0.8) return;
      
      lastTickTime.current = now;
      tickCounter.current++;

      dispatch({ type: 'TICK', payload: deltaTime });

      // === INGRESOS PASIVOS DE UPGRADES ===
      if (tickCounter.current % 6 === 0) { // Cada ~6 segundos (1/10 de minuto)
        const passiveIncome = applyUpgradeToMoneyGeneration(0, 'PASSIVE_INCOME', upgradeEffects);
        
        if (passiveIncome > 0) {
          // Aplicar ingresos pasivos a todas las entidades vivas
          gameStateRef.current.entities.forEach(entity => {
            if (!entity.isDead) {
              dispatch({
                type: 'UPDATE_ENTITY_STATS',
                payload: {
                  entityId: entity.id,
                  stats: { money: entity.stats.money + passiveIncome }
                }
              });
            }
          });
        }
      }

      // === AUTOMATIZACIÓN DE ACTIVIDADES ===
      if (tickCounter.current % 10 === 0) { // Cada ~10 segundos
        gameStateRef.current.entities.forEach(entity => {
          if (!entity.isDead) {
            // Lista de actividades que pueden automatizarse
            const autoActivities: EntityActivity[] = ['WORKING', 'COOKING', 'SHOPPING', 'EXERCISING'];
            
            for (const activity of autoActivities) {
              const autoChance = getAutoActivityChance(activity, upgradeEffects);
              
              if (autoChance > 0 && Math.random() < autoChance / 100) {
                // Ejecutar actividad automática por un período corto
                if (ACTIVITY_DYNAMICS[activity]) {
                  const activityResult = ACTIVITY_DYNAMICS[activity];
                  const effects = { ...activityResult.immediate };
                  
                  // Aplicar efectos inmediatos reducidos (50% para automatización)
                  Object.entries(effects).forEach(([stat, value]) => {
                    if (typeof value === 'number') {
                      effects[stat as keyof typeof effects] = value * 0.5;
                    }
                  });
                  
                  // Aplicar costos si hay
                  if (activityResult.cost?.money && entity.stats.money >= activityResult.cost.money) {
                    effects.money = -(activityResult.cost.money * 0.5); // Costo reducido
                  }
                  
                  // Aplicar ganancias si hay
                  if (activityResult.gain?.money) {
                    effects.money = (effects.money || 0) + (activityResult.gain.money * 0.3); // Ganancia reducida
                  }
                  
                  dispatch({
                    type: 'UPDATE_ENTITY_STATS',
                    payload: {
                      entityId: entity.id,
                      stats: effects
                    }
                  });
                  
                  // Mostrar mensaje ocasional
                  if (Math.random() < 0.3) {
                    const autoMessages: Record<EntityActivity, string> = {
                      'WORKING': '⚙️ Auto-trabajo: genero recursos mientras descanso...',
                      'COOKING': '🍳 Auto-cocina: mis habilidades culinarias se han automatizado...',
                      'SHOPPING': '🛒 Auto-compras: obtengo lo necesario automáticamente...',
                      'EXERCISING': '💪 Auto-ejercicio: mi cuerpo se mantiene en forma solo...',
                      'WANDERING': '',
                      'RESTING': '',
                      'SOCIALIZING': '',
                      'DANCING': '',
                      'EXPLORING': '',
                      'MEDITATING': '',
                      'CONTEMPLATING': '',
                      'WRITING': '',
                      'HIDING': ''
                    };
                    
                    if (autoMessages[activity]) {
                      dispatch({
                        type: 'SHOW_DIALOGUE',
                        payload: { 
                          message: autoMessages[activity],
                          speaker: entity.id as 'circle' | 'square',
                          duration: 2000 
                        }
                      });
                    }
                  }
                }
              }
            }
          }
        });
      }

      // Verificar muerte de entidades (cada 4 ticks) - CON MEJORAS DE SUPERVIVENCIA
      if (tickCounter.current % 4 === 0) {
        for (const entity of gameStateRef.current.entities) {
          if (!entity.isDead) {
            // Criterios de muerte más estrictos
            const criticalStats = [
              entity.stats.hunger > 95,
              entity.stats.sleepiness > 95,
              entity.stats.loneliness > 95,
              entity.stats.energy < 5
            ];
            
            const criticalCount = criticalStats.filter(Boolean).length;
            const resonanceIsCritical = gameStateRef.current.resonance < 10;
            
            let deathProbability = 0;
            if (criticalCount >= 2) {
              deathProbability = 0.12; // Reducido de 0.15 para mejor balance
            } else if (criticalCount === 1 && resonanceIsCritical) {
              deathProbability = 0.06; // Reducido de 0.08
            } else if (criticalCount === 1) {
              deathProbability = 0.02; // Reducido de 0.03
            }
            
            // Aplicar multiplicador de velocidad
            deathProbability *= gameConfig.criticalEventProbability * gameConfig.gameSpeedMultiplier;
            
            // APLICAR MEJORAS DE SUPERVIVENCIA DE UPGRADES
            deathProbability = applyUpgradeToSurvivalRate(deathProbability, upgradeEffects);
            
            if (deathProbability > 0 && Math.random() < deathProbability) {
              dispatch({ type: 'KILL_ENTITY', payload: { entityId: entity.id } });
              
              // Mensaje específico según la causa
              let deathMessage = "No pude resistir más...";
              if (entity.stats.hunger > 95) {
                deathMessage = "El hambre ha consumido mi esencia... me desvanezco...";
              } else if (entity.stats.sleepiness > 95) {
                deathMessage = "El cansancio eterno me lleva... no puedo más...";
              } else if (entity.stats.loneliness > 95) {
                deathMessage = "La soledad ha roto mi corazón... me pierdo en la nada...";
              } else if (entity.stats.energy < 5) {
                deathMessage = "Mis fuerzas se agotan... mi luz se extingue...";
              }
              
              dispatch({
                type: 'SHOW_DIALOGUE',
                payload: { 
                  message: deathMessage, 
                  speaker: entity.id as 'circle' | 'square',
                  duration: 5000 
                }
              });
            }
          }
        }
      }

      // Verificar ruptura de relación con criterios más específicos
      if (tickCounter.current % 6 === 0) {
        const livingEntities = gameStateRef.current.entities.filter(e => !e.isDead);
        
        if (livingEntities.length === 2) {
          const [entity1, entity2] = livingEntities;
          
          // Calcular factores de ruptura
          const avgLoneliness = (entity1.stats.loneliness + entity2.stats.loneliness) / 2;
          const avgHappiness = (entity1.stats.happiness + entity2.stats.happiness) / 2;
          const bothCritical = entity1.stats.loneliness > 90 && entity2.stats.loneliness > 90;
          const veryUnhappy = avgHappiness < 15;
          const resonanceDestroyed = gameStateRef.current.resonance < 5;
          
          // Probabilidad de ruptura
          let breakProbability = 0;
          if (bothCritical && resonanceDestroyed) {
            breakProbability = 0.25; // 25% si ambos están solos y sin vínculo
          } else if (veryUnhappy && avgLoneliness > 85 && gameStateRef.current.resonance < 15) {
            breakProbability = 0.12; // 12% si están muy infelices, solos y con poco vínculo
          }
          
          breakProbability *= gameConfig.gameSpeedMultiplier;
          
          if (breakProbability > 0 && Math.random() < breakProbability) {
            dispatch({ type: 'BREAK_RELATIONSHIP' });
            dispatch({
              type: 'SHOW_DIALOGUE',
              payload: { 
                message: "El dolor de la separación es insoportable... nuestro vínculo se rompe para siempre...", 
                duration: 6000 
              }
            });
            return;
          }
        }
      }

      // Check entity states based on resonance (reduced frequency and optimized)
      if (tickCounter.current % 4 === 0) { // Check every 4th tick
        for (const entity of gameStateRef.current.entities) {
          if (!entity.isDead) {
            let newState = entity.state;
            
            // Simplified state logic
            if (gameStateRef.current.resonance < 20) {
              newState = 'FADING';
            } else if (gameStateRef.current.resonance < 50) {
              newState = 'LOW_RESONANCE';
            } else if (entity.stats.loneliness > 70) {
              newState = 'SEEKING';
            } else {
              newState = 'IDLE';
            }
            
            // Only dispatch if state actually changed
            if (newState !== entity.state) {
              dispatch({ 
                type: 'UPDATE_ENTITY_STATE', 
                payload: { entityId: entity.id, state: newState } 
              });
            }
          }
        }
      }

      // Oportunidades de revival más específicas
      if (tickCounter.current % 12 === 0) {
        const deadEntities = gameStateRef.current.entities.filter(e => e.isDead);
        const livingEntities = gameStateRef.current.entities.filter(e => !e.isDead);
        
        if (deadEntities.length > 0 && livingEntities.length > 0) {
          const livingEntity = livingEntities[0];
          
          // Revival solo si las condiciones son muy buenas
          const livingIsHealthy = Object.values(livingEntity.stats).every(stat => 
            stat < 70 || (stat > 30 && (stat === livingEntity.stats.happiness || stat === livingEntity.stats.energy))
          );
          const strongBond = gameStateRef.current.resonance > 85;
          const revivalProbability = livingIsHealthy && strongBond ? 0.05 : 0.01;
          
          if (Math.random() < revivalProbability) {
            const deadEntity = deadEntities[0];
            dispatch({ type: 'REVIVE_ENTITY', payload: { entityId: deadEntity.id } });
            dispatch({
              type: 'SHOW_DIALOGUE',
              payload: { 
                message: "El amor verdadero me devuelve a la vida... siento tu fuerza fluyendo hacia mí...", 
                speaker: deadEntity.id as 'circle' | 'square',
                duration: 4000 
              }
            });
          }
        }
      }

      // Actualizar tiempo juntos cuando están cerca - CON BONUS DE RESONANCIA MEJORADO
      if (gameStateRef.current.entities.length === 2 && tickCounter.current % 2 === 0) {
        const [entity1, entity2] = gameStateRef.current.entities;
        if (!entity1.isDead && !entity2.isDead) {
          const distance = Math.sqrt(
            Math.pow(entity1.position.x - entity2.position.x, 2) +
            Math.pow(entity1.position.y - entity2.position.y, 2)
          );
          
          if (distance < 80) {
            dispatch({
              type: 'UPDATE_TOGETHER_TIME',
              payload: gameStateRef.current.togetherTime + gameClockInterval
            });
            
            // Bonus de vínculo cuando están juntos - CON MEJORAS DE UPGRADES
            if (tickCounter.current % 8 === 0) {
              let bondBonus = Math.min(2, 60 / distance) * gameConfig.gameSpeedMultiplier;
              
              // APLICAR BONUS DE RESONANCIA DE UPGRADES
              bondBonus = applyUpgradeToResonanceGain(bondBonus, upgradeEffects);
              
              dispatch({ 
                type: 'UPDATE_RESONANCE', 
                payload: Math.min(100, gameStateRef.current.resonance + bondBonus)
              });
            }
          }
        }
      }

      // === VERIFICACIÓN DE DESBLOQUEO DE UPGRADES ===
      if (tickCounter.current % 15 === 0) { // Cada ~15 segundos
        dispatch({ type: 'CHECK_UNLOCK_REQUIREMENTS' });
      }
      if (tickCounter.current % 20 === 0) { // Save every 20th tick
        try {
          localStorage.setItem('duoEternoState', JSON.stringify({
            ...gameStateRef.current,
            lastSave: now
          }));
        } catch (error) {
          logStorage.error('Error en auto-guardado', error);
        }
      }

    }, gameClockInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, getUpgradeEffect]);
};
