import type { EntityStats } from '../types';
import type { UpgradeEffect } from '../types/upgrades';

export interface UpgradeEffectsContext {
  getUpgradeEffect: (effectType: UpgradeEffect['type'], target?: string) => number;
}

// Aplicar efectos de upgrades a las stats decay
export const applyUpgradeToStatDecay = (
  originalDecay: number, 
  effects: UpgradeEffectsContext
): number => {
  const reductionPercent = effects.getUpgradeEffect('STAT_DECAY_REDUCTION');
  return originalDecay * (1 - reductionPercent / 100);
};

// Aplicar efectos de upgrades a la efectividad de actividades
export const applyUpgradeToActivityEffectiveness = (
  originalEffect: Partial<EntityStats>,
  activityType: string,
  effects: UpgradeEffectsContext
): Partial<EntityStats> => {
  const specificBonus = effects.getUpgradeEffect('ACTIVITY_EFFECTIVENESS', activityType);
  const interactionBonus = effects.getUpgradeEffect('ACTIVITY_EFFECTIVENESS', 'INTERACTIONS');
  
  // Aplicar bonus específico de actividad
  let totalBonus = specificBonus;
  
  // Si es una interacción (FEED, PLAY, COMFORT), aplicar bonus de interacciones
  if (['FEED', 'PLAY', 'COMFORT', 'NOURISH'].includes(activityType)) {
    totalBonus += interactionBonus;
  }
  
  if (totalBonus === 0) return originalEffect;
  
  const multiplier = 1 + (totalBonus / 100);
  const boostedEffect: Partial<EntityStats> = {};
  
  Object.entries(originalEffect).forEach(([key, value]) => {
    if (typeof value === 'number') {
      boostedEffect[key as keyof EntityStats] = Math.round(value * multiplier);
    }
  });
  
  return boostedEffect;
};

// Wrapper para simplificar el uso en otros archivos
export const createUpgradeEffectsContext = (
  getUpgradeEffect: (effectType: UpgradeEffect['type'], target?: string) => number
): UpgradeEffectsContext => ({
  getUpgradeEffect
});
