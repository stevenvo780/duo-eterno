/**
 * 🎮 CONFIGURACIÓN UNIFICADA DEL JUEGO
 * 
 * Reemplaza gameConfig.ts eliminando dependencia de .env
 * Integra todas las constantes especializadas en configuración coherente
 */

import { 
  BIOLOGICAL_DECAY_RATES,
  ACTIVITY_METABOLIC_MULTIPLIERS,
  RESONANCE_DYNAMICS,
  HEALTH_DYNAMICS,
  SURVIVAL_ECONOMICS
} from '../constants/biologicalDynamics';

import { 
  PHYSICS_WORLD,
  ENTITY_PHYSICS,
  MOVEMENT_DYNAMICS,
  COLLISION_SYSTEM,
  PATHFINDING_CONFIG,
  BEHAVIOR_PREDICTION
} from '../constants/physicsAndMovement';

import { 
  FRAME_RATES,
  TEMPORAL_LIMITS,
  SPECIAL_TIMEOUTS,
  TIME_SCALING,
  getAdaptiveIntervals,
  normalizeDeltaTime
} from '../constants/systemTiming';

import { 
  GOLDEN_RATIO_CONJUGATE,
  UNIVERSAL_DAMPING 
} from '../constants/mathematicalCore';



export interface UnifiedGameConfig {

  timing: {
    targetFPS: number;
    movementUpdateFPS: number;
    gameSpeedMultiplier: number;
    dialogueDuration: number;
    adaptiveThrottling: boolean;
  };


  debug: {
    enabled: boolean;
    showPhysicsDebug: boolean;
    showAIDebug: boolean;
    showTimingDebug: boolean;
    validateConstants: boolean;
  };


  biology: {
    decayRates: typeof BIOLOGICAL_DECAY_RATES;
    activityMultipliers: typeof ACTIVITY_METABOLIC_MULTIPLIERS;
    healthDynamics: typeof HEALTH_DYNAMICS;
    survivalEconomics: typeof SURVIVAL_ECONOMICS;
  };


  physics: {
    enabled: boolean;
    world: typeof PHYSICS_WORLD;
    entities: typeof ENTITY_PHYSICS;
    movement: typeof MOVEMENT_DYNAMICS;
    collisions: typeof COLLISION_SYSTEM;
  };


  ai: {
    personalityInfluence: number;
    activityInertiaBonus: number;
    moodInfluenceStrength: number;
    softmaxTemperature: number;
    pathfinding: typeof PATHFINDING_CONFIG;
    behaviorPrediction: typeof BEHAVIOR_PREDICTION;
  };


  resonance: {
    dynamics: typeof RESONANCE_DYNAMICS;
    enableAdvancedEffects: boolean;
    harmonicResonance: boolean;
    emergentBehaviors: boolean;
  };


  effects: {
    zoneEffectivenessMultiplier: number;
    particleSystem: boolean;
    visualEffects: boolean;
    soundEffects: boolean;
  };


  events: {
    criticalEventProbability: number;
    emergentEventProbability: number;
    moodChangeProbability: number;
  };


  performance: {
    enableObjectPooling: boolean;
    enableSpatialHashing: boolean;
    maxEntities: number;
    maxParticles: number;
    cullingDistance: number;
  };
}



export const defaultGameConfig: UnifiedGameConfig = {

  timing: {
    targetFPS: FRAME_RATES.TARGET_FPS,
    movementUpdateFPS: FRAME_RATES.MOVEMENT_UPDATE_FPS,
    gameSpeedMultiplier: TIME_SCALING.NORMAL_SPEED,
    dialogueDuration: SPECIAL_TIMEOUTS.DIALOGUE_DURATION_MS,
    adaptiveThrottling: true
  },


  debug: {
    enabled: false,
    showPhysicsDebug: false,
    showAIDebug: false,
    showTimingDebug: false,
    validateConstants: true
  },


  biology: {
    decayRates: BIOLOGICAL_DECAY_RATES,
    activityMultipliers: ACTIVITY_METABOLIC_MULTIPLIERS,
    healthDynamics: HEALTH_DYNAMICS,
    survivalEconomics: SURVIVAL_ECONOMICS
  },


  physics: {
    enabled: true,
    world: PHYSICS_WORLD,
    entities: ENTITY_PHYSICS,
    movement: MOVEMENT_DYNAMICS,
    collisions: COLLISION_SYSTEM
  },


  ai: {
    personalityInfluence: GOLDEN_RATIO_CONJUGATE * 0.5,
    activityInertiaBonus: 15.0,
    moodInfluenceStrength: 0.5,
    softmaxTemperature: UNIVERSAL_DAMPING,
    pathfinding: PATHFINDING_CONFIG,
    behaviorPrediction: BEHAVIOR_PREDICTION
  },


  resonance: {
    dynamics: RESONANCE_DYNAMICS,
    enableAdvancedEffects: true,
    harmonicResonance: true,
    emergentBehaviors: true
  },


  effects: {
    zoneEffectivenessMultiplier: GOLDEN_RATIO_CONJUGATE + 0.5,
    particleSystem: true,
    visualEffects: true,
    soundEffects: false
  },


  events: {
    criticalEventProbability: 0.02,
    emergentEventProbability: 0.01,
    moodChangeProbability: 0.1 / 60
  },


  performance: {
    enableObjectPooling: true,
    enableSpatialHashing: true,
    maxEntities: 10,
    maxParticles: 50,
    cullingDistance: 1200
  }
};



export const gamePresets = {

  development: {
    ...defaultGameConfig,
    debug: {
      enabled: true,
      showPhysicsDebug: true,
      showAIDebug: true,
      showTimingDebug: true,
      validateConstants: true
    },
    timing: {
      ...defaultGameConfig.timing,
      gameSpeedMultiplier: 2.0
    },
    performance: {
      ...defaultGameConfig.performance,
      maxParticles: 20
    }
  },


  presentation: {
    ...defaultGameConfig,
    effects: {
      ...defaultGameConfig.effects,
      particleSystem: true,
      visualEffects: true,
      soundEffects: true
    },
    resonance: {
      ...defaultGameConfig.resonance,
      enableAdvancedEffects: true,
      harmonicResonance: true,
      emergentBehaviors: true
    },
    timing: {
      ...defaultGameConfig.timing,
      gameSpeedMultiplier: 1.5
    }
  },


  lowPerformance: {
    ...defaultGameConfig,
    physics: {
      ...defaultGameConfig.physics,
      world: {
        ...PHYSICS_WORLD,
        MAX_TIME_STEP: 1/15
      }
    },
    effects: {
      ...defaultGameConfig.effects,
      particleSystem: false,
      visualEffects: false,
      soundEffects: false
    },
    performance: {
      ...defaultGameConfig.performance,
      maxParticles: 10,
      enableSpatialHashing: false,
      cullingDistance: 800
    },
    timing: {
      ...defaultGameConfig.timing,
      targetFPS: 30,
      movementUpdateFPS: 20
    }
  },


  scientific: {
    ...defaultGameConfig,
    debug: {
      ...defaultGameConfig.debug,
      enabled: true,
      validateConstants: true
    },
    biology: {
      ...defaultGameConfig.biology,

      decayRates: Object.fromEntries(
        Object.entries(BIOLOGICAL_DECAY_RATES).map(([key, value]) => [key, value * 0.5])
      ) as typeof BIOLOGICAL_DECAY_RATES
    },
    ai: {
      ...defaultGameConfig.ai,
      personalityInfluence: 0.8,
      pathfinding: PATHFINDING_CONFIG,
      behaviorPrediction: BEHAVIOR_PREDICTION
    },
    timing: {
      ...defaultGameConfig.timing,
      gameSpeedMultiplier: 0.5
    }
  }
} as const;



let currentConfig: UnifiedGameConfig = defaultGameConfig;

export function getGameConfig(): UnifiedGameConfig {
  return currentConfig;
}

export function setGameConfig(config: Partial<UnifiedGameConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

export function loadPreset(presetName: keyof typeof gamePresets): void {
  currentConfig = { ...gamePresets[presetName] };
}

export function resetToDefault(): void {
  currentConfig = { ...defaultGameConfig };
}



/**
 * Obtiene intervalos adaptativos basados en la configuración actual
 */
export function getCurrentGameIntervals() {
  const config = getGameConfig();
  return getAdaptiveIntervals(config.timing.gameSpeedMultiplier);
}

/**
 * Actualiza la velocidad del juego de manera segura
 */
export function setGameSpeed(multiplier: number): void {
  const clampedSpeed = Math.max(
    TIME_SCALING.MIN_SPEED_MULTIPLIER,
    Math.min(TIME_SCALING.MAX_SPEED_MULTIPLIER, multiplier)
  );
  
  setGameConfig({
    timing: {
      ...currentConfig.timing,
      gameSpeedMultiplier: clampedSpeed
    }
  });
}

/**
 * Normaliza delta time según configuración actual
 */
export function normalizeGameDeltaTime(deltaTimeMs: number): number {
  const config = getGameConfig();
  const maxDelta = config.physics.enabled 
    ? TEMPORAL_LIMITS.MAX_PHYSICS_DELTA_MS 
    : TEMPORAL_LIMITS.MAX_GAME_LOGIC_DELTA_MS;
  
  return normalizeDeltaTime(deltaTimeMs, maxDelta);
}

/**
 * Determina si el sistema está en modo debug
 */
export function isDebugMode(): boolean {
  return currentConfig.debug.enabled;
}

/**
 * Obtiene configuración de efectos consolidada
 */
export function getEffectsConfig() {
  const config = getGameConfig();
  return {
    particles: config.effects.particleSystem,
    visual: config.effects.visualEffects,
    sound: config.effects.soundEffects,
    zoneMultiplier: config.effects.zoneEffectivenessMultiplier,
    maxParticles: config.performance.maxParticles
  };
}

/**
 * Obtiene configuración de AI consolidada
 */
export function getAIConfig() {
  const config = getGameConfig();
  return {
    personalityInfluence: config.ai.personalityInfluence,
    activityInertia: config.ai.activityInertiaBonus,
    moodInfluence: config.ai.moodInfluenceStrength,
    softmaxTau: config.ai.softmaxTemperature,
    pathfinding: config.ai.pathfinding,
    prediction: config.ai.behaviorPrediction
  };
}



/**
 * Valida que la configuración actual sea coherente
 */
export function validateGameConfiguration(): boolean {
  const config = getGameConfig();
  
  const validations = [

    config.timing.targetFPS > 0,
    config.timing.movementUpdateFPS > 0,
    config.timing.gameSpeedMultiplier > 0,
    config.timing.dialogueDuration > 0,
    

    config.ai.personalityInfluence >= 0 && config.ai.personalityInfluence <= 1,
    config.ai.activityInertiaBonus >= 0,
    config.ai.moodInfluenceStrength >= 0 && config.ai.moodInfluenceStrength <= 1,
    config.ai.softmaxTemperature > 0,
    

    config.effects.zoneEffectivenessMultiplier > 0,
    

    config.events.criticalEventProbability >= 0 && config.events.criticalEventProbability <= 1,
    config.events.emergentEventProbability >= 0 && config.events.emergentEventProbability <= 1,
    config.events.moodChangeProbability >= 0 && config.events.moodChangeProbability <= 1,
    

    config.performance.maxEntities > 0,
    config.performance.maxParticles >= 0,
    config.performance.cullingDistance > 0
  ];

  const isValid = validations.every(v => v === true);
  
  if (!isValid && config.debug.enabled) {
    console.error('❌ Game configuration validation failed!');
    console.log('Current config:', config);
  }
  
  return isValid;
}




if (typeof window !== 'undefined') {

  if (import.meta.env.DEV) {
    loadPreset('development');
  } else {

    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                    ((navigator as unknown as { deviceMemory?: number })?.deviceMemory || 4) <= 2;
    
    if (isLowEnd) {
      loadPreset('lowPerformance');
    } else {
      loadPreset('presentation');
    }
  }
} else {

  loadPreset('scientific');
}


if (isDebugMode()) {
  validateGameConfiguration();
}


if (typeof window !== 'undefined' && isDebugMode()) {
  (window as unknown as { gameConfig: unknown }).gameConfig = {
    get: getGameConfig,
    set: setGameConfig,
    loadPreset,
    resetToDefault,
    setSpeed: setGameSpeed,
    validate: validateGameConfiguration,
    presets: gamePresets
  };
}