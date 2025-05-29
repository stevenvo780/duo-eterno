/**
 * Sistema de optimización de rendimiento para el juego Dúo Eterno
 * 
 * Características:
 * - Gestión inteligente de actualizaciones
 * - Throttling adaptativo basado en FPS
 * - Optimización de renderizado
 * - Profiling y métricas de rendimiento
 */

import { gameConfig } from '../config/gameConfig';
import { logGeneral } from './logger';

// Interfaz para métricas de rendimiento
export interface PerformanceMetrics {
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

// Pool de objetos para reducir garbage collection
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;
  
  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize: number = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    
    // Pre-llenar el pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }
  
  get(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }
  
  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }
  
  getPoolSize(): number {
    return this.pool.length;
  }
}

// Instancias globales de optimización - INTERVALOS REDUCIDOS PARA DESARROLLO
const autopoiesisThrottler = new AdaptiveThrottler(200, 100, 1000); // Más frecuente para ver cambios
const movementThrottler = new AdaptiveThrottler(50, 25, 200);      // Movimiento más fluido
const renderThrottler = new AdaptiveThrottler(16, 16, 50);         // Renderizado responsivo

// Pool de objetos comunes
const positionPool = new ObjectPool(
  () => ({ x: 0, y: 0 }),
  (pos) => { pos.x = 0; pos.y = 0; },
  20
);

const statsUpdatePool = new ObjectPool(
  () => ({} as Record<string, number>),
  (obj: Record<string, number>) => { Object.keys(obj).forEach(key => delete obj[key]); },
  10
);

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

// Monitor de FPS
class FPSMonitor {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  
  update(): number {
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;
    
    this.frames.push(1000 / delta);
    
    // Mantener solo los últimos 60 frames
    if (this.frames.length > 60) {
      this.frames.shift();
    }
    
    this.lastTime = currentTime;
    
    // Calcular FPS promedio
    const fps = this.frames.reduce((sum, frame) => sum + frame, 0) / this.frames.length;
    
    // Actualizar throttlers
    autopoiesisThrottler.updateFPS(fps);
    movementThrottler.updateFPS(fps);
    renderThrottler.updateFPS(fps);
    
    return fps;
  }
}

const fpsMonitor = new FPSMonitor();

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

/**
 * Verifica si un frame de renderizado debe ejecutarse
 */
export const shouldRender = (): boolean => {
  return renderThrottler.shouldExecute(Date.now());
};

/**
 * Actualiza métricas de rendimiento
 */
export const updatePerformanceMetrics = (): PerformanceMetrics => {
  const now = Date.now();
  const fps = fpsMonitor.update();
  
  // Actualizar métricas básicas
  performanceMetrics.fps = fps;
  performanceMetrics.frameTime = 1000 / fps;
  performanceMetrics.lastMeasurement = now;
  
  // Estimar uso de memoria (si está disponible)
  if ('memory' in performance) {
    const perfWithMemory = performance as Performance & { 
      memory: { usedJSHeapSize: number } 
    };
    performanceMetrics.memoryUsage = perfWithMemory.memory.usedJSHeapSize / 1024 / 1024; // MB
  }
  
  // Contar timers activos (estimación)
  performanceMetrics.activeTimers = countActiveTimers();
  
  return { ...performanceMetrics };
};

/**
 * Obtiene un objeto de posición del pool
 */
export const getPooledPosition = (): { x: number; y: number } => {
  return positionPool.get();
};

/**
 * Devuelve un objeto de posición al pool
 */
export const releasePooledPosition = (pos: { x: number; y: number }): void => {
  positionPool.release(pos);
};

/**
 * Obtiene un objeto para actualizaciones de stats del pool
 */
export const getPooledStatsUpdate = (): Record<string, number> => {
  return statsUpdatePool.get();
};

/**
 * Devuelve un objeto de stats al pool
 */
export const releasePooledStatsUpdate = (stats: Record<string, number>): void => {
  statsUpdatePool.release(stats);
};

/**
 * Optimiza la ejecución de una función costosa usando debouncing
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | undefined;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = undefined;
      func(...args);
    };
    
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(later, wait);
  };
};

/**
 * Optimiza la ejecución de una función usando throttling
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Mide el tiempo de ejecución de una función
 */
export const measureExecutionTime = <T>(
  name: string,
  func: () => T
): T => {
  const start = performance.now();
  const result = func();
  const end = performance.now();
  
  if (gameConfig.debugMode) {
    const time = end - start;
    if (time > 5) { // Solo logear si toma más de 5ms
      logGeneral.debug(`⏱️ ${name}: ${time.toFixed(2)}ms`);
    }
  }
  
  return result;
};

/**
 * Ejecuta una función de forma asíncrona para no bloquear el hilo principal
 */
export const runAsync = <T>(func: () => T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(func());
    }, 0);
  });
};

/**
 * Optimiza arrays eliminando elementos nulos/undefined sin crear nuevo array
 */
export const compactArray = <T>(array: (T | null | undefined)[]): T[] => {
  let writeIndex = 0;
  
  for (let readIndex = 0; readIndex < array.length; readIndex++) {
    const element = array[readIndex];
    if (element != null) {
      if (writeIndex !== readIndex) {
        array[writeIndex] = element;
      }
      writeIndex++;
    }
  }
  
  array.length = writeIndex;
  return array as T[];
};

/**
 * Cuenta timers activos aproximadamente
 */
const countActiveTimers = (): number => {
  // Esta es una estimación ya que no podemos acceder directamente al pool de timers
  // En un entorno real podrías instrumentar setInterval/setTimeout
  return 5; // Estimación para autopoiesis, movement, clock, etc.
};

/**
 * Libera recursos no utilizados
 */
export const garbageCollect = (): void => {
  // Forzar garbage collection si es posible (solo en desarrollo)
  if (gameConfig.debugMode && 'gc' in window) {
    (window as unknown as { gc: () => void }).gc();
  }
};

/**
 * Obtiene información de rendimiento para debug
 */
export const getPerformanceInfo = (): string => {
  const metrics = updatePerformanceMetrics();
  
  let info = '=== RENDIMIENTO ===\n';
  info += `FPS: ${metrics.fps.toFixed(1)}\n`;
  info += `Frame Time: ${metrics.frameTime.toFixed(2)}ms\n`;
  info += `Memoria: ${metrics.memoryUsage.toFixed(1)}MB\n`;
  info += `Timers Activos: ${metrics.activeTimers}\n\n`;
  
  info += '=== THROTTLING ===\n';
  info += `Autopoiesis: ${autopoiesisThrottler.getInterval()}ms\n`;
  info += `Movement: ${movementThrottler.getInterval()}ms\n`;
  info += `Render: ${renderThrottler.getInterval()}ms\n\n`;
  
  info += '=== POOLS ===\n';
  info += `Position Pool: ${positionPool.getPoolSize()} objetos\n`;
  info += `Stats Pool: ${statsUpdatePool.getPoolSize()} objetos\n`;
  
  return info;
};

/**
 * Configura alertas de rendimiento
 */
export const setupPerformanceMonitoring = (): void => {
  if (!gameConfig.debugMode) return;
  
  setInterval(() => {
    const metrics = updatePerformanceMetrics();
    
    if (metrics.fps < 30) {
      logGeneral.warn(`FPS bajo detectado: ${metrics.fps.toFixed(1)}`);
    }
    
    if (metrics.memoryUsage > 100) { // > 100MB
      logGeneral.warn(`Uso alto de memoria: ${metrics.memoryUsage.toFixed(1)}MB`);
    }
    
  }, 5000); // Verificar cada 5 segundos
};

/**
 * Obtiene métricas actuales de rendimiento
 */
export const getCurrentMetrics = (): PerformanceMetrics => {
  return { ...performanceMetrics };
};
