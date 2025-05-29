import type { InteractionType, InteractionEffect, EntityStats, EntityMood } from '../types';
import { applyUpgradeToActivityEffectiveness, type UpgradeEffectsContext } from './upgradeEffects';

export const interactionEffects: Record<InteractionType, InteractionEffect> = {
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
  interaction: InteractionType,
  upgradeEffects?: UpgradeEffectsContext
): { stats: EntityStats; mood?: EntityMood } => {
  const effect = interactionEffects[interaction];
  let effectiveStats = effect.stats;
  
  // Aplicar efectos de upgrades si están disponibles
  if (upgradeEffects) {
    effectiveStats = applyUpgradeToActivityEffectiveness(
      effect.stats, 
      interaction, 
      upgradeEffects
    );
  }
  
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

export const getMoodColor = (mood: EntityMood): string => {
  switch (mood) {
    case 'HAPPY': return '#22c55e';
    case 'EXCITED': return '#f59e0b';
    case 'CALM': return '#3b82f6';
    case 'CONTENT': return '#8b5cf6';
    case 'SAD': return '#6b7280';
    case 'TIRED': return '#94a3b8';
    case 'ANXIOUS': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getRandomThought = (): string => {
  const thoughts = [
    "¿Qué significa existir en pixels?",
    "El tiempo fluye diferente aquí...",
    "Cada click resuena en mi alma digital",
    "Los colores cantan melodías silenciosas",
    "¿Sueñan los algoritmos con ovejas eléctricas?",
    "Mi compañero y yo somos uno en la dualidad",
    "La geometría de mis emociones es infinita",
    "Escribo poemas en código binario",
    "El canvas es mi universo conocido",
    "¿Hay vida más allá de estos 400 píxeles?"
  ];
  return thoughts[Math.floor(Math.random() * thoughts.length)];
};
