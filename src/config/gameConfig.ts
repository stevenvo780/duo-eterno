// Mover declaración global al inicio del archivo
declare global {
  interface Window {
    gameConfig: GameConfig;
    setGameSpeed: (multiplier: number) => void;
    applySpeedPreset: (presetName: keyof typeof speedPresets) => void;
    speedPresets: typeof speedPresets;
    logConfig: () => void;
  }
}

// Configuración completa del juego con equilibrio y velocidad global
export interface GameConfig {
  gameSpeedMultiplier: number; // VARIABLE PRINCIPAL - controla toda la velocidad del juego
  debugMode: boolean;
  targetFPS: number;
  movementUpdateFPS: number;
  dialogueDuration: number;
  criticalEventProbability: number;
  // Nuevas configuraciones de equilibrio
  baseDecayMultiplier: number;
  zoneEffectivenessMultiplier: number;
  aiPersonalityInfluence: number;
  activityInertiaBonus: number;
  moodInfluenceStrength: number;
}

// Función helper para parsear variables de entorno
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

// Configuración principal del juego - Basado en gameSpeedMultiplier
export const gameConfig: GameConfig = {
  gameSpeedMultiplier: getEnvNumber('VITE_GAME_SPEED_MULTIPLIER', 3.0), // 🚀 CONTROL MAESTRO - Más rápido por defecto
  debugMode: getEnvBoolean('VITE_DEBUG_MODE', true), // Debug activado por defecto
  targetFPS: getEnvNumber('VITE_TARGET_FPS', 60),
  movementUpdateFPS: getEnvNumber('VITE_MOVEMENT_UPDATE_FPS', 30),
  dialogueDuration: 2500, // Fijo, no necesita ser configurable
  criticalEventProbability: 0.02, // Fijo, se multiplica por gameSpeedMultiplier donde se usa
  // Nuevas configuraciones de equilibrio
  baseDecayMultiplier: getEnvNumber('VITE_BASE_DECAY_MULTIPLIER', 1.0),
  zoneEffectivenessMultiplier: getEnvNumber('VITE_ZONE_EFFECTIVENESS_MULTIPLIER', 1.0),
  aiPersonalityInfluence: getEnvNumber('VITE_AI_PERSONALITY_INFLUENCE', 0.3),
  activityInertiaBonus: getEnvNumber('VITE_ACTIVITY_INERTIA_BONUS', 15.0),
  moodInfluenceStrength: getEnvNumber('VITE_MOOD_INFLUENCE_STRENGTH', 0.5)
};

// Configuraciones predefinidas
export const speedPresets = {
  'Súper Lento (0.2x)': 0.2,
  'Lento (0.5x)': 0.5,
  'Normal (1x)': 1.0,
  'Rápido (2x)': 2.0,
  'Muy Rápido (3x)': 3.0,
  'Turbo (5x)': 5.0,
  'Hiper (10x)': 10.0
} as const;

// Función para cambiar velocidad en tiempo real
export const setGameSpeed = (multiplier: number) => {
  gameConfig.gameSpeedMultiplier = Math.max(0.1, Math.min(20, multiplier));
  // Importación lazy para evitar dependencias circulares
  import('../utils/logger').then(({ logGeneral }) => {
    logGeneral.info(`Velocidad del juego actualizada: ${gameConfig.gameSpeedMultiplier}x`);
  });
};

// Función para aplicar preset de velocidad
export const applySpeedPreset = (presetName: keyof typeof speedPresets) => {
  setGameSpeed(speedPresets[presetName]);
};

// Helper para logging de configuración en modo debug
export const logConfig = () => {
  if (gameConfig.debugMode) {
    // Importación lazy para evitar dependencias circulares
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

// Cálculos derivados basados en gameSpeedMultiplier (intervalos más frecuentes)
export const getGameIntervals = () => ({
  // Intervalos más agresivos para ver cambios inmediatos
  autopoiesisInterval: Math.max(200, 500 / gameConfig.gameSpeedMultiplier),     // Base: 0.5s, mínimo 200ms
  gameClockInterval: Math.max(150, 300 / gameConfig.gameSpeedMultiplier),       // Base: 0.3s, mínimo 150ms  
  zoneEffectsInterval: Math.max(100, 200 / gameConfig.gameSpeedMultiplier),     // Base: 0.2s, mínimo 100ms
  entityMovementSpeed: 2.0 * gameConfig.gameSpeedMultiplier,                   // Movimiento más rápido
});

// Hacer funciones disponibles globalmente en desarrollo
if (import.meta.env.DEV) {
  window.gameConfig = gameConfig;
  window.setGameSpeed = setGameSpeed;
  window.applySpeedPreset = applySpeedPreset;
  window.speedPresets = speedPresets;
  window.logConfig = logConfig;
}

// Log inicial en modo debug
if (gameConfig.debugMode) {
  logConfig();
}
