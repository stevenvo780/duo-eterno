import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import { getRandomDialogue } from '../utils/dialogues';
import type { Entity, EntityActivity, EntityMood } from '../types';

// Hook para comportamientos autónomos optimizado
export const useAutopoiesisOptimized = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0);
  const updateCounter = useRef<number>(0);

  // Cached activity selection for better performance
  const activityCache = useRef<Map<string, EntityActivity>>(new Map());

  const selectRandomActivity = useCallback((entity: Entity): EntityActivity => {
    // Use cached activity if recently calculated
    const cacheKey = `${entity.id}-${Math.floor(Date.now() / 10000)}`; // Cache for 10 seconds
    if (activityCache.current.has(cacheKey)) {
      return activityCache.current.get(cacheKey)!;
    }

    const activities: EntityActivity[] = [
      'WANDERING', 'MEDITATING', 'WRITING', 'RESTING', 
      'CONTEMPLATING', 'EXPLORING', 'DANCING'
    ];
    
    // Weight activities based on stats for more intelligent behavior
    const weights: Record<EntityActivity, number> = {
      'WANDERING': 1.0,
      'MEDITATING': entity.stats.boredom > 50 ? 2.0 : 0.5,
      'WRITING': entity.stats.happiness > 60 ? 1.5 : 0.8,
      'RESTING': entity.stats.sleepiness > 60 ? 3.0 : 0.3,
      'CONTEMPLATING': entity.stats.loneliness > 40 ? 0.5 : 1.2,
      'EXPLORING': entity.stats.energy > 50 ? 1.8 : 0.4,
      'DANCING': entity.stats.happiness > 70 ? 2.5 : 0.2
    };
    
    // Weighted random selection
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const activity of activities) {
      random -= weights[activity];
      if (random <= 0) {
        activityCache.current.set(cacheKey, activity);
        
        // Limit cache size
        if (activityCache.current.size > 20) {
          const firstKey = activityCache.current.keys().next().value;
          activityCache.current.delete(firstKey);
        }
        
        return activity;
      }
    }
    
    return 'WANDERING'; // Fallback
  }, []);

  const showActivityDialogue = useCallback((entityId: string, activity: EntityActivity) => {
    const dialogueMap: Record<EntityActivity, string[]> = {
      'WANDERING': [
        "Mis pasos me llevan por caminos desconocidos...",
        "Cada movimiento es una búsqueda...",
        "Exploro este mundo en busca de algo..."
      ],
      'MEDITATING': [
        "Encuentro paz en la quietud...",
        "Mis pensamientos fluyen como agua...",
        "En el silencio encuentro respuestas..."
      ],
      'WRITING': [
        "Mis palabras danzan en el aire...",
        "Escribo nuestra historia en el tiempo...",
        "Cada letra es un latido del corazón..."
      ],
      'RESTING': [
        "El descanso alimenta mi alma...",
        "En el reposo encuentro fuerzas...",
        "Mi espíritu se renueva..."
      ],
      'CONTEMPLATING': [
        "Reflexiono sobre nuestra conexión...",
        "Los misterios del vínculo me intrigan...",
        "Busco significado en cada momento..."
      ],
      'EXPLORING': [
        "La aventura me llama...",
        "Descubro nuevos horizontes...",
        "Cada rincón guarda secretos..."
      ],
      'DANCING': [
        "Mi alegría se convierte en movimiento...",
        "Danzo con la música del universo...",
        "El ritmo de la vida me guía..."
      ]
    };

    const messages = dialogueMap[activity] || ["Sigo mi camino..."];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    dispatch({
      type: 'SHOW_DIALOGUE',
      payload: { 
        message,
        speaker: entityId as 'circle' | 'square',
        duration: 2500 // Shorter duration for better performance
      }
    });
  }, [dispatch]);

  const calculateMoodFromStats = useCallback((stats: Entity['stats']): EntityMood => {
    // Simplified mood calculation
    const happiness = stats.happiness;
    const energy = stats.energy;
    const loneliness = stats.loneliness;
    
    if (happiness > 80 && energy > 60) return 'EXCITED';
    if (happiness > 60) return 'HAPPY';
    if (loneliness > 70) return 'SAD';
    if (energy < 30) return 'TIRED';
    if (stats.boredom > 60) return 'ANXIOUS';
    if (happiness > 40 && loneliness < 40) return 'CONTENT';
    return 'CALM';
  }, []);

  const applyStatDecay = useCallback((entityId: string) => {
    dispatch({
      type: 'UPDATE_ENTITY_STATS',
      payload: {
        entityId,
        stats: {
          hunger: 1.5, // Slower decay for better performance
          sleepiness: 1.2,
          boredom: 1.0,
          loneliness: 0.8,
          happiness: -0.8,
          energy: -0.5
        }
      }
    });
  }, [dispatch]);

  useEffect(() => {
    // Optimized autopoiesis with reduced frequency
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      
      // Update less frequently for better performance
      if (deltaTime < 2000) return; // Minimum 2 seconds between updates
      
      lastUpdateTime.current = now;
      updateCounter.current++;

      // Process living entities only
      const livingEntities = gameState.entities.filter(entity => !entity.isDead && entity.state !== 'DEAD');
      
      for (const entity of livingEntities) {
        // Apply stat decay (every update)
        applyStatDecay(entity.id);
        
        // Update mood based on stats (less frequent)
        if (updateCounter.current % 3 === 0) {
          const newMood = calculateMoodFromStats(entity.stats);
          if (newMood !== entity.mood) {
            dispatch({
              type: 'UPDATE_ENTITY_MOOD',
              payload: { entityId: entity.id, mood: newMood }
            });
          }
        }
        
        // Autonomous activity changes (even less frequent)
        if (updateCounter.current % 5 === 0) {
          // Higher chance to change activity based on needs
          let shouldChangeActivity = false;
          let newActivity = entity.activity;
          
          // Need-based activity selection
          if (entity.stats.sleepiness > 70 && entity.activity !== 'RESTING') {
            newActivity = 'RESTING';
            shouldChangeActivity = true;
          } else if (entity.stats.boredom > 60 && entity.activity !== 'EXPLORING') {
            newActivity = 'EXPLORING';
            shouldChangeActivity = true;
          } else if (entity.stats.loneliness > 50 && entity.activity !== 'CONTEMPLATING') {
            newActivity = 'CONTEMPLATING';
            shouldChangeActivity = true;
          } else if (Math.random() < 0.15) { // Reduced random chance
            newActivity = selectRandomActivity(entity);
            shouldChangeActivity = newActivity !== entity.activity;
          }
          
          if (shouldChangeActivity) {
            dispatch({
              type: 'UPDATE_ENTITY_ACTIVITY',
              payload: { entityId: entity.id, activity: newActivity }
            });
            
            // Show dialogue only occasionally to reduce spam
            if (Math.random() < 0.3) {
              showActivityDialogue(entity.id, newActivity);
            }
          }
        }
      }
    }, 2000); // 2 second interval instead of variable timing

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState.entities, dispatch, applyStatDecay, showActivityDialogue, selectRandomActivity, calculateMoodFromStats]);
};
