import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { migrateToLatest, serializeStateV1, safeLoad, safeSave } from '../persistence';
import type { GameState } from '../../types';

const baseState: GameState = {
  entities: [
    {
      id: 'circle',
      position: { x: 10, y: 20 },
      state: 'IDLE',
      activity: 'WANDERING',
      stats: {
        hunger: 50,
        sleepiness: 50,
        loneliness: 50,
        happiness: 50,
        energy: 50,
        boredom: 50,
        money: 10,
        health: 80
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
      position: { x: 30, y: 40 },
      state: 'IDLE',
      activity: 'WANDERING',
      stats: {
        hunger: 50,
        sleepiness: 50,
        loneliness: 50,
        happiness: 50,
        energy: 50,
        boredom: 50,
        money: 10,
        health: 80
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
  resonance: 60,
  cycles: 0,
  lastSave: Date.now(),
  togetherTime: 0,
  connectionAnimation: { active: false, startTime: 0, type: 'NOURISH' },
  zones: [],
  mapElements: []
};

describe('persistence migrator and io', () => {
  let originalLS: Storage;

  beforeEach(() => {
    originalLS = global.localStorage;
    const store = new Map<string, string>();
    global.localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      length: 0
    } as Storage;
  });

  afterEach(() => {
    global.localStorage = originalLS;
  });

  it('serializeStateV1 produces versioned minimal shape', () => {
    const s = serializeStateV1(baseState);
    expect(s.version).toBe(1);
    expect(s.entities.length).toBe(2);
    expect(typeof s.entities[0].stats.hunger).toBe('number');
  });

  it('migrateToLatest returns null on invalid shapes', () => {
    expect(migrateToLatest(null)).toBeNull();
    expect(migrateToLatest({})).toBeNull();
    expect(migrateToLatest({ version: 1, entities: [] })).toBeNull();
  });

  it('safeSave and safeLoad work roundtrip', () => {
    safeSave(baseState);
    const loaded = safeLoad();
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(1);
    expect(loaded!.entities[0].id).toBe('circle');
  });
});
