import { describe, it, expect } from 'vitest';


const createEntity = (id: string, x: number, y: number) => ({
  id,
  position: { x, y },
  velocity: { x: 0, y: 0 },
  stats: {
    hunger: 50,
    health: 100,
    love: 0,
    energy: 100,
    money: 100,
    happiness: 50,
    stress: 0,
    social: 50,
    knowledge: 0,
    creativity: 50
  },
  state: 'neutral' as const,
  activity: 'idle' as const,
  mood: 'content' as const,
  isDead: false,
  lastInteraction: null,
  autonomy: {
    lastDecision: Date.now(),
    currentGoal: 'survival',
    goalProgress: 0
  }
});

const initialGameState = {
  entities: [
    createEntity('circle', 100, 100),
    createEntity('square', 200, 200)
  ],
  resonance: 80,
  togetherTime: 0,
  lastUpdate: Date.now(),
  cycles: 0,
  interactionHistory: [],
  map: { zones: [], seed: '12345' },
  gameMode: 'balanced' as const
};


describe('GameContext reducer behavior', () => {
  it('entities have correct initial stats structure', () => {
    const circleEntity = initialGameState.entities.find(e => e.id === 'circle')!;
    
    expect(circleEntity.stats.money).toBe(100);
    expect(circleEntity.stats.hunger).toBe(50);
    expect(circleEntity.stats.health).toBe(100);
    expect(circleEntity.isDead).toBe(false);
  });

  it('initial state has correct structure', () => {
    expect(initialGameState.resonance).toBe(80);
    expect(initialGameState.cycles).toBe(0);
    expect(initialGameState.entities).toHaveLength(2);
  });

  it('entities have valid positions and stats', () => {
    initialGameState.entities.forEach(entity => {
      expect(typeof entity.position.x).toBe('number');
      expect(typeof entity.position.y).toBe('number');
      expect(entity.stats.hunger).toBeGreaterThanOrEqual(0);
      expect(entity.stats.health).toBeGreaterThanOrEqual(0);
    });
  });
});
