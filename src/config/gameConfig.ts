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

export interface GameConfig {
  gameSpeedMultiplier: number;
  debugMode: boolean;
  targetFPS: number;

  timing: {
    mainGameLogic: number;
    degradation: number;
    batchFlush: number;
    cleanup: number;
    gameSpeedMultiplier: number;
  };

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

  movement: {
    baseSpeed: number;
    maxSpeed: number;
    acceleration: number;
    friction: number;
    avoidanceDistance: number;
    wanderRadius: number;
  };

  resonance: {
    maxDistance: number;
    decayRate: number;
    harmonyBonus: number;
    activitySyncBonus: number;
    proximityWeight: number;
  };

  ai: {
    personalityInfluence: number;
    activityInertiaBonus: number;
    moodInfluenceStrength: number;
    softmaxTau: number;
    decisionChangeThreshold: number;
  };

  zones: {
    effectivenessMultiplier: number;
    transitionSmoothness: number;
    bonusDecayRate: number;
  };

  ui: {
    dialogueDuration: number;
    animationSpeed: number;
    maxLogEntries: number;
    statUpdateFrequency: number;
    dialogueInitiationChance: number;
    dialogueConversationTimeout: number;
    dialogueResponseDelay: number;
  };

  performance: {
    maxEntities: number;
    cullingDistance: number;
    batchSize: number;
    throttleThreshold: number;
  };

  entityCircleInitialX: number;
  entityCircleInitialY: number;
  entitySquareInitialX: number;
  entitySquareInitialY: number;
  entityInitialStats: number;
  entityInitialMoney: number;
  entityInitialHealth: number;
  initialResonance: number;

  thresholdLow: number;
  thresholdComfortable: number;
  thresholdWarning: number;

  zoneEffectivenessMultiplier: number;

  activityInertiaBonus: number;
  aiPersonalityInfluence: number;
  moodInfluenceStrength: number;
  aiSoftmaxTau: number;
}

const baseConfig: GameConfig = {
  gameSpeedMultiplier: 1.0,
  debugMode: false,
  targetFPS: 60,

  timing: {
    mainGameLogic: TIMING.MAIN_GAME_LOGIC,
    degradation: TIMING.DEGRADATION_UPDATE,
    batchFlush: 100,
    cleanup: 60000,
    gameSpeedMultiplier: 1.0
  },

  survival: {
    degradationRates: {
      hunger: SURVIVAL.DEGRADATION_RATES.HUNGER,
      energy: SURVIVAL.DEGRADATION_RATES.ENERGY,
      happiness: SURVIVAL.DEGRADATION_RATES.HAPPINESS,
      sleepiness: SURVIVAL.DEGRADATION_RATES.SLEEPINESS,
      boredom: SURVIVAL.DEGRADATION_RATES.BOREDOM,
      loneliness: SURVIVAL.DEGRADATION_RATES.LONELINESS
    },
    criticalThresholds: {
      hunger: SURVIVAL.CRITICAL_THRESHOLDS.HUNGER,
      energy: SURVIVAL.CRITICAL_THRESHOLDS.ENERGY,
      health: SURVIVAL.CRITICAL_THRESHOLDS.HEALTH
    },
    livingCosts: {
      basic: SURVIVAL.LIVING_COSTS.BASIC,
      activity: SURVIVAL.LIVING_COSTS.ACTIVITY,
      luxury: SURVIVAL.LIVING_COSTS.LUXURY
    },
    recovery: {
      restingBonus: 1.8,
      eatingEfficiency: 2.5,
      socialBonus: 1.6
    }
  },

  movement: {
    baseSpeed: PHYSICS.BASE_MOVEMENT_SPEED,
    maxSpeed: PHYSICS.MAX_SPEED,
    acceleration: PHYSICS.ACCELERATION,
    friction: PHYSICS.FRICTION,
    avoidanceDistance: 60,
    wanderRadius: 100
  },

  resonance: {
    maxDistance: 400,
    decayRate: 0.02,
    harmonyBonus: 1.2,
    activitySyncBonus: 1.15,
    proximityWeight: 0.6
  },

  ai: {
    personalityInfluence: 0.3,
    activityInertiaBonus: 1.2,
    moodInfluenceStrength: 0.8,
    softmaxTau: 0.5,
    decisionChangeThreshold: 0.15
  },

  zones: {
    effectivenessMultiplier: 1.5,
    transitionSmoothness: 0.1,
    bonusDecayRate: 0.05
  },

  ui: {
    dialogueDuration: 3000,
    animationSpeed: 1.0,
    maxLogEntries: 100,
    statUpdateFrequency: 500,
    dialogueInitiationChance: 0.1,
    dialogueConversationTimeout: 20000,
    dialogueResponseDelay: 3000,
  },

  performance: {
    maxEntities: 10,
    cullingDistance: 1000,
    batchSize: 20,
    throttleThreshold: 16.67
  },

  entityCircleInitialX: 200,
  entityCircleInitialY: 200,
  entitySquareInitialX: 600,
  entitySquareInitialY: 300,
  entityInitialStats: 50,
  entityInitialMoney: 50,
  entityInitialHealth: 90,
  initialResonance: 0,

  thresholdLow: 30,
  thresholdComfortable: 70,
  thresholdWarning: 25,

  zoneEffectivenessMultiplier: 1.5,

  activityInertiaBonus: 1.2,
  aiPersonalityInfluence: 0.3,
  moodInfluenceStrength: 0.8,
  aiSoftmaxTau: 0.5
};

export const gamePresets = {
  development: {
    ...baseConfig,
    debugMode: true,
    gameSpeedMultiplier: 2.0,
    timing: {
      ...baseConfig.timing,
      gameSpeedMultiplier: 2.0,
      mainGameLogic: 400
    },
    ui: {
      ...baseConfig.ui,
      dialogueDuration: 1000
    }
  },

  production: {
    ...baseConfig,
    debugMode: false,
    gameSpeedMultiplier: 1.0,
    performance: {
      ...baseConfig.performance,
      maxEntities: 4,
      batchSize: 15
    }
  },

  testing: {
    ...baseConfig,
    debugMode: true,
    gameSpeedMultiplier: 10.0,
    timing: {
      ...baseConfig.timing,
      gameSpeedMultiplier: 10.0,
      mainGameLogic: 100,
      degradation: 200
    },
    survival: {
      ...baseConfig.survival,
      degradationRates: {
        ...baseConfig.survival.degradationRates,
        hunger: 0.8,
        energy: 0.5,
        happiness: 0.3,
        sleepiness: 0.4,
        boredom: 0.6,
        loneliness: 0.2
      }
    }
  },

  performance: {
    ...baseConfig,
    debugMode: false,
    timing: {
      ...baseConfig.timing,
      mainGameLogic: 1200,
      batchFlush: 200
    },
    performance: {
      ...baseConfig.performance,
      maxEntities: 2,
      batchSize: 10
    }
  },

  presentation: {
    ...baseConfig,
    gameSpeedMultiplier: 1.5,
    timing: {
      ...baseConfig.timing,
      gameSpeedMultiplier: 1.5
    },
    ui: {
      ...baseConfig.ui,
      animationSpeed: 1.3,
      dialogueDuration: 2000
    },
    resonance: {
      ...baseConfig.resonance,
      harmonyBonus: 1.4,
      activitySyncBonus: 1.3
    }
  }
} as const;

let activeConfig: GameConfig = gamePresets.development;

if (import.meta.env.PROD) {
  activeConfig = gamePresets.production;
} else if (import.meta.env.MODE === 'test') {
  activeConfig = gamePresets.testing;
}

export const getGameConfig = (): GameConfig => ({
  ...activeConfig
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
  entityMovementSpeed: 2.0,
  zoneEffectsInterval: 1000
});

export const gameConfig = getGameConfig();

// Nota: updateGameConfig eliminado por no usarse

if (typeof window !== 'undefined') {
  const isLowEnd =
    navigator.hardwareConcurrency <= 2 ||
    ((navigator as unknown as { deviceMemory?: number })?.deviceMemory || 4) <= 2;

  if (isLowEnd && import.meta.env.PROD) {
    loadPreset('performance');
  }
}

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
    instant: 20.0
  };

  (
    window as {
      applySpeedPreset?: (name: string) => void;
      speedPresets?: Record<string, number>;
      setGameSpeed?: (speed: number) => void;
    }
  ).applySpeedPreset = (presetName: string) => {
    const windowTyped = window as {
      speedPresets?: Record<string, number>;
      setGameSpeed?: (speed: number) => void;
    };
    const speed = windowTyped.speedPresets?.[presetName];
    if (speed) windowTyped.setGameSpeed?.(speed);
  };

  window.logConfig = () => {
    console.table(activeConfig);
  };

  console.log(`
🎮 Game Config Commands Available:
- gameConfig: Ver configuración actual
- setGameSpeed(2.0): Cambiar velocidad del juego  
- applySpeedPreset('fast'): Aplicar preset de velocidad
- speedPresets: Ver presets disponibles
- logConfig(): Log tabla completa de config
  `);
}
