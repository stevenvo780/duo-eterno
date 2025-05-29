import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getRandomDialogue } from '../utils/dialogues';

export const useGameClock = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      dispatch({ type: 'TICK' });

      // Check for entity death based on critical stats
      gameState.entities.forEach(entity => {
        if (!entity.isDead) {
          const criticalStats = entity.stats.hunger > 95 || 
                               entity.stats.sleepiness > 95 || 
                               entity.stats.loneliness > 95;
          
          if (criticalStats && Math.random() < 0.02) { // 2% chance per tick when critical
            dispatch({ type: 'KILL_ENTITY', payload: { entityId: entity.id } });
            dispatch({
              type: 'SHOW_DIALOGUE',
              payload: { 
                message: "No pude resistir más... mi esencia se desvanece...", 
                speaker: entity.id as 'circle' | 'square',
                duration: 5000 
              }
            });
          }
        }
      });

      // Check if relationship should break (both entities neglected)
      const bothEntitiesCritical = gameState.entities.every(entity => 
        !entity.isDead && (entity.stats.loneliness > 90 || entity.stats.happiness < 10)
      );
      
      if (bothEntitiesCritical && gameState.resonance < 5 && Math.random() < 0.01) {
        dispatch({ type: 'BREAK_RELATIONSHIP' });
        dispatch({
          type: 'SHOW_DIALOGUE',
          payload: { 
            message: "El vínculo se ha roto... Nos perdemos en la eternidad...", 
            duration: 6000 
          }
        });
        return;
      }

      // Check entity states based on resonance (only for living entities)
      gameState.entities.forEach(entity => {
        if (entity.isDead) return;
        
        if (gameState.resonance === 0 && entity.state !== 'FADING') {
          dispatch({ 
            type: 'UPDATE_ENTITY_STATE', 
            payload: { entityId: entity.id, state: 'FADING' } 
          });
        } else if (gameState.resonance < 25 && entity.state !== 'LOW_RESONANCE' && entity.state !== 'FADING') {
          dispatch({ 
            type: 'UPDATE_ENTITY_STATE', 
            payload: { entityId: entity.id, state: 'LOW_RESONANCE' } 
          });
          
          // Show low resonance dialogue occasionally
          if (Math.random() < 0.1) {
            dispatch({
              type: 'SHOW_DIALOGUE',
              payload: { message: getRandomDialogue('low-resonance') }
            });
          }
        } else if (gameState.resonance < 50 && entity.state === 'IDLE') {
          dispatch({ 
            type: 'UPDATE_ENTITY_STATE', 
            payload: { entityId: entity.id, state: 'SEEKING' } 
          });
        } else if (gameState.resonance >= 50 && entity.state === 'SEEKING') {
          dispatch({ 
            type: 'UPDATE_ENTITY_STATE', 
            payload: { entityId: entity.id, state: 'IDLE' } 
          });
        }
      });

      // Check if entities are together for auto-sustain (only living entities)
      const livingEntities = gameState.entities.filter(e => !e.isDead);
      if (livingEntities.length === 2) {
        const [entity1, entity2] = livingEntities;
        const distance = Math.sqrt(
          Math.pow(entity1.position.x - entity2.position.x, 2) + 
          Math.pow(entity1.position.y - entity2.position.y, 2)
        );

        if (distance < 40) { // Close together
          const newTogetherTime = gameState.togetherTime + 1000;
          dispatch({ type: 'UPDATE_TOGETHER_TIME', payload: newTogetherTime });

          if (newTogetherTime >= 5000 && gameState.resonance < 100) { // 5 seconds together
            dispatch({ type: 'UPDATE_RESONANCE', payload: gameState.resonance + 5 });
            dispatch({ type: 'UPDATE_TOGETHER_TIME', payload: 0 });
            
            // Show autonomous encounter dialogue
            if (Math.random() < 0.3) {
              dispatch({
                type: 'SHOW_DIALOGUE',
                payload: { message: getRandomDialogue('autonomous-encounter') }
              });
            }
          }
        } else {
          dispatch({ type: 'UPDATE_TOGETHER_TIME', payload: 0 });
        }
      }

    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, dispatch]);
};
