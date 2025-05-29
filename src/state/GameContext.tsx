import React, { createContext, useReducer, useEffect } from 'react';
import type { GameState, DialogueState, EntityState, EntityActivity, EntityMood, EntityStats, InteractionType } from '../types';
import { saveGameState, loadGameState } from '../utils/storage';
import { createDefaultZones, createDefaultMapElements } from '../utils/mapGeneration';

interface GameContextType {
  gameState: GameState;
  dialogueState: DialogueState;
  dispatch: React.Dispatch<GameAction>;
}

export type GameAction = 
  | { type: 'UPDATE_RESONANCE'; payload: number }
  | { type: 'UPDATE_ENTITY_POSITION'; payload: { entityId: string; position: { x: number; y: number } } }
  | { type: 'UPDATE_ENTITY_STATE'; payload: { entityId: string; state: EntityState } }
  | { type: 'UPDATE_ENTITY_ACTIVITY'; payload: { entityId: string; activity: EntityActivity } }
  | { type: 'UPDATE_ENTITY_STATS'; payload: { entityId: string; stats: Partial<EntityStats> } }
  | { type: 'UPDATE_ENTITY_MOOD'; payload: { entityId: string; mood: EntityMood } }
  | { type: 'ADD_THOUGHT'; payload: { entityId: string; thought: string } }
  | { type: 'KILL_ENTITY'; payload: { entityId: string } }
  | { type: 'REVIVE_ENTITY'; payload: { entityId: string } }
  | { type: 'BREAK_RELATIONSHIP' }
  | { type: 'TICK' }
  | { type: 'INTERACT'; payload: { type: InteractionType; entityId?: string } }
  | { type: 'SHOW_DIALOGUE'; payload: { message: string; duration?: number; speaker?: 'circle' | 'square' | 'system' } }
  | { type: 'HIDE_DIALOGUE' }
  | { type: 'START_CONNECTION_ANIMATION'; payload: { type: InteractionType } }
  | { type: 'UPDATE_TOGETHER_TIME'; payload: number }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_SAVED_STATE'; payload: GameState };

const initialGameState: GameState = {
  entities: [
    {
      id: 'circle',
      position: { x: 150, y: 200 },
      state: 'IDLE',
      activity: 'WANDERING',
      stats: {
        hunger: 60,
        sleepiness: 30,
        loneliness: 40,
        happiness: 70,
        energy: 80,
        boredom: 20
      },
      lastStateChange: Date.now(),
      lastActivityChange: Date.now(),
      lastInteraction: Date.now(),
      pulsePhase: 0,
      colorHue: 200,
      mood: 'CONTENT',
      thoughts: [],
      isDead: false
    },
    {
      id: 'square',
      position: { x: 250, y: 200 },
      state: 'IDLE',
      activity: 'WANDERING',
      stats: {
        hunger: 60,
        sleepiness: 30,
        loneliness: 40,
        happiness: 70,
        energy: 80,
        boredom: 20
      },
      lastStateChange: Date.now(),
      lastActivityChange: Date.now(),
      lastInteraction: Date.now(),
      pulsePhase: Math.PI,
      colorHue: 300,
      mood: 'CONTENT',
      thoughts: [],
      isDead: false
    }
  ],
  resonance: 75,
  cycles: 0,
  lastSave: Date.now(),
  togetherTime: 0,
  connectionAnimation: {
    active: false,
    startTime: 0,
    type: 'NOURISH'
  },
  zones: createDefaultZones(),
  mapElements: createDefaultMapElements()
};

const initialDialogueState: DialogueState = {
  visible: false,
  message: '',
  startTime: 0,
  duration: 3000
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
            ? { ...entity, stats: { ...entity.stats, ...action.payload.stats } }
            : entity
        )
      };
    }

    case 'UPDATE_ENTITY_MOOD': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? { ...entity, mood: action.payload.mood }
            : entity
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
                thoughts: [...entity.thoughts.slice(-4), action.payload.thought] // Keep last 5 thoughts
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
                state: 'DEAD',
                timeOfDeath: Date.now()
              }
            : entity
        )
      };
    }

    case 'REVIVE_ENTITY': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? { 
                ...entity, 
                isDead: false, 
                state: 'IDLE',
                timeOfDeath: undefined,
                stats: {
                  hunger: 50,
                  sleepiness: 50,
                  loneliness: 60,
                  happiness: 40,
                  energy: 60,
                  boredom: 30
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
          state: 'DEAD' as EntityState,
          timeOfDeath: Date.now()
        }))
      };
    }
    
    case 'TICK': {
      const newResonance = Math.max(0, state.resonance - 0.3);
      return {
        ...state,
        resonance: newResonance,
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
      return { ...initialGameState, cycles: 0 };
    }
    
    case 'LOAD_SAVED_STATE': {
      return action.payload;
    }
    
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
        speaker: action.payload.speaker
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

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      dispatch({ type: 'LOAD_SAVED_STATE', payload: savedState });
    }
  }, []);

  // Save state on changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  return (
    <GameContext.Provider value={{ gameState, dialogueState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
