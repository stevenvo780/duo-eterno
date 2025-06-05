/**
 * MOTOR DE DECISIONES SIMPLIFICADO - Dúo Eterno
 * Versión optimizada y eficiente del sistema de IA
 */

import type { Entity, EntityActivity } from '../types';
import { logAI } from './logger';

// Configuración simplificada
const AI_CONFIG = {
  MIN_ACTIVITY_TIME: 2000,    // mínimo 2 segundos en una actividad (reducido)
  CHANGE_THRESHOLD: 40,       // puntaje mínimo para cambiar actividad (reducido)
  URGENCY_MULTIPLIER: 1.5,    // multiplicador para necesidades urgentes (reducido)
};

// Mapeo directo de necesidades a actividades
const NEED_TO_ACTIVITY: Record<string, EntityActivity> = {
  'hunger': 'WORKING',        // trabajar para conseguir dinero para comida
  'sleepiness': 'RESTING',    // descansar para recuperar energía
  'boredom': 'DANCING',       // bailar para entretenerse
  'loneliness': 'SOCIALIZING', // socializar para reducir soledad
  'energy': 'MEDITATING',     // meditar para recuperar energía
  'happiness': 'CONTEMPLATING' // contemplar para mejorar felicidad
};

// Sesiones de actividad simplificadas
const activitySessions = new Map<string, {
  activity: EntityActivity;
  startTime: number;
}>();

/**
 * Motor principal de decisiones simplificado
 */
export const makeIntelligentDecision = (
  entity: Entity,
  companion: Entity | null,
  currentTime: number
): EntityActivity => {
  
  // Log de entrada para debug
  logAI.debug(`IA evaluando ${entity.id}`, {
    currentActivity: entity.activity,
    stats: entity.stats
  });
  
  // Verificar si recién cambió de actividad
  const session = activitySessions.get(entity.id);
  if (session && (currentTime - session.startTime) < AI_CONFIG.MIN_ACTIVITY_TIME) {
    logAI.debug(`${entity.id} mantiene actividad por tiempo mínimo`);
    return entity.activity; // Mantener actividad actual
  }

  // Encontrar la necesidad más crítica
  let mostCriticalNeed: string | null = null;
  let highestUrgency = 0;

  // Evaluar necesidades (valores altos = malo en este sistema)
  Object.entries(entity.stats).forEach(([key, value]) => {
    if (key === 'money' || key === 'health') return;
    
    let urgency = 0;
    
    // Necesidades críticas (valores altos son malos)
    if (key === 'sleepiness' && value > 70) urgency = value * 1.5;
    else if (key === 'hunger' && value > 60) urgency = value * 1.3;
    else if (key === 'loneliness' && value > 80) urgency = value * 1.2;
    else if (key === 'boredom' && value > 70) urgency = value * 1.1;
    
    // Necesidades de energía y felicidad (valores bajos son malos)
    else if (key === 'energy' && value < 30) urgency = (100 - value) * 1.4;
    else if (key === 'happiness' && value < 40) urgency = (100 - value) * 1.1;

    if (urgency > highestUrgency) {
      highestUrgency = urgency;
      mostCriticalNeed = key;
    }
  });

  // Decidir nueva actividad
  let newActivity: EntityActivity = entity.activity;

  if (mostCriticalNeed && highestUrgency > AI_CONFIG.CHANGE_THRESHOLD) {
    // Usar actividad específica para la necesidad crítica
    const targetActivity = NEED_TO_ACTIVITY[mostCriticalNeed];
    if (targetActivity) {
      newActivity = targetActivity;
    }
  } else if (companion && !companion.isDead) {
    // Si no hay necesidades críticas y hay compañero, socializar
    const distance = Math.sqrt(
      Math.pow(entity.position.x - companion.position.x, 2) +
      Math.pow(entity.position.y - companion.position.y, 2)
    );
    
    if (distance < 100 && entity.stats.loneliness > 40) {
      newActivity = 'SOCIALIZING';
    }
  } else {
    // Actividad por defecto cuando todo está bien
    const defaultActivities: EntityActivity[] = ['WANDERING', 'CONTEMPLATING', 'MEDITATING'];
    newActivity = defaultActivities[Math.floor(Math.random() * defaultActivities.length)];
  }

  // Actualizar sesión si cambió
  if (newActivity !== entity.activity) {
    activitySessions.set(entity.id, {
      activity: newActivity,
      startTime: currentTime
    });

    logAI.debug(`${entity.id}: ${entity.activity} → ${newActivity}`, {
      reason: mostCriticalNeed || 'default',
      urgency: highestUrgency.toFixed(1)
    });
  }

  return newActivity;
};

/**
 * Limpia las sesiones de actividad
 */
export const clearActivitySessions = (): void => {
  activitySessions.clear();
};

/**
 * Obtiene información de la sesión actual
 */
export const getActivitySession = (entityId: string) => {
  return activitySessions.get(entityId);
};
