import { describe, it, expect } from 'vitest';
import { applyHybridDecay, applySurvivalCosts } from '../activityDynamics';
import type { EntityStats } from '../../types';

const baseStats: EntityStats = {
  hunger: 80,
  sleepiness: 80,
  loneliness: 80,
  happiness: 80,
  energy: 80,
  boredom: 80,
  money: 50,
  health: 100
};

describe('activityDynamics', () => {
  it('applyHybridDecay clamps non-money stats to [0,100]', () => {
    const after = applyHybridDecay({ ...baseStats, hunger: 1 }, 'WORKING', 10000);
    expect(after.hunger).toBeGreaterThanOrEqual(0);
    expect(after.hunger).toBeLessThanOrEqual(100);
  });

  it('applySurvivalCosts reduces money but not below 0', () => {
    const after = applySurvivalCosts({ ...baseStats, money: 1 }, 60000);
    expect(after.money).toBeGreaterThanOrEqual(0);
  });
});
