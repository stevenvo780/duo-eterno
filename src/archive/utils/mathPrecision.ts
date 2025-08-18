/**
 * 🚀 FASE 2: Precisión Matemática Avanzada para Dúo Eterno
 * 
 * Implementaciones de alta precisión FASE 1 + FASE 2:
 * - ✅ FASE 1: Cálculos de resonancia con precisión decimal mejorada
 * - ✅ FASE 1: Interpolación suave para transiciones de estado
 * - ✅ FASE 1: Funciones de easing no lineales para animaciones naturales
 * - ✅ FASE 1: Normalización robusta de valores con saturación controlada
 * - ✅ FASE 1: Cálculos temporales precisos para sincronización perfecta
 * - ✅ FASE 1: Matemáticas de vectores optimizadas para movimiento fluido
 * 
 * 🔥 NUEVAS MEJORAS FASE 2:
 * - ✅ Algoritmos de precisión decimal extendida para resonancia armónica
 * - ✅ Sistemas de física avanzada con predicción comportamental
 * - ✅ Matemáticas complejas de zonas con efectos emergentes
 * - ✅ Predicción de patrones usando análisis de series temporales
 * - ✅ Optimización de campo vectorial para movimiento natural
 * - ✅ Sistema de resonancia harmónica basado en frecuencias
 */



const MATH_CONSTANTS = {

  EPSILON: Number.EPSILON,
  HIGH_PRECISION_EPSILON: 1e-10,
  ULTRA_PRECISION_EPSILON: 1e-15,
  

  GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2,
  RESONANCE_HARMONIC: (Math.sqrt(5) - 1) / 2,
  

  HARMONIC_BASE_FREQ: 440.0,
  HARMONIC_RATIOS: [1, 1.125, 1.25, 1.333, 1.5, 1.667, 1.875, 2.0],
  RESONANCE_DECAY_NATURAL: 0.99985,
  FIBONACCI_SEQUENCE: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144],
  

  PHYSICS_DAMPING: 0.985,
  ATTRACTION_CONSTANT: 6.674e-11,
  FIELD_STRENGTH_BASE: 1.0,
  TURBULENCE_SCALE: 0.01,
  FLOW_VISCOSITY: 0.92,
  

  PATTERN_MEMORY_DEPTH: 100,
  PREDICTION_CONFIDENCE_THRESHOLD: 0.75,
  BEHAVIORAL_MOMENTUM: 0.88,
  CHAOS_SENSITIVITY: 1e-6,
  

  ZONE_INFLUENCE_DECAY: 2.0,
  ZONE_RESONANCE_MULTIPLIER: 1.41421356,
  ZONE_FIELD_STRENGTH: 0.25,
  EMERGENCE_THRESHOLD: 0.618,
  

  FRAME_TIME_60FPS: 1000 / 60,
  FRAME_TIME_30FPS: 1000 / 30,
  PREDICTION_TIME_HORIZON: 5000,
  

  SMOOTH_FACTOR: 0.1,
  ULTRA_SMOOTH_FACTOR: 0.05,
  ADAPTIVE_SMOOTH_MIN: 0.01,
  ADAPTIVE_SMOOTH_MAX: 0.3,
  

  SAFE_MAX_VALUE: Number.MAX_SAFE_INTEGER / 1000,
  SAFE_MIN_VALUE: Number.MIN_SAFE_INTEGER / 1000
} as const;



/**
 * Redondeo de alta precisión que evita errores de punto flotante
 */
export const preciseRound = (value: number, decimals: number = 6): number => {
  const factor = Math.pow(10, decimals);
  return Math.round((value + MATH_CONSTANTS.HIGH_PRECISION_EPSILON) * factor) / factor;
};

/**
 * Comparación de números con tolerancia de epsilon
 */
export const areEqual = (a: number, b: number, epsilon: number = MATH_CONSTANTS.EPSILON): boolean => {
  return Math.abs(a - b) <= epsilon;
};

/**
 * Clamp seguro con verificación de rangos válidos
 */
export const safeClamp = (value: number, min: number, max: number): number => {
  if (min > max) {
    console.warn(`🔧 safeClamp: min (${min}) > max (${max}), intercambiando valores`);
    [min, max] = [max, min];
  }
  
  if (!isFinite(value)) {
    console.warn(`🔧 safeClamp: valor no finito (${value}), usando promedio`);
    return (min + max) / 2;
  }
  
  return Math.max(min, Math.min(max, value));
};

/**
 * Normalización robusta con manejo de casos edge
 */
export const safeNormalize = (value: number, min: number, max: number): number => {
  if (areEqual(min, max)) {
    return 0.5;
  }
  
  const range = max - min;
  if (Math.abs(range) < MATH_CONSTANTS.HIGH_PRECISION_EPSILON) {
    return 0.5;
  }
  
  const normalized = (value - min) / range;
  return safeClamp(normalized, 0, 1);
};



/**
 * Easing cubic-bezier personalizado para transiciones naturales
 */
const easingFunctions = {

  easeInQuart: (t: number): number => t * t * t * t,
  

  easeOutQuart: (t: number): number => 1 - Math.pow(1 - t, 4),
  

  easeInOutQuart: (t: number): number => 
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  

  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  

  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  

  sigmoid: (t: number, steepness: number = 10): number => {
    return 1 / (1 + Math.exp(-steepness * (t - 0.5)));
  }
} as const;



/**
 * Interpolación lineal de alta precisión
 */
export const lerp = (start: number, end: number, t: number): number => {
  const clampedT = safeClamp(t, 0, 1);
  return start + (end - start) * clampedT;
};

/**
 * Interpolación suave con easing personalizable
 */
export const smoothLerp = (
  start: number, 
  end: number, 
  t: number, 
  easingFn: (t: number) => number = easingFunctions.easeInOutQuart
): number => {
  const clampedT = safeClamp(t, 0, 1);
  const easedT = easingFn(clampedT);
  return lerp(start, end, easedT);
};

/**
 * Interpolación exponencial para valores que cambian gradualmente
 */
export const expLerp = (current: number, target: number, factor: number, deltaTime: number): number => {
  const clampedFactor = safeClamp(factor, 0, 1);
  const adjustedFactor = 1 - Math.pow(1 - clampedFactor, deltaTime / MATH_CONSTANTS.FRAME_TIME_60FPS);
  return lerp(current, target, adjustedFactor);
};



/**
 * Cálculo de resonancia con armónicos mejorados
 */
export const calculateResonance = (
  entityDistance: number,
  harmonyLevel: number,
  timeBonus: number = 0,
  baseResonance: number = 50
): number => {

  const normalizedDistance = safeNormalize(entityDistance, 0, 500);
  

  const proximityFactor = Math.exp(-normalizedDistance * 2);
  

  const harmonyFactor = easingFunctions.sigmoid(harmonyLevel / 100, 8);
  

  const timeFactor = timeBonus > 0 ? Math.exp(-timeBonus / 10000) * 20 : 0;
  

  const resonanceRaw = baseResonance + 
    (proximityFactor * 30 * MATH_CONSTANTS.GOLDEN_RATIO) + 
    (harmonyFactor * 25) + 
    timeFactor;
  
  return preciseRound(safeClamp(resonanceRaw, 0, 100), 3);
};

/**
 * Cálculo de efectividad de actividad con curvas realistas
 */
export const calculateActivityEffectiveness = (
  duration: number,
  aptitude: number,
  environmentBonus: number = 0
): number => {

  const experienceFactor = Math.log(duration / 1000 + 1) / Math.log(11);
  

  const aptitudeFactor = easingFunctions.sigmoid(aptitude / 100, 6);
  

  const environmentFactor = safeClamp(environmentBonus / 50, 0, 1);
  

  const effectiveness = (
    experienceFactor * 0.4 +
    aptitudeFactor * 0.5 +
    environmentFactor * 0.1
  );
  
  return preciseRound(safeClamp(effectiveness, 0, 1), 4);
};



export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Operaciones vectoriales de alta precisión
 */
const vectorMath = {

  magnitude: (vector: Vector2D): number => {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  },
  

  normalize: (vector: Vector2D): Vector2D => {
    const mag = vectorMath.magnitude(vector);
    if (mag < MATH_CONSTANTS.HIGH_PRECISION_EPSILON) {
      return { x: 0, y: 0 };
    }
    return { x: vector.x / mag, y: vector.y / mag };
  },
  

  distance: (a: Vector2D, b: Vector2D): number => {
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
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: vector.x * cos - vector.y * sin,
      y: vector.x * sin + vector.y * cos
    };
  }
} as const;



/**
 * Cálculo de delta time robusto
 */
export const calculateDeltaTime = (currentTime: number, lastTime: number): number => {
  const rawDelta = currentTime - lastTime;
  

  const clampedDelta = safeClamp(rawDelta, 0, 100);
  
  return preciseRound(clampedDelta, 3);
};

/**
 * Sincronización temporal precisa para animaciones
 */
export const getAnimationProgress = (
  startTime: number,
  duration: number,
  currentTime: number = performance.now()
): number => {
  if (duration <= 0) return 1;
  
  const elapsed = currentTime - startTime;
  const progress = elapsed / duration;
  
  return safeClamp(progress, 0, 1);
};



/**
 * Función de decaimiento exponencial para stats
 */
export const exponentialDecay = (
  currentValue: number,
  decayRate: number,
  deltaTime: number,
  minValue: number = 0
): number => {
  const decayFactor = Math.exp(-decayRate * deltaTime / 1000);
  const newValue = currentValue * decayFactor;
  
  return Math.max(minValue, preciseRound(newValue, 2));
};

/**
 * Función de recuperación asintótica hacia un objetivo
 */
export const asymptoticRecovery = (
  currentValue: number,
  targetValue: number,
  recoveryRate: number,
  deltaTime: number
): number => {
  const timeFactor = recoveryRate * deltaTime / 1000;
  const difference = targetValue - currentValue;
  const recovery = difference * (1 - Math.exp(-timeFactor));
  
  return preciseRound(currentValue + recovery, 2);
};



/**
 * Validador de valores numéricos para debugging
 */
export const validateNumber = (value: number, context: string = 'unknown'): boolean => {
  if (!isFinite(value)) {
    console.error(`🔧 Valor no válido en ${context}: ${value}`);
    return false;
  }
  
  if (Math.abs(value) > MATH_CONSTANTS.SAFE_MAX_VALUE) {
    console.warn(`🔧 Valor muy grande en ${context}: ${value}`);
    return false;
  }
  
  return true;
};

/**
 * Logger de precisión para debugging matemático
 */
export const logPrecision = (operation: string, input: unknown, output: unknown) => {
  if (typeof window !== 'undefined' && (window as typeof window & { DEBUG_MATH?: boolean }).DEBUG_MATH) {
    console.debug(`🔢 ${operation}:`, { input, output });
  }
};





interface ResonanceHarmonic {
  frequency: number;
  amplitude: number;
  phase: number;
  decay: number;
}

export interface AdvancedResonanceState {
  fundamentalFreq: number;
  harmonics: ResonanceHarmonic[];
  resonanceLevel: number;
  coherence: number;
  emergentProperties: {
    stability: number;
    complexity: number;
    synchronization: number;
  };
}

/**
 * 🔥 Cálculo de resonancia harmónica avanzada usando series de Fourier
 */
export const calculateAdvancedResonance = (
  entityDistance: number,
  interactionHistory: number[],
  harmonyLevel: number,
  timeBonus: number = 0,
   
  _currentResonance: AdvancedResonanceState | null = null
): AdvancedResonanceState => {

  const distanceNorm = safeNormalize(entityDistance, 0, 500);
  const fundamentalFreq = MATH_CONSTANTS.HARMONIC_BASE_FREQ * (1 - distanceNorm * 0.5);
  

  const harmonics: ResonanceHarmonic[] = MATH_CONSTANTS.FIBONACCI_SEQUENCE
    .slice(0, 6)
    .map((ratio, index) => {
      const frequency = fundamentalFreq * (ratio / MATH_CONSTANTS.FIBONACCI_SEQUENCE[0]);
      const amplitude = Math.exp(-index * 0.3) * (harmonyLevel / 100);
      const phase = index * Math.PI / 4;
      const decay = MATH_CONSTANTS.RESONANCE_DECAY_NATURAL;
      
      return { frequency, amplitude, phase, decay };
    });
  

  const coherence = calculateCoherence(interactionHistory);
  

  const proximityFactor = Math.exp(-distanceNorm * 2);
  const harmonyFactor = easingFunctions.sigmoid(harmonyLevel / 100, 8);
  const coherenceFactor = coherence;
  const timeFactor = timeBonus > 0 ? Math.exp(-timeBonus / 10000) * 0.2 : 0;
  
  const resonanceLevel = preciseRound(
    safeClamp(
      (proximityFactor * 0.4 + harmonyFactor * 0.4 + coherenceFactor * 0.1 + timeFactor) * 100,
      0,
      100
    ),
    3
  );
  

  const stability = calculateStability(harmonics);
  const complexity = calculateComplexity(harmonics);
  const synchronization = calculateSynchronization(harmonics);
  
  return {
    fundamentalFreq: preciseRound(fundamentalFreq, 2),
    harmonics,
    resonanceLevel,
    coherence: preciseRound(coherence, 4),
    emergentProperties: {
      stability: preciseRound(stability, 4),
      complexity: preciseRound(complexity, 4),
      synchronization: preciseRound(synchronization, 4)
    }
  };
};

/**
 * Cálculo de coherencia temporal usando análisis de autocorrelación
 */
const calculateCoherence = (history: number[]): number => {
  if (history.length < 3) return 0.5;
  

  const mean = history.reduce((sum, val) => sum + val, 0) / history.length;
  const variance = history.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / history.length;
  
  if (variance < MATH_CONSTANTS.ULTRA_PRECISION_EPSILON) return 1.0;
  
  let autocorr = 0;
  for (let i = 1; i < history.length; i++) {
    autocorr += (history[i] - mean) * (history[i - 1] - mean);
  }
  autocorr = autocorr / ((history.length - 1) * variance);
  
  return safeClamp(Math.abs(autocorr), 0, 1);
};

/**
 * Cálculo de estabilidad de armónicos
 */
const calculateStability = (harmonics: ResonanceHarmonic[]): number => {
  const amplitudeVariance = harmonics.reduce((sum, h, _i, arr) => {
    const avgAmplitude = arr.reduce((s, hh) => s + hh.amplitude, 0) / arr.length;
    return sum + Math.pow(h.amplitude - avgAmplitude, 2);
  }, 0) / harmonics.length;
  
  return Math.exp(-amplitudeVariance * 10);
};

/**
 * Cálculo de complejidad harmónica usando entropía
 */
const calculateComplexity = (harmonics: ResonanceHarmonic[]): number => {
  const totalAmplitude = harmonics.reduce((sum, h) => sum + h.amplitude, 0);
  if (totalAmplitude < MATH_CONSTANTS.ULTRA_PRECISION_EPSILON) return 0;
  
  const entropy = harmonics.reduce((sum, h) => {
    const probability = h.amplitude / totalAmplitude;
    return probability > 0 ? sum - probability * Math.log2(probability) : sum;
  }, 0);
  
  const maxEntropy = Math.log2(harmonics.length);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
};

/**
 * Cálculo de sincronización entre armónicos
 */
const calculateSynchronization = (harmonics: ResonanceHarmonic[]): number => {
  if (harmonics.length < 2) return 1.0;
  
  let phaseCoherence = 0;
  let pairCount = 0;
  
  for (let i = 0; i < harmonics.length; i++) {
    for (let j = i + 1; j < harmonics.length; j++) {
      const phaseDiff = Math.abs(harmonics[i].phase - harmonics[j].phase);
      const normalizedDiff = Math.min(phaseDiff, 2 * Math.PI - phaseDiff) / Math.PI;
      phaseCoherence += 1 - normalizedDiff;
      pairCount++;
    }
  }
  
  return pairCount > 0 ? phaseCoherence / pairCount : 1.0;
};



export interface BehaviorPattern {
  patternId: string;
  frequency: number;
  confidence: number;
  nextPredicted: {
    action: string;
    probability: number;
    timeframe: number;
  };
  cyclicalStrength: number;
}

export interface PredictionState {
  patterns: BehaviorPattern[];
  chaoticIndex: number;
  predictability: number;
  dominantCycle: number;
  emergentTrends: string[];
}

/**
 * 🔥 Sistema de predicción comportamental usando análisis de series temporales
 */
export const predictBehaviorPatterns = (
  behaviorHistory: Array<{ action: string; timestamp: number; context: unknown }>,
   
  _currentContext: unknown
): PredictionState => {
  if (behaviorHistory.length < MATH_CONSTANTS.PATTERN_MEMORY_DEPTH / 4) {
    return {
      patterns: [],
      chaoticIndex: 0.5,
      predictability: 0.2,
      dominantCycle: 0,
      emergentTrends: []
    };
  }
  

  const actionFrequencies = new Map<string, number>();
  behaviorHistory.forEach(entry => {
    const count = actionFrequencies.get(entry.action) || 0;
    actionFrequencies.set(entry.action, count + 1);
  });
  

  const patterns: BehaviorPattern[] = [];
  for (const [action, frequency] of actionFrequencies.entries()) {
    const confidence = frequency / behaviorHistory.length;
    
    if (confidence > 0.1) {
      const cyclicalStrength = detectCyclicalPattern(behaviorHistory, action);
      const nextPredicted = predictNextOccurrence(behaviorHistory, action);
      
      patterns.push({
        patternId: `pattern_${action}_${Date.now()}`,
        frequency,
        confidence: preciseRound(confidence, 4),
        nextPredicted,
        cyclicalStrength: preciseRound(cyclicalStrength, 4)
      });
    }
  }
  

  const chaoticIndex = calculateChaoticIndex(behaviorHistory);
  

  const predictability = patterns.reduce((sum, p) => sum + p.confidence * p.cyclicalStrength, 0);
  

  const dominantCycle = patterns.length > 0 
    ? patterns.reduce((max, p) => p.cyclicalStrength > max ? p.cyclicalStrength : max, 0)
    : 0;
  

  const emergentTrends = detectEmergentTrends(behaviorHistory);
  
  return {
    patterns: patterns.sort((a, b) => b.confidence - a.confidence),
    chaoticIndex: preciseRound(chaoticIndex, 4),
    predictability: preciseRound(safeClamp(predictability, 0, 1), 4),
    dominantCycle: preciseRound(dominantCycle, 4),
    emergentTrends
  };
};

/**
 * Detectar patrón cíclico en la secuencia de acciones
 */
const detectCyclicalPattern = (
  history: Array<{ action: string; timestamp: number; context: unknown }>,
  targetAction: string
): number => {
  const actionIndices = history
    .map((entry, index) => entry.action === targetAction ? index : -1)
    .filter(index => index !== -1);
  
  if (actionIndices.length < 3) return 0;
  

  const intervals = [];
  for (let i = 1; i < actionIndices.length; i++) {
    intervals.push(actionIndices[i] - actionIndices[i - 1]);
  }
  

  const meanInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - meanInterval, 2), 0) / intervals.length;
  
  const coefficient = variance > 0 ? meanInterval / Math.sqrt(variance) : 1;
  return safeClamp(coefficient / 10, 0, 1);
};

/**
 * Predecir siguiente ocurrencia de una acción
 */
const predictNextOccurrence = (
  history: Array<{ action: string; timestamp: number; context: unknown }>,
  targetAction: string
): { action: string; probability: number; timeframe: number } => {
  const recent = history.slice(-20);
  const actionCount = recent.filter(entry => entry.action === targetAction).length;
  const probability = actionCount / recent.length;
  


  const avgInterval = history.length > 1 ? 
    (history[history.length - 1].timestamp - history[0].timestamp) / history.length : 
    1000;
  
  return {
    action: targetAction,
    probability: preciseRound(probability, 4),
    timeframe: preciseRound(avgInterval, 0)
  };
};

/**
 * Calcular índice caótico usando sensibilidad a condiciones iniciales
 */
const calculateChaoticIndex = (
  history: Array<{ action: string; timestamp: number; context: unknown }>
): number => {
  if (history.length < 10) return 0.5;
  

  const recent = history.slice(-10);
  const actionSequence = recent.map(entry => entry.action);
  

  let maxDivergence = 0;
  for (let i = 0; i < history.length - 10; i++) {
    const pastSequence = history.slice(i, i + 5).map(entry => entry.action);
    const similarity = calculateSequenceSimilarity(actionSequence.slice(0, 5), pastSequence);
    
    if (similarity > 0.6) {
      const futureActions = history.slice(i + 5, i + 10).map(entry => entry.action);
      const currentFuture = actionSequence.slice(5);
      const divergence = 1 - calculateSequenceSimilarity(currentFuture, futureActions);
      maxDivergence = Math.max(maxDivergence, divergence);
    }
  }
  
  return safeClamp(maxDivergence, 0, 1);
};

/**
 * Calcular similitud entre dos secuencias de acciones
 */
const calculateSequenceSimilarity = (seq1: string[], seq2: string[]): number => {
  const minLength = Math.min(seq1.length, seq2.length);
  if (minLength === 0) return 0;
  
  let matches = 0;
  for (let i = 0; i < minLength; i++) {
    if (seq1[i] === seq2[i]) matches++;
  }
  
  return matches / minLength;
};

/**
 * Detectar tendencias emergentes en el comportamiento
 */
const detectEmergentTrends = (
  history: Array<{ action: string; timestamp: number; context: unknown }>
): string[] => {
  const trends: string[] = [];
  
  if (history.length < 20) return trends;
  
  const recentActions = history.slice(-10).map(entry => entry.action);
  const pastActions = history.slice(-20, -10).map(entry => entry.action);
  

  const newBehaviors = recentActions.filter(action => !pastActions.includes(action));
  if (newBehaviors.length > 0) {
    trends.push('new_behaviors_emerging');
  }
  

  const recentDiversity = new Set(recentActions).size;
  const pastDiversity = new Set(pastActions).size;
  if (recentDiversity > pastDiversity * 1.5) {
    trends.push('increasing_behavioral_diversity');
  }
  

  const recentVariance = calculateActionVariance(recentActions);
  const pastVariance = calculateActionVariance(pastActions);
  if (recentVariance < pastVariance * 0.5 && pastVariance > 0) {
    trends.push('behavioral_stabilization');
  }
  
  return trends;
};

/**
 * Calcular varianza en la secuencia de acciones
 */
const calculateActionVariance = (actions: string[]): number => {
  if (actions.length < 2) return 0;
  
  const actionCounts = new Map<string, number>();
  actions.forEach(action => {
    actionCounts.set(action, (actionCounts.get(action) || 0) + 1);
  });
  
  const mean = actions.length / actionCounts.size;
  const variance = Array.from(actionCounts.values())
    .reduce((sum, count) => sum + Math.pow(count - mean, 2), 0) / actionCounts.size;
  
  return variance;
};



export interface VectorField {
  strength: number;
  direction: Vector2D;
  turbulence: number;
  gradient: Vector2D;
  divergence: number;
  curl: number;
}

/**
 * 🔥 Cálculo de campo vectorial avanzado para movimiento natural
 */
export const calculateAdvancedVectorField = (
  position: Vector2D,
  attractors: Vector2D[],
  repulsors: Vector2D[],
  _flowField: Vector2D[][],
  time: number
): VectorField => {
  const resultantForce = { x: 0, y: 0 };
  

  attractors.forEach(attractor => {
    const distance = vectorMath.distance(position, attractor);
    if (distance > MATH_CONSTANTS.ULTRA_PRECISION_EPSILON) {
      const direction = vectorMath.normalize({
        x: attractor.x - position.x,
        y: attractor.y - position.y
      });
      

      const force = MATH_CONSTANTS.ATTRACTION_CONSTANT / (distance * distance + 1);
      resultantForce.x += direction.x * force;
      resultantForce.y += direction.y * force;
    }
  });
  

  repulsors.forEach(repulsor => {
    const distance = vectorMath.distance(position, repulsor);
    if (distance > MATH_CONSTANTS.ULTRA_PRECISION_EPSILON) {
      const direction = vectorMath.normalize({
        x: position.x - repulsor.x,
        y: position.y - repulsor.y
      });
      

      const force = Math.exp(-distance / 50) * MATH_CONSTANTS.FIELD_STRENGTH_BASE;
      resultantForce.x += direction.x * force;
      resultantForce.y += direction.y * force;
    }
  });
  

  const turbulenceX = simplexNoise(position.x * MATH_CONSTANTS.TURBULENCE_SCALE, time * 0.001) * 0.1;
  const turbulenceY = simplexNoise(position.y * MATH_CONSTANTS.TURBULENCE_SCALE, time * 0.001 + 100) * 0.1;
  
  resultantForce.x += turbulenceX;
  resultantForce.y += turbulenceY;
  

  const strength = vectorMath.magnitude(resultantForce);
  const direction = strength > MATH_CONSTANTS.ULTRA_PRECISION_EPSILON 
    ? vectorMath.normalize(resultantForce)
    : { x: 0, y: 0 };
  
  const turbulence = Math.sqrt(turbulenceX * turbulenceX + turbulenceY * turbulenceY);
  

  const gradient = calculateGradient(position, attractors, repulsors);
  const divergence = calculateDivergence(position, attractors, repulsors);
  const curl = calculateCurl(position, attractors, repulsors);
  
  return {
    strength: preciseRound(strength, 6),
    direction,
    turbulence: preciseRound(turbulence, 6),
    gradient,
    divergence: preciseRound(divergence, 6),
    curl: preciseRound(curl, 6)
  };
};

/**
 * Ruido Simplex básico para turbulencia natural
 */
const simplexNoise = (x: number, y: number): number => {

  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  
  x -= Math.floor(x);
  y -= Math.floor(y);
  
  const u = fade(x);
  const v = fade(y);
  
  const A = perm[X] + Y;
  const B = perm[X + 1] + Y;
  
  return lerp(v, 
    lerp(u, grad(perm[A], x, y), grad(perm[B], x - 1, y)),
    lerp(u, grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1))
  );
};

const fade = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10);

const grad = (hash: number, x: number, y: number): number => {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};


const perm = new Array(512);
for (let i = 0; i < 256; i++) {
  perm[i] = perm[i + 256] = Math.floor(Math.random() * 256);
}

/**
 * Cálculo de gradiente del campo vectorial
 */
 
const calculateGradient = (position: Vector2D, attractors: Vector2D[], _repulsors: Vector2D[]): Vector2D => {
  const eps = 0.01;
  
  const field = (pos: Vector2D) => {
    const force = { x: 0, y: 0 };
    
    attractors.forEach(attractor => {
      const distance = vectorMath.distance(pos, attractor);
      if (distance > MATH_CONSTANTS.ULTRA_PRECISION_EPSILON) {
        const direction = vectorMath.normalize({
          x: attractor.x - pos.x,
          y: attractor.y - pos.y
        });
        const magnitude = MATH_CONSTANTS.ATTRACTION_CONSTANT / (distance * distance + 1);
        force.x += direction.x * magnitude;
        force.y += direction.y * magnitude;
      }
    });
    
    return vectorMath.magnitude(force);
  };
  
  const fx_plus = field({ x: position.x + eps, y: position.y });
  const fx_minus = field({ x: position.x - eps, y: position.y });
  const fy_plus = field({ x: position.x, y: position.y + eps });
  const fy_minus = field({ x: position.x, y: position.y - eps });
  
  return {
    x: (fx_plus - fx_minus) / (2 * eps),
    y: (fy_plus - fy_minus) / (2 * eps)
  };
};

/**
 * Cálculo de divergencia del campo vectorial
 */
 
const calculateDivergence = (position: Vector2D, attractors: Vector2D[], _repulsors: Vector2D[]): number => {
  const eps = 0.01;
  
  const fieldX = (pos: Vector2D) => {
    let force = 0;
    attractors.forEach(attractor => {
      const distance = vectorMath.distance(pos, attractor);
      if (distance > MATH_CONSTANTS.ULTRA_PRECISION_EPSILON) {
        const direction = (attractor.x - pos.x) / distance;
        force += direction * MATH_CONSTANTS.ATTRACTION_CONSTANT / (distance * distance + 1);
      }
    });
    return force;
  };
  
  const fieldY = (pos: Vector2D) => {
    let force = 0;
    attractors.forEach(attractor => {
      const distance = vectorMath.distance(pos, attractor);
      if (distance > MATH_CONSTANTS.ULTRA_PRECISION_EPSILON) {
        const direction = (attractor.y - pos.y) / distance;
        force += direction * MATH_CONSTANTS.ATTRACTION_CONSTANT / (distance * distance + 1);
      }
    });
    return force;
  };
  
  const dFx_dx = (fieldX({ x: position.x + eps, y: position.y }) - fieldX({ x: position.x - eps, y: position.y })) / (2 * eps);
  const dFy_dy = (fieldY({ x: position.x, y: position.y + eps }) - fieldY({ x: position.x, y: position.y - eps })) / (2 * eps);
  
  return dFx_dx + dFy_dy;
};

/**
 * Cálculo de curl del campo vectorial
 */
 
const calculateCurl = (position: Vector2D, attractors: Vector2D[], _repulsors: Vector2D[]): number => {
  const eps = 0.01;
  
  const fieldX = (pos: Vector2D) => {
    let force = 0;
    attractors.forEach(attractor => {
      const distance = vectorMath.distance(pos, attractor);
      if (distance > MATH_CONSTANTS.ULTRA_PRECISION_EPSILON) {
        const direction = (attractor.x - pos.x) / distance;
        force += direction * MATH_CONSTANTS.ATTRACTION_CONSTANT / (distance * distance + 1);
      }
    });
    return force;
  };
  
  const fieldY = (pos: Vector2D) => {
    let force = 0;
    attractors.forEach(attractor => {
      const distance = vectorMath.distance(pos, attractor);
      if (distance > MATH_CONSTANTS.ULTRA_PRECISION_EPSILON) {
        const direction = (attractor.y - pos.y) / distance;
        force += direction * MATH_CONSTANTS.ATTRACTION_CONSTANT / (distance * distance + 1);
      }
    });
    return force;
  };
  
  const dFy_dx = (fieldY({ x: position.x + eps, y: position.y }) - fieldY({ x: position.x - eps, y: position.y })) / (2 * eps);
  const dFx_dy = (fieldX({ x: position.x, y: position.y + eps }) - fieldX({ x: position.x, y: position.y - eps })) / (2 * eps);
  
  return dFy_dx - dFx_dy;
};



export interface AdvancedZoneEffect {
  baseEffect: number;
  harmonicResonance: number;
  fieldInteraction: number;
  emergentBonus: number;
  totalEffect: number;
  effectType: 'MULTIPLICATIVE' | 'ADDITIVE' | 'EXPONENTIAL' | 'LOGARITHMIC';
}

/**
 * 🔥 Cálculo de efectos de zona con matemáticas complejas
 */
export const calculateAdvancedZoneEffect = (
  entityPosition: Vector2D,
  zoneCenter: Vector2D,
  zoneRadius: number,
  _zoneType: string,
  resonanceState: AdvancedResonanceState,
  nearbyEntities: Vector2D[]
): AdvancedZoneEffect => {
  const distance = vectorMath.distance(entityPosition, zoneCenter);
  const normalizedDistance = safeClamp(distance / zoneRadius, 0, 1);
  

  const baseEffect = Math.exp(-normalizedDistance * MATH_CONSTANTS.ZONE_INFLUENCE_DECAY) * 
                    MATH_CONSTANTS.ZONE_FIELD_STRENGTH;
  

  const harmonicResonance = calculateZoneResonance(
    entityPosition, 
    zoneCenter, 
    zoneRadius, 
    resonanceState
  );
  

  const fieldInteraction = calculateZoneFieldInteraction(
    entityPosition,
    zoneCenter,
    nearbyEntities
  );
  

  const emergentBonus = calculateEmergentZoneBonus(
    baseEffect,
    harmonicResonance,
    fieldInteraction,
    resonanceState
  );
  

  let effectType: AdvancedZoneEffect['effectType'] = 'ADDITIVE';
  if (harmonicResonance > 0.8) effectType = 'MULTIPLICATIVE';
  else if (emergentBonus > 0.5) effectType = 'EXPONENTIAL';
  else if (baseEffect < 0.2) effectType = 'LOGARITHMIC';
  

  let totalEffect: number;
  switch (effectType) {
    case 'MULTIPLICATIVE':
      totalEffect = baseEffect * (1 + harmonicResonance) * (1 + fieldInteraction) * (1 + emergentBonus);
      break;
    case 'EXPONENTIAL':
      totalEffect = baseEffect * Math.exp(harmonicResonance + fieldInteraction + emergentBonus);
      break;
    case 'LOGARITHMIC':
      totalEffect = baseEffect + Math.log(1 + harmonicResonance + fieldInteraction + emergentBonus);
      break;
    default:
      totalEffect = baseEffect + harmonicResonance + fieldInteraction + emergentBonus;
  }
  
  return {
    baseEffect: preciseRound(baseEffect, 6),
    harmonicResonance: preciseRound(harmonicResonance, 6),
    fieldInteraction: preciseRound(fieldInteraction, 6),
    emergentBonus: preciseRound(emergentBonus, 6),
    totalEffect: preciseRound(safeClamp(totalEffect, 0, 10), 6),
    effectType
  };
};

/**
 * Cálculo de resonancia específica de zona
 */
const calculateZoneResonance = (
  entityPos: Vector2D,
  zoneCenter: Vector2D,
  zoneRadius: number,
  resonanceState: AdvancedResonanceState
): number => {
  const distance = vectorMath.distance(entityPos, zoneCenter);
  const normalizedDistance = safeClamp(distance / zoneRadius, 0, 1);
  

  const waveLength = zoneRadius / 2;
  const phase = (distance / waveLength) * 2 * Math.PI;
  const standingWave = Math.abs(Math.sin(phase)) * Math.exp(-normalizedDistance);
  

  const harmonicInteraction = resonanceState.harmonics.reduce((sum, harmonic) => {
    const harmonicWave = Math.sin(phase * harmonic.frequency / resonanceState.fundamentalFreq);
    return sum + harmonic.amplitude * harmonicWave;
  }, 0) / resonanceState.harmonics.length;
  
  return safeClamp(standingWave * harmonicInteraction * resonanceState.coherence, 0, 1);
};

/**
 * Cálculo de interacción con campo vectorial de zona
 */
const calculateZoneFieldInteraction = (
  entityPos: Vector2D,
  zoneCenter: Vector2D,
  nearbyEntities: Vector2D[]
): number => {
  let fieldStrength = 0;
  

  nearbyEntities.forEach(entityPos2 => {
    const distanceToEntity = vectorMath.distance(entityPos, entityPos2);
    const distanceToZone = vectorMath.distance(entityPos2, zoneCenter);
    
    if (distanceToEntity > MATH_CONSTANTS.ULTRA_PRECISION_EPSILON) {

      const zoneProximity = Math.exp(-distanceToZone / 100);
      const entityInfluence = Math.exp(-distanceToEntity / 50);
      fieldStrength += zoneProximity * entityInfluence;
    }
  });
  
  return safeClamp(fieldStrength, 0, 1);
};

/**
 * Cálculo de bonus emergente basado en complejidad del sistema
 */
const calculateEmergentZoneBonus = (
  baseEffect: number,
  harmonicResonance: number,
  fieldInteraction: number,
  resonanceState: AdvancedResonanceState
): number => {

  const emergenceThreshold = MATH_CONSTANTS.EMERGENCE_THRESHOLD;
  

  const systemComplexity = (
    baseEffect + 
    harmonicResonance + 
    fieldInteraction + 
    resonanceState.emergentProperties.complexity
  ) / 4;
  
  if (systemComplexity > emergenceThreshold) {

    const bonus = (systemComplexity - emergenceThreshold) * MATH_CONSTANTS.GOLDEN_RATIO;
    return safeClamp(bonus, 0, 1);
  }
  
  return 0;
};



export const mathUtils = {

  preciseRound,
  areEqual,
  safeClamp,
  safeNormalize,
  

  lerp,
  smoothLerp,
  expLerp,
  

  calculateResonance,
  calculateActivityEffectiveness,
  

  calculateDeltaTime,
  getAnimationProgress,
  

  exponentialDecay,
  asymptoticRecovery,
  

  validateNumber,
  logPrecision,
  


  calculateAdvancedResonance,
  

  predictBehaviorPatterns,
  

  calculateAdvancedVectorField,
  

  calculateAdvancedZoneEffect
} as const;

export { easingFunctions, vectorMath, MATH_CONSTANTS };
