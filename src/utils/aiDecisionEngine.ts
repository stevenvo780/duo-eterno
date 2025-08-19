/**
 * Motor de decisiones de actividades para agentes.
 * Basado en prioridad por necesidades, estado de ánimo, personalidad y softmax (temperatura).
 */
import type { Entity, EntityActivity, EntityMood } from '../types';
import { ACTIVITY_TYPES } from '../constants';
import {
  ACTIVITY_EFFECTS,
  calculateActivityPriority,
  getActivityDynamics
} from './activityDynamics';
import { gameConfig } from '../config/gameConfig';
import { logAI } from './logger';
import { dynamicsLogger } from './dynamicsLogger';

interface PersonalityProfile {
  socialPreference: number;
  activityPersistence: number;
  riskTolerance: number;
  energyEfficiency: number;
}

const ENTITY_PERSONALITIES: Record<'isa' | 'stev', PersonalityProfile> = {
  isa: {
    socialPreference: 0.7,
    activityPersistence: 0.6,
    riskTolerance: 0.4,
    energyEfficiency: 0.5
  },
  stev: {
    socialPreference: 0.5,
    activityPersistence: 0.8,
    riskTolerance: 0.6,
    energyEfficiency: 0.7
  }
};

const MOOD_MODIFIERS: Record<
  EntityMood,
  {
    activityChange: number;
    socialSeek: number;
    riskTaking: number;
    energyConservation: number;
  }
> = {
  '😊': { activityChange: 0.3, socialSeek: 0.7, riskTaking: 0.6, energyConservation: 0.3 }, // HAPPY/CONTENT
  '🤩': { activityChange: 0.8, socialSeek: 0.8, riskTaking: 0.8, energyConservation: 0.2 }, // EXCITED
  '😌': { activityChange: 0.1, socialSeek: 0.4, riskTaking: 0.3, energyConservation: 0.6 }, // CALM
  '😢': { activityChange: 0.4, socialSeek: 0.9, riskTaking: 0.2, energyConservation: 0.7 }, // SAD
  '😰': { activityChange: 0.7, socialSeek: 0.6, riskTaking: 0.1, energyConservation: 0.8 }, // ANXIOUS
  '😡': { activityChange: 0.6, socialSeek: 0.3, riskTaking: 0.7, energyConservation: 0.4 }, // ANGRY
  '😑': { activityChange: 0.8, socialSeek: 0.4, riskTaking: 0.5, energyConservation: 0.3 }, // BORED
  '😔': { activityChange: 0.5, socialSeek: 0.9, riskTaking: 0.3, energyConservation: 0.6 }, // LONELY
  '😴': { activityChange: 0.1, socialSeek: 0.2, riskTaking: 0.1, energyConservation: 0.9 }  // TIRED
};

interface ActivitySession {
  activity: EntityActivity;
  startTime: number;
  plannedDuration: number;
  effectiveness: number;
  satisfactionLevel: number;
  interruptions: number;
  immediateApplied: boolean;
}

const activitySessions = new Map<string, ActivitySession>();

const getPersonalityProfile = (entityId: string): PersonalityProfile => {
  if (entityId === 'stev') {
    return ENTITY_PERSONALITIES.stev;
  }
  return ENTITY_PERSONALITIES.isa;
};

/**
 * Inercia de actividad: resiste cambios mientras la sesión actual progresa.
 * Factores: persistencia de personalidad, efectividad observada, interrupciones y
 * progreso relativo. Retorna [0,1] tras normalizar con `activityInertiaBonus`.
 */
const calculateActivityInertia = (entity: Entity, currentTime: number): number => {
  const session = activitySessions.get(entity.id);
  if (!session) return 0;

  const personality = getPersonalityProfile(entity.id);
  const timeSinceStart = currentTime - session.startTime;
  const progressRatio = timeSinceStart / session.plannedDuration;

  let inertia = personality.activityPersistence;

  if (session.effectiveness > 0.7) {
    inertia += 0.2;
  }

  if (session.interruptions > 2) {
    inertia -= 0.3;
  }

  if (progressRatio < 0.1 || progressRatio > 0.9) {
    inertia *= 0.5;
  }

  const bonusNorm = Math.max(0, Math.min(1.5, gameConfig.activityInertiaBonus / 15));
  return Math.max(0, Math.min(1, inertia * bonusNorm));
};

/**
 * Criterio de cambio: umbral duro por urgencia y ventana mínima, luego
 * probabilidad basada en estado de ánimo y (1 - inercia). La urgencia alta
 * aumenta la probabilidad; personalidad puede amortiguar cambios.
 */
const shouldChangeActivity = (
  entity: Entity,
  currentTime: number,
  urgencyScore: number
): boolean => {
  if (urgencyScore > 90) return true;

  const session = activitySessions.get(entity.id);

  if (session) {
    const minDuration = ACTIVITY_EFFECTS[session.activity]?.minDuration || 5000;
    if (currentTime - session.startTime < minDuration) {
      return false;
    }
  }

  const personality = getPersonalityProfile(entity.id);

  const normalizedMood = entity.mood.toUpperCase() as keyof typeof MOOD_MODIFIERS;
  const moodModifier = MOOD_MODIFIERS[normalizedMood];
  const inertia = calculateActivityInertia(entity, currentTime);

  if (!moodModifier) {
    console.warn(
      `🚨 Mood modifier no encontrado para mood: "${entity.mood}" (normalizado: "${normalizedMood}"). Usando valores por defecto.`
    );
    return urgencyScore > 80;
  }

  let changeChance = moodModifier.activityChange;
  changeChance *= 1 - inertia;

  if (urgencyScore > 70) {
    changeChance += 0.3;
  }

  if (personality.activityPersistence > 0.7) {
    const influence = Math.max(0, Math.min(1, gameConfig.aiPersonalityInfluence));
    const damp = 1 - (1 - 0.6) * influence;
    changeChance *= damp;
  }

  const seed = (Date.now() * 1664525 + 1013904223) % 2147483647;
  const deterministicValue = seed / 2147483647;
  return deterministicValue < changeChance;
};

/**
 * Modulación por estado de ánimo: ajusta el score base por afinidad actividad↔mood.
 * Ej.: SOCIALIZING aumenta con socialSeek; RESTING/MEDITATING con energyConservation.
 */
const applyMoodModifiers = (
  baseScore: number,
  activity: EntityActivity,
  mood: EntityMood
): number => {
  const normalizedMood = mood.toUpperCase() as keyof typeof MOOD_MODIFIERS;
  const moodModifier = MOOD_MODIFIERS[normalizedMood];

  if (!moodModifier) {
    console.warn(
      `🚨 Mood modifier no encontrado para mood: "${mood}" (normalizado: "${normalizedMood}"). Usando valores por defecto.`
    );
    return baseScore;
  }

  let modifiedScore = baseScore;

  if (activity === 'SOCIALIZING') {
    modifiedScore += moodModifier.socialSeek * 20;
  }

  if (activity === 'RESTING' || activity === 'MEDITATING') {
    modifiedScore += moodModifier.energyConservation * 15;
  }

  if (activity === 'EXERCISING') {
    modifiedScore += (moodModifier.riskTaking - 0.5) * 25;
  }

  return modifiedScore + modifiedScore * gameConfig.moodInfluenceStrength * 0.2;
};

const startActivitySession = (
  entityId: string,
  activity: EntityActivity,
  currentTime: number
): void => {
  const activityDynamics = getActivityDynamics();
  const plannedDuration = activityDynamics[activity]?.optimalDuration || 20000;

  activitySessions.set(entityId, {
    activity,
    startTime: currentTime,
    plannedDuration,
    effectiveness: 1.0,
    satisfactionLevel: 0.5,
    interruptions: 0,
    immediateApplied: false
  });
};

const activityHabits = new Map<string, Partial<Record<EntityActivity, number>>>();

const updateHabit = (entityId: string, activity: EntityActivity, reward: number) => {
  const habits = activityHabits.get(entityId) || {};
  const prev = habits[activity] ?? 0;
  habits[activity] = Math.max(0, prev * 0.95 + reward);
  activityHabits.set(entityId, habits);
};

const getHabitBias = (entityId: string, activity: EntityActivity): number => {
  const habits = activityHabits.get(entityId) || {};
  return (habits[activity] ?? 0) * 5;
};

/**
 * Selección softmax: convierte scores en distribución de probabilidad controlada
 * por `tau` (temperatura). Menor tau ⇒ elección más codiciosa; mayor ⇒ más exploratoria.
 */
const softmaxPick = (
  scores: Array<{ activity: EntityActivity; score: number }>,
  temperature = 0.7
) => {
  const tau = Math.max(0.1, temperature);
  const maxScore = Math.max(...scores.map(s => s.score));
  const exps = scores.map(s => Math.exp((s.score - maxScore) / tau));
  const sum = exps.reduce((a, b) => a + b, 0);

  const seed = (Date.now() * 1664525 + 1013904223) % 2147483647;
  let r = (seed / 2147483647) * sum;

  for (let i = 0; i < scores.length; i++) {
    r -= exps[i];
    if (r <= 0) return scores[i].activity;
  }
  return scores[0].activity;
};

export const makeIntelligentDecision = (
  entity: Entity,
  companion: Entity | null,
  currentTime: number
): EntityActivity => {
  const personality = getPersonalityProfile(entity.id);

  const activityScores: Array<{ activity: EntityActivity; score: number }> = [];

  for (const activity of ACTIVITY_TYPES) {
    const baseScore = calculateActivityPriority(
      activity,
      entity.stats,
      currentTime - (entity.lastActivityChange || 0)
    );
    const moodModifiedScore = applyMoodModifiers(baseScore, activity, entity.mood);

    let personalityModifiedScore = moodModifiedScore;

    if (activity === 'SOCIALIZING' && companion && !companion.isDead) {
      personalityModifiedScore +=
        personality.socialPreference *
        15 *
        Math.max(0, Math.min(1, gameConfig.aiPersonalityInfluence));
    }

    if (activity === 'MEDITATING' || activity === 'RESTING') {
      personalityModifiedScore +=
        personality.energyEfficiency *
        10 *
        Math.max(0, Math.min(1, gameConfig.aiPersonalityInfluence));
    }

    activityScores.push({ activity, score: personalityModifiedScore });
  }

  const biasedScores = activityScores.map(s => ({
    activity: s.activity,
    score: s.score + getHabitBias(entity.id, s.activity)
  }));
  biasedScores.sort((a, b) => b.score - a.score);
  const chosen = softmaxPick(biasedScores, gameConfig.aiSoftmaxTau);
  const chosenScore = biasedScores.find(a => a.activity === chosen)?.score ?? biasedScores[0].score;

  dynamicsLogger.logDecisionMaking(entity.id, biasedScores, chosen);

  if (chosen !== entity.activity) {
    const urgencyScore = chosenScore;

    if (shouldChangeActivity(entity, currentTime, urgencyScore)) {
      dynamicsLogger.logActivityChange(
        entity.id,
        entity.activity,
        chosen,
        `urgencia: ${urgencyScore.toFixed(1)}`
      );

      const oldSession = activitySessions.get(entity.id);
      if (oldSession) {
        oldSession.interruptions++;
      }

      startActivitySession(entity.id, chosen, currentTime);

      if (gameConfig.debugMode) {
        logAI.debug(`${entity.id} cambia actividad: ${entity.activity} → ${chosen}`, {
          urgencia: urgencyScore.toFixed(1)
        });
      }

      updateHabit(entity.id, chosen, 0.1);
      return chosen;
    }
  }

  return entity.activity;
};
