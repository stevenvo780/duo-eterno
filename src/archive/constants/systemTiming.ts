/**
 * ⏰ SISTEMA DE TIMING UNIFICADO
 * 
 * Todas las constantes de tiempo del sistema en un solo lugar.
 * Basado en principios de sistemas distribuidos y sincronización temporal.
 */

import { 
  NATURAL_CYCLE_MS, 
  BREATHING_CYCLE_MS, 
  ATTENTION_SPAN_MS 
} from './mathematicalCore';



/**
 * Configuración de frame rates objetivo
 * Basada en estándares de la industria y capacidades de hardware
 */
export const FRAME_RATES = {

  TARGET_FPS: 60,
  

  MIN_ACCEPTABLE_FPS: 30,
  

  MOVEMENT_UPDATE_FPS: 30,
  

  PARTICLE_UPDATE_FPS: 45,
  

  UI_UPDATE_FPS: 30
} as const;

/**
 * Intervalos de tiempo calculados a partir de frame rates
 */
export const FRAME_INTERVALS = {

  TARGET_FRAME_MS: 1000 / FRAME_RATES.TARGET_FPS,
  

  MIN_FRAME_MS: 1000 / FRAME_RATES.MIN_ACCEPTABLE_FPS,
  

  MOVEMENT_UPDATE_MS: 1000 / FRAME_RATES.MOVEMENT_UPDATE_FPS,
  

  PARTICLE_UPDATE_MS: 1000 / FRAME_RATES.PARTICLE_UPDATE_FPS,
  

  UI_UPDATE_MS: 1000 / FRAME_RATES.UI_UPDATE_FPS
} as const;



/**
 * Intervalos de los sistemas principales del juego
 * Calculados para evitar resonancia destructiva entre sistemas
 */
export const GAME_LOOP_INTERVALS = {
  /** 
   * Ciclo principal de lógica de juego
   * Basado en el ciclo natural pero ajustado para rendimiento
   * 1000ms sería ideal, pero 800ms evita conflictos con otros sistemas
   */
  MAIN_GAME_LOGIC: NATURAL_CYCLE_MS * 0.8,
  
  /** 
   * Autopoiesis - procesos de vida automáticos
   * Basado en respiración natural con ajuste para estabilidad
   * 4000ms sería ideal, pero 3200ms mejora capacidad de respuesta
   */
  AUTOPOIESIS: BREATHING_CYCLE_MS * 0.8,
  
  /** 
   * Efectos de zona - aplicación de bonificaciones
   * Más rápido que autopoiesis para respuesta inmediata
   * 1600ms permite respuesta rápida sin sobrecarga
   */
  ZONE_EFFECTS: BREATHING_CYCLE_MS * 0.4,
  
  /** 
   * Actualizaciones de AI - decisiones inteligentes
   * Basado en span de atención pero más frecuente
   * 3500ms permite decisiones reflexivas pero responsivas
   */
  AI_DECISIONS: ATTENTION_SPAN_MS * 0.5,
  
  /** 
   * Análisis de resonancia - cálculos complejos
   * Menos frecuente debido a complejidad computacional
   * 2000ms equilibra precisión con rendimiento
   */
  RESONANCE_ANALYSIS: NATURAL_CYCLE_MS * 2,
  
  /** 
   * Guardado de estado - persistencia
   * Relativamente infrecuente para evitar I/O excesivo
   * 10000ms = cada 10 segundos es suficiente
   */
  STATE_PERSISTENCE: NATURAL_CYCLE_MS * 10,
} as const;



/**
 * Límites que previenen problemas por saltos temporales
 */
export const TEMPORAL_LIMITS = {
  /** 
   * Delta time máximo para físicas
   * Previene saltos masivos tras pausas o lag
   * 50ms = máximo 2 frames perdidos a 30fps
   */
  MAX_PHYSICS_DELTA_MS: 50,
  
  /** 
   * Delta time máximo para lógica de juego
   * Más permisivo que física pero aún controlado
   * 200ms = máximo para evitar saltos de stats masivos
   */
  MAX_GAME_LOGIC_DELTA_MS: 200,
  
  /** 
   * Tiempo máximo sin actualización antes de pausa forzada
   * Detecta cuando el juego ha estado inactivo demasiado tiempo
   * 5000ms = 5 segundos antes de considerar "pausado"
   */
  PAUSE_DETECTION_THRESHOLD_MS: 5000,
  
  /** 
   * Tiempo mínimo entre frames para considerar válido
   * Evita divisiones por cero y cálculos inestables
   * 1ms = mínimo realista para JavaScript
   */
  MIN_VALID_DELTA_MS: 1,
  
  /** 
   * Ventana de promediado para FPS suave
   * Número de frames sobre los cuales promediar FPS
   * 60 frames = 1 segundo de historia a 60fps
   */
  FPS_SMOOTHING_WINDOW_FRAMES: 60
} as const;



/**
 * Sistema que ajusta automáticamente la frecuencia según rendimiento
 */
export const ADAPTIVE_THROTTLING = {
  /** 
   * FPS mínimo antes de activar throttling
   * Si baja de esto, empezar a reducir carga
   */
  THROTTLING_TRIGGER_FPS: 25,
  
  /** 
   * Factor de reducción de frecuencia bajo throttling
   * Multiplica intervalos por este factor cuando hay lag
   */
  THROTTLING_FACTOR: 1.5,
  
  /** 
   * FPS objetivo para recuperación de throttling
   * Debe recuperar este FPS antes de volver a normal
   */
  RECOVERY_TARGET_FPS: 40,
  
  /** 
   * Tiempo mínimo en throttling antes de intentar recuperación
   * Evita oscilaciones rápidas entre estados
   */
  MIN_THROTTLING_DURATION_MS: 3000,
  
  /** 
   * Número de frames consecutivos de buen rendimiento para recuperar
   * Confirma que el rendimiento se ha estabilizado
   */
  RECOVERY_CONFIRMATION_FRAMES: 30
} as const;



/**
 * Timeouts para estados especiales del juego
 */
export const SPECIAL_TIMEOUTS = {
  /** 
   * Tiempo en estado "fading" antes de muerte
   * Periodo de gracia para recuperación
   * 10000ms = 10 segundos de oportunidad
   */
  FADING_TIMEOUT_MS: NATURAL_CYCLE_MS * 10,
  
  /** 
   * Umbral de stat para recuperarse del fading
   * Si cualquier stat sube por encima de esto, sale de fading
   */
  FADING_RECOVERY_THRESHOLD: 10,
  
  /** 
   * Duración de mensajes de diálogo
   * Basado en velocidad de lectura promedio
   * 2500ms permite leer ~10-15 palabras cómodamente
   */
  DIALOGUE_DURATION_MS: NATURAL_CYCLE_MS * 2.5,
  
  /** 
   * Duración de efectos visuales temporales
   * Para feedback visual sin ser intrusivo
   */
  VISUAL_EFFECT_DURATION_MS: NATURAL_CYCLE_MS * 1.5,
  
  /** 
   * Tiempo de cooldown entre eventos críticos
   * Evita spam de eventos estresantes
   */
  CRITICAL_EVENT_COOLDOWN_MS: ATTENTION_SPAN_MS * 2,
  
  /** 
   * Duración máxima de animaciones de transición
   * Para mantener responsividad de UI
   */
  MAX_TRANSITION_DURATION_MS: FRAME_INTERVALS.TARGET_FRAME_MS * 30
} as const;



/**
 * Probabilidades que dependen del tiempo para eventos aleatorios
 */
export const TEMPORAL_PROBABILITIES = {
  /** 
   * Probabilidad base de evento crítico por segundo
   * 0.02 = 2% de chance por segundo = evento cada ~50 segundos en promedio
   */
  CRITICAL_EVENT_PROBABILITY_PER_SECOND: 0.02,
  
  /** 
   * Probabilidad de cambio de humor por minuto
   * Basada en estudios de variabilidad emocional
   */
  MOOD_CHANGE_PROBABILITY_PER_MINUTE: 0.1,
  
  /** 
   * Probabilidad de evento emergente con alta resonancia
   * Solo cuando la resonancia supera cierto umbral
   */
  EMERGENT_EVENT_PROBABILITY_PER_MINUTE: 0.05,
  
  /** 
   * Probabilidad de auto-corrección de comportamiento extremo
   * Mecanismo de homeostasis comportamental
   */
  BEHAVIOR_CORRECTION_PROBABILITY_PER_MINUTE: 0.15
} as const;



/**
 * Factores para acelerar/desacelerar el tiempo de juego
 */
export const TIME_SCALING = {
  /** 
   * Velocidad normal del juego (1.0 = tiempo real)
   */
  NORMAL_SPEED: 1.0,
  
  /** 
   * Velocidades preconfiguradas para diferentes modos
   */
  PRESET_SPEEDS: {
    'Súper Lento': 0.2,
    'Lento': 0.5,
    'Normal': 1.0,
    'Rápido': 2.0,
    'Muy Rápido': 3.0,
    'Turbo': 5.0,
    'Hiper': 10.0
  } as const,
  
  /** 
   * Límites de velocidad para mantener estabilidad
   */
  MIN_SPEED_MULTIPLIER: 0.1,
  MAX_SPEED_MULTIPLIER: 20.0,
  
  /** 
   * Factor de suavizado para cambios de velocidad
   * Evita saltos bruscos que puedan causar inestabilidad
   */
  SPEED_CHANGE_SMOOTHING: 0.95
} as const;



/**
 * Calcula intervalos adaptados a la velocidad actual del juego
 */
export function getAdaptiveIntervals(speedMultiplier: number = 1.0): typeof GAME_LOOP_INTERVALS {
  const clampedSpeed = Math.max(
    TIME_SCALING.MIN_SPEED_MULTIPLIER,
    Math.min(TIME_SCALING.MAX_SPEED_MULTIPLIER, speedMultiplier)
  );

  return {
    MAIN_GAME_LOGIC: Math.max(100, GAME_LOOP_INTERVALS.MAIN_GAME_LOGIC / clampedSpeed),
    AUTOPOIESIS: Math.max(200, GAME_LOOP_INTERVALS.AUTOPOIESIS / clampedSpeed),
    ZONE_EFFECTS: Math.max(100, GAME_LOOP_INTERVALS.ZONE_EFFECTS / clampedSpeed),
    AI_DECISIONS: Math.max(200, GAME_LOOP_INTERVALS.AI_DECISIONS / clampedSpeed),
    RESONANCE_ANALYSIS: Math.max(300, GAME_LOOP_INTERVALS.RESONANCE_ANALYSIS / clampedSpeed),
    STATE_PERSISTENCE: Math.max(1000, GAME_LOOP_INTERVALS.STATE_PERSISTENCE / clampedSpeed)
  };
}

/**
 * Determina si se debe aplicar throttling basado en FPS actual
 */
export function shouldApplyThrottling(currentFPS: number): boolean {
  return currentFPS < ADAPTIVE_THROTTLING.THROTTLING_TRIGGER_FPS;
}

/**
 * Calcula el factor de throttling basado en performance
 */
export function calculateThrottlingFactor(currentFPS: number): number {
  if (currentFPS >= ADAPTIVE_THROTTLING.THROTTLING_TRIGGER_FPS) {
    return 1.0;
  }
  

  const fpsRatio = currentFPS / ADAPTIVE_THROTTLING.THROTTLING_TRIGGER_FPS;
  return Math.max(1.0, ADAPTIVE_THROTTLING.THROTTLING_FACTOR / fpsRatio);
}

/**
 * Normaliza un delta time para evitar saltos temporales extremos
 */
export function normalizeDeltaTime(deltaTimeMs: number, maxDelta: number = TEMPORAL_LIMITS.MAX_PHYSICS_DELTA_MS): number {

  return Math.max(
    TEMPORAL_LIMITS.MIN_VALID_DELTA_MS,
    Math.min(maxDelta, deltaTimeMs)
  );
}



/**
 * Valida que todas las constantes temporales sean coherentes
 */
export function validateTimingConstants(): boolean {
  const validations = [

    FRAME_RATES.TARGET_FPS > 0,
    FRAME_RATES.MIN_ACCEPTABLE_FPS > 0,
    FRAME_RATES.TARGET_FPS >= FRAME_RATES.MIN_ACCEPTABLE_FPS,
    

    Object.values(FRAME_INTERVALS).every(interval => interval > 0),
    Object.values(GAME_LOOP_INTERVALS).every(interval => interval > 0),
    

    TEMPORAL_LIMITS.MAX_PHYSICS_DELTA_MS > TEMPORAL_LIMITS.MIN_VALID_DELTA_MS,
    TEMPORAL_LIMITS.MAX_GAME_LOGIC_DELTA_MS > TEMPORAL_LIMITS.MAX_PHYSICS_DELTA_MS,
    TEMPORAL_LIMITS.PAUSE_DETECTION_THRESHOLD_MS > TEMPORAL_LIMITS.MAX_GAME_LOGIC_DELTA_MS,
    

    Object.values(SPECIAL_TIMEOUTS).every(timeout => timeout > 0),
    

    Object.values(TEMPORAL_PROBABILITIES).every(prob => prob >= 0 && prob <= 1),
    

    TIME_SCALING.MIN_SPEED_MULTIPLIER > 0,
    TIME_SCALING.MAX_SPEED_MULTIPLIER > TIME_SCALING.MIN_SPEED_MULTIPLIER,
    TIME_SCALING.NORMAL_SPEED >= TIME_SCALING.MIN_SPEED_MULTIPLIER,
    TIME_SCALING.NORMAL_SPEED <= TIME_SCALING.MAX_SPEED_MULTIPLIER,
    

    ADAPTIVE_THROTTLING.THROTTLING_TRIGGER_FPS > 0,
    ADAPTIVE_THROTTLING.RECOVERY_TARGET_FPS > ADAPTIVE_THROTTLING.THROTTLING_TRIGGER_FPS,
    ADAPTIVE_THROTTLING.THROTTLING_FACTOR > 1.0,
    ADAPTIVE_THROTTLING.MIN_THROTTLING_DURATION_MS > 0,
    ADAPTIVE_THROTTLING.RECOVERY_CONFIRMATION_FRAMES > 0
  ];

  return validations.every(v => v === true);
}


if (import.meta.env.DEV) {
  if (!validateTimingConstants()) {
    console.error('❌ Timing constants validation failed!');
  } else {
    console.log('✅ Timing constants validated successfully');
  }
}