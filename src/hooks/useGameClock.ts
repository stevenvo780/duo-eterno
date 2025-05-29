import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { gameConfig, getGameIntervals } from '../config/gameConfig';

export const useGameClock = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastTickTime = useRef<number>(Date.now());
  const tickCounter = useRef<number>(0);

  useEffect(() => {
    const { gameClockInterval } = getGameIntervals();
    
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastTickTime.current;
      
      // Throttling simplificado
      if (deltaTime < gameClockInterval * 0.8) return;
      
      lastTickTime.current = now;
      tickCounter.current++;

      dispatch({ type: 'TICK' });

      // Verificar muerte de entidades (cada 4 ticks)
      if (tickCounter.current % 4 === 0) {
        for (const entity of gameState.entities) {
          if (!entity.isDead) {
            // Criterios de muerte más estrictos
            const criticalStats = [
              entity.stats.hunger > 95,
              entity.stats.sleepiness > 95,
              entity.stats.loneliness > 95,
              entity.stats.energy < 5
            ];
            
            const criticalCount = criticalStats.filter(Boolean).length;
            const resonanceIsCritical = gameState.resonance < 10;
            
            let deathProbability = 0;
            if (criticalCount >= 2) {
              deathProbability = 0.15; // 15% si tiene 2+ stats críticos
            } else if (criticalCount === 1 && resonanceIsCritical) {
              deathProbability = 0.08; // 8% si tiene 1 stat crítico y vínculo roto
            } else if (criticalCount === 1) {
              deathProbability = 0.03; // 3% si solo tiene 1 stat crítico
            }
            
            // Aplicar multiplicador de velocidad
            deathProbability *= gameConfig.criticalEventProbability * gameConfig.gameSpeedMultiplier;
            
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
        const livingEntities = gameState.entities.filter(e => !e.isDead);
        
        if (livingEntities.length === 2) {
          const [entity1, entity2] = livingEntities;
          
          // Calcular factores de ruptura
          const avgLoneliness = (entity1.stats.loneliness + entity2.stats.loneliness) / 2;
          const avgHappiness = (entity1.stats.happiness + entity2.stats.happiness) / 2;
          const bothCritical = entity1.stats.loneliness > 90 && entity2.stats.loneliness > 90;
          const veryUnhappy = avgHappiness < 15;
          const resonanceDestroyed = gameState.resonance < 5;
          
          // Probabilidad de ruptura
          let breakProbability = 0;
          if (bothCritical && resonanceDestroyed) {
            breakProbability = 0.25; // 25% si ambos están solos y sin vínculo
          } else if (veryUnhappy && avgLoneliness > 85 && gameState.resonance < 15) {
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
        for (const entity of gameState.entities) {
          if (!entity.isDead) {
            let newState = entity.state;
            
            // Simplified state logic
            if (gameState.resonance < 20) {
              newState = 'FADING';
            } else if (gameState.resonance < 50) {
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
        const deadEntities = gameState.entities.filter(e => e.isDead);
        const livingEntities = gameState.entities.filter(e => !e.isDead);
        
        if (deadEntities.length > 0 && livingEntities.length > 0) {
          const livingEntity = livingEntities[0];
          
          // Revival solo si las condiciones son muy buenas
          const livingIsHealthy = Object.values(livingEntity.stats).every(stat => 
            stat < 70 || (stat > 30 && (stat === livingEntity.stats.happiness || stat === livingEntity.stats.energy))
          );
          const strongBond = gameState.resonance > 85;
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

      // Actualizar tiempo juntos cuando están cerca
      if (gameState.entities.length === 2 && tickCounter.current % 2 === 0) {
        const [entity1, entity2] = gameState.entities;
        if (!entity1.isDead && !entity2.isDead) {
          const distance = Math.sqrt(
            Math.pow(entity1.position.x - entity2.position.x, 2) +
            Math.pow(entity1.position.y - entity2.position.y, 2)
          );
          
          if (distance < 80) {
            dispatch({ 
              type: 'UPDATE_TOGETHER_TIME', 
              payload: gameState.togetherTime + gameClockInterval 
            });
            
            // Bonus de vínculo cuando están juntos
            if (tickCounter.current % 8 === 0) {
              const bondBonus = Math.min(2, 60 / distance) * gameConfig.gameSpeedMultiplier;
              dispatch({ 
                type: 'UPDATE_RESONANCE', 
                payload: Math.min(100, gameState.resonance + bondBonus) 
              });
            }
          }
        }
      }

      // Auto-save game state less frequently
      if (tickCounter.current % 20 === 0) { // Save every 20th tick
        try {
          localStorage.setItem('duoEternoState', JSON.stringify({
            ...gameState,
            lastSave: now
          }));
        } catch (error) {
          console.warn('Failed to auto-save:', error);
        }
      }

    }, gameClockInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, dispatch]);
};
