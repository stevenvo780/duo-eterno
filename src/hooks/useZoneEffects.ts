import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getEntityZone } from '../utils/mapGeneration';
import type { EntityStats } from '../types';

// Helper functions for need-based zone interactions
const checkNeedZoneMatch = (stats: EntityStats, zoneType: string): boolean => {
  const threshold = 60; // Consider needy when stat > 60
  
  switch (zoneType) {
    case 'food':
      return stats.hunger > threshold;
    case 'rest':
      return stats.sleepiness > threshold;
    case 'play':
      return stats.boredom > threshold;
    case 'social':
      return stats.loneliness > threshold;
    case 'comfort':
      return stats.happiness < 40 || stats.boredom > 50; // Comfort helps with low happiness or mild boredom
    default:
      return false;
  }
};

const getNeedSatisfactionMessage = (entityId: string, zoneType: string, stats: EntityStats): string | null => {
  const symbol = entityId === 'circle' ? '●' : '■';
  
  const messages = {
    food: [
      `${symbol} "¡Ah, estos sabores nutren mi esencia!"`,
      `${symbol} "Siento como la energía vital regresa a mí..."`,
      `${symbol} "Este jardín tiene todo lo que necesitaba."`,
      `${symbol} "El hambre se desvanece con cada bocado etéreo."`
    ],
    rest: [
      `${symbol} "Finalmente, mis partículas pueden descansar..."`,
      `${symbol} "El sueño me envuelve como un manto cálido."`,
      `${symbol} "Aquí mi energía se regenera lentamente."`,
      `${symbol} "Siento la paz que tanto necesitaba."`
    ],
    play: [
      `${symbol} "¡Esta diversión despierta mi alegría interior!"`,
      `${symbol} "Bailar y jugar libera mi espíritu..."`,
      `${symbol} "El aburrimiento se disuelve en risas."`,
      `${symbol} "¡Qué liberador es poder expresarme!"`
    ],
    social: [
      `${symbol} "La compañía de otros alivia mi soledad..."`,
      `${symbol} "Aquí siento que pertenezco a algo más grande."`,
      `${symbol} "La conexión social nutre mi alma."`,
      `${symbol} "Ya no me siento tan aislado del mundo."`
    ],
    comfort: [
      `${symbol} "Este lugar equilibra todas mis emociones..."`,
      `${symbol} "Siento una armonía profunda en mi ser."`,
      `${symbol} "Aquí encuentro la serenidad que buscaba."`,
      `${symbol} "Mi espíritu se centra y se calma."`
    ]
  };
  
  const zoneMessages = messages[zoneType as keyof typeof messages];
  if (!zoneMessages) return null;
  
  return zoneMessages[Math.floor(Math.random() * zoneMessages.length)];
};

const getGeneralZoneMessage = (entityId: string, zoneType: string): string | null => {
  const symbol = entityId === 'circle' ? '●' : '■';
  
  const messages = {
    food: [`${symbol} explora los aromas del jardín...`],
    rest: [`${symbol} se relaja en el santuario...`],
    play: [`${symbol} experimenta con el área de juegos...`],
    social: [`${symbol} siente la energía de la plaza social...`],
    comfort: [`${symbol} medita en el bosque sagrado...`]
  };
  
  const zoneMessages = messages[zoneType as keyof typeof messages];
  if (!zoneMessages) return null;
  
  return zoneMessages[Math.floor(Math.random() * zoneMessages.length)];
};

export const useZoneEffectsOptimized = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0);
  const updateCounter = useRef<number>(0);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      
      // Throttle zone effects to every 2 seconds for better performance
      if (deltaTime < 2000) return;
      
      lastUpdateTime.current = now;
      updateCounter.current++;

      // Only process living entities
      const livingEntities = gameState.entities.filter(entity => 
        !entity.isDead && entity.state !== 'DEAD'
      );

      for (const entity of livingEntities) {
        // Verificar si la entidad está en alguna zona
        const currentZone = getEntityZone(entity.position, gameState.zones);
        
        if (currentZone) {
          // Check if the entity's needs match the zone type for more effective healing
          const needsZoneMatch = checkNeedZoneMatch(entity.stats, currentZone.type);
          const effectMultiplier = needsZoneMatch ? 1.5 : 1.0; // Bonus when needs match zone
          
          // Apply zone effects gradually with need-based multiplier
          const baseEffects = {
            food: { hunger: -4, energy: 2, happiness: 1 },
            rest: { sleepiness: -5, energy: 3, boredom: 1 },
            play: { boredom: -6, happiness: 4, energy: -1 },
            social: { loneliness: -7, happiness: 3 },
            comfort: { happiness: 2, sleepiness: -2, boredom: -2, loneliness: -1 }
          };

          const effects = baseEffects[currentZone.type as keyof typeof baseEffects];
          if (effects) {
            // Apply multiplied effects
            const finalEffects: Record<string, number> = {};
            Object.entries(effects).forEach(([stat, value]) => {
              finalEffects[stat] = Math.round(value * effectMultiplier);
            });
            
            dispatch({
              type: 'UPDATE_ENTITY_STATS',
              payload: {
                entityId: entity.id,
                stats: finalEffects
              }
            });

            // Show contextual messages when needs are being satisfied
            if (needsZoneMatch && updateCounter.current % 5 === 0 && Math.random() < 0.6) {
              const satisfactionMessages = getNeedSatisfactionMessage(entity.id, currentZone.type, entity.stats);
              
              if (satisfactionMessages) {
                dispatch({
                  type: 'SHOW_DIALOGUE',
                  payload: {
                    message: satisfactionMessages,
                    duration: 3000,
                    speaker: entity.id as 'circle' | 'square'
                  }
                });
              }
            }
            // Regular zone messages (less frequent)
            else if (updateCounter.current % 10 === 0 && Math.random() < 0.2) {
              const generalMessages = getGeneralZoneMessage(entity.id, currentZone.type);
              
              if (generalMessages) {
                dispatch({
                  type: 'SHOW_DIALOGUE',
                  payload: {
                    message: generalMessages,
                    duration: 2000,
                    speaker: entity.id as 'circle' | 'square'
                  }
                });
              }
            }
          }
        }
      }
    }, 2000); // Aplicar efectos cada 2 segundos en lugar de cada segundo

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState.entities, gameState.zones, dispatch]);
};
