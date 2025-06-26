import type { GameState, Entity, Zone, ZoneType, EntityStateType, ActivityType, MoodType } from '../types';
import { STAT_KEYS, ACTIVITY_TYPES, ENTITY_STATES, MOOD_TYPES, ZONE_TYPES } from '../constants/gameConstants';
import { logStorage } from './logger';

const STORAGE_KEY = 'duoEternoState';
const CURRENT_VERSION = '1.0.0';

// Esquema de validación para Entity
const isValidEntity = (entity: unknown): entity is Entity => {
  if (!entity || typeof entity !== 'object') return false;
  
  const e = entity as Partial<Entity>;
  
  return (
    (e.id === 'circle' || e.id === 'square') &&
    typeof e.position === 'object' &&
    typeof e.position?.x === 'number' &&
    typeof e.position?.y === 'number' &&
    ENTITY_STATES.includes(e.state as EntityStateType) &&
    ACTIVITY_TYPES.includes(e.activity as ActivityType) &&
    MOOD_TYPES.includes(e.mood as MoodType) &&
    typeof e.stats === 'object' &&
    STAT_KEYS.every(stat => typeof e.stats?.[stat] === 'number') &&
    typeof e.lastStateChange === 'number' &&
    typeof e.lastActivityChange === 'number' &&
    typeof e.lastInteraction === 'number' &&
    typeof e.pulsePhase === 'number' &&
    typeof e.colorHue === 'number' &&
    Array.isArray(e.thoughts) &&
    typeof e.isDead === 'boolean'
  );
};

// Esquema de validación para Zone
const isValidZone = (zone: unknown): zone is Zone => {
  if (!zone || typeof zone !== 'object') return false;
  
  const z = zone as Partial<Zone>;
  
  return (
    typeof z.id === 'string' &&
    typeof z.name === 'string' &&
    ZONE_TYPES.includes(z.type as ZoneType) &&
    typeof z.bounds === 'object' &&
    typeof z.bounds?.x === 'number' &&
    typeof z.bounds?.y === 'number' &&
    typeof z.bounds?.width === 'number' &&
    typeof z.bounds?.height === 'number' &&
    typeof z.attractiveness === 'number'
  );
};

// Validación completa del GameState
const isValidGameState = (state: unknown): state is GameState => {
  if (!state || typeof state !== 'object') return false;
  
  const s = state as Partial<GameState>;
  
  return (
    Array.isArray(s.entities) &&
    s.entities.length === 2 &&
    s.entities.every(isValidEntity) &&
    typeof s.resonance === 'number' &&
    typeof s.cycles === 'number' &&
    typeof s.lastSave === 'number' &&
    typeof s.togetherTime === 'number' &&
    typeof s.connectionAnimation === 'object' &&
    typeof s.connectionAnimation?.active === 'boolean' &&
    typeof s.connectionAnimation?.startTime === 'number' &&
    Array.isArray(s.zones) &&
    s.zones.every(isValidZone)
  );
};

// Función para sanitizar y corregir valores fuera de rango
const sanitizeGameState = (state: GameState): GameState => {
  const sanitized = { ...state };
  
  // Sanitizar stats de entidades
  sanitized.entities = state.entities.map(entity => ({
    ...entity,
    stats: {
      ...entity.stats,
      hunger: Math.max(0, Math.min(100, entity.stats.hunger)),
      sleepiness: Math.max(0, Math.min(100, entity.stats.sleepiness)),
      loneliness: Math.max(0, Math.min(100, entity.stats.loneliness)),
      happiness: Math.max(0, Math.min(100, entity.stats.happiness)),
      energy: Math.max(0, Math.min(100, entity.stats.energy)),
      boredom: Math.max(0, Math.min(100, entity.stats.boredom)),
      money: Math.max(0, entity.stats.money),
      health: Math.max(0, Math.min(100, entity.stats.health))
    },
    position: {
      x: Math.max(0, Math.min(800, entity.position.x)),
      y: Math.max(0, Math.min(600, entity.position.y))
    }
  }));
  
  // Sanitizar resonancia
  sanitized.resonance = Math.max(0, Math.min(100, state.resonance));
  
  // Sanitizar tiempo juntos
  sanitized.togetherTime = Math.max(0, state.togetherTime);
  
  return sanitized;
};

export const saveGameState = (gameState: GameState): boolean => {
  try {
    const stateToSave = {
      ...gameState,
      lastSave: Date.now(),
      version: CURRENT_VERSION
    };
    
    const serialized = JSON.stringify(stateToSave);
    
    // Verificar que el tamaño no exceda límites del localStorage
    if (serialized.length > 5 * 1024 * 1024) { // 5MB límite
      logStorage.warn('Estado del juego demasiado grande, comprimiendo...');
      // Reducir datos no esenciales
      const compressedState = {
        ...stateToSave,
        entities: stateToSave.entities.map(e => ({
          ...e,
          thoughts: e.thoughts.slice(-5) // Solo últimos 5 pensamientos
        }))
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compressedState));
    } else {
      localStorage.setItem(STORAGE_KEY, serialized);
    }
    
    logStorage.debug('Estado guardado exitosamente', { size: serialized.length });
    return true;
  } catch (error) {
    logStorage.error('Error al guardar estado del juego', error);
    return false;
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) {
      logStorage.debug('No se encontró estado guardado');
      return null;
    }
    
    const parsedState = JSON.parse(savedState);
    
    // Verificar versión
    if (parsedState.version && parsedState.version !== CURRENT_VERSION) {
      logStorage.warn('Versión de estado incompatible', { 
        saved: parsedState.version, 
        current: CURRENT_VERSION 
      });
      // Aquí podrías agregar migración de datos si es necesario
    }
    
    // Validar estructura completa
    if (!isValidGameState(parsedState)) {
      logStorage.error('Estado guardado tiene estructura inválida');
      return null;
    }
    
    // Sanitizar valores
    const sanitizedState = sanitizeGameState(parsedState);
    
    logStorage.info('Estado cargado exitosamente', { 
      entities: sanitizedState.entities.length,
      resonance: sanitizedState.resonance,
      cycles: sanitizedState.cycles
    });
    
    return sanitizedState;
  } catch (error) {
    logStorage.error('Error al cargar estado del juego', error);
    return null;
  }
};


