declare global {
  interface Window {
    gameConfig: GameConfig;
    setGameSpeed: (multiplier: number) => void;
    applySpeedPreset: (presetName: keyof typeof speedPresets) => void;
    speedPresets: typeof speedPresets;
    logConfig: () => void;
  }
}

export interface GameConfig {
  gameSpeedMultiplier: number;
  debugMode: boolean;
  targetFPS: number;
  movementUpdateFPS: number;
  dialogueDuration: number;
  criticalEventProbability: number;
  baseDecayMultiplier: number;
  zoneEffectivenessMultiplier: number;
  aiPersonalityInfluence: number;
  activityInertiaBonus: number;
  moodInfluenceStrength: number;
  entityMovementBaseSpeed: number;
  aiSoftmaxTau: number;
  
  // === CONSTANTES DE ACTIVIDADES ===
  activityEffectivenessMultiplier: number;
  activityImmediateMultiplier: number;
  activityPerMinuteMultiplier: number;
  
  // === CONSTANTES DE SUPERVIVENCIA ===
  survivalLivingCost: number;
  survivalCriticalMoney: number;
  survivalBasicLivingCost: number;
  survivalHungerCostMult: number;
  survivalEnergyCostMult: number;
  survivalPovertyThreshold: number;
  survivalWealthThreshold: number;
  survivalWealthHappinessBonus: number;
  
  // === CONSTANTES DE DECAY HÍBRIDO ===
  decayHungerRate: number;
  decaySleepinessRate: number;
  decayBoredomRate: number;
  decayLonelinessRate: number;
  decayEnergyRate: number;
  decayHappinessRate: number;
  
  // === CONSTANTES DE DECAY BALANCEADO ===
  decayBaseHunger: number;
  decayBaseSleepiness: number;
  decayBaseLoneliness: number;
  decayBaseBoredom: number;
  decayBaseEnergy: number;
  decayBaseHappiness: number;
  decayBaseMoney: number;
  
  // === MULTIPLICADORES DE ACTIVIDADES ===
  activityMultMeditating: number;
  activityMultWriting: number;
  activityMultResting: number;
  activityMultWorking: number;
  activityMultExercising: number;
  activityMultSocializing: number;
  activityMultWandering: number;
  activityMultExploring: number;
  activityMultContemplating: number;
  activityMultDancing: number;
  activityMultHiding: number;
  activityMultShopping: number;
  activityMultCooking: number;
  
  // === CONSTANTES DE RESONANCIA ===
  resonanceBondGainPerSec: number;
  resonanceSeparationDecayPerSec: number;
  resonanceStressDecayPerSec: number;
  resonanceCritical: number;
  resonanceLow: number;
  resonanceGood: number;
  resonanceExcellent: number;
  
  // === UMBRALES CRÍTICOS ===
  thresholdEmergency: number;
  thresholdCritical: number;
  thresholdWarning: number;
  thresholdLow: number;
  thresholdComfortable: number;
  
  // === CONSTANTES DE SALUD ===
  healthDecayPerCritical: number;
  healthRecoveryRate: number;
  
  // === DURACIONES DE ACTIVIDADES ===
  activityDurationWandering: number;
  activityDurationMeditating: number;
  activityDurationWriting: number;
  activityDurationResting: number;
  activityDurationSocializing: number;
  activityDurationExploring: number;
  activityDurationContemplating: number;
  activityDurationDancing: number;
  activityDurationHiding: number;
  activityDurationWorking: number;
  activityDurationShopping: number;
  activityDurationExercising: number;
  activityDurationCooking: number;
  
  // === EFECTOS DE ACTIVIDADES ===
  workingMoneyGain: number;
  workingEnergyCost: number;
  workingBoredomReduction: number;
  workingHungerCost: number;
  restingSleepinessReduction: number;
  restingEnergyGain: number;
  restingHungerCost: number;
  socializingLonelinessReduction: number;
  socializingHappinessGain: number;
  socializingEnergyCost: number;
  socializingHungerCost: number;
  dancingBoredomReduction: number;
  dancingHappinessGain: number;
  dancingEnergyCost: number;
  dancingHungerCost: number;
  exercisingEnergyCost: number;
  exercisingBoredomReduction: number;
  exercisingHappinessGain: number;
  exercisingHungerCost: number;
  meditatingHappinessGain: number;
  meditatingLonelinessCost: number;
  meditatingSleepinessReduction: number;
  meditatingBoredomGain: number;
  
  // === COSTOS DE ACTIVIDADES ===
  activityCostShopping: number;
  activityCostCooking: number;
  
  // === TIMEOUTS ===
  fadingTimeoutMs: number;
  fadingRecoveryThreshold: number;
  
  // === POSICIONES Y VALORES INICIALES ===
  entityCircleInitialX: number;
  entityCircleInitialY: number;
  entitySquareInitialX: number;
  entitySquareInitialY: number;
  entityInitialStats: number;
  entityInitialMoney: number;
  entityInitialHealth: number;
  initialResonance: number;
  
  // === CONSTANTES DE BONDING ===
  bondDistance: number;
  distanceScale: number;
  jointBonusUnit: number;
}

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (value === undefined || value === '') return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = import.meta.env[key];
  if (value === undefined || value === '') return defaultValue;
  return value.toLowerCase() === 'true';
};

export const gameConfig: GameConfig = {
  gameSpeedMultiplier: getEnvNumber('VITE_GAME_SPEED_MULTIPLIER', 1.0),
  debugMode: getEnvBoolean('VITE_DEBUG_MODE', false),
  targetFPS: getEnvNumber('VITE_TARGET_FPS', 60),
  movementUpdateFPS: getEnvNumber('VITE_MOVEMENT_UPDATE_FPS', 30),
  dialogueDuration: getEnvNumber('VITE_DIALOGUE_DURATION', 2500),
  criticalEventProbability: 0.02,
  baseDecayMultiplier: getEnvNumber('VITE_STAT_DECAY_SPEED', 2.5),
  zoneEffectivenessMultiplier: getEnvNumber('VITE_ZONE_EFFECTIVENESS_MULTIPLIER', 1.2),
  aiPersonalityInfluence: getEnvNumber('VITE_AI_PERSONALITY_INFLUENCE', 0.3),
  activityInertiaBonus: getEnvNumber('VITE_ACTIVITY_INERTIA_BONUS', 15.0),
  moodInfluenceStrength: getEnvNumber('VITE_MOOD_INFLUENCE_STRENGTH', 0.5),
  entityMovementBaseSpeed: getEnvNumber('VITE_ENTITY_MOVEMENT_SPEED', 0.8),
  aiSoftmaxTau: getEnvNumber('VITE_AI_SOFTMAX_TAU', 0.9),
  
  // === CONSTANTES DE ACTIVIDADES ===
  activityEffectivenessMultiplier: getEnvNumber('VITE_ACTIVITY_EFFECTIVENESS_MULTIPLIER', 1.3),
  activityImmediateMultiplier: getEnvNumber('VITE_ACTIVITY_IMMEDIATE_MULTIPLIER', 1.5),
  activityPerMinuteMultiplier: getEnvNumber('VITE_ACTIVITY_PER_MINUTE_MULTIPLIER', 1.4),
  
  // === CONSTANTES DE SUPERVIVENCIA ===
  survivalLivingCost: getEnvNumber('VITE_SURVIVAL_LIVING_COST', 1.5),
  survivalCriticalMoney: getEnvNumber('VITE_SURVIVAL_CRITICAL_MONEY', 15),
  survivalBasicLivingCost: getEnvNumber('VITE_SURVIVAL_BASIC_LIVING_COST', 0.8),
  survivalHungerCostMult: getEnvNumber('VITE_SURVIVAL_HUNGER_COST_MULT', 1.2),
  survivalEnergyCostMult: getEnvNumber('VITE_SURVIVAL_ENERGY_COST_MULT', 1.1),
  survivalPovertyThreshold: getEnvNumber('VITE_SURVIVAL_POVERTY_THRESHOLD', 20),
  survivalWealthThreshold: getEnvNumber('VITE_SURVIVAL_WEALTH_THRESHOLD', 150),
  survivalWealthHappinessBonus: getEnvNumber('VITE_SURVIVAL_WEALTH_HAPPINESS_BONUS', 2),
  
  // === CONSTANTES DE DECAY HÍBRIDO ===
  decayHungerRate: getEnvNumber('VITE_DECAY_HUNGER_RATE', 0.25),
  decaySleepinessRate: getEnvNumber('VITE_DECAY_SLEEPINESS_RATE', 0.18),
  decayBoredomRate: getEnvNumber('VITE_DECAY_BOREDOM_RATE', 0.18),
  decayLonelinessRate: getEnvNumber('VITE_DECAY_LONELINESS_RATE', 0.12),
  decayEnergyRate: getEnvNumber('VITE_DECAY_ENERGY_RATE', 0.12),
  decayHappinessRate: getEnvNumber('VITE_DECAY_HAPPINESS_RATE', 0.08),
  
  // === CONSTANTES DE DECAY BALANCEADO ===
  decayBaseHunger: getEnvNumber('VITE_DECAY_BASE_HUNGER', 0.08),
  decayBaseSleepiness: getEnvNumber('VITE_DECAY_BASE_SLEEPINESS', 0.06),
  decayBaseLoneliness: getEnvNumber('VITE_DECAY_BASE_LONELINESS', 0.04),
  decayBaseBoredom: getEnvNumber('VITE_DECAY_BASE_BOREDOM', 0.10),
  decayBaseEnergy: getEnvNumber('VITE_DECAY_BASE_ENERGY', 0.05),
  decayBaseHappiness: getEnvNumber('VITE_DECAY_BASE_HAPPINESS', 0.03),
  decayBaseMoney: getEnvNumber('VITE_DECAY_BASE_MONEY', 0.02),
  
  // === MULTIPLICADORES DE ACTIVIDADES ===
  activityMultMeditating: getEnvNumber('VITE_ACTIVITY_MULT_MEDITATING', 0.3),
  activityMultWriting: getEnvNumber('VITE_ACTIVITY_MULT_WRITING', 0.6),
  activityMultResting: getEnvNumber('VITE_ACTIVITY_MULT_RESTING', 0.2),
  activityMultWorking: getEnvNumber('VITE_ACTIVITY_MULT_WORKING', 1.8),
  activityMultExercising: getEnvNumber('VITE_ACTIVITY_MULT_EXERCISING', 1.5),
  activityMultSocializing: getEnvNumber('VITE_ACTIVITY_MULT_SOCIALIZING', 1.2),
  activityMultWandering: getEnvNumber('VITE_ACTIVITY_MULT_WANDERING', 1.0),
  activityMultExploring: getEnvNumber('VITE_ACTIVITY_MULT_EXPLORING', 1.3),
  activityMultContemplating: getEnvNumber('VITE_ACTIVITY_MULT_CONTEMPLATING', 0.7),
  activityMultDancing: getEnvNumber('VITE_ACTIVITY_MULT_DANCING', 1.2),
  activityMultHiding: getEnvNumber('VITE_ACTIVITY_MULT_HIDING', 0.8),
  activityMultShopping: getEnvNumber('VITE_ACTIVITY_MULT_SHOPPING', 1.2),
  activityMultCooking: getEnvNumber('VITE_ACTIVITY_MULT_COOKING', 1.1),
  
  // === CONSTANTES DE RESONANCIA ===
  resonanceBondGainPerSec: getEnvNumber('VITE_RESONANCE_BOND_GAIN_PER_SEC', 2.2),
  resonanceSeparationDecayPerSec: getEnvNumber('VITE_RESONANCE_SEPARATION_DECAY_PER_SEC', 0.15),
  resonanceStressDecayPerSec: getEnvNumber('VITE_RESONANCE_STRESS_DECAY_PER_SEC', 0.25),
  resonanceCritical: getEnvNumber('VITE_RESONANCE_CRITICAL', 30),
  resonanceLow: getEnvNumber('VITE_RESONANCE_LOW', 50),
  resonanceGood: getEnvNumber('VITE_RESONANCE_GOOD', 70),
  resonanceExcellent: getEnvNumber('VITE_RESONANCE_EXCELLENT', 90),
  
  // === UMBRALES CRÍTICOS ===
  thresholdEmergency: getEnvNumber('VITE_THRESHOLD_EMERGENCY', 5),
  thresholdCritical: getEnvNumber('VITE_THRESHOLD_CRITICAL', 15),
  thresholdWarning: getEnvNumber('VITE_THRESHOLD_WARNING', 30),
  thresholdLow: getEnvNumber('VITE_THRESHOLD_LOW', 50),
  thresholdComfortable: getEnvNumber('VITE_THRESHOLD_COMFORTABLE', 70),
  
  // === CONSTANTES DE SALUD ===
  healthDecayPerCritical: getEnvNumber('VITE_HEALTH_DECAY_PER_CRITICAL', 0.07),
  healthRecoveryRate: getEnvNumber('VITE_HEALTH_RECOVERY_RATE', 0.05),
  
  // === DURACIONES DE ACTIVIDADES ===
  activityDurationWandering: getEnvNumber('VITE_ACTIVITY_DURATION_WANDERING', 15000),
  activityDurationMeditating: getEnvNumber('VITE_ACTIVITY_DURATION_MEDITATING', 30000),
  activityDurationWriting: getEnvNumber('VITE_ACTIVITY_DURATION_WRITING', 45000),
  activityDurationResting: getEnvNumber('VITE_ACTIVITY_DURATION_RESTING', 60000),
  activityDurationSocializing: getEnvNumber('VITE_ACTIVITY_DURATION_SOCIALIZING', 20000),
  activityDurationExploring: getEnvNumber('VITE_ACTIVITY_DURATION_EXPLORING', 25000),
  activityDurationContemplating: getEnvNumber('VITE_ACTIVITY_DURATION_CONTEMPLATING', 35000),
  activityDurationDancing: getEnvNumber('VITE_ACTIVITY_DURATION_DANCING', 20000),
  activityDurationHiding: getEnvNumber('VITE_ACTIVITY_DURATION_HIDING', 10000),
  activityDurationWorking: getEnvNumber('VITE_ACTIVITY_DURATION_WORKING', 120000),
  activityDurationShopping: getEnvNumber('VITE_ACTIVITY_DURATION_SHOPPING', 30000),
  activityDurationExercising: getEnvNumber('VITE_ACTIVITY_DURATION_EXERCISING', 40000),
  activityDurationCooking: getEnvNumber('VITE_ACTIVITY_DURATION_COOKING', 50000),
  
  // === EFECTOS DE ACTIVIDADES ===
  workingMoneyGain: getEnvNumber('VITE_WORKING_MONEY_GAIN', 50),
  workingEnergyCost: getEnvNumber('VITE_WORKING_ENERGY_COST', 8),
  workingBoredomReduction: getEnvNumber('VITE_WORKING_BOREDOM_REDUCTION', 10),
  workingHungerCost: getEnvNumber('VITE_WORKING_HUNGER_COST', 5),
  restingSleepinessReduction: getEnvNumber('VITE_RESTING_SLEEPINESS_REDUCTION', 15),
  restingEnergyGain: getEnvNumber('VITE_RESTING_ENERGY_GAIN', 12),
  restingHungerCost: getEnvNumber('VITE_RESTING_HUNGER_COST', 3),
  socializingLonelinessReduction: getEnvNumber('VITE_SOCIALIZING_LONELINESS_REDUCTION', 20),
  socializingHappinessGain: getEnvNumber('VITE_SOCIALIZING_HAPPINESS_GAIN', 8),
  socializingEnergyCost: getEnvNumber('VITE_SOCIALIZING_ENERGY_COST', 3),
  socializingHungerCost: getEnvNumber('VITE_SOCIALIZING_HUNGER_COST', 2),
  dancingBoredomReduction: getEnvNumber('VITE_DANCING_BOREDOM_REDUCTION', 25),
  dancingHappinessGain: getEnvNumber('VITE_DANCING_HAPPINESS_GAIN', 15),
  dancingEnergyCost: getEnvNumber('VITE_DANCING_ENERGY_COST', 5),
  dancingHungerCost: getEnvNumber('VITE_DANCING_HUNGER_COST', 4),
  exercisingEnergyCost: getEnvNumber('VITE_EXERCISING_ENERGY_COST', 10),
  exercisingBoredomReduction: getEnvNumber('VITE_EXERCISING_BOREDOM_REDUCTION', 8),
  exercisingHappinessGain: getEnvNumber('VITE_EXERCISING_HAPPINESS_GAIN', 6),
  exercisingHungerCost: getEnvNumber('VITE_EXERCISING_HUNGER_COST', 6),
  meditatingHappinessGain: getEnvNumber('VITE_MEDITATING_HAPPINESS_GAIN', 8),
  meditatingLonelinessCost: getEnvNumber('VITE_MEDITATING_LONELINESS_COST', 3),
  meditatingSleepinessReduction: getEnvNumber('VITE_MEDITATING_SLEEPINESS_REDUCTION', 5),
  meditatingBoredomGain: getEnvNumber('VITE_MEDITATING_BOREDOM_GAIN', 3),
  
  // === COSTOS DE ACTIVIDADES ===
  activityCostShopping: getEnvNumber('VITE_ACTIVITY_COST_SHOPPING', 30),
  activityCostCooking: getEnvNumber('VITE_ACTIVITY_COST_COOKING', 15),
  
  // === TIMEOUTS ===
  fadingTimeoutMs: getEnvNumber('VITE_FADING_TIMEOUT_MS', 10000),
  fadingRecoveryThreshold: getEnvNumber('VITE_FADING_RECOVERY_THRESHOLD', 10),
  
  // === POSICIONES Y VALORES INICIALES ===
  entityCircleInitialX: getEnvNumber('VITE_ENTITY_CIRCLE_INITIAL_X', 150),
  entityCircleInitialY: getEnvNumber('VITE_ENTITY_CIRCLE_INITIAL_Y', 200),
  entitySquareInitialX: getEnvNumber('VITE_ENTITY_SQUARE_INITIAL_X', 250),
  entitySquareInitialY: getEnvNumber('VITE_ENTITY_SQUARE_INITIAL_Y', 200),
  entityInitialStats: getEnvNumber('VITE_ENTITY_INITIAL_STATS', 80),
  entityInitialMoney: getEnvNumber('VITE_ENTITY_INITIAL_MONEY', 50),
  entityInitialHealth: getEnvNumber('VITE_ENTITY_INITIAL_HEALTH', 100),
  initialResonance: getEnvNumber('VITE_INITIAL_RESONANCE', 75),
  
  // === CONSTANTES DE BONDING ===
  bondDistance: getEnvNumber('VITE_BOND_DISTANCE', 80),
  distanceScale: getEnvNumber('VITE_DISTANCE_SCALE', 30),
  jointBonusUnit: getEnvNumber('VITE_JOINT_BONUS_UNIT', 0.3)
};

export const speedPresets = {
  'Súper Lento (0.2x)': 0.2,
  'Lento (0.5x)': 0.5,
  'Normal (1x)': 1.0,
  'Rápido (2x)': 2.0,
  'Muy Rápido (3x)': 3.0,
  'Turbo (5x)': 5.0,
  'Hiper (10x)': 10.0
} as const;

export const setGameSpeed = (multiplier: number) => {
  gameConfig.gameSpeedMultiplier = Math.max(0.1, Math.min(20, multiplier));
  import('../utils/logger').then(({ logGeneral }) => {
    logGeneral.info(`Velocidad del juego actualizada: ${gameConfig.gameSpeedMultiplier}x`);
  });
};

const logConfig = () => {
  if (gameConfig.debugMode) {
    import('../utils/logger').then(({ logGeneral }) => {
      logGeneral.info('Configuración del Juego', {
        'Velocidad del Juego': `${gameConfig.gameSpeedMultiplier}x`,
        'FPS Objetivo': gameConfig.targetFPS,
        'FPS Movimiento': gameConfig.movementUpdateFPS,
        'Modo Debug': gameConfig.debugMode ? 'ON' : 'OFF'
      });
    });
  }
};

export const getGameIntervals = () => {
  const overrideClock = getEnvNumber('VITE_GAME_CLOCK_INTERVAL', NaN);
  const overrideAuto = getEnvNumber('VITE_AUTOPOIESIS_INTERVAL', NaN);
  const overrideZone = getEnvNumber('VITE_ZONE_EFFECTS_INTERVAL', NaN);

  return {
    autopoiesisInterval: Number.isFinite(overrideAuto)
      ? overrideAuto
      : Math.max(200, 500 / gameConfig.gameSpeedMultiplier),
    gameClockInterval: Number.isFinite(overrideClock)
      ? overrideClock
      : Math.max(150, 300 / gameConfig.gameSpeedMultiplier),
    zoneEffectsInterval: Number.isFinite(overrideZone)
      ? overrideZone
      : Math.max(100, 200 / gameConfig.gameSpeedMultiplier),
    entityMovementSpeed: gameConfig.entityMovementBaseSpeed * gameConfig.gameSpeedMultiplier
  } as const;
};

if (import.meta.env.DEV) {
  window.gameConfig = gameConfig;
  window.setGameSpeed = setGameSpeed;
  window.speedPresets = speedPresets;
  window.logConfig = logConfig;
}

if (gameConfig.debugMode) {
  logConfig();
}
