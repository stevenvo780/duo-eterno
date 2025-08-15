import type { ZoneType, ActivityType, EntityStateType, MoodType } from '../constants/gameConstants';

export interface Position {
  x: number;
  y: number;
}

export interface EntityStats {
  hunger: number;
  sleepiness: number;
  loneliness: number;
  happiness: number;
  energy: number;
  boredom: number;
  money: number;
  health: number;
}

export interface Entity {
  id: 'circle' | 'square';
  position: Position;
  state: EntityStateType;
  activity: ActivityType;
  stats: EntityStats;
  lastStateChange: number;
  lastActivityChange: number;
  lastInteraction: number;
  pulsePhase: number;
  colorHue: number;
  mood: MoodType;
  thoughts: string[];
  isDead: boolean;
  timeOfDeath?: number;
}

export type EntityMood = MoodType;

export type InteractionType = 
  | 'NOURISH'
  | 'FEED' 
  | 'PLAY'
  | 'COMFORT'
  | 'DISTURB'
  | 'WAKE_UP'
  | 'LET_SLEEP';

export interface MapElement {
  id: string;
  type: 'obstacle' | 'food_zone' | 'rest_zone' | 'play_zone' | 'social_zone';
  position: Position;
  size: { width: number; height: number };
  color: string;
  effect?: {
    statType: keyof EntityStats;
    modifier: number;
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
  type: ZoneType;
  effects?: Partial<Record<keyof EntityStats, number>>;
  color: string;
  attractiveness: number;
}

export type { ZoneType, ActivityType, EntityStateType, MoodType } from '../constants/gameConstants';

export interface InteractionEffect {
  stats: Partial<EntityStats>;
  resonance?: number;
  mood?: EntityMood;
  duration?: number;
}

export type EntityActivity = ActivityType;

export interface GameState {
  entities: Entity[];
  resonance: number;
  cycles: number;
  lastSave: number;
  togetherTime: number;
  connectionAnimation: {
    active: boolean;
    startTime: number;
    type: InteractionType;
  };
  zones: Zone[];
  mapElements: MapElement[];
}
