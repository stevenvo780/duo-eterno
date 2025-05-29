/**
 * Motor de decisiones de IA SIMPLIFICADO para entidades del juego Dúo Eterno
 * 
 * Características:
 * - Lógica clara y predecible
 * - Prioridades basadas en necesidades críticas
 * - Comportamientos coherentes y gamificados
 * - Menos complejidad, más diversión
 */

import type { Entity, EntityActivity, EntityStats } from '../types';

// Mapeo simple de necesidades a actividades
const NEED_TO_ACTIVITY: Record<string, EntityActivity[]> = {
  hunger: ['COOKING', 'SHOPPING'],
  sleepiness: ['RESTING'],
  loneliness: ['SOCIALIZING', 'DANCING'],
  boredom: ['EXPLORING', 'EXERCISING', 'DANCING'],
  energy: ['RESTING', 'MEDITATING'],
  happiness: ['DANCING', 'SOCIALIZING', 'EXPLORING'],
  money: ['WORKING']
};

// Umbrales críticos simplificados
const CRITICAL_THRESHOLDS = {
  hunger: 70,
  sleepiness: 70,
  loneliness: 60,
  boredom: 60,
  energy: 30, // Invertido: bajo es crítico
  happiness: 30, // Invertido: bajo es crítico
  money: 20
};

// Duración mínima para persistir en una actividad (en milisegundos)
const MIN_ACTIVITY_DURATION = 8000; // 8 segundos

/**
 * Motor principal de decisiones simplificado
 */
export const makeSimpleIntelligentDecision = (
  entity: Entity,
  companion: Entity | null,
  currentTime: number
): EntityActivity => {
  // 1. PERSISTENCIA: No cambiar actividad muy frecuentemente
  const timeSinceLastChange = currentTime - (entity.lastActivityChange || 0);
  if (timeSinceLastChange < MIN_ACTIVITY_DURATION && entity.activity !== 'WANDERING') {
    return entity.activity; // Mantener actividad actual
  }

  // 2. NECESIDADES CRÍTICAS: Priorizar supervivencia
  const criticalNeeds = findCriticalNeeds(entity.stats);
  if (criticalNeeds.length > 0) {
    const urgentActivity = selectActivityForNeed(criticalNeeds[0], companion);
    if (urgentActivity && urgentActivity !== entity.activity) {
      return urgentActivity;
    }
  }

  // 3. NECESIDADES SOCIALES: Buscar compañero si está solo
  const distance = companion ? calculateDistance(entity.position, companion.position) : 1000;
  if (entity.stats.loneliness > 50 && distance > 100 && companion && !companion.isDead) {
    return 'SOCIALIZING';
  }

  // 4. ACTIVIDADES DE BIENESTAR: Mejorar calidad de vida
  const wellbeingActivity = selectWellbeingActivity(entity.stats, companion);
  if (wellbeingActivity && wellbeingActivity !== entity.activity) {
    return wellbeingActivity;
  }

  // 5. EXPLORACIÓN POR DEFECTO: Si no hay necesidades urgentes
  if (Math.random() < 0.3) {
    const randomActivities: EntityActivity[] = ['EXPLORING', 'WANDERING', 'CONTEMPLATING'];
    return randomActivities[Math.floor(Math.random() * randomActivities.length)];
  }

  // 6. MANTENER ACTIVIDAD ACTUAL
  return entity.activity;
};

/**
 * Encuentra las necesidades más críticas
 */
function findCriticalNeeds(stats: EntityStats): string[] {
  const critical: string[] = [];
  
  Object.entries(CRITICAL_THRESHOLDS).forEach(([need, threshold]) => {
    const statKey = need as keyof EntityStats;
    const statValue = stats[statKey];
    
    if (need === 'energy' || need === 'happiness') {
      // Para energía y felicidad, bajo es crítico
      if (statValue < threshold) critical.push(need);
    } else {
      // Para el resto, alto es crítico
      if (statValue > threshold) critical.push(need);
    }
  });
  
  // Ordenar por urgencia (más crítico primero)
  return critical.sort((a, b) => {
    const aUrgency = calculateUrgency(stats, a);
    const bUrgency = calculateUrgency(stats, b);
    return bUrgency - aUrgency;
  });
}

/**
 * Calcula qué tan urgente es una necesidad
 */
function calculateUrgency(stats: EntityStats, need: string): number {
  const statKey = need as keyof EntityStats;
  const statValue = stats[statKey];
  const threshold = CRITICAL_THRESHOLDS[need as keyof typeof CRITICAL_THRESHOLDS];
  
  if (need === 'energy' || need === 'happiness') {
    // Para energía y felicidad: más bajo = más urgente
    return threshold - statValue;
  } else {
    // Para el resto: más alto = más urgente
    return statValue - threshold;
  }
}

/**
 * Selecciona una actividad apropiada para una necesidad específica
 */
function selectActivityForNeed(need: string, companion: Entity | null): EntityActivity | null {
  const activities = NEED_TO_ACTIVITY[need];
  if (!activities || activities.length === 0) return null;
  
  // Filtrar actividades sociales si no hay compañero
  const availableActivities = activities.filter(activity => {
    if ((activity === 'SOCIALIZING' || activity === 'DANCING') && (!companion || companion.isDead)) {
      return false;
    }
    return true;
  });
  
  if (availableActivities.length === 0) return null;
  
  // Seleccionar actividad aleatoria de las disponibles
  return availableActivities[Math.floor(Math.random() * availableActivities.length)];
}

/**
 * Selecciona actividades de bienestar general
 */
function selectWellbeingActivity(stats: EntityStats, companion: Entity | null): EntityActivity | null {
  // Si está moderadamente aburrido, explorar
  if (stats.boredom > 40 && Math.random() < 0.4) {
    return 'EXPLORING';
  }
  
  // Si tiene buena energía y compañero, socializar ocasionalmente
  if (stats.energy > 50 && companion && !companion.isDead && stats.loneliness > 30 && Math.random() < 0.3) {
    return Math.random() < 0.5 ? 'SOCIALIZING' : 'DANCING';
  }
  
  // Si está moderadamente cansado, descansar
  if (stats.energy < 60 && Math.random() < 0.3) {
    return 'RESTING';
  }
  
  return null;
}

/**
 * Calcula la distancia entre dos posiciones
 */
function calculateDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Función de utilidad para debugging
 */
export const getDecisionInfo = (entity: Entity, companion: Entity | null): string => {
  const criticalNeeds = findCriticalNeeds(entity.stats);
  const distance = companion ? calculateDistance(entity.position, companion.position) : 1000;
  
  return `Crítico: [${criticalNeeds.join(', ')}], Distancia: ${Math.round(distance)}, Actividad: ${entity.activity}`;
};
