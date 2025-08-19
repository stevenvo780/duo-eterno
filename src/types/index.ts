export type ActivityType = 
  | 'RESTING'
  | 'MEDITATING'
  | 'SOCIALIZING'
  | 'WORKING'
  | 'EXERCISING'
  | 'WANDERING'
  | 'WRITING'
  | 'EXPLORING'
  | 'CONTEMPLATING'
  | 'DANCING'
  | 'HIDING'
  | 'SHOPPING'
  | 'COOKING';
export type ZoneType =
  | 'kitchen'
  | 'bedroom'
  | 'living'
  | 'bathroom'
  | 'office'
  | 'gym'
  | 'library'
  | 'social'
  | 'recreation'
  | 'food'
  | 'rest'
  | 'play'
  | 'comfort'
  | 'work'
  | 'energy';
export type EntityStateType = 
  | 'idle' 
  | 'moving' 
  | 'interacting' 
  | 'resting' 
  | 'seeking'
  | 'dead'
  | 'fading';
export type MoodType =
  | 'HAPPY'
  | 'SAD'
  | 'ANGRY'
  | 'CALM'
  | 'EXCITED'
  | 'BORED'
  | 'LONELY'
  | 'CONTENT'
  | 'ANXIOUS'
  | 'TIRED';

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
  controlMode: 'autonomous' | 'manual';
  isBeingDragged?: boolean;
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
  type:
    | 'obstacle'
    | 'food_zone'
    | 'rest_zone'
    | 'play_zone'
    | 'social_zone'
    | 'work_zone'
    | 'comfort_zone'
    | 'decoration';
  position: Position;
  size: { width: number; height: number };
  color: string;
  effect?: {
    statType: keyof EntityStats;
    modifier: number;
  };
  metadata?: {
    furnitureType?: string;
    assetId?: string;
    rotation?: number;
    [key: string]: unknown;
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
  metadata?: {
    furnitureTypes?: string[];
    priority?: number;
    [key: string]: unknown;
  };
}

export interface DialogueEntry {
  speaker: 'ISA' | 'STEV';
  text: string;
  emotion: string;
  activity: string;
}

export interface ConversationState {
  isActive: boolean;
  participants: string[];
  lastSpeaker: string | null;
  lastDialogue: DialogueEntry | null;
  startTime: number;
}

export interface InteractionEffect {
  stats: Partial<EntityStats>;
  resonance?: number;
  mood?: EntityMood;
  duration?: number;
}

export type EntityActivity = ActivityType;

export interface TerrainTile {
  x: number;
  y: number;
  assetId: string;
  type: 'grass' | 'stone' | 'water' | 'path';
  variant?: number;
}

export interface RoadPolyline {
  id: string;
  points: Position[];
  width: number;
  type: 'main' | 'secondary' | 'path';
}

export interface ObjectLayer {
  id: string;
  name: string;
  objects: MapElement[];
  zIndex: number;
  visible: boolean;
}

export interface WorldSize {
  width: number;
  height: number;
}

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
    entityId?: string;
  };
  zones: Zone[];
  mapElements: MapElement[];
  mapSeed?: string;
  currentConversation: ConversationState;
  // New unified map fields
  terrainTiles: TerrainTile[];
  roads: RoadPolyline[];
  objectLayers: ObjectLayer[];
  worldSize: WorldSize;
  generatorVersion: string;
}
