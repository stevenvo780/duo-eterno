// Tipos derivados de las interfaces principales
export const STAT_KEYS = ['hunger', 'sleepiness', 'loneliness', 'happiness', 'energy', 'boredom', 'money'] as const;
export type StatKey = typeof STAT_KEYS[number];

export const ZONE_TYPES = [
  'food',
  'rest',
  'play',
  'social',
  'comfort',
  'energy'
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

// Configuración de movimiento y colisiones
export const MOVEMENT_CONFIG = {
  ENTITY_SIZE: 16,
  MIN_DISTANCE_BETWEEN_ENTITIES: 25,
  REPULSION_FORCE: 2,
  COMPANION_SEEK_DISTANCE: 200,
  BASE_MOVEMENT_SPEED: 2.0
} as const;



// Mapeo de necesidades a tipos de zona (actualizado)
export const NEED_TO_ZONE_MAPPING: Partial<Record<StatKey, ZoneType>> = {
  hunger: 'food',
  sleepiness: 'rest',
  boredom: 'play',
  loneliness: 'social',
  happiness: 'comfort',
  energy: 'energy'
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


