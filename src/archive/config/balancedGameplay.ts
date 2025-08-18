/**
 * ⚖️ CONFIGURACIÓN BALANCEADA DE GAMEPLAY
 * 
 * Ajusta las velocidades de degradación para permitir dinámicas de supervivencia
 * más interesantes y ciclos de vida más estables
 */

import type { EntityStats, ActivityType } from '../types';


export const BALANCED_DEGRADATION = {

  BASE_DECAY_PER_SECOND: {
    hunger: 0.08,
    sleepiness: 0.06,
    loneliness: 0.04,
    boredom: 0.10,
    energy: 0.05,
    happiness: 0.03,
    health: 0.0,
    money: 0.02
  },


  ACTIVITY_MULTIPLIERS: {
    WANDERING: 1.0,
    MEDITATING: 0.3,
    WRITING: 0.6,
    RESTING: 0.2,
    SOCIALIZING: 0.8,
    EXPLORING: 1.2,
    CONTEMPLATING: 0.4,
    DANCING: 1.1,
    HIDING: 0.7,
    WORKING: 1.8,
    SHOPPING: 1.3,
    EXERCISING: 1.5,
    COOKING: 0.9
  } as Record<ActivityType, number>,


  CRITICAL_THRESHOLDS: {
    EMERGENCY: 5,
    CRITICAL: 15,
    WARNING: 30,
    LOW: 50,
    COMFORTABLE: 70
  },


  HEALTH_DECAY: {
    DECAY_PER_CRITICAL_STAT: 0.03,
    RECOVERY_RATE: 0.15,
    GRACE_PERIOD_THRESHOLD: 20,
    GRACE_PERIOD_MULTIPLIER: 0.1
  }
} as const;


export const BALANCED_ZONE_EFFECTS = {
  food: {
    primary: { hunger: 6 },
    secondary: { happiness: 1, energy: 1 },
    condition: (stats: EntityStats) => stats.hunger < 80
  },
  rest: {
    primary: { sleepiness: 8, energy: 5 },
    secondary: { happiness: 2 },
    condition: (stats: EntityStats) => stats.sleepiness < 80 || stats.energy < 70
  },
  play: {
    primary: { boredom: 10, happiness: 4 },
    secondary: { loneliness: 2, energy: -1 },
    condition: (stats: EntityStats) => stats.boredom < 70 || stats.happiness < 60
  },
  social: {
    primary: { loneliness: 12, happiness: 5 },
    secondary: { boredom: 4, energy: -1 },
    condition: (stats: EntityStats) => stats.loneliness < 60
  },
  work: {
    primary: { money: 20 },
    secondary: { boredom: -2, energy: -4, hunger: -2 },
    condition: (stats: EntityStats) => stats.money < 100
  },
  comfort: {
    primary: { happiness: 8, sleepiness: 4 },
    secondary: { loneliness: 5, boredom: 2 },
    condition: (stats: EntityStats) => stats.happiness < 70
  },
  energy: {
    primary: { energy: 12 },
    secondary: { sleepiness: 8, happiness: 2 },
    condition: (stats: EntityStats) => stats.energy < 60
  }
} as const;


export const BALANCED_SURVIVAL_COSTS = {
  BASIC_LIVING_COST_PER_MINUTE: 0.8,
  HUNGER_COST_MULTIPLIER: 1.2,
  ENERGY_COST_MULTIPLIER: 1.1,
  POVERTY_THRESHOLD: 20,
  WEALTH_THRESHOLD: 150,
  WEALTH_HAPPINESS_BONUS: 2
} as const;


export const BALANCED_INTERACTIONS = {
  FEED: {
    hunger: 25,
    happiness: 8,
    energy: 5,
    cooldown: 30000
  },
  PLAY: {
    boredom: 30,
    happiness: 15,
    loneliness: 10,
    energy: -8,
    cooldown: 45000
  },
  COMFORT: {
    happiness: 20,
    loneliness: 15,
    sleepiness: 8,
    cooldown: 60000
  },
  DISTURB: {
    happiness: -10,
    energy: -5,
    loneliness: 5,
    cooldown: 20000
  },
  NOURISH: {
    resonance: 20,
    allStats: 5,
    cooldown: 120000
  }
} as const;


export function calculateLifeExpectancy(stats: EntityStats): number {
  const criticalStats = [stats.hunger, stats.sleepiness, stats.loneliness, stats.energy];
  const lowestStat = Math.min(...criticalStats);
  
  if (lowestStat <= BALANCED_DEGRADATION.CRITICAL_THRESHOLDS.EMERGENCY) {
    return 30;
  }
  
  if (lowestStat <= BALANCED_DEGRADATION.CRITICAL_THRESHOLDS.CRITICAL) {
    return 120;
  }
  
  if (lowestStat <= BALANCED_DEGRADATION.CRITICAL_THRESHOLDS.WARNING) {
    return 300;
  }
  

  const decayRate = BALANCED_DEGRADATION.BASE_DECAY_PER_SECOND.hunger;
  const timeToZero = lowestStat / decayRate;
  
  return Math.min(timeToZero, 1800);
}


export function needsAttention(stats: EntityStats): {
  urgent: string[];
  warning: string[];
  suggestions: string[];
} {
  const urgent: string[] = [];
  const warning: string[] = [];
  const suggestions: string[] = [];
  
  const { EMERGENCY, CRITICAL, WARNING } = BALANCED_DEGRADATION.CRITICAL_THRESHOLDS;
  
  Object.entries(stats).forEach(([stat, value]) => {
    if (stat === 'money' || stat === 'health') return;
    
    if (value <= EMERGENCY) {
      urgent.push(stat);
    } else if (value <= CRITICAL) {
      warning.push(stat);
    } else if (value <= WARNING) {
      suggestions.push(stat);
    }
  });
  
  return { urgent, warning, suggestions };
}

export type BalancedConfig = typeof BALANCED_DEGRADATION;