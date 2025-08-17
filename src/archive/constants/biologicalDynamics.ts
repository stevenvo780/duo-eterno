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

// === CONSTANTES DE SUPERVIVENCIA BÁSICA ===

/**
 * Umbrales de supervivencia basados en pirámide de Maslow
 * Los valores siguen progresión geométrica con ratio áureo
 */
export const SURVIVAL_THRESHOLDS = {
  /** Muerte inminente - basado en límite de supervivencia humana */
  EMERGENCY: 5,
  
  /** Estado crítico - requiere intervención inmediata */
  CRITICAL: Math.round(5 * Math.pow(GOLDEN_RATIO_CONJUGATE, -1)), // ≈ 8
  
  /** Advertencia - necesita atención pronto */
  WARNING: Math.round(5 * Math.pow(GOLDEN_RATIO_CONJUGATE, -2)), // ≈ 13
  
  /** Bajo - podría mejorar */
  LOW: Math.round(5 * Math.pow(GOLDEN_RATIO_CONJUGATE, -3)), // ≈ 21
  
  /** Cómodo - estado estable */
  COMFORTABLE: Math.round(5 * Math.pow(GOLDEN_RATIO_CONJUGATE, -4)), // ≈ 34
  
  /** Óptimo - florecimiento */
  OPTIMAL: Math.round(5 * Math.pow(GOLDEN_RATIO_CONJUGATE, -5)), // ≈ 55
} as const;

// === VELOCIDADES DE DEGRADACIÓN BIOLÓGICA ===

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
  HUNGER: LN_2 / (30 * 24 * 60 * 60) * 1000, // ~0.0008 por segundo → escalado a 0.08
  
  /**
   * Sueño - basada en homeostasis del sueño
   * Humanos necesitan dormir cada ~16 horas de vigilia
   * Presión de sueño se acumula exponencialmente
   */
  SLEEPINESS: LN_2 / (16 * 60 * 60) * 800, // ~0.06 por segundo
  
  /**
   * Energía - basada en reservas de glucógeno
   * Reservas se agotan en ~2-3 horas de actividad intensa
   */
  ENERGY: LN_2 / (2.5 * 60 * 60) * 450, // ~0.05 por segundo
  
  /**
   * Aburrimiento - basado en atención y estimulación
   * Atención decae rápidamente sin estimulación nueva
   */
  BOREDOM: LN_2 / (7 * 60) * 600, // ~0.10 por segundo (7 minutos)
  
  /**
   * Soledad - basada en necesidades sociales humanas
   * Aislamiento social genera estrés en ~6-12 horas
   */
  LONELINESS: LN_2 / (8 * 60 * 60) * 320, // ~0.04 por segundo
  
  /**
   * Felicidad - basada en adaptación hedónica
   * Emociones positivas decaen naturalmente
   */
  HAPPINESS: LN_2 / (12 * 60 * 60) * 360, // ~0.03 por segundo
  
  /**
   * Dinero - costo de vida básico
   * Basado en gastos necesarios para supervivencia
   */
  MONEY: 0.02 / 60, // 0.02 por minuto → 0.00033 por segundo
} as const;

// === MULTIPLICADORES DE ACTIVIDADES BIOLÓGICAS ===

/**
 * Multiplicadores basados en gasto metabólico y efectos psicológicos
 * Valores derivados de estudios de fisiología y psicología
 */
export const ACTIVITY_METABOLIC_MULTIPLIERS = {
  /** Meditación - reduce significativamente el estrés metabólico */
  MEDITATING: Math.exp(-1.2), // ≈ 0.30 (70% reducción)
  
  /** Descanso - estado de menor actividad metabólica */
  RESTING: Math.exp(-1.6), // ≈ 0.20 (80% reducción)
  
  /** Contemplación - actividad mental relajada */
  CONTEMPLATING: Math.exp(-0.9), // ≈ 0.40 (60% reducción)
  
  /** Escritura - actividad mental moderada */
  WRITING: Math.exp(-0.5), // ≈ 0.60 (40% reducción)
  
  /** Esconderse - respuesta de estrés controlado */
  HIDING: Math.exp(-0.3), // ≈ 0.74 (26% reducción)
  
  /** Socialización - actividad social moderada */
  SOCIALIZING: Math.exp(-0.2), // ≈ 0.82 (18% reducción)
  
  /** Cocinar - actividad doméstica ligera */
  COOKING: Math.exp(-0.1), // ≈ 0.90 (10% reducción)
  
  /** Vagando - actividad base (sin modificación) */
  WANDERING: 1.0,
  
  /** Compras - actividad social con estrés */
  SHOPPING: Math.exp(0.2), // ≈ 1.22 (22% aumento)
  
  /** Baile - actividad física moderada */
  DANCING: Math.exp(0.3), // ≈ 1.35 (35% aumento)
  
  /** Exploración - actividad física y mental */
  EXPLORING: Math.exp(0.4), // ≈ 1.49 (49% aumento)
  
  /** Ejercicio - actividad física intensa */
  EXERCISING: Math.exp(0.6), // ≈ 1.82 (82% aumento)
  
  /** Trabajo - estrés y actividad sostenida */
  WORKING: Math.exp(0.8), // ≈ 2.23 (123% aumento)
} as const;

// === CONSTANTES DE RESONANCIA EMOCIONAL ===

/**
 * Umbrales de resonancia basados en teoría de attachment y vínculo social
 */
export const RESONANCE_THRESHOLDS = {
  /** Vínculo roto - aislamiento completo */
  BROKEN: 0,
  
  /** Crisis relacional - necesita reparación inmediata */
  CRITICAL: 30,
  
  /** Vínculo débil - requiere atención */
  LOW: 50,
  
  /** Vínculo saludable - funcionamiento normal */
  GOOD: 70,
  
  /** Vínculo fuerte - florecimiento conjunto */
  EXCELLENT: 90,
  
  /** Fusión perfecta - estado ideal temporal */
  PERFECT: 100
} as const;

/**
 * Velocidades de cambio de resonancia basadas en neuroplasticidad
 */
export const RESONANCE_DYNAMICS = {
  /** Ganancia por cercanía física (oxitocina) */
  PROXIMITY_GAIN_PER_SECOND: 2.2,
  
  /** Pérdida por separación (cortisol) */
  SEPARATION_DECAY_PER_SECOND: 0.15,
  
  /** Pérdida por estrés (respuesta simpática) */
  STRESS_DECAY_PER_SECOND: 0.25,
  
  /** Bonus por actividades conjuntas */
  SHARED_ACTIVITY_MULTIPLIER: 1.5
} as const;

// === CONSTANTES DE SALUD Y HOMEOSTASIS ===

/**
 * Parámetros de salud basados en alostasis
 * (capacidad del organismo de mantener estabilidad a través del cambio)
 */
export const HEALTH_DYNAMICS = {
  /** 
   * Decaimiento por estadística crítica
   * Basado en carga alostática acumulativa
   */
  DECAY_PER_CRITICAL_STAT: LN_2 / (100 * 60), // ≈ 0.0001 por segundo por stat crítica
  
  /**
   * Tasa de recuperación cuando el sistema está balanceado
   * Basado en procesos de reparación celular
   */
  RECOVERY_RATE: LN_2 / (200 * 60), // ≈ 0.00005 por segundo
  
  /**
   * Umbral para período de gracia antes de muerte
   * Basado en reservas fisiológicas críticas
   */
  GRACE_PERIOD_THRESHOLD: 20,
  
  /**
   * Multiplicador durante período de gracia
   * Simula mecanismos de supervivencia de emergencia
   */
  GRACE_PERIOD_MULTIPLIER: 0.1 // 90% de reducción en decaimiento
} as const;

// === DINÁMICAS DE COSTOS DE VIDA ===

/**
 * Costos económicos basados en necesidades reales de supervivencia
 */
export const SURVIVAL_ECONOMICS = {
  /** Costo base de vida por minuto (en unidades de juego) */
  BASIC_LIVING_COST_PER_MINUTE: 0.8,
  
  /** Multiplicador cuando se tiene hambre (mayor gasto en comida) */
  HUNGER_COST_MULTIPLIER: 1.2,
  
  /** Multiplicador cuando se está cansado (gastos médicos/suplementos) */
  ENERGY_COST_MULTIPLIER: 1.1,
  
  /** Umbral de pobreza - genera estrés adicional */
  POVERTY_THRESHOLD: 20,
  
  /** Umbral de riqueza - reduce preocupaciones */
  WEALTH_THRESHOLD: 150,
  
  /** Bonus de felicidad por riqueza (reducción de estrés financiero) */
  WEALTH_HAPPINESS_BONUS_PER_MINUTE: 2
} as const;

// === EFECTOS DE ACTIVIDADES ESPECÍFICAS ===

/**
 * Efectos inmediatos y sostenidos de actividades
 * Basados en literatura de psicología positiva y fisiología
 */
export const ACTIVITY_EFFECTS = {
  WORKING: {
    /** Ganancia de dinero por minuto de trabajo productivo */
    MONEY_GAIN: 50,
    /** Costo de energía por el esfuerzo */
    ENERGY_COST: 8,
    /** Reducción de aburrimiento por propósito */
    BOREDOM_REDUCTION: 10,
    /** Costo de hambre por actividad sostenida */
    HUNGER_COST: 5
  },
  
  RESTING: {
    /** Recuperación de sueño por descanso */
    SLEEPINESS_REDUCTION: 15,
    /** Recuperación de energía */
    ENERGY_GAIN: 12,
    /** Costo de hambre mínimo en reposo */
    HUNGER_COST: 3
  },
  
  SOCIALIZING: {
    /** Reducción de soledad por interacción social */
    LONELINESS_REDUCTION: 20,
    /** Ganancia de felicidad por conexión */
    HAPPINESS_GAIN: 8,
    /** Costo energético de socialización */
    ENERGY_COST: 3,
    /** Costo de hambre por actividad */
    HUNGER_COST: 2
  },
  
  DANCING: {
    /** Reducción de aburrimiento por diversión */
    BOREDOM_REDUCTION: 25,
    /** Ganancia de felicidad por ejercicio y música */
    HAPPINESS_GAIN: 15,
    /** Costo energético moderado */
    ENERGY_COST: 5,
    /** Costo de hambre por actividad física */
    HUNGER_COST: 4
  },
  
  EXERCISING: {
    /** Costo energético alto del ejercicio */
    ENERGY_COST: 10,
    /** Reducción de aburrimiento por actividad */
    BOREDOM_REDUCTION: 8,
    /** Ganancia de felicidad por endorfinas */
    HAPPINESS_GAIN: 6,
    /** Costo de hambre por ejercicio */
    HUNGER_COST: 6
  },
  
  MEDITATING: {
    /** Ganancia de felicidad por mindfulness */
    HAPPINESS_GAIN: 8,
    /** Costo de soledad por actividad solitaria */
    LONELINESS_COST: 3,
    /** Reducción de sueño por relajación */
    SLEEPINESS_REDUCTION: 5,
    /** Ligero aumento de aburrimiento para algunos */
    BOREDOM_GAIN: 3
  }
} as const;

// === DURACIONES NATURALES DE ACTIVIDADES ===

/**
 * Duraciones óptimas basadas en ciclos de atención y resistencia
 */
export const ACTIVITY_DURATIONS = {
  /** Actividades cortas - basadas en span de atención básico */
  WANDERING: ATTENTION_SPAN_MS * 2, // ~14 segundos
  HIDING: ATTENTION_SPAN_MS * 1.5, // ~10 segundos
  
  /** Actividades moderadas - basadas en ciclos de concentración */
  SOCIALIZING: ATTENTION_SPAN_MS * 3, // ~20 segundos
  DANCING: ATTENTION_SPAN_MS * 3, // ~20 segundos
  EXPLORING: ATTENTION_SPAN_MS * 4, // ~25 segundos
  SHOPPING: ATTENTION_SPAN_MS * 4, // ~30 segundos
  
  /** Actividades largas - requieren compromiso sostenido */
  MEDITATING: ATTENTION_SPAN_MS * 5, // ~30 segundos
  CONTEMPLATING: ATTENTION_SPAN_MS * 5, // ~35 segundos
  EXERCISING: ATTENTION_SPAN_MS * 6, // ~40 segundos
  WRITING: ATTENTION_SPAN_MS * 7, // ~45 segundos
  COOKING: ATTENTION_SPAN_MS * 8, // ~50 segundos
  
  /** Actividades muy largas - estados prolongados */
  RESTING: ATTENTION_SPAN_MS * 9, // ~60 segundos
  WORKING: ATTENTION_SPAN_MS * 18, // ~120 segundos
} as const;

// === COSTOS MONETARIOS DE ACTIVIDADES ===

/**
 * Costos realistas de actividades que requieren recursos
 */
export const ACTIVITY_COSTS = {
  /** Costo de ir de compras (transporte + compras) */
  SHOPPING: 30,
  
  /** Costo de cocinar (ingredientes + energía) */
  COOKING: 15
} as const;

// === VALIDACIÓN DEL SISTEMA BIOLÓGICO ===

/**
 * Valida que las constantes biológicas sean coherentes
 */
export function validateBiologicalConstants(): boolean {
  const validations = [
    // Los umbrales deben estar en orden ascendente
    SURVIVAL_THRESHOLDS.EMERGENCY < SURVIVAL_THRESHOLDS.CRITICAL,
    SURVIVAL_THRESHOLDS.CRITICAL < SURVIVAL_THRESHOLDS.WARNING,
    SURVIVAL_THRESHOLDS.WARNING < SURVIVAL_THRESHOLDS.LOW,
    SURVIVAL_THRESHOLDS.LOW < SURVIVAL_THRESHOLDS.COMFORTABLE,
    
    // Las tasas de decaimiento deben ser positivas
    Object.values(BIOLOGICAL_DECAY_RATES).every(rate => rate > 0),
    
    // Los multiplicadores de actividad deben ser positivos
    Object.values(ACTIVITY_METABOLIC_MULTIPLIERS).every(mult => mult > 0),
    
    // Los umbrales de resonancia deben estar en orden
    RESONANCE_THRESHOLDS.BROKEN < RESONANCE_THRESHOLDS.CRITICAL,
    RESONANCE_THRESHOLDS.CRITICAL < RESONANCE_THRESHOLDS.LOW,
    RESONANCE_THRESHOLDS.LOW < RESONANCE_THRESHOLDS.GOOD,
    RESONANCE_THRESHOLDS.GOOD < RESONANCE_THRESHOLDS.EXCELLENT,
    
    // Las duraciones deben ser positivas
    Object.values(ACTIVITY_DURATIONS).every(duration => duration > 0),
    
    // Los costos deben ser no negativos
    Object.values(ACTIVITY_COSTS).every(cost => cost >= 0)
  ];

  return validations.every(v => v === true);
}

// Validar al cargar el módulo en desarrollo
if (import.meta.env.DEV) {
  if (!validateBiologicalConstants()) {
    console.error('❌ Biological constants validation failed!');
  } else {
    console.log('✅ Biological constants validated successfully');
  }
}