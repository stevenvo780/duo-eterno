import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getEntityZone } from '../utils/mapGeneration';

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
          // Aplicar efectos de la zona gradualmente con menos intensidad para mejor rendimiento
          const zoneEffects = {
            food: { hunger: -4, energy: 2 },
            rest: { sleepiness: -5, energy: 3 },
            play: { boredom: -4, happiness: 3 },
            social: { loneliness: -5, happiness: 2 },
            comfort: { happiness: 2, sleepiness: -2, boredom: -2 }
          };

          const effects = zoneEffects[currentZone.type as keyof typeof zoneEffects];
          if (effects) {
            dispatch({
              type: 'UPDATE_ENTITY_STATS',
              payload: {
                entityId: entity.id,
                stats: effects
              }
            });

            // Mostrar mensaje ocasional sobre el efecto de zona (reducida frecuencia)
            if (updateCounter.current % 10 === 0 && Math.random() < 0.3) {
              const messages = {
                food: [`${entity.id === 'circle' ? '●' : '■'} disfruta de los nutrientes del jardín...`],
                rest: [`${entity.id === 'circle' ? '●' : '■'} descansa en el santuario...`],
                play: [`${entity.id === 'circle' ? '●' : '■'} se divierte en el área de juegos...`],
                social: [`${entity.id === 'circle' ? '●' : '■'} siente la calidez de la plaza social...`],
                comfort: [`${entity.id === 'circle' ? '●' : '■'} medita en el bosque sagrado...`]
              };

              const zoneMessages = messages[currentZone.type as keyof typeof messages];
              if (zoneMessages) {
                const randomMessage = zoneMessages[Math.floor(Math.random() * zoneMessages.length)];

                dispatch({
                  type: 'SHOW_DIALOGUE',
                  payload: {
                    message: randomMessage,
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
