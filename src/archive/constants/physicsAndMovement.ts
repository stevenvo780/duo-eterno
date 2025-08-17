/**
 * 🚀 CONSTANTES DE FÍSICA Y MOVIMIENTO
 * 
 * Basadas en principios de física real, teoría de sistemas complejos
 * y comportamiento emergente para movimiento natural de agentes.
 */

import { 
  GOLDEN_RATIO_CONJUGATE, 
  SQRT_2,
  PI,
  INFORMATION_SPEED_LIMIT,
  UNIVERSAL_DAMPING,
  MEDIUM_VISCOSITY,
  FIBONACCI_SEQUENCE 
} from './mathematicalCore';

// === CONSTANTES DE FÍSICA FUNDAMENTAL ===

/**
 * Configuración básica de física del mundo
 */
export const PHYSICS_WORLD = {
  /** Gravedad del mundo (normalmente cero para agentes flotantes) */
  GRAVITY: { x: 0, y: 0 },
  
  /** Resistencia del aire basada en medium viscosity */
  AIR_RESISTANCE: MEDIUM_VISCOSITY * 0.03, // ≈ 0.0185
  
  /** Tiempo de paso máximo para estabilidad numérica */
  MAX_TIME_STEP: 1/30, // 33.33ms máximo
  
  /** Velocidad máxima absoluta (basada en límite de información) */
  MAX_VELOCITY: INFORMATION_SPEED_LIMIT * 0.3, // 300 píxeles/segundo
  
  /** Aceleración máxima para evitar saltos bruscos */
  MAX_ACCELERATION: INFORMATION_SPEED_LIMIT * 0.5, // 500 píxeles/segundo²
  
  /** Coeficiente de restitución para rebotes en límites */
  BOUNDARY_RESTITUTION: UNIVERSAL_DAMPING, // ≈ 0.983
  
  /** Factor de escalado para cálculos de fuerza */
  FORCE_SCALE: 1.0
} as const;

// === CONFIGURACIÓN DE ENTIDADES ===

/**
 * Propiedades físicas de las entidades
 */
export const ENTITY_PHYSICS = {
  /** Tamaño visual de entidad (radio para colisiones) */
  SIZE: 16,
  
  /** Masa base de entidades (afecta inercia) */
  BASE_MASS: 1.0,
  
  /** Fricción base aplicada al movimiento */
  BASE_FRICTION: 0.1,
  
  /** Elasticidad para colisiones entre entidades */
  ELASTICITY: GOLDEN_RATIO_CONJUGATE, // ≈ 0.618
  
  /** Momento de inercia base para rotación */
  MOMENT_OF_INERTIA: 1.0
} as const;

// === CONSTANTES DE MOVIMIENTO Y NAVEGACIÓN ===

/**
 * Parámetros que controlan el comportamiento de movimiento
 */
export const MOVEMENT_DYNAMICS = {
  /** 
   * Velocidad base de movimiento
   * Basada en velocidad de caminata humana escalada al mundo del juego
   * Humanos caminan ~1.4 m/s, escalado a píxeles: ~84 píxeles/segundo
   */
  BASE_MOVEMENT_SPEED: 84,
  
  /** 
   * Distancia mínima entre entidades para evitar solapamiento
   * Basada en espacio personal humano (zona íntima: ~45cm)
   * Escalado: 25 píxeles
   */
  MIN_DISTANCE_BETWEEN_ENTITIES: 25,
  
  /** 
   * Fuerza de repulsión cuando están muy cerca
   * Basada en la proporción áurea para comportamiento natural
   */
  REPULSION_FORCE: GOLDEN_RATIO_CONJUGATE * 3, // ≈ 1.85
  
  /** 
   * Distancia máxima para búsqueda de compañero
   * Basada en campo visual humano efectivo
   */
  COMPANION_SEEK_DISTANCE: 200,
  
  /** 
   * Radio de detección de obstáculos
   * Debe ser mayor que el radio de entidad para prevención
   */
  OBSTACLE_DETECTION_RADIUS: ENTITY_PHYSICS.SIZE * SQRT_2, // ≈ 22.6
  
  /** 
   * Fuerza de evasión de obstáculos
   * Debe ser mayor que repulsión entre entidades
   */
  OBSTACLE_AVOIDANCE_FORCE: GOLDEN_RATIO_CONJUGATE * 6, // ≈ 3.7
  
  /** 
   * Ángulo máximo de cambio de dirección por frame (radianes)
   * Evita giros bruscos antinaturales
   */
  MAX_TURN_RATE: PI / 30, // 6 grados por frame a 60fps
  
  /** 
   * Factor de suavizado para cambios de velocidad
   * Basado en constante de amortiguación universal
   */
  VELOCITY_SMOOTHING: UNIVERSAL_DAMPING, // ≈ 0.983
} as const;

// === CONSTANTES DE CAMPOS VECTORIALES ===

/**
 * Parámetros para simulación de campos de fuerza complejos
 */
export const VECTOR_FIELD_CONFIG = {
  /** 
   * Constante gravitacional simulada para atracción
   * Escalada para el mundo del juego
   */
  GRAVITATIONAL_CONSTANT: 6.674e-7, // Escalado de G real
  
  /** 
   * Intensidad base del campo vectorial
   * Multiplicador global para todos los efectos de campo
   */
  FIELD_STRENGTH_BASE: 1.0,
  
  /** 
   * Escala de turbulencia para ruido Perlin
   * Valor pequeño = variaciones suaves, grande = caótico
   */
  TURBULENCE_SCALE: 0.01,
  
  /** 
   * Viscosidad del flujo de campo
   * Afecta qué tan "pegajoso" es el flujo
   */
  FLOW_VISCOSITY: MEDIUM_VISCOSITY, // ≈ 0.618
  
  /** 
   * Exponente de decaimiento de influencia de zona
   * Controla qué tan rápido decae el efecto con la distancia
   */
  ZONE_INFLUENCE_DECAY: 2.0,
  
  /** 
   * Multiplicador de resonancia de zona
   * Basado en √2 para efectos naturales
   */
  ZONE_RESONANCE_MULTIPLIER: SQRT_2, // ≈ 1.414
  
  /** 
   * Intensidad de campo de zona
   * Fuerza base que ejercen las zonas
   */
  ZONE_FIELD_STRENGTH: 0.25
} as const;

// === CONFIGURACIÓN DE COLISIONES ===

/**
 * Parámetros para detección y resolución de colisiones
 */
export const COLLISION_SYSTEM = {
  /** 
   * Radio combinado mínimo para considerar colisión
   * Suma de radios de entidades + margen de seguridad
   */
  MIN_COLLISION_DISTANCE: ENTITY_PHYSICS.SIZE * 2,
  
  /** 
   * Factor de separación tras colisión
   * Qué tan rápido se separan las entidades
   */
  SEPARATION_FORCE_FACTOR: 0.5,
  
  /** 
   * Umbral de velocidad para considerar colisión activa
   * Evita cálculos innecesarios para objetos casi estáticos
   */
  COLLISION_VELOCITY_THRESHOLD: 10, // píxeles/segundo
  
  /** 
   * Número máximo de iteraciones para resolver colisión
   * Evita bucles infinitos en casos complejos
   */
  MAX_COLLISION_ITERATIONS: 3,
  
  /** 
   * Factor de amortiguación en colisiones
   * Reduce velocidad tras impacto para estabilidad
   */
  COLLISION_DAMPING: UNIVERSAL_DAMPING * 0.95 // ≈ 0.934
} as const;

// === CONFIGURACIÓN DE ZONAS ===

/**
 * Parámetros que controlan el comportamiento de zonas
 */
export const ZONE_DYNAMICS = {
  /** 
   * Radio de influencia base para zonas pequeñas
   * Basado en espacio personal extendido
   */
  BASE_INFLUENCE_RADIUS: 50,
  
  /** 
   * Factor de escala para zonas grandes
   * Multiplica el radio base según el tamaño de zona
   */
  SIZE_SCALE_FACTOR: GOLDEN_RATIO_CONJUGATE, // ≈ 0.618
  
  /** 
   * Intensidad base de atracción de zona
   * Fuerza que ejerce una zona sobre entidades cercanas
   */
  BASE_ATTRACTION_STRENGTH: 15,
  
  /** 
   * Tiempo de "memoria" de zona (frames)
   * Cuánto tiempo recuerda una zona que una entidad la visitó
   */
  MEMORY_DURATION_FRAMES: 300, // 5 segundos a 60fps
  
  /** 
   * Factor de saturación de zona
   * Reduce efectividad cuando hay muchas entidades
   */
  SATURATION_FACTOR: 0.8,
  
  /** 
   * Radio de efecto de múltiples entidades en zona
   * Para calcular bonos/penalizaciones por crowding
   */
  MULTI_ENTITY_RADIUS: ENTITY_PHYSICS.SIZE * 4 // ≈ 64
} as const;

// === SISTEMA DE PATHFINDING ===

/**
 * Configuración para navegación inteligente
 */
export const PATHFINDING_CONFIG = {
  /** 
   * Tamaño de grid para navegación
   * Compromiso entre precisión y rendimiento
   */
  GRID_SIZE: 20,
  
  /** 
   * Distancia máxima para buscar camino directo
   * Antes de usar pathfinding complejo
   */
  DIRECT_PATH_MAX_DISTANCE: 100,
  
  /** 
   * Número máximo de nodos a explorar en A*
   * Límite para evitar lag en casos complejos
   */
  MAX_PATHFINDING_NODES: 200,
  
  /** 
   * Factor de heurística para A*
   * Balance entre velocidad y optimalidad
   */
  HEURISTIC_WEIGHT: 1.2,
  
  /** 
   * Distancia mínima al objetivo para considerar "llegada"
   * Evita oscilaciones alrededor del punto objetivo
   */
  ARRIVAL_THRESHOLD: ENTITY_PHYSICS.SIZE / 2, // ≈ 8
  
  /** 
   * Factor de suavizado de camino
   * Reduce zigzags en rutas generadas
   */
  PATH_SMOOTHING_FACTOR: 0.3
} as const;

// === CONFIGURACIÓN DE PREDICCIÓN COMPORTAMENTAL ===

/**
 * Parámetros para análisis y predicción de patrones
 */
export const BEHAVIOR_PREDICTION = {
  /** 
   * Profundidad de memoria para análisis de patrones
   * Número de acciones pasadas a considerar
   */
  PATTERN_MEMORY_DEPTH: 100,
  
  /** 
   * Umbral de confianza mínima para predicciones
   * Solo usa predicciones si superan este umbral
   */
  PREDICTION_CONFIDENCE_THRESHOLD: 0.75,
  
  /** 
   * Inercia comportamental
   * Resistencia al cambio de actividad
   */
  BEHAVIORAL_MOMENTUM: UNIVERSAL_DAMPING * 0.9, // ≈ 0.885
  
  /** 
   * Sensibilidad para detección de caos
   * Umbral para identificar comportamiento caótico
   */
  CHAOS_SENSITIVITY: 1e-6,
  
  /** 
   * Horizonte de predicción temporal (ms)
   * Qué tan lejos en el futuro predecir
   */
  PREDICTION_TIME_HORIZON: 5000, // 5 segundos
  
  /** 
   * Factor de decaimiento de peso de acciones pasadas
   * Acciones más recientes tienen más peso
   */
  TEMPORAL_WEIGHT_DECAY: Math.exp(-1/50) // ≈ 0.98
} as const;

// === CONFIGURACIÓN DE RESONANCIA ARMÓNICA ===

/**
 * Parámetros para resonancia entre entidades
 */
export const HARMONIC_RESONANCE = {
  /** 
   * Frecuencia base para resonancia armónica (Hz)
   * Basada en La 440Hz - estándar musical
   */
  BASE_FREQUENCY: 440.0,
  
  /** 
   * Ratios armónicos basados en serie de Fibonacci
   * Genera frecuencias que suenan naturales
   */
  HARMONIC_RATIOS: FIBONACCI_SEQUENCE.slice(0, 6).map(n => n / FIBONACCI_SEQUENCE[0]),
  
  /** 
   * Factor de decaimiento natural de resonancia
   * Basado en amortiguación crítica
   */
  RESONANCE_DECAY_NATURAL: Math.exp(-1/1000), // ≈ 0.999
  
  /** 
   * Intensidad base de armónicos
   * Amplitud inicial de componentes armónicos
   */
  HARMONIC_BASE_AMPLITUDE: 0.8,
  
  /** 
   * Factor de decaimiento de armónicos por orden
   * Armónicos superiores son más débiles
   */
  HARMONIC_DECAY_FACTOR: 0.7,
  
  /** 
   * Umbral para efectos emergentes
   * Nivel de resonancia necesario para emergencia
   */
  EMERGENCE_THRESHOLD: GOLDEN_RATIO_CONJUGATE // ≈ 0.618
} as const;

// === CONFIGURACIÓN DE LÍMITES DEL MUNDO ===

/**
 * Dimensiones y límites del mundo de juego
 */
export const WORLD_BOUNDS = {
  /** Ancho del mundo de juego */
  WIDTH: 1000,
  
  /** Alto del mundo de juego */
  HEIGHT: 600,
  
  /** Margen de seguridad cerca de los bordes */
  EDGE_MARGIN: 20,
  
  /** Fuerza de "rebote" en los bordes */
  EDGE_REPULSION_FORCE: 50
} as const;

// === CONFIGURACIÓN DE PARTÍCULAS ===

/**
 * Sistema de partículas para efectos visuales
 */
export const PARTICLE_SYSTEM = {
  /** Número máximo de partículas simultáneas */
  MAX_PARTICLES: 50,
  
  /** Tiempo de vida base de partículas (ms) */
  BASE_LIFETIME: 1500,
  
  /** Variación en tiempo de vida (±ms) */
  LIFETIME_VARIATION: 500,
  
  /** Tamaño base de partículas */
  BASE_SIZE: 2,
  
  /** Variación en tamaño */
  SIZE_VARIATION: 1,
  
  /** Velocidad inicial de partículas */
  INITIAL_VELOCITY: 20,
  
  /** Factor de decaimiento de tamaño */
  SIZE_DECAY_RATE: 0.99,
  
  /** Factor de decaimiento de opacidad */
  OPACITY_DECAY_RATE: 0.98
} as const;

// === VALIDACIÓN DEL SISTEMA DE FÍSICA ===

/**
 * Valida que las constantes de física sean coherentes
 */
export function validatePhysicsConstants(): boolean {
  const validations = [
    // Velocidades y aceleraciones deben ser positivas
    PHYSICS_WORLD.MAX_VELOCITY > 0,
    PHYSICS_WORLD.MAX_ACCELERATION > 0,
    MOVEMENT_DYNAMICS.BASE_MOVEMENT_SPEED > 0,
    
    // La velocidad máxima debe ser mayor que la velocidad base
    PHYSICS_WORLD.MAX_VELOCITY > MOVEMENT_DYNAMICS.BASE_MOVEMENT_SPEED,
    
    // Las distancias deben ser lógicas
    MOVEMENT_DYNAMICS.MIN_DISTANCE_BETWEEN_ENTITIES > 0,
    MOVEMENT_DYNAMICS.COMPANION_SEEK_DISTANCE > MOVEMENT_DYNAMICS.MIN_DISTANCE_BETWEEN_ENTITIES,
    MOVEMENT_DYNAMICS.OBSTACLE_DETECTION_RADIUS > ENTITY_PHYSICS.SIZE,
    
    // Los factores de amortiguación deben estar entre 0 y 1
    UNIVERSAL_DAMPING > 0 && UNIVERSAL_DAMPING <= 1,
    COLLISION_SYSTEM.COLLISION_DAMPING > 0 && COLLISION_SYSTEM.COLLISION_DAMPING <= 1,
    
    // Los límites del mundo deben ser positivos
    WORLD_BOUNDS.WIDTH > 0,
    WORLD_BOUNDS.HEIGHT > 0,
    WORLD_BOUNDS.EDGE_MARGIN > 0,
    
    // Las configuraciones de partículas deben ser válidas
    PARTICLE_SYSTEM.MAX_PARTICLES > 0,
    PARTICLE_SYSTEM.BASE_LIFETIME > 0,
    PARTICLE_SYSTEM.BASE_SIZE > 0,
    
    // Los coeficientes deben estar en rangos válidos
    ENTITY_PHYSICS.ELASTICITY > 0 && ENTITY_PHYSICS.ELASTICITY <= 1,
    PHYSICS_WORLD.BOUNDARY_RESTITUTION > 0 && PHYSICS_WORLD.BOUNDARY_RESTITUTION <= 1
  ];

  return validations.every(v => v === true);
}

// Validar al cargar el módulo en desarrollo
if (import.meta.env.DEV) {
  if (!validatePhysicsConstants()) {
    console.error('❌ Physics constants validation failed!');
  } else {
    console.log('✅ Physics constants validated successfully');
  }
}