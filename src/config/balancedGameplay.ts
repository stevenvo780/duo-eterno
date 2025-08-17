/**
 * ⚖️ CONFIGURACIÓN BALANCEADA DE GAMEPLAY
 * 
 * Ajusta las velocidades de degradación para permitir dinámicas de supervivencia
 * más interesantes y ciclos de vida más estables
 */

import type { EntityStats, ActivityType } from '../types';

// 🎯 VELOCIDADES DE DEGRADACIÓN BALANCEADAS
export const BALANCED_DEGRADATION = {
  // Degradación base por segundo (mucho más lenta)
  BASE_DECAY_PER_SECOND: {
    hunger: 0.08,      // Antes: ~0.5-1.0 - Ahora dura ~20 minutos
    sleepiness: 0.06,  // Antes: ~0.4-0.8 - Ahora dura ~27 minutos  
    loneliness: 0.04,  // Antes: ~0.3-0.6 - Ahora dura ~40 minutos
    boredom: 0.10,     // Antes: ~0.6-1.2 - Ahora dura ~16 minutos
    energy: 0.05,      // Antes: ~0.4-0.7 - Ahora dura ~33 minutos
    happiness: 0.03,   // Antes: ~0.2-0.5 - Ahora dura ~55 minutos
    health: 0.0,       // Solo se degrada por estadísticas críticas
    money: 0.02        // Costo de vida muy bajo
  },

  // Multiplicadores por actividad (más suaves)
  ACTIVITY_MULTIPLIERS: {
    WANDERING: 1.0,
    MEDITATING: 0.3,      // Muy relajante
    WRITING: 0.6,         // Relajante pero mental
    RESTING: 0.2,         // Casi detiene degradación
    SOCIALIZING: 0.8,     // Reduce loneliness mucho
    EXPLORING: 1.2,       // Ligeramente más desgastante
    CONTEMPLATING: 0.4,   // Muy relajante
    DANCING: 1.1,         // Ligeramente más energético
    HIDING: 0.7,          // Reduce stress pero aumenta loneliness
    WORKING: 1.8,         // Desgastante pero genera dinero
    SHOPPING: 1.3,        // Moderadamente desgastante
    EXERCISING: 1.5,      // Desgastante a corto plazo, bueno a largo
    COOKING: 0.9          // Ligeramente productivo
  } as Record<ActivityType, number>,

  // Umbrales críticos más generosos
  CRITICAL_THRESHOLDS: {
    EMERGENCY: 5,    // Muerte inminente
    CRITICAL: 15,    // Muy peligroso
    WARNING: 30,     // Necesita atención
    LOW: 50,         // Podría mejorar
    COMFORTABLE: 70   // Estado bueno
  },

  // Configuración de salud mejorada
  HEALTH_DECAY: {
    DECAY_PER_CRITICAL_STAT: 0.03,  // Antes: 0.07, mucho más suave
    RECOVERY_RATE: 0.15,            // Antes: 0.05, mucho más rápido
    GRACE_PERIOD_THRESHOLD: 20,     // Período de gracia cuando health < 20
    GRACE_PERIOD_MULTIPLIER: 0.1    // Decay 90% más lento en gracia
  }
} as const;

// 🏠 EFECTOS DE ZONAS BALANCEADOS (MÁS LENTOS)
export const BALANCED_ZONE_EFFECTS = {
  food: {
    primary: { hunger: 6 },     // Reducido de 12 a 6 por minuto
    secondary: { happiness: 1, energy: 1 },  // Reducidos
    condition: (stats: EntityStats) => stats.hunger < 80  // Más generoso
  },
  rest: {
    primary: { sleepiness: 8, energy: 5 },   // Reducidos de 15 y 10
    secondary: { happiness: 2 },
    condition: (stats: EntityStats) => stats.sleepiness < 80 || stats.energy < 70
  },
  play: {
    primary: { boredom: 10, happiness: 4 },  // Reducidos de 20 y 8
    secondary: { loneliness: 2, energy: -1 },
    condition: (stats: EntityStats) => stats.boredom < 70 || stats.happiness < 60
  },
  social: {
    primary: { loneliness: 12, happiness: 5 },  // Reducidos de 25 y 10
    secondary: { boredom: 4, energy: -1 },
    condition: (stats: EntityStats) => stats.loneliness < 60
  },
  work: {
    primary: { money: 20 },  // Reducido de 40
    secondary: { boredom: -2, energy: -4, hunger: -2 },
    condition: (stats: EntityStats) => stats.money < 100
  },
  comfort: {
    primary: { happiness: 8, sleepiness: 4 },  // Reducidos de 15 y 8
    secondary: { loneliness: 5, boredom: 2 },
    condition: (stats: EntityStats) => stats.happiness < 70
  },
  energy: {
    primary: { energy: 12 },  // Reducido de 25
    secondary: { sleepiness: 8, happiness: 2 },
    condition: (stats: EntityStats) => stats.energy < 60
  }
} as const;

// 💰 COSTOS DE VIDA REALISTAS
export const BALANCED_SURVIVAL_COSTS = {
  BASIC_LIVING_COST_PER_MINUTE: 0.8,  // Antes: 2.0, mucho más barato
  HUNGER_COST_MULTIPLIER: 1.2,        // Cuando hungry, cuesta más vivir
  ENERGY_COST_MULTIPLIER: 1.1,        // Cuando tired, cuesta más
  POVERTY_THRESHOLD: 20,               // Menos de esto es pobreza
  WEALTH_THRESHOLD: 150,               // Más de esto es riqueza
  WEALTH_HAPPINESS_BONUS: 2            // Por minuto cuando wealthy
} as const;

// 🎮 DINÁMICAS DE INTERACCIÓN MEJORADAS
export const BALANCED_INTERACTIONS = {
  FEED: {
    hunger: 25,          // Alimentar da mucha hunger
    happiness: 8,        // Y un poco de felicidad
    energy: 5,           // Y un poco de energía
    cooldown: 30000      // 30 segundos de cooldown
  },
  PLAY: {
    boredom: 30,         // Jugar quita mucho aburrimiento
    happiness: 15,       // Y da bastante felicidad
    loneliness: 10,      // Y reduce soledad
    energy: -8,          // Pero cansa
    cooldown: 45000      // 45 segundos de cooldown
  },
  COMFORT: {
    happiness: 20,       // Consolar da mucha felicidad
    loneliness: 15,      // Y reduce soledad
    sleepiness: 8,       // Y relaja
    cooldown: 60000      // 1 minuto de cooldown
  },
  DISTURB: {
    happiness: -10,      // Molestar reduce felicidad
    energy: -5,          // Y energía
    loneliness: 5,       // Pero puede llamar atención
    cooldown: 20000      // 20 segundos de cooldown
  },
  NOURISH: {
    resonance: 20,       // Nutrir vínculo da resonancia
    allStats: 5,         // Y mejora ligeramente todas las stats
    cooldown: 120000     // 2 minutos de cooldown
  }
} as const;

// 📊 CALCULAR EXPECTATIVA DE VIDA
export function calculateLifeExpectancy(stats: EntityStats): number {
  const criticalStats = [stats.hunger, stats.sleepiness, stats.loneliness, stats.energy];
  const lowestStat = Math.min(...criticalStats);
  
  if (lowestStat <= BALANCED_DEGRADATION.CRITICAL_THRESHOLDS.EMERGENCY) {
    return 30; // 30 segundos si muy crítico
  }
  
  if (lowestStat <= BALANCED_DEGRADATION.CRITICAL_THRESHOLDS.CRITICAL) {
    return 120; // 2 minutos si crítico
  }
  
  if (lowestStat <= BALANCED_DEGRADATION.CRITICAL_THRESHOLDS.WARNING) {
    return 300; // 5 minutos si warning
  }
  
  // Calcular basado en la stat más baja
  const decayRate = BALANCED_DEGRADATION.BASE_DECAY_PER_SECOND.hunger; // Usar hunger como referencia
  const timeToZero = lowestStat / decayRate;
  
  return Math.min(timeToZero, 1800); // Máximo 30 minutos
}

// 🎯 VERIFICAR SI NECESITA ATENCIÓN
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
    if (stat === 'money' || stat === 'health') return; // Skip special stats
    
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