import type { Entity, EntityActivity, EntityMood } from '../types';
import { ACTIVITY_TYPES } from '../constants/gameConstants';
import { ACTIVITY_EFFECTS, calculateActivityPriority, getActivityDynamics } from './activityDynamics';
import { gameConfig } from '../config/gameConfig';
import { logAI } from './logger';
import { dynamicsLogger } from './dynamicsLogger';

interface PersonalityProfile {
  socialPreference: number;
  activityPersistence: number;
  riskTolerance: number;
  energyEfficiency: number;
}

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

const MOOD_MODIFIERS: Record<EntityMood, {
  activityChange: number;
  socialSeek: number;
  riskTaking: number;
  energyConservation: number;
}> = {
  'HAPPY': { activityChange: 0.3, socialSeek: 0.7, riskTaking: 0.6, energyConservation: 0.3 },
  'EXCITED': { activityChange: 0.8, socialSeek: 0.8, riskTaking: 0.8, energyConservation: 0.2 },
  'CONTENT': { activityChange: 0.2, socialSeek: 0.5, riskTaking: 0.4, energyConservation: 0.4 },
  'CALM': { activityChange: 0.1, socialSeek: 0.4, riskTaking: 0.3, energyConservation: 0.6 },
  'TIRED': { activityChange: 0.1, socialSeek: 0.2, riskTaking: 0.1, energyConservation: 0.9 },
  'SAD': { activityChange: 0.4, socialSeek: 0.9, riskTaking: 0.2, energyConservation: 0.7 },
  'ANXIOUS': { activityChange: 0.7, socialSeek: 0.6, riskTaking: 0.1, energyConservation: 0.8 }
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

const getPersonalityProfile = (entityId: 'circle' | 'square'): PersonalityProfile => {
  return ENTITY_PERSONALITIES[entityId];
};

const calculateActivityInertia = (
  entity: Entity,
  currentTime: number
): number => {
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
  const moodModifier = MOOD_MODIFIERS[entity.mood];
  const inertia = calculateActivityInertia(entity, currentTime);
  
  let changeChance = moodModifier.activityChange;
  changeChance *= (1 - inertia);
  
  if (urgencyScore > 70) {
    changeChance += 0.3;
  }
  
  if (personality.activityPersistence > 0.7) {
    const influence = Math.max(0, Math.min(1, gameConfig.aiPersonalityInfluence));
    const damp = 1 - (1 - 0.6) * influence; // interpola entre 1 y 0.6
    changeChance *= damp;
  }
  
  return Math.random() < changeChance;
};

const applyMoodModifiers = (
  baseScore: number,
  activity: EntityActivity,
  mood: EntityMood
): number => {
  const moodModifier = MOOD_MODIFIERS[mood];
  let modifiedScore = baseScore;
  
  if (activity === 'SOCIALIZING' || activity === 'DANCING') {
    modifiedScore += moodModifier.socialSeek * 20;
  }
  
  if (activity === 'RESTING' || activity === 'MEDITATING') {
    modifiedScore += moodModifier.energyConservation * 15;
  }
  
  if (activity === 'EXPLORING' || activity === 'EXERCISING') {
    modifiedScore += (moodModifier.riskTaking - 0.5) * 25;
  }
  
  return modifiedScore + (modifiedScore * gameConfig.moodInfluenceStrength * 0.2);
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

// Simple habit memory per entity (decays over time via normalization)
const activityHabits = new Map<string, Partial<Record<EntityActivity, number>>>();

const updateHabit = (entityId: string, activity: EntityActivity, reward: number) => {
  const habits = activityHabits.get(entityId) || {};
  const prev = habits[activity] ?? 0;
  habits[activity] = Math.max(0, prev * 0.95 + reward); // decay and reinforce
  activityHabits.set(entityId, habits);
};

const getHabitBias = (entityId: string, activity: EntityActivity): number => {
  const habits = activityHabits.get(entityId) || {};
  return (habits[activity] ?? 0) * 5; // modest influence
};

const softmaxPick = (scores: Array<{ activity: EntityActivity; score: number }>, temperature = 0.7) => {
  const tau = Math.max(0.1, temperature);
  const maxScore = Math.max(...scores.map(s => s.score));
  const exps = scores.map(s => Math.exp((s.score - maxScore) / tau));
  const sum = exps.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
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
    const baseScore = calculateActivityPriority(activity, entity.stats, currentTime - (entity.lastActivityChange || 0));
    const moodModifiedScore = applyMoodModifiers(baseScore, activity, entity.mood);
    
    let personalityModifiedScore = moodModifiedScore;
    
    if ((activity === 'SOCIALIZING' || activity === 'DANCING') && companion && !companion.isDead) {
      personalityModifiedScore += personality.socialPreference * 15 * Math.max(0, Math.min(1, gameConfig.aiPersonalityInfluence));
    }
    
    if (activity === 'MEDITATING' || activity === 'RESTING') {
      personalityModifiedScore += personality.energyEfficiency * 10 * Math.max(0, Math.min(1, gameConfig.aiPersonalityInfluence));
    }
    
    activityScores.push({ activity, score: personalityModifiedScore });
  }
  
  // Add small habit bias and pick via softmax to avoid mode-locking
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
        logAI.debug(`${entity.id} cambia actividad: ${entity.activity} → ${chosen}`, { urgencia: urgencyScore.toFixed(1) });
      }
      
      // Reward habit slightly for exploration and change
      updateHabit(entity.id, chosen, 0.1);
      return chosen;
    }
  }
  
  return entity.activity;
};

export const getActivitySession = (entityId: string): ActivitySession | undefined => {
  return activitySessions.get(entityId);
};
