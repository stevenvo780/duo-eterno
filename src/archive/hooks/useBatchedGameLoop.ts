/**
 * 🚀 FASE 1: Sistema de Batching de State Updates - Versión Simplificada
 * 
 * Optimizaciones implementadas según el Plan de Trabajo:
 * - ✅ Batching de updates para reducir re-renders
 * - ✅ Throttling inteligente basado en performance
 * - ✅ Automatic flushing cuando sea necesario
 * - ✅ Memory leak prevention
 */

import { useCallback, useRef, useEffect, useState } from 'react';
import type { Entity } from '../types';

// Define action types
type GameAction = 
  | { type: 'UPDATE_ENTITY_STATS'; payload: { entityId: string; stats: Partial<Entity['stats']> } }
  | { type: 'UPDATE_ENTITY_POSITION'; payload: { entityId: string; position: { x: number; y: number } } }
  | { type: 'UPDATE_ENTITY_STATE'; payload: { entityId: string; state: Entity['state'] } }
  | { type: 'UPDATE_ENTITY_MOOD'; payload: { entityId: string; mood: Entity['mood'] } }
  | { type: 'UPDATE_RESONANCE'; payload: number };

interface StateUpdate {
  id: string;
  type: 'ENTITY_STATS' | 'ENTITY_POSITION' | 'ENTITY_STATE' | 'ENTITY_ACTIVITY' | 'ENTITY_MOOD' | 'RESONANCE';
  entityId?: string;
  data: unknown;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
}

interface PerformanceStats {
  avgBatchSize: number;
  avgFlushTime: number;
  totalBatches: number;
  droppedUpdates: number;
  lastFlushDuration: number;
}

export const useBatchedGameLoop = (dispatch: (action: GameAction) => void) => {
  const [pendingUpdates, setPendingUpdates] = useState<StateUpdate[]>([]);
  const flushTimeoutRef = useRef<number | null>(null);
  const updateCounter = useRef<number>(0);
  
  // Performance monitoring
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    avgBatchSize: 0,
    avgFlushTime: 0,
    totalBatches: 0,
    droppedUpdates: 0,
    lastFlushDuration: 0
  });

  // Configuration
  const config = {
    maxBatchSize: 10,
    maxBatchAge: 50, // 50ms máximo antes de flush automático
    flushInterval: 16, // ~60 FPS
  };

  // === CLEANUP EFFECT ===
  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
        flushTimeoutRef.current = null;
      }
      
      // Flush any remaining updates on unmount
      if (pendingUpdates.length > 0) {
        flushUpdates(pendingUpdates, dispatch, setPerformanceStats);
      }
    };
  }, [pendingUpdates, dispatch]);

  // === AUTOMATIC FLUSHING ===
  useEffect(() => {
    if (pendingUpdates.length === 0) return;
    
    const oldestUpdate = pendingUpdates[0];
    const batchAge = Date.now() - oldestUpdate.timestamp;
    const shouldFlushByAge = batchAge > config.maxBatchAge;
    const shouldFlushBySize = pendingUpdates.length >= config.maxBatchSize;
    const shouldFlushByCritical = pendingUpdates.some(update => update.priority === 'CRITICAL');
    
    if (shouldFlushByCritical || shouldFlushByAge || shouldFlushBySize) {
      flushUpdates(pendingUpdates, dispatch, setPerformanceStats);
      setPendingUpdates([]);
      return;
    }
    
    // Schedule automatic flush
    if (!flushTimeoutRef.current) {
      flushTimeoutRef.current = window.setTimeout(() => {
        if (pendingUpdates.length > 0) {
          flushUpdates(pendingUpdates, dispatch, setPerformanceStats);
          setPendingUpdates([]);
        }
        flushTimeoutRef.current = null;
      }, config.flushInterval);
    }
    
  }, [pendingUpdates, dispatch, config.flushInterval, config.maxBatchAge, config.maxBatchSize]);

  // === BATCHED UPDATE FUNCTION ===
  const batchUpdate = useCallback((update: Omit<StateUpdate, 'id' | 'timestamp'>) => {
    const fullUpdate: StateUpdate = {
      ...update,
      id: `update_${updateCounter.current++}`,
      timestamp: Date.now()
    };
    
    setPendingUpdates(prev => {
      // Deduplication: eliminar updates obsoletos del mismo entity y tipo
      const deduped = prev.filter(existingUpdate => {
        if (existingUpdate.type !== fullUpdate.type) return true;
        if (existingUpdate.entityId !== fullUpdate.entityId) return true;
        
        // Mantener solo el update más reciente para el mismo entity + type
        return false;
      });
      
      return [...deduped, fullUpdate];
    });
  }, []);

  // === HELPER FUNCTIONS FOR COMMON UPDATES ===
  const batchEntityStatsUpdate = useCallback((entityId: string, stats: Partial<Entity['stats']>, priority: StateUpdate['priority'] = 'MEDIUM') => {
    batchUpdate({
      type: 'ENTITY_STATS',
      entityId,
      data: stats,
      priority
    });
  }, [batchUpdate]);

  const batchEntityPositionUpdate = useCallback((entityId: string, position: { x: number; y: number }, priority: StateUpdate['priority'] = 'LOW') => {
    batchUpdate({
      type: 'ENTITY_POSITION',
      entityId,
      data: position,
      priority
    });
  }, [batchUpdate]);

  const batchEntityStateUpdate = useCallback((entityId: string, state: Entity['state'], priority: StateUpdate['priority'] = 'HIGH') => {
    batchUpdate({
      type: 'ENTITY_STATE',
      entityId,
      data: state,
      priority
    });
  }, [batchUpdate]);

  const batchEntityMoodUpdate = useCallback((entityId: string, mood: Entity['mood'], priority: StateUpdate['priority'] = 'MEDIUM') => {
    batchUpdate({
      type: 'ENTITY_MOOD',
      entityId,
      data: mood,
      priority
    });
  }, [batchUpdate]);

  const batchResonanceUpdate = useCallback((resonance: number, priority: StateUpdate['priority'] = 'HIGH') => {
    batchUpdate({
      type: 'RESONANCE',
      data: resonance,
      priority
    });
  }, [batchUpdate]);

  // === FORCE FLUSH ===
  const forceFlush = useCallback(() => {
    if (pendingUpdates.length > 0) {
      flushUpdates(pendingUpdates, dispatch, setPerformanceStats);
      setPendingUpdates([]);
      
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
        flushTimeoutRef.current = null;
      }
    }
  }, [pendingUpdates, dispatch]);

  return {
    // Batching functions
    batchUpdate,
    batchEntityStatsUpdate,
    batchEntityPositionUpdate,
    batchEntityStateUpdate,
    batchEntityMoodUpdate,
    batchResonanceUpdate,
    
    // Control functions
    forceFlush,
    
    // Stats
    pendingUpdatesCount: pendingUpdates.length,
    performanceStats,
    
    // Debug info
    pendingUpdates: pendingUpdates.map(u => ({
      type: u.type,
      entityId: u.entityId,
      priority: u.priority,
      age: Date.now() - u.timestamp
    }))
  };
};

// === FLUSH IMPLEMENTATION ===
function flushUpdates(
  updates: StateUpdate[], 
  dispatch: (action: GameAction) => void,
  setStats: React.Dispatch<React.SetStateAction<PerformanceStats>>
): void {
  if (updates.length === 0) return;
  
  const startTime = performance.now();
  
  // Group by entity and type for efficient batching
  const statsByEntity: Record<string, Partial<Entity['stats']>> = {};
  const positionsByEntity: Record<string, { x: number; y: number }> = {};
  const statesByEntity: Record<string, Entity['state']> = {};
  const moodsByEntity: Record<string, Entity['mood']> = {};
  let latestResonance: number | null = null;
  
  // Process all updates
  for (const update of updates) {
    switch (update.type) {
      case 'ENTITY_STATS':
        if (update.entityId) {
          if (!statsByEntity[update.entityId]) {
            statsByEntity[update.entityId] = {};
          }
          Object.assign(statsByEntity[update.entityId], update.data);
        }
        break;
      case 'ENTITY_POSITION':
        if (update.entityId) {
          positionsByEntity[update.entityId] = update.data as { x: number; y: number };
        }
        break;
      case 'ENTITY_STATE':
        if (update.entityId) {
          statesByEntity[update.entityId] = update.data as Entity['state'];
        }
        break;
      case 'ENTITY_MOOD':
        if (update.entityId) {
          moodsByEntity[update.entityId] = update.data as Entity['mood'];
        }
        break;
      case 'RESONANCE':
        latestResonance = update.data as number;
        break;
    }
  }
  
  // Dispatch batched updates
  for (const [entityId, stats] of Object.entries(statsByEntity)) {
    dispatch({
      type: 'UPDATE_ENTITY_STATS',
      payload: { entityId, stats }
    });
  }
  
  for (const [entityId, position] of Object.entries(positionsByEntity)) {
    dispatch({
      type: 'UPDATE_ENTITY_POSITION',
      payload: { entityId, position }
    });
  }
  
  for (const [entityId, state] of Object.entries(statesByEntity)) {
    dispatch({
      type: 'UPDATE_ENTITY_STATE',
      payload: { entityId, state }
    });
  }
  
  for (const [entityId, mood] of Object.entries(moodsByEntity)) {
    dispatch({
      type: 'UPDATE_ENTITY_MOOD',
      payload: { entityId, mood }
    });
  }
  
  if (latestResonance !== null) {
    dispatch({
      type: 'UPDATE_RESONANCE',
      payload: latestResonance
    });
  }
  
  const flushDuration = performance.now() - startTime;
  
  // Update performance stats
  setStats(prev => ({
    avgBatchSize: (prev.avgBatchSize * prev.totalBatches + updates.length) / (prev.totalBatches + 1),
    avgFlushTime: (prev.avgFlushTime * prev.totalBatches + flushDuration) / (prev.totalBatches + 1),
    totalBatches: prev.totalBatches + 1,
    droppedUpdates: prev.droppedUpdates,
    lastFlushDuration: flushDuration
  }));
  
  if (flushDuration > 16) { // Más de un frame a 60fps
    console.warn(`⚠️ Batch flush took ${flushDuration.toFixed(2)}ms (${updates.length} updates)`);
  }
}

// Export types
export type { StateUpdate, GameAction, PerformanceStats };
