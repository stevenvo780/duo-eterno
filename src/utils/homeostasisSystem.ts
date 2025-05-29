/**
 * Sistema Homeostático Normalizado para duo-eterno
 * Todas las estadísticas en escala 0-100 donde 50 es el equilibrio óptimo
 * Diseñado para comportamiento emergente tipo autómata celular
 */

import type { EntityStats, EntityActivity } from '../types';

// Estadísticas normalizadas: todas en escala 0-100 donde 50 es óptimo
export interface NormalizedStats {
  vitality: number;     // 0=muerte, 50=salud perfecta, 100=hiperenergía
  nourishment: number;  // 0=hambriento, 50=bien alimentado, 100=empachado
  alertness: number;    // 0=exhausto, 50=descansado, 100=insomne
  contentment: number;  // 0=deprimido, 50=contento, 100=maníaco
  stimulation: number;  // 0=aburrido, 50=entretenido, 100=sobreestimulado  
  connection: number;   // 0=solitario, 50=social, 100=abrumado
  resources: number;    // 0=pobre, 50=cómodo, 100=rico
}

// Mapeo entre stats antiguos y normalizados
export const mapOldStatsToNew = (oldStats: EntityStats): NormalizedStats => ({
  vitality: oldStats.energy || 50,
  nourishment: 100 - (oldStats.hunger || 50), // invertir: hunger alto = nourishment bajo
  alertness: 100 - (oldStats.sleepiness || 50), // invertir: sleepiness alto = alertness bajo
  contentment: oldStats.happiness || 50,
  stimulation: 100 - (oldStats.boredom || 50), // invertir: boredom alto = stimulation bajo
  connection: 100 - (oldStats.loneliness || 50), // invertir: loneliness alto = connection bajo
  resources: Math.min(100, (oldStats.money || 50) / 2) // escalar dinero a 0-100
});

export const mapNewStatsToOld = (newStats: NormalizedStats): Partial<EntityStats> => ({
  energy: newStats.vitality,
  hunger: 100 - newStats.nourishment,
  sleepiness: 100 - newStats.alertness,
  happiness: newStats.contentment,
  boredom: 100 - newStats.stimulation,
  loneliness: 100 - newStats.connection,
  // Escalar recursos a dinero y clamped entre 0-100
  money: Math.max(0, Math.min(100, newStats.resources * 2))
});

// Fuerzas homeostáticas: tendencia natural hacia 50 (equilibrio)
const HOMEOSTATIC_FORCES = {
  vitality: 0.1,      // energía tiende a recuperarse lentamente
  nourishment: 0.3,   // hambre aumenta más rápido
  alertness: 0.2,     // sueño aumenta gradualmente
  contentment: 0.05,  // felicidad cambia lentamente
  stimulation: 0.15,  // aburrimiento aparece moderadamente
  connection: 0.1,    // soledad aumenta lentamente
  resources: 0.02     // dinero no tiene tendencia natural
};

// Interdependencias entre estadísticas (efectos sistémicos)
const STAT_INTERDEPENDENCIES = {
  vitality: {
    nourishment: 0.1,   // estar bien alimentado da energía
    alertness: 0.15,    // estar descansado da energía
    contentment: 0.05   // estar feliz da energía
  },
  contentment: {
    vitality: 0.1,      // tener energía da felicidad
    stimulation: 0.1,   // estar estimulado da felicidad
    connection: 0.15,   // conexión social da felicidad
    resources: 0.05     // tener recursos da felicidad
  },
  connection: {
    contentment: 0.1    // estar feliz facilita conexión
  }
};

// Aplicar fuerzas homeostáticas naturales
export const applyHomeostasis = (stats: NormalizedStats, deltaTime: number): NormalizedStats => {
  const timeMultiplier = deltaTime / 1000; // convertir a segundos
  const result = { ...stats };
  
  // Aplicar fuerzas homeostáticas hacia 50
  Object.entries(HOMEOSTATIC_FORCES).forEach(([stat, force]) => {
    const currentValue = result[stat as keyof NormalizedStats];
    const targetValue = 50;
    const difference = targetValue - currentValue;
    
    // Aplicar fuerza proporcional a la distancia del equilibrio
    const adjustment = difference * force * timeMultiplier;
    result[stat as keyof NormalizedStats] = Math.max(0, Math.min(100, currentValue + adjustment));
  });
  
  // Aplicar interdependencias
  Object.entries(STAT_INTERDEPENDENCIES).forEach(([targetStat, influences]) => {
    let totalInfluence = 0;
    
    Object.entries(influences).forEach(([sourceStat, weight]) => {
      const sourceValue = result[sourceStat as keyof NormalizedStats];
      const sourceDeviation = (sourceValue - 50) / 50; // -1 a 1
      totalInfluence += sourceDeviation * weight;
    });
    
    const currentValue = result[targetStat as keyof NormalizedStats];
    const adjustment = totalInfluence * timeMultiplier;
    result[targetStat as keyof NormalizedStats] = Math.max(0, Math.min(100, currentValue + adjustment));
  });
  
  return result;
};

// Efectos de actividades basados en curvas de eficiencia realistas
const ACTIVITY_EFFICIENCY_CURVES = {
  RESTING: {
    vitality: (current: number) => current < 50 ? 0.5 : -0.1,
    alertness: (current: number) => current < 50 ? 0.8 : -0.2,
    nourishment: () => -0.1,
    stimulation: (current: number) => current > 30 ? -0.3 : 0
  },
  SOCIALIZING: {
    connection: (current: number) => current < 50 ? 0.7 : current > 80 ? -0.1 : 0.3,
    contentment: (current: number) => current < 70 ? 0.3 : 0,
    stimulation: (current: number) => current < 70 ? 0.2 : 0,
    vitality: () => -0.1
  },
  EXPLORING: {
    stimulation: (current: number) => current < 60 ? 0.5 : 0,
    vitality: (current: number) => current > 30 ? -0.2 : 0,
    contentment: (current: number) => current < 80 ? 0.2 : 0
  },
  WANDERING: {
    stimulation: (current: number) => current < 50 ? 0.3 : 0,
    vitality: (current: number) => current > 40 ? -0.1 : 0,
    contentment: (current: number) => current < 60 ? 0.1 : 0
  },
  MEDITATING: {
    contentment: (current: number) => current < 80 ? 0.4 : 0,
    alertness: (current: number) => current < 70 ? 0.3 : 0,
    stimulation: (current: number) => current > 60 ? -0.2 : 0.1
  },
  WRITING: {
    stimulation: (current: number) => current < 70 ? 0.3 : 0,
    contentment: (current: number) => current < 60 ? 0.2 : 0,
    vitality: () => -0.1
  },
  CONTEMPLATING: {
    contentment: (current: number) => current < 70 ? 0.2 : 0,
    alertness: (current: number) => current < 60 ? 0.2 : 0,
    stimulation: (current: number) => current > 50 ? -0.1 : 0.1
  },
  DANCING: {
    contentment: (current: number) => current < 80 ? 0.5 : 0,
    vitality: (current: number) => current > 20 ? -0.3 : 0,
    stimulation: (current: number) => current < 70 ? 0.4 : 0,
    connection: (current: number) => current < 60 ? 0.2 : 0
  },
  HIDING: {
    alertness: (current: number) => current < 80 ? 0.3 : 0,
    stimulation: (current: number) => current > 30 ? -0.4 : 0,
    contentment: (current: number) => current > 40 ? -0.2 : 0
  },
  WORKING: {
    resources: () => 0.4,
    vitality: () => -0.3,
    stimulation: (current: number) => current < 30 ? 0.2 : current > 70 ? -0.3 : 0,
    contentment: (current: number) => current > 30 && current < 70 ? 0.1 : -0.1
  },
  SHOPPING: {
    resources: (current: number) => current > 80 ? -0.5 : 0,
    contentment: (current: number) => current < 60 ? 0.3 : 0,
    stimulation: (current: number) => current < 50 ? 0.2 : 0
  },
  EXERCISING: {
    vitality: (current: number) => current < 70 ? 0.6 : 0,
    contentment: (current: number) => current < 80 ? 0.3 : 0,
    stimulation: (current: number) => current < 60 ? 0.2 : 0,
    alertness: (current: number) => current < 70 ? 0.4 : 0
  },
  COOKING: {
    nourishment: (current: number) => current < 80 ? 0.7 : 0,
    contentment: (current: number) => current < 60 ? 0.3 : 0,
    stimulation: (current: number) => current < 50 ? 0.2 : 0,
    vitality: () => -0.1
  }
};

// Aplicar efectos de actividad con curvas de eficiencia
export const applyNormalizedActivityEffects = (
  stats: NormalizedStats, 
  activity: EntityActivity, 
  deltaTime: number
): NormalizedStats => {
  const result = { ...stats };
  const timeMultiplier = deltaTime / 1000;
  const effects = ACTIVITY_EFFICIENCY_CURVES[activity] || {};
  
  Object.entries(effects).forEach(([stat, effectFn]) => {
    const currentValue = result[stat as keyof NormalizedStats];
    const effectStrength = effectFn(currentValue);
    const change = effectStrength * timeMultiplier;
    
    result[stat as keyof NormalizedStats] = Math.max(0, Math.min(100, currentValue + change));
  });
  
  return result;
};

// Calcular nivel de estrés basado en desviación del equilibrio
export const calculateStressLevel = (stats: NormalizedStats): number => {
  const deviations = Object.values(stats).map(value => Math.abs(value - 50));
  const averageDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length;
  return Math.min(100, averageDeviation * 2); // 0-100 scale
};

// Calcular urgencia de diferentes actividades basada en estado actual
export const calculateActivityUrgency = (stats: NormalizedStats): Record<EntityActivity, number> => {
  const urgencies: Record<EntityActivity, number> = {
    WANDERING: 0,
    MEDITATING: 0,
    WRITING: 0,
    RESTING: 0,
    SOCIALIZING: 0,
    EXPLORING: 0,
    CONTEMPLATING: 0,
    DANCING: 0,
    HIDING: 0,
    WORKING: 0,
    SHOPPING: 0,
    EXERCISING: 0,
    COOKING: 0
  };
  
  // Urgencias basadas en déficits críticos
  if (stats.vitality < 30) urgencies.RESTING = (30 - stats.vitality) * 2;
  if (stats.alertness < 30) urgencies.RESTING = Math.max(urgencies.RESTING, (30 - stats.alertness) * 1.5);
  if (stats.nourishment < 30) urgencies.CONTEMPLATING = (30 - stats.nourishment) * 1.5;
  if (stats.stimulation < 30) urgencies.EXPLORING = (30 - stats.stimulation) * 1.5;
  if (stats.connection < 30) urgencies.SOCIALIZING = (30 - stats.connection) * 1.8;
  if (stats.contentment < 30) urgencies.MEDITATING = (30 - stats.contentment) * 1.4;
  
  // Reducir urgencias si hay déficits más críticos
  const maxUrgency = Math.max(...Object.values(urgencies));
  if (maxUrgency > 50) {
    // Priorizar solo la urgencia más alta
    Object.keys(urgencies).forEach(activity => {
      if (urgencies[activity as EntityActivity] < maxUrgency * 0.8) {
        urgencies[activity as EntityActivity] *= 0.3;
      }
    });
  }
  
  return urgencies;
};

// Sistema integrado que combina homeostasis + actividades
export const updateNormalizedStats = (
  oldStats: EntityStats,
  activity: EntityActivity,
  deltaTime: number
): Partial<EntityStats> => {
  // 1. Convertir a sistema normalizado
  let normalizedStats = mapOldStatsToNew(oldStats);
  
  // 2. Aplicar homeostasis natural
  normalizedStats = applyHomeostasis(normalizedStats, deltaTime);
  
  // 3. Aplicar efectos de actividad
  normalizedStats = applyNormalizedActivityEffects(normalizedStats, activity, deltaTime);
  
  // 4. Convertir de vuelta al sistema antiguo
  return mapNewStatsToOld(normalizedStats);
};
