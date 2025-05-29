// Configuración del juego basada en variables de entorno
// Permite ajustar velocidades y tiempos para debugging

export interface GameConfig {
  gameSpeedMultiplier: number;
  gameClockInterval: number;
  statDecaySpeed: number;
  autopoiesisInterval: number;
  entityMovementSpeed: number;
  activityChangeFrequency: number;
  zoneEffectsInterval: number;
  targetFPS: number;
  debugMode: boolean;
  dialogueDuration: number;
  criticalEventProbability: number;
  movementUpdateFPS: number;
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

// Configuración principal del juego
export const gameConfig: GameConfig = {
  gameSpeedMultiplier: getEnvNumber('VITE_GAME_SPEED_MULTIPLIER', 1.0),
  gameClockInterval: getEnvNumber('VITE_GAME_CLOCK_INTERVAL', 500),
  statDecaySpeed: getEnvNumber('VITE_STAT_DECAY_SPEED', 1.0),
  autopoiesisInterval: getEnvNumber('VITE_AUTOPOIESIS_INTERVAL', 2000),
  entityMovementSpeed: getEnvNumber('VITE_ENTITY_MOVEMENT_SPEED', 0.8),
  activityChangeFrequency: getEnvNumber('VITE_ACTIVITY_CHANGE_FREQUENCY', 0.15),
  zoneEffectsInterval: getEnvNumber('VITE_ZONE_EFFECTS_INTERVAL', 1000),
  targetFPS: getEnvNumber('VITE_TARGET_FPS', 60),
  debugMode: getEnvBoolean('VITE_DEBUG_MODE', false),
  dialogueDuration: getEnvNumber('VITE_DIALOGUE_DURATION', 2500),
  criticalEventProbability: getEnvNumber('VITE_CRITICAL_EVENT_PROBABILITY', 0.02),
  movementUpdateFPS: getEnvNumber('VITE_MOVEMENT_UPDATE_FPS', 30)
};

// Configuraciones predefinidas para diferentes escenarios
export const debugConfig: Partial<GameConfig> = {
  gameSpeedMultiplier: 3.0,
  gameClockInterval: 200,
  statDecaySpeed: 5.0,
  autopoiesisInterval: 1000,
  activityChangeFrequency: 0.5,
  zoneEffectsInterval: 500,
  debugMode: true,
  dialogueDuration: 1000,
  criticalEventProbability: 0.1
};

export const performanceConfig: Partial<GameConfig> = {
  targetFPS: 30,
  movementUpdateFPS: 20,
  autopoiesisInterval: 3000,
  zoneEffectsInterval: 2000,
  debugMode: false
};

export const productionConfig: Partial<GameConfig> = {
  gameSpeedMultiplier: 1.0,
  gameClockInterval: 1000,
  statDecaySpeed: 1.0,
  autopoiesisInterval: 4000,
  activityChangeFrequency: 0.1,
  targetFPS: 60,
  debugMode: false,
  criticalEventProbability: 0.01
};

// Función para aplicar una configuración específica
export const applyConfig = (config: Partial<GameConfig>): GameConfig => {
  return { ...gameConfig, ...config };
};

// Helper para logging de configuración en modo debug
export const logConfig = () => {
  if (gameConfig.debugMode) {
    console.group('🎮 Game Configuration');
    console.table(gameConfig);
    console.groupEnd();
  }
};

// Función para cambiar configuración en tiempo de ejecución (solo en desarrollo)
export const setDebugMode = (enabled: boolean) => {
  if (import.meta.env.DEV) {
    (gameConfig as any).debugMode = enabled;
    if (enabled) {
      console.log('🐛 Debug mode enabled');
      logConfig();
    }
  }
};

// Función para acelerar el juego temporalmente (solo en desarrollo)
export const setTurboMode = (enabled: boolean) => {
  if (import.meta.env.DEV) {
    if (enabled) {
      Object.assign(gameConfig, debugConfig);
      console.log('🚀 Turbo mode enabled - Game speed increased for testing');
    } else {
      // Reset to original values
      const originalConfig = {
        gameSpeedMultiplier: getEnvNumber('VITE_GAME_SPEED_MULTIPLIER', 1.0),
        gameClockInterval: getEnvNumber('VITE_GAME_CLOCK_INTERVAL', 500),
        statDecaySpeed: getEnvNumber('VITE_STAT_DECAY_SPEED', 1.0),
        autopoiesisInterval: getEnvNumber('VITE_AUTOPOIESIS_INTERVAL', 2000),
        activityChangeFrequency: getEnvNumber('VITE_ACTIVITY_CHANGE_FREQUENCY', 0.15),
        zoneEffectsInterval: getEnvNumber('VITE_ZONE_EFFECTS_INTERVAL', 1000),
        dialogueDuration: getEnvNumber('VITE_DIALOGUE_DURATION', 2500),
        criticalEventProbability: getEnvNumber('VITE_CRITICAL_EVENT_PROBABILITY', 0.02)
      };
      Object.assign(gameConfig, originalConfig);
      console.log('🐌 Normal mode restored');
    }
    logConfig();
  }
};

// Hacer funciones disponibles globalmente en desarrollo
if (import.meta.env.DEV) {
  (window as any).gameConfig = gameConfig;
  (window as any).setDebugMode = setDebugMode;
  (window as any).setTurboMode = setTurboMode;
  (window as any).logConfig = logConfig;
}

// Log inicial en modo debug
if (gameConfig.debugMode) {
  logConfig();
}
