/**
 * 🎮 GAME LOOP BALANCEADO PARA DINÁMICAS DE SUPERVIVENCIA MEJORADAS
 * 
 * Reemplaza el sistema agresivo de degradación con uno más estratégico
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import type { EntityStats, EntityMood } from '../types';
import { BALANCED_DEGRADATION, BALANCED_ZONE_EFFECTS, BALANCED_SURVIVAL_COSTS, calculateLifeExpectancy, needsAttention } from '../config/balancedGameplay';
import { getEntityZone } from '../utils/mapGeneration';
import { logGeneralCompat as logGeneral } from '../utils/optimizedDynamicsLogger';

interface BalancedLoopStats {
  lastUpdate: number;
  tickCount: number;
  averageTickTime: number;
  degradationEvents: number;
  survivalEvents: number;
}

export const useBalancedGameLoop = () => {
  const { gameState, dispatch } = useGame();
  const loopRef = useRef<NodeJS.Timeout | null>(null);
  const statsRef = useRef<BalancedLoopStats>({
    lastUpdate: Date.now(),
    tickCount: 0,
    averageTickTime: 0,
    degradationEvents: 0,
    survivalEvents: 0
  });

  const applyBalancedDegradation = useCallback((entity: any, deltaTimeSeconds: number) => {
    const newStats = { ...entity.stats };
    const activityMultiplier = BALANCED_DEGRADATION.ACTIVITY_MULTIPLIERS[entity.activity as keyof typeof BALANCED_DEGRADATION.ACTIVITY_MULTIPLIERS] || 1.0;
    
    // Aplicar degradación balanceada
    Object.entries(BALANCED_DEGRADATION.BASE_DECAY_PER_SECOND).forEach(([stat, baseDecay]) => {
      if (stat === 'health') return; // Health se maneja separadamente
      
      const finalDecay = baseDecay * activityMultiplier * deltaTimeSeconds;
      newStats[stat as keyof EntityStats] = Math.max(0, newStats[stat as keyof EntityStats] - finalDecay);
    });

    // Aplicar costo de vida
    if (entity.activity !== 'RESTING' && entity.activity !== 'MEDITATING') {
      const livingCost = BALANCED_SURVIVAL_COSTS.BASIC_LIVING_COST_PER_MINUTE * (deltaTimeSeconds / 60);
      let costMultiplier = 1.0;
      
      // Multiplicadores por estado
      if (newStats.hunger < 30) costMultiplier *= BALANCED_SURVIVAL_COSTS.HUNGER_COST_MULTIPLIER;
      if (newStats.energy < 30) costMultiplier *= BALANCED_SURVIVAL_COSTS.ENERGY_COST_MULTIPLIER;
      
      const finalCost = livingCost * costMultiplier;
      newStats.money = Math.max(0, newStats.money - finalCost);
    }

    // Bonus por riqueza
    if (newStats.money > BALANCED_SURVIVAL_COSTS.WEALTH_THRESHOLD) {
      const bonus = BALANCED_SURVIVAL_COSTS.WEALTH_HAPPINESS_BONUS * (deltaTimeSeconds / 60);
      newStats.happiness = Math.min(100, newStats.happiness + bonus);
    }

    return newStats;
  }, []);

  const applyZoneEffects = useCallback((entity: any, deltaTimeSeconds: number) => {
    const zone = getEntityZone(entity.position, gameState.zones);
    if (!zone) return entity.stats;

    const zoneConfig = BALANCED_ZONE_EFFECTS[zone.type as keyof typeof BALANCED_ZONE_EFFECTS];
    if (!zoneConfig) return entity.stats;

    // Verificar si la entidad necesita los efectos de esta zona
    if (!zoneConfig.condition(entity.stats)) return entity.stats;

    const newStats = { ...entity.stats };
    const effectMultiplier = deltaTimeSeconds / 60; // Por minuto

    // Aplicar efectos primarios
    Object.entries(zoneConfig.primary).forEach(([stat, effect]) => {
      const finalEffect = effect * effectMultiplier;
      newStats[stat as keyof EntityStats] = Math.max(0, Math.min(100, 
        newStats[stat as keyof EntityStats] + finalEffect
      ));
    });

    // Aplicar efectos secundarios
    if (zoneConfig.secondary) {
      Object.entries(zoneConfig.secondary).forEach(([stat, effect]) => {
        const finalEffect = effect * effectMultiplier;
        newStats[stat as keyof EntityStats] = Math.max(0, Math.min(100, 
          newStats[stat as keyof EntityStats] + finalEffect
        ));
      });
    }

    return newStats;
  }, [gameState.zones]);

  const updateHealthBasedOnStats = useCallback((stats: EntityStats) => {
    const criticalStats = [stats.hunger, stats.sleepiness, stats.loneliness, stats.energy];
    const criticalCount = criticalStats.filter(stat => stat < BALANCED_DEGRADATION.CRITICAL_THRESHOLDS.CRITICAL).length;
    
    if (criticalCount === 0) {
      // Recuperación cuando no hay stats críticas
      const newHealth = Math.min(100, stats.health + BALANCED_DEGRADATION.HEALTH_DECAY.RECOVERY_RATE);
      return newHealth;
    }

    // Degradación basada en stats críticas
    let decayRate = criticalCount * BALANCED_DEGRADATION.HEALTH_DECAY.DECAY_PER_CRITICAL_STAT;
    
    // Período de gracia para salud muy baja
    if (stats.health < BALANCED_DEGRADATION.HEALTH_DECAY.GRACE_PERIOD_THRESHOLD) {
      decayRate *= BALANCED_DEGRADATION.HEALTH_DECAY.GRACE_PERIOD_MULTIPLIER;
    }
    
    return Math.max(0, stats.health - decayRate);
  }, []);

  const determineMood = useCallback((stats: EntityStats): EntityMood => {
    const { happiness, energy, loneliness, boredom } = stats;
    
    // Estados especiales
    if (happiness > 80 && energy > 70) return 'HAPPY';
    if (happiness < 20 || (loneliness > 80 && boredom > 80)) return 'SAD';
    if (energy < 20) return 'TIRED';
    if (boredom > 80) return 'ANXIOUS';
    if (happiness > 60 && loneliness < 30) return 'EXCITED';
    if (energy > 80 && happiness > 50) return 'CONTENT';
    
    return 'CALM';
  }, []);

  const gameLoopTick = useCallback(() => {
    const now = Date.now();
    const deltaTime = now - statsRef.current.lastUpdate;
    const deltaTimeSeconds = deltaTime / 1000;
    
    // Limitar delta time para evitar saltos grandes
    if (deltaTimeSeconds > 5) {
      statsRef.current.lastUpdate = now;
      return;
    }

    statsRef.current.tickCount++;
    statsRef.current.lastUpdate = now;

    // Procesar cada entidad
    gameState.entities.forEach(entity => {
      if (entity.isDead) return;

      // 1. Aplicar degradación balanceada
      let newStats = applyBalancedDegradation(entity, deltaTimeSeconds);
      
      // 2. Aplicar efectos de zona
      newStats = applyZoneEffects({ ...entity, stats: newStats }, deltaTimeSeconds);
      
      // 3. Actualizar salud basada en otras estadísticas
      newStats.health = updateHealthBasedOnStats(newStats);
      
      // 4. Determinar nuevo mood
      const newMood = determineMood(newStats);
      
      // 5. Verificar muerte
      if (newStats.health <= 0) {
        dispatch({ 
          type: 'KILL_ENTITY', 
          payload: { entityId: entity.id }
        });
        
        logGeneral(`💀 Entidad ${entity.id} ha muerto por salud crítica`, {
          finalStats: newStats,
          lifeExpectancy: calculateLifeExpectancy(entity.stats),
          criticalStats: needsAttention(entity.stats)
        });
        
        statsRef.current.survivalEvents++;
        return;
      }

      // 6. Detectar situaciones críticas y loggear
      const attention = needsAttention(newStats);
      if (attention.urgent.length > 0) {
        const expectancy = calculateLifeExpectancy(newStats);
        
        logGeneral(`⚠️ CRÍTICO: Entidad ${entity.id} necesita atención urgente`, {
          urgentStats: attention.urgent,
          lifeExpectancy: expectancy,
          currentActivity: entity.activity,
          position: entity.position
        });
        
        statsRef.current.survivalEvents++;
      }

      // 7. Dispatch de actualizaciones
      dispatch({
        type: 'UPDATE_ENTITY_STATS',
        payload: { entityId: entity.id, stats: newStats }
      });

      if (newMood !== entity.mood) {
        dispatch({
          type: 'UPDATE_ENTITY_MOOD',
          payload: { entityId: entity.id, mood: newMood }
        });
      }

      statsRef.current.degradationEvents++;
    });

    // Actualizar estadísticas de rendimiento
    const tickTime = Date.now() - now;
    statsRef.current.averageTickTime = 
      (statsRef.current.averageTickTime * 0.9) + (tickTime * 0.1);

  }, [gameState.entities, gameState.zones, dispatch, applyBalancedDegradation, applyZoneEffects, updateHealthBasedOnStats, determineMood]);

  // Configurar el loop principal
  useEffect(() => {
    // Limpiar loop anterior
    if (loopRef.current) {
      clearInterval(loopRef.current);
    }

    // Establecer nuevo loop con intervalo más frecuente para suavidad
    loopRef.current = setInterval(gameLoopTick, 2000); // Cada 2 segundos
    
    logGeneral('🎮 Game Loop Balanceado iniciado', {
      interval: '2000ms',
      features: ['degradación suave', 'efectos de zona', 'supervivencia estratégica']
    });

    return () => {
      if (loopRef.current) {
        clearInterval(loopRef.current);
        loopRef.current = null;
      }
      
      logGeneral('🎮 Game Loop Balanceado detenido', {
        totalTicks: statsRef.current.tickCount,
        degradationEvents: statsRef.current.degradationEvents,
        survivalEvents: statsRef.current.survivalEvents,
        averageTickTime: `${statsRef.current.averageTickTime.toFixed(2)}ms`
      });
    };
  }, [gameLoopTick]);

  // Función para obtener estadísticas del loop
  const getLoopStats = useCallback(() => {
    return { ...statsRef.current };
  }, []);

  return {
    getLoopStats,
    isRunning: !!loopRef.current
  };
};