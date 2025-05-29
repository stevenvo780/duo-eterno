// Hook para comportamientos autónomos (autopoiesis)
import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import { getRandomDialogue } from '../utils/dialogues';
import { getRandomThought } from '../utils/interactions';
import type { EntityActivity, EntityMood, Entity } from '../types';

export const useAutopoiesis = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);

  const selectRandomActivity = useCallback((entity: Entity): EntityActivity => {
    const activities: EntityActivity[] = [
      'WANDERING', 'MEDITATING', 'WRITING', 'RESTING', 
      'CONTEMPLATING', 'EXPLORING', 'DANCING'
    ];

    // Actividades influenciadas por estadísticas
    if (entity.stats.energy < 30) {
      return Math.random() < 0.7 ? 'RESTING' : 'MEDITATING';
    }
    
    if (entity.stats.boredom > 70) {
      return Math.random() < 0.6 ? 'EXPLORING' : 'DANCING';
    }
    
    if (entity.stats.loneliness > 60) {
      return Math.random() < 0.5 ? 'WANDERING' : 'CONTEMPLATING';
    }

    if (entity.stats.happiness > 80) {
      return Math.random() < 0.4 ? 'DANCING' : 'WRITING';
    }

    return activities[Math.floor(Math.random() * activities.length)];
  }, []);

  const showActivityDialogue = useCallback((entityId: string, activity: EntityActivity) => {
    const dialogueMap: Record<EntityActivity, keyof typeof import('../utils/dialogues').dialogues> = {
      'MEDITATING': 'meditation',
      'WRITING': 'writing',
      'RESTING': 'tired',
      'WANDERING': 'lonely',
      'SOCIALIZING': 'happy',
      'EXPLORING': 'happy',
      'CONTEMPLATING': 'meditation',
      'DANCING': 'happy',
      'HIDING': 'lonely'
    };

    const dialogueType = dialogueMap[activity];
    if (dialogueType) {
      dispatch({
        type: 'SHOW_DIALOGUE',
        payload: {
          message: getRandomDialogue(dialogueType),
          speaker: entityId as 'circle' | 'square',
          duration: 2500
        }
      });
    }
  }, [dispatch]);

  const calculateMoodFromStats = useCallback((stats: Entity['stats']): EntityMood => {
    const { happiness, energy, loneliness, hunger, sleepiness, boredom } = stats;
    
    if (happiness > 80 && energy > 60) return 'HAPPY';
    if (happiness > 70 && boredom < 30) return 'CONTENT';
    if (energy < 30 || sleepiness > 70) return 'TIRED';
    if (loneliness > 60) return 'SAD';
    if (boredom > 70 || hunger > 70) return 'ANXIOUS';
    if (happiness > 60 && energy > 70) return 'EXCITED';
    if (energy > 40 && loneliness < 40) return 'CALM';
    
    return 'CONTENT';
  }, []);

  const applyStatDecay = useCallback((entityId: string) => {
    const decayRates = {
      hunger: 0.8,
      energy: 0.5,
      boredom: 1.2,
      loneliness: 0.3,
      sleepiness: 0.6,
      happiness: 0.2
    };

    const decayAmounts: Record<string, number> = {};
    Object.entries(decayRates).forEach(([stat, rate]) => {
      if (Math.random() < rate / 100) {
        decayAmounts[stat] = Math.random() * 2 + 0.5; // 0.5-2.5 decay
      }
    });

    if (Object.keys(decayAmounts).length > 0) {
      dispatch({
        type: 'UPDATE_ENTITY_STATS',
        payload: { entityId, stats: decayAmounts }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      // Check separation distance for loneliness effects
      if (gameState.entities.length === 2) {
        const [entity1, entity2] = gameState.entities;
        
        if (!entity1.isDead && !entity2.isDead) {
          const distance = Math.sqrt(
            Math.pow(entity1.position.x - entity2.position.x, 2) +
            Math.pow(entity1.position.y - entity2.position.y, 2)
          );

          // Increase loneliness when entities are far apart
          if (distance > 120) {
            const separationLoneliness = Math.min(3, distance / 60); // More separation = more loneliness
            
            [entity1, entity2].forEach(entity => {
              if (entity.stats.loneliness < 95) {
                dispatch({
                  type: 'UPDATE_ENTITY_STATS',
                  payload: {
                    entityId: entity.id,
                    stats: { loneliness: Math.min(100, entity.stats.loneliness + separationLoneliness) }
                  }
                });
              }
            });

            // Show occasional separation message
            if (Math.random() < 0.05 && distance > 200) {
              const messages = [
                "La distancia duele...",
                "¿Dónde estás, mi compañero?",
                "Esta separación se siente eterna...",
                "Necesito sentir tu presencia..."
              ];
              
              dispatch({
                type: 'SHOW_DIALOGUE',
                payload: {
                  message: messages[Math.floor(Math.random() * messages.length)],
                  duration: 3000,
                  speaker: Math.random() < 0.5 ? 'circle' : 'square'
                }
              });
            }
          }
          // Reduce loneliness when close together
          else if (distance < 60) {
            [entity1, entity2].forEach(entity => {
              if (entity.stats.loneliness > 5) {
                dispatch({
                  type: 'UPDATE_ENTITY_STATS',
                  payload: {
                    entityId: entity.id,
                    stats: { loneliness: Math.max(0, entity.stats.loneliness - 1) }
                  }
                });
              }
            });
          }
        }
      }

      gameState.entities.forEach(entity => {
        const now = Date.now();
        const timeSinceLastActivity = now - entity.lastActivityChange;
        const timeSinceLastInteraction = now - entity.lastInteraction;

        // Cambio de actividad cada 15-30 segundos
        if (timeSinceLastActivity > 15000 + Math.random() * 15000) {
          const newActivity = selectRandomActivity(entity);
          dispatch({ 
            type: 'UPDATE_ENTITY_ACTIVITY', 
            payload: { entityId: entity.id, activity: newActivity } 
          });

          // Diálogo basado en la nueva actividad
          if (Math.random() < 0.4) {
            showActivityDialogue(entity.id, newActivity);
          }
        }

        // Generar pensamientos autónomos cada 20-40 segundos
        if (Math.random() < 0.002 && timeSinceLastInteraction > 20000) {
          const thought = getRandomThought();
          dispatch({
            type: 'ADD_THOUGHT',
            payload: { entityId: entity.id, thought }
          });
        }

        // Cambios de humor basados en estadísticas
        if (Math.random() < 0.01) {
          const newMood = calculateMoodFromStats(entity.stats);
          if (newMood !== entity.mood) {
            dispatch({
              type: 'UPDATE_ENTITY_MOOD',
              payload: { entityId: entity.id, mood: newMood }
            });
          }
        }

        // Decaimiento gradual de estadísticas (autopoiesis requiere mantenimiento)
        if (Math.random() < 0.1) {
          applyStatDecay(entity.id);
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, dispatch, applyStatDecay, showActivityDialogue, selectRandomActivity, calculateMoodFromStats]);
};
