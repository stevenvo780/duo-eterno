interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  updateTime: number;
  renderTime: number;
  memoryUsage: number;
  activeTimers: number;
  lastMeasurement: number;
}

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
    if (fps < 30) {
      this.adaptiveInterval = Math.min(this.maxInterval, this.adaptiveInterval * 1.2);
    } else if (fps > 55) {
      this.adaptiveInterval = Math.max(this.minInterval, this.adaptiveInterval * 0.9);
    }
  }
  
  getInterval(): number {
    return this.adaptiveInterval;
  }
}

const autopoiesisThrottler = new AdaptiveThrottler(200, 100, 1000);
const movementThrottler = new AdaptiveThrottler(50, 25, 200);

const performanceMetrics: PerformanceMetrics = {
  fps: 60,
  frameTime: 16.67,
  updateTime: 0,
  renderTime: 0,
  memoryUsage: 0,
  activeTimers: 0,
  lastMeasurement: Date.now()
};

export const shouldUpdateAutopoiesis = (): boolean => {
  return autopoiesisThrottler.shouldExecute(Date.now());
};

export const shouldUpdateMovement = (): boolean => {
  return movementThrottler.shouldExecute(Date.now());
};

export const getCurrentMetrics = (): PerformanceMetrics => {
  return { ...performanceMetrics };
};

export const measureExecutionTime = <T>(name: string, fn: () => T): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (performanceMetrics) {
    console.debug(`${name}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
};