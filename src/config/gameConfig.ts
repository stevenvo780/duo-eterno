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
  debugMode: getEnvBoolean('VITE_DEBUG_MODE', true),
  targetFPS: getEnvNumber('VITE_TARGET_FPS', 60),
  movementUpdateFPS: getEnvNumber('VITE_MOVEMENT_UPDATE_FPS', 30),
  dialogueDuration: getEnvNumber('VITE_DIALOGUE_DURATION', 2500),
  criticalEventProbability: 0.02,
  baseDecayMultiplier: getEnvNumber(
    'VITE_STAT_DECAY_SPEED',
    getEnvNumber('VITE_BASE_DECAY_MULTIPLIER', 2.5)
  ),
  zoneEffectivenessMultiplier: getEnvNumber('VITE_ZONE_EFFECTIVENESS_MULTIPLIER', 1.2),
  aiPersonalityInfluence: getEnvNumber('VITE_AI_PERSONALITY_INFLUENCE', 0.3),
  activityInertiaBonus: getEnvNumber('VITE_ACTIVITY_INERTIA_BONUS', 15.0),
  moodInfluenceStrength: getEnvNumber('VITE_MOOD_INFLUENCE_STRENGTH', 0.5),
  entityMovementBaseSpeed: getEnvNumber('VITE_ENTITY_MOVEMENT_SPEED', 2.0)
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
