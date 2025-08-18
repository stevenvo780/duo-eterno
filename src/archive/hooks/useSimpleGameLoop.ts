import { useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import type { Entity, Zone } from '../types';


interface ResonanceData {
  level: number;
  entities: number;
  zones: number;
  timestamp: number;
}

/**
 * 🎯 GAME LOOP SIMPLE - SIN SOBRE-INGENIERÍA
 */
export default function useSimpleGameLoop(
  entities: Entity[],
  zones: Zone[],
  onUpdate: (updatedEntities: Entity[], updatedZones: Zone[], resonanceData: ResonanceData) => void
) {
  const intervalRef = useRef<number | null>(null);


  const throttledUpdate = useRef(
    throttle(() => {
      const totalEntities = entities.length;
      const totalZones = zones.length;
      

      const resonanceStrength = totalEntities > 0 ? 
        ((totalEntities + totalZones) / (totalEntities * 2)) * 100 : 0;

      const resonanceData: ResonanceData = {
        level: Math.min(100, Math.max(0, resonanceStrength)),
        entities: totalEntities,
        zones: totalZones,
        timestamp: Date.now()
      };


      onUpdate([...entities], [...zones], resonanceData);
    }, 200)
  );

    useEffect(() => {
        if (entities.length === 0 && zones.length === 0) {
            return;
        }

        const interval = setInterval(throttledUpdate.current, 200);

        return () => {
            clearInterval(interval);
        };
    }, [entities.length, zones.length]);  return { 
    isActive: !!intervalRef.current,
    entitiesCount: entities.length,
    zonesCount: zones.length
  };
}
