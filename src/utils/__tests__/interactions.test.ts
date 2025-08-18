import { describe, it, expect } from 'vitest';
import { applyInteractionEffect } from '../interactions';
import type { EntityStats } from '../../types';

describe('interactions', () => {
  it('FEED increases hunger and clamps to 100', () => {
    const stats: EntityStats = {
      hunger: 90,
      sleepiness: 50,
      loneliness: 50,
      happiness: 50,
      energy: 50,
      boredom: 50,
      money: 10,
      health: 100
    };
    const { stats: after } = applyInteractionEffect(stats, 'FEED');
    expect(after.hunger).toBeLessThanOrEqual(100);
    expect(after.hunger).toBeGreaterThan(stats.hunger);
  });
});
