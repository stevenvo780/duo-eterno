/**
 * MOTOR DE DECISIONES SIMPLIFICADO - Dúo Eterno
 */

import type { Entity, EntityStats, Zone } from '../types';
import { SIMPLE_CONFIG, ZONE_EFFECTS, PERSONALITIES } from './simpleConfig';
import { getCriticalStats, getEmergencyStats } from './statsAnalysis';

// ==================== UTILIDADES DE ANÁLISIS ====================

/**
 * Determina qué estadística necesita ser recuperada con mayor urgencia
 */
export function getMostUrgentStat(entity: Entity): keyof EntityStats | null {
  const personality = PERSONALITIES[entity.id];
  if (!personality) return null;

  const emergency = getEmergencyStats(entity.stats);
  if (emergency.length > 0) {
    // En emergencia, priorizar según personalidad
    for (const stat of personality.priority) {
      if (emergency.includes(stat)) return stat;
    }
    return emergency[0];
  }

  const critical = getCriticalStats(entity.stats);
  if (critical.length > 0) {
    // En crítico, priorizar según personalidad
    for (const stat of personality.priority) {
      if (critical.includes(stat)) return stat;
    }
    return critical[0];
  }

  return null;
}

/**
 * Encuentra la zona más apropiada para recuperar una estadística
 */
export function getZoneForStat(stat: keyof EntityStats, zones: Zone[]): Zone | null {
  // Buscar zona que recupere directamente esta estadística
  for (const zone of zones) {
    const effect = ZONE_EFFECTS[zone.type];
    if (effect && effect.recovers === stat) {
      return zone;
    }
  }
  
  return null;
}

/**
 * Encuentra el compañero más cercano
 */
export function findNearestCompanion(entity: Entity, entities: Entity[]): Entity | null {
  const companions = entities.filter(e => e.id !== entity.id);
  if (companions.length === 0) return null;

  let nearest = companions[0];
  let minDistance = getDistance(entity.position, nearest.position);

  for (const companion of companions.slice(1)) {
    const distance = getDistance(entity.position, companion.position);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = companion;
    }
  }

  return minDistance <= SIMPLE_CONFIG.SEEK_DISTANCE ? nearest : null;
}

/**
 * Calcula la distancia entre dos puntos
 */
export function getDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
}

/**
 * Verifica si dos entidades están lo suficientemente cerca para generar vínculo
 */
export function areEntitiesNearForBonding(entity1: Entity, entity2: Entity): boolean {
  return getDistance(entity1.position, entity2.position) <= SIMPLE_CONFIG.BOND_DISTANCE;
}
