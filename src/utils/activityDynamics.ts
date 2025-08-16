import type { EntityStats, EntityActivity } from '../types';
import type { ActivityType, ZoneType } from '../constants/gameConstants';
import { gameConfig } from '../config/gameConfig';
import { logAutopoiesis } from './logger';

export const ACTIVITY_DYNAMICS: Record<ActivityType, { optimalDuration: number }> = {
  WANDERING: { optimalDuration: 15000 },
  MEDITATING: { optimalDuration: 30000 },
  WRITING: { optimalDuration: 45000 },
  RESTING: { optimalDuration: 60000 },
  SOCIALIZING: { optimalDuration: 20000 },
  EXPLORING: { optimalDuration: 25000 },
  CONTEMPLATING: { optimalDuration: 35000 },
  DANCING: { optimalDuration: 20000 },
  HIDING: { optimalDuration: 10000 },
  WORKING: { optimalDuration: 120000 },
  SHOPPING: { optimalDuration: 30000 },
  EXERCISING: { optimalDuration: 40000 },
  COOKING: { optimalDuration: 50000 }
};

export const ACTIVITY_EFFECTS: Record<ActivityType, {
  immediate: Record<string, number>;
  perMinute: Record<string, number>;
  cost?: Record<string, number>;
  minDuration: number;
  optimalDuration: number;
  efficiencyOverTime: (timeSpent: number) => number;
  resultingMood: string;
}> = {
  WORKING: {
    immediate: { money: 10, energy: -0.3 },
    perMinute: { money: 50, energy: -8, boredom: -10, hunger: -5 },
    minDuration: 60000,
    optimalDuration: 180000,
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 60000) return 0.5;
      if (timeSpent > 300000) return 0.6;
      return 1.0;
    },
    resultingMood: 'TIRED'
  },

  RESTING: {
    immediate: { sleepiness: -0.2, energy: 0.15 },
    perMinute: { sleepiness: -15, energy: 12, hunger: -3 },
    minDuration: 45000,
    optimalDuration: 180000,
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 45000) return 0.4;
      if (timeSpent > 300000) return 0.7;
      return 1.0;
    },
    resultingMood: 'CALM'
  },

  SOCIALIZING: {
    immediate: { loneliness: 0.2, happiness: 0.1 },
    perMinute: { loneliness: 20, happiness: 8, energy: -3, hunger: -2 },
    minDuration: 20000,
    optimalDuration: 90000,
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 20000) return 0.5;
      return 1.0 + Math.min(0.5, timeSpent / 120000);
    },
    resultingMood: 'HAPPY'
  },

  DANCING: {
    immediate: { boredom: 0.2, happiness: 0.15, energy: -0.05 },
    perMinute: { boredom: 25, happiness: 15, energy: -5, hunger: -4 },
    minDuration: 15000,
    optimalDuration: 60000,
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent > 120000) return 0.6;
      return 1.0;
    },
    resultingMood: 'EXCITED'
  },

  SHOPPING: {
    immediate: { happiness: 0.2 },
    perMinute: { happiness: 10, hunger: 8, boredom: 5 },
    cost: { money: 30 },
    minDuration: 10000,
    optimalDuration: 30000,
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent > 60000) return 0.5;
      return 1.0;
    },
    resultingMood: 'CONTENT'
  },

  COOKING: {
    immediate: { boredom: 0.05 },
    perMinute: { hunger: 20, happiness: 5, energy: -3 },
    cost: { money: 15 },
    minDuration: 25000,
    optimalDuration: 45000,
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 25000) return 0.3;
      if (timeSpent > 90000) return 0.7;
      return 1.0;
    },
    resultingMood: 'CONTENT'
  },

  EXERCISING: {
    immediate: { energy: -0.2, boredom: 0.1 },
    perMinute: { energy: -10, boredom: 8, happiness: 6, hunger: -6 },
    minDuration: 30000,
    optimalDuration: 90000,
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 30000) return 0.4;
      if (timeSpent > 180000) return 0.5;
      return 1.0 + Math.min(0.3, timeSpent / 120000);
    },
    resultingMood: 'EXCITED'
  },

  MEDITATING: {
    immediate: { happiness: 0.05, loneliness: -0.03 },
    perMinute: { happiness: 8, loneliness: -3, sleepiness: -5, boredom: 3 },
    minDuration: 60000,
    optimalDuration: 180000,
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 60000) return 0.3;
      return Math.min(1.5, 0.5 + timeSpent / 120000);
    },
    resultingMood: 'CALM'
  },

  WRITING: {
    immediate: { boredom: 0.15, loneliness: -0.05 },
    perMinute: { boredom: 15, happiness: 5, loneliness: -4, energy: -2 },
    minDuration: 45000,
    optimalDuration: 150000,
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 45000) return 0.4;
      return Math.min(1.2, 0.6 + timeSpent / 200000);
    },
    resultingMood: 'CONTENT'
  },

  WANDERING: {
    immediate: { boredom: 0.04, loneliness: -0.02 },
    perMinute: { boredom: 5, energy: -2, happiness: 2 },
    minDuration: 15000,
    optimalDuration: 60000,
    efficiencyOverTime: () => 0.7,
    resultingMood: 'CALM'
  },

  EXPLORING: {
    immediate: { boredom: 0.2, energy: -0.1 },
    perMinute: { boredom: 18, energy: -6, happiness: 8, hunger: -3 },
    minDuration: 30000,
    optimalDuration: 120000,
    efficiencyOverTime: (timeSpent) => {
      return Math.min(1.3, 0.8 + timeSpent / 180000);
    },
    resultingMood: 'EXCITED'
  },

  CONTEMPLATING: {
    immediate: { boredom: 0.08, loneliness: -0.05 },
    perMinute: { boredom: 8, happiness: 4, loneliness: -5, energy: 1 },
    minDuration: 90000,
    optimalDuration: 240000,
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 90000) return 0.3;
      return Math.min(1.4, 0.5 + timeSpent / 180000);
    },
    resultingMood: 'CALM'
  },

  HIDING: {
    immediate: { loneliness: -0.2 },
    perMinute: { loneliness: -15, happiness: -5, energy: 3 },
    minDuration: 30000,
    optimalDuration: 90000,
    efficiencyOverTime: () => 0.6,
    resultingMood: 'ANXIOUS'
  }
};

export const mapActivityToPreferredZone = (activity: EntityActivity): ZoneType | null => {
  switch (activity) {
    case 'RESTING': return 'rest';
    case 'SOCIALIZING':
    case 'DANCING': return 'social';
    case 'EXERCISING':
    case 'WANDERING':
    case 'EXPLORING': return 'play';
    case 'WORKING': return 'work';
    case 'COOKING': return 'food';
    case 'SHOPPING': return 'work';
    case 'MEDITATING':
    case 'CONTEMPLATING':
    case 'WRITING': return 'comfort';
    case 'HIDING': return 'comfort';
    default: return null;
  }
};

export const calculateActivityPriority = (
  activity: EntityActivity,
  currentStats: EntityStats,
  timeSpentInActivity: number = 0
): number => {
  const effects = ACTIVITY_EFFECTS[activity];
  let priority = 0;

  // Nonlinear need weighting: higher weight when stat is low, saturates when high
  const w = (v: number, alpha = 1.6) => 1 - Math.pow(Math.min(100, Math.max(0, v)) / 100, alpha);

  if (activity === 'WORKING') {
    priority += w(currentStats.money) * 100;
    priority -= w(100 - currentStats.energy) * 30; // penalize fatigue
  }

  if (activity === 'SHOPPING') {
    const costMoney = effects.cost?.money ?? 0;
    if (currentStats.money > costMoney) {
      const needLevel = (w(currentStats.hunger) + w(currentStats.boredom)) / 2;
      priority += needLevel * 100 * 0.8;
    } else {
      priority = 0;
    }
  }

  if (activity === 'RESTING') {
    priority += Math.max(0, (currentStats.sleepiness - 30)) * 1.2 + w(100 - currentStats.energy) * 80;
  }

  if (activity === 'COOKING') {
    const costMoney = effects.cost?.money ?? 0;
    if (currentStats.money >= costMoney) {
      priority += w(currentStats.hunger) * 100 * 0.9;
    }
  }

  if (activity === 'SOCIALIZING') {
    priority += w(currentStats.loneliness) * 100 * 1.1;
  }

  if (activity === 'DANCING' || activity === 'EXERCISING') {
    priority += w(currentStats.boredom) * 100 * 0.9;
    priority -= w(100 - currentStats.energy) * 50;
  }

  const efficiency = effects.efficiencyOverTime(timeSpentInActivity);
  priority *= efficiency;

  if (timeSpentInActivity > effects.optimalDuration * 1.5) {
    priority *= 0.5;
  }

  return Math.max(0, priority);
};

const HYBRID_DECAY_RATES = {
  base: {
    hunger: -0.3,
    sleepiness: -0.2,
    boredom: -0.2,
    loneliness: -0.15,
    energy: -0.15,
    happiness: -0.1
  }
} as const;

const ACTIVITY_DECAY_MULTIPLIERS: Record<EntityActivity, number> = {
  WORKING: 1.4,      // 🔧 MEJORA MINIMALISTA: Reducido de 1.6 → 1.4 (12.5% menos penalizado)
  SHOPPING: 1.2,
  COOKING: 1.1,
  EXERCISING: 1.5,
  RESTING: 0.4,
  SOCIALIZING: 1.3,
  DANCING: 1.2,
  EXPLORING: 1.3,
  MEDITATING: 0.6,
  CONTEMPLATING: 0.7,
  WRITING: 0.9,
  WANDERING: 1.0,
  HIDING: 0.8
};

export const applyHybridDecay = (
  currentStats: EntityStats,
  activity: EntityActivity,
  deltaTimeMs: number
): EntityStats => {
  const newStats = { ...currentStats };
  const timeMultiplier = (deltaTimeMs / 1000) * gameConfig.gameSpeedMultiplier;
  
  const decayMultiplier = ACTIVITY_DECAY_MULTIPLIERS[activity] ?? 1.0;

  Object.entries(HYBRID_DECAY_RATES.base).forEach(([statName, baseRate]) => {
    if (statName in newStats) {
      const finalRate = baseRate * decayMultiplier;
      const configuredRate = finalRate * gameConfig.baseDecayMultiplier * timeMultiplier;
      const statKey = statName as keyof EntityStats;
      
      let newValue = newStats[statKey] + configuredRate;

      if (statKey === 'money') {
        newValue = Math.max(0, newValue);
      } else {
        newValue = Math.max(0, Math.min(100, newValue));
      }
      
      newStats[statKey] = newValue as EntityStats[keyof EntityStats];
    }
  });

  logAutopoiesis.debug('Decay aplicado', { 
    activity, 
    changes: Object.fromEntries(
      Object.entries(newStats).map(([k, v]) => [k, v - currentStats[k as keyof EntityStats]])
    )
  });

  return newStats;
};

const SURVIVAL_COSTS = {
  LIVING_COST: 2,
  CRITICAL_MONEY: 20,
  CRITICAL_HUNGER: 20,
  CRITICAL_ENERGY: 15,
  CRITICAL_SLEEPINESS: 20
};

export const applySurvivalCosts = (
  currentStats: EntityStats,
  deltaTimeMs: number
): EntityStats => {
  const newStats = { ...currentStats };
  const minutesElapsed = (deltaTimeMs / 60000) * gameConfig.gameSpeedMultiplier;

  newStats.money = Math.max(0, newStats.money - SURVIVAL_COSTS.LIVING_COST * minutesElapsed);

  if (newStats.money < SURVIVAL_COSTS.CRITICAL_MONEY) {
    const desperation = (SURVIVAL_COSTS.CRITICAL_MONEY - newStats.money) / SURVIVAL_COSTS.CRITICAL_MONEY;
    newStats.hunger = Math.max(0, newStats.hunger - desperation * 5 * minutesElapsed);
    newStats.happiness = Math.max(0, newStats.happiness - desperation * 3 * minutesElapsed);
  }

  return newStats;
};
