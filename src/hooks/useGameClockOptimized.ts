import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getRandomDialogue } from '../utils/dialogues';
import { gameConfig } from '../config/gameConfig';

export const useGameClockOptimized = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastTickTime = useRef<number>(Date.now());
  const tickCounter = useRef<number>(0);

  useEffect(() => {
    // Optimize game clock to run at configurable interval
    const interval = gameConfig.gameClockInterval / gameConfig.gameSpeedMultiplier;
    
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastTickTime.current;
      
      // Skip tick if not enough time has passed (throttling)
      const minInterval = Math.max(100, interval * 0.8); // Minimum interval
      if (deltaTime < minInterval) return;
      
      lastTickTime.current = now;
      tickCounter.current++;

      dispatch({ type: 'TICK' });

      // Check for entity death based on critical stats (reduced frequency)
      if (tickCounter.current % 3 === 0) { // Check every 3rd tick
        for (const entity of gameState.entities) {
          if (!entity.isDead) {
            const criticalStats = entity.stats.hunger > 95 || 
                                 entity.stats.sleepiness > 95 || 
                                 entity.stats.loneliness > 95;
            
            if (criticalStats && Math.random() < (gameConfig.criticalEventProbability * gameConfig.gameSpeedMultiplier)) {
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
        }
      }

      // Check if relationship should break (reduced frequency)
      if (tickCounter.current % 5 === 0) { // Check every 5th tick
        const livingEntities = gameState.entities.filter(e => !e.isDead);
        const bothEntitiesCritical = livingEntities.length > 0 && livingEntities.every(entity => 
          entity.stats.loneliness > 90 || entity.stats.happiness < 10
        );
        
        if (bothEntitiesCritical && gameState.resonance < 5 && Math.random() < 0.008) {
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

      // Check for revival opportunities (even less frequent)
      if (tickCounter.current % 10 === 0) { // Check every 10th tick
        const deadEntities = gameState.entities.filter(e => e.isDead);
        const livingEntities = gameState.entities.filter(e => !e.isDead);
        
        if (deadEntities.length > 0 && livingEntities.length > 0 && 
            gameState.resonance > 80 && Math.random() < 0.03) {
          const deadEntity = deadEntities[0];
          dispatch({ type: 'REVIVE_ENTITY', payload: { entityId: deadEntity.id } });
          dispatch({
            type: 'SHOW_DIALOGUE',
            payload: { 
              message: "El amor me trae de vuelta... Siento la calidez del vínculo otra vez.", 
              speaker: deadEntity.id as 'circle' | 'square',
              duration: 4000 
            }
          });
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

    }, 500); // 500ms interval for better performance (was 1000ms)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, dispatch]);
};
