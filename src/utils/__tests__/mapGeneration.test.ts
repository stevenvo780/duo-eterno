import { describe, it, expect } from 'vitest';
import { createDefaultZones, getEntityZone } from '../mapGeneration';

describe('mapGeneration', () => {
  it('getEntityZone returns a zone when inside bounds', () => {
    const zones = createDefaultZones();
    const zone = zones[0];
    const p = { x: zone.bounds.x + 1, y: zone.bounds.y + 1 };
    const found = getEntityZone(p, zones);
    expect(found?.id).toBe(zone.id);
  });
});
