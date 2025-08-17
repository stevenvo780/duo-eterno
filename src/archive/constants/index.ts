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

// === CONSTANTES DE RESONANCIA Y SOCIABILIDAD ===

export const RESONANCE = {
  // Parámetros de resonancia
  MAX_DISTANCE: 400, // Distancia máxima para resonancia
  DECAY_RATE: 0.02, // Tasa de decaimiento por segundo
  BASE_FREQUENCY: 440.0, // Frecuencia base (La musical)
  
  // Multiplicadores de harmony
  HARMONY_BONUS: 1.2, // Bonus por armonía de stats
  ACTIVITY_SYNC_BONUS: 1.15, // Bonus por actividades sincronizadas
  PROXIMITY_WEIGHT: 0.6, // Peso de la proximidad
  MOOD_HARMONY_WEIGHT: 0.4, // Peso de la armonía emocional
  
  // Thresholds de resonancia
  THRESHOLDS: {
    WEAK: 20,
    MODERATE: 50,
    STRONG: 75,
    INTENSE: 90,
  },
  
  // Efectos emergentes
  EMERGENCE_THRESHOLD: 0.618, // Basado en golden ratio conjugate
  RESONANCE_DECAY_NATURAL: Math.exp(-1/60), // Decaimiento exponencial natural
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

// === CONSTANTES DE ZONAS Y MAPAS ===

export const ZONES = {
  // Efectos base de zonas
  BASE_EFFECTS: {
    kitchen: { hungerRecovery: 2.0, socialBonus: 1.2 },
    bedroom: { energyRecovery: 2.5, sleepinessRecovery: 3.0 },
    living: { happinessBonus: 1.3, restingBonus: 1.5 },
    bathroom: { healthBonus: 1.1, hygieneBonus: 2.0 },
    office: { focusBonus: 1.4, productivityBonus: 1.3 },
    gym: { energyBonus: 1.2, healthBonus: 1.8 },
    library: { intellectualBonus: 1.5, focusBonus: 1.3 },
    social: { socialBonus: 2.0, happinessBonus: 1.4 },
    recreation: { happinessBonus: 1.8, boredomReduction: 2.0 },
  },
  
  // Parámetros de transición
  TRANSITION: {
    SMOOTHNESS: 0.1, // Suavizado de transiciones
    BONUS_DECAY_RATE: 0.05, // Decaimiento de bonuses al salir
    EFFECTIVENESS_MULTIPLIER: 1.5, // Multiplicador general de efectividad
  },
} as const;

// === CONSTANTES DE AI Y DECISIONES ===

export const AI = {
  // Parámetros de toma de decisiones
  DECISION: {
    SOFTMAX_TAU: 0.5, // Temperatura para softmax
    PERSONALITY_INFLUENCE: 0.3, // Influencia de la personalidad
    MOOD_INFLUENCE_STRENGTH: 0.8, // Fuerza de influencia del mood
    ACTIVITY_INERTIA_BONUS: 1.2, // Bonus por continuar actividad
    CHANGE_THRESHOLD: 0.15, // Threshold para cambiar actividad
  },
  
  // Rangos de personalidad (0-1)
  PERSONALITY_RANGES: {
    EXTRAVERSION: [0, 1],
    NEUROTICISM: [0, 1], 
    CONSCIENTIOUSNESS: [0, 1],
    AGREEABLENESS: [0, 1],
    OPENNESS: [0, 1],
  },
} as const;

// === CONSTANTES DE UI Y EXPERIENCIA ===

export const UI = {
  // Tiempos de animación y transición
  ANIMATION: {
    FAST: 200,
    NORMAL: 400,
    SLOW: 800,
    DIALOGUE_DURATION: 3000,
    FADE_DURATION: 500,
  },
  
  // Colores y visualización
  COLORS: {
    PRIMARY: '#4A90E2',
    SECONDARY: '#7ED321',
    WARNING: '#F5A623',
    DANGER: '#D0021B',
    SUCCESS: '#50E3C2',
  },
  
  // Configuración de logging
  LOGGING: {
    MAX_ENTRIES: 100,
    THROTTLE_MS: 1000,
    DEBUG_LEVELS: ['error', 'warn', 'info', 'debug'] as const,
  },
} as const;

// === CONSTANTES DE PERFORMANCE ===

export const PERFORMANCE = {
  // Límites y thresholds
  LIMITS: {
    MAX_ENTITIES: 10,
    MAX_LOG_ENTRIES: 100,
    MAX_BATCH_SIZE: 20,
    CULLING_DISTANCE: 1000,
  },
  
  // Thresholds de performance
  THRESHOLDS: {
    TARGET_FPS: 60,
    MIN_FPS: 30,
    MAX_FRAME_TIME: 16.67, // ~60fps
    MEMORY_WARNING_MB: 100,
    CPU_WARNING_PERCENT: 80,
  },
  
  // Configuración de batching
  BATCHING: {
    BATCH_SIZE: 20,
    FLUSH_INTERVAL: 100,
    PRIORITY_LEVELS: 10,
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

// Configuración completa como objeto único
export const GAME_CONSTANTS = {
  MATH,
  TIMING, 
  SURVIVAL,
  PHYSICS,
  RESONANCE,
  ACTIVITIES,
  ZONES,
  AI,
  UI,
  PERFORMANCE
} as const;

// Type helpers
export type ActivityType = typeof ACTIVITIES.TYPES[number];
export type SpeedMultiplier = keyof typeof TIMING.SPEED_MULTIPLIERS;
export type DebugLevel = typeof UI.LOGGING.DEBUG_LEVELS[number];

// Función para obtener constantes por categoría
export const getConstants = <T extends keyof typeof GAME_CONSTANTS>(category: T) => {
  return GAME_CONSTANTS[category];
};

// Validation helper
export const validateConstant = (category: string, key: string, value: number): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};