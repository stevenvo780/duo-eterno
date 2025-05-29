import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getEntityZone } from '../utils/mapGeneration';
import type { EntityStats } from '../types';
import { getGameIntervals } from '../config/gameConfig';

// Función para calcular efectividad de zona basada en necesidad
const calculateZoneEffectiveness = (
  stats: EntityStats, 
  zoneType: string
): { effectiveness: number; criticalNeed: boolean } => {
  let relevantStatValue = 0;
  let criticalNeed = false;
  
  switch (zoneType) {
    case 'food':
      relevantStatValue = stats.hunger;
      criticalNeed = relevantStatValue > 80;
      break;
    case 'rest':
      relevantStatValue = Math.max(stats.sleepiness, 100 - stats.energy);
      criticalNeed = stats.sleepiness > 80 || stats.energy < 20;
      break;
    case 'play':
      relevantStatValue = stats.boredom;
      criticalNeed = relevantStatValue > 80;
      break;
    case 'social':
      relevantStatValue = stats.loneliness;
      criticalNeed = relevantStatValue > 80;
      break;
    case 'comfort':
      relevantStatValue = Math.max(stats.boredom, stats.loneliness, 100 - stats.happiness);
      criticalNeed = stats.happiness < 20;
      break;
    default:
      return { effectiveness: 1.0, criticalNeed: false };
  }
  
  // Efectividad basada en cuánto necesita la zona (más necesidad = más efectivo)
  const needBasedEffectiveness = Math.min(3.0, 1.0 + (relevantStatValue / 50));
  
  return { 
    effectiveness: needBasedEffectiveness,
    criticalNeed 
  };
};

// Mensajes más específicos basados en el nivel de necesidad
const getContextualZoneMessage = (
  entityId: string,
  zoneType: string,
  effectiveness: number,
  criticalNeed: boolean
): string | null => {
  const symbol = entityId === 'circle' ? '●' : '■';
  
  const messagesByZoneAndUrgency = {
    food: {
      critical: [
        `${symbol} "¡Por fin! Alimento cuando más lo necesitaba..."`,
        `${symbol} "Mi hambre se calma... era desesperante..."`,
        `${symbol} "Estos nutrientes salvan mi esencia..."`
      ],
      high: [
        `${symbol} "Este jardín tiene exactamente lo que buscaba..."`,
        `${symbol} "Siento cómo mi hambre se desvanece..."`,
        `${symbol} "La comida nunca había sabido tan bien..."`
      ],
      normal: [
        `${symbol} "Un refrigerio en el jardín siempre es agradable..."`,
        `${symbol} "Los sabores de este lugar me reconfortan..."`
      ]
    },
    rest: {
      critical: [
        `${symbol} "Finalmente... no podía más con este cansancio..."`,
        `${symbol} "El descanso llega justo a tiempo..."`,
        `${symbol} "Mis fuerzas se restauran por completo..."`
      ],
      high: [
        `${symbol} "Este santuario es perfecto para recargar energías..."`,
        `${symbol} "Siento cómo el cansancio abandona mi ser..."`,
        `${symbol} "La paz de este lugar me revitaliza..."`
      ],
      normal: [
        `${symbol} "Un momento de reposo sienta bien..."`,
        `${symbol} "Aquí puedo relajarme verdaderamente..."`
      ]
    },
    play: {
      critical: [
        `${symbol} "¡Al fin algo emocionante! El aburrimiento me estaba matando..."`,
        `${symbol} "Esta diversión era exactamente lo que necesitaba..."`,
        `${symbol} "Mi espíritu revive con esta actividad..."`
      ],
      high: [
        `${symbol} "¡Qué liberador es poder jugar y divertirse!"`,
        `${symbol} "Este lugar despierta mi alegría interior..."`,
        `${symbol} "El aburrimiento se disuelve con cada momento..."`
      ],
      normal: [
        `${symbol} "Jugar siempre levanta el ánimo..."`,
        `${symbol} "Esta área tiene una energía especial..."`
      ]
    },
    social: {
      critical: [
        `${symbol} "Por fin siento conexión... la soledad era insoportable..."`,
        `${symbol} "Esta plaza me recuerda que no estoy solo..."`,
        `${symbol} "La energía social de este lugar me sana..."`
      ],
      high: [
        `${symbol} "Aquí siento la presencia de otros seres..."`,
        `${symbol} "La soledad se desvanece en este espacio..."`,
        `${symbol} "Esta plaza nutre mi necesidad de compañía..."`
      ],
      normal: [
        `${symbol} "Este lugar tiene una calidez especial..."`,
        `${symbol} "La energía social aquí es reconfortante..."`
      ]
    },
    comfort: {
      critical: [
        `${symbol} "Este lugar restaura mi equilibrio emocional..."`,
        `${symbol} "Encuentro la armonía que perdí..."`,
        `${symbol} "Mi ser se centra y se calma profundamente..."`
      ],
      high: [
        `${symbol} "La serenidad de este bosque me tranquiliza..."`,
        `${symbol} "Aquí todos mis problemas encuentran perspectiva..."`,
        `${symbol} "Este santuario equilibra mis emociones..."`
      ],
      normal: [
        `${symbol} "Un momento de meditación siempre ayuda..."`,
        `${symbol} "Este lugar tiene una energía especial..."`
      ]
    }
  };
  
  const zoneMessages = messagesByZoneAndUrgency[zoneType as keyof typeof messagesByZoneAndUrgency];
  if (!zoneMessages) return null;
  
  let messageType: 'critical' | 'high' | 'normal';
  if (criticalNeed) {
    messageType = 'critical';
  } else if (effectiveness > 2.0) {
    messageType = 'high';
  } else {
    messageType = 'normal';
  }
  
  const messages = zoneMessages[messageType];
  return messages[Math.floor(Math.random() * messages.length)];
};

export const useZoneEffects = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0);
  const messageCounter = useRef<number>(0);

  useEffect(() => {
    const { zoneEffectsInterval } = getGameIntervals();
    
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      
      if (deltaTime < zoneEffectsInterval * 0.8) return;
      
      lastUpdateTime.current = now;
      messageCounter.current++;

      const livingEntities = gameState.entities.filter(entity => 
        !entity.isDead && entity.state !== 'DEAD'
      );

      for (const entity of livingEntities) {
        const currentZone = getEntityZone(entity.position, gameState.zones);
        
        if (currentZone) {
          // Calcular efectividad de la zona para esta entidad
          const { effectiveness, criticalNeed } = calculateZoneEffectiveness(
            entity.stats, 
            currentZone.type
          );
          
          // Efectos base de zona mejorados
          const enhancedEffects: Record<string, Partial<EntityStats>> = {
            food: { 
              hunger: -8 * effectiveness, 
              energy: 3 * effectiveness, 
              happiness: 2 * effectiveness 
            },
            rest: { 
              sleepiness: -10 * effectiveness, 
              energy: 6 * effectiveness, 
              boredom: Math.min(3, 1 * effectiveness) // Descansar puede aburrir un poco
            },
            play: { 
              boredom: -12 * effectiveness, 
              happiness: 6 * effectiveness, 
              energy: -2 * effectiveness,
              loneliness: -3 * effectiveness // Jugar es social
            },
            social: { 
              loneliness: -15 * effectiveness, 
              happiness: 5 * effectiveness, 
              energy: -1 * effectiveness
            },
            comfort: { 
              happiness: 4 * effectiveness, 
              sleepiness: -3 * effectiveness, 
              boredom: -4 * effectiveness, 
              loneliness: -2 * effectiveness 
            }
          };

          const effects = enhancedEffects[currentZone.type];
          if (effects) {
            // Aplicar efectos con límites realistas
            const finalEffects: Partial<EntityStats> = {};
            Object.entries(effects).forEach(([stat, value]) => {
              const currentStat = entity.stats[stat as keyof EntityStats];
              const newValue = Math.max(0, Math.min(100, currentStat + value));
              if (Math.abs(newValue - currentStat) > 0.1) {
                finalEffects[stat as keyof EntityStats] = value;
              }
            });
            
            if (Object.keys(finalEffects).length > 0) {
              dispatch({
                type: 'UPDATE_ENTITY_STATS',
                payload: {
                  entityId: entity.id,
                  stats: finalEffects
                }
              });
            }

            // Mostrar mensajes contextuales menos frecuentes pero más relevantes
            if (messageCounter.current % 8 === 0 && Math.random() < 0.4) {
              const message = getContextualZoneMessage(
                entity.id, 
                currentZone.type, 
                effectiveness, 
                criticalNeed
              );
              
              if (message) {
                dispatch({
                  type: 'SHOW_DIALOGUE',
                  payload: {
                    message,
                    duration: criticalNeed ? 4000 : 3000,
                    speaker: entity.id as 'circle' | 'square'
                  }
                });
              }
            }
          }
        }
      }
    }, zoneEffectsInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState.entities, gameState.zones, dispatch]);
};
