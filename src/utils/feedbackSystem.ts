/**
 * Sistema de feedback visual mejorado para el juego Dúo Eterno
 * 
 * Proporciona:
 * - Indicadores visuales de intenciones de entidades
 * - Retroalimentación sobre decisiones de IA
 * - Animaciones contextuales mejoradas
 * - Información de estado más clara
 */

import type { Entity, EntityMood, EntityStats } from '../types';
import { TRANSLATIONS, MOVEMENT_CONFIG } from "../constants";
import { getActivitySession } from './aiDecisionEngine';


interface IntentionIndicator {
  type: 'SEEKING_ZONE' | 'SEEKING_COMPANION' | 'ACTIVITY_FOCUSED' | 'CRITICAL_NEED' | 'CONTENT';
  message: string;
  targetPosition?: { x: number; y: number };
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  duration: number;
  color: string;
}

export interface EntityFeedback {
  id: string;
  intention: IntentionIndicator | null;
  statusMessage: string;
  moodIndicator: string;
  activityProgress: number;
  needsAlert: boolean;
  lastUpdate: number;
}


const entityFeedbacks = new Map<string, EntityFeedback>();

/**
 * Genera un indicador de intención basado en el estado de la entidad
 */
const generateIntentionIndicator = (
  entity: Entity,
  companion: Entity | null,
  resonance: number
): IntentionIndicator | null => {
  const stats = entity.stats;
  

  const criticalStats = Object.entries(stats).filter(([key, value]) => {
    if (key === 'money') return false;
    return value < 15 || (key === 'energy' && value < 15);
  });
  
  if (criticalStats.length > 0) {
    const [criticalStat] = criticalStats[0];
    return {
      type: 'CRITICAL_NEED',
      message: `¡Necesita urgentemente ${TRANSLATIONS.STATS[criticalStat as keyof typeof TRANSLATIONS.STATS]}!`,
      urgency: 'CRITICAL',
      duration: 3000,
      color: '#ff4444'
    };
  }
  

  if (companion && !companion.isDead && stats.loneliness < 30) {
    const distance = Math.sqrt(
      Math.pow(entity.position.x - companion.position.x, 2) +
      Math.pow(entity.position.y - companion.position.y, 2)
    );
    
    if (distance > MOVEMENT_CONFIG.COMPANION_SEEK_DISTANCE) {
      return {
        type: 'SEEKING_COMPANION',
        message: 'Buscando a su compañero...',
        targetPosition: companion.position,
        urgency: 'MEDIUM',
        duration: 2500,
        color: '#ffaa44'
      };
    }
  }
  

  const urgentStats = Object.entries(stats).filter(([key, value]) => {
    if (key === 'money') return false;
    return value < 40 || (key === 'energy' && value < 40);
  });
  
  if (urgentStats.length > 0) {
    return {
      type: 'SEEKING_ZONE',
      message: `Buscando lugar para ${TRANSLATIONS.ACTIVITIES[entity.activity]}`,
      urgency: 'MEDIUM',
      duration: 2000,
      color: '#44aaff'
    };
  }
  

  const session = getActivitySession(entity.id);
  if (session && session.effectiveness > 0.7) {
    return {
      type: 'ACTIVITY_FOCUSED',
      message: `Concentrado en ${TRANSLATIONS.ACTIVITIES[entity.activity]}`,
      urgency: 'LOW',
      duration: 1500,
      color: '#44ff88'
    };
  }
  

  if (stats.happiness < 30 && stats.energy > 50 && resonance > 60) {
    return {
      type: 'CONTENT',
      message: 'Se siente tranquilo y en paz',
      urgency: 'LOW',
      duration: 2000,
      color: '#88ff88'
    };
  }
  
  return null;
};

/**
 * Genera un mensaje de estado descriptivo
 */
const generateStatusMessage = (entity: Entity): string => {
  const activity = TRANSLATIONS.ACTIVITIES[entity.activity];
  const mood = TRANSLATIONS.MOODS[entity.mood];
  

  if (entity.isDead) {
    return 'Ha partido de este mundo...';
  }
  
  if (entity.state === 'FADING') {
    return `${mood}, pero desvaneciéndose...`;
  }
  
  if (entity.state === 'LOW_RESONANCE') {
    return `${mood}, sintiéndose desconectado`;
  }
  

  const session = getActivitySession(entity.id);
  if (session) {
    const effectiveness = session.effectiveness;
    
    if (effectiveness > 0.8) {
      return `${mood}, ${activity} muy eficazmente`;
    } else if (effectiveness > 0.5) {
      return `${mood}, ${activity} de manera regular`;
    } else {
      return `${mood}, luchando con ${activity}`;
    }
  }
  
  return `${mood}, ${activity}`;
};

/**
 * Genera indicador visual de humor
 */
const generateMoodIndicator = (mood: EntityMood, stats: EntityStats): string => {
  const moodEmojis: Record<EntityMood, string> = {
    'HAPPY': '😊',
    'EXCITED': '🤩',
    'CONTENT': '😌',
    'CALM': '😐',
    'TIRED': '😴',
    'SAD': '😢',
    'ANXIOUS': '😰',
    'ANGRY': '😠',
    'BORED': '😑',
    'LONELY': '😔'
  };
  
  let indicator = moodEmojis[mood];
  

  if (stats.hunger < 10) indicator += '🍽️';
  if (stats.sleepiness < 10) indicator += '💤';
  if (stats.loneliness < 10) indicator += '💔';
  if (stats.energy < 10) indicator += '⚡';
  
  return indicator;
};

/**
 * Actualiza el feedback para una entidad específica
 */
export const updateEntityFeedback = (
  entity: Entity,
  companion: Entity | null,
  resonance: number
): EntityFeedback => {
  const intention = generateIntentionIndicator(entity, companion, resonance);
  const statusMessage = generateStatusMessage(entity);
  const moodIndicator = generateMoodIndicator(entity.mood, entity.stats);
  

  let activityProgress = 0;
  const session = getActivitySession(entity.id);
  if (session) {
    const elapsed = Date.now() - session.startTime;
    activityProgress = Math.min(1, elapsed / session.plannedDuration);
  }
  

  const needsAlert = Object.entries(entity.stats).some(([key, value]) => {
    if (key === 'money') return false;
    return value < 20 || (key === 'energy' && value < 20);
  });
  
  const feedback: EntityFeedback = {
    id: entity.id,
    intention,
    statusMessage,
    moodIndicator,
    activityProgress,
    needsAlert,
    lastUpdate: Date.now()
  };
  
  entityFeedbacks.set(entity.id, feedback);
  return feedback;
};

/**
 * Obtiene el feedback actual de una entidad
 */
export const getEntityFeedback = (entityId: string): EntityFeedback | null => {
  return entityFeedbacks.get(entityId) || null;
};

/**
 * Calcula la posición óptima para mostrar indicadores de intención
 */
export const calculateIndicatorPosition = (
  entity: Entity,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } => {
  let x = entity.position.x;
  let y = entity.position.y - 30;
  

  if (x < 50) x = 50;
  if (x > canvasWidth - 50) x = canvasWidth - 50;
  if (y < 20) y = entity.position.y + 30;
  if (y > canvasHeight - 20) y = canvasHeight - 20;
  
  return { x, y };
};

/**
 * Genera datos para animaciones contextuales
 */
export interface ContextualAnimation {
  type: 'PULSE' | 'GLOW' | 'TRAIL' | 'SHAKE' | 'BOUNCE';
  intensity: number;
  color: string;
  duration: number;
}

export const generateContextualAnimation = (entity: Entity, resonance: number): ContextualAnimation | null => {

  const criticalStats = Object.values(entity.stats).filter(value => value < 10).length;
  if (criticalStats > 0) {
    return {
      type: 'SHAKE',
      intensity: Math.min(1, criticalStats / 3),
      color: '#ff4444',
      duration: 500
    };
  }
  

  if (entity.mood === 'EXCITED' && entity.stats.energy > 70) {
    return {
      type: 'BOUNCE',
      intensity: 0.8,
      color: '#ffdd44',
      duration: 1000
    };
  }
  

  if (resonance > 80 && entity.stats.happiness < 40) {
    return {
      type: 'GLOW',
      intensity: 0.6,
      color: '#44ffaa',
      duration: 2000
    };
  }
  

  if (entity.state === 'FADING') {
    return {
      type: 'PULSE',
      intensity: 0.4,
      color: '#ffaa44',
      duration: 1500
    };
  }
  
  return null;
};
