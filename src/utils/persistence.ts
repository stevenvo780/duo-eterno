import type { GameState } from '../types';
import { logStorage } from './logger';

const STORAGE_KEY = 'duoEternoState';
const VERSION = 1;

export interface PersistedStateV1 {
  version: number;
  resonance: number;
  lastSave: number;
  togetherTime: number;
  cycles: number;
  entities: Array<{
    id: string;
    position: { x: number; y: number };
    stats: GameState['entities'][number]['stats'];
    mood: GameState['entities'][number]['mood'];
    state: GameState['entities'][number]['state'];
    activity: GameState['entities'][number]['activity'];
    isDead: boolean;
    pulsePhase: number;
    colorHue: number;
    lastStateChange: number;
    lastActivityChange: number;
    lastInteraction: number;
  }>;
}

export type PersistedStateAny = PersistedStateV1;

export const serializeStateV1 = (state: GameState): PersistedStateV1 => ({
  version: VERSION,
  resonance: state.resonance,
  lastSave: Date.now(),
  togetherTime: state.togetherTime,
  cycles: state.cycles,
  entities: state.entities.map(e => ({
    id: e.id,
    position: e.position,
    stats: e.stats,
    mood: e.mood,
    state: e.state,
    activity: e.activity,
    isDead: e.isDead,
    pulsePhase: e.pulsePhase,
    colorHue: e.colorHue,
    lastStateChange: e.lastStateChange,
    lastActivityChange: e.lastActivityChange,
    lastInteraction: e.lastInteraction,
  }))
});

export const migrateToLatest = (raw: unknown): PersistedStateV1 | null => {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Partial<PersistedStateAny> & Record<string, unknown>;
  const version = typeof data.version === 'number' ? data.version : 1;


  if (version === 1) {

    if (!Array.isArray(data.entities) || typeof data.resonance !== 'number') return null;
    return data as PersistedStateV1;
  }


  try {
    const v1: PersistedStateV1 = {
      version: 1,
      resonance: Number((data as Record<string, unknown>).resonance) || 50,
      lastSave: Date.now(),
      togetherTime: Number((data as Record<string, unknown>).togetherTime) || 0,
      cycles: Number((data as Record<string, unknown>).cycles) || 0,
      entities: ((data as Record<string, unknown>).entities as unknown[] || []).map((e: unknown) => {
        const entity = e as Record<string, unknown>;
        return {
          id: entity.id as string,
          position: entity.position as { x: number; y: number },
          stats: entity.stats as GameState['entities'][number]['stats'],
          mood: entity.mood as GameState['entities'][number]['mood'],
          state: entity.state as GameState['entities'][number]['state'],
          activity: entity.activity as GameState['entities'][number]['activity'],
          isDead: !!entity.isDead,
          pulsePhase: Number(entity.pulsePhase) || 0,
          colorHue: Number(entity.colorHue) || 0,
          lastStateChange: Number(entity.lastStateChange) || Date.now(),
          lastActivityChange: Number(entity.lastActivityChange) || Date.now(),
          lastInteraction: Number(entity.lastInteraction) || Date.now()
        };
      })
    };
    return v1;
  } catch (e) {
    logStorage.error('Error migrating persisted state', e);
    return null;
  }
};

export const safeLoad = (): PersistedStateV1 | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return migrateToLatest(parsed);
  } catch (e) {
    logStorage.error('Error parsing persisted state', e);
    return null;
  }
};

export const safeSave = (state: GameState): void => {
  try {
    const data = serializeStateV1(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    logStorage.debug('Autosave OK', { size: JSON.stringify(data).length });
  } catch (e) {
    logStorage.error('Error during autosave', e);
  }
};

export const clearPersisted = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {

    logStorage.warn('Failed to clear persisted state', error);
  }
};
