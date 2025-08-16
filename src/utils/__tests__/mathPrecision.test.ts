/**
 * 🧪 Tests completos para mathPrecision.ts
 * 
 * Cobertura de testing para todas las funciones matemáticas core:
 * - Funciones de precisión básicas
 * - Interpolación y easing
 * - Cálculos de resonancia
 * - Sistemas avanzados (harmónicos, predicción, campos vectoriales)
 * - Efectos de zona complejos
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  mathUtils,
  easingFunctions,
  vectorMath,
  MATH_CONSTANTS,
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
  calculateAdvancedResonance,
  predictBehaviorPatterns,
  calculateAdvancedVectorField,
  calculateAdvancedZoneEffect,
  type Vector2D,
  type AdvancedResonanceState,
  type BehaviorPattern,
  type PredictionState
} from '../mathPrecision';

describe('mathPrecision.ts - Funciones Core de Precisión', () => {
  
  describe('Constantes matemáticas', () => {
    it('should have correct mathematical constants', () => {
      expect(MATH_CONSTANTS.GOLDEN_RATIO).toBeCloseTo(1.618, 3);
      expect(MATH_CONSTANTS.RESONANCE_HARMONIC).toBeCloseTo(0.618, 3);
      expect(MATH_CONSTANTS.EPSILON).toBe(Number.EPSILON);
      expect(MATH_CONSTANTS.HIGH_PRECISION_EPSILON).toBe(1e-10);
      expect(MATH_CONSTANTS.ULTRA_PRECISION_EPSILON).toBe(1e-15);
    });

    it('should have valid Fibonacci sequence', () => {
      const fib = MATH_CONSTANTS.FIBONACCI_SEQUENCE;
      expect(fib[0]).toBe(1);
      expect(fib[1]).toBe(1);
      // Verificar secuencia de Fibonacci
      for (let i = 2; i < fib.length; i++) {
        expect(fib[i]).toBe(fib[i-1] + fib[i-2]);
      }
    });
  });

  describe('preciseRound', () => {
    it('should round with specified decimal places', () => {
      expect(preciseRound(Math.PI, 2)).toBe(3.14);
      expect(preciseRound(Math.PI, 4)).toBe(3.1416);
      expect(preciseRound(1.999999, 3)).toBe(2.0);
    });

    it('should handle edge cases', () => {
      expect(preciseRound(0, 3)).toBe(0);
      expect(preciseRound(-1.2345, 2)).toBe(-1.23);
      expect(preciseRound(NaN, 2)).toBeNaN();
      expect(preciseRound(Infinity, 2)).toBe(Infinity);
    });
  });

  describe('areEqual', () => {
    it('should compare numbers with epsilon tolerance', () => {
      expect(areEqual(1.0, 1.0)).toBe(true);
      expect(areEqual(1.0, 1.0 + MATH_CONSTANTS.EPSILON / 2)).toBe(true);
      expect(areEqual(1.0, 1.1)).toBe(false);
    });

    it('should work with custom epsilon', () => {
      expect(areEqual(1.0, 1.001, 0.01)).toBe(true);
      expect(areEqual(1.0, 1.1, 0.01)).toBe(false);
    });
  });

  describe('safeClamp', () => {
    it('should clamp values within range', () => {
      expect(safeClamp(5, 0, 10)).toBe(5);
      expect(safeClamp(-5, 0, 10)).toBe(0);
      expect(safeClamp(15, 0, 10)).toBe(10);
    });

    it('should handle invalid ranges by swapping', () => {
      expect(safeClamp(5, 10, 0)).toBe(5); // min > max, should swap
    });

    it('should handle non-finite values', () => {
      expect(safeClamp(NaN, 0, 10)).toBe(5); // Should return midpoint
      expect(safeClamp(Infinity, 0, 10)).toBe(5); // Non-finite, returns midpoint
      expect(safeClamp(-Infinity, 0, 10)).toBe(5); // Non-finite, returns midpoint
    });
  });

  describe('safeNormalize', () => {
    it('should normalize values to [0, 1] range', () => {
      expect(safeNormalize(5, 0, 10)).toBe(0.5);
      expect(safeNormalize(0, 0, 10)).toBe(0);
      expect(safeNormalize(10, 0, 10)).toBe(1);
      expect(safeNormalize(-5, 0, 10)).toBe(0);
      expect(safeNormalize(15, 0, 10)).toBe(1);
    });

    it('should handle zero range gracefully', () => {
      expect(safeNormalize(5, 10, 10)).toBe(0.5); // Equal min/max
    });
  });
});

describe('mathPrecision.ts - Interpolación y Easing', () => {
  
  describe('lerp', () => {
    it('should interpolate linearly between values', () => {
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 1)).toBe(10);
      expect(lerp(10, 20, 0.3)).toBe(13);
    });

    it('should clamp t parameter', () => {
      expect(lerp(0, 10, -0.5)).toBe(0);
      expect(lerp(0, 10, 1.5)).toBe(10);
    });
  });

  describe('smoothLerp', () => {
    it('should apply easing function to interpolation', () => {
      const result = smoothLerp(0, 10, 0.5, easingFunctions.easeInQuart);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(10);
      expect(result).not.toBe(5); // Should be different from linear lerp
    });
  });

  describe('expLerp', () => {
    it('should perform exponential interpolation', () => {
      const result = expLerp(0, 10, 0.5, 16.67); // 60fps delta time
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(10);
    });
  });

  describe('easingFunctions', () => {
    it('should have valid easing functions', () => {
      const t = 0.5;
      expect(easingFunctions.easeInQuart(0)).toBe(0);
      expect(easingFunctions.easeInQuart(1)).toBe(1);
      expect(easingFunctions.easeInQuart(t)).toBeGreaterThan(0);
      expect(easingFunctions.easeInQuart(t)).toBeLessThan(1);

      expect(easingFunctions.easeOutQuart(0)).toBe(0);
      expect(easingFunctions.easeOutQuart(1)).toBe(1);

      expect(easingFunctions.sigmoid(0.5)).toBeCloseTo(0.5, 1);
      expect(easingFunctions.sigmoid(0)).toBeLessThan(0.5);
      expect(easingFunctions.sigmoid(1)).toBeGreaterThan(0.5);
    });
  });
});

describe('mathPrecision.ts - Cálculos de Juego', () => {
  
  describe('calculateResonance', () => {
    it('should calculate resonance based on distance and harmony', () => {
      const resonance1 = calculateResonance(0, 100, 0, 50); // Very close, high harmony
      const resonance2 = calculateResonance(500, 0, 0, 50); // Far, no harmony
      
      expect(resonance1).toBeGreaterThan(resonance2);
      expect(resonance1).toBeGreaterThanOrEqual(0);
      expect(resonance1).toBeLessThanOrEqual(100);
      expect(resonance2).toBeGreaterThanOrEqual(0);
      expect(resonance2).toBeLessThanOrEqual(100);
    });

    it('should include time bonus in calculation', () => {
      const withoutBonus = calculateResonance(100, 50, 0, 50);
      const withBonus = calculateResonance(100, 50, 1000, 50);
      
      expect(withBonus).toBeGreaterThanOrEqual(withoutBonus);
    });
  });

  describe('calculateActivityEffectiveness', () => {
    it('should calculate effectiveness based on duration and aptitude', () => {
      const shortDuration = calculateActivityEffectiveness(1000, 50); // 1 second
      const longDuration = calculateActivityEffectiveness(10000, 50); // 10 seconds
      const highAptitude = calculateActivityEffectiveness(5000, 90);
      const lowAptitude = calculateActivityEffectiveness(5000, 10);
      
      expect(longDuration).toBeGreaterThan(shortDuration);
      expect(highAptitude).toBeGreaterThan(lowAptitude);
      
      expect(shortDuration).toBeGreaterThanOrEqual(0);
      expect(shortDuration).toBeLessThanOrEqual(1);
    });

    it('should include environment bonus', () => {
      const withoutEnv = calculateActivityEffectiveness(5000, 50, 0);
      const withEnv = calculateActivityEffectiveness(5000, 50, 25);
      
      expect(withEnv).toBeGreaterThanOrEqual(withoutEnv);
    });
  });

  describe('calculateDeltaTime', () => {
    it('should calculate delta time with clamping', () => {
      expect(calculateDeltaTime(1100, 1000)).toBe(100);
      expect(calculateDeltaTime(1000, 1000)).toBe(0);
      expect(calculateDeltaTime(900, 1000)).toBe(0); // Negative delta clamped to 0
      expect(calculateDeltaTime(1200, 1000)).toBe(100); // Large delta clamped to 100
    });
  });

  describe('getAnimationProgress', () => {
    it('should calculate animation progress', () => {
      const startTime = 1000;
      const duration = 2000;
      
      expect(getAnimationProgress(startTime, duration, 1000)).toBe(0);
      expect(getAnimationProgress(startTime, duration, 2000)).toBe(0.5);
      expect(getAnimationProgress(startTime, duration, 3000)).toBe(1);
      expect(getAnimationProgress(startTime, duration, 4000)).toBe(1); // Clamped
    });

    it('should handle zero duration', () => {
      expect(getAnimationProgress(1000, 0, 2000)).toBe(1);
    });
  });

  describe('exponentialDecay', () => {
    it('should decay values exponentially', () => {
      const initial = 100;
      const decayed = exponentialDecay(initial, 0.1, 1000);
      
      expect(decayed).toBeLessThan(initial);
      expect(decayed).toBeGreaterThan(0);
    });

    it('should respect minimum value', () => {
      const decayed = exponentialDecay(10, 10, 10000, 5);
      expect(decayed).toBeGreaterThanOrEqual(5);
    });
  });

  describe('asymptoticRecovery', () => {
    it('should recover towards target value', () => {
      const recovered = asymptoticRecovery(50, 100, 0.1, 1000);
      
      expect(recovered).toBeGreaterThan(50);
      expect(recovered).toBeLessThan(100);
    });
  });

  describe('validateNumber', () => {
    it('should validate finite numbers', () => {
      expect(validateNumber(42)).toBe(true);
      expect(validateNumber(0)).toBe(true);
      expect(validateNumber(-42)).toBe(true);
      expect(validateNumber(NaN)).toBe(false);
      expect(validateNumber(Infinity)).toBe(false);
      expect(validateNumber(-Infinity)).toBe(false);
    });

    it('should check for safe value range', () => {
      expect(validateNumber(1e20)).toBe(false); // Too large
      expect(validateNumber(-1e20)).toBe(false); // Too large negative
    });
  });
});

describe('mathPrecision.ts - Matemáticas Vectoriales', () => {
  
  describe('vectorMath', () => {
    const vector1: Vector2D = { x: 3, y: 4 };
    const vector2: Vector2D = { x: 0, y: 5 };
    const zeroVector: Vector2D = { x: 0, y: 0 };

    it('should calculate vector magnitude', () => {
      expect(vectorMath.magnitude(vector1)).toBe(5); // 3-4-5 triangle
      expect(vectorMath.magnitude(zeroVector)).toBe(0);
    });

    it('should normalize vectors safely', () => {
      const normalized = vectorMath.normalize(vector1);
      expect(vectorMath.magnitude(normalized)).toBeCloseTo(1, 5);
      expect(normalized.x).toBeCloseTo(0.6, 5);
      expect(normalized.y).toBeCloseTo(0.8, 5);

      // Zero vector normalization
      const normalizedZero = vectorMath.normalize(zeroVector);
      expect(normalizedZero.x).toBe(0);
      expect(normalizedZero.y).toBe(0);
    });

    it('should calculate distance between vectors', () => {
      const distance = vectorMath.distance(vector1, vector2);
      expect(distance).toBeCloseTo(Math.sqrt(9 + 1), 5); // sqrt((3-0)² + (4-5)²)
    });

    it('should interpolate between vectors', () => {
      const interpolated = vectorMath.lerp(vector1, vector2, 0.5);
      expect(interpolated.x).toBe(1.5);
      expect(interpolated.y).toBe(4.5);
    });

    it('should rotate vectors', () => {
      const rotated = vectorMath.rotate(vector1, Math.PI / 2); // 90 degrees
      expect(rotated.x).toBeCloseTo(-4, 5);
      expect(rotated.y).toBeCloseTo(3, 5);
    });
  });
});

describe('mathPrecision.ts - Sistemas Avanzados', () => {
  
  describe('calculateAdvancedResonance', () => {
    it('should calculate advanced resonance with harmonics', () => {
      const interactionHistory = [1, 0.8, 1.2, 0.9, 1.1];
      const result = calculateAdvancedResonance(100, interactionHistory, 75, 1000);
      
      expect(result.fundamentalFreq).toBeGreaterThan(0);
      expect(result.harmonics).toHaveLength(6); // Fibonacci sequence first 6
      expect(result.resonanceLevel).toBeGreaterThanOrEqual(0);
      expect(result.resonanceLevel).toBeLessThanOrEqual(100);
      expect(result.coherence).toBeGreaterThanOrEqual(0);
      expect(result.coherence).toBeLessThanOrEqual(1);
      
      // Emergent properties
      expect(result.emergentProperties.stability).toBeGreaterThanOrEqual(0);
      expect(result.emergentProperties.complexity).toBeGreaterThanOrEqual(0);
      expect(result.emergentProperties.synchronization).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty interaction history', () => {
      const result = calculateAdvancedResonance(100, [], 50);
      expect(result.coherence).toBe(0.5); // Default value for empty history
    });
  });

  describe('predictBehaviorPatterns', () => {
    it('should predict behavior patterns from history', () => {
      const behaviorHistory = [
        { action: 'WANDERING', timestamp: 1000, context: {} },
        { action: 'EATING', timestamp: 2000, context: {} },
        { action: 'WANDERING', timestamp: 3000, context: {} },
        { action: 'SLEEPING', timestamp: 4000, context: {} },
        { action: 'WANDERING', timestamp: 5000, context: {} },
        { action: 'EATING', timestamp: 6000, context: {} }
      ];
      
      const prediction = predictBehaviorPatterns(behaviorHistory, {});
      
      expect(prediction.patterns.length).toBeGreaterThanOrEqual(0);
      expect(prediction.chaoticIndex).toBeGreaterThanOrEqual(0);
      expect(prediction.chaoticIndex).toBeLessThanOrEqual(1);
      expect(prediction.predictability).toBeGreaterThanOrEqual(0);
      expect(prediction.predictability).toBeLessThanOrEqual(1);
      expect(prediction.dominantCycle).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(prediction.emergentTrends)).toBe(true);
    });

    it('should handle insufficient history', () => {
      const shortHistory = [
        { action: 'WANDERING', timestamp: 1000, context: {} }
      ];
      
      const prediction = predictBehaviorPatterns(shortHistory, {});
      
      expect(prediction.patterns).toHaveLength(0);
      expect(prediction.chaoticIndex).toBe(0.5);
      expect(prediction.predictability).toBe(0.2);
    });
  });

  describe('calculateAdvancedVectorField', () => {
    it('should calculate vector field with attractors and repulsors', () => {
      const position: Vector2D = { x: 50, y: 50 };
      const attractors: Vector2D[] = [{ x: 100, y: 100 }];
      const repulsors: Vector2D[] = [{ x: 0, y: 0 }];
      const flowField: Vector2D[][] = [];
      
      const field = calculateAdvancedVectorField(
        position, 
        attractors, 
        repulsors, 
        flowField, 
        1000
      );
      
      expect(field.strength).toBeGreaterThanOrEqual(0);
      expect(field.direction.x).toBeGreaterThanOrEqual(-1);
      expect(field.direction.x).toBeLessThanOrEqual(1);
      expect(field.direction.y).toBeGreaterThanOrEqual(-1);
      expect(field.direction.y).toBeLessThanOrEqual(1);
      expect(field.turbulence).toBeGreaterThanOrEqual(0);
      expect(typeof field.divergence).toBe('number');
      expect(typeof field.curl).toBe('number');
    });
  });

  describe('calculateAdvancedZoneEffect', () => {
    it('should calculate complex zone effects', () => {
      const entityPosition: Vector2D = { x: 50, y: 50 };
      const zoneCenter: Vector2D = { x: 60, y: 60 };
      const zoneRadius = 50;
      const resonanceState: AdvancedResonanceState = {
        fundamentalFreq: 440,
        harmonics: [
          { frequency: 440, amplitude: 0.8, phase: 0, decay: 0.99 }
        ],
        resonanceLevel: 75,
        coherence: 0.8,
        emergentProperties: {
          stability: 0.7,
          complexity: 0.6,
          synchronization: 0.8
        }
      };
      const nearbyEntities: Vector2D[] = [{ x: 45, y: 55 }];
      
      const effect = calculateAdvancedZoneEffect(
        entityPosition,
        zoneCenter,
        zoneRadius,
        'HARMONY_ZONE',
        resonanceState,
        nearbyEntities
      );
      
      expect(effect.baseEffect).toBeGreaterThanOrEqual(0);
      expect(effect.harmonicResonance).toBeGreaterThanOrEqual(0);
      expect(effect.fieldInteraction).toBeGreaterThanOrEqual(0);
      expect(effect.emergentBonus).toBeGreaterThanOrEqual(0);
      expect(effect.totalEffect).toBeGreaterThanOrEqual(0);
      expect(effect.totalEffect).toBeLessThanOrEqual(10);
      expect(['MULTIPLICATIVE', 'ADDITIVE', 'EXPONENTIAL', 'LOGARITHMIC'])
        .toContain(effect.effectType);
    });
  });
});

describe('mathPrecision.ts - Integración mathUtils', () => {
  
  it('should export all functions in mathUtils object', () => {
    // Verificar que todas las funciones core están disponibles
    expect(typeof mathUtils.preciseRound).toBe('function');
    expect(typeof mathUtils.areEqual).toBe('function');
    expect(typeof mathUtils.safeClamp).toBe('function');
    expect(typeof mathUtils.safeNormalize).toBe('function');
    
    // Interpolación
    expect(typeof mathUtils.lerp).toBe('function');
    expect(typeof mathUtils.smoothLerp).toBe('function');
    expect(typeof mathUtils.expLerp).toBe('function');
    
    // Cálculos específicos del juego
    expect(typeof mathUtils.calculateResonance).toBe('function');
    expect(typeof mathUtils.calculateActivityEffectiveness).toBe('function');
    
    // Sistemas avanzados
    expect(typeof mathUtils.calculateAdvancedResonance).toBe('function');
    expect(typeof mathUtils.predictBehaviorPatterns).toBe('function');
    expect(typeof mathUtils.calculateAdvancedVectorField).toBe('function');
    expect(typeof mathUtils.calculateAdvancedZoneEffect).toBe('function');
    
    // Validación
    expect(typeof mathUtils.validateNumber).toBe('function');
  });

  it('should have consistent behavior between direct imports and mathUtils', () => {
    const value = Math.PI;
    const decimals = 3;
    
    expect(preciseRound(value, decimals)).toBe(mathUtils.preciseRound(value, decimals));
    expect(safeClamp(5, 0, 10)).toBe(mathUtils.safeClamp(5, 0, 10));
    expect(lerp(0, 10, 0.5)).toBe(mathUtils.lerp(0, 10, 0.5));
  });
});