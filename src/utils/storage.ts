import type { GameState, Entity, Zone, ZoneType, EntityStateType, ActivityType, MoodType } from '../types';
import { STAT_KEYS, ACTIVITY_TYPES, ENTITY_STATES, MOOD_TYPES, ZONE_TYPES } from '../constants/gameConstants';
import { logStorage } from './logger';

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
    s.zones.every(isValidZone) &&
    typeof s.upgrades === 'object' &&
    s.upgrades !== null
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
      money: Math.max(0, entity.stats.money)
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

export const saveGameState = async (gameState: GameState): Promise<boolean> => {
  try {
    const payload = { ...gameState, lastSave: Date.now(), version: CURRENT_VERSION };
    await fetch('http://localhost:3001/saveState', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    logStorage.debug('Estado enviado a API', { size: JSON.stringify(payload).length });
    return true;
  } catch (error) {
    logStorage.error('Error guardando vía API', error);
    return false;
  }
};

export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const res = await fetch('http://localhost:3001/loadState');
    if (res.status === 204) return null;
    const parsed = await res.json();
    if (!isValidGameState(parsed)) {
      logStorage.error('Estado API inválido');
      return null;
    }
    const sanitized = sanitizeGameState(parsed);
    logStorage.info('Estado cargado desde API', {
      entities: sanitized.entities.length,
      resonance: sanitized.resonance,
      cycles: sanitized.cycles
    });
    return sanitized;
  } catch (error) {
    logStorage.error('Error cargando vía API', error);
    return null;
  }
};


