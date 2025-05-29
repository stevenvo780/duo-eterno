import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import { getAttractionTarget, checkCollisionWithObstacles } from '../utils/mapGeneration';

export const useEntityMovementOptimized = () => {
  const { gameState, dispatch } = useGame();
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0);
  const frameSkipCounter = useRef<number>(0);

  // Optimized movement calculation with reduced frequency
  const updateMovement = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastUpdateTime.current;
    
    // Limit movement updates to 30fps for better performance
    if (deltaTime < 33.33) {
      animationRef.current = requestAnimationFrame(updateMovement);
      return;
    }

    // Skip frames on low performance
    frameSkipCounter.current++;
    if (frameSkipCounter.current % 2 === 0 && deltaTime < 50) {
      animationRef.current = requestAnimationFrame(updateMovement);
      return;
    }

    lastUpdateTime.current = now;

    // Pre-calculate common values
    const livingEntities = gameState.entities.filter(entity => !entity.isDead && entity.state !== 'DEAD');
    if (livingEntities.length === 0) {
      animationRef.current = requestAnimationFrame(updateMovement);
      return;
    }

    const canvasWidth = 800;
    const canvasHeight = 600;
    const margin = 20;

    for (const entity of livingEntities) {
      const newPosition = { ...entity.position };
      let speed = 0.8; // Base speed
      
      // Find companion efficiently
      const companion = livingEntities.find(e => e.id !== entity.id);
      let companionDistance = Infinity;
      
      if (companion) {
        const dx = entity.position.x - companion.position.x;
        const dy = entity.position.y - companion.position.y;
        companionDistance = Math.sqrt(dx * dx + dy * dy);
      }
      
      // PRIORITY 1: Seek companion if lonely or far apart
      if (companion && (entity.stats.loneliness > 60 || companionDistance > 150)) {
        const dx = companion.position.x - entity.position.x;
        const dy = companion.position.y - entity.position.y;
        
        // Increase speed based on loneliness urgency
        const urgency = Math.min(2.5, 1 + (entity.stats.loneliness / 100));
        speed = speed * urgency;
        
        newPosition.x += (dx / companionDistance) * speed;
        newPosition.y += (dy / companionDistance) * speed;
        
        // Change activity to socializing when seeking companion
        if (entity.activity !== 'SOCIALIZING') {
          dispatch({
            type: 'UPDATE_ENTITY_ACTIVITY',
            payload: { entityId: entity.id, activity: 'SOCIALIZING' }
          });
        }
      }
      // PRIORITY 2: Normal activity-based movement when not seeking companion
      else {
        // Activity-based movement patterns (optimized)
        switch (entity.activity) {
          case 'EXPLORING': {
            // Use cached attraction target calculation
            const target = getAttractionTarget(entity.stats, gameState.zones || [], entity.position);
            if (target) {
              const dx = target.x - entity.position.x;
              const dy = target.y - entity.position.y;
              const distanceSquared = dx * dx + dy * dy;
              
              if (distanceSquared > 2500) { // 50^2, avoid sqrt
                const distance = Math.sqrt(distanceSquared);
                speed = 1.2; // Faster when exploring
                newPosition.x += (dx / distance) * speed;
                newPosition.y += (dy / distance) * speed;
              }
            } else {
              // Random exploration (reduced frequency)
              if (Math.random() < 0.1) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 2 + 1;
                newPosition.x += Math.cos(angle) * distance;
                newPosition.y += Math.sin(angle) * distance;
              }
            }
            break;
          }

          case 'SOCIALIZING': {
            // Move towards the other entity
            if (companion) {
              const dx = companion.position.x - entity.position.x;
              const dy = companion.position.y - entity.position.y;
              
              if (companionDistance > 60) {
                speed = 1.0;
                newPosition.x += (dx / companionDistance) * speed;
                newPosition.y += (dy / companionDistance) * speed;
              }
            }
            break;
          }

          case 'WANDERING': {
            // Reduced frequency wandering
            if (Math.random() < 0.01) {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 3 + 1;
              newPosition.x += Math.cos(angle) * distance;
              newPosition.y += Math.sin(angle) * distance;
            }
            break;
          }

          case 'RESTING': {
            // Very minimal movement when resting
            if (Math.random() < 0.003) {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 0.5;
              newPosition.x += Math.cos(angle) * distance;
              newPosition.y += Math.sin(angle) * distance;
            }
            break;
          }

          case 'HIDING': {
            // Move away from other entities when hiding
            if (companion) {
              const dx = entity.position.x - companion.position.x;
              const dy = entity.position.y - companion.position.y;
              
              if (companionDistance < 150) {
                speed = 0.8;
                newPosition.x += (dx / companionDistance) * speed;
                newPosition.y += (dy / companionDistance) * speed;
              }
            }
            break;
          }

          default: {
            // Default movement based on state (simplified)
            switch (entity.state) {
              case 'SEEKING': {
                if (companion) {
                  const dx = companion.position.x - entity.position.x;
                  const dy = companion.position.y - entity.position.y;
                  
                  if (companionDistance > 40) {
                    newPosition.x += (dx / companionDistance) * speed;
                    newPosition.y += (dy / companionDistance) * speed;
                  } else {
                    dispatch({ 
                      type: 'UPDATE_ENTITY_STATE', 
                      payload: { entityId: entity.id, state: 'IDLE' } 
                    });
                  }
                }
                break;
              }

              case 'IDLE': {
                // Reduced frequency random movement
                if (gameState.resonance > 75 && Math.random() < 0.008) {
                  const angle = Math.random() * Math.PI * 2;
                  const distance = Math.random() * 1.5;
                  newPosition.x += Math.cos(angle) * distance;
                  newPosition.y += Math.sin(angle) * distance;
                }
                break;
              }

              default: {
                // Very gentle wandering for other states
                if (Math.random() < 0.005) {
                  const angle = Math.random() * Math.PI * 2;
                  const distance = Math.random() * 0.8;
                  newPosition.x += Math.cos(angle) * distance;
                  newPosition.y += Math.sin(angle) * distance;
                }
                break;
              }
            }
            break;
          }
        }
      }

      // Optimized collision checking (only if position changed significantly)
      const positionChanged = Math.abs(newPosition.x - entity.position.x) > 0.1 || 
                             Math.abs(newPosition.y - entity.position.y) > 0.1;

      if (positionChanged && gameState.mapElements && 
          checkCollisionWithObstacles(newPosition, 16, gameState.mapElements)) {
        // Simplified alternative direction finding
        const angles = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4];
        let foundAlternative = false;
        
        for (const angle of angles) {
          const testPosition = {
            x: entity.position.x + Math.cos(angle) * 2,
            y: entity.position.y + Math.sin(angle) * 2
          };
          
          if (!checkCollisionWithObstacles(testPosition, 16, gameState.mapElements)) {
            newPosition.x = testPosition.x;
            newPosition.y = testPosition.y;
            foundAlternative = true;
            break;
          }
        }
        
        // If no alternative found, don't move
        if (!foundAlternative) {
          newPosition.x = entity.position.x;
          newPosition.y = entity.position.y;
        }
      }

      // Boundary constraints
      newPosition.x = Math.max(margin, Math.min(canvasWidth - margin, newPosition.x));
      newPosition.y = Math.max(margin, Math.min(canvasHeight - margin, newPosition.y));

      // Update position only if it changed meaningfully
      if (Math.abs(newPosition.x - entity.position.x) > 0.1 || 
          Math.abs(newPosition.y - entity.position.y) > 0.1) {
        dispatch({
          type: 'UPDATE_ENTITY_POSITION',
          payload: { entityId: entity.id, position: newPosition }
        });
      }
    }

    animationRef.current = requestAnimationFrame(updateMovement);
  }, [gameState.entities, gameState.resonance, gameState.zones, gameState.mapElements, dispatch]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(updateMovement);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateMovement]);
};
