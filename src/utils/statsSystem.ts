/**
 * SISTEMA DE ESTADÍSTICAS SIMPLIFICADO - Dúo Eterno
 */

import type { Entity, EntityStats, Zone } from '../types';
import { SIMPLE_CONFIG, ZONE_EFFECTS } from './gameConfig';
import { getCriticalStats, getHighStats } from './statsAnalysis';
import { areEntitiesNearForBonding } from './decisionEngine';

// ==================== SISTEMA DE ESTADÍSTICAS ====================

/**
 * Aplica el decaimiento natural de estadísticas por tiempo
 */
export function applyStatDecay(entity: Entity, deltaTime: number): Entity {
  const newStats = { ...entity.stats };
  
  // Todas las estadísticas (excepto salud) decaen con el tiempo
  Object.keys(newStats).forEach(key => {
    if (key !== 'health') {
      const statKey = key as keyof EntityStats;
      newStats[statKey] = Math.max(0, newStats[statKey] - SIMPLE_CONFIG.STAT_DECAY_RATE * deltaTime);
    }
  });
  
  return { ...entity, stats: newStats };
}

/**
 * Aplica efectos de recuperación cuando la entidad está en una zona
 */
export function applyZoneEffects(entity: Entity, zone: Zone | null, deltaTime: number): Entity {
  if (!zone) return entity;
  
  const effect = ZONE_EFFECTS[zone.type];
  if (!effect) return entity;
  
  const newStats = { ...entity.stats };
  
  // Recuperar la estadística principal
  const recoverStat = effect.recovers;
  newStats[recoverStat] = Math.min(100, newStats[recoverStat] + SIMPLE_CONFIG.ZONE_RECOVERY_RATE * deltaTime);
  
  // Aplicar costos si existen
  if (effect.cost) {
    Object.entries(effect.cost).forEach(([key, cost]) => {
      const statKey = key as keyof EntityStats;
      if (statKey !== 'health') {
        newStats[statKey] = Math.max(0, newStats[statKey] - cost * deltaTime);
      }
    });
  }
  
  return { ...entity, stats: newStats };
}

/**
 * Aplica efectos de vínculo cuando las entidades están cerca
 */
export function applyBondingEffects(entities: Entity[], deltaTime: number): Entity[] {
  return entities.map(entity => {
    const newStats = { ...entity.stats };
    
    // Buscar si hay algún compañero cerca
    const hasNearbyCompanion = entities.some(other => 
      other.id !== entity.id && areEntitiesNearForBonding(entity, other)
    );
    
    if (hasNearbyCompanion) {
      // Recuperar vínculo (loneliness)
      newStats.loneliness = Math.min(100, newStats.loneliness + SIMPLE_CONFIG.BOND_RECOVERY_RATE * deltaTime);
    } else {
      // Perder vínculo gradualmente
      newStats.loneliness = Math.max(0, newStats.loneliness - SIMPLE_CONFIG.BOND_DECAY_RATE * deltaTime);
    }
    
    return { ...entity, stats: newStats };
  });
}

/**
 * Calcula y actualiza el sistema de salud basado en las estadísticas generales
 */
export function updateHealthSystem(entity: Entity, deltaTime: number): Entity {
  const newStats = { ...entity.stats };
  const criticalStats = getCriticalStats(entity.stats);
  const highStats = getHighStats(entity.stats);
  
  // SISTEMA DE SALUD MEJORADO - MÁS EQUILIBRADO
  if (criticalStats.length >= 3) {
    // Solo pierde salud si tiene 3 o más estadísticas críticas (antes era 2)
    newStats.health = Math.max(0, newStats.health - SIMPLE_CONFIG.HEALTH_DECAY_RATE * deltaTime);
  } else if (criticalStats.length >= 2) {
    // Con 2 estadísticas críticas, pierde salud muy lentamente
    newStats.health = Math.max(0, newStats.health - (SIMPLE_CONFIG.HEALTH_DECAY_RATE * 0.3) * deltaTime);
  } else if (criticalStats.length === 0 && highStats.length >= 2) {
    // Solo gana salud si NO tiene estadísticas críticas Y tiene 2+ altas (antes era 3)
    newStats.health = Math.min(100, newStats.health + SIMPLE_CONFIG.HEALTH_RECOVERY_RATE * deltaTime);
  }
  // Si tiene 1 estadística crítica, la salud se mantiene estable (no gana ni pierde)
  
  return { ...entity, stats: newStats };
}

/**
 * Limita todas las estadísticas a rangos válidos (0-100)
 */
export function clampStats(entity: Entity): Entity {
  const newStats = { ...entity.stats };
  
  Object.keys(newStats).forEach(key => {
    const statKey = key as keyof EntityStats;
    newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey]));
  });
  
  return { ...entity, stats: newStats };
}
