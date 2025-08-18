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



export const MATH = {

  PI: Math.PI,
  EULER: Math.E,
  LN_2: Math.LN2,
  SQRT_2: Math.SQRT2,
  SQRT_1_2: Math.SQRT1_2,
  

  GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2,
  GOLDEN_RATIO_CONJUGATE: (Math.sqrt(5) - 1) / 2,
  

  FIBONACCI_BASE: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55],
  HARMONIC_RATIOS: [1, 1/2, 1/3, 1/4, 1/5, 1/6],
  

  HIGH_PRECISION_EPSILON: Number.EPSILON,
  ULTRA_PRECISION_EPSILON: 1e-15,
  EFFECTIVE_ZERO: 1e-10,
} as const;



export const TIMING = {

  NATURAL_CYCLE_MS: 1000,
  BREATHING_CYCLE_MS: 4000,
  ATTENTION_SPAN_MS: 90000,
  

  MAIN_GAME_LOGIC: 800,
  DEGRADATION_UPDATE: 2000,
  MOVEMENT_UPDATE: 16,
  UI_UPDATE: 100,
  BATCH_FLUSH: 100,
  CLEANUP: 60000,
  

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



export const SURVIVAL = {

  CRITICAL_THRESHOLDS: {
    HEALTH: 10,
    HUNGER: 20,
    ENERGY: 15,
    HAPPINESS: 10,
    SLEEPINESS: 80,
    BOREDOM: 80,
    LONELINESS: 70,
  },
  

  DEGRADATION_RATES: {
    HUNGER: 0.08,
    ENERGY: 0.05,
    HAPPINESS: 0.03,
    SLEEPINESS: 0.04,
    BOREDOM: 0.06,
    LONELINESS: 0.02,
    HEALTH: 0.01,
  },
  

  LIVING_COSTS: {
    BASIC: 1.5,
    ACTIVITY: 0.5,
    LUXURY: 2.0,
  },
  

  ACTIVITY_MULTIPLIERS: {
    RESTING: 0.3,
    SLEEPING: 0.1,
    EATING: 0.8,
    MEDITATING: 0.4,
    READING: 1.0,
    EXERCISING: 1.8,
    SOCIALIZING: 0.9,
    WORKING: 1.3,
    PLAYING: 0.7,
  },
  

  RECOVERY_RATES: {
    EATING_HUNGER: 8.0,
    SLEEPING_ENERGY: 6.0,
    SOCIALIZING_LONELINESS: 4.0,
    RESTING_ALL: 1.5,
    MEDITATING_HAPPINESS: 3.0,
  },
} as const;



export const PHYSICS = {

  BASE_MOVEMENT_SPEED: 84,
  MAX_SPEED: 120,
  ACCELERATION: 50,
  FRICTION: 0.85,
  

  ENTITY_RADIUS: 15,
  PERSONAL_SPACE: 40,
  INTERACTION_DISTANCE: 80,
  ZONE_TRANSITION_DISTANCE: 20,
  

  PATHFINDING: {
    GRID_SIZE: 20,
    MAX_PATH_LENGTH: 50,
    RECALCULATION_THRESHOLD: 30,
    OBSTACLE_AVOIDANCE_DISTANCE: 60,
    WANDER_RADIUS: 100,
  },
  

  STEERING_WEIGHTS: {
    SEEK: 1.0,
    AVOID: 2.0,
    SEPARATE: 1.5,
    WANDER: 0.5,
  },
} as const;



export const RESONANCE = {

  MAX_DISTANCE: 400,
  DECAY_RATE: 0.02,
  BASE_FREQUENCY: 440.0,
  

  HARMONY_BONUS: 1.2,
  ACTIVITY_SYNC_BONUS: 1.15,
  PROXIMITY_WEIGHT: 0.6,
  MOOD_HARMONY_WEIGHT: 0.4,
  

  THRESHOLDS: {
    WEAK: 20,
    MODERATE: 50,
    STRONG: 75,
    INTENSE: 90,
  },
  

  EMERGENCE_THRESHOLD: 0.618,
  RESONANCE_DECAY_NATURAL: Math.exp(-1/60),
} as const;



export const ACTIVITIES = {

  TYPES: [
    'RESTING', 'SLEEPING', 'EATING', 'MEDITATING',
    'READING', 'EXERCISING', 'SOCIALIZING', 'WORKING', 'PLAYING'
  ] as const,
  

  OPTIMAL_DURATION: {
    RESTING: 180000,
    SLEEPING: 480000,
    EATING: 120000,
    MEDITATING: 300000,
    READING: 600000,
    EXERCISING: 240000,
    SOCIALIZING: 360000,
    WORKING: 1200000,
    PLAYING: 480000,
  },
  

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



export const ZONES = {

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
  

  TRANSITION: {
    SMOOTHNESS: 0.1,
    BONUS_DECAY_RATE: 0.05,
    EFFECTIVENESS_MULTIPLIER: 1.5,
  },
} as const;



export const AI = {

  DECISION: {
    SOFTMAX_TAU: 0.5,
    PERSONALITY_INFLUENCE: 0.3,
    MOOD_INFLUENCE_STRENGTH: 0.8,
    ACTIVITY_INERTIA_BONUS: 1.2,
    CHANGE_THRESHOLD: 0.15,
  },
  

  PERSONALITY_RANGES: {
    EXTRAVERSION: [0, 1],
    NEUROTICISM: [0, 1], 
    CONSCIENTIOUSNESS: [0, 1],
    AGREEABLENESS: [0, 1],
    OPENNESS: [0, 1],
  },
} as const;



export const UI = {

  ANIMATION: {
    FAST: 200,
    NORMAL: 400,
    SLOW: 800,
    DIALOGUE_DURATION: 3000,
    FADE_DURATION: 500,
  },
  

  COLORS: {
    PRIMARY: '#4A90E2',
    SECONDARY: '#7ED321',
    WARNING: '#F5A623',
    DANGER: '#D0021B',
    SUCCESS: '#50E3C2',
  },
  

  LOGGING: {
    MAX_ENTRIES: 100,
    THROTTLE_MS: 1000,
    DEBUG_LEVELS: ['error', 'warn', 'info', 'debug'] as const,
  },
} as const;



export const PERFORMANCE = {

  LIMITS: {
    MAX_ENTITIES: 10,
    MAX_LOG_ENTRIES: 100,
    MAX_BATCH_SIZE: 20,
    CULLING_DISTANCE: 1000,
  },
  

  THRESHOLDS: {
    TARGET_FPS: 60,
    MIN_FPS: 30,
    MAX_FRAME_TIME: 16.67,
    MEMORY_WARNING_MB: 100,
    CPU_WARNING_PERCENT: 80,
  },
  

  BATCHING: {
    BATCH_SIZE: 20,
    FLUSH_INTERVAL: 100,
    PRIORITY_LEVELS: 10,
  },
} as const;




export const TIMING_CONSTANTS = TIMING;
export const SURVIVAL_DYNAMICS = SURVIVAL;
export const MOVEMENT_DYNAMICS = PHYSICS;
export const ACTIVITY_DYNAMICS = ACTIVITIES;
export const MATH_CONSTANTS = MATH;


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


export type ActivityType = typeof ACTIVITIES.TYPES[number];
export type SpeedMultiplier = keyof typeof TIMING.SPEED_MULTIPLIERS;
export type DebugLevel = typeof UI.LOGGING.DEBUG_LEVELS[number];


export const getConstants = <T extends keyof typeof GAME_CONSTANTS>(category: T) => {
  return GAME_CONSTANTS[category];
};


export const validateConstant = (category: string, key: string, value: number): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};