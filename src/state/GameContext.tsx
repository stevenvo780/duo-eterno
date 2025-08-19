import React, { createContext, useReducer, useEffect, useRef } from 'react';
import type {
  GameState,
  EntityMood,
  EntityStats,
  InteractionType,
  DialogueEntry,
  ConversationState,
  ActivityType,
  EntityStateType,
  TerrainTile,
  RoadPolyline,
  ObjectLayer,
  Zone,
  MapElement
} from '../types';
import { createDefaultZones, createDefaultMapElements } from '../utils/mapGeneration';
import { generateUnifiedMap } from '../utils/unifiedMapGeneration';
import { usePersistence } from '../hooks/usePersistence';
import { gameConfig } from '../config/gameConfig';
import { WORLD_SIZE, TILE_SIZE, GENERATOR_VERSION } from '../constants/mapConstants';

interface DialogueState {
  visible: boolean;
  message: string;
  startTime: number;
  duration: number;
  speaker?: 'isa' | 'stev' | 'system';
  entityId?: string;
  emotion?: string;
  position?: { x: number; y: number };
}

interface GameContextType {
  gameState: GameState;
  dialogueState: DialogueState;
  dispatch: React.Dispatch<GameAction>;
}

type GameAction =
  | { type: 'UPDATE_RESONANCE'; payload: number }
  | {
      type: 'UPDATE_ENTITY_POSITION';
      payload: { entityId: string; position: { x: number; y: number } };
    }
  | { type: 'UPDATE_ENTITY_STATE'; payload: { entityId: string; state: EntityStateType } }
  | { type: 'UPDATE_ENTITY_ACTIVITY'; payload: { entityId: string; activity: ActivityType } }
  | { type: 'UPDATE_ENTITY_STATS'; payload: { entityId: string; stats: Partial<EntityStats> } }
  | { type: 'UPDATE_ENTITY_MOOD'; payload: { entityId: string; mood: EntityMood } }
  | { type: 'ADD_THOUGHT'; payload: { entityId: string; thought: string } }
  | { type: 'KILL_ENTITY'; payload: { entityId: string } }
  | { type: 'REVIVE_ENTITY'; payload: { entityId: string } }
  | { type: 'BREAK_RELATIONSHIP' }
  | { type: 'TICK'; payload: number }
  | { type: 'INTERACT'; payload: { type: InteractionType; entityId?: string } }
  | { type: 'SET_ENTITY_CONTROL_MODE'; payload: { entityId: string; controlMode: 'autonomous' | 'manual' } }
  | { type: 'SET_ENTITY_DRAGGING'; payload: { entityId: string; isBeingDragged: boolean } }
  | {
      type: 'SHOW_DIALOGUE';
      payload: {
        message: string;
        duration?: number;
        speaker?: 'isa' | 'stev' | 'system';
        entityId?: string;
        emotion?: string;
        position?: { x: number; y: number };
      };
    }
  | { type: 'HIDE_DIALOGUE' }
  | { type: 'START_CONNECTION_ANIMATION'; payload: { type: InteractionType } }
  | { type: 'UPDATE_TOGETHER_TIME'; payload: number }
  | { type: 'RESET_GAME' }
  | { type: 'GENERATE_NEW_MAP'; payload?: { seed?: string } }
  | { type: 'SET_UNIFIED_MAP_DATA'; payload: { 
      zones: Zone[]; 
      mapElements: MapElement[]; 
      terrainTiles: TerrainTile[]; 
      roads: RoadPolyline[]; 
      objectLayers: ObjectLayer[]; 
      mapSeed: string; 
    } }
  | { type: 'LOAD_SAVED_STATE'; payload: GameState }
  | { type: 'START_CONVERSATION'; payload: { participants: string[] } }
  | { type: 'ADVANCE_CONVERSATION'; payload: { speaker: string; dialogue: DialogueEntry } }
  | { type: 'END_CONVERSATION' };

const initialConversationState: ConversationState = {
  isActive: false,
  participants: [],
  lastSpeaker: null,
  lastDialogue: null,
  startTime: 0
};

const initialGameState: GameState = {
  entities: [
    {
      id: 'isa',
      position: { x: gameConfig.entityCircleInitialX, y: gameConfig.entityCircleInitialY },
      state: 'idle',
      activity: 'RESTING',
      stats: {
        hunger: gameConfig.entityInitialStats,
        sleepiness: gameConfig.entityInitialStats,
        loneliness: gameConfig.entityInitialStats,
        happiness: gameConfig.entityInitialStats,
        energy: gameConfig.entityInitialStats,
        boredom: gameConfig.entityInitialStats,
        money: gameConfig.entityInitialMoney,
        health: gameConfig.entityInitialHealth
      },
      lastStateChange: Date.now(),
      lastActivityChange: Date.now(),
      lastInteraction: Date.now(),
      pulsePhase: 0,
      colorHue: 200,
      mood: '😊',
      thoughts: [],
      isDead: false,
      controlMode: 'autonomous',
      isBeingDragged: false
    },
    {
      id: 'stev',
      position: { x: gameConfig.entitySquareInitialX, y: gameConfig.entitySquareInitialY },
      state: 'idle',
      activity: 'RESTING',
      stats: {
        hunger: gameConfig.entityInitialStats,
        sleepiness: gameConfig.entityInitialStats,
        loneliness: gameConfig.entityInitialStats,
        happiness: gameConfig.entityInitialStats,
        energy: gameConfig.entityInitialStats,
        boredom: gameConfig.entityInitialStats,
        money: gameConfig.entityInitialMoney,
        health: gameConfig.entityInitialHealth
      },
      lastStateChange: Date.now(),
      lastActivityChange: Date.now(),
      lastInteraction: Date.now(),
      pulsePhase: Math.PI,
      colorHue: 300,
      mood: '😊',
      thoughts: [],
      isDead: false,
      controlMode: 'autonomous',
      isBeingDragged: false
    }
  ],
  resonance: gameConfig.initialResonance,
  cycles: 0,
  lastSave: Date.now(),
  togetherTime: 0,
  connectionAnimation: {
    active: false,
    startTime: 0,
    type: 'NOURISH'
  },
  zones: [],
  mapElements: [],
  mapSeed: Date.now().toString(36),
  currentConversation: initialConversationState,
  // New unified map fields
  terrainTiles: [],
  roads: [],
  objectLayers: [],
  worldSize: WORLD_SIZE,
  generatorVersion: GENERATOR_VERSION
};

const initialDialogueState: DialogueState = {
  visible: false,
  message: '',
  startTime: 0,
  duration: 3000,
  speaker: undefined,
  entityId: undefined,
  emotion: undefined,
  position: undefined
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'UPDATE_RESONANCE': {
      return { ...state, resonance: Math.max(0, Math.min(100, action.payload)) };
    }

    case 'UPDATE_ENTITY_POSITION': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? { ...entity, position: action.payload.position }
            : entity
        )
      };
    }

    case 'UPDATE_ENTITY_STATE': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? { ...entity, state: action.payload.state, lastStateChange: Date.now() }
            : entity
        )
      };
    }

    case 'UPDATE_ENTITY_ACTIVITY': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? { ...entity, activity: action.payload.activity, lastActivityChange: Date.now() }
            : entity
        )
      };
    }

    case 'UPDATE_ENTITY_STATS': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? (() => {
                const updatedStats = { ...entity.stats };
                Object.entries(action.payload.stats).forEach(([stat, value]) => {
                  const key = stat as keyof EntityStats;
                  const num = typeof value === 'number' ? value : updatedStats[key];
                  if (key === 'money') {
                    updatedStats.money = Math.max(0, Number(num));
                  } else {
                    updatedStats[key] = Math.max(0, Math.min(100, Number(num)));
                  }
                });
                return { ...entity, stats: updatedStats };
              })()
            : entity
        )
      };
    }

    case 'UPDATE_ENTITY_MOOD': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId ? { ...entity, mood: action.payload.mood } : entity
        )
      };
    }

    case 'ADD_THOUGHT': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? {
                ...entity,
                thoughts: [...entity.thoughts.slice(-4), action.payload.thought]
              }
            : entity
        )
      };
    }

    case 'KILL_ENTITY': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? {
                ...entity,
                isDead: true,
                state: 'dead',
                timeOfDeath: Date.now()
              }
            : entity
        )
      };
    }

    case 'REVIVE_ENTITY': {
      return {
        ...state,
        resonance: Math.max(state.resonance, 50),
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? {
                ...entity,
                isDead: false,
                state: 'idle',
                timeOfDeath: undefined,
                stats: {
                  hunger: gameConfig.thresholdLow,
                  sleepiness: gameConfig.thresholdLow,
                  loneliness: gameConfig.thresholdComfortable - 10,
                  happiness: gameConfig.thresholdLow - 10,
                  energy: gameConfig.thresholdComfortable - 10,
                  boredom: gameConfig.thresholdWarning,
                  money: gameConfig.entityInitialMoney / 2,
                  health: gameConfig.thresholdLow
                }
              }
            : entity
        )
      };
    }

    case 'BREAK_RELATIONSHIP': {
      return {
        ...state,
        resonance: 0,
        entities: state.entities.map(entity => ({
          ...entity,
          isDead: true,
          state: 'dead' as EntityStateType,
          timeOfDeath: Date.now()
        }))
      };
    }

    case 'TICK': {
      return {
        ...state,
        cycles: state.cycles + 1
      };
    }

    case 'INTERACT': {
      return {
        ...state,
        connectionAnimation: {
          active: true,
          startTime: Date.now(),
          type: action.payload.type
        }
      };
    }

    case 'SET_ENTITY_CONTROL_MODE': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? { ...entity, controlMode: action.payload.controlMode }
            : entity
        )
      };
    }

    case 'SET_ENTITY_DRAGGING': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? { ...entity, isBeingDragged: action.payload.isBeingDragged }
            : entity
        )
      };
    }

    case 'START_CONNECTION_ANIMATION': {
      return {
        ...state,
        connectionAnimation: {
          active: true,
          startTime: Date.now(),
          type: action.payload.type
        }
      };
    }

    case 'UPDATE_TOGETHER_TIME': {
      return { ...state, togetherTime: action.payload };
    }

    case 'RESET_GAME': {
      const newSeed = Date.now().toString(36);
      
      // Por ahora usar fallback síncrono, la generación asíncrona se maneja en useEffect
      const zones = createDefaultZones();
      const mapElements = createDefaultMapElements();
      
      return {
        ...initialGameState,
        cycles: 0,
        mapSeed: newSeed,
        zones,
        mapElements,
        terrainTiles: [],
        roads: [],
        objectLayers: [],
        worldSize: WORLD_SIZE,
        generatorVersion: GENERATOR_VERSION
      };
    }

    case 'GENERATE_NEW_MAP': {
      const newSeed = action.payload?.seed || Date.now().toString(36);
      
      // Por ahora usar fallback síncrono, la generación asíncrona se maneja en useEffect
      const zones = createDefaultZones();
      const mapElements = createDefaultMapElements();
      
      return {
        ...state,
        mapSeed: newSeed,
        zones,
        mapElements,
        terrainTiles: [],
        roads: [],
        objectLayers: [],
        worldSize: WORLD_SIZE,
        generatorVersion: GENERATOR_VERSION
      };
    }

    case 'SET_UNIFIED_MAP_DATA': {
      return {
        ...state,
        zones: action.payload.zones,
        mapElements: action.payload.mapElements,
        terrainTiles: action.payload.terrainTiles,
        roads: action.payload.roads,
        objectLayers: action.payload.objectLayers,
        mapSeed: action.payload.mapSeed,
        worldSize: WORLD_SIZE,
        generatorVersion: GENERATOR_VERSION
      };
    }

    case 'LOAD_SAVED_STATE': {
      return action.payload;
    }

    case 'START_CONVERSATION':
      return {
        ...state,
        currentConversation: {
          isActive: true,
          participants: action.payload.participants,
          lastSpeaker: null,
          lastDialogue: null,
          startTime: Date.now()
        }
      };

    case 'ADVANCE_CONVERSATION':
      return {
        ...state,
        currentConversation: {
          ...state.currentConversation,
          lastSpeaker: action.payload.speaker,
          lastDialogue: action.payload.dialogue
        }
      };

    case 'END_CONVERSATION':
      return {
        ...state,
        currentConversation: {
          isActive: false,
          participants: [],
          lastSpeaker: null,
          lastDialogue: null,
          startTime: 0
        }
      };

    default:
      return state;
  }
};

const dialogueReducer = (state: DialogueState, action: GameAction): DialogueState => {
  switch (action.type) {
    case 'SHOW_DIALOGUE': {
      return {
        visible: true,
        message: action.payload.message,
        startTime: Date.now(),
        duration: action.payload.duration || 3000,
        speaker: action.payload.speaker,
        entityId: action.payload.entityId,
        emotion: action.payload.emotion,
        position: action.payload.position
      };
    }

    case 'HIDE_DIALOGUE': {
      return { ...state, visible: false };
    }

    default:
      return state;
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export { GameContext };

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, gameDispatch] = useReducer(gameReducer, initialGameState);
  const [dialogueState, dialogueDispatch] = useReducer(dialogueReducer, initialDialogueState);

  const dispatch = (action: GameAction) => {
    gameDispatch(action);
    dialogueDispatch(action);
  };

  // Ref to prevent multiple simultaneous map generations
  const isGeneratingMap = useRef(false);

  // Handle async map generation
  useEffect(() => {
    const generateMapAsync = async () => {
      try {
        console.log('🗺️ Generando mapa unificado...');
        const mapResult = await generateUnifiedMap({
          seed: gameState.mapSeed,
          width: WORLD_SIZE.width,
          height: WORLD_SIZE.height,
          tileSize: TILE_SIZE,
          algorithm: 'organic'
        });

        // Convert objectLayers from mapElements (temporary until proper objectLayers are implemented)
        const objectLayers: ObjectLayer[] = [
          {
            id: 'main-objects',
            name: 'Objetos principales',
            objects: mapResult.mapElements,
            zIndex: 1,
            visible: true
          }
        ];

        dispatch({
          type: 'SET_UNIFIED_MAP_DATA',
          payload: {
            zones: mapResult.zones,
            mapElements: mapResult.mapElements,
            terrainTiles: mapResult.terrainTiles,
            roads: [], // TODO: implement roads in unifiedMapGeneration
            objectLayers,
            mapSeed: gameState.mapSeed || Date.now().toString(36)
          }
        });

        console.log('✅ Mapa unificado generado:', {
          zones: mapResult.zones.length,
          mapElements: mapResult.mapElements.length,
          terrainTiles: mapResult.terrainTiles.length,
          assetStats: mapResult.assetStats
        });
      } catch (error) {
        console.error('❌ Error generando mapa unificado:', error);
      }
    };

    // Only generate if we have a mapSeed but no terrainTiles (initial load or new map)
    if (gameState.mapSeed && gameState.terrainTiles.length === 0 && !isGeneratingMap.current) {
      isGeneratingMap.current = true;
      generateMapAsync().finally(() => {
        isGeneratingMap.current = false;
      });
    }
  }, [gameState.mapSeed, gameState.terrainTiles.length]);

  useEffect(() => {
    // Only generate initial map if no mapSeed exists
    if (!gameState.mapSeed) {
      dispatch({ type: 'GENERATE_NEW_MAP' });
    }
  }, [gameState.mapSeed]);

  usePersistence(gameState, dispatch);

  return (
    <GameContext.Provider value={{ gameState, dialogueState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
