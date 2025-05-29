// Configuración simplificada del juego con velocidad global

export interface GameConfig {
  gameSpeedMultiplier: number; // VARIABLE PRINCIPAL - controla toda la velocidad del juego
  debugMode: boolean;
  targetFPS: number;
  movementUpdateFPS: number;
  dialogueDuration: number;
  criticalEventProbability: number;
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

// Configuración principal del juego - TODO SE BASA EN gameSpeedMultiplier
export const gameConfig: GameConfig = {
  gameSpeedMultiplier: getEnvNumber('VITE_GAME_SPEED_MULTIPLIER', 3.0), // 🚀 CONTROL MAESTRO - Más rápido por defecto
  debugMode: getEnvBoolean('VITE_DEBUG_MODE', true), // Debug activado por defecto
  targetFPS: getEnvNumber('VITE_TARGET_FPS', 60),
  movementUpdateFPS: getEnvNumber('VITE_MOVEMENT_UPDATE_FPS', 30),
  dialogueDuration: 2500, // Fijo, no necesita ser configurable
  criticalEventProbability: 0.02 // Fijo, se multiplica por gameSpeedMultiplier donde se usa
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
  console.log(`🎮 Velocidad del juego: ${gameConfig.gameSpeedMultiplier}x`);
};

// Función para aplicar preset de velocidad
export const applySpeedPreset = (presetName: keyof typeof speedPresets) => {
  setGameSpeed(speedPresets[presetName]);
};

// Helper para logging de configuración en modo debug
export const logConfig = () => {
  if (gameConfig.debugMode) {
    console.group('🎮 Game Configuration');
    console.table({
      'Velocidad del Juego': `${gameConfig.gameSpeedMultiplier}x`,
      'FPS Objetivo': gameConfig.targetFPS,
      'FPS Movimiento': gameConfig.movementUpdateFPS,
      'Modo Debug': gameConfig.debugMode ? 'ON' : 'OFF'
    });
    console.groupEnd();
  }
};

// Cálculos derivados basados en gameSpeedMultiplier (intervalos más frecuentes)
export const getGameIntervals = () => ({
  // Todos los intervalos se calculan basándose en la velocidad global
  autopoiesisInterval: 800 / gameConfig.gameSpeedMultiplier,     // Base: 0.8 segundos (más frecuente)
  gameClockInterval: 400 / gameConfig.gameSpeedMultiplier,       // Base: 0.4 segundos (más frecuente)
  zoneEffectsInterval: 1000 / gameConfig.gameSpeedMultiplier,    // Base: 1 segundo (más frecuente)
  entityMovementSpeed: 1.2 * gameConfig.gameSpeedMultiplier,    // Base: 1.2 píxeles por frame (más rápido)
});

// Hacer funciones disponibles globalmente en desarrollo
if (import.meta.env.DEV) {
  (window as any).gameConfig = gameConfig;
  (window as any).setGameSpeed = setGameSpeed;
  (window as any).applySpeedPreset = applySpeedPreset;
  (window as any).speedPresets = speedPresets;
  (window as any).logConfig = logConfig;
}

// Log inicial en modo debug
if (gameConfig.debugMode) {
  logConfig();
}
