/**
 * 🎯 CONSTANTES CONSOLIDADAS DEL JUEGO
 * 
 * Fuente única de verdad que reemplaza:
 * ❌ biologicalDynamics.ts
 * ❌ gameConstants.ts 
 * ❌ mathematicalCore.ts
 * ❌ physicsAndMovement.ts
 * ❌ systemTiming.ts
 * 
 * Organizadas por categorías para máxima claridad
 */

// === CONSTANTES MATEMÁTICAS FUNDAMENTALES ===

export const MATH = {
  // Constantes matemáticas básicas
  PI: Math.PI,
  EULER: Math.E,
  LN_2: Math.LN2,
  SQRT_2: Math.SQRT2,
  SQRT_1_2: Math.SQRT1_2,
  
  // Golden ratio y derivados
  GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2, // φ ≈ 1.618
  GOLDEN_RATIO_CONJUGATE: (Math.sqrt(5) - 1) / 2, // 1/φ ≈ 0.618
  
  // Secuencias y proporciones naturales
  FIBONACCI_BASE: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55],
  HARMONIC_RATIOS: [1, 1/2, 1/3, 1/4, 1/5, 1/6],
  
  // Precisión y tolerancias
  HIGH_PRECISION_EPSILON: Number.EPSILON,
  ULTRA_PRECISION_EPSILON: 1e-15,
  EFFECTIVE_ZERO: 1e-10,
} as const;

// === CONSTANTES DE TIMING Y SISTEMA ===

export const TIMING = {
  // Ciclos naturales (basados en segundos reales)
  NATURAL_CYCLE_MS: 1000, // 1 segundo base
  BREATHING_CYCLE_MS: 4000, // ~4 segundos (15 resp/min)
  ATTENTION_SPAN_MS: 90000, // 1.5 minutos
  
  // Intervalos del game loop
  MAIN_GAME_LOGIC: 800, // Loop principal
  DEGRADATION_UPDATE: 2000, // Actualización de stats
  MOVEMENT_UPDATE: 16, // ~60fps
  UI_UPDATE: 100, // UI responsive
  BATCH_FLUSH: 100, // Flush de cambios
  CLEANUP: 60000, // Limpieza de memoria
  
  // Timing adicional para retrocompatibilidad
  main: 800,
  degradation: 2000,
  movement: 16,
  ui: 100,
  entityMovementSpeed: 16,
  
  // Multiplicadores de velocidad
  SPEED_MULTIPLIERS: {
    PAUSED: 0,
    ULTRA_SLOW: 0.1,
    SLOW: 0.5,
    NORMAL: 1.0,
    FAST: 2.0,
    ULTRA_FAST: 5.0,
    INSTANT: 20.0,
  },
} as const;

// === CONSTANTES DE SUPERVIVENCIA Y BIOLOGÍA ===

export const SURVIVAL = {
  // Valores críticos para supervivencia
  CRITICAL_THRESHOLDS: {
    HEALTH: 10,
    HUNGER: 20,
    ENERGY: 15,
    HAPPINESS: 10,
    SLEEPINESS: 80,
    BOREDOM: 80,
    LONELINESS: 70,
  },
  
  // Tasas de degradación por segundo (balanceadas)
  DEGRADATION_RATES: {
    HUNGER: 0.08, // ~30 minutos para morir de hambre
    ENERGY: 0.05, // ~45 minutos para agotamiento
    HAPPINESS: 0.03, // Decae lentamente
    SLEEPINESS: 0.04, // ~8 horas para necesitar dormir
    BOREDOM: 0.06, // Decae moderadamente
    LONELINESS: 0.02, // Decae muy lentamente
    HEALTH: 0.01, // Solo decae si otros stats están críticos
  },
  
  // Costos de vida y actividades (por minuto)
  LIVING_COSTS: {
    BASIC: 1.5, // Costo básico de vivir
    ACTIVITY: 0.5, // Costo adicional por actividad
    LUXURY: 2.0, // Costo de actividades caras
  },
  
  // Multiplicadores por actividad
  ACTIVITY_MULTIPLIERS: {
    RESTING: 0.3, // Recuperación activa
    SLEEPING: 0.1, // Máxima recuperación
    EATING: 0.8, // Ligeramente menos degradación
    MEDITATING: 0.4, // Buena recuperación
    READING: 1.0, // Normal
    EXERCISING: 1.8, // Mayor desgaste pero beneficios
    SOCIALIZING: 0.9, // Ligera reducción
    WORKING: 1.3, // Más desgaste
    PLAYING: 0.7, // Menos desgaste, más satisfacción
  },
  
  // Efectos de recuperación
  RECOVERY_RATES: {
    EATING_HUNGER: 8.0, // Comida restaura hambre rápido
    SLEEPING_ENERGY: 6.0, // Dormir restaura energía
    SOCIALIZING_LONELINESS: 4.0, // Socializar reduce soledad
    RESTING_ALL: 1.5, // Descanso mejora todo ligeramente
    MEDITATING_HAPPINESS: 3.0, // Meditar mejora felicidad
  },
} as const;

// === CONSTANTES DE MOVIMIENTO Y FÍSICA ===

export const PHYSICS = {
  // Velocidades y aceleración
  BASE_MOVEMENT_SPEED: 84, // Basado en velocidad humana caminando
  MAX_SPEED: 120, // Velocidad máxima
  ACCELERATION: 50, // Aceleración
  FRICTION: 0.85, // Factor de fricción
  
  // Distancias y radios
  ENTITY_RADIUS: 15, // Radio base de entidades
  PERSONAL_SPACE: 40, // Espacio personal mínimo
  INTERACTION_DISTANCE: 80, // Distancia para interacciones
  ZONE_TRANSITION_DISTANCE: 20, // Suavizado de transiciones
  
  // Pathfinding y navegación
  PATHFINDING: {
    GRID_SIZE: 20,
    MAX_PATH_LENGTH: 50,
    RECALCULATION_THRESHOLD: 30,
    OBSTACLE_AVOIDANCE_DISTANCE: 60,
    WANDER_RADIUS: 100,
  },
  
  // Fuerzas y weights
  STEERING_WEIGHTS: {
    SEEK: 1.0,
    AVOID: 2.0,
    SEPARATE: 1.5,
    WANDER: 0.5,
  },
} as const;

// === CONSTANTES DE ACTIVIDADES ===

export const ACTIVITIES = {
  // Tipos de actividades disponibles
  TYPES: [
    'RESTING', 'SLEEPING', 'EATING', 'MEDITATING',
    'READING', 'EXERCISING', 'SOCIALIZING', 'WORKING', 'PLAYING'
  ] as const,
  
  // Duración óptima de actividades (en ms)
  OPTIMAL_DURATION: {
    RESTING: 180000, // 3 minutos
    SLEEPING: 480000, // 8 minutos (simulando horas)
    EATING: 120000, // 2 minutos
    MEDITATING: 300000, // 5 minutos
    READING: 600000, // 10 minutos
    EXERCISING: 240000, // 4 minutos
    SOCIALIZING: 360000, // 6 minutos
    WORKING: 1200000, // 20 minutos
    PLAYING: 480000, // 8 minutos
  },
  
  // Efectos en stats (por minuto de actividad)
  EFFECTS: {
    RESTING: { energy: 2, happiness: 1, sleepiness: -1 },
    SLEEPING: { energy: 5, sleepiness: -8, health: 1 },
    EATING: { hunger: -6, happiness: 2, health: 0.5 },
    MEDITATING: { happiness: 3, loneliness: -1, boredom: -2 },
    READING: { boredom: -3, happiness: 1, loneliness: 1 },
    EXERCISING: { energy: -2, happiness: 2, health: 2, hunger: 1 },
    SOCIALIZING: { loneliness: -4, happiness: 3, boredom: -2 },
    WORKING: { boredom: 1, energy: -1, happiness: -0.5 },
    PLAYING: { happiness: 4, boredom: -4, energy: -0.5 },
  },
  
  // Zonas preferidas por actividad
  PREFERRED_ZONES: {
    RESTING: 'living',
    SLEEPING: 'bedroom',
    EATING: 'kitchen',
    MEDITATING: 'living',
    READING: 'library',
    EXERCISING: 'gym',
    SOCIALIZING: 'social',
    WORKING: 'office',
    PLAYING: 'recreation',
  },
} as const;

// === EXPORT CONSOLIDADO PARA RETROCOMPATIBILIDAD ===

// Exports con nombres originales para transición suave
export const TIMING_CONSTANTS = TIMING;
export const SURVIVAL_DYNAMICS = SURVIVAL;
export const MOVEMENT_DYNAMICS = PHYSICS;
export const ACTIVITY_DYNAMICS = ACTIVITIES;
export const MATH_CONSTANTS = MATH;

// Constantes individuales más usadas
export const {
  GOLDEN_RATIO,
  GOLDEN_RATIO_CONJUGATE,
  PI,
  EULER,
  LN_2,
  HIGH_PRECISION_EPSILON,
  ULTRA_PRECISION_EPSILON,
  EFFECTIVE_ZERO
} = MATH;

export const {
  MAIN_GAME_LOGIC,
  DEGRADATION_UPDATE,
  NATURAL_CYCLE_MS,
  BREATHING_CYCLE_MS,
  ATTENTION_SPAN_MS
} = TIMING;

// === TIPOS EXPORTADOS ===

export type ActivityType = typeof ACTIVITIES.TYPES[number];
export type ZoneType = 'kitchen' | 'bedroom' | 'living' | 'bathroom' | 'office' | 'gym' | 'library' | 'social' | 'recreation' | 'food' | 'rest' | 'play' | 'comfort' | 'work' | 'energy';
export type EntityStateType = 'alive' | 'resting' | 'dead' | 'fading' | 'DEAD' | 'FADING' | 'LOW_RESONANCE' | 'SEEKING' | 'IDLE';
export type MoodType = 'happy' | 'sad' | 'angry' | 'calm' | 'excited' | 'bored' | 'lonely' | 'content' | 'HAPPY' | 'SAD' | 'EXCITED' | 'CONTENT' | 'CALM' | 'ANXIOUS';

// Constantes de actividades (retrocompatibilidad)
export const ACTIVITY_TYPES = ACTIVITIES.TYPES;

// === CONSTANTES ADICIONALES PARA RETROCOMPATIBILIDAD ===

export const STAT_KEYS = ['hunger', 'energy', 'happiness', 'sleepiness', 'boredom', 'loneliness', 'health'] as const;
export const ENTITY_STATES = ['alive', 'resting', 'dead', 'fading', 'DEAD', 'FADING', 'LOW_RESONANCE', 'SEEKING', 'IDLE'] as const;
export const MOOD_TYPES = ['happy', 'sad', 'angry', 'calm', 'excited', 'bored', 'lonely', 'content', 'HAPPY', 'SAD', 'EXCITED', 'CONTENT', 'CALM', 'ANXIOUS'] as const;
export const ZONE_TYPES = ['kitchen', 'bedroom', 'living', 'bathroom', 'office', 'gym', 'library', 'social', 'recreation', 'food', 'rest', 'play', 'comfort', 'work', 'energy'] as const;

// Constantes de traducción y configuración
export const TRANSLATIONS = {
  // Moods
  HAPPY: 'Feliz',
  SAD: 'Triste', 
  ANGRY: 'Enojado',
  CALM: 'Calmado',
  EXCITED: 'Emocionado',
  BORED: 'Aburrido',
  LONELY: 'Solo',
  CONTENT: 'Contento',
  
  // Entidades
  ENTITIES: {
    circle: 'Círculo',
    square: 'Cuadrado',
  },
  
  // Actividades
  ACTIVITIES: {
    RESTING: 'Descansando',
    SLEEPING: 'Durmiendo',
    EATING: 'Comiendo',
    MEDITATING: 'Meditando',
    READING: 'Leyendo',
    EXERCISING: 'Ejercitándose',
    SOCIALIZING: 'Socializando',
    WORKING: 'Trabajando',
    PLAYING: 'Jugando',
  },
  
  // Stats
  STATS: {
    hunger: 'Hambre',
    energy: 'Energía',
    happiness: 'Felicidad',
    sleepiness: 'Sueño',
    boredom: 'Aburrimiento',
    loneliness: 'Soledad',
    health: 'Salud',
  },
  
  // Moods extended
  MOODS: {
    happy: 'Feliz',
    sad: 'Triste',
    angry: 'Enojado',
    calm: 'Calmado',
    excited: 'Emocionado',
    bored: 'Aburrido',
    lonely: 'Solo',
    content: 'Contento',
  }
} as const;

export const MOVEMENT_CONFIG = {
  BASE_SPEED: PHYSICS.BASE_MOVEMENT_SPEED,
  MAX_SPEED: PHYSICS.MAX_SPEED,
  PERSONAL_SPACE: PHYSICS.PERSONAL_SPACE,
  ENTITY_SIZE: PHYSICS.ENTITY_RADIUS,
  MIN_DISTANCE_BETWEEN_ENTITIES: PHYSICS.PERSONAL_SPACE,
  REPULSION_FORCE: 2.0,
  COMPANION_SEEK_DISTANCE: 200,
} as const;

// === CONSTANTES DE ENTIDADES Y FÍSICA ===

export const ENTITY_PHYSICS = {
  SIZE: 16,
  BASE_MASS: 1.0,
  BASE_FRICTION: 0.1,
  ELASTICITY: MATH.GOLDEN_RATIO_CONJUGATE,
  MOMENT_OF_INERTIA: 1.0
} as const;

export const PATHFINDING_CONFIG = {
  GRID_SIZE: 20,
  DIRECT_PATH_MAX_DISTANCE: 100,
  MAX_PATHFINDING_NODES: 200,
  ARRIVAL_THRESHOLD: ENTITY_PHYSICS.SIZE / 2,
  PATH_SMOOTHING_FACTOR: 0.3
} as const;

// === CONSTANTES ADICIONALES PARA RETROCOMPATIBILIDAD ===

export const SURVIVAL_THRESHOLDS = SURVIVAL.CRITICAL_THRESHOLDS;
export const NEED_TO_ZONE_MAPPING = {
  hunger: 'food',
  sleepiness: 'rest', 
  boredom: 'play',
  loneliness: 'social',
  energy: 'rest',
  happiness: 'comfort',
  money: 'work',
  health: 'comfort',
} as const;

export const RESONANCE_THRESHOLDS = {
  LOW: 15,
  WEAK: 20,
  MODERATE: 50,
  STRONG: 75,
  INTENSE: 90,
} as const;

// Función de validación para constantes
export const validateAllGameConstants = (): boolean => {
  try {
    // Validar que todas las constantes matemáticas están definidas
    return !!(MATH.GOLDEN_RATIO && MATH.PI && TIMING.MAIN_GAME_LOGIC && SURVIVAL.DEGRADATION_RATES.HUNGER);
  } catch (error) {
    console.error('Error validating game constants:', error);
    return false;
  }
};