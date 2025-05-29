// Sistema de dinámicas complejas para actividades
import type { EntityStats, EntityActivity, EntityMood } from '../types';
import { 
  applyUpgradeToActivityEffectiveness, 
  applyUpgradeToMoneyGeneration, 
  applyUpgradeToCostReduction,
  applyUpgradeToStatDecay,
  type UpgradeEffectsContext 
} from './upgradeEffects';
import { gameConfig } from '../config/gameConfig';
import { logAutopoiesis } from './logger';

// Definición de efectos complejos por actividad
export interface ActivityEffect {
  // Efectos inmediatos (por tick)
  immediate: Partial<EntityStats>;
  // Efectos por minuto de actividad
  perMinute: Partial<EntityStats>;
  // Costo por actividad (si aplica)
  cost?: {
    money?: number;
    energy?: number;
  };
  // Ganancia por actividad (si aplica)
  gain?: {
    money?: number;
    experience?: number;
  };
  // Duración mínima recomendada (en milisegundos)
  minDuration: number;
  // Duración óptima (en milisegundos)
  optimalDuration: number;
  // Eficiencia según tiempo (multiplicador)
  efficiencyOverTime: (timeSpent: number) => number;
  // Mood resultante
  resultingMood?: EntityMood;
}

// Definición de todas las dinámicas de actividades
export const ACTIVITY_DYNAMICS: Record<EntityActivity, ActivityEffect> = {
  WORKING: {
    immediate: { energy: -0.1, boredom: 0.05 },
    perMinute: { energy: -8, boredom: 5, happiness: -2 },
    gain: { money: 50 }, // 50 unidades de dinero por trabajo completo
    minDuration: 30000, // 30 segundos mínimo
    optimalDuration: 120000, // 2 minutos óptimo
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 30000) return 0.3; // Muy poco eficiente si es muy corto
      if (timeSpent > 300000) return 0.5; // Burnout después de 5 minutos
      return 1.0;
    },
    resultingMood: 'TIRED'
  },

  RESTING: {
    immediate: { sleepiness: -0.2, energy: 0.15 },
    perMinute: { sleepiness: -15, energy: 12, hunger: 3 }, // Dormir da hambre
    minDuration: 45000, // 45 segundos mínimo
    optimalDuration: 180000, // 3 minutos óptimo
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 45000) return 0.4;
      if (timeSpent > 300000) return 0.7; // Dormir demasiado no es tan eficiente
      return 1.0;
    },
    resultingMood: 'CALM'
  },

  SOCIALIZING: {
    immediate: { loneliness: -0.2, happiness: 0.1 },
    perMinute: { loneliness: -20, happiness: 8, energy: -3, hunger: 2 },
    minDuration: 20000, // 20 segundos mínimo
    optimalDuration: 90000, // 1.5 minutos óptimo
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 20000) return 0.5;
      return 1.0 + Math.min(0.5, timeSpent / 120000); // Bonus por socializar más tiempo
    },
    resultingMood: 'HAPPY'
  },

  DANCING: {
    immediate: { boredom: -0.2, happiness: 0.15, energy: -0.05 },
    perMinute: { boredom: -25, happiness: 15, energy: -5, hunger: 4 }, // Bailar da hambre
    minDuration: 15000, // 15 segundos mínimo
    optimalDuration: 60000, // 1 minuto óptimo
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent > 120000) return 0.6; // Cansancio excesivo
      return 1.0;
    },
    resultingMood: 'EXCITED'
  },

  SHOPPING: {
    immediate: { happiness: 0.2 },
    perMinute: { happiness: 10, hunger: -8, boredom: -5 }, // Comprar comida/entretenimiento
    cost: { money: 30 }, // Cuesta dinero
    minDuration: 10000, // 10 segundos mínimo
    optimalDuration: 30000, // 30 segundos óptimo
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent > 60000) return 0.5; // Gastar demasiado tiempo comprando
      return 1.0;
    },
    resultingMood: 'CONTENT'
  },

  COOKING: {
    immediate: { boredom: -0.05 },
    perMinute: { hunger: -20, happiness: 5, energy: -3 },
    cost: { money: 15 }, // Cuesta ingredientes
    minDuration: 25000, // 25 segundos mínimo
    optimalDuration: 45000, // 45 segundos óptimo
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 25000) return 0.3; // Comida quemada/cruda
      if (timeSpent > 90000) return 0.7; // Comida demasiado elaborada
      return 1.0;
    },
    resultingMood: 'CONTENT'
  },

  EXERCISING: {
    immediate: { energy: -0.2, boredom: -0.1 },
    perMinute: { energy: -10, boredom: -8, happiness: 6, hunger: 6 }, // Ejercicio da hambre
    minDuration: 30000, // 30 segundos mínimo
    optimalDuration: 90000, // 1.5 minutos óptimo
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 30000) return 0.4;
      if (timeSpent > 180000) return 0.5; // Sobreentrenamiento
      return 1.0 + Math.min(0.3, timeSpent / 120000); // Bonus por ejercicio prolongado
    },
    resultingMood: 'EXCITED'
  },

  MEDITATING: {
    immediate: { happiness: 0.05, loneliness: 0.03 },
    perMinute: { happiness: 8, loneliness: 3, sleepiness: -5, boredom: -3 },
    minDuration: 60000, // 1 minuto mínimo
    optimalDuration: 180000, // 3 minutos óptimo
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 60000) return 0.3;
      return Math.min(1.5, 0.5 + timeSpent / 120000); // Mejora con tiempo
    },
    resultingMood: 'CALM'
  },

  WRITING: {
    immediate: { boredom: -0.15, loneliness: 0.05 },
    perMinute: { boredom: -15, happiness: 5, loneliness: 4, energy: -2 },
    minDuration: 45000, // 45 segundos mínimo
    optimalDuration: 150000, // 2.5 minutos óptimo
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 45000) return 0.4;
      return Math.min(1.2, 0.6 + timeSpent / 200000);
    },
    resultingMood: 'CONTENT'
  },

  WANDERING: {
    immediate: { boredom: -0.04, loneliness: 0.02 },
    perMinute: { boredom: -5, energy: -2, happiness: 2 },
    minDuration: 15000, // 15 segundos mínimo
    optimalDuration: 60000, // 1 minuto óptimo
    efficiencyOverTime: () => 0.7, // Actividad neutral
    resultingMood: 'CALM'
  },

  EXPLORING: {
    immediate: { boredom: -0.2, energy: -0.1 },
    perMinute: { boredom: -18, energy: -6, happiness: 8, hunger: 3 },
    minDuration: 30000, // 30 segundos mínimo
    optimalDuration: 120000, // 2 minutos óptimo
    efficiencyOverTime: (timeSpent) => {
      return Math.min(1.3, 0.8 + timeSpent / 180000);
    },
    resultingMood: 'EXCITED'
  },

  CONTEMPLATING: {
    immediate: { boredom: -0.08, loneliness: 0.05 },
    perMinute: { boredom: -8, happiness: 4, loneliness: 5, energy: 1 },
    minDuration: 90000, // 1.5 minutos mínimo
    optimalDuration: 240000, // 4 minutos óptimo
    efficiencyOverTime: (timeSpent) => {
      if (timeSpent < 90000) return 0.3;
      return Math.min(1.4, 0.5 + timeSpent / 180000);
    },
    resultingMood: 'CALM'
  },

  HIDING: {
    immediate: { loneliness: 0.2 }, // Eliminar 'anxiety' que no existe en EntityStats
    perMinute: { loneliness: 15, happiness: -5, energy: 3 },
    minDuration: 30000,
    optimalDuration: 90000,
    efficiencyOverTime: () => 0.6,
    resultingMood: 'ANXIOUS'
  }
};

// Cálculo de prioridad dinámico basado en necesidades y dinero
export const calculateActivityPriority = (
  activity: EntityActivity,
  currentStats: EntityStats,
  timeSpentInActivity: number = 0
): number => {
  const dynamics = ACTIVITY_DYNAMICS[activity];
  let priority = 0;

  // Prioridad base según urgencia de necesidades
  if (activity === 'WORKING') {
    // Prioridad alta si poco dinero
    priority += Math.max(0, (50 - currentStats.money) / 50) * 100;
    // Reduce prioridad si muy cansado
    priority -= Math.max(0, (currentStats.energy - 80) / 20) * 30;
  }

  if (activity === 'SHOPPING') {
    // Corregir verificación de dinero para evitar undefined
    const costMoney = dynamics.cost?.money ?? 0;
    if (currentStats.money > costMoney) {
      const needLevel = (currentStats.hunger + currentStats.boredom) / 2;
      priority += needLevel * 0.8;
    } else {
      priority = 0;
    }
  }

  if (activity === 'RESTING') {
    priority += Math.max(0, currentStats.sleepiness - 30) * 1.5;
    priority += Math.max(0, (100 - currentStats.energy) - 20) * 1.2;
  }

  if (activity === 'COOKING') {
    const costMoney = dynamics.cost?.money ?? 0;
    if (currentStats.money >= costMoney) {
      priority += Math.max(0, currentStats.hunger - 40) * 1.3;
    }
  }

  if (activity === 'SOCIALIZING') {
    priority += Math.max(0, currentStats.loneliness - 30) * 1.4;
  }

  if (activity === 'DANCING' || activity === 'EXERCISING') {
    priority += Math.max(0, currentStats.boredom - 40) * 1.1;
    // Reduce si muy cansado
    priority -= Math.max(0, currentStats.energy - 70) * 0.8;
  }

  // Ajustar por eficiencia temporal
  const efficiency = dynamics.efficiencyOverTime(timeSpentInActivity);
  priority *= efficiency;

  // Penalizar actividades muy largas
  if (timeSpentInActivity > dynamics.optimalDuration * 1.5) {
    priority *= 0.5;
  }

  return Math.max(0, priority);
};

// Determinar cuánto tiempo más debería continuar una actividad
export const getOptimalActivityDuration = (
  activity: EntityActivity,
  currentStats: EntityStats,
  timeAlreadySpent: number
): number => {
  const dynamics = ACTIVITY_DYNAMICS[activity];
  const urgencyMultiplier = calculateActivityUrgency(activity, currentStats);
  
  const baseDuration = dynamics.optimalDuration;
  const adjustedDuration = baseDuration * urgencyMultiplier;
  
  // No menos del mínimo, no más del doble del óptimo
  return Math.max(
    dynamics.minDuration - timeAlreadySpent,
    Math.min(adjustedDuration - timeAlreadySpent, dynamics.optimalDuration * 2 - timeAlreadySpent)
  );
};

// Calcular urgencia de una actividad específica
const calculateActivityUrgency = (activity: EntityActivity, stats: EntityStats): number => {
  switch (activity) {
    case 'WORKING':
      return Math.max(0.3, (50 - stats.money) / 50 * 2);
    case 'RESTING':
      return Math.max(0.5, (stats.sleepiness + (100 - stats.energy)) / 200 * 2);
    case 'SHOPPING':
    case 'COOKING':
      return Math.max(0.3, stats.hunger / 100 * 1.5);
    case 'SOCIALIZING':
      return Math.max(0.3, stats.loneliness / 100 * 1.5);
    case 'DANCING':
    case 'EXERCISING':
      return Math.max(0.3, stats.boredom / 100 * 1.2);
    default:
      return 1.0;
  }
};

// Aplicar efectos de actividad
export const applyActivityEffects = (
  currentStats: EntityStats,
  activity: EntityActivity,
  deltaTimeMs: number,
  isJustStarted: boolean = false,
  upgradeEffects?: UpgradeEffectsContext
): { newStats: EntityStats; cost: number; gain: number } => {
  const dynamics = ACTIVITY_DYNAMICS[activity];
  const newStats = { ...currentStats };
  let totalCost = 0;
  let totalGain = 0;

  // Aplicar efectos inmediatos (solo al empezar)
  if (isJustStarted && dynamics.immediate) {
    let immediateEffects = dynamics.immediate;
    
    // Aplicar mejoras de efectividad
    if (upgradeEffects) {
      immediateEffects = applyUpgradeToActivityEffectiveness(
        dynamics.immediate, 
        activity, 
        upgradeEffects
      );
    }
    
    Object.entries(immediateEffects).forEach(([stat, value]) => {
      if (stat in newStats && typeof value === 'number') {
        const statKey = stat as keyof EntityStats;
        newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + value)) as EntityStats[keyof EntityStats];
      }
    });
  }

  // Aplicar efectos por tiempo
  const minutesElapsed = deltaTimeMs / 60000;
  if (dynamics.perMinute) {
    let perMinuteEffects = dynamics.perMinute;
    
    // Aplicar mejoras de efectividad
    if (upgradeEffects) {
      perMinuteEffects = applyUpgradeToActivityEffectiveness(
        dynamics.perMinute, 
        activity, 
        upgradeEffects
      );
    }
    
    Object.entries(perMinuteEffects).forEach(([stat, value]) => {
      if (stat in newStats && typeof value === 'number') {
        const change = value * minutesElapsed;
        const statKey = stat as keyof EntityStats;
        newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + change)) as EntityStats[keyof EntityStats];
      }
    });
  }

  // Aplicar costos (con posibles reducciones de upgrades)
  if (dynamics.cost) {
    if (dynamics.cost.money && newStats.money >= dynamics.cost.money) {
      let costPerMinute = dynamics.cost.money;
      
      // Aplicar reducción de costos de upgrades
      if (upgradeEffects) {
        costPerMinute = applyUpgradeToCostReduction(costPerMinute, activity, upgradeEffects);
      }
      
      const totalActivityCost = costPerMinute * minutesElapsed;
      newStats.money -= totalActivityCost;
      totalCost += totalActivityCost;
    }
  }

  // Aplicar ganancias (con posibles bonificaciones de upgrades)
  if (dynamics.gain) {
    if (dynamics.gain.money) {
      let gainPerMinute = dynamics.gain.money;
      
      // Aplicar bonificaciones de dinero de upgrades
      if (upgradeEffects) {
        gainPerMinute = applyUpgradeToMoneyGeneration(gainPerMinute, activity, upgradeEffects);
      }
      
      const gainAmount = gainPerMinute * minutesElapsed;
      newStats.money += gainAmount;
      totalGain += gainAmount;
    }
  }

  // Mantener stats en rango válido
  Object.keys(newStats).forEach(key => {
    const statKey = key as keyof EntityStats;
    if (statKey === 'money') {
      newStats.money = Math.max(0, newStats.money); // El dinero no puede ser negativo
    } else {
      newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey])) as EntityStats[keyof EntityStats];
    }
  });

  return { newStats, cost: totalCost, gain: totalGain };
};

// Sistema híbrido de decay rates para complementar las dinámicas de actividad
export const HYBRID_DECAY_RATES = {
  // Decay base mucho más suave para cambios graduales
  base: {
    hunger: 0.8,        // Mucho más suave
    sleepiness: 0.6,    
    energy: -0.4,       // Pérdida de energía gradual
    boredom: 0.5,       
    loneliness: 0.3,    
    happiness: -0.2     // Cambio muy gradual en felicidad
  },
  // Multiplicadores por actividad (más moderados)
  activityModifiers: {
    'WORKING': { hunger: 1.2, energy: 1.5, boredom: 1.3 },
    'SHOPPING': { happiness: -1.5, hunger: -0.6 },
    'COOKING': { hunger: -2.0, happiness: -0.3 },
    'EXERCISING': { energy: 1.3, hunger: 1.5, happiness: -0.8 },
    'RESTING': { sleepiness: -2.0, energy: -1.5 },
    'SOCIALIZING': { loneliness: -2.0, happiness: -0.8 },
    'DANCING': { boredom: -2.0, happiness: -1.2, energy: 1.2 },
    'EXPLORING': { hunger: 1.1, boredom: -0.8 },
    'MEDITATING': { happiness: -1.2, boredom: -1.0, loneliness: 0.6 },
    'CONTEMPLATING': { happiness: -1.0, boredom: -0.8 },
    'WRITING': { boredom: -1.2, loneliness: 0.3 },
    'WANDERING': { boredom: -0.3 },
    'HIDING': { loneliness: 1.2, happiness: 0.8 }
  } as Record<EntityActivity, Record<string, number>>
};

// Aplicar decay híbrido a las estadísticas de una entidad
export const applyHybridDecay = (
  currentStats: EntityStats,
  activity: EntityActivity,
  deltaTimeMs: number,
  upgradeEffects?: UpgradeEffectsContext
): EntityStats => {
  const newStats = { ...currentStats };
  const timeMultiplier = deltaTimeMs / 1000;
  
  // Aplicar decay base con modificadores de actividad
  Object.entries(HYBRID_DECAY_RATES.base).forEach(([statName, baseRate]) => {
    if (statName in newStats) {
      let finalRate = baseRate;
      
      // Aplicar modificador de actividad si existe
      const activityMod = HYBRID_DECAY_RATES.activityModifiers[activity];
      if (activityMod && statName in activityMod) {
        finalRate += activityMod[statName];
      }
      
      // Aplicar mejoras de upgrades para reducir decay
      if (upgradeEffects) {
        finalRate = applyUpgradeToStatDecay ? applyUpgradeToStatDecay(finalRate, upgradeEffects) : finalRate;
      }
      
      // Aplicar decay ajustado por configuración
      const configuredRate = finalRate * gameConfig.baseDecayMultiplier * timeMultiplier;
      const statKey = statName as keyof EntityStats;
      
      if (statKey !== 'money') { // El dinero se maneja por separado
        newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + configuredRate)) as EntityStats[keyof EntityStats];
      }
    }
  });

  logAutopoiesis.debug(`Decay aplicado a entidad`, { 
    activity, 
    changes: Object.fromEntries(
      Object.entries(newStats).map(([k, v]) => [k, v - currentStats[k as keyof EntityStats]])
    )
  });

  return newStats;
};

// Costos pasivos de supervivencia (se aplican constantemente)
export const SURVIVAL_COSTS = {
  // Costo base de supervivencia por minuto
  LIVING_COST: 2, // dinero por minuto
  // Umbrales críticos para forzar actividades
  CRITICAL_MONEY: 20,
  CRITICAL_HUNGER: 80,
  CRITICAL_ENERGY: 15,
  CRITICAL_SLEEPINESS: 85
};

// Aplicar costos pasivos de supervivencia
export const applySurvivalCosts = (
  currentStats: EntityStats,
  deltaTimeMs: number
): EntityStats => {
  const newStats = { ...currentStats };
  const minutesElapsed = deltaTimeMs / 60000;

  // Costo de vivir
  newStats.money = Math.max(0, newStats.money - SURVIVAL_COSTS.LIVING_COST * minutesElapsed);

  // Si no tiene dinero, las necesidades suben más rápido
  if (newStats.money < SURVIVAL_COSTS.CRITICAL_MONEY) {
    const desperation = (SURVIVAL_COSTS.CRITICAL_MONEY - newStats.money) / SURVIVAL_COSTS.CRITICAL_MONEY;
    newStats.hunger = Math.min(100, newStats.hunger + desperation * 5 * minutesElapsed);
    newStats.happiness = Math.max(0, newStats.happiness - desperation * 3 * minutesElapsed);
  }

  return newStats;
};
