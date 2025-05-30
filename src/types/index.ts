import type { ZoneType, ActivityType, EntityStateType, MoodType } from '../constants/gameConstants';
import type { UpgradeState } from './upgrades';

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
  money: number; // Sistema de dinero para necesidades
  health: number; // 0-100 - Sistema de vida
}

export interface Entity {
  id: 'circle' | 'square';
  position: Position;
  targetPosition?: Position;
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
  type: ZoneType;
  color: string;
  attractiveness: number; // 0-1, qué tan atractiva es la zona para las entidades
}

// Re-exportar tipos de constantes para conveniencia
export type { ZoneType, ActivityType, EntityStateType, MoodType } from '../constants/gameConstants';

// Local types that were removed but are still needed
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
  upgrades: UpgradeState; // Using proper UpgradeState type
}
