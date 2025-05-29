/**
 * Sistema de optimización de rendimiento para el juego Dúo Eterno
 * 
 * Características:
 * - Gestión inteligente de actualizaciones
 * - Throttling adaptativo basado en FPS
 * - Optimización de renderizado
 * - Profiling y métricas de rendimiento
 */

// Interfaz para métricas de rendimiento
interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  updateTime: number;
  renderTime: number;
  memoryUsage: number;
  activeTimers: number;
  lastMeasurement: number;
}

// Sistema de throttling adaptativo
class AdaptiveThrottler {
  private lastExecutionTime: number = 0;
  private adaptiveInterval: number;
  private minInterval: number;
  private maxInterval: number;
  
  constructor(baseInterval: number, minInterval: number = 50, maxInterval: number = 1000) {
    this.adaptiveInterval = baseInterval;
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
  }
  
  shouldExecute(currentTime: number): boolean {
    const timeSinceLastExecution = currentTime - this.lastExecutionTime;
    
    if (timeSinceLastExecution >= this.adaptiveInterval) {
      this.lastExecutionTime = currentTime;
      return true;
    }
    
    return false;
  }
  
  updateFPS(fps: number): void {
    // Ajustar intervalo basado en FPS
    if (fps < 30) {
      // FPS bajo: aumentar intervalo (menos actualizaciones)
      this.adaptiveInterval = Math.min(this.maxInterval, this.adaptiveInterval * 1.2);
    } else if (fps > 55) {
      // FPS alto: disminuir intervalo (más actualizaciones)
      this.adaptiveInterval = Math.max(this.minInterval, this.adaptiveInterval * 0.9);
    }
  }
  
  getInterval(): number {
    return this.adaptiveInterval;
  }
}

// Instancias globales de optimización - INTERVALOS REDUCIDOS PARA DESARROLLO
const autopoiesisThrottler = new AdaptiveThrottler(200, 100, 1000); // Más frecuente para ver cambios
const movementThrottler = new AdaptiveThrottler(50, 25, 200);      // Movimiento más fluido

// Métricas de rendimiento
const performanceMetrics: PerformanceMetrics = {
  fps: 60,
  frameTime: 16.67,
  updateTime: 0,
  renderTime: 0,
  memoryUsage: 0,
  activeTimers: 0,
  lastMeasurement: Date.now()
};

/**
 * Verifica si una actualización de autopoiesis debe ejecutarse
 */
export const shouldUpdateAutopoiesis = (): boolean => {
  return autopoiesisThrottler.shouldExecute(Date.now());
};

/**
 * Verifica si una actualización de movimiento debe ejecutarse
 */
export const shouldUpdateMovement = (): boolean => {
  return movementThrottler.shouldExecute(Date.now());
};

export const getCurrentMetrics = (): PerformanceMetrics => {
  return { ...performanceMetrics };
};

/**
 * Mide el tiempo de ejecución de una función
 */
export const measureExecutionTime = <T>(name: string, fn: () => T): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (performanceMetrics) {
    console.debug(`${name}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
};
