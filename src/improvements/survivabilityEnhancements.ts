/**
 * 🛡️ MEJORAS AL SISTEMA DE SUPERVIVENCIA PARA CICLO DE VIDA MÍNIMO ESTABLE
 * 
 * Implementadas para preservar la muerte como mecánica pero asegurar mayor estabilidad
 * según solicitud del usuario: "mejora el sistema para que tengan un minimo ciclo de vida estable"
 */

import type { EntityStats } from '../types';


export const IMPROVED_CRITICAL_THRESHOLDS = {

  CRITICAL: 3,
  WARNING: 8,
  LOW: 15,
  SAFE: 25
} as const;


export const IMPROVED_HEALTH_CONFIG = {
  DECAY_PER_CRITICAL: 0.05,
  RECOVERY_RATE: 0.08,
  GRACE_PERIOD_THRESHOLD: 10,
  GRACE_PERIOD_MULTIPLIER: 0.3
} as const;


export const IMPROVED_ACTIVITY_DECAY_MULTIPLIERS = {
  WORKING: 1.3,
  SHOPPING: 1.1,
  EXERCISING: 1.3,
  SOCIALIZING: 1.2,
  DANCING: 1.1,
  EXPLORING: 1.2,

  RESTING: 0.4,
  MEDITATING: 0.6,
  CONTEMPLATING: 0.7,
  WRITING: 0.9,
  WANDERING: 1.0,
  HIDING: 0.8,
  COOKING: 1.1
} as const;


export const IMPROVED_SURVIVAL_COSTS = {
  LIVING_COST: 1.5,
  CRITICAL_MONEY: 15,
  CRITICAL_HUNGER: 15,
  CRITICAL_ENERGY: 12,
  CRITICAL_SLEEPINESS: 15,
  POVERTY_MULTIPLIER: 0.7
} as const;


export interface SurvivalAlert {
  type: 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  stats: string[];
  timeToDeathEstimate: number;
  recommendedActions: string[];
}

export const calculateSurvivalAlert = (stats: EntityStats, health: number): SurvivalAlert | null => {
  const criticalStats = Object.entries(stats)
    .filter(([key, value]) => {
      if (key === 'money' || key === 'health') return false;
      return value < IMPROVED_CRITICAL_THRESHOLDS.CRITICAL;
    })
    .map(([key]) => key);

  const warningStats = Object.entries(stats)
    .filter(([key, value]) => {
      if (key === 'money' || key === 'health') return false;
      return value < IMPROVED_CRITICAL_THRESHOLDS.WARNING && value >= IMPROVED_CRITICAL_THRESHOLDS.CRITICAL;
    })
    .map(([key]) => key);

  if (criticalStats.length > 0 || health < 20) {
    const timeToDeathEstimate = health / (criticalStats.length * IMPROVED_HEALTH_CONFIG.DECAY_PER_CRITICAL);
    return {
      type: 'EMERGENCY',
      stats: criticalStats,
      timeToDeathEstimate,
      recommendedActions: [
        'Buscar zona de descanso inmediatamente',
        'Priorizar stats más críticas',
        'Evitar actividades costosas'
      ]
    };
  }

  if (warningStats.length > 0 || health < 40) {
    return {
      type: 'WARNING',
      stats: warningStats,
      timeToDeathEstimate: 300,
      recommendedActions: [
        'Atender stats en zona amarilla',
        'Buscar actividades regenerativas',
        'Monitorear dinero'
      ]
    };
  }

  return null;
};


export const applyImprovedHealthRecovery = (
  currentHealth: number,
  criticalCount: number,
  resonance: number,
  deltaTime: number
): number => {
  let healthChange = (deltaTime / 1000) * (
    IMPROVED_HEALTH_CONFIG.RECOVERY_RATE + 
    (resonance - 50) / 1000
  );

  if (criticalCount > 0) {
    let decayRate = criticalCount * IMPROVED_HEALTH_CONFIG.DECAY_PER_CRITICAL;
    

    if (currentHealth < IMPROVED_HEALTH_CONFIG.GRACE_PERIOD_THRESHOLD) {
      decayRate *= IMPROVED_HEALTH_CONFIG.GRACE_PERIOD_MULTIPLIER;
    }
    
    healthChange = -(decayRate * (deltaTime / 1000));
  }

  return Math.max(0, Math.min(100, currentHealth + healthChange));
};


export const applyImprovedSurvivalCosts = (
  currentStats: EntityStats,
  deltaTimeMs: number
): EntityStats => {
  const newStats = { ...currentStats };
  const minutesElapsed = (deltaTimeMs / 60000);


  newStats.money = Math.max(0, newStats.money - IMPROVED_SURVIVAL_COSTS.LIVING_COST * minutesElapsed);


  if (newStats.money < IMPROVED_SURVIVAL_COSTS.CRITICAL_MONEY) {
    const desperation = (IMPROVED_SURVIVAL_COSTS.CRITICAL_MONEY - newStats.money) / IMPROVED_SURVIVAL_COSTS.CRITICAL_MONEY;
    const softPenalty = desperation * IMPROVED_SURVIVAL_COSTS.POVERTY_MULTIPLIER;
    
    newStats.hunger = Math.max(0, newStats.hunger - softPenalty * 3 * minutesElapsed);
    newStats.happiness = Math.max(0, newStats.happiness - softPenalty * 2 * minutesElapsed);
  }

  return newStats;
};


export const DIFFICULTY_CONFIGS = {
  EASY: {
    decayMultiplier: 0.7,
    healthDecayRate: 0.03,
    recoveryRate: 0.12,
    livingCost: 1.0
  },
  NORMAL: {
    decayMultiplier: 1.0,
    healthDecayRate: 0.05,
    recoveryRate: 0.08,
    livingCost: 1.5
  },
  HARD: {
    decayMultiplier: 1.3,
    healthDecayRate: 0.08,
    recoveryRate: 0.05,
    livingCost: 2.0
  }
} as const;

export type DifficultyLevel = keyof typeof DIFFICULTY_CONFIGS;
