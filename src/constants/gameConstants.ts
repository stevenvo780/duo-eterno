export const STAT_KEYS = ['hunger', 'sleepiness', 'loneliness', 'happiness', 'energy', 'boredom', 'money', 'health'] as const;
export type StatKey = typeof STAT_KEYS[number];

export const ZONE_TYPES = [
  'food',
  'rest',
  'play',
  'social',
  'comfort',
  'energy',
  'work'
] as const;
export type ZoneType = typeof ZONE_TYPES[number];

export const ACTIVITY_TYPES = [
  'WANDERING', 'MEDITATING', 'WRITING', 'RESTING', 'SOCIALIZING',
  'EXPLORING', 'CONTEMPLATING', 'DANCING', 'HIDING', 'WORKING',
  'SHOPPING', 'EXERCISING', 'COOKING'
] as const;
export type ActivityType = typeof ACTIVITY_TYPES[number];

export const ENTITY_STATES = ['IDLE', 'SEEKING', 'LOW_RESONANCE', 'FADING', 'DEAD', 'SLEEPING', 'EATING', 'PLAYING'] as const;
export type EntityStateType = typeof ENTITY_STATES[number];

export const MOOD_TYPES = ['HAPPY', 'SAD', 'TIRED', 'EXCITED', 'CALM', 'ANXIOUS', 'CONTENT'] as const;
export type MoodType = typeof MOOD_TYPES[number];

export const SURVIVAL_THRESHOLDS = {
  CRITICAL: 85,
  URGENT: 70,
  LOW: 50,
  COMFORTABLE: 30
} as const;

export const RESONANCE_THRESHOLDS = {
  CRITICAL: 30,
  LOW: 50,
  GOOD: 70,
  EXCELLENT: 90
} as const;

export const HEALTH_CONFIG = {
  DECAY_PER_CRITICAL: 0.07,  // 🔧 MEJORA MINIMALISTA: Reducido de 0.1 → 0.07 (30% menos agresivo)
  RECOVERY_RATE: 0.05
} as const;

export const MOVEMENT_CONFIG = {
  ENTITY_SIZE: 16,
  MIN_DISTANCE_BETWEEN_ENTITIES: 25,
  REPULSION_FORCE: 2,
  COMPANION_SEEK_DISTANCE: 200,
  BASE_MOVEMENT_SPEED: 2.0
} as const;

export const NEED_TO_ZONE_MAPPING: Partial<Record<StatKey, ZoneType>> = {
  hunger: 'food',
  sleepiness: 'rest',
  boredom: 'play',
  loneliness: 'social',
  happiness: 'comfort',
  energy: 'energy',
  money: 'work'
} as const;

export const TRANSLATIONS = {
  ACTIVITIES: {
    'WANDERING': 'Vagando',
    'MEDITATING': 'Meditando',
    'WRITING': 'Escribiendo',
    'RESTING': 'Descansando',
    'SOCIALIZING': 'Socializando',
    'EXPLORING': 'Explorando',
    'CONTEMPLATING': 'Contemplando',
    'DANCING': 'Bailando',
    'HIDING': 'Escondiéndose',
    'WORKING': 'Trabajando',
    'SHOPPING': 'Comprando',
    'EXERCISING': 'Ejercitándose',
    'COOKING': 'Cocinando'
  } as Record<ActivityType, string>,
  
  MOODS: {
    'HAPPY': 'Feliz',
    'EXCITED': 'Emocionado',
    'CALM': 'Tranquilo',
    'CONTENT': 'Contento',
    'SAD': 'Triste',
    'TIRED': 'Cansado',
    'ANXIOUS': 'Ansioso'
  } as Record<MoodType, string>,
  
  STATS: {
    'hunger': 'Saciedad',
    'sleepiness': 'Sueño',
    'loneliness': 'Compañía',
    'happiness': 'Felicidad',
    'energy': 'Energía',
    'boredom': 'Diversión',
    'money': 'Dinero',
    'health': 'Salud'
  } as Record<StatKey, string>,
  
  ENTITIES: {
    'circle': 'Círculo',
    'square': 'Cuadrado'
  } as const
} as const;

// === IMPORTACIONES DE CONSTANTES ESPECIALIZADAS ===

import { 
  ACTIVITY_DURATIONS,
  ACTIVITY_COSTS,
  ACTIVITY_EFFECTS
} from './biologicalDynamics';

import { 
  SPECIAL_TIMEOUTS 
} from './systemTiming';

// === RE-EXPORTACIONES DE CONSTANTES ESPECIALIZADAS ===

/**
 * Timeouts especiales - importados de systemTiming
 * Basados en ciclos naturales y procesos cognitivos
 */
export const FADING_TIMEOUT_MS = SPECIAL_TIMEOUTS.FADING_TIMEOUT_MS;
export const FADING_RECOVERY_THRESHOLD = SPECIAL_TIMEOUTS.FADING_RECOVERY_THRESHOLD;

// === CONFIGURACIONES CONSOLIDADAS PARA COMPATIBILIDAD ===

/**
 * Duraciones de actividades - consolidadas desde biologicalDynamics
 * Mantiene compatibilidad con código existente
 */
export const ACTIVITY_DURATION_CONFIG = {
  WANDERING: ACTIVITY_DURATIONS.WANDERING,
  MEDITATING: ACTIVITY_DURATIONS.MEDITATING,
  WRITING: ACTIVITY_DURATIONS.WRITING,
  RESTING: ACTIVITY_DURATIONS.RESTING,
  SOCIALIZING: ACTIVITY_DURATIONS.SOCIALIZING,
  EXPLORING: ACTIVITY_DURATIONS.EXPLORING,
  CONTEMPLATING: ACTIVITY_DURATIONS.CONTEMPLATING,
  DANCING: ACTIVITY_DURATIONS.DANCING,
  HIDING: ACTIVITY_DURATIONS.HIDING,
  WORKING: ACTIVITY_DURATIONS.WORKING,
  SHOPPING: ACTIVITY_DURATIONS.SHOPPING,
  EXERCISING: ACTIVITY_DURATIONS.EXERCISING,
  COOKING: ACTIVITY_DURATIONS.COOKING
} as const;

/**
 * Costos de actividades - consolidados desde biologicalDynamics
 */
export const ACTIVITY_COST_CONFIG = {
  SHOPPING: ACTIVITY_COSTS.SHOPPING,
  COOKING: ACTIVITY_COSTS.COOKING
} as const;

/**
 * Efectos de actividades - consolidados desde biologicalDynamics
 * Incluye todos los efectos inmediatos y sostenidos
 */
export const ACTIVITY_EFFECT_CONFIG = {
  WORKING: ACTIVITY_EFFECTS.WORKING,
  RESTING: ACTIVITY_EFFECTS.RESTING,
  SOCIALIZING: ACTIVITY_EFFECTS.SOCIALIZING,
  DANCING: ACTIVITY_EFFECTS.DANCING,
  EXERCISING: ACTIVITY_EFFECTS.EXERCISING,
  MEDITATING: ACTIVITY_EFFECTS.MEDITATING
} as const;

// === VALIDACIÓN CONSOLIDADA ===

/**
 * Valida que todas las constantes del juego sean coherentes
 * Llama a las validaciones de todos los módulos especializados
 */
export async function validateAllGameConstants(): Promise<boolean> {
  const validations = await Promise.all([
    import('./mathematicalCore').then(m => m.validateMathematicalConstants()),
    import('./biologicalDynamics').then(m => m.validateBiologicalConstants()),
    import('./physicsAndMovement').then(m => m.validatePhysicsConstants()),
    import('./systemTiming').then(m => m.validateTimingConstants())
  ]);
  
  const allValid = validations.every(v => v === true);
  
  if (import.meta.env.DEV) {
    if (!allValid) {
      console.error('❌ Game constants validation failed!');
      console.log('Validation results:', {
        mathematical: validations[0],
        biological: validations[1],
        physics: validations[2],
        timing: validations[3]
      });
    } else {
      console.log('✅ All game constants validated successfully');
    }
  }
  
  return allValid;
}

// Validar al cargar en desarrollo
if (import.meta.env.DEV) {
  validateAllGameConstants();
}


