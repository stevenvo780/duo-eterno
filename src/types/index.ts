export interface Position {
  x: number;
  y: number;
}

export interface EntityStats {
  hunger: number; // 0-100
  sleepiness: number; // 0-100
  loneliness: number; // 0-100
  happiness: number; // 0-100
  energy: number; // 0-100
  boredom: number; // 0-100
}

export interface Entity {
  id: 'circle' | 'square';
  position: Position;
  state: EntityState;
  activity: EntityActivity;
  stats: EntityStats;
  lastStateChange: number;
  lastActivityChange: number;
  lastInteraction: number;
  pulsePhase: number;
  colorHue: number;
  mood: EntityMood;
  thoughts: string[];
  isDead: boolean;
  timeOfDeath?: number;
}

export type EntityState = 'IDLE' | 'SEEKING' | 'LOW_RESONANCE' | 'FADING' | 'DEAD' | 'SLEEPING' | 'EATING' | 'PLAYING';

export type EntityActivity = 
  | 'WANDERING' 
  | 'MEDITATING' 
  | 'WRITING' 
  | 'RESTING' 
  | 'SOCIALIZING'
  | 'EXPLORING'
  | 'CONTEMPLATING'
  | 'DANCING'
  | 'HIDING';

export type EntityMood = 'HAPPY' | 'SAD' | 'TIRED' | 'EXCITED' | 'CALM' | 'ANXIOUS' | 'CONTENT';

export interface GameState {
  entities: Entity[];
  resonance: number; // 0-100 (vínculo entre entidades)
  cycles: number;
  lastSave: number;
  togetherTime: number; // time in ms when entities are together
  connectionAnimation: {
    active: boolean;
    startTime: number;
    type: InteractionType;
  };
  zones: Zone[];
  mapElements: MapElement[];
}

export interface DialogueState {
  visible: boolean;
  message: string;
  startTime: number;
  duration: number;
  speaker?: 'circle' | 'square' | 'system';
}

export type DialogueType = 
  | 'post-nutrition' 
  | 'low-resonance' 
  | 'autonomous-encounter' 
  | 'revival'
  | 'feeding'
  | 'playing'
  | 'comforting'
  | 'disturbing'
  | 'meditation'
  | 'writing'
  | 'tired'
  | 'hungry'
  | 'lonely'
  | 'happy';

export type InteractionType = 
  | 'NOURISH'
  | 'FEED' 
  | 'PLAY'
  | 'COMFORT'
  | 'DISTURB'
  | 'WAKE_UP'
  | 'LET_SLEEP';

export interface InteractionEffect {
  stats: Partial<EntityStats>;
  resonance?: number;
  mood?: EntityMood;
  duration?: number;
}

// Tipos para elementos del mapa y zonas especiales
export interface MapElement {
  id: string;
  type: 'obstacle' | 'food_zone' | 'rest_zone' | 'play_zone' | 'social_zone';
  position: Position;
  size: { width: number; height: number };
  color: string;
  effect?: {
    statType: keyof EntityStats;
    modifier: number; // positivo o negativo
  };
}

export interface Zone {
  id: string;
  name: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  type: 'comfort' | 'social' | 'food' | 'rest' | 'play';
  effects: {
    [K in keyof EntityStats]?: number;
  };
  color: string;
  attractiveness: number; // 0-1, qué tan atractiva es la zona para las entidades
}
