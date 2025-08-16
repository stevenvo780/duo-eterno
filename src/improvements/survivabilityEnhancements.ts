/**
 * 🛡️ MEJORAS AL SISTEMA DE SUPERVIVENCIA PARA CICLO DE VIDA MÍNIMO ESTABLE
 * 
 * Implementadas para preservar la muerte como mecánica pero asegurar mayor estabilidad
 * según solicitud del usuario: "mejora el sistema para que tengan un minimo ciclo de vida estable"
 */

import type { EntityStats } from '../types';

// ✅ MEJORA 1: Umbrales críticos más tolerantes
export const IMPROVED_CRITICAL_THRESHOLDS = {
  // Antes: < 5 era crítico, ahora < 3 es crítico (más tiempo de reacción)
  CRITICAL: 3,
  WARNING: 8,  // Nuevo: nivel de alerta temprana
  LOW: 15,
  SAFE: 25
} as const;

// ✅ MEJORA 2: Configuración de salud más balanceada
export const IMPROVED_HEALTH_CONFIG = {
  DECAY_PER_CRITICAL: 0.05,  // Antes: 0.1, reducido a la mitad
  RECOVERY_RATE: 0.08,       // Antes: 0.05, aumentado 60%
  GRACE_PERIOD_THRESHOLD: 10, // Nuevo: período de gracia cuando health < 10
  GRACE_PERIOD_MULTIPLIER: 0.3 // Decay 70% más lento en período de gracia
} as const;

// ✅ MEJORA 3: Multiplicadores de decay más suaves
export const IMPROVED_ACTIVITY_DECAY_MULTIPLIERS = {
  WORKING: 1.3,      // Antes: 1.6, reducido
  SHOPPING: 1.1,     // Antes: 1.2, reducido
  EXERCISING: 1.3,   // Antes: 1.5, reducido
  SOCIALIZING: 1.2,  // Antes: 1.3, reducido
  DANCING: 1.1,      // Antes: 1.2, reducido
  EXPLORING: 1.2,    // Antes: 1.3, reducido
  // Actividades relajantes sin cambios
  RESTING: 0.4,
  MEDITATING: 0.6,
  CONTEMPLATING: 0.7,
  WRITING: 0.9,
  WANDERING: 1.0,
  HIDING: 0.8,
  COOKING: 1.1
} as const;

// ✅ MEJORA 4: Costos de supervivencia balanceados
export const IMPROVED_SURVIVAL_COSTS = {
  LIVING_COST: 1.5,          // Antes: 2, reducido 25%
  CRITICAL_MONEY: 15,        // Antes: 20, umbral más bajo
  CRITICAL_HUNGER: 15,       // Antes: 20, más tolerante
  CRITICAL_ENERGY: 12,       // Antes: 15, más tolerante
  CRITICAL_SLEEPINESS: 15,   // Antes: 20, más tolerante
  POVERTY_MULTIPLIER: 0.7    // Nuevo: penalizaciones por pobreza menos severas
} as const;

// ✅ MEJORA 5: Sistema de alertas tempranas
export interface SurvivalAlert {
  type: 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  stats: string[];
  timeToDeathEstimate: number; // en segundos
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
      timeToDeathEstimate: 300, // 5 minutos estimados
      recommendedActions: [
        'Atender stats en zona amarilla',
        'Buscar actividades regenerativas',
        'Monitorear dinero'
      ]
    };
  }

  return null;
};

// ✅ MEJORA 6: Sistema de recuperación mejorado
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
    
    // Período de gracia: decay más lento cuando health < 10
    if (currentHealth < IMPROVED_HEALTH_CONFIG.GRACE_PERIOD_THRESHOLD) {
      decayRate *= IMPROVED_HEALTH_CONFIG.GRACE_PERIOD_MULTIPLIER;
    }
    
    healthChange = -(decayRate * (deltaTime / 1000));
  }

  return Math.max(0, Math.min(100, currentHealth + healthChange));
};

// ✅ MEJORA 7: Función de costos de supervivencia mejorados
export const applyImprovedSurvivalCosts = (
  currentStats: EntityStats,
  deltaTimeMs: number
): EntityStats => {
  const newStats = { ...currentStats };
  const minutesElapsed = (deltaTimeMs / 60000);

  // Costo de vida reducido
  newStats.money = Math.max(0, newStats.money - IMPROVED_SURVIVAL_COSTS.LIVING_COST * minutesElapsed);

  // Penalizaciones por pobreza más suaves
  if (newStats.money < IMPROVED_SURVIVAL_COSTS.CRITICAL_MONEY) {
    const desperation = (IMPROVED_SURVIVAL_COSTS.CRITICAL_MONEY - newStats.money) / IMPROVED_SURVIVAL_COSTS.CRITICAL_MONEY;
    const softPenalty = desperation * IMPROVED_SURVIVAL_COSTS.POVERTY_MULTIPLIER;
    
    newStats.hunger = Math.max(0, newStats.hunger - softPenalty * 3 * minutesElapsed);
    newStats.happiness = Math.max(0, newStats.happiness - softPenalty * 2 * minutesElapsed);
  }

  return newStats;
};

// ✅ MEJORA 8: Configuración de dificultad ajustable
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
