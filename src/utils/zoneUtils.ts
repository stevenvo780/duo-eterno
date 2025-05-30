/**
 * UTILIDADES COMPARTIDAS PARA ZONAS - Dúo Eterno
 */

import type { Entity, Zone } from '../types';

/**
 * Encuentra en qué zona está una entidad
 */
export function findEntityZone(entity: Entity, zones: Zone[]): Zone | null {
  return zones.find(zone => isEntityInZone(entity, zone)) || null;
}

/**
 * Verifica si una entidad está dentro de una zona
 */
export function isEntityInZone(entity: Entity, zone: Zone): boolean {
  return (
    entity.position.x >= zone.bounds.x &&
    entity.position.x <= zone.bounds.x + zone.bounds.width &&
    entity.position.y >= zone.bounds.y &&
    entity.position.y <= zone.bounds.y + zone.bounds.height
  );
}

/**
 * Obtiene todas las zonas que contienen una posición específica
 */
export function getZonesAtPosition(position: { x: number; y: number }, zones: Zone[]): Zone[] {
  return zones.filter(zone => {
    return (
      position.x >= zone.bounds.x &&
      position.x <= zone.bounds.x + zone.bounds.width &&
      position.y >= zone.bounds.y &&
      position.y <= zone.bounds.y + zone.bounds.height
    );
  });
}
