/**
 * SISTEMA DE ACTIVIDADES SIMPLIFICADO - Dúo Eterno
 */

import type { Entity, Zone } from '../types';
import { SIMPLE_CONFIG } from './simpleConfig';
import { getMostUrgentStat, getZoneForStat, findNearestCompanion } from './decisionEngine';

// ==================== SISTEMA DE ACTIVIDADES ====================

export class ActivitySystem {
  private activityTimers = new Map<string, number>();

  /**
   * Decide la actividad objetivo para una entidad
   */
  public decideActivity(entity: Entity, entities: Entity[], zones: Zone[]): { targetZone: Zone | null; targetEntity: Entity | null } {
    // Debug: Log del estado inicial
    console.log(`[ActivitySystem] Decidiendo actividad para ${entity.id}:`, {
      stats: entity.stats,
      shouldChangeActivity: this.shouldChangeActivity(entity),
      activityTimer: this.activityTimers.get(entity.id)
    });

    // Verificar si debe cambiar de actividad
    if (!this.shouldChangeActivity(entity)) {
      console.log(`[ActivitySystem] ${entity.id} no debe cambiar actividad aún`);
      return { targetZone: null, targetEntity: null };
    }

    // Reiniciar timer de actividad
    this.resetActivityTimer(entity.id);
    console.log(`[ActivitySystem] ${entity.id} reiniciando timer de actividad`);

    // 1. Prioridad máxima: estadística más urgente
    const urgentStat = getMostUrgentStat(entity);
    console.log(`[ActivitySystem] ${entity.id} estadística urgente:`, urgentStat);
    
    if (urgentStat && urgentStat !== 'loneliness') {
      const targetZone = getZoneForStat(urgentStat, zones);
      console.log(`[ActivitySystem] ${entity.id} zona objetivo para ${urgentStat}:`, targetZone?.type);
      if (targetZone) {
        console.log(`[ActivitySystem] ${entity.id} dirigiéndose a zona ${targetZone.type}`);
        return { targetZone, targetEntity: null };
      }
    }

    // 2. Prioridad de vínculo: buscar compañero si loneliness es crítica
    if (urgentStat === 'loneliness' || entity.stats.loneliness < SIMPLE_CONFIG.CRITICAL_STAT) {
      const companion = findNearestCompanion(entity, entities);
      console.log(`[ActivitySystem] ${entity.id} compañero encontrado:`, companion?.id);
      if (companion) {
        console.log(`[ActivitySystem] ${entity.id} dirigiéndose al compañero ${companion.id}`);
        return { targetZone: null, targetEntity: companion };
      }
    }

    // 3. Sin actividad específica
    console.log(`[ActivitySystem] ${entity.id} sin actividad específica`);
    return { targetZone: null, targetEntity: null };
  }

  /**
   * Determina si una entidad debe cambiar de actividad
   */
  private shouldChangeActivity(entity: Entity): boolean {
    const currentTime = this.activityTimers.get(entity.id) || 0;
    return currentTime <= 0;
  }

  /**
   * Actualiza los timers de actividad
   */
  public updateActivityTimers(entities: Entity[], deltaTime: number): void {
    entities.forEach(entity => {
      const currentTime = this.activityTimers.get(entity.id) || 0;
      this.activityTimers.set(entity.id, Math.max(0, currentTime - deltaTime));
    });
  }

  /**
   * Reinicia el timer de actividad para una entidad
   */
  private resetActivityTimer(entityId: string): void {
    const newTime = SIMPLE_CONFIG.MIN_ACTIVITY_TIME + 
      Math.random() * (SIMPLE_CONFIG.MAX_ACTIVITY_TIME - SIMPLE_CONFIG.MIN_ACTIVITY_TIME);
    this.activityTimers.set(entityId, newTime);
  }

  /**
   * Obtiene el tiempo restante de actividad para una entidad
   */
  public getActivityTimeRemaining(entityId: string): number {
    return this.activityTimers.get(entityId) || 0;
  }
}
