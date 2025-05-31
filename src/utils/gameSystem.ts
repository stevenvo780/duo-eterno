/**
 * SISTEMA DE JUEGO SIMPLIFICADO - Dúo Eterno
 * Sistema principal que coordina todos los subsistemas
 */

import type { Entity, Zone } from '../types';
import { ActivitySystem } from './activitySystem';
import { applyStatDecay, applyZoneEffects, applyBondingEffects, updateHealthSystem, clampStats } from './statsSystem';
import { findEntityZone } from './zoneUtils';

// ==================== SISTEMA PRINCIPAL ====================

export class SimpleGameSystem {
  private activitySystem = new ActivitySystem();

  /**
   * Actualiza todas las entidades del juego
   */
  public updateEntities(
    entities: Entity[],
    zones: Zone[],
    deltaTime: number
  ): { 
    updatedEntities: Entity[];
    decisions: Array<{ entityId: string; targetZone: Zone | null; targetEntity: Entity | null }>;
  } {
    // 1. Aplicar decaimiento natural de estadísticas
    let updatedEntities = entities.map(entity => applyStatDecay(entity, deltaTime));

    // 2. Aplicar efectos de zona si la entidad está en una
    updatedEntities = updatedEntities.map(entity => {
      const currentZone = findEntityZone(entity, zones);
      return applyZoneEffects(entity, currentZone, deltaTime);
    });

    // 3. Aplicar efectos de vínculo
    updatedEntities = applyBondingEffects(updatedEntities, deltaTime);

    // 4. Actualizar sistema de salud
    updatedEntities = updatedEntities.map(entity => updateHealthSystem(entity, deltaTime));

    // 5. Limitar estadísticas a rangos válidos
    updatedEntities = updatedEntities.map(entity => clampStats(entity));

    // 6. Actualizar timers de actividad
    this.activitySystem.updateActivityTimers(updatedEntities, deltaTime);

    // 7. Generar decisiones de actividad
    const decisions = updatedEntities.map(entity => {
      const decision = this.activitySystem.decideActivity(entity, updatedEntities, zones);
      return {
        entityId: entity.id,
        ...decision
      };
    });

    return { updatedEntities, decisions };
  }
}
