import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getEntityZone } from '../utils/mapGeneration';
import { getGameIntervals, gameConfig } from '../config/gameConfig';
import type { EntityStats } from '../types';
import { 
  shouldUpdateAutopoiesis
} from '../utils/performanceOptimizer';
import { logZones } from '../utils/logger';
import type { ZoneType } from '../constants/gameConstants';

// Nuevo mapeo de configuración para zonas
const zoneConfigs: Partial<Record<ZoneType, { stats: (keyof EntityStats)[]; criticalThreshold: number; label: string }>> = {
  food:    { stats: ['hunger'],                 criticalThreshold: 20, label: 'Alimento' },
  rest:    { stats: ['sleepiness', 'energy'],   criticalThreshold: 30, label: 'Descanso' },
  play:    { stats: ['boredom', 'happiness'],   criticalThreshold: 30, label: 'Diversión' },
  social:  { stats: ['loneliness', 'happiness'],criticalThreshold: 30, label: 'Social' },
  comfort: { stats: ['happiness', 'boredom', 'loneliness'],criticalThreshold: 40, label: 'Confort' },
  energy:  { stats: ['energy'],                 criticalThreshold: 20, label: 'Energía' }
};

// Cálculo refactorizado de efectividad de zona
const calculateZoneEffectiveness = (
  stats: EntityStats,
  zoneType: ZoneType
): { effectiveness: number; criticalNeed: boolean } => {
  const config = zoneConfigs[zoneType];
  if (!config) return { effectiveness: 1, criticalNeed: false };

  const avgStat = config.stats.reduce((sum, key) => sum + stats[key], 0) / config.stats.length;
  const criticalNeed = avgStat > config.criticalThreshold; // Mayor valor = más necesidad
  const needLevel = avgStat; // Usar valor directo
  const baseEffectiveness = 1 + needLevel / 50;
  const effectiveness = baseEffectiveness * gameConfig.zoneEffectivenessMultiplier;

  return { effectiveness, criticalNeed };
};

// Mensaje simplificado de zona
const getContextualZoneMessage = (
  entityId: string,
  zoneType: ZoneType,
  effectiveness: number,
  criticalNeed: boolean
): string | null => {
  const symbol = entityId === 'circle' ? '●' : '■';
  const label = zoneConfigs[zoneType]?.label || zoneType;
  if (criticalNeed) {
    return `${symbol} "${label}: ¡Necesidad crítica! Ven aquí ahora."`;
  }
  return `${symbol} "${label}: +${(effectiveness * 100).toFixed(0)}% eficacia."`;
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
                energy: 50 * effectiveness * timeMultiplier,      // +energía
                sleepiness: -10 * effectiveness * timeMultiplier, // -sueño
                happiness: 5 * effectiveness * timeMultiplier
              }
            };

            const effects = enhancedEffects[currentZone.type];
            if (effects) {
              // Crear objeto para efectos finales
              const finalEffects: Partial<EntityStats> = {};
              
              Object.entries(effects).forEach(([stat, value]) => {
                const currentStat = entity.stats[stat as keyof EntityStats];
                const newValue = Math.max(0, Math.min(100, currentStat + value));
                // Guardar valor absoluto nuevo, no delta, para evitar valores erráticos
                if (Math.abs(newValue - currentStat) > 0.05) {
                  finalEffects[stat as keyof EntityStats] = newValue;
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
    }, zoneEffectsInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        logZones.info('Zone Effects Optimizado detenido');
      }
    };
  }, [gameState.entities, gameState.zones, dispatch]);
};
