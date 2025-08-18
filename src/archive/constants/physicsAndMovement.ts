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



/**
 * Configuración básica de física del mundo
 */
export const PHYSICS_WORLD = {

  GRAVITY: { x: 0, y: 0 },
  

  AIR_RESISTANCE: MEDIUM_VISCOSITY * 0.03,
  

  MAX_TIME_STEP: 1/30,
  

  MAX_VELOCITY: INFORMATION_SPEED_LIMIT * 0.3,
  

  MAX_ACCELERATION: INFORMATION_SPEED_LIMIT * 0.5,
  

  BOUNDARY_RESTITUTION: UNIVERSAL_DAMPING,
  

  FORCE_SCALE: 1.0
} as const;



/**
 * Propiedades físicas de las entidades
 */
export const ENTITY_PHYSICS = {

  SIZE: 16,
  

  BASE_MASS: 1.0,
  

  BASE_FRICTION: 0.1,
  

  ELASTICITY: GOLDEN_RATIO_CONJUGATE,
  

  MOMENT_OF_INERTIA: 1.0
} as const;



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
  REPULSION_FORCE: GOLDEN_RATIO_CONJUGATE * 3,
  
  /** 
   * Distancia máxima para búsqueda de compañero
   * Basada en campo visual humano efectivo
   */
  COMPANION_SEEK_DISTANCE: 200,
  
  /** 
   * Radio de detección de obstáculos
   * Debe ser mayor que el radio de entidad para prevención
   */
  OBSTACLE_DETECTION_RADIUS: ENTITY_PHYSICS.SIZE * SQRT_2,
  
  /** 
   * Fuerza de evasión de obstáculos
   * Debe ser mayor que repulsión entre entidades
   */
  OBSTACLE_AVOIDANCE_FORCE: GOLDEN_RATIO_CONJUGATE * 6,
  
  /** 
   * Ángulo máximo de cambio de dirección por frame (radianes)
   * Evita giros bruscos antinaturales
   */
  MAX_TURN_RATE: PI / 30,
  
  /** 
   * Factor de suavizado para cambios de velocidad
   * Basado en constante de amortiguación universal
   */
  VELOCITY_SMOOTHING: UNIVERSAL_DAMPING,
} as const;



/**
 * Parámetros para simulación de campos de fuerza complejos
 */
export const VECTOR_FIELD_CONFIG = {
  /** 
   * Constante gravitacional simulada para atracción
   * Escalada para el mundo del juego
   */
  GRAVITATIONAL_CONSTANT: 6.674e-7,
  
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
  FLOW_VISCOSITY: MEDIUM_VISCOSITY,
  
  /** 
   * Exponente de decaimiento de influencia de zona
   * Controla qué tan rápido decae el efecto con la distancia
   */
  ZONE_INFLUENCE_DECAY: 2.0,
  
  /** 
   * Multiplicador de resonancia de zona
   * Basado en √2 para efectos naturales
   */
  ZONE_RESONANCE_MULTIPLIER: SQRT_2,
  
  /** 
   * Intensidad de campo de zona
   * Fuerza base que ejercen las zonas
   */
  ZONE_FIELD_STRENGTH: 0.25
} as const;



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
  COLLISION_VELOCITY_THRESHOLD: 10,
  
  /** 
   * Número máximo de iteraciones para resolver colisión
   * Evita bucles infinitos en casos complejos
   */
  MAX_COLLISION_ITERATIONS: 3,
  
  /** 
   * Factor de amortiguación en colisiones
   * Reduce velocidad tras impacto para estabilidad
   */
  COLLISION_DAMPING: UNIVERSAL_DAMPING * 0.95
} as const;



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
  SIZE_SCALE_FACTOR: GOLDEN_RATIO_CONJUGATE,
  
  /** 
   * Intensidad base de atracción de zona
   * Fuerza que ejerce una zona sobre entidades cercanas
   */
  BASE_ATTRACTION_STRENGTH: 15,
  
  /** 
   * Tiempo de "memoria" de zona (frames)
   * Cuánto tiempo recuerda una zona que una entidad la visitó
   */
  MEMORY_DURATION_FRAMES: 300,
  
  /** 
   * Factor de saturación de zona
   * Reduce efectividad cuando hay muchas entidades
   */
  SATURATION_FACTOR: 0.8,
  
  /** 
   * Radio de efecto de múltiples entidades en zona
   * Para calcular bonos/penalizaciones por crowding
   */
  MULTI_ENTITY_RADIUS: ENTITY_PHYSICS.SIZE * 4
} as const;



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
  ARRIVAL_THRESHOLD: ENTITY_PHYSICS.SIZE / 2,
  
  /** 
   * Factor de suavizado de camino
   * Reduce zigzags en rutas generadas
   */
  PATH_SMOOTHING_FACTOR: 0.3
} as const;



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
  BEHAVIORAL_MOMENTUM: UNIVERSAL_DAMPING * 0.9,
  
  /** 
   * Sensibilidad para detección de caos
   * Umbral para identificar comportamiento caótico
   */
  CHAOS_SENSITIVITY: 1e-6,
  
  /** 
   * Horizonte de predicción temporal (ms)
   * Qué tan lejos en el futuro predecir
   */
  PREDICTION_TIME_HORIZON: 5000,
  
  /** 
   * Factor de decaimiento de peso de acciones pasadas
   * Acciones más recientes tienen más peso
   */
  TEMPORAL_WEIGHT_DECAY: Math.exp(-1/50)
} as const;



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
  RESONANCE_DECAY_NATURAL: Math.exp(-1/1000),
  
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
  EMERGENCE_THRESHOLD: GOLDEN_RATIO_CONJUGATE
} as const;



/**
 * Dimensiones y límites del mundo de juego
 */
export const WORLD_BOUNDS = {

  WIDTH: 1000,
  

  HEIGHT: 600,
  

  EDGE_MARGIN: 20,
  

  EDGE_REPULSION_FORCE: 50
} as const;



/**
 * Sistema de partículas para efectos visuales
 */
export const PARTICLE_SYSTEM = {

  MAX_PARTICLES: 50,
  

  BASE_LIFETIME: 1500,
  

  LIFETIME_VARIATION: 500,
  

  BASE_SIZE: 2,
  

  SIZE_VARIATION: 1,
  

  INITIAL_VELOCITY: 20,
  

  SIZE_DECAY_RATE: 0.99,
  

  OPACITY_DECAY_RATE: 0.98
} as const;



/**
 * Valida que las constantes de física sean coherentes
 */
export function validatePhysicsConstants(): boolean {
  const validations = [

    PHYSICS_WORLD.MAX_VELOCITY > 0,
    PHYSICS_WORLD.MAX_ACCELERATION > 0,
    MOVEMENT_DYNAMICS.BASE_MOVEMENT_SPEED > 0,
    

    PHYSICS_WORLD.MAX_VELOCITY > MOVEMENT_DYNAMICS.BASE_MOVEMENT_SPEED,
    

    MOVEMENT_DYNAMICS.MIN_DISTANCE_BETWEEN_ENTITIES > 0,
    MOVEMENT_DYNAMICS.COMPANION_SEEK_DISTANCE > MOVEMENT_DYNAMICS.MIN_DISTANCE_BETWEEN_ENTITIES,
    MOVEMENT_DYNAMICS.OBSTACLE_DETECTION_RADIUS > ENTITY_PHYSICS.SIZE,
    

    UNIVERSAL_DAMPING > 0 && UNIVERSAL_DAMPING <= 1,
    COLLISION_SYSTEM.COLLISION_DAMPING > 0 && COLLISION_SYSTEM.COLLISION_DAMPING <= 1,
    

    WORLD_BOUNDS.WIDTH > 0,
    WORLD_BOUNDS.HEIGHT > 0,
    WORLD_BOUNDS.EDGE_MARGIN > 0,
    

    PARTICLE_SYSTEM.MAX_PARTICLES > 0,
    PARTICLE_SYSTEM.BASE_LIFETIME > 0,
    PARTICLE_SYSTEM.BASE_SIZE > 0,
    

    ENTITY_PHYSICS.ELASTICITY > 0 && ENTITY_PHYSICS.ELASTICITY <= 1,
    PHYSICS_WORLD.BOUNDARY_RESTITUTION > 0 && PHYSICS_WORLD.BOUNDARY_RESTITUTION <= 1
  ];

  return validations.every(v => v === true);
}


if (import.meta.env.DEV) {
  if (!validatePhysicsConstants()) {
    console.error('❌ Physics constants validation failed!');
  } else {
    console.log('✅ Physics constants validated successfully');
  }
}