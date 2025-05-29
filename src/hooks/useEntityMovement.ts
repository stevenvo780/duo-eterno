import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getAttractionTarget, checkCollisionWithObstacles } from '../utils/mapGeneration';

export const useEntityMovement = () => {
  const { gameState, dispatch } = useGame();
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const updateMovement = () => {
      gameState.entities.forEach(entity => {
        // Dead entities don't move
        if (entity.isDead || entity.state === 'DEAD') return;
        
        const newPosition = { ...entity.position };
        let speed = 0.8; // Base speed
        
        // Check distance to companion for loneliness-based behavior
        const companion = gameState.entities.find(e => e.id !== entity.id && !e.isDead);
        const companionDistance = companion ? Math.sqrt(
          Math.pow(entity.position.x - companion.position.x, 2) +
          Math.pow(entity.position.y - companion.position.y, 2)
        ) : Infinity;
        
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
          // Activity-based movement patterns
          switch (entity.activity) {
            case 'EXPLORING': {
              // Entities in exploring mode move more actively toward zones
              const target = getAttractionTarget(entity.stats, gameState.zones || [], entity.position);
              if (target) {
                const dx = target.x - entity.position.x;
                const dy = target.y - entity.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 50) {
                  speed = 1.2; // Faster when exploring
                  newPosition.x += (dx / distance) * speed;
                  newPosition.y += (dy / distance) * speed;
                }
              } else {
                // Random exploration
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 3;
                newPosition.x += Math.cos(angle) * distance;
                newPosition.y += Math.sin(angle) * distance;
              }
              break;
            }

            case 'SOCIALIZING': {
              // Move towards the other entity
              const otherEntity = gameState.entities.find(e => e.id !== entity.id);
              if (otherEntity && !otherEntity.isDead) {
                const dx = otherEntity.position.x - entity.position.x;
                const dy = otherEntity.position.y - entity.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 60) {
                  speed = 1.0;
                  newPosition.x += (dx / distance) * speed;
                  newPosition.y += (dy / distance) * speed;
                }
              }
              break;
            }

            case 'WANDERING': {
              // Enhanced wandering with more varied movement
              if (Math.random() < 0.02) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 4 + 1; // 1-5 pixels
                newPosition.x += Math.cos(angle) * distance;
                newPosition.y += Math.sin(angle) * distance;
              }
              break;
            }

            case 'RESTING': {
              // Very slow, minimal movement when resting
              if (Math.random() < 0.005) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 1;
                newPosition.x += Math.cos(angle) * distance;
                newPosition.y += (Math.sin(angle) * distance);
              }
              break;
            }

            case 'HIDING': {
              // Move away from other entities when hiding
              const otherEntity = gameState.entities.find(e => e.id !== entity.id);
              if (otherEntity && !otherEntity.isDead) {
                const dx = entity.position.x - otherEntity.position.x;
                const dy = entity.position.y - otherEntity.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                  speed = 0.8;
                  newPosition.x += (dx / distance) * speed;
                  newPosition.y += (dy / distance) * speed;
                }
              }
              break;
            }

            default: {
              // Default movement based on state
              switch (entity.state) {
                case 'SEEKING': {
                  const otherEntity = gameState.entities.find(e => e.id !== entity.id);
                  if (otherEntity && !otherEntity.isDead) {
                    const dx = otherEntity.position.x - entity.position.x;
                    const dy = otherEntity.position.y - entity.position.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 40) {
                      newPosition.x += (dx / distance) * speed;
                      newPosition.y += (dy / distance) * speed;
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
                  // Random movement when resonance > 75%
                  if (gameState.resonance > 75 && Math.random() < 0.015) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 2;
                    newPosition.x += Math.cos(angle) * distance;
                    newPosition.y += Math.sin(angle) * distance;
                  }
                  break;
                }

                default: {
                  // Gentle wandering for other states
                  if (Math.random() < 0.01) {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 1;
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

        // Check for collisions with obstacles
        if (gameState.mapElements && checkCollisionWithObstacles(newPosition, 16, gameState.mapElements)) {
          // Try alternative directions if blocked
          for (let attempts = 0; attempts < 8; attempts++) {
            const angle = (attempts * Math.PI) / 4;
            const testPosition = {
              x: entity.position.x + Math.cos(angle) * 2,
              y: entity.position.y + Math.sin(angle) * 2
            };
            
            if (!checkCollisionWithObstacles(testPosition, 16, gameState.mapElements)) {
              newPosition.x = testPosition.x;
              newPosition.y = testPosition.y;
              break;
            }
          }
        }

        // Expanded boundary constraints - entities can move further apart
        const canvasWidth = 800;
        const canvasHeight = 600;
        const margin = 20;
        
        newPosition.x = Math.max(margin, Math.min(canvasWidth - margin, newPosition.x));
        newPosition.y = Math.max(margin, Math.min(canvasHeight - margin, newPosition.y));

        // Update position if it changed
        if (newPosition.x !== entity.position.x || newPosition.y !== entity.position.y) {
          dispatch({
            type: 'UPDATE_ENTITY_POSITION',
            payload: { entityId: entity.id, position: newPosition }
          });
        }
      });

      animationRef.current = requestAnimationFrame(updateMovement);
    };

    animationRef.current = requestAnimationFrame(updateMovement);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.entities, gameState.resonance, gameState.zones, gameState.mapElements, dispatch]);
};