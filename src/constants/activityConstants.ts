/**
 * 🎯 CONSTANTES DE ACTIVIDADES Y DINÁMICAS
 * 
 * Contiene todas las constantes relacionadas con:
 * - Efectos de actividades
 * - Duraciones óptimas
 * - Tasas de decaimiento
 * - Costos de supervivencia
 * - Multiplicadores de eficiencia
 */

import type { EntityActivity } from '../types';



export const ACTIVITY_OPTIMAL_DURATIONS = {
  WANDERING: 60000,
  MEDITATING: 180000,
  WRITING: 150000,
  RESTING: 120000,
  SOCIALIZING: 90000,
  EXPLORING: 120000,
  CONTEMPLATING: 240000,
  DANCING: 60000,
  HIDING: 90000,
  WORKING: 180000,
  SHOPPING: 30000,
  EXERCISING: 90000,
  COOKING: 45000,
} as const;



export const HYBRID_DECAY_RATES = {
  base: {
    hunger: -2,
    sleepiness: -1.5,
    boredom: -1,
    loneliness: -0.8,
    energy: -1.2,
    happiness: -0.5
  }
} as const;



export const ACTIVITY_DECAY_MULTIPLIERS: Record<EntityActivity, number> = {
  WORKING: 1.2,
  SHOPPING: 1.1,
  COOKING: 1.0,
  EXERCISING: 1.3,
  RESTING: 0.6,
  SOCIALIZING: 1.1,
  DANCING: 1.2,
  EXPLORING: 1.2,
  MEDITATING: 0.7,
  CONTEMPLATING: 0.8,
  WRITING: 0.9,
  WANDERING: 1.0,
  HIDING: 0.9
} as const;



export const SURVIVAL_COSTS = {
  LIVING_COST: 0.5,
  CRITICAL_MONEY: 10,
  CRITICAL_HUNGER: 20,
  CRITICAL_ENERGY: 15,
  CRITICAL_SLEEPINESS: 20
} as const;



export const DECAY_CONFIG = {
  GENERAL_MULTIPLIER: 1.0,
  TIME_BASED_MULTIPLIER: 1.0,
  ACTIVITY_BASED_ADJUSTMENT: 1.0
} as const;



export const EFFICIENCY_FUNCTIONS = {
  WORKING: (timeSpent: number) => {
    if (timeSpent < 60000) return 0.5;
    if (timeSpent > 300000) return 0.6;
    return 1.0;
  },
  
  RESTING: (timeSpent: number) => {
    if (timeSpent < 45000) return 0.4;
    if (timeSpent > 300000) return 0.7;
    return 1.0;
  },
  
  SOCIALIZING: (timeSpent: number) => {
    if (timeSpent < 20000) return 0.5;
    return 1.0 + Math.min(0.5, timeSpent / 120000);
  },
  
  DANCING: (timeSpent: number) => {
    if (timeSpent > 120000) return 0.6;
    return 1.0;
  },
  
  SHOPPING: (timeSpent: number) => {
    if (timeSpent > 60000) return 0.5;
    return 1.0;
  },
  
  COOKING: (timeSpent: number) => {
    if (timeSpent < 25000) return 0.3;
    if (timeSpent > 90000) return 0.7;
    return 1.0;
  },
  
  EXERCISING: (timeSpent: number) => {
    if (timeSpent < 30000) return 0.4;
    if (timeSpent > 180000) return 0.5;
    return 1.0 + Math.min(0.3, timeSpent / 120000);
  },
  
  MEDITATING: (timeSpent: number) => {
    if (timeSpent < 60000) return 0.3;
    return Math.min(1.5, 0.5 + timeSpent / 120000);
  },
  
  WRITING: (timeSpent: number) => {
    if (timeSpent < 45000) return 0.4;
    return Math.min(1.2, 0.6 + timeSpent / 200000);
  },
  
  WANDERING: () => 0.7,
  
  EXPLORING: (timeSpent: number) => {
    return Math.min(1.3, 0.8 + timeSpent / 180000);
  },
  
  CONTEMPLATING: (timeSpent: number) => {
    if (timeSpent < 90000) return 0.3;
    return Math.min(1.4, 0.5 + timeSpent / 180000);
  },
  
  HIDING: () => 0.6
} as const;



// Eliminada función de validación no usada
