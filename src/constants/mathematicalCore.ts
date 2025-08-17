/**
 * 🧮 CONSTANTES MATEMÁTICAS FUNDAMENTALES
 * 
 * Valores basados en principios matemáticos universales que NO deben cambiar.
 * Estas constantes forman la base de todos los cálculos del sistema.
 */

// === CONSTANTES MATEMÁTICAS UNIVERSALES ===

/**
 * Número áureo φ (phi) = 1.618033988749...
 * Fundamental para proporciones naturales y resonancia armónica
 */
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

/**
 * Conjugado del número áureo = 0.618033988749...
 * Usado para decaimiento natural y efectos de zona
 */
export const GOLDEN_RATIO_CONJUGATE = (Math.sqrt(5) - 1) / 2;

/**
 * Euler's number e = 2.718281828459...
 * Base para todos los decaimientos exponenciales
 */
export const EULER = Math.E;

/**
 * Pi = 3.141592653589...
 * Para cálculos circulares, ondas y resonancia
 */
export const PI = Math.PI;

/**
 * Raíz cuadrada de 2 = 1.414213562373...
 * Para normalizaciones y efectos de zona diagonales
 */
export const SQRT_2 = Math.sqrt(2);

/**
 * Logaritmo natural de 2 = 0.693147180559...
 * Para cálculos de vida media y decaimiento
 */
export const LN_2 = Math.log(2);

// === PRECISIÓN Y TOLERANCIAS ===

/**
 * Epsilon de máquina - mínima diferencia representable
 */
export const MACHINE_EPSILON = Number.EPSILON;

/**
 * Epsilon de alta precisión para comparaciones críticas
 */
export const HIGH_PRECISION_EPSILON = 1e-10;

/**
 * Epsilon ultra-preciso para cálculos científicos
 */
export const ULTRA_PRECISION_EPSILON = 1e-15;

/**
 * Umbral mínimo para considerarse "cero efectivo"
 */
export const EFFECTIVE_ZERO = 1e-8;

// === SECUENCIAS MATEMÁTICAS ===

/**
 * Secuencia de Fibonacci hasta el término 12
 * Usada para generación de armónicos naturales
 */
export const FIBONACCI_SEQUENCE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144] as const;

/**
 * Ratios armónicos naturales basados en la serie harmónica
 * Frecuencias que suenan "naturales" al oído humano
 */
export const HARMONIC_RATIOS = [
  1.0,    // Fundamental
  1.125,  // Segunda mayor
  1.25,   // Tercera mayor
  1.333,  // Cuarta perfecta
  1.5,    // Quinta perfecta
  1.667,  // Sexta mayor
  1.875,  // Séptima mayor
  2.0     // Octava
] as const;

// === CONSTANTES DE FÍSICA FUNDAMENTAL ===

/**
 * Velocidad base de propagación de "información" en el sistema
 * Equivalente a c en física, limita velocidades máximas
 */
export const INFORMATION_SPEED_LIMIT = 1000; // píxeles por segundo

/**
 * Constante de amortiguación universal
 * Basada en el número e para decaimiento natural
 */
export const UNIVERSAL_DAMPING = Math.exp(-1/60); // ~0.9835 para 60fps

/**
 * Factor de viscosidad del "medio" donde se mueven las entidades
 * Basado en la proporción áurea para comportamiento natural
 */
export const MEDIUM_VISCOSITY = GOLDEN_RATIO_CONJUGATE; // ~0.618

// === CONSTANTES DE RESONANCIA ARMÓNICA ===

/**
 * Frecuencia base del sistema (Hz)
 * La 440Hz - estándar musical occidental
 */
export const BASE_FREQUENCY = 440.0;

/**
 * Factor de decaimiento natural de resonancia
 * Basado en el coeficiente de amortiguación crítico
 */
export const RESONANCE_DECAY_NATURAL = Math.exp(-LN_2 / 100); // ~0.99307

/**
 * Umbral de emergencia para efectos complejos
 * Basado en el número áureo conjugado
 */
export const EMERGENCE_THRESHOLD = GOLDEN_RATIO_CONJUGATE;

// === CONSTANTES DE TIEMPO NATURAL ===

/**
 * Duración de un "ciclo natural" en milisegundos
 * Basado en el ritmo cardíaco humano promedio (60-100 bpm)
 * 1000ms = 60 bpm (1 latido por segundo)
 */
export const NATURAL_CYCLE_MS = 1000;

/**
 * Tiempo de "respiración" del sistema
 * Basado en la respiración humana promedio (12-20 rpm)
 * 4000ms = 15 rpm (1 respiración cada 4 segundos)
 */
export const BREATHING_CYCLE_MS = 4000;

/**
 * Ventana de atención natural
 * Basada en estudios de psicología cognitiva (7±2 segundos)
 */
export const ATTENTION_SPAN_MS = 7000;

// === VALIDACIÓN DE CONSTANTES ===

/**
 * Valida que todas las constantes matemáticas sean correctas
 * Útil para testing y debugging
 */
export function validateMathematicalConstants(): boolean {
  const validations = [
    Math.abs(GOLDEN_RATIO - 1.618033988749) < HIGH_PRECISION_EPSILON,
    Math.abs(GOLDEN_RATIO_CONJUGATE - 0.618033988749) < HIGH_PRECISION_EPSILON,
    Math.abs(EULER - 2.718281828459) < HIGH_PRECISION_EPSILON,
    Math.abs(SQRT_2 - 1.414213562373) < HIGH_PRECISION_EPSILON,
    Math.abs(LN_2 - 0.693147180559) < HIGH_PRECISION_EPSILON,
    FIBONACCI_SEQUENCE.length === 12,
    HARMONIC_RATIOS.length === 8,
    BASE_FREQUENCY === 440.0,
    NATURAL_CYCLE_MS === 1000,
    BREATHING_CYCLE_MS === 4000,
    ATTENTION_SPAN_MS === 7000
  ];

  return validations.every(v => v === true);
}

// Validar al cargar el módulo en desarrollo
if (import.meta.env.DEV) {
  if (!validateMathematicalConstants()) {
    console.error('❌ Mathematical constants validation failed!');
  } else {
    console.log('✅ Mathematical constants validated successfully');
  }
}