/**
 * 🛡️ HOOK PARA SISTEMA DE SUPERVIVENCIA MEJORADO
 * 
 * Integra todas las mejoras de supervivencia y proporciona alertas tempranas
 * Permite alternar entre sistema original y mejorado
 */

import { useState, useCallback, useEffect } from 'react';
import { useGame } from './useGame';
import type { EntityStats } from '../types';
import { 
  calculateSurvivalAlert, 
  applyImprovedHealthRecovery,
  applyImprovedSurvivalCosts,
  IMPROVED_CRITICAL_THRESHOLDS,
  IMPROVED_ACTIVITY_DECAY_MULTIPLIERS,
  DIFFICULTY_CONFIGS,
  type SurvivalAlert,
  type DifficultyLevel
} from '../improvements/survivabilityEnhancements';

interface SurvivalSystemConfig {
  enabled: boolean;
  difficulty: DifficultyLevel;
  showAlerts: boolean;
  gracePeriodEnabled: boolean;
}

export const useSurvivalEnhancements = () => {
  const { gameState } = useGame();
  
  const [config, setConfig] = useState<SurvivalSystemConfig>({
    enabled: true,        // Activar mejoras por defecto
    difficulty: 'NORMAL', // Dificultad balanceada
    showAlerts: true,     // Mostrar alertas
    gracePeriodEnabled: true // Período de gracia activado
  });

  const [alerts, setAlerts] = useState<Map<string, SurvivalAlert>>(new Map());

  // Calcular alertas para todas las entidades vivas
  const updateSurvivalAlerts = useCallback(() => {
    if (!config.enabled || !config.showAlerts) {
      setAlerts(new Map());
      return;
    }

    const newAlerts = new Map<string, SurvivalAlert>();
    
    gameState.entities
      .filter(entity => !entity.isDead)
      .forEach(entity => {
        const alert = calculateSurvivalAlert(entity.stats, entity.stats.health);
        if (alert) {
          newAlerts.set(entity.id, alert);
        }
      });

    setAlerts(newAlerts);
  }, [gameState.entities, config.enabled, config.showAlerts]);

  // Actualizar alertas cuando cambien las entidades
  useEffect(() => {
    updateSurvivalAlerts();
  }, [updateSurvivalAlerts]);

  // Función para aplicar health recovery mejorado
  const applyImprovedHealthSystem = useCallback((
    entityId: string,
    currentHealth: number,
    stats: EntityStats,
    deltaTime: number,
    resonance: number
  ): number => {
    if (!config.enabled) {
      return currentHealth; // Usar sistema original
    }

    const criticalCount = [
      stats.hunger < IMPROVED_CRITICAL_THRESHOLDS.CRITICAL,
      stats.sleepiness < IMPROVED_CRITICAL_THRESHOLDS.CRITICAL,
      stats.loneliness < IMPROVED_CRITICAL_THRESHOLDS.CRITICAL,
      stats.energy < IMPROVED_CRITICAL_THRESHOLDS.CRITICAL
    ].filter(Boolean).length;

    return applyImprovedHealthRecovery(
      currentHealth,
      criticalCount,
      resonance,
      deltaTime
    );
  }, [config.enabled]);

  // Función para aplicar costos de supervivencia mejorados
  const applyImprovedSurvivalSystem = useCallback((
    stats: EntityStats,
    deltaTime: number
  ): EntityStats => {
    if (!config.enabled) {
      return stats; // Usar sistema original
    }

    const difficultyConfig = DIFFICULTY_CONFIGS[config.difficulty];
    const adjustedStats = applyImprovedSurvivalCosts(stats, deltaTime);

    // Aplicar modificadores de dificultad
    if (difficultyConfig.decayMultiplier !== 1.0) {
      Object.keys(adjustedStats).forEach(key => {
        if (key !== 'money' && key !== 'health') {
          const statKey = key as keyof EntityStats;
          const originalValue = stats[statKey];
          const decayedValue = adjustedStats[statKey];
          const decay = originalValue - decayedValue;
          adjustedStats[statKey] = originalValue - (decay * difficultyConfig.decayMultiplier);
        }
      });
    }

    return adjustedStats;
  }, [config.enabled, config.difficulty]);

  // Obtener multiplicador de decay para actividad (mejorado)
  const getImprovedActivityDecayMultiplier = useCallback((activity: string): number => {
    if (!config.enabled) {
      return 1.0; // Usar sistema original
    }

    const multiplier = IMPROVED_ACTIVITY_DECAY_MULTIPLIERS[activity as keyof typeof IMPROVED_ACTIVITY_DECAY_MULTIPLIERS];
    const difficultyConfig = DIFFICULTY_CONFIGS[config.difficulty];
    
    return (multiplier || 1.0) * difficultyConfig.decayMultiplier;
  }, [config.enabled, config.difficulty]);

  // Verificar si una entidad está en peligro crítico
  const isEntityInCriticalDanger = useCallback((entityId: string): boolean => {
    return alerts.has(entityId) && alerts.get(entityId)?.type === 'EMERGENCY';
  }, [alerts]);

  // Obtener estadísticas del sistema
  const getSystemStats = useCallback(() => {
    const livingEntities = gameState.entities.filter(e => !e.isDead);
    const entitiesInDanger = livingEntities.filter(e => alerts.has(e.id));
    const criticalEntities = livingEntities.filter(e => isEntityInCriticalDanger(e.id));

    return {
      livingEntities: livingEntities.length,
      entitiesInDanger: entitiesInDanger.length,
      criticalEntities: criticalEntities.length,
      systemEnabled: config.enabled,
      difficulty: config.difficulty,
      averageHealth: livingEntities.length > 0 
        ? livingEntities.reduce((sum, e) => sum + e.stats.health, 0) / livingEntities.length 
        : 0
    };
  }, [gameState.entities, alerts, isEntityInCriticalDanger, config]);

  // Funciones de configuración
  const toggleSystem = useCallback(() => {
    setConfig(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const setDifficulty = useCallback((difficulty: DifficultyLevel) => {
    setConfig(prev => ({ ...prev, difficulty }));
  }, []);

  const toggleAlerts = useCallback(() => {
    setConfig(prev => ({ ...prev, showAlerts: !prev.showAlerts }));
  }, []);

  const toggleGracePeriod = useCallback(() => {
    setConfig(prev => ({ ...prev, gracePeriodEnabled: !prev.gracePeriodEnabled }));
  }, []);

  return {
    // Estado
    config,
    alerts,
    systemStats: getSystemStats(),
    
    // Funciones principales
    applyImprovedHealthSystem,
    applyImprovedSurvivalSystem,
    getImprovedActivityDecayMultiplier,
    
    // Utilidades
    isEntityInCriticalDanger,
    updateSurvivalAlerts,
    
    // Configuración
    toggleSystem,
    setDifficulty,
    toggleAlerts,
    toggleGracePeriod,
    
    // Constantes para referencia
    thresholds: IMPROVED_CRITICAL_THRESHOLDS,
    difficultyConfigs: DIFFICULTY_CONFIGS
  };
};
