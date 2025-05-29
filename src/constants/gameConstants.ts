// Tipos derivados de las interfaces principales
export const STAT_KEYS = ['hunger', 'sleepiness', 'loneliness', 'happiness', 'energy', 'boredom', 'money'] as const;
export type StatKey = typeof STAT_KEYS[number];

export const ZONE_TYPES = [
  'food', 'rest', 'play', 'social', 'comfort',
  'work', 'exercise', 'entertainment', 'shopping', 'learning', 'energy'
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

// Umbrales del sistema de supervivencia
export const SURVIVAL_THRESHOLDS = {
  CRITICAL: 85,
  URGENT: 70,
  LOW: 50,
  COMFORTABLE: 30
} as const;

// Umbrales de resonancia
export const RESONANCE_THRESHOLDS = {
  CRITICAL: 30,
  LOW: 50,
  GOOD: 70,
  EXCELLENT: 90
} as const;

// Configuración de movimiento y colisiones
export const MOVEMENT_CONFIG = {
  ENTITY_SIZE: 16,
  MIN_DISTANCE_BETWEEN_ENTITIES: 25,
  REPULSION_FORCE: 2,
  COMPANION_SEEK_DISTANCE: 200,
  BASE_MOVEMENT_SPEED: 2.0
} as const;

// Configuración de renderizado
export const RENDER_CONFIG = {
  PARTICLE_COUNT: 4,
  QUALITY_THRESHOLDS: {
    LOW_FPS: 30,
    MEDIUM_FPS: 50,
    HIGH_FPS: 55
  }
} as const;

// Mapeo de necesidades a tipos de zona
export const NEED_TO_ZONE_MAPPING: Partial<Record<StatKey, ZoneType>> = {
  hunger: 'food',
  sleepiness: 'rest',
  boredom: 'entertainment',
  loneliness: 'social',
  happiness: 'comfort',
  energy: 'energy'
  // money se obtiene en 'work' zones - manejado en lógica especial
} as const;

// Traducciones para la UI
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
    'money': 'Dinero'
  } as Record<StatKey, string>,
  
  ENTITIES: {
    'circle': 'Círculo',
    'square': 'Cuadrado'
  } as const
} as const;

// Configuración de personalidad (nuevo para IA mejorada)
export const PERSONALITY_TRAITS = {
  SOCIAL_PREFERENCE: 'socialPreference',
  ACTIVITY_PERSISTENCE: 'activityPersistence',
  RISK_TOLERANCE: 'riskTolerance',
  ENERGY_EFFICIENCY: 'energyEfficiency'
} as const;

export type PersonalityTrait = typeof PERSONALITY_TRAITS[keyof typeof PERSONALITY_TRAITS];
