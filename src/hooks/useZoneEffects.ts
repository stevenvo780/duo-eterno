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
          
          if (currentZone && currentZone.effects) {
            // Calcular efectividad con configuración mejorada
            const { effectiveness, criticalNeed } = calculateZoneEffectiveness(
              entity.stats, 
              currentZone.type
            );
            
            // Usar los efectos definidos en la zona del mapa
            const timeMultiplier = (deltaTime / 1000) * gameConfig.gameSpeedMultiplier;
            const finalEffects: Partial<EntityStats> = {};
            
            Object.entries(currentZone.effects).forEach(([stat, baseValue]) => {
              const statKey = stat as keyof EntityStats;
              if (statKey !== 'money' && typeof baseValue === 'number') {
                const currentStat = entity.stats[statKey];
                
                // Aplicar efectividad y multiplicadores de tiempo de manera MUY gradual
                const effectValue = baseValue * effectiveness * timeMultiplier * 0.05; // Reducir significativamente
                const newValue = Math.max(0, Math.min(100, currentStat + effectValue));
                
                // Solo aplicar si hay cambio significativo (mayor umbral)
                if (Math.abs(newValue - currentStat) > 0.5) {
                  finalEffects[statKey] = newValue;
                }
              } else if (statKey === 'money' && typeof baseValue === 'number') {
                // El dinero no tiene límite de 100 pero también debe ser gradual
                const currentMoney = entity.stats.money;
                const moneyGain = baseValue * effectiveness * timeMultiplier * 0.05;
                if (moneyGain > 0.5) {
                  finalEffects.money = currentMoney + moneyGain;
                }
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
              if (gameConfig.debugMode && messageCounter.current % 10 === 0) {
                logZones.debug(`Zone effects applied to ${entity.id}`, {
                  zone: currentZone.name,
                  effects: finalEffects,
                  effectiveness: effectiveness.toFixed(2),
                  critical: criticalNeed
                });
              }
            }
            
            // Mostrar mensaje contextual ocasionalmente
            if (criticalNeed && messageCounter.current % 15 === 0) {
              const message = getContextualZoneMessage(
                entity.id, 
                currentZone.type, 
                effectiveness, 
                criticalNeed
              );
              if (message) {
                dispatch({
                  type: 'SHOW_DIALOGUE',
                  payload: { message, duration: 2000 }
                });
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
