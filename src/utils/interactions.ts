import type { InteractionType, InteractionEffect, EntityStats, EntityMood } from '../types';

const interactionEffects: Record<InteractionType, InteractionEffect> = {
  NOURISH: {
    resonance: 30,
    stats: { happiness: 15, energy: 10 },
    mood: 'CONTENT'
  },
  FEED: {
    stats: { hunger: -40, happiness: 20, energy: 15 },
    mood: 'HAPPY'
  },
  PLAY: {
    stats: { boredom: -50, happiness: 30, energy: -10, loneliness: -20 },
    mood: 'EXCITED'
  },
  COMFORT: {
    stats: { loneliness: -30, happiness: 25, sleepiness: 10 },
    mood: 'CALM'
  },
  DISTURB: {
    stats: { happiness: -20, energy: -15, boredom: 10 },
    mood: 'ANXIOUS'
  },
  WAKE_UP: {
    stats: { sleepiness: -50, energy: 20, happiness: -10 }
  },
  LET_SLEEP: {
    stats: { sleepiness: -30, energy: 30, happiness: 10 },
    mood: 'CALM'
  }
};

export const applyInteractionEffect = (
  currentStats: EntityStats, 
  interaction: InteractionType
): { stats: EntityStats; mood?: EntityMood } => {
  const effect = interactionEffects[interaction];
  const effectiveStats = effect.stats;
  
  const newStats = { ...currentStats };

  // Apply stat changes
  Object.entries(effectiveStats).forEach(([stat, change]) => {
    const statKey = stat as keyof EntityStats;
    if (typeof change === 'number') {
      newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + change));
    }
  });

  return {
    stats: newStats,
    mood: effect.mood
  };
};

export const getStatColor = (value: number): string => {
  if (value > 75) return '#22c55e'; // green
  if (value > 50) return '#eab308'; // yellow  
  if (value > 25) return '#f97316'; // orange
  return '#ef4444'; // red
};
