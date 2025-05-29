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

// Aplicar efectos de upgrades a generación de dinero
export const applyUpgradeToMoneyGeneration = (
  originalAmount: number,
  activityType: string,
  effects: UpgradeEffectsContext
): number => {
  const specificBonus = effects.getUpgradeEffect('MONEY_GENERATION', activityType);
  const passiveBonus = effects.getUpgradeEffect('MONEY_GENERATION', 'PASSIVE');
  
  let totalBonus = specificBonus;
  
  // El bonus pasivo se aplica siempre (cada minuto/ciclo)
  if (activityType === 'PASSIVE_INCOME') {
    totalBonus = passiveBonus;
  }
  
  return Math.round(originalAmount + totalBonus);
};

// Aplicar efectos de upgrades a reducción de costos
export const applyUpgradeToCostReduction = (
  originalCost: number,
  activityType: string,
  effects: UpgradeEffectsContext
): number => {
  const reductionPercent = effects.getUpgradeEffect('COST_REDUCTION', activityType);
  return Math.max(1, Math.round(originalCost * (1 - reductionPercent / 100)));
};

// Aplicar efectos de upgrades a bonus de resonancia
export const applyUpgradeToResonanceGain = (
  originalGain: number,
  effects: UpgradeEffectsContext
): number => {
  const bonusPercent = effects.getUpgradeEffect('RESONANCE_BONUS');
  return Math.round(originalGain * (1 + bonusPercent / 100));
};

// Aplicar efectos de upgrades a probabilidad de supervivencia
export const applyUpgradeToSurvivalRate = (
  originalDeathProbability: number,
  effects: UpgradeEffectsContext
): number => {
  const survivalBoostPercent = effects.getUpgradeEffect('SURVIVAL_BOOST');
  return originalDeathProbability * (1 - survivalBoostPercent / 100);
};

// Verificar si hay upgrades de automatización activos
export const getAutoActivityChance = (
  activityType: string,
  effects: UpgradeEffectsContext
): number => {
  return effects.getUpgradeEffect('AUTO_ACTIVITY', activityType);
};

// Wrapper para simplificar el uso en otros archivos
export const createUpgradeEffectsContext = (
  getUpgradeEffect: (effectType: UpgradeEffect['type'], target?: string) => number
): UpgradeEffectsContext => ({
  getUpgradeEffect
});
