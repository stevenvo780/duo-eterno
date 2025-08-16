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
  const data = raw as Partial<PersistedStateAny> & Record<string, any>;
  const version = typeof data.version === 'number' ? data.version : 1;

  // Currently only V1 supported; future versions can be mapped here
  if (version === 1) {
    // Basic shape validation
    if (!Array.isArray(data.entities) || typeof data.resonance !== 'number') return null;
    return data as PersistedStateV1;
  }

  // Unknown version fallback
  try {
    const v1: PersistedStateV1 = {
      version: 1,
      resonance: Number((data as any).resonance) || 50,
      lastSave: Date.now(),
      togetherTime: Number((data as any).togetherTime) || 0,
      cycles: Number((data as any).cycles) || 0,
      entities: ((data as any).entities || []).map((e: any) => ({
        id: e.id,
        position: e.position,
        stats: e.stats,
        mood: e.mood,
        state: e.state,
        activity: e.activity,
        isDead: !!e.isDead,
        pulsePhase: Number(e.pulsePhase) || 0,
        colorHue: Number(e.colorHue) || 0,
        lastStateChange: Number(e.lastStateChange) || Date.now(),
        lastActivityChange: Number(e.lastActivityChange) || Date.now(),
        lastInteraction: Number(e.lastInteraction) || Date.now()
      }))
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
  } catch {}
};
