import type { EntityStats, EntityActivity } from '../types';
import type { ActivityType, ZoneType } from "../constants";
import { gameConfig } from '../config/gameConfig';
import { logAutopoiesis } from './logger';
import { 
  ACTIVITY_OPTIMAL_DURATIONS,
  HYBRID_DECAY_RATES,
  ACTIVITY_DECAY_MULTIPLIERS,
  SURVIVAL_COSTS,
  DECAY_CONFIG,
  EFFICIENCY_FUNCTIONS
} from '../constants/activityConstants';

export const getActivityDynamics = () => ({
  WANDERING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.WANDERING },
  MEDITATING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.MEDITATING },
  WRITING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.WRITING },
  RESTING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.RESTING },
  SOCIALIZING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.SOCIALIZING },
  EXPLORING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.EXPLORING },
  CONTEMPLATING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.CONTEMPLATING },
  DANCING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.DANCING },
  HIDING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.HIDING },
  WORKING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.WORKING },
  SHOPPING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.SHOPPING },
  EXERCISING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.EXERCISING },
  COOKING: { optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.COOKING }
});


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
    perMinute: { 
      money: 5, 
      energy: -2, 
      boredom: -3, 
      hunger: -1 
    },
    minDuration: 60000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.WORKING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.WORKING,
    resultingMood: 'TIRED'
  },

  RESTING: {
    immediate: { sleepiness: -0.2, energy: 0.15 },
    perMinute: { 
      sleepiness: -15, 
      energy: 8, 
      hunger: -1 
    },
    minDuration: 45000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.RESTING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.RESTING,
    resultingMood: 'CALM'
  },

  SOCIALIZING: {
    immediate: { loneliness: 0.2, happiness: 0.1 },
    perMinute: { loneliness: 20, happiness: 8, energy: -3, hunger: -2 },
    minDuration: 20000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.SOCIALIZING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.SOCIALIZING,
    resultingMood: 'HAPPY'
  },

  DANCING: {
    immediate: { boredom: 0.2, happiness: 0.15, energy: -0.05 },
    perMinute: { boredom: 25, happiness: 15, energy: -5, hunger: -4 },
    minDuration: 15000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.DANCING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.DANCING,
    resultingMood: 'EXCITED'
  },

  SHOPPING: {
    immediate: { happiness: 0.2 },
    perMinute: { happiness: 10, hunger: 8, boredom: 5 },
    cost: { money: 5 },
    minDuration: 10000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.SHOPPING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.SHOPPING,
    resultingMood: 'CONTENT'
  },

  COOKING: {
    immediate: { boredom: 0.05 },
    perMinute: { hunger: 20, happiness: 5, energy: -3 },
    cost: { money: 3 },
    minDuration: 25000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.COOKING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.COOKING,
    resultingMood: 'CONTENT'
  },

  EXERCISING: {
    immediate: { energy: -0.2, boredom: 0.1 },
    perMinute: { energy: -10, boredom: 8, happiness: 6, hunger: -6 },
    minDuration: 30000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.EXERCISING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.EXERCISING,
    resultingMood: 'EXCITED'
  },

  MEDITATING: {
    immediate: { happiness: 0.05, loneliness: -0.03 },
    perMinute: { happiness: 8, loneliness: -3, sleepiness: -5, boredom: 3 },
    minDuration: 60000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.MEDITATING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.MEDITATING,
    resultingMood: 'CALM'
  },

  WRITING: {
    immediate: { boredom: 0.15, loneliness: -0.05 },
    perMinute: { boredom: 15, happiness: 5, loneliness: -4, energy: -2 },
    minDuration: 45000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.WRITING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.WRITING,
    resultingMood: 'CONTENT'
  },

  WANDERING: {
    immediate: { boredom: 0.04, loneliness: -0.02 },
    perMinute: { boredom: 5, energy: -2, happiness: 2 },
    minDuration: 15000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.WANDERING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.WANDERING,
    resultingMood: 'CALM'
  },

  EXPLORING: {
    immediate: { boredom: 0.2, energy: -0.1 },
    perMinute: { boredom: 18, energy: -6, happiness: 8, hunger: -3 },
    minDuration: 30000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.EXPLORING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.EXPLORING,
    resultingMood: 'EXCITED'
  },

  CONTEMPLATING: {
    immediate: { boredom: 0.08, loneliness: -0.05 },
    perMinute: { boredom: 8, happiness: 4, loneliness: -5, energy: 1 },
    minDuration: 90000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.CONTEMPLATING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.CONTEMPLATING,
    resultingMood: 'CALM'
  },

  HIDING: {
    immediate: { loneliness: -0.2 },
    perMinute: { loneliness: -15, happiness: -5, energy: 3 },
    minDuration: 30000,
    optimalDuration: ACTIVITY_OPTIMAL_DURATIONS.HIDING,
    efficiencyOverTime: EFFICIENCY_FUNCTIONS.HIDING,
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
  if (!effects) {
    console.warn(`No effects found for activity: ${activity}`);
    return 0;
  }
  
  let priority = 0;


  const w = (v: number, alpha = 1.6) => 1 - Math.pow(Math.min(100, Math.max(0, v)) / 100, alpha);

  if (activity === 'WORKING') {
    priority += w(currentStats.money) * 100;
    priority -= w(100 - currentStats.energy) * 30;
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

  const efficiency = effects.efficiencyOverTime ? effects.efficiencyOverTime(timeSpentInActivity) : 0.5;
  priority *= efficiency;

  if (effects.optimalDuration && timeSpentInActivity > effects.optimalDuration * 1.5) {
    priority *= 0.5;
  }

  return Math.max(0, priority);
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
      const configuredRate = finalRate * DECAY_CONFIG.GENERAL_MULTIPLIER * timeMultiplier;
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
