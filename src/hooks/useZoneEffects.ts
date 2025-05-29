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

// Función para calcular efectividad de zona basada en necesidad - SISTEMA POSITIVO
const calculateZoneEffectiveness = (
  stats: EntityStats, 
  zoneType: string
): { effectiveness: number; criticalNeed: boolean } => {
  let relevantStatValue = 0;
  let criticalNeed = false;
  
  switch (zoneType) {
    case 'food':
      // stats.hunger ahora es "saciedad" (0=hambriento, 100=lleno)
      relevantStatValue = stats.hunger;
      criticalNeed = relevantStatValue < 20;
      break;
    case 'rest':
      // stats.sleepiness sigue siendo sueño (0=despierto, 100=somnoliento)
      relevantStatValue = stats.sleepiness;
      criticalNeed = stats.sleepiness > 80 || stats.energy < 20;
      break;
    case 'play':
      // stats.boredom ahora es "diversión" (0=aburrido, 100=divertido)
      relevantStatValue = stats.boredom;
      criticalNeed = relevantStatValue < 20;
      break;
    case 'social':
      // stats.loneliness ahora es "compañía" (0=solo, 100=acompañado)
      relevantStatValue = stats.loneliness;
      criticalNeed = relevantStatValue < 20;
      break;
    case 'comfort':
      // Combinamos necesidades de felicidad, diversión y compañía
      relevantStatValue = Math.min(stats.happiness, stats.boredom, stats.loneliness);
      criticalNeed = relevantStatValue < 20;
      break;
    case 'energy':
      // stats.energy sigue siendo energía (0=agotado, 100=energético)
      relevantStatValue = stats.energy;
      criticalNeed = relevantStatValue < 20;
      break;
    default:
      return { effectiveness: 1.0, criticalNeed: false };
  }
  
  // Efectividad basada en necesidad (valores bajos necesitan más efectividad)
  const needLevel = 100 - relevantStatValue; // Invertimos para que baja stat = alta necesidad
  const baseEffectiveness = Math.min(5.0, 1.0 + (needLevel / 25));
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
        `${symbol} "¡AL FIN diversión! El aburrimiento me consumía..."`,
        `${symbol} "Esta actividad era exactamente lo que necesitaba..."`,
        `${symbol} "Mi espíritu revive con esta diversión..."`
      ],
      high: [
        `${symbol} "¡Qué liberador poder jugar aquí!"`,
        `${symbol} "Este lugar despierta mi alegría..."`,
        `${symbol} "La diversión fluye a través de mí..."`
      ],
      normal: [
        `${symbol} "Jugar siempre levanta el ánimo..."`,
        `${symbol} "Esta área tiene energía especial..."`
      ]
    },
    social: {
      critical: [
        `${symbol} "Por fin conexión... la soledad era agónica..."`,
        `${symbol} "Esta plaza me recuerda que no estoy solo..."`,
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
    },
    energy: {
      critical: [
        `${symbol} "¡Esta estación me salva del agotamiento total!"`,
        `${symbol} "La energía fluye através de mí... ¡renazco!"`,
        `${symbol} "Siento como cada célula se revitaliza..."`
      ],
      high: [
        `${symbol} "Esta estación energética es exactamente lo que necesitaba..."`,
        `${symbol} "Mi vitalidad se restaura rápidamente aquí..."`,
        `${symbol} "La corriente energética me recarga por completo..."`
      ],
      normal: [
        `${symbol} "Un impulso de energía siempre viene bien..."`,
        `${symbol} "Esta estación tiene una vibración especial..."`
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
            
            // Efectos de zona más fuertes con configuración - SISTEMA POSITIVO
            const timeMultiplier = (deltaTime / 1000) * gameConfig.gameSpeedMultiplier;
            const enhancedEffects: Record<string, Partial<EntityStats>> = {
              food: { 
                hunger: 15 * effectiveness * timeMultiplier,     // +saciedad
                energy: 5 * effectiveness * timeMultiplier, 
                happiness: 3 * effectiveness * timeMultiplier 
              },
              rest: { 
                sleepiness: -18 * effectiveness * timeMultiplier, // -sueño (único negativo)
                energy: 12 * effectiveness * timeMultiplier, 
                boredom: 2 * effectiveness * timeMultiplier       // +diversión
              },
              play: { 
                boredom: 20 * effectiveness * timeMultiplier,     // +diversión
                happiness: 10 * effectiveness * timeMultiplier, 
                energy: -3 * effectiveness * timeMultiplier,      // -energía (gasta energía)
                loneliness: 5 * effectiveness * timeMultiplier    // +compañía
              },
              social: { 
                loneliness: 25 * effectiveness * timeMultiplier,  // +compañía
                happiness: 8 * effectiveness * timeMultiplier, 
                energy: -2 * effectiveness * timeMultiplier       // -energía (gasta un poco)
              },
              comfort: { 
                happiness: 8 * effectiveness * timeMultiplier, 
                sleepiness: -5 * effectiveness * timeMultiplier,  // -sueño
                boredom: 8 * effectiveness * timeMultiplier,      // +diversión
                loneliness: 4 * effectiveness * timeMultiplier    // +compañía
              },
              energy: {
                energy: 80 * effectiveness * timeMultiplier,      // +energía
                sleepiness: -10 * effectiveness * timeMultiplier, // -sueño
                happiness: 5 * effectiveness * timeMultiplier
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
