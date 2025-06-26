/**
 * Motor de decisiones de IA mejorado para entidades del juego Dúo Eterno
 * 
 * Características implementadas:
 * - Inercia de actividad (no cambiar constantemente)
 * - Influencia del estado de ánimo en decisiones
 * - Rasgos de personalidad básicos
 * - Decisiones más inteligentes basadas en contexto
 */

import type { Entity, EntityActivity, EntityMood } from '../types';
import { 
  ACTIVITY_TYPES 
} from '../constants/gameConstants';
import { ACTIVITY_DYNAMICS, calculateActivityPriority } from './activityDynamics';
import { gameConfig } from '../config/gameConfig';
import { logAI } from './logger';
import { dynamicsLogger } from './dynamicsLogger';

// Perfiles de personalidad para cada entidad
interface PersonalityProfile {
  socialPreference: number;      // 0-1, qué tan social es la entidad
  activityPersistence: number;   // 0-1, qué tan persistente es en actividades
  riskTolerance: number;         // 0-1, tolerancia al riesgo en decisiones
  energyEfficiency: number;      // 0-1, qué tan eficiente es energéticamente
}

// Perfiles fijos para cada entidad (podrían expandirse a sistema más dinámico)
const ENTITY_PERSONALITIES: Record<'circle' | 'square', PersonalityProfile> = {
  circle: {
    socialPreference: 0.7,
    activityPersistence: 0.6,
    riskTolerance: 0.4,
    energyEfficiency: 0.5
  },
  square: {
    socialPreference: 0.5,
    activityPersistence: 0.8,
    riskTolerance: 0.6,
    energyEfficiency: 0.7
  }
};

// Modificadores de humor para decisiones
const MOOD_MODIFIERS: Record<EntityMood, {
  activityChange: number;   // Probabilidad de cambiar de actividad
  socialSeek: number;       // Tendencia a buscar compañía
  riskTaking: number;       // Tendencia a tomar riesgos
  energyConservation: number; // Tendencia a conservar energía
}> = {
  'HAPPY': { activityChange: 0.3, socialSeek: 0.7, riskTaking: 0.6, energyConservation: 0.3 },
  'EXCITED': { activityChange: 0.8, socialSeek: 0.8, riskTaking: 0.8, energyConservation: 0.2 },
  'CONTENT': { activityChange: 0.2, socialSeek: 0.5, riskTaking: 0.4, energyConservation: 0.4 },
  'CALM': { activityChange: 0.1, socialSeek: 0.4, riskTaking: 0.3, energyConservation: 0.6 },
  'TIRED': { activityChange: 0.1, socialSeek: 0.2, riskTaking: 0.1, energyConservation: 0.9 },
  'SAD': { activityChange: 0.4, socialSeek: 0.9, riskTaking: 0.2, energyConservation: 0.7 },
  'ANXIOUS': { activityChange: 0.7, socialSeek: 0.6, riskTaking: 0.1, energyConservation: 0.8 }
};

// Sistema de persistencia de actividad mejorado
interface ActivitySession {
  activity: EntityActivity;
  startTime: number;
  plannedDuration: number;
  effectiveness: number;
  satisfactionLevel: number;
  interruptions: number;
}

const activitySessions = new Map<string, ActivitySession>();

/**
 * Obtiene el perfil de personalidad de una entidad
 */
const getPersonalityProfile = (entityId: 'circle' | 'square'): PersonalityProfile => {
  return ENTITY_PERSONALITIES[entityId];
};

/**
 * Calcula la inercia de actividad basada en personalidad y contexto
 */
const calculateActivityInertia = (
  entity: Entity,
  currentTime: number
): number => {
  const session = activitySessions.get(entity.id);
  if (!session) return 0;

  const personality = getPersonalityProfile(entity.id);
  const timeSinceStart = currentTime - session.startTime;
  const progressRatio = timeSinceStart / session.plannedDuration;
  
  // Inercia base por personalidad
  let inertia = personality.activityPersistence;
  
  // Aumentar inercia si la actividad es efectiva
  if (session.effectiveness > 0.7) {
    inertia += 0.2;
  }
  
  // Disminuir inercia si hay muchas interrupciones
  if (session.interruptions > 2) {
    inertia -= 0.3;
  }
  
  // Inercia es menor al inicio y al final de una actividad
  if (progressRatio < 0.1 || progressRatio > 0.9) {
    inertia *= 0.5;
  }
  
  // Aplicar configuración global
  return Math.max(0, Math.min(1, inertia * gameConfig.activityInertiaBonus));
};

/**
 * Evalúa si una entidad debería cambiar de actividad
 */
const shouldChangeActivity = (
  entity: Entity,
  currentTime: number,
  urgencyScore: number
): boolean => {
  // Siempre cambiar si es una emergencia crítica
  if (urgencyScore > 90) return true;
  
  // FIX EMERGENCIA: Forzar cambio cada 15 segundos para evitar estancamiento
  const session = activitySessions.get(entity.id);
  if (session && (currentTime - session.startTime) > 15000) {
    return true; // Cambiar después de 15 segundos máximo
  }
  
  // No cambiar si recién comenzó una actividad (menos de 3 segundos)
  if (session && (currentTime - session.startTime) < 3000) {
    return false;
  }
  
  const personality = getPersonalityProfile(entity.id);
  const moodModifier = MOOD_MODIFIERS[entity.mood];
  const inertia = calculateActivityInertia(entity, currentTime);
  
  // Calcular probabilidad de cambio
  let changeChance = moodModifier.activityChange;
  
  // Reducir por inercia
  changeChance *= (1 - inertia);
  
  // Aumentar si la nueva actividad es mucho mejor
  if (urgencyScore > 70) {
    changeChance += 0.3;
  }
  
  // Aplicar personalidad
  if (personality.activityPersistence > 0.7) {
    changeChance *= 0.6; // Más persistente = menos probable cambio
  }
  
  return Math.random() < changeChance;
};

/**
 * Aplica modificadores de humor a las prioridades de actividad
 */
const applyMoodModifiers = (
  baseScore: number,
  activity: EntityActivity,
  mood: EntityMood
): number => {
  const moodModifier = MOOD_MODIFIERS[mood];
  let modifiedScore = baseScore;
  
  // Actividades sociales favorecidas por ciertos humores
  if (activity === 'SOCIALIZING' || activity === 'DANCING') {
    modifiedScore += moodModifier.socialSeek * 20;
  }
  
  // Actividades de descanso favorecidas cuando se está cansado
  if (activity === 'RESTING' || activity === 'MEDITATING') {
    modifiedScore += moodModifier.energyConservation * 15;
  }
  
  // Actividades arriesgadas penalizadas por humores cautelosos
  if (activity === 'EXPLORING' || activity === 'EXERCISING') {
    modifiedScore += (moodModifier.riskTaking - 0.5) * 25;
  }
  
  // Aplicar configuración global
  return modifiedScore + (modifiedScore * gameConfig.moodInfluenceStrength * 0.2);
};

/**
 * Inicia una nueva sesión de actividad
 */
const startActivitySession = (
  entityId: string,
  activity: EntityActivity,
  currentTime: number
): void => {
  const plannedDuration = ACTIVITY_DYNAMICS[activity]?.optimalDuration || 20000;
  
  activitySessions.set(entityId, {
    activity,
    startTime: currentTime,
    plannedDuration,
    effectiveness: 1.0,
    satisfactionLevel: 0.5,
    interruptions: 0
  });
};

/**
 * Motor principal de decisiones de IA mejorado
 */
export const makeIntelligentDecision = (
  entity: Entity,
  companion: Entity | null,
  currentTime: number
): EntityActivity => {
  const personality = getPersonalityProfile(entity.id);
  
  // Evaluar todas las actividades disponibles
  const activityScores: Array<{ activity: EntityActivity; score: number }> = [];
  
  for (const activity of ACTIVITY_TYPES) {
    // Puntaje base del sistema existente
    const baseScore = calculateActivityPriority(activity, entity.stats, currentTime - (entity.lastActivityChange || 0));
    
    // Aplicar modificadores de humor
    const moodModifiedScore = applyMoodModifiers(baseScore, activity, entity.mood);
    
    // Aplicar preferencias de personalidad
    let personalityModifiedScore = moodModifiedScore;
    
    // Actividades sociales favorecidas por entidades sociales
    if ((activity === 'SOCIALIZING' || activity === 'DANCING') && companion && !companion.isDead) {
      personalityModifiedScore += personality.socialPreference * 15;
    }
    
    // Actividades eficientes favorecidas por entidades eficientes
    if (activity === 'MEDITATING' || activity === 'RESTING') {
      personalityModifiedScore += personality.energyEfficiency * 10;
    }
    
    activityScores.push({ activity, score: personalityModifiedScore });
  }
  
  // Ordenar por puntaje
  activityScores.sort((a, b) => b.score - a.score);
  
  const topActivity = activityScores[0];
  
  // Log de decisión tomada
  dynamicsLogger.logDecisionMaking(entity.id, activityScores, topActivity.activity);
  
  // Decidir si cambiar de actividad usando lógica mejorada
  if (topActivity.activity !== entity.activity) {
    const urgencyScore = topActivity.score;
    
    if (shouldChangeActivity(entity, currentTime, urgencyScore)) {
      // Log del cambio de actividad
      dynamicsLogger.logActivityChange(
        entity.id, 
        entity.activity, 
        topActivity.activity, 
        `urgencia: ${urgencyScore.toFixed(1)}`
      );
      
      // Interrumpir sesión anterior si existe
      const oldSession = activitySessions.get(entity.id);
      if (oldSession) {
        oldSession.interruptions++;
      }
      
      // Iniciar nueva sesión
      startActivitySession(entity.id, topActivity.activity, currentTime);
      
      if (gameConfig.debugMode) {
        logAI.debug(`${entity.id} cambia actividad: ${entity.activity} → ${topActivity.activity}`, { urgencia: urgencyScore.toFixed(1) });
      }
      
      return topActivity.activity;
    }
  }
  
  // Mantener actividad actual
  return entity.activity;
};

/**
 * Obtiene información de la sesión actual de actividad
 */
export const getActivitySession = (entityId: string): ActivitySession | undefined => {
  return activitySessions.get(entityId);
};

/**
 * Limpia sesiones de actividad (útil para reset del juego)
 */

