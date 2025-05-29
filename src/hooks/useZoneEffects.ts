import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getEntityZone } from '../utils/mapGeneration';
import { getGameIntervals, gameConfig } from '../config/gameConfig';
import type { EntityStats } from '../types';
import { 
  shouldUpdateAutopoiesis,
  measureExecutionTime,
  getPooledStatsUpdate,
  releasePooledStatsUpdate
} from '../utils/performanceOptimizer';
import { logZones } from '../utils/logger';

// Función para calcular efectividad de zona basada en necesidad - MEJORADA
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
  
  // Efectividad más agresiva con multiplicador de configuración
  const baseEffectiveness = Math.min(5.0, 1.0 + (relevantStatValue / 25));
  const configuredEffectiveness = baseEffectiveness * gameConfig.zoneEffectivenessMultiplier;
  
  return { 
    effectiveness: configuredEffectiveness,
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
        `${symbol} "¡SALVACIÓN! Este alimento llega justo a tiempo..."`,
        `${symbol} "Mi hambre extrema se calma... puedo respirar de nuevo..."`,
        `${symbol} "Estos nutrientes me devuelven a la vida..."`
      ],
      high: [
        `${symbol} "Este jardín tiene exactamente lo que necesitaba..."`,
        `${symbol} "Siento mi hambre desvanecerse rápidamente..."`,
        `${symbol} "La comida sabe increíblemente bien ahora..."`
      ],
      normal: [
        `${symbol} "Un bocado en el jardín siempre reconforta..."`,
        `${symbol} "Los sabores naturales me nutren..."`
      ]
    },
    rest: {
      critical: [
        `${symbol} "¡Por fin! El cansancio era insoportable..."`,
        `${symbol} "Este descanso me salva de colapsar..."`,
        `${symbol} "Mis fuerzas se restauran completamente..."`
      ],
      high: [
        `${symbol} "Este santuario es perfecto para recargar..."`,
        `${symbol} "El cansancio se desvanece aquí..."`,
        `${symbol} "La paz de este lugar me revitaliza..."`
      ],
      normal: [
        `${symbol} "Un momento de reposo siempre ayuda..."`,
        `${symbol} "Aquí puedo relajarme verdaderamente..."`
      ]
    },
    play: {
      critical: [
        `${symbol} "¡AL FIN diversión! El aburrimiento me mataba..."`,
        `${symbol} "Esta actividad era exactamente lo que necesitaba..."`,
        `${symbol} "Mi espíritu revive con esta diversión..."`
      ],
      high: [
        `${symbol} "¡Qué liberador poder jugar aquí!"`,
        `${symbol} "Este lugar despierta mi alegría..."`,
        `${symbol} "El aburrimiento se disuelve rápidamente..."`
      ],
      normal: [
        `${symbol} "Jugar siempre levanta el ánimo..."`,
        `${symbol} "Esta área tiene energía especial..."`
      ]
    },
    social: {
      critical: [
        `${symbol} "Por fin conexión... la soledad era agónica..."`,
        `${symbol} "Esta plaza me recuerda que existo..."`,
        `${symbol} "La energía social me cura por completo..."`
      ],
      high: [
        `${symbol} "Aquí siento presencia de otros seres..."`,
        `${symbol} "La soledad se desvanece aquí..."`,
        `${symbol} "Esta plaza alimenta mi alma social..."`
      ],
      normal: [
        `${symbol} "Este lugar tiene calidez humana..."`,
        `${symbol} "La energía social es reconfortante..."`
      ]
    },
    comfort: {
      critical: [
        `${symbol} "Este lugar restaura mi equilibrio perdido..."`,
        `${symbol} "Encuentro la armonía que tanto necesitaba..."`,
        `${symbol} "Mi ser se centra profundamente aquí..."`
      ],
      high: [
        `${symbol} "La serenidad de este bosque me tranquiliza..."`,
        `${symbol} "Aquí todos mis problemas se resuelven..."`,
        `${symbol} "Este santuario equilibra mis emociones..."`
      ],
      normal: [
        `${symbol} "Un momento de meditación siempre ayuda..."`,
        `${symbol} "Este lugar tiene energía especial..."`
      ]
    }
  };
  
  const zoneMessages = messagesByZoneAndUrgency[zoneType as keyof typeof messagesByZoneAndUrgency];
  if (!zoneMessages) return null;
  
  let messageType: 'critical' | 'high' | 'normal';
  if (criticalNeed) {
    messageType = 'critical';
  } else if (effectiveness > 3.0) {
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
    
    logZones.info(`Zone Effects Optimizado iniciado`, { interval: zoneEffectsInterval });
    
    intervalRef.current = window.setInterval(() => {
      // Usar throttling inteligente
      if (!shouldUpdateAutopoiesis()) {
        return;
      }
      
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      
      lastUpdateTime.current = now;
      messageCounter.current++;

      const livingEntities = gameState.entities.filter(entity => 
        !entity.isDead && entity.state !== 'DEAD'
      );

      measureExecutionTime('zone-effects-full-cycle', () => {
        for (const entity of livingEntities) {
          const currentZone = getEntityZone(entity.position, gameState.zones);
          
          if (currentZone) {
            // Calcular efectividad con configuración mejorada
            const { effectiveness, criticalNeed } = calculateZoneEffectiveness(
              entity.stats, 
              currentZone.type
            );
            
            // Efectos de zona más fuertes con configuración
            const timeMultiplier = (deltaTime / 1000) * gameConfig.gameSpeedMultiplier;
            const enhancedEffects: Record<string, Partial<EntityStats>> = {
              food: { 
                hunger: -15 * effectiveness * timeMultiplier,
                energy: 5 * effectiveness * timeMultiplier, 
                happiness: 3 * effectiveness * timeMultiplier 
              },
              rest: { 
                sleepiness: -18 * effectiveness * timeMultiplier,
                energy: 12 * effectiveness * timeMultiplier, 
                boredom: Math.min(5, 2 * effectiveness * timeMultiplier)
              },
              play: { 
                boredom: -20 * effectiveness * timeMultiplier,
                happiness: 10 * effectiveness * timeMultiplier, 
                energy: -3 * effectiveness * timeMultiplier,
                loneliness: -5 * effectiveness * timeMultiplier
              },
              social: { 
                loneliness: -25 * effectiveness * timeMultiplier,
                happiness: 8 * effectiveness * timeMultiplier, 
                energy: -2 * effectiveness * timeMultiplier
              },
              comfort: { 
                happiness: 8 * effectiveness * timeMultiplier, 
                sleepiness: -5 * effectiveness * timeMultiplier, 
                boredom: -8 * effectiveness * timeMultiplier, 
                loneliness: -4 * effectiveness * timeMultiplier 
              }
            };

            const effects = enhancedEffects[currentZone.type];
            if (effects) {
              // Usar pool para stats update
              const finalEffects = getPooledStatsUpdate();
              
              try {
                Object.entries(effects).forEach(([stat, value]) => {
                  const currentStat = entity.stats[stat as keyof EntityStats];
                  const newValue = Math.max(0, Math.min(100, currentStat + value));
                  if (Math.abs(newValue - currentStat) > 0.05) {
                    finalEffects[stat as keyof EntityStats] = value;
                  }
                });
                
                if (Object.keys(finalEffects).length > 0) {
                  dispatch({
                    type: 'UPDATE_ENTITY_STATS',
                    payload: {
                      entityId: entity.id,
                      stats: { ...finalEffects }
                    }
                  });
                  
                  // Debug optimizado
                  if (gameConfig.debugMode && Object.keys(finalEffects).length > 0) {
                    logZones.debug(`${entity.id} en zona ${currentZone.type}`, finalEffects);
                  }
                }
              } finally {
                // Devolver objeto al pool
                releasePooledStatsUpdate(finalEffects);
              }

              // Mostrar mensajes contextuales menos frecuentes
              if (messageCounter.current % 12 === 0 && Math.random() < 0.25) {
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
                      duration: criticalNeed ? 3000 : 2000,
                      speaker: entity.id as 'circle' | 'square'
                    }
                  });
                }
              }
            }
          }
        }
      });
    }, zoneEffectsInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        logZones.info('Zone Effects Optimizado detenido');
      }
    };
  }, [gameState.entities, gameState.zones, dispatch]);
};
