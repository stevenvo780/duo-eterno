/**
 * 🎮 GAME LOOP UNIFICADO Y CONSOLIDADO
 * 
 * Sistema único que reemplaza todos los game loops múltiples:
 * - useBalancedGameLoop ❌
 * - useOptimizedUnifiedGameLoop ❌ 
 * - useSimpleGameLoop ❌
 * - useBatchedGameLoop ❌ (integrado aquí)
 * - useUnifiedGameLoop ❌
 * 
 * Características consolidadas:
 * ✅ Degradación balanceada estratégica
 * ✅ Memory management y cleanup automático
 * ✅ Batching optimizado para performance
 * ✅ Sistema de timing unificado
 * ✅ Logging consolidado y throttling inteligente
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import type { GameState, Entity, EntityStats } from '../types';
import { getGameConfig } from '../config/gameConfig';
import { SURVIVAL, TIMING } from '../constants';
// import { getEntityZone } from '../utils/mapGeneration'; // No usado
import { fixedMathUtils } from '../utils/fixedMathPrecision';
import { personalityVariation } from '../utils/naturalVariability';
import { robustStateUtils } from '../utils/robustStateManagement';
import { logger } from '../utils/logger';

// === INTERFACES CONSOLIDADAS ===

interface GameLoopStats {
  totalTicks: number;
  lastTickTime: number;
  averageTickDuration: number;
  degradationEvents: number;
  survivalEvents: number;
  batchedUpdates: number;
  lastCleanup: number;
}

interface BatchedUpdate {
  type: 'UPDATE_ENTITY_STATS' | 'UPDATE_RESONANCE';
  payload: { entityId: string; stats: Partial<EntityStats> } | number;
  priority: number;
  timestamp: number;
}

// === CONSTANTES DEL LOOP CONSOLIDADO ===

const LOOP_CONFIG = {
  TARGET_FPS: 60,
  MAIN_INTERVAL: TIMING.MAIN_GAME_LOGIC, // 800ms del sistema unificado
  BATCH_FLUSH_INTERVAL: 100, // ms para flush de batches
  MAX_BATCH_SIZE: 20,
  STATS_LOG_INTERVAL: 30000, // 30s
  CLEANUP_INTERVAL: 60000, // 1min
  PERFORMANCE_THRESHOLD: 16.67 // ~60fps en ms
} as const;

// === GAME LOOP PRINCIPAL ===

export const useGameLoop = () => {
  const { gameState, dispatch } = useGame();
  const config = getGameConfig();
  
  // === REFS PARA GESTIÓN DE ESTADO ===
  
  const gameStateRef = useRef<GameState>(gameState);
  const mainIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const batchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef<boolean>(false);
  
  const statsRef = useRef<GameLoopStats>({
    totalTicks: 0,
    lastTickTime: Date.now(),
    averageTickDuration: 0,
    degradationEvents: 0,
    survivalEvents: 0,
    batchedUpdates: 0,
    lastCleanup: Date.now()
  });
  
  const batchQueueRef = useRef<BatchedUpdate[]>([]);
  
  // Sync estado
  gameStateRef.current = gameState;
  
  // === SISTEMA DE BATCHING CONSOLIDADO ===
  
  const flushBatch = useCallback(() => {
    if (batchQueueRef.current.length === 0) return;
    
    // Ordenar por prioridad y timestamp
    const sortedUpdates = batchQueueRef.current.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.timestamp - b.timestamp;
    });
    
    // Aplicar updates batched
    sortedUpdates.forEach(update => {
      dispatch({
        type: update.type,
        payload: update.payload
      });
    });
    
    statsRef.current.batchedUpdates += sortedUpdates.length;
    batchQueueRef.current = [];
  }, [dispatch]);
  
  const addToBatch = useCallback((update: Omit<BatchedUpdate, 'timestamp'>) => {
    if (batchQueueRef.current.length >= LOOP_CONFIG.MAX_BATCH_SIZE) {
      flushBatch(); // Flush inmediato si está lleno
    }
    
    batchQueueRef.current.push({
      ...update,
      timestamp: Date.now()
    });
  }, [flushBatch]);
  
  // === LÓGICA DE DEGRADACIÓN BALANCEADA ===
  
  const applyBalancedDegradation = useCallback((entity: Entity, deltaTime: number): EntityStats => {
    // const currentZone = getEntityZone(entity.position, gameStateRef.current.zones);
    const zoneMultiplier = 1.0; // Simplificado - las zonas ya no tienen survivalMultiplier
    
    // Aplicar degradación con variabilidad natural basada en personalidad
    const personalityFactor = personalityVariation(entity.id, 0.1); // Using numeric factor instead of string
    const activityMultiplier = SURVIVAL.ACTIVITY_MULTIPLIERS[entity.activity] || 1.0;
    
    let newStats = { ...entity.stats };
    
    // Degradación de stats básicos
    Object.entries(SURVIVAL.DEGRADATION_RATES).forEach(([stat, baseRate]) => {
      if (stat === 'health') return; // Health se maneja por separado
      
      const finalRate = baseRate * activityMultiplier * zoneMultiplier * personalityFactor * deltaTime;
      newStats = robustStateUtils.applyStatChange(
        newStats,
        stat as keyof EntityStats,
        -finalRate,
        `degradation_${stat}`
      );
    });
    
    // Gestión de health basada en otros stats
    if (newStats.hunger < SURVIVAL.CRITICAL_THRESHOLDS.HUNGER || 
        newStats.energy < SURVIVAL.CRITICAL_THRESHOLDS.ENERGY) {
      const healthLoss = SURVIVAL.DEGRADATION_RATES.HEALTH * deltaTime;
      newStats = robustStateUtils.applyStatChange(
        newStats,
        'health',
        -healthLoss,
        'critical_stats'
      );
    }
    
    return newStats;
  }, []);
  
  // === CÁLCULO DE RESONANCIA CONSOLIDADO ===
  
  const updateEntityResonance = useCallback((entities: Entity[]): number => {
    if (entities.length < 2) return 0;
    
    const [entity1, entity2] = entities;
    const distance = Math.sqrt(Math.pow(entity2.position.x - entity1.position.x, 2) + Math.pow(entity2.position.y - entity1.position.y, 2));
    
    // Resonancia basada en distancia, activities compatibles, y stats harmony
    const proximityFactor = Math.max(0, 1 - distance / 400);
    const activityHarmony = entity1.activity === entity2.activity ? 1.2 : 0.8;
    
    const avgStats1 = (entity1.stats.happiness + entity1.stats.hunger) / 2;
    const avgStats2 = (entity2.stats.happiness + entity2.stats.hunger) / 2;
    const statsHarmony = 1 - Math.abs(avgStats1 - avgStats2) / 100;
    
    const rawResonance = proximityFactor * activityHarmony * statsHarmony;
    
    return fixedMathUtils.preciseRound(rawResonance * 100, 2);
  }, []);
  
  // === TICK PRINCIPAL CONSOLIDADO ===
  
  const mainGameTick = useCallback(() => {
    const startTime = performance.now();
    const currentTime = Date.now();
    const deltaTime = (currentTime - statsRef.current.lastTickTime) / 1000; // en segundos
    
    try {
      const state = gameStateRef.current;
      
      if (!state.entities.length) return;
      
      // Procesar entities con degradación balanceada
      state.entities.forEach(entity => {
        const newStats = applyBalancedDegradation(entity, deltaTime);
        
        addToBatch({
          type: 'UPDATE_ENTITY_STATS',
          payload: { 
            entityId: entity.id, 
            stats: newStats
          },
          priority: 10
        });
        
        statsRef.current.degradationEvents++;
      });
      
      // Actualizar resonancia global
      if (state.entities.length >= 2) {
        const newResonance = updateEntityResonance(state.entities);
        
        if (Math.abs(newResonance - state.resonance) > 0.1) {
          addToBatch({
            type: 'UPDATE_RESONANCE',
            payload: { resonance: newResonance },
            priority: 8
          });
        }
      }
      
      // Actualizar estadísticas del loop
      const tickDuration = performance.now() - startTime;
      const stats = statsRef.current;
      
      stats.totalTicks++;
      stats.lastTickTime = currentTime;
      stats.averageTickDuration = (stats.averageTickDuration + tickDuration) / 2;
      
      // Logging throttleado de performance
      if (stats.totalTicks % 100 === 0 && config.debugMode) {
        logger.info('general', 'Game Loop Performance', {
          avgTickDuration: stats.averageTickDuration.toFixed(2),
          totalTicks: stats.totalTicks,
          batchedUpdates: stats.batchedUpdates
        });
      }
      
    } catch (error) {
      console.error('🚨 Game Loop Error:', error);
      logger.error('general', 'Game Loop Error', { error: (error as Error).message });
    }
  }, [applyBalancedDegradation, updateEntityResonance, addToBatch, config.debugMode]);
  
  // === SISTEMA DE CLEANUP AUTOMÁTICO ===
  
  const performCleanup = useCallback(() => {
    const now = Date.now();
    
    // Limpiar batches antiguos (más de 5 segundos)
    batchQueueRef.current = batchQueueRef.current.filter(
      update => now - update.timestamp < 5000
    );
    
    // Reset stats periódicamente para evitar overflow
    if (now - statsRef.current.lastCleanup > LOOP_CONFIG.CLEANUP_INTERVAL) {
      statsRef.current.batchedUpdates = Math.floor(statsRef.current.batchedUpdates / 2);
      statsRef.current.lastCleanup = now;
    }
    
    // Garbage collection hint (si está disponible)
    if (typeof window !== 'undefined' && 'gc' in window) {
      try {
        (window as { gc?: () => void }).gc?.();
      } catch {
        // Silently fail - gc not available
      }
    }
  }, []);
  
  // === INICIALIZACIÓN Y CLEANUP ===
  
  useEffect(() => {
    if (isRunningRef.current) return;
    
    logger.info('general', '🎮 Iniciando Game Loop Consolidado', {
      mainInterval: LOOP_CONFIG.MAIN_INTERVAL,
      targetFPS: LOOP_CONFIG.TARGET_FPS
    });
    
    isRunningRef.current = true;
    
    // Interval principal del juego
    mainIntervalRef.current = setInterval(mainGameTick, LOOP_CONFIG.MAIN_INTERVAL);
    
    // Interval para flush de batches
    batchIntervalRef.current = setInterval(flushBatch, LOOP_CONFIG.BATCH_FLUSH_INTERVAL);
    
    // Interval de cleanup
    cleanupIntervalRef.current = setInterval(performCleanup, LOOP_CONFIG.CLEANUP_INTERVAL);
    
    return () => {
      logger.info('general', '🛑 Limpiando Game Loop Consolidado', {});
      
      isRunningRef.current = false;
      
      if (mainIntervalRef.current) {
        clearInterval(mainIntervalRef.current);
        mainIntervalRef.current = null;
      }
      
      if (batchIntervalRef.current) {
        clearInterval(batchIntervalRef.current);
        batchIntervalRef.current = null;
      }
      
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
        cleanupIntervalRef.current = null;
      }
      
      // Flush final de batches pendientes
      flushBatch();
      
      // Reset referencias
      batchQueueRef.current = [];
      statsRef.current = {
        totalTicks: 0,
        lastTickTime: Date.now(),
        averageTickDuration: 0,
        degradationEvents: 0,
        survivalEvents: 0,
        batchedUpdates: 0,
        lastCleanup: Date.now()
      };
    };
  }, [mainGameTick, flushBatch, performCleanup]);
  
  // Exponer stats para debugging
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    (window as { gameLoopStats?: () => object }).gameLoopStats = () => ({
      ...statsRef.current,
      batchQueueSize: batchQueueRef.current.length,
      isRunning: isRunningRef.current
    });
  }
  
  return {
    stats: statsRef.current,
    isRunning: isRunningRef.current,
    batchQueueSize: batchQueueRef.current.length
  };
};