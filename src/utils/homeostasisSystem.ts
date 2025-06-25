/**
 * Sistema Homeostático Normalizado para duo-eterno
 * Todas las estadísticas en escala 0-100 donde 50 es el equilibrio óptimo
 * Diseñado para comportamiento emergente tipo autómata celular
 */

import type { EntityStats, Entity, Position } from '../types';

const BASE_DECAY_RATE = 0.5;

// Función para calcular la distancia entre dos entidades
const calculateDistance = (pos1: Position, pos2: Position): number => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Función para calcular efectos de proximidad/vínculo
const calculateProximityEffects = (
  entity: Entity,
  companion: Entity | null,
  resonance: number
): Partial<EntityStats> => {
  if (!companion || companion.isDead) {
    // Sin compañero vivo: efectos de soledad moderados
    return {
      loneliness: 0.8,     // Aumenta soledad
      happiness: -0.4      // Reduce felicidad
    };
  }

  const distance = calculateDistance(entity.position, companion.position);
  
  // Distancias simplificadas y más claras
  const VERY_CLOSE = 60;    // Muy cerca
  const CLOSE = 120;        // Cerca
  const FAR = 200;          // Lejos
  
  if (distance < VERY_CLOSE) {
    // Muy cerca: efectos positivos fuertes
    const resonanceBonus = Math.max(0.5, resonance / 100);
    return {
      loneliness: -1.5 * resonanceBonus,   // Reduce soledad significativamente
      happiness: 0.8 * resonanceBonus,     // Aumenta felicidad
      energy: 0.4 * resonanceBonus,        // Pequeño boost de energía
      boredom: -0.6 * resonanceBonus       // Reduce aburrimiento
    };
  } else if (distance < CLOSE) {
    // Cerca: efectos positivos moderados
    const resonanceBonus = Math.max(0.3, resonance / 100);
    return {
      loneliness: -0.8 * resonanceBonus,   // Reduce soledad moderadamente
      happiness: 0.4 * resonanceBonus,     // Aumenta felicidad moderadamente
      energy: 0.2 * resonanceBonus         // Pequeño boost de energía
    };
  } else if (distance > FAR) {
    // Lejos: efectos negativos por separación
    return {
      loneliness: 1.2,     // Aumenta soledad notablemente
      happiness: -0.6,     // Reduce felicidad
      energy: -0.3         // Reduce energía ligeramente
    };
  }
  
  // Distancia intermedia: efectos neutros
  return {
    loneliness: 0.1,   // Cambio mínimo
    happiness: -0.05   // Cambio mínimo
  };
};

export const applyHomeostasis = (
  stats: EntityStats,
  deltaTime: number = 1
): EntityStats => {
  const decay = BASE_DECAY_RATE;

  // Aplicar cambios graduales y pequeños para evitar saltos bruscos
  const decayRate = decay * deltaTime * 0.1; // Reducir la velocidad de cambio

  return {
    hunger: Math.max(0, Math.min(100, stats.hunger + decayRate)),
    sleepiness: Math.max(0, Math.min(100, stats.sleepiness + decayRate)),
    loneliness: Math.max(0, Math.min(100, stats.loneliness + decayRate)),
    boredom: Math.max(0, Math.min(100, stats.boredom + decayRate)),
    energy: Math.max(0, Math.min(100, stats.energy - decayRate)),
    happiness: Math.max(0, Math.min(100, stats.happiness - decayRate * 0.3)),
    money: stats.money,
    health: stats.health
  };
};

// Nueva función unificada que combina todos los efectos de manera controlada
export const applyUnifiedHomeostasis = (
  entity: Entity,
  companion: Entity | null,
  resonance: number,
  currentZone: { effects?: Record<string, number> } | null,
  deltaTime: number = 1
): EntityStats => {
  const newStats = { ...entity.stats };
  
  // 1. Aplicar decay natural muy gradual (reducido para dar más protagonismo a otros efectos)
  const decay = BASE_DECAY_RATE;
  
  const decayRate = decay * deltaTime * 0.15; // Reducido de 0.2 a 0.15 para menos decay natural
  
  newStats.hunger = Math.max(0, Math.min(100, newStats.hunger + decayRate));
  newStats.sleepiness = Math.max(0, Math.min(100, newStats.sleepiness + decayRate));
  newStats.loneliness = Math.max(0, Math.min(100, newStats.loneliness + decayRate));
  newStats.boredom = Math.max(0, Math.min(100, newStats.boredom + decayRate));
  newStats.energy = Math.max(0, Math.min(100, newStats.energy - decayRate));
  newStats.happiness = Math.max(0, Math.min(100, newStats.happiness - decayRate * 0.3));
  
  // 2. Aplicar efectos de proximidad (más fuertes)
  const proximityEffects = calculateProximityEffects(entity, companion, resonance);
  Object.entries(proximityEffects).forEach(([stat, effect]) => {
    const statKey = stat as keyof EntityStats;
    if (typeof effect === 'number' && statKey !== 'money') {
      const limitedEffect = Math.max(-3.0, Math.min(3.0, effect * deltaTime)); // Aumentado el límite
      newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + limitedEffect));
    }
  });
  
  // 3. Aplicar efectos de zona (más significativos)
  if (currentZone && currentZone.effects) {
    Object.entries(currentZone.effects).forEach(([stat, baseValue]) => {
      const statKey = stat as keyof EntityStats;
      if (statKey !== 'money' && typeof baseValue === 'number') {
        // Efectos de zona más significativos
        const zoneEffect = baseValue * 0.25 * deltaTime; // Aumentado de 0.08 a 0.25 para efectos más notorios
        newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + zoneEffect));
      } else if (statKey === 'money' && typeof baseValue === 'number') {
        const moneyGain = baseValue * 0.15 * deltaTime; // También aumentado para dinero
        newStats.money += moneyGain;
      }
    });
  }
  
  return newStats;
};
