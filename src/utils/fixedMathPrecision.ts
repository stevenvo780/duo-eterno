/**
 * 🔧 CORRECCIÓN DE MATEMÁTICAS DE PRECISIÓN
 * 
 * Versión corregida de mathPrecision.ts que resuelve problemas críticos:
 * - Elimina sesgos en redondeo
 * - Usa seed determinista para ruido
 * - Corrige validaciones numéricas
 * - Mejora cálculos de coherencia
 */

import { 
  MATH
} from '../constants';

/**
 * Redondeo de alta precisión SIN sesgo epsilon
*/
export const preciseRound = (value: number, decimals: number = 6): number => {
  if (!isFinite(value)) return value;
  
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Comparación de números con tolerancia mejorada
*/
export const areEqual = (a: number, b: number, epsilon: number = MATH.HIGH_PRECISION_EPSILON): boolean => {
  if (a === b) return true;
  
  const diff = Math.abs(a - b);
  

  if (Math.abs(a) < MATH.EFFECTIVE_ZERO && Math.abs(b) < MATH.EFFECTIVE_ZERO) {
    return diff <= epsilon;
  }
  

  const maxValue = Math.max(Math.abs(a), Math.abs(b));
  return diff <= epsilon * maxValue;
};

/**
 * Clamp seguro con mejor manejo de edge cases
*/
export const safeClamp = (value: number, min: number, max: number): number => {

  if (!isFinite(min) || !isFinite(max)) {
    console.warn(`🔧 safeClamp: límites no finitos (min: ${min}, max: ${max})`);
    return isFinite(value) ? value : 0;
  }
  
  if (min > max) {
    [min, max] = [max, min];
  }
  
  if (!isFinite(value)) {
    return (min + max) / 2;
  }
  
  return Math.max(min, Math.min(max, value));
};

/**
 * Normalización robusta mejorada
*/
export const safeNormalize = (value: number, min: number, max: number): number => {
  if (!isFinite(value) || !isFinite(min) || !isFinite(max)) {
    return 0.5;
  }
  
  if (areEqual(min, max, MATH.ULTRA_PRECISION_EPSILON)) {
    return 0.5;
  }
  
  const range = max - min;
  const normalized = (value - min) / range;
  
  return safeClamp(normalized, 0, 1);
};



/**
 * Generador de ruido Perlin con seed determinista
 */
class DeterministicNoise {
  private permutation: number[];
  
  constructor(seed: number = 42) {
    this.permutation = this.generatePermutation(seed);
  }
  
  /**
   * Genera tabla de permutación determinista basada en seed
   */
  private generatePermutation(seed: number): number[] {
    let state = Math.abs(seed) % 2147483647; // Max safe 32-bit integer
    const a = 1664525;
    const c = 1013904223;
    const m = 2147483647; // Usar valor más seguro
    
    const random = () => {
      state = (a * state + c) % m;
      return state / m;
    };
    

    const base = Array.from({ length: 256 }, (_, i) => i);
    

    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }
    

    return [...base, ...base];
  }
  
  /**
   * Función de fade mejorada (quintic)
   */
  private fade(t: number): number {

    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  /**
   * Función de gradiente determinista
   */
  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14 ? x : 0);
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  /**
   * Ruido Perlin 2D determinista
   */
  public noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const A = this.permutation[X] + Y;
    const B = this.permutation[X + 1] + Y;
    
    return this.lerp(v,
      this.lerp(u, this.grad(this.permutation[A], x, y), 
                   this.grad(this.permutation[B], x - 1, y)),
      this.lerp(u, this.grad(this.permutation[A + 1], x, y - 1),
                   this.grad(this.permutation[B + 1], x - 1, y - 1))
    );
  }
  
  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }
}


const globalNoise = new DeterministicNoise(12345);

/**
 * Función de ruido determinista pública
 */
export const deterministicNoise = (x: number, y: number): number => {
  return globalNoise.noise2D(x, y);
};

/**
 * Función de ruido híbrido que permite variabilidad controlada
 * Para casos donde se necesita balance entre determinismo y naturalidad
*/
export const balancedNoise = (x: number, y: number, variabilityFactor: number = 0.3, seed: number = 54321): number => {
  if (!validateNumber(x, 'balancedNoise.x') || !validateNumber(y, 'balancedNoise.y')) {
    return 0;
  }
  
  const deterministicComponent = globalNoise.noise2D(x, y);
  
  if (variabilityFactor > 0 && variabilityFactor <= 1) {
    const variabilityNoise = new DeterministicNoise(seed);
    const variableComponent = (variabilityNoise.noise2D(x * 0.1, y * 0.1) + 1) * 0.5; // Normalizar a [0,1]
    return deterministicComponent * (1 - variabilityFactor) + variableComponent * variabilityFactor;
  }
  
  return deterministicComponent;
};



/**
 * Cálculo de coherencia temporal robusto
*/
export const calculateCoherence = (history: number[]): number => {
  if (history.length < 3) return 0.5;
  

  const validHistory = history.filter(isFinite);
  if (validHistory.length < 3) return 0.2;
  
  const n = validHistory.length;
  const mean = validHistory.reduce((sum, val) => sum + val, 0) / n;
  

  const variance = validHistory.reduce((sum, val) => {
    const diff = val - mean;
    return sum + diff * diff;
  }, 0) / (n - 1);
  

  if (variance < MATH.ULTRA_PRECISION_EPSILON) {
    return 1.0;
  }
  

  let numerator = 0;
  for (let i = 1; i < n; i++) {
    numerator += (validHistory[i] - mean) * (validHistory[i - 1] - mean);
  }
  
  const autocorr = numerator / ((n - 1) * variance);
  

  return safeClamp(Math.abs(autocorr), 0, 1);
};



/**
 * Interpolación lineal estándar
 */
export const lerp = (start: number, end: number, t: number): number => {
  const clampedT = safeClamp(t, 0, 1);
  return start + (end - start) * clampedT;
};

/**
 * Interpolación exponencial mejorada
*/
export const expLerp = (
  current: number, 
  target: number, 
  factor: number, 
  deltaTime: number
): number => {
  if (!isFinite(current) || !isFinite(target)) {
    return isFinite(target) ? target : (isFinite(current) ? current : 0);
  }
  
  const clampedFactor = safeClamp(factor, 0, 1);
  

  const normalizedDelta = deltaTime / (1000 / 60);
  

  const adjustedFactor = 1 - Math.pow(1 - clampedFactor, normalizedDelta);
  
  return lerp(current, target, adjustedFactor);
};



const easingFunctions = {

  easeInQuart: (t: number): number => {
    const clamped = safeClamp(t, 0, 1);
    return clamped * clamped * clamped * clamped;
  },
  

  easeOutQuart: (t: number): number => {
    const clamped = safeClamp(t, 0, 1);
    const inverted = 1 - clamped;
    return 1 - inverted * inverted * inverted * inverted;
  },
  

  easeInOutQuart: (t: number): number => {
    const clamped = safeClamp(t, 0, 1);
    return clamped < 0.5 
      ? 8 * clamped * clamped * clamped * clamped
      : 1 - 8 * Math.pow(1 - clamped, 4);
  },
  

  sigmoid: (t: number, steepness: number = 10): number => {
    const clamped = safeClamp(t, 0, 1);
    const clampedSteep = safeClamp(steepness, 0.1, 50);
    
    const shifted = (clamped - 0.5) * clampedSteep;
    return 1 / (1 + Math.exp(-shifted));
  }
} as const;



export interface Vector2D {
  x: number;
  y: number;
}

const vectorMath = {
  magnitude: (vector: Vector2D): number => {
    if (!isFinite(vector.x) || !isFinite(vector.y)) return 0;
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  },
  
  normalize: (vector: Vector2D): Vector2D => {
    const mag = vectorMath.magnitude(vector);
    if (mag < MATH.ULTRA_PRECISION_EPSILON) {
      return { x: 0, y: 0 };
    }
    return { x: vector.x / mag, y: vector.y / mag };
  },
  
  distance: (a: Vector2D, b: Vector2D): number => {
    if (!isFinite(a.x) || !isFinite(a.y) || !isFinite(b.x) || !isFinite(b.y)) {
      return 0;
    }
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  
  lerp: (start: Vector2D, end: Vector2D, t: number): Vector2D => {
    const clampedT = safeClamp(t, 0, 1);
    return {
      x: lerp(start.x, end.x, clampedT),
      y: lerp(start.y, end.y, clampedT)
    };
  },
  
  rotate: (vector: Vector2D, angle: number): Vector2D => {
    if (!isFinite(angle)) return { ...vector };
    
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: vector.x * cos - vector.y * sin,
      y: vector.x * sin + vector.y * cos
    };
  }
} as const;



/**
 * Validador numérico robusto
*/
export const validateNumber = (
  value: number, 
  context: string = 'unknown',
  options: {
    allowZero?: boolean;
    allowNegative?: boolean;
    maxAbsValue?: number;
    silent?: boolean; // NUEVO: Para evitar spam en producción
  } = {}
): boolean => {
  const { allowZero = true, allowNegative = true, maxAbsValue = 1e12, silent = false } = options;
  
  const shouldLog = !silent && (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test');
  
  if (!isFinite(value)) {
    if (shouldLog) console.error(`🔧 Valor no finito en ${context}: ${value}`);
    return false;
  }
  
  if (!allowZero && Math.abs(value) < MATH.EFFECTIVE_ZERO) {
    if (shouldLog) console.warn(`🔧 Valor demasiado cercano a cero en ${context}: ${value}`);
    return false;
  }
  
  if (!allowNegative && value < 0) {
    if (shouldLog) console.warn(`🔧 Valor negativo no permitido en ${context}: ${value}`);
    return false;
  }
  
  if (Math.abs(value) > maxAbsValue) {
    if (shouldLog) console.warn(`🔧 Valor demasiado grande en ${context}: ${value} (máximo: ${maxAbsValue})`);
    return false;
  }
  
  return true;
};



/**
 * Cálculo de resonancia mejorado
*/
export const calculateResonance = (
  entityDistance: number,
  harmonyLevel: number,
  timeBonus: number = 0,
  baseResonance: number = 50
): number => {

  if (!validateNumber(entityDistance, 'entityDistance', { allowNegative: false })) {
    return 0;
  }
  
  if (!validateNumber(harmonyLevel, 'harmonyLevel', { allowNegative: false, maxAbsValue: 100 })) {
    harmonyLevel = safeClamp(harmonyLevel, 0, 100);
  }
  
  if (!validateNumber(baseResonance, 'baseResonance', { allowNegative: false, maxAbsValue: 100 })) {
    baseResonance = 50;
  }
  

  const maxDistance = 500;
  const normalizedDistance = Math.log(1 + entityDistance / maxDistance) / Math.log(2);
  

  const proximityFactor = Math.exp(-normalizedDistance * 2);
  

  const harmonyFactor = easingFunctions.sigmoid(harmonyLevel / 100, 6);
  

  const timeFactor = timeBonus > 0 ? Math.exp(-timeBonus / 5000) * 15 : 0;
  

  const resonanceRaw = baseResonance + 
    (proximityFactor * 25 * MATH.GOLDEN_RATIO_CONJUGATE) + 
    (harmonyFactor * 20) + 
    timeFactor;
  
  return preciseRound(safeClamp(resonanceRaw, 0, 100), 3);
};



export const fixedMathUtils = {

  preciseRound,
  areEqual,
  safeClamp,
  safeNormalize,
  

  lerp,
  expLerp,
  

  calculateResonance,
  calculateCoherence,
  

  validateNumber,
  

  deterministicNoise,
  balancedNoise
} as const;

export { easingFunctions, vectorMath };
