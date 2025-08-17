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

// === CONFIGURACIÓN PRINCIPAL DEL JUEGO ===

export interface UnifiedGameConfig {
  // === SISTEMA DE TIEMPO ===
  timing: {
    targetFPS: number;
    movementUpdateFPS: number;
    gameSpeedMultiplier: number;
    dialogueDuration: number;
    adaptiveThrottling: boolean;
  };

  // === SISTEMA DE DEBUG ===
  debug: {
    enabled: boolean;
    showPhysicsDebug: boolean;
    showAIDebug: boolean;
    showTimingDebug: boolean;
    validateConstants: boolean;
  };

  // === DINÁMICAS BIOLÓGICAS ===
  biology: {
    decayRates: typeof BIOLOGICAL_DECAY_RATES;
    activityMultipliers: typeof ACTIVITY_METABOLIC_MULTIPLIERS;
    healthDynamics: typeof HEALTH_DYNAMICS;
    survivalEconomics: typeof SURVIVAL_ECONOMICS;
  };

  // === SISTEMA DE FÍSICA ===
  physics: {
    enabled: boolean;
    world: typeof PHYSICS_WORLD;
    entities: typeof ENTITY_PHYSICS;
    movement: typeof MOVEMENT_DYNAMICS;
    collisions: typeof COLLISION_SYSTEM;
  };

  // === SISTEMA DE AI ===
  ai: {
    personalityInfluence: number;
    activityInertiaBonus: number;
    moodInfluenceStrength: number;
    softmaxTemperature: number;
    pathfinding: typeof PATHFINDING_CONFIG;
    behaviorPrediction: typeof BEHAVIOR_PREDICTION;
  };

  // === SISTEMA DE RESONANCIA ===
  resonance: {
    dynamics: typeof RESONANCE_DYNAMICS;
    enableAdvancedEffects: boolean;
    harmonicResonance: boolean;
    emergentBehaviors: boolean;
  };

  // === SISTEMA DE EFECTOS ===
  effects: {
    zoneEffectivenessMultiplier: number;
    particleSystem: boolean;
    visualEffects: boolean;
    soundEffects: boolean;
  };

  // === PROBABILIDADES Y EVENTOS ===
  events: {
    criticalEventProbability: number;
    emergentEventProbability: number;
    moodChangeProbability: number;
  };

  // === RENDIMIENTO Y OPTIMIZACIÓN ===
  performance: {
    enableObjectPooling: boolean;
    enableSpatialHashing: boolean;
    maxEntities: number;
    maxParticles: number;
    cullingDistance: number;
  };
}

// === CONFIGURACIÓN POR DEFECTO OPTIMIZADA ===

export const defaultGameConfig: UnifiedGameConfig = {
  // === TIMING BASADO EN CONSTANTES CIENTÍFICAS ===
  timing: {
    targetFPS: FRAME_RATES.TARGET_FPS,
    movementUpdateFPS: FRAME_RATES.MOVEMENT_UPDATE_FPS,
    gameSpeedMultiplier: TIME_SCALING.NORMAL_SPEED,
    dialogueDuration: SPECIAL_TIMEOUTS.DIALOGUE_DURATION_MS,
    adaptiveThrottling: true
  },

  // === DEBUG CONFIGURACIÓN ===
  debug: {
    enabled: false, // Cambiar a true en desarrollo
    showPhysicsDebug: false,
    showAIDebug: false,
    showTimingDebug: false,
    validateConstants: true
  },

  // === BIOLOGÍA BASADA EN PRINCIPIOS REALES ===
  biology: {
    decayRates: BIOLOGICAL_DECAY_RATES,
    activityMultipliers: ACTIVITY_METABOLIC_MULTIPLIERS,
    healthDynamics: HEALTH_DYNAMICS,
    survivalEconomics: SURVIVAL_ECONOMICS
  },

  // === FÍSICA REALISTA ===
  physics: {
    enabled: true,
    world: PHYSICS_WORLD,
    entities: ENTITY_PHYSICS,
    movement: MOVEMENT_DYNAMICS,
    collisions: COLLISION_SYSTEM
  },

  // === AI BALANCEADA ===
  ai: {
    personalityInfluence: GOLDEN_RATIO_CONJUGATE * 0.5, // ≈ 0.31 (30% influencia)
    activityInertiaBonus: 15.0, // Mantiene decisiones por tiempo realista
    moodInfluenceStrength: 0.5, // Balance entre lógica y emoción
    softmaxTemperature: UNIVERSAL_DAMPING, // ≈ 0.983 (decisiones suaves)
    pathfinding: PATHFINDING_CONFIG,
    behaviorPrediction: BEHAVIOR_PREDICTION
  },

  // === RESONANCIA AVANZADA ===
  resonance: {
    dynamics: RESONANCE_DYNAMICS,
    enableAdvancedEffects: true,
    harmonicResonance: true,
    emergentBehaviors: true
  },

  // === EFECTOS VISUALES Y AUDIO ===
  effects: {
    zoneEffectivenessMultiplier: GOLDEN_RATIO_CONJUGATE + 0.5, // ≈ 1.12 (12% bonus)
    particleSystem: true,
    visualEffects: true,
    soundEffects: false // Deshabilitado por defecto
  },

  // === EVENTOS PROBABILÍSTICOS ===
  events: {
    criticalEventProbability: 0.02, // 2% por segundo = evento cada ~50 segundos
    emergentEventProbability: 0.01, // 1% por segundo = comportamiento emergente raro
    moodChangeProbability: 0.1 / 60 // 10% por minuto = cambio cada ~10 minutos
  },

  // === OPTIMIZACIÓN AUTOMÁTICA ===
  performance: {
    enableObjectPooling: true,
    enableSpatialHashing: true,
    maxEntities: 10, // Límite razonable para demo
    maxParticles: 50,
    cullingDistance: 1200 // Fuera de pantalla + margen
  }
};

// === CONFIGURACIONES PREESTABLECIDAS ===

export const gamePresets = {
  /** Configuración para desarrollo - máximo debugging */
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
      gameSpeedMultiplier: 2.0 // Más rápido para testing
    },
    performance: {
      ...defaultGameConfig.performance,
      maxParticles: 20 // Menos partículas para debugging
    }
  },

  /** Configuración para presentación - visualmente impresionante */
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
      gameSpeedMultiplier: 1.5 // Ligeramente acelerado
    }
  },

  /** Configuración para dispositivos lentos - máximo rendimiento */
  lowPerformance: {
    ...defaultGameConfig,
    physics: {
      ...defaultGameConfig.physics,
      world: {
        ...PHYSICS_WORLD,
        MAX_TIME_STEP: 1/15 // 66ms max step
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
      enableSpatialHashing: false, // Menos overhead para pocos objetos
      cullingDistance: 800
    },
    timing: {
      ...defaultGameConfig.timing,
      targetFPS: 30,
      movementUpdateFPS: 20
    }
  },

  /** Configuración científica - máxima precisión */
  scientific: {
    ...defaultGameConfig,
    debug: {
      ...defaultGameConfig.debug,
      enabled: true,
      validateConstants: true
    },
    biology: {
      ...defaultGameConfig.biology,
      // Usar tasas de decaimiento más realistas (más lentas)
      decayRates: Object.fromEntries(
        Object.entries(BIOLOGICAL_DECAY_RATES).map(([key, value]) => [key, value * 0.5])
      ) as typeof BIOLOGICAL_DECAY_RATES
    },
    ai: {
      ...defaultGameConfig.ai,
      personalityInfluence: 0.8, // Mayor influencia de personalidad
      pathfinding: PATHFINDING_CONFIG,
      behaviorPrediction: BEHAVIOR_PREDICTION
    },
    timing: {
      ...defaultGameConfig.timing,
      gameSpeedMultiplier: 0.5 // Más lento para observación detallada
    }
  }
} as const;

// === CONFIGURACIÓN GLOBAL ===

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

// === UTILIDADES DE CONFIGURACIÓN ===

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

// === VALIDACIÓN DE CONFIGURACIÓN ===

/**
 * Valida que la configuración actual sea coherente
 */
export function validateGameConfiguration(): boolean {
  const config = getGameConfig();
  
  const validations = [
    // Timing
    config.timing.targetFPS > 0,
    config.timing.movementUpdateFPS > 0,
    config.timing.gameSpeedMultiplier > 0,
    config.timing.dialogueDuration > 0,
    
    // AI
    config.ai.personalityInfluence >= 0 && config.ai.personalityInfluence <= 1,
    config.ai.activityInertiaBonus >= 0,
    config.ai.moodInfluenceStrength >= 0 && config.ai.moodInfluenceStrength <= 1,
    config.ai.softmaxTemperature > 0,
    
    // Efectos
    config.effects.zoneEffectivenessMultiplier > 0,
    
    // Eventos
    config.events.criticalEventProbability >= 0 && config.events.criticalEventProbability <= 1,
    config.events.emergentEventProbability >= 0 && config.events.emergentEventProbability <= 1,
    config.events.moodChangeProbability >= 0 && config.events.moodChangeProbability <= 1,
    
    // Rendimiento
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

// === INICIALIZACIÓN ===

// Auto-detectar entorno y cargar preset apropiado
if (typeof window !== 'undefined') {
  // Entorno browser
  if (import.meta.env.DEV) {
    loadPreset('development');
  } else {
    // Detectar rendimiento del dispositivo
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                    ((navigator as unknown as { deviceMemory?: number })?.deviceMemory || 4) <= 2;
    
    if (isLowEnd) {
      loadPreset('lowPerformance');
    } else {
      loadPreset('presentation');
    }
  }
} else {
  // Entorno Node/test
  loadPreset('scientific');
}

// Validar configuración inicial
if (isDebugMode()) {
  validateGameConfiguration();
}

// Hacer disponible globalmente para debugging
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