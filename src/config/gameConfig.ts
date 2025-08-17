/**
 * 🎮 CONFIGURACIÓN ÚNICA DEL JUEGO - CONSOLIDADA
 * 
 * Fuente única de verdad que reemplaza:
 * ❌ balancedGameplay.ts
 * ❌ unifiedGameConfig.ts (parcialmente)
 * ❌ Múltiples archivos de constantes duplicados
 * 
 * Organizada por categorías lógicas para máximo mantenimiento
 */

import { TIMING, SURVIVAL, PHYSICS } from '../constants';

// === TIPOS CONSOLIDADOS ===

export interface GameConfig {
  // === CORE SISTEMA ===
  gameSpeedMultiplier: number;
  debugMode: boolean;
  targetFPS: number;
  
  // === TIMING UNIFICADO ===
  timing: {
    mainGameLogic: number;
    degradation: number;
    batchFlush: number;
    cleanup: number;
    gameSpeedMultiplier: number;
  };
  
  // === SUPERVIVENCIA BALANCEADA ===
  survival: {
    degradationRates: {
      hunger: number;
      energy: number;
      happiness: number;
      sleepiness: number;
      boredom: number;
      loneliness: number;
    };
    criticalThresholds: {
      hunger: number;
      energy: number;
      health: number;
    };
    livingCosts: {
      basic: number;
      activity: number;
      luxury: number;
    };
    recovery: {
      restingBonus: number;
      eatingEfficiency: number;
      socialBonus: number;
    };
  };
  
  // === MOVIMIENTO Y FÍSICA ===
  movement: {
    baseSpeed: number;
    maxSpeed: number;
    acceleration: number;
    friction: number;
    avoidanceDistance: number;
    wanderRadius: number;
  };
  
  // === RESONANCIA Y SOCIABILIDAD ===
  resonance: {
    maxDistance: number;
    decayRate: number;
    harmonyBonus: number;
    activitySyncBonus: number;
    proximityWeight: number;
  };
  
  // === AI Y DECISIONES ===
  ai: {
    personalityInfluence: number;
    activityInertiaBonus: number;
    moodInfluenceStrength: number;
    softmaxTau: number;
    decisionChangeThreshold: number;
  };
  
  // === EFECTOS DE ZONA ===
  zones: {
    effectivenessMultiplier: number;
    transitionSmoothness: number;
    bonusDecayRate: number;
  };
  
  // === UI Y EXPERIENCIA ===
  ui: {
    dialogueDuration: number;
    animationSpeed: number;
    maxLogEntries: number;
    statUpdateFrequency: number;
  };
  
  // === PERFORMANCE ===
  performance: {
    maxEntities: number;
    cullingDistance: number;
    batchSize: number;
    throttleThreshold: number;
  };

  // === INICIALIZACIÓN DE ENTIDADES ===
  entityCircleInitialX: number;
  entityCircleInitialY: number;
  entitySquareInitialX: number;
  entitySquareInitialY: number;
  entityInitialStats: number;
  entityInitialMoney: number;
  entityInitialHealth: number;
  initialResonance: number;

  // === THRESHOLD CONFIGURATIONS ===
  thresholdLow: number;
  thresholdComfortable: number;
  thresholdWarning: number;

  // === ZONE CONFIGURATIONS ===
  zoneEffectivenessMultiplier: number;

  // === AI CONFIGURATIONS ===
  activityInertiaBonus: number;
  aiPersonalityInfluence: number;
  moodInfluenceStrength: number;
  aiSoftmaxTau: number;
}

// === CONFIGURACIONES POR PRESET ===

const baseConfig: GameConfig = {
  // === CORE SISTEMA ===
  gameSpeedMultiplier: 1.0,
  debugMode: false,
  targetFPS: 60,
  
  // === TIMING UNIFICADO ===
  timing: {
    mainGameLogic: TIMING.MAIN_GAME_LOGIC, // 800ms
    degradation: TIMING.DEGRADATION_UPDATE, // 2000ms
    batchFlush: 100,
    cleanup: 60000,
    gameSpeedMultiplier: 1.0,
  },
  
  // === SUPERVIVENCIA BALANCEADA ===
  survival: {
    degradationRates: {
      hunger: SURVIVAL.DEGRADATION_RATES.HUNGER, // 0.08/s
      energy: SURVIVAL.DEGRADATION_RATES.ENERGY, // 0.05/s
      happiness: SURVIVAL.DEGRADATION_RATES.HAPPINESS, // 0.03/s
      sleepiness: SURVIVAL.DEGRADATION_RATES.SLEEPINESS, // 0.04/s
      boredom: SURVIVAL.DEGRADATION_RATES.BOREDOM, // 0.06/s
      loneliness: SURVIVAL.DEGRADATION_RATES.LONELINESS, // 0.02/s
    },
    criticalThresholds: {
      hunger: SURVIVAL.CRITICAL_THRESHOLDS.HUNGER, // 20
      energy: SURVIVAL.CRITICAL_THRESHOLDS.ENERGY, // 15
      health: SURVIVAL.CRITICAL_THRESHOLDS.HEALTH, // 10
    },
    livingCosts: {
      basic: SURVIVAL.LIVING_COSTS.BASIC, // 1.5/min
      activity: SURVIVAL.LIVING_COSTS.ACTIVITY, // 0.5/min
      luxury: SURVIVAL.LIVING_COSTS.LUXURY, // 2.0/min
    },
    recovery: {
      restingBonus: 1.8,
      eatingEfficiency: 2.5,
      socialBonus: 1.6,
    },
  },
  
  // === MOVIMIENTO Y FÍSICA ===
  movement: {
    baseSpeed: PHYSICS.BASE_MOVEMENT_SPEED, // 84
    maxSpeed: PHYSICS.MAX_SPEED, // 120
    acceleration: PHYSICS.ACCELERATION, // 50
    friction: PHYSICS.FRICTION, // 0.85
    avoidanceDistance: 60,
    wanderRadius: 100,
  },
  
  // === RESONANCIA Y SOCIABILIDAD ===
  resonance: {
    maxDistance: 400,
    decayRate: 0.02,
    harmonyBonus: 1.2,
    activitySyncBonus: 1.15,
    proximityWeight: 0.6,
  },
  
  // === AI Y DECISIONES ===
  ai: {
    personalityInfluence: 0.3,
    activityInertiaBonus: 1.2,
    moodInfluenceStrength: 0.8,
    softmaxTau: 0.5,
    decisionChangeThreshold: 0.15,
  },
  
  // === EFECTOS DE ZONA ===
  zones: {
    effectivenessMultiplier: 1.5,
    transitionSmoothness: 0.1,
    bonusDecayRate: 0.05,
  },
  
  // === UI Y EXPERIENCIA ===
  ui: {
    dialogueDuration: 3000,
    animationSpeed: 1.0,
    maxLogEntries: 100,
    statUpdateFrequency: 500,
  },
  
  // === PERFORMANCE ===
  performance: {
    maxEntities: 10,
    cullingDistance: 1000,
    batchSize: 20,
    throttleThreshold: 16.67,
  },

  // === INICIALIZACIÓN DE ENTIDADES ===
  entityCircleInitialX: 200,
  entityCircleInitialY: 200,
  entitySquareInitialX: 600,
  entitySquareInitialY: 300,
  entityInitialStats: 50,
  entityInitialMoney: 50,
  entityInitialHealth: 90,
  initialResonance: 0,

  // === THRESHOLD CONFIGURATIONS ===
  thresholdLow: 30,
  thresholdComfortable: 70,
  thresholdWarning: 25,

  // === ZONE CONFIGURATIONS ===
  zoneEffectivenessMultiplier: 1.5,

  // === AI CONFIGURATIONS ===
  activityInertiaBonus: 1.2,
  aiPersonalityInfluence: 0.3,
  moodInfluenceStrength: 0.8,
  aiSoftmaxTau: 0.5,
};

// === PRESETS ESPECÍFICOS ===

export const gamePresets = {
  development: {
    ...baseConfig,
    debugMode: true,
    gameSpeedMultiplier: 2.0,
    timing: {
      ...baseConfig.timing,
      gameSpeedMultiplier: 2.0,
      mainGameLogic: 400, // Más rápido para testing
    },
    ui: {
      ...baseConfig.ui,
      dialogueDuration: 1000, // Diálogos más rápidos
    },
  },
  
  production: {
    ...baseConfig,
    debugMode: false,
    gameSpeedMultiplier: 1.0,
    performance: {
      ...baseConfig.performance,
      maxEntities: 4, // Conservativo para producción
      batchSize: 15,
    },
  },
  
  testing: {
    ...baseConfig,
    debugMode: true,
    gameSpeedMultiplier: 10.0, // Super fast para tests
    timing: {
      ...baseConfig.timing,
      gameSpeedMultiplier: 10.0,
      mainGameLogic: 100,
      degradation: 200,
    },
    survival: {
      ...baseConfig.survival,
      degradationRates: {
        ...baseConfig.survival.degradationRates,
        hunger: 0.8,  // 10x más rápido
        energy: 0.5,
        happiness: 0.3,
        sleepiness: 0.4,
        boredom: 0.6,
        loneliness: 0.2,
      },
    },
  },
  
  performance: {
    ...baseConfig,
    debugMode: false,
    timing: {
      ...baseConfig.timing,
      mainGameLogic: 1200, // Más lento para performance
      batchFlush: 200,
    },
    performance: {
      ...baseConfig.performance,
      maxEntities: 2, // Máximo performance
      batchSize: 10,
    },
  },
  
  presentation: {
    ...baseConfig,
    gameSpeedMultiplier: 1.5,
    timing: {
      ...baseConfig.timing,
      gameSpeedMultiplier: 1.5,
    },
    ui: {
      ...baseConfig.ui,
      animationSpeed: 1.3, // Más dinámico para demos
      dialogueDuration: 2000,
    },
    resonance: {
      ...baseConfig.resonance,
      harmonyBonus: 1.4, // Más espectacular
      activitySyncBonus: 1.3,
    },
  },
} as const;

// === CONFIGURACIÓN ACTIVA ===

let activeConfig: GameConfig = gamePresets.development;

// Detección automática del entorno
if (import.meta.env.PROD) {
  activeConfig = gamePresets.production;
} else if (import.meta.env.MODE === 'test') {
  activeConfig = gamePresets.testing;
}

// === API PÚBLICA ===

export const getGameConfig = (): GameConfig => ({
  ...activeConfig,
});

export const setGameConfig = (config: Partial<GameConfig>): void => {
  activeConfig = { ...activeConfig, ...config };
  
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.log('🎮 Game Config Updated', config);
    window.gameConfig = activeConfig;
  }
};

export const loadPreset = (presetName: keyof typeof gamePresets): void => {
  activeConfig = { ...gamePresets[presetName] };
  
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.log(`🎮 Loaded preset: ${presetName}`);
    window.gameConfig = activeConfig;
  }
};

export const getGameIntervals = () => ({
  main: activeConfig.timing.mainGameLogic,
  degradation: activeConfig.timing.degradation,
  movement: Math.floor(1000 / activeConfig.targetFPS),
  ui: activeConfig.ui.statUpdateFrequency,
  entityMovementSpeed: 2.0, // Velocidad base de movimiento de entidades
  zoneEffectsInterval: 1000, // Zone effects update interval
});

// === UTILIDADES PARA RETROCOMPATIBILIDAD ===

export const gameConfig = getGameConfig();

// Actualizar referencia cuando cambie la configuración
export const updateGameConfig = () => {
  const newConfig = getGameConfig();
  Object.assign(gameConfig, newConfig);
};

// Auto-detección de performance del dispositivo
if (typeof window !== 'undefined') {
  const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                  ((navigator as unknown as { deviceMemory?: number })?.deviceMemory || 4) <= 2;
  
  if (isLowEnd && import.meta.env.PROD) {
    loadPreset('performance');
  }
}

// === DEBUG UTILITIES ===

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.gameConfig = activeConfig;
  window.setGameSpeed = (multiplier: number) => {
    setGameConfig({
      gameSpeedMultiplier: multiplier,
      timing: { ...activeConfig.timing, gameSpeedMultiplier: multiplier }
    });
  };
  
  (window as { speedPresets?: Record<string, number> }).speedPresets = {
    ultraSlow: 0.1,
    slow: 0.5,
    normal: 1.0,
    fast: 2.0,
    ultraFast: 5.0,
    instant: 20.0,
  };
  
  (window as { applySpeedPreset?: (name: string) => void; speedPresets?: Record<string, number>; setGameSpeed?: (speed: number) => void }).applySpeedPreset = (presetName: string) => {
    const windowTyped = window as { speedPresets?: Record<string, number>; setGameSpeed?: (speed: number) => void };
    const speed = windowTyped.speedPresets?.[presetName];
    if (speed) windowTyped.setGameSpeed?.(speed);
  };
  
  window.logConfig = () => {
    console.table(activeConfig);
  };
  
  // Comandos de consola útiles
  console.log(`
🎮 Game Config Commands Available:
- gameConfig: Ver configuración actual
- setGameSpeed(2.0): Cambiar velocidad del juego  
- applySpeedPreset('fast'): Aplicar preset de velocidad
- speedPresets: Ver presets disponibles
- logConfig(): Log tabla completa de config
  `);
}