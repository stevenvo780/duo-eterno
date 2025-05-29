import { useEffect } from 'react';
import { useGame } from './useGame';
import { getEntityZone } from '../utils/mapGeneration';

export const useZoneEffects = () => {
  const { gameState, dispatch } = useGame();

  useEffect(() => {
    const interval = setInterval(() => {
      gameState.entities.forEach(entity => {
        // Solo aplicar efectos a entidades vivas
        if (entity.isDead || entity.state === 'DEAD') return;

        // Verificar si la entidad está en alguna zona
        const currentZone = getEntityZone(entity.position, gameState.zones);
        
        if (currentZone) {
          // Aplicar efectos de la zona gradualmente
          const statUpdates: Partial<typeof entity.stats> = {};
          let hasChanges = false;

          Object.entries(currentZone.effects).forEach(([statName, effect]) => {
            if (effect !== undefined) {
              const currentValue = entity.stats[statName as keyof typeof entity.stats];
              
              // Aplicar efecto gradual (reducido para evitar cambios bruscos)
              let newValue = currentValue + (effect * 0.1); // 10% del efecto por segundo
              
              // Asegurar que está en rango 0-100
              newValue = Math.max(0, Math.min(100, newValue));
              
              // Solo actualizar si hay cambio significativo (mayor a 0.5)
              if (Math.abs(newValue - currentValue) > 0.5) {
                statUpdates[statName as keyof typeof entity.stats] = newValue;
                hasChanges = true;
              }
            }
          });

          // Aplicar cambios si los hay
          if (hasChanges) {
            dispatch({
              type: 'UPDATE_ENTITY_STATS',
              payload: { entityId: entity.id, stats: statUpdates }
            });

            // Mostrar mensaje ocasional sobre el efecto de zona
            if (Math.random() < 0.01) { // 1% de probabilidad cada segundo
              const messages = {
                food: [`${entity.id === 'circle' ? '●' : '■'} disfruta de los nutrientes del jardín...`, 
                       `${entity.id === 'circle' ? '●' : '■'} se alimenta tranquilamente...`],
                rest: [`${entity.id === 'circle' ? '●' : '■'} descansa en el santuario...`, 
                       `${entity.id === 'circle' ? '●' : '■'} encuentra paz en este lugar...`],
                play: [`${entity.id === 'circle' ? '●' : '■'} se divierte en el área de juegos...`, 
                       `${entity.id === 'circle' ? '●' : '■'} libera su energía jugando...`],
                social: [`${entity.id === 'circle' ? '●' : '■'} siente la calidez de la plaza social...`, 
                         `${entity.id === 'circle' ? '●' : '■'} se conecta con el ambiente social...`],
                comfort: [`${entity.id === 'circle' ? '●' : '■'} medita en el bosque sagrado...`, 
                          `${entity.id === 'circle' ? '●' : '■'} encuentra tranquilidad interior...`]
              };

              const zoneMessages = messages[currentZone.type] || [`${entity.id === 'circle' ? '●' : '■'} explora esta área especial...`];
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
      });
    }, 1000); // Aplicar efectos cada segundo

    return () => clearInterval(interval);
  }, [gameState.entities, gameState.zones, dispatch]);
};
