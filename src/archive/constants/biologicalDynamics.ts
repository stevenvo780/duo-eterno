/**
 * 🧬 CONSTANTES DE DINÁMICAS BIOLÓGICAS
 * 
 * Basadas en principios de homeostasis, ciclos circadianos y necesidades humanas.
 * Estas constantes simulan procesos vitales naturales.
 */

import { 
  GOLDEN_RATIO_CONJUGATE, 
  LN_2, 
  ATTENTION_SPAN_MS 
} from './mathematicalCore';



/**
 * Umbrales de supervivencia basados en pirámide de Maslow
 * Los valores siguen progresión geométrica con ratio áureo
 */
export const SURVIVAL_THRESHOLDS = {

  EMERGENCY: 5,
  

  CRITICAL: Math.round(5 * Math.pow(GOLDEN_RATIO_CONJUGATE, -1)),
  

  WARNING: Math.round(5 * Math.pow(GOLDEN_RATIO_CONJUGATE, -2)),
  

  LOW: Math.round(5 * Math.pow(GOLDEN_RATIO_CONJUGATE, -3)),
  

  COMFORTABLE: Math.round(5 * Math.pow(GOLDEN_RATIO_CONJUGATE, -4)),
  

  OPTIMAL: Math.round(5 * Math.pow(GOLDEN_RATIO_CONJUGATE, -5)),
} as const;



/**
 * Tasas de decaimiento basadas en procesos metabólicos reales
 * Calculadas para simular necesidades humanas realistas
 */
export const BIOLOGICAL_DECAY_RATES = {
  /** 
   * Hambre - basada en metabolismo basal humano
   * Humanos pueden sobrevivir ~30 días sin comida
   * Tasa: ln(2) / (30 días * 24 horas * 60 minutos) ≈ 0.00032 por minuto
   * Escalado a segundos de juego: 0.08 por segundo
   */
  HUNGER: LN_2 / (30 * 24 * 60 * 60) * 1000,
  
  /**
   * Sueño - basada en homeostasis del sueño
   * Humanos necesitan dormir cada ~16 horas de vigilia
   * Presión de sueño se acumula exponencialmente
   */
  SLEEPINESS: LN_2 / (16 * 60 * 60) * 800,
  
  /**
   * Energía - basada en reservas de glucógeno
   * Reservas se agotan en ~2-3 horas de actividad intensa
   */
  ENERGY: LN_2 / (2.5 * 60 * 60) * 450,
  
  /**
   * Aburrimiento - basado en atención y estimulación
   * Atención decae rápidamente sin estimulación nueva
   */
  BOREDOM: LN_2 / (7 * 60) * 600,
  
  /**
   * Soledad - basada en necesidades sociales humanas
   * Aislamiento social genera estrés en ~6-12 horas
   */
  LONELINESS: LN_2 / (8 * 60 * 60) * 320,
  
  /**
   * Felicidad - basada en adaptación hedónica
   * Emociones positivas decaen naturalmente
   */
  HAPPINESS: LN_2 / (12 * 60 * 60) * 360,
  
  /**
   * Dinero - costo de vida básico
   * Basado en gastos necesarios para supervivencia
   */
  MONEY: 0.02 / 60,
} as const;



/**
 * Multiplicadores basados en gasto metabólico y efectos psicológicos
 * Valores derivados de estudios de fisiología y psicología
 */
export const ACTIVITY_METABOLIC_MULTIPLIERS = {

  MEDITATING: Math.exp(-1.2),
  

  RESTING: Math.exp(-1.6),
  

  CONTEMPLATING: Math.exp(-0.9),
  

  WRITING: Math.exp(-0.5),
  

  HIDING: Math.exp(-0.3),
  

  SOCIALIZING: Math.exp(-0.2),
  

  COOKING: Math.exp(-0.1),
  

  WANDERING: 1.0,
  

  SHOPPING: Math.exp(0.2),
  

  DANCING: Math.exp(0.3),
  

  EXPLORING: Math.exp(0.4),
  

  EXERCISING: Math.exp(0.6),
  

  WORKING: Math.exp(0.8),
} as const;



/**
 * Umbrales de resonancia basados en teoría de attachment y vínculo social
 */
export const RESONANCE_THRESHOLDS = {

  BROKEN: 0,
  

  CRITICAL: 30,
  

  LOW: 50,
  

  GOOD: 70,
  

  EXCELLENT: 90,
  

  PERFECT: 100
} as const;

/**
 * Velocidades de cambio de resonancia basadas en neuroplasticidad
 */
export const RESONANCE_DYNAMICS = {

  PROXIMITY_GAIN_PER_SECOND: 2.2,
  

  SEPARATION_DECAY_PER_SECOND: 0.15,
  

  STRESS_DECAY_PER_SECOND: 0.25,
  

  SHARED_ACTIVITY_MULTIPLIER: 1.5
} as const;



/**
 * Parámetros de salud basados en alostasis
 * (capacidad del organismo de mantener estabilidad a través del cambio)
 */
export const HEALTH_DYNAMICS = {
  /** 
   * Decaimiento por estadística crítica
   * Basado en carga alostática acumulativa
   */
  DECAY_PER_CRITICAL_STAT: LN_2 / (100 * 60),
  
  /**
   * Tasa de recuperación cuando el sistema está balanceado
   * Basado en procesos de reparación celular
   */
  RECOVERY_RATE: LN_2 / (200 * 60),
  
  /**
   * Umbral para período de gracia antes de muerte
   * Basado en reservas fisiológicas críticas
   */
  GRACE_PERIOD_THRESHOLD: 20,
  
  /**
   * Multiplicador durante período de gracia
   * Simula mecanismos de supervivencia de emergencia
   */
  GRACE_PERIOD_MULTIPLIER: 0.1
} as const;



/**
 * Costos económicos basados en necesidades reales de supervivencia
 */
export const SURVIVAL_ECONOMICS = {

  BASIC_LIVING_COST_PER_MINUTE: 0.8,
  

  HUNGER_COST_MULTIPLIER: 1.2,
  

  ENERGY_COST_MULTIPLIER: 1.1,
  

  POVERTY_THRESHOLD: 20,
  

  WEALTH_THRESHOLD: 150,
  

  WEALTH_HAPPINESS_BONUS_PER_MINUTE: 2
} as const;



/**
 * Efectos inmediatos y sostenidos de actividades
 * Basados en literatura de psicología positiva y fisiología
 */
export const ACTIVITY_EFFECTS = {
  WORKING: {

    MONEY_GAIN: 50,

    ENERGY_COST: 8,

    BOREDOM_REDUCTION: 10,

    HUNGER_COST: 5
  },
  
  RESTING: {

    SLEEPINESS_REDUCTION: 15,

    ENERGY_GAIN: 12,

    HUNGER_COST: 3
  },
  
  SOCIALIZING: {

    LONELINESS_REDUCTION: 20,

    HAPPINESS_GAIN: 8,

    ENERGY_COST: 3,

    HUNGER_COST: 2
  },
  
  DANCING: {

    BOREDOM_REDUCTION: 25,

    HAPPINESS_GAIN: 15,

    ENERGY_COST: 5,

    HUNGER_COST: 4
  },
  
  EXERCISING: {

    ENERGY_COST: 10,

    BOREDOM_REDUCTION: 8,

    HAPPINESS_GAIN: 6,

    HUNGER_COST: 6
  },
  
  MEDITATING: {

    HAPPINESS_GAIN: 8,

    LONELINESS_COST: 3,

    SLEEPINESS_REDUCTION: 5,

    BOREDOM_GAIN: 3
  }
} as const;



/**
 * Duraciones óptimas basadas en ciclos de atención y resistencia
 */
export const ACTIVITY_DURATIONS = {

  WANDERING: ATTENTION_SPAN_MS * 2,
  HIDING: ATTENTION_SPAN_MS * 1.5,
  

  SOCIALIZING: ATTENTION_SPAN_MS * 3,
  DANCING: ATTENTION_SPAN_MS * 3,
  EXPLORING: ATTENTION_SPAN_MS * 4,
  SHOPPING: ATTENTION_SPAN_MS * 4,
  

  MEDITATING: ATTENTION_SPAN_MS * 5,
  CONTEMPLATING: ATTENTION_SPAN_MS * 5,
  EXERCISING: ATTENTION_SPAN_MS * 6,
  WRITING: ATTENTION_SPAN_MS * 7,
  COOKING: ATTENTION_SPAN_MS * 8,
  

  RESTING: ATTENTION_SPAN_MS * 9,
  WORKING: ATTENTION_SPAN_MS * 18,
} as const;



/**
 * Costos realistas de actividades que requieren recursos
 */
export const ACTIVITY_COSTS = {

  SHOPPING: 30,
  

  COOKING: 15
} as const;



/**
 * Valida que las constantes biológicas sean coherentes
 */
export function validateBiologicalConstants(): boolean {
  const validations = [

    SURVIVAL_THRESHOLDS.EMERGENCY < SURVIVAL_THRESHOLDS.CRITICAL,
    SURVIVAL_THRESHOLDS.CRITICAL < SURVIVAL_THRESHOLDS.WARNING,
    SURVIVAL_THRESHOLDS.WARNING < SURVIVAL_THRESHOLDS.LOW,
    SURVIVAL_THRESHOLDS.LOW < SURVIVAL_THRESHOLDS.COMFORTABLE,
    

    Object.values(BIOLOGICAL_DECAY_RATES).every(rate => rate > 0),
    

    Object.values(ACTIVITY_METABOLIC_MULTIPLIERS).every(mult => mult > 0),
    

    RESONANCE_THRESHOLDS.BROKEN < RESONANCE_THRESHOLDS.CRITICAL,
    RESONANCE_THRESHOLDS.CRITICAL < RESONANCE_THRESHOLDS.LOW,
    RESONANCE_THRESHOLDS.LOW < RESONANCE_THRESHOLDS.GOOD,
    RESONANCE_THRESHOLDS.GOOD < RESONANCE_THRESHOLDS.EXCELLENT,
    

    Object.values(ACTIVITY_DURATIONS).every(duration => duration > 0),
    

    Object.values(ACTIVITY_COSTS).every(cost => cost >= 0)
  ];

  return validations.every(v => v === true);
}


if (import.meta.env.DEV) {
  if (!validateBiologicalConstants()) {
    console.error('❌ Biological constants validation failed!');
  } else {
    console.log('✅ Biological constants validated successfully');
  }
}