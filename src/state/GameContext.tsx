import React, { createContext, useReducer, useEffect } from 'react';
import type { EntityMood, EntityStats, InteractionType, Entity, MapElement, Zone } from '../types';
import { DEFAULT_UPGRADES, type UpgradeState } from '../types/upgrades';
import { loadGameState, saveGameState } from '../utils/storage';
import { createDefaultZones, createDefaultMapElements } from '../utils/mapGeneration';
import type { ActivityType, EntityStateType } from '../constants/gameConstants';

// Local type definitions
interface GameState {
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
  upgrades: UpgradeState;
}

interface DialogueState {
  visible: boolean;
  message: string;
  startTime: number;
  duration: number;
  speaker?: 'circle' | 'square' | 'system';
}

type EntityState = EntityStateType;
type EntityActivity = ActivityType;

interface GameContextType {
  gameState: GameState;
  dialogueState: DialogueState;
  dispatch: React.Dispatch<GameAction>;
}

type GameAction = 
  | { type: 'UPDATE_RESONANCE'; payload: number }
  | { type: 'UPDATE_ENTITY_POSITION'; payload: { entityId: string; position: { x: number; y: number } } }
  | { type: 'UPDATE_ENTITY_TARGET'; payload: { entityId: string; target: { x: number; y: number } | undefined } }
  | { type: 'UPDATE_ENTITY_HEALTH'; payload: { entityId: string; health: number } }
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
  | { type: 'LOAD_SAVED_STATE'; payload: GameState }
  | { type: 'PURCHASE_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'CHECK_UNLOCK_REQUIREMENTS' };

const initialGameState: GameState = {
  entities: [
    {
      id: 'circle',
      position: { x: 150, y: 200 },
      targetPosition: undefined,
      state: 'IDLE',
      activity: 'WANDERING',
      stats: {
        hunger: 80,       // Comienza bien alimentado (mejorado de 70)
        sleepiness: 20,   // Comienza descansado (mejorado de 30)
        loneliness: 50,   // Moderado, buscará compañía (mejorado de 40)
        happiness: 75,    // Comienza feliz (mejorado de 65)
        energy: 85,       // Comienza con energía (mejorado de 75)
        boredom: 15,      // Poco aburrimiento (mejorado de 25)
        money: 50,        // Dinero inicial
        health: 100       // Salud inicial máxima
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
      targetPosition: undefined,
      state: 'IDLE',
      activity: 'WANDERING',
      stats: {
        hunger: 85,       // Comienza bien alimentado (mejorado)
        sleepiness: 15,   // Comienza descansado (mejorado)
        loneliness: 60,   // Moderado, necesita compañía
        happiness: 80,    // Comienza feliz (mejorado)
        energy: 90,       // Comienza con mucha energía (mejorado)
        boredom: 10,      // Comienza poco aburrido (mejorado)
        money: 50,        // Dinero inicial
        health: 100       // Salud inicial máxima
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
  mapElements: createDefaultMapElements(),
  upgrades: {
    availableUpgrades: DEFAULT_UPGRADES.map(upgrade => ({ ...upgrade })),
    purchasedUpgrades: {},
    totalMoneySpent: 0
  }
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

    case 'UPDATE_ENTITY_TARGET': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? { ...entity, targetPosition: action.payload.target }
            : entity
        )
      };
    }

    case 'UPDATE_ENTITY_HEALTH': {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.entityId
            ? { ...entity, health: Math.max(0, Math.min(100, action.payload.health)) }
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
                // Clampear estadísticas entre 0 y 100 unificando actualizaciones absolutas
                const updatedStats = { ...entity.stats };
                Object.entries(action.payload.stats).forEach(([stat, value]) => {
                  const num = typeof value === 'number' ? value : updatedStats[stat as keyof typeof updatedStats];
                  updatedStats[stat as keyof typeof updatedStats] = Math.max(0, Math.min(100, num));
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
                  boredom: 30,
                  money: 25, // Dinero reducido al revivir
                  health: 75 // Salud parcial al revivir
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

    case 'PURCHASE_UPGRADE': {
      const { upgradeId } = action.payload;
      const upgrade = state.upgrades.availableUpgrades.find(u => u.id === upgradeId);
      
      if (!upgrade || !upgrade.isUnlocked) return state;
      
      const currentLevel = state.upgrades.purchasedUpgrades[upgradeId] || 0;
      if (currentLevel >= upgrade.maxLevel) return state;
      
      const upgradeCost = upgrade.cost * (currentLevel + 1);
      const totalMoney = state.entities.reduce((sum, entity) => sum + entity.stats.money, 0);
      
      if (totalMoney < upgradeCost) return state;
      
      // Deducir dinero proporcionalmente de las entidades
      let remainingCost = upgradeCost;
      const updatedEntities = state.entities.map(entity => {
        if (remainingCost <= 0) return entity;
        
        const entityContribution = Math.min(entity.stats.money, remainingCost);
        remainingCost -= entityContribution;
        
        return {
          ...entity,
          stats: {
            ...entity.stats,
            money: entity.stats.money - entityContribution
          }
        };
      });
      
      return {
        ...state,
        entities: updatedEntities,
        upgrades: {
          ...state.upgrades,
          purchasedUpgrades: {
            ...state.upgrades.purchasedUpgrades,
            [upgradeId]: currentLevel + 1
          },
          totalMoneySpent: state.upgrades.totalMoneySpent + upgradeCost
        }
      };
    }

    case 'CHECK_UNLOCK_REQUIREMENTS': {
      const updatedUpgrades = state.upgrades.availableUpgrades.map(upgrade => {
        if (upgrade.isUnlocked || !upgrade.unlockRequirement) return upgrade;
        
        const req = upgrade.unlockRequirement;
        let shouldUnlock = false;
        
        switch (req.type) {
          case 'MONEY':
            shouldUnlock = state.upgrades.totalMoneySpent >= req.value;
            break;
          case 'RESONANCE':
            shouldUnlock = state.resonance >= req.value;
            break;
          case 'CYCLES':
            shouldUnlock = state.cycles >= req.value;
            break;
          case 'TOGETHER_TIME':
            shouldUnlock = state.togetherTime >= req.value;
            break;
        }
        
        return { ...upgrade, isUnlocked: shouldUnlock };
      });
      
      return {
        ...state,
        upgrades: {
          ...state.upgrades,
          availableUpgrades: updatedUpgrades
        }
      };
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
    (async () => {
      const saved = await loadGameState();
      if (saved) dispatch({ type: 'LOAD_SAVED_STATE', payload: saved });
    })();
  }, []);

  // Save state on changes
  useEffect(() => {
    (async () => {
      await saveGameState(gameState);
    })();
  }, [gameState]);

  return (
    <GameContext.Provider value={{ gameState, dialogueState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
