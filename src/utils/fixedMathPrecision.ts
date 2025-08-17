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

// === FUNCIONES DE PRECISIÓN CORREGIDAS ===

/**
 * Redondeo de alta precisión SIN sesgo epsilon
 * CORRIGIDO: Elimina la adición de epsilon que causaba sesgo
 */
export const preciseRound = (value: number, decimals: number = 6): number => {
  if (!isFinite(value)) return value;
  
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Comparación de números con tolerancia mejorada
 * CORRIGIDO: Usa epsilon relativo para números grandes
 */
export const areEqual = (a: number, b: number, epsilon: number = MATH.HIGH_PRECISION_EPSILON): boolean => {
  if (a === b) return true; // Optimización para casos exactos
  
  const diff = Math.abs(a - b);
  
  // Para números cercanos a cero, usar epsilon absoluto
  if (Math.abs(a) < MATH.EFFECTIVE_ZERO && Math.abs(b) < MATH.EFFECTIVE_ZERO) {
    return diff <= epsilon;
  }
  
  // Para números mayores, usar epsilon relativo
  const maxValue = Math.max(Math.abs(a), Math.abs(b));
  return diff <= epsilon * maxValue;
};

/**
 * Clamp seguro con mejor manejo de edge cases
 * CORRIGIDO: Mejor validación y logging condicional
 */
export const safeClamp = (value: number, min: number, max: number): number => {
  // Validar parámetros
  if (!isFinite(min) || !isFinite(max)) {
    console.warn(`🔧 safeClamp: límites no finitos (min: ${min}, max: ${max})`);
    return isFinite(value) ? value : 0;
  }
  
  if (min > max) {
    [min, max] = [max, min]; // Intercambio silencioso para mejor UX
  }
  
  if (!isFinite(value)) {
    return (min + max) / 2; // Punto medio como fallback
  }
  
  return Math.max(min, Math.min(max, value));
};

/**
 * Normalización robusta mejorada
 * CORRIGIDO: Mejor manejo de rangos pequeños
 */
export const safeNormalize = (value: number, min: number, max: number): number => {
  if (!isFinite(value) || !isFinite(min) || !isFinite(max)) {
    return 0.5; // Valor seguro por defecto
  }
  
  if (areEqual(min, max, MATH.ULTRA_PRECISION_EPSILON)) {
    return 0.5; // Rango cero
  }
  
  const range = max - min;
  const normalized = (value - min) / range;
  
  return safeClamp(normalized, 0, 1);
};

// === GENERADOR DE RUIDO DETERMINISTA ===

/**
 * Generador de ruido Perlin con seed determinista
 * CORRIGIDO: Elimina Math.random() no determinista
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
    // Generador congruencial lineal simple pero efectivo
    let state = seed;
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    
    const random = () => {
      state = (a * state + c) % m;
      return state / m;
    };
    
    // Crear array base [0, 1, 2, ..., 255]
    const base = Array.from({ length: 256 }, (_, i) => i);
    
    // Shuffle usando Fisher-Yates con generador determinista
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }
    
    // Duplicar para evitar overflow
    return [...base, ...base];
  }
  
  /**
   * Función de fade mejorada (quintic)
   */
  private fade(t: number): number {
    // Quintic fade: 6t^5 - 15t^4 + 10t^3
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

// Instancia global con seed fijo para reproducibilidad
const globalNoise = new DeterministicNoise(12345);

/**
 * Función de ruido determinista pública
 * CORRIGIDO: Reemplaza la función no determinista anterior
 */
export const deterministicNoise = (x: number, y: number): number => {
  return globalNoise.noise2D(x, y);
};

/**
 * Función de ruido híbrido que permite variabilidad controlada
 * Para casos donde se necesita balance entre determinismo y naturalidad
 */
export const balancedNoise = (x: number, y: number, variabilityFactor: number = 0.3): number => {
  const deterministicComponent = globalNoise.noise2D(x, y);
  
  // Solo agregar variabilidad real si se solicita explícitamente
  if (variabilityFactor > 0 && variabilityFactor <= 1) {
    // Usar Math.random() SOLO para el componente variable con factor controlado
    const variableComponent = Math.random();
    return deterministicComponent * (1 - variabilityFactor) + variableComponent * variabilityFactor;
  }
  
  return deterministicComponent;
};

// === CÁLCULOS DE COHERENCIA MEJORADOS ===

/**
 * Cálculo de coherencia temporal robusto
 * CORRIGIDO: Mejor manejo de datos ruidosos y casos edge
 */
export const calculateCoherence = (history: number[]): number => {
  if (history.length < 3) return 0.5;
  
  // Filtrar valores no finitos
  const validHistory = history.filter(isFinite);
  if (validHistory.length < 3) return 0.2; // Baja coherencia para datos inválidos
  
  const n = validHistory.length;
  const mean = validHistory.reduce((sum, val) => sum + val, 0) / n;
  
  // Calcular varianza con corrección de Bessel (n-1)
  const variance = validHistory.reduce((sum, val) => {
    const diff = val - mean;
    return sum + diff * diff;
  }, 0) / (n - 1);
  
  // Manejar varianza cero o muy pequeña
  if (variance < MATH.ULTRA_PRECISION_EPSILON) {
    return 1.0; // Perfectamente coherente (sin variación)
  }
  
  // Autocorrelación de lag-1 con mejor estabilidad numérica
  let numerator = 0;
  for (let i = 1; i < n; i++) {
    numerator += (validHistory[i] - mean) * (validHistory[i - 1] - mean);
  }
  
  const autocorr = numerator / ((n - 1) * variance);
  
  // Convertir a coherencia positiva [0, 1]
  return safeClamp(Math.abs(autocorr), 0, 1);
};

// === INTERPOLACIÓN Y EASING OPTIMIZADOS ===

/**
 * Interpolación lineal estándar
 */
export const lerp = (start: number, end: number, t: number): number => {
  const clampedT = safeClamp(t, 0, 1);
  return start + (end - start) * clampedT;
};

/**
 * Interpolación exponencial mejorada
 * CORRIGIDO: Mejor manejo de deltaTime y factores extremos
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
  
  // Normalizar deltaTime a 60fps como referencia
  const normalizedDelta = deltaTime / (1000 / 60);
  
  // Usar exponencial para suavizado natural
  const adjustedFactor = 1 - Math.pow(1 - clampedFactor, normalizedDelta);
  
  return lerp(current, target, adjustedFactor);
};

// === FUNCIONES DE EASING OPTIMIZADAS ===

const easingFunctions = {
  // Entrada suave con mejor precisión
  easeInQuart: (t: number): number => {
    const clamped = safeClamp(t, 0, 1);
    return clamped * clamped * clamped * clamped;
  },
  
  // Salida suave optimizada
  easeOutQuart: (t: number): number => {
    const clamped = safeClamp(t, 0, 1);
    const inverted = 1 - clamped;
    return 1 - inverted * inverted * inverted * inverted;
  },
  
  // Entrada y salida combinada
  easeInOutQuart: (t: number): number => {
    const clamped = safeClamp(t, 0, 1);
    return clamped < 0.5 
      ? 8 * clamped * clamped * clamped * clamped
      : 1 - 8 * Math.pow(1 - clamped, 4);
  },
  
  // Sigmoid mejorado con mejor control de steepness
  sigmoid: (t: number, steepness: number = 10): number => {
    const clamped = safeClamp(t, 0, 1);
    const clampedSteep = safeClamp(steepness, 0.1, 50); // Evitar valores extremos
    
    const shifted = (clamped - 0.5) * clampedSteep;
    return 1 / (1 + Math.exp(-shifted));
  }
} as const;

// === MATEMÁTICAS VECTORIALES ROBUSTAS ===

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

// === VALIDACIÓN NUMÉRICA MEJORADA ===

/**
 * Validador numérico robusto
 * CORRIGIDO: Mejor detección de casos problemáticos
 */
export const validateNumber = (
  value: number, 
  context: string = 'unknown',
  options: {
    allowZero?: boolean;
    allowNegative?: boolean;
    maxAbsValue?: number;
  } = {}
): boolean => {
  const { allowZero = true, allowNegative = true, maxAbsValue = 1e12 } = options;
  
  // Verificar finitud
  if (!isFinite(value)) {
    console.error(`🔧 Valor no finito en ${context}: ${value}`);
    return false;
  }
  
  // Verificar cero si no está permitido
  if (!allowZero && Math.abs(value) < MATH.EFFECTIVE_ZERO) {
    console.warn(`🔧 Valor demasiado cercano a cero en ${context}: ${value}`);
    return false;
  }
  
  // Verificar negativos si no están permitidos
  if (!allowNegative && value < 0) {
    console.warn(`🔧 Valor negativo no permitido en ${context}: ${value}`);
    return false;
  }
  
  // Verificar magnitud
  if (Math.abs(value) > maxAbsValue) {
    console.warn(`🔧 Valor demasiado grande en ${context}: ${value} (máximo: ${maxAbsValue})`);
    return false;
  }
  
  return true;
};

// === CÁLCULOS DE RESONANCIA CORREGIDOS ===

/**
 * Cálculo de resonancia mejorado
 * CORRIGIDO: Mejor manejo de casos edge y validación
 */
export const calculateResonance = (
  entityDistance: number,
  harmonyLevel: number,
  timeBonus: number = 0,
  baseResonance: number = 50
): number => {
  // Validar inputs
  if (!validateNumber(entityDistance, 'entityDistance', { allowNegative: false })) {
    return 0;
  }
  
  if (!validateNumber(harmonyLevel, 'harmonyLevel', { allowNegative: false, maxAbsValue: 100 })) {
    harmonyLevel = safeClamp(harmonyLevel, 0, 100);
  }
  
  if (!validateNumber(baseResonance, 'baseResonance', { allowNegative: false, maxAbsValue: 100 })) {
    baseResonance = 50;
  }
  
  // Normalizar distancia con función logarítmica más natural
  const maxDistance = 500;
  const normalizedDistance = Math.log(1 + entityDistance / maxDistance) / Math.log(2);
  
  // Factor de proximidad usando función exponencial suave
  const proximityFactor = Math.exp(-normalizedDistance * 2);
  
  // Factor de armonía con sigmoid mejorado
  const harmonyFactor = easingFunctions.sigmoid(harmonyLevel / 100, 6);
  
  // Bonus temporal con decaimiento exponencial
  const timeFactor = timeBonus > 0 ? Math.exp(-timeBonus / 5000) * 15 : 0;
  
  // Combinación usando proportión áurea para naturalidad
  const resonanceRaw = baseResonance + 
    (proximityFactor * 25 * MATH.GOLDEN_RATIO_CONJUGATE) + 
    (harmonyFactor * 20) + 
    timeFactor;
  
  return preciseRound(safeClamp(resonanceRaw, 0, 100), 3);
};

// === EXPORTACIONES CONSOLIDADAS ===

export const fixedMathUtils = {
  // Precisión básica
  preciseRound,
  areEqual,
  safeClamp,
  safeNormalize,
  
  // Interpolación
  lerp,
  expLerp,
  
  // Cálculos específicos
  calculateResonance,
  calculateCoherence,
  
  // Validación
  validateNumber,
  
  // Ruido determinista
  deterministicNoise,
  balancedNoise
} as const;

export { easingFunctions, vectorMath };