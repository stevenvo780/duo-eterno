/**
 * 🛡️ GESTIÓN ROBUSTA DE ESTADOS
 *
 * Sistema mejorado para manejo de estados de entidades que corrige:
 * - Validación insuficiente de stats
 * - Money negativo y otros edge cases
 * - Inconsistencias en actualizaciones de estado
 * - Problemas de división por cero
 */

import type { EntityStats } from '../types';
import { SURVIVAL } from '../constants';
import { fixedMathUtils } from './fixedMathPrecision';

/**
 * Configuración de validación para cada stat
 */
const STAT_VALIDATION_CONFIG = {
  hunger: { min: 0, max: 100, default: 50, allowNegative: false },
  sleepiness: { min: 0, max: 100, default: 50, allowNegative: false },
  loneliness: { min: 0, max: 100, default: 50, allowNegative: false },
  happiness: { min: 0, max: 100, default: 50, allowNegative: false },
  energy: { min: 0, max: 100, default: 50, allowNegative: false },
  boredom: { min: 0, max: 100, default: 50, allowNegative: false },
  money: { min: 0, max: 10000, default: 50, allowNegative: false },
  health: { min: 0, max: 100, default: 100, allowNegative: false }
} as const;

/**
 * Valida y corrige un valor de stat individual
 */
export function validateAndFixStat(
  statName: keyof EntityStats,
  value: unknown,
  context: string = 'unknown'
): number {
  const config = STAT_VALIDATION_CONFIG[statName];
  if (!config) {
    console.error(
      `🚨 No hay config para stat: ${statName}. Stats válidos:`,
      Object.keys(STAT_VALIDATION_CONFIG)
    );
    return 50;
  }

  let numValue: number;

  if (typeof value === 'number') {
    numValue = value;
  } else if (typeof value === 'string') {
    numValue = parseFloat(value);
  } else {
    console.warn(`🛡️ Valor inválido para ${statName} en ${context}: ${value}, usando default`);
    return config.default;
  }

  if (
    !fixedMathUtils.validateNumber(numValue, `${statName}@${context}`, {
      allowNegative: config.allowNegative,
      maxAbsValue: config.max * 2
    })
  ) {
    console.warn(`🛡️ Stat ${statName} falló validación en ${context}, corrigiendo`);
    numValue = config.default;
  }

  const clampedValue = fixedMathUtils.safeClamp(numValue, config.min, config.max);

  if (Math.abs(clampedValue - numValue) > 0.01) {
    console.info(`🛡️ Stat ${statName} corregido: ${numValue} → ${clampedValue} en ${context}`);
  }

  return fixedMathUtils.preciseRound(clampedValue, 2);
}

/**
 * Valida y corrige un objeto completo de stats
 */
export function validateAndFixStats(
  stats: Partial<EntityStats>,
  context: string = 'unknown'
): EntityStats {
  const fixedStats: EntityStats = {
    hunger: validateAndFixStat('hunger', stats.hunger, context),
    sleepiness: validateAndFixStat('sleepiness', stats.sleepiness, context),
    loneliness: validateAndFixStat('loneliness', stats.loneliness, context),
    happiness: validateAndFixStat('happiness', stats.happiness, context),
    energy: validateAndFixStat('energy', stats.energy, context),
    boredom: validateAndFixStat('boredom', stats.boredom, context),
    money: validateAndFixStat('money', stats.money, context),
    health: validateAndFixStat('health', stats.health, context)
  };

  validateStatsCoherence(fixedStats, context);

  return fixedStats;
}

/**
 * Valida coherencia entre stats (reglas de negocio)
 */
function validateStatsCoherence(stats: EntityStats, context: string): void {
  const warnings: string[] = [];

  if (stats.health < 20 && (stats.energy > 80 || stats.happiness > 80)) {
    warnings.push('health muy baja con energy/happiness altos');
  }

  if (stats.money > 500 && stats.hunger > 80) {
    warnings.push('money alto pero hunger alta (debería poder comprar comida)');
  }

  if (stats.energy < 20 && stats.sleepiness < 20) {
    warnings.push('energy baja pero no tiene sueño');
  }

  if (warnings.length > 0) {
    console.info(`🛡️ Incoherencias detectadas en stats (${context}):`, warnings);
  }
}

/**
 * Aplica un cambio de stat de manera segura
 */
export function applyStatChange(
  currentStats: EntityStats,
  statName: keyof EntityStats,
  change: number,
  context: string = 'unknown'
): EntityStats {
  const config = STAT_VALIDATION_CONFIG[statName];
  if (!config) {
    console.error(
      `🚨 No hay config para stat: ${statName}. Stats válidos:`,
      Object.keys(STAT_VALIDATION_CONFIG)
    );
    return currentStats;
  }

  const currentValue = currentStats[statName];

  if (typeof currentValue !== 'number') {
    console.warn(
      `🛡️ Stat ${statName} no existe en currentStats o no es número: ${currentValue}, usando default`
    );

    const newStats = { ...currentStats };
    (newStats as Record<string, number>)[statName as keyof EntityStats] = config.default;
    return newStats;
  }

  if (!fixedMathUtils.validateNumber(change, `change_${statName}@${context}`)) {
    console.warn(`🛡️ Cambio inválido para ${statName}: ${change}, ignorando`);
    return currentStats;
  }

  const rawNewValue = currentValue + change;
  const newValue = validateAndFixStat(statName, rawNewValue, `apply_${context}`);

  const newStats = { ...currentStats };
  (newStats as Record<string, number>)[statName as keyof EntityStats] = newValue;

  if (Math.abs(change) > 1) {
    console.debug(`🛡️ Stat change ${statName}: ${currentValue} + ${change} = ${newValue}`);
  }

  return newStats;
}

/**
 * Aplica múltiples cambios de stats de manera atómica
 */
export function applyMultipleStatChanges(
  currentStats: EntityStats,
  changes: Partial<Record<keyof EntityStats, number>>,
  context: string = 'unknown'
): EntityStats {
  let workingStats = { ...currentStats };

  for (const [statName, change] of Object.entries(changes) as Array<[keyof EntityStats, number]>) {
    if (change !== undefined && change !== null) {
      workingStats = applyStatChange(workingStats, statName, change, `multi_${context}`);
    }
  }

  return validateAndFixStats(workingStats, `final_${context}`);
}

/**
 * Calcula el nivel de supervivencia de manera robusta
 */
export function calculateSurvivalLevel(stats: EntityStats): {
  level: 'OPTIMAL' | 'COMFORTABLE' | 'LOW' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  score: number;
  criticalStats: string[];
} {
  const validStats = validateAndFixStats(stats, 'survival_calculation');

  const criticalStats: string[] = [];
  let totalCriticalPressure = 0;

  const survivalStats = {
    hunger: validStats.hunger,
    sleepiness: validStats.sleepiness,
    energy: validStats.energy,
    health: validStats.health
  };

  for (const [statName, value] of Object.entries(survivalStats)) {
    const threshold =
      SURVIVAL.CRITICAL_THRESHOLDS[
        statName.toUpperCase() as keyof typeof SURVIVAL.CRITICAL_THRESHOLDS
      ] || 80;
    if (value > threshold) {
      criticalStats.push(statName);

      totalCriticalPressure += Math.pow((value - 80) / (100 - 80), 2);
    }
  }

  const avgSurvivalStat =
    Object.values(survivalStats).reduce((sum, val) => sum + val, 0) /
    Object.keys(survivalStats).length;
  const pressurePenalty = Math.min(totalCriticalPressure * 20, 50);
  const score = Math.max(0, 100 - avgSurvivalStat - pressurePenalty);

  let level: ReturnType<typeof calculateSurvivalLevel>['level'];

  if (score < 5) level = 'EMERGENCY';
  else if (score < 15) level = 'CRITICAL';
  else if (score < 30) level = 'WARNING';
  else if (score < 50) level = 'LOW';
  else if (score < 70) level = 'COMFORTABLE';
  else level = 'OPTIMAL';

  return {
    level,
    score: fixedMathUtils.preciseRound(score, 1),
    criticalStats
  };
}

/**
 * Calcula efectividad de zona de manera segura
 */
export function calculateZoneEffectiveness(
  entityStats: EntityStats,
  zoneType: string,
  baseEffectiveness: number = 1.0
): number {
  const validStats = validateAndFixStats(entityStats, 'zone_effectiveness');

  const zoneStatMap: Record<string, keyof EntityStats> = {
    food: 'hunger',
    rest: 'sleepiness',
    play: 'boredom',
    social: 'loneliness',
    comfort: 'happiness',
    energy: 'energy',
    work: 'money'
  };

  const relevantStat = zoneStatMap[zoneType];
  if (!relevantStat) {
    console.warn(`🛡️ Tipo de zona desconocido: ${zoneType}, usando efectividad base`);
    return baseEffectiveness;
  }

  const statValue = validStats[relevantStat];

  const needFactor = Math.sqrt(statValue / 100);
  const effectiveness = baseEffectiveness * (0.5 + needFactor * 0.5);

  return fixedMathUtils.preciseRound(fixedMathUtils.safeClamp(effectiveness, 0.1, 3.0), 3);
}

/**
 * Calcula prioridad de actividad de manera robusta
 */
export function calculateActivityPriority(
  entityStats: EntityStats,
  activity: string,
  timeSinceLastChange: number = 0
): number {
  const validStats = validateAndFixStats(entityStats, 'activity_priority');

  const activityStatMap: Record<string, Partial<Record<keyof EntityStats, number>>> = {
    WORKING: { money: 0.8, boredom: -0.3, energy: -0.4 },
    RESTING: { sleepiness: -0.7, energy: 0.6, health: 0.2 },
    SOCIALIZING: { loneliness: -0.8, happiness: 0.4 },
    EATING: { hunger: -0.9 },
    EXERCISING: { energy: -0.3, boredom: -0.4, happiness: 0.3 },
    MEDITATING: { happiness: 0.5, sleepiness: -0.2, loneliness: 0.1 }
  };

  const activityEffects = activityStatMap[activity];
  if (!activityEffects) {
    return 50;
  }

  let totalPriority = 0;
  let effectCount = 0;

  for (const [statName, effect] of Object.entries(activityEffects) as Array<
    [keyof EntityStats, number]
  >) {
    const statValue = validStats[statName];

    let benefitScore: number;

    if (effect > 0) {
      benefitScore = (100 - statValue) * effect;
    } else {
      benefitScore = statValue * Math.abs(effect);
    }

    totalPriority += benefitScore;
    effectCount++;
  }

  let priority = effectCount > 0 ? totalPriority / effectCount : 50;

  const timeFactorMs = 10000;
  const timeFactor = Math.min(timeSinceLastChange / timeFactorMs, 1.0);
  priority *= 0.5 + timeFactor * 0.5;

  return fixedMathUtils.preciseRound(fixedMathUtils.safeClamp(priority, 0, 100), 2);
}

/**
 * Crea stats iniciales seguros para una nueva entidad
 */
export function createInitialStats(overrides: Partial<EntityStats> = {}): EntityStats {
  const baseStats: EntityStats = {
    hunger: 20,
    sleepiness: 30,
    loneliness: 40,
    happiness: 60,
    energy: 70,
    boredom: 35,
    money: 50,
    health: 90
  };

  const statsWithOverrides = { ...baseStats, ...overrides };
  return validateAndFixStats(statsWithOverrides, 'initial_creation');
}

/**
 * Clona stats de manera segura
 */
export function cloneStats(stats: EntityStats): EntityStats {
  return validateAndFixStats({ ...stats }, 'clone_operation');
}

/**
 * Compara dos sets de stats y retorna las diferencias significativas
 */
export function compareStats(
  before: EntityStats,
  after: EntityStats,
  threshold: number = 1.0
): Array<{ stat: keyof EntityStats; before: number; after: number; change: number }> {
  const differences: ReturnType<typeof compareStats> = [];

  for (const statName of Object.keys(before) as Array<keyof EntityStats>) {
    const beforeValue = before[statName];
    const afterValue = after[statName];
    const change = afterValue - beforeValue;

    if (Math.abs(change) >= threshold) {
      differences.push({
        stat: statName,
        before: beforeValue,
        after: afterValue,
        change: fixedMathUtils.preciseRound(change, 2)
      });
    }
  }

  return differences;
}

export const robustStateUtils = {
  validateAndFixStat,
  validateAndFixStats,
  applyStatChange,
  applyMultipleStatChanges,
  calculateSurvivalLevel,
  calculateZoneEffectiveness,
  calculateActivityPriority,
  createInitialStats,
  cloneStats,
  compareStats
} as const;
