import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getEntityZone } from '../utils/mapGeneration';
import { getGameIntervals, gameConfig } from '../config/gameConfig';
import type { EntityStats } from '../types';
import { shouldUpdateAutopoiesis } from '../utils/performanceOptimizer';
import { logZones } from '../utils/logger';
import { dynamicsLogger } from '../utils/dynamicsLogger';
import type { ZoneType } from '../constants/gameConstants';

// Ajusta cuán intensamente actúan los efectos de las zonas sobre las estadísticas
const ZONE_EFFECT_SCALE = 0.03;

const zoneConfigs: Partial<Record<ZoneType, { stats: (keyof EntityStats)[]; criticalThreshold: number; label: string }>> = {
  food:    { stats: ['hunger'],                 criticalThreshold: 20, label: 'Alimento' },
  rest:    { stats: ['sleepiness', 'energy'],   criticalThreshold: 30, label: 'Descanso' },
  play:    { stats: ['boredom', 'happiness'],   criticalThreshold: 30, label: 'Diversión' },
  social:  { stats: ['loneliness', 'happiness'],criticalThreshold: 30, label: 'Social' },
  comfort: { stats: ['happiness', 'boredom', 'loneliness'],criticalThreshold: 40, label: 'Confort' },
  energy:  { stats: ['energy'],                 criticalThreshold: 20, label: 'Energía' },
  work:    { stats: ['money', 'energy'],        criticalThreshold: 50, label: 'Trabajo' }
};

const calculateZoneEffectiveness = (
  stats: EntityStats,
  zoneType: ZoneType,
  occupancy: number
): { effectiveness: number; criticalNeed: boolean } => {
  const config = zoneConfigs[zoneType];
  if (!config) return { effectiveness: 1, criticalNeed: false };

  const avgStat = config.stats.reduce((sum, key) => sum + stats[key], 0) / config.stats.length;
  const criticalNeed = avgStat < config.criticalThreshold;
  const needLevel = 100 - avgStat;
  const baseEffectiveness = 1 + needLevel / 50;
  // Crowding: reduce effectiveness as occupancy grows beyond 1
  const capacityLambda = 0.4; // tuneable; per extra occupant
  const crowdFactor = 1 / (1 + capacityLambda * Math.max(0, occupancy - 1));

  return {
    effectiveness: baseEffectiveness * gameConfig.zoneEffectivenessMultiplier * crowdFactor,
    criticalNeed
  };
};

const getContextualZoneMessage = (
  entityId: string,
  zoneType: ZoneType,
  effectiveness: number,
  criticalNeed: boolean
): string | null => {
  const symbol = entityId === 'circle' ? '●' : '■';
  const label = zoneConfigs[zoneType]?.label || zoneType;
  if (criticalNeed) return `${symbol} "${label}: ¡Necesidad crítica! Ven aquí ahora."`;
  return `${symbol} "${label}: +${(effectiveness * 100).toFixed(0)}% eficacia."`;
};

export const useZoneEffects = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0);
  const messageCounter = useRef<number>(0);

  useEffect(() => {
    const { zoneEffectsInterval } = getGameIntervals();
    logZones.info('Zone Effects iniciado', { interval: zoneEffectsInterval });

    intervalRef.current = window.setInterval(() => {
      if (!shouldUpdateAutopoiesis()) return;

      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      lastUpdateTime.current = now;
      messageCounter.current++;

      const livingEntities = gameState.entities.filter(
        e => !e.isDead && e.state !== 'DEAD' && e.state !== 'FADING'
      );

      for (const entity of livingEntities) {
        const currentZone = getEntityZone(entity.position, gameState.zones);
        if (!currentZone || !currentZone.effects) continue;

        const occupancy = livingEntities.filter(e => {
          const z = getEntityZone(e.position, gameState.zones);
          return z && z.id === currentZone.id;
        }).length;

        const { effectiveness, criticalNeed } = calculateZoneEffectiveness(entity.stats, currentZone.type, occupancy);
        const timeMultiplier = (deltaTime / 1000) * gameConfig.gameSpeedMultiplier;
        const finalEffects: Partial<EntityStats> = {};

        Object.entries(currentZone.effects).forEach(([stat, baseValue]) => {
          const statKey = stat as keyof EntityStats;
          if (typeof baseValue !== 'number') return;

          if (statKey === 'money') {
            const gain = baseValue * effectiveness * timeMultiplier * ZONE_EFFECT_SCALE;
            if (gain > 0.05) finalEffects.money = entity.stats.money + gain;
            return;
          }

          const currentStat = entity.stats[statKey];
          const newValue = Math.max(0, Math.min(100, currentStat + baseValue * effectiveness * timeMultiplier * ZONE_EFFECT_SCALE));
          if (Math.abs(newValue - currentStat) > 0.1) finalEffects[statKey] = newValue;
        });

        if (Object.keys(finalEffects).length) {
          dispatch({ type: 'UPDATE_ENTITY_STATS', payload: { entityId: entity.id, stats: finalEffects } });
          
          // Log para análisis
          dynamicsLogger.logZoneEffect(entity.id, currentZone.name, finalEffects as Record<string, number>);
          
          if (gameConfig.debugMode && messageCounter.current % 10 === 0) {
            logZones.debug('Zone effects', { entity: entity.id, effects: finalEffects, effectiveness });
          }
        }

        if (criticalNeed && messageCounter.current % 15 === 0) {
          const message = getContextualZoneMessage(entity.id, currentZone.type, effectiveness, criticalNeed);
          if (message) dispatch({ type: 'SHOW_DIALOGUE', payload: { message, duration: 2000 } });
        }
      }
    }, zoneEffectsInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        logZones.info('Zone Effects detenido');
      }
    };
  }, [gameState.entities, gameState.zones, dispatch]);
};
