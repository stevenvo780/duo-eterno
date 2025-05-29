/**
 * Sistema Homeostático Normalizado para duo-eterno
 * Todas las estadísticas en escala 0-100 donde 50 es el equilibrio óptimo
 * Diseñado para comportamiento emergente tipo autómata celular
 */

import type { EntityStats } from '../types';
import type { UpgradeEffectsContext } from './upgradeEffects';

const BASE_DECAY_RATE = 0.5;

export const applyHomeostasis = (
  stats: EntityStats,
  deltaTime: number = 1,
  upgradeEffects?: UpgradeEffectsContext
): EntityStats => {
  const decay = upgradeEffects 
    ? BASE_DECAY_RATE * (1 - upgradeEffects.getUpgradeEffect('STAT_DECAY_REDUCTION') / 100)
    : BASE_DECAY_RATE;

  return {
    hunger: Math.max(0, Math.min(100, stats.hunger + decay * deltaTime)),
    sleepiness: Math.max(0, Math.min(100, stats.sleepiness + decay * deltaTime)),
    loneliness: Math.max(0, Math.min(100, stats.loneliness + decay * deltaTime)),
    boredom: Math.max(0, Math.min(100, stats.boredom + decay * deltaTime)),
    energy: Math.max(0, Math.min(100, stats.energy - decay * deltaTime)),
    happiness: Math.max(0, Math.min(100, stats.happiness - decay * 0.3 * deltaTime)),
    money: stats.money
  };
};


