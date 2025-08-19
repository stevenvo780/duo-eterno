/**
 * F4: Sistema de telemetría y observabilidad para SLOs
 */

interface TelemetryEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
}

class TelemetryManager {
  private events: TelemetryEvent[] = [];
  private maxEvents = 1000; // Rolling buffer
  private performanceMarks = new Map<string, number>();

  // F4: Core telemetry events
  public logMapGenerated(data: { seed: string; tiles: number; roads: number; ms: number }): void {
    this.addEvent('map:generated', data);
  }

  public logRenderFrame(data: { dt: number; drawnTiles: number; drawnSprites: number }): void {
    this.addEvent('render:frame', data);
  }

  public logAssetDecoded(data: { path: string; ms: number; bytes?: number }): void {
    this.addEvent('asset:decoded', data);
  }

  public logRoadRendererPlaced(data: { straight: number; curve: number; t: number; cross: number; end: number }): void {
    this.addEvent('roadRenderer:placed', data);
  }

  // Performance monitoring
  public startPerformanceMark(name: string): void {
    this.performanceMarks.set(name, performance.now());
    performance.mark(`start-${name}`);
  }

  public endPerformanceMark(name: string): number {
    const startTime = this.performanceMarks.get(name);
    if (!startTime) return 0;

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    performance.mark(`end-${name}`);
    performance.measure(name, `start-${name}`, `end-${name}`);
    
    this.performanceMarks.delete(name);
    return duration;
  }

  // SLO monitoring
  public checkSLOs(): { fps: boolean; ttfmp: boolean; memory: boolean } {
    const recentFrames = this.getRecentEvents('render:frame', 60); // Last 60 frames
    const avgFps = recentFrames.length > 0 
      ? recentFrames.reduce((sum, e) => sum + (1000 / (e.data.dt as number)), 0) / recentFrames.length 
      : 0;

    const mapGenEvents = this.getRecentEvents('map:generated', 1);
    const ttfmp = mapGenEvents.length > 0 ? (mapGenEvents[0].data.ms as number) : Infinity;

    return {
      fps: avgFps >= 55, // SLO: ≥55 FPS
      ttfmp: ttfmp <= 1200, // SLO: ≤1200ms TTFMP
      memory: this.estimateMemoryUsage() <= 150 * 1024 * 1024 // SLO: ≤150MB
    };
  }

  // Helper methods
  private addEvent(type: string, data: Record<string, unknown>): void {
    this.events.push({
      type,
      data,
      timestamp: Date.now()
    });

    // Rolling buffer
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  private getRecentEvents(type: string, count: number): TelemetryEvent[] {
    return this.events
      .filter(e => e.type === type)
      .slice(-count);
  }

  private estimateMemoryUsage(): number {
    // Rough estimation - in real apps would use performance.memory
    return this.events.length * 100; // Estimate 100 bytes per event
  }

  public getStats(): { 
    totalEvents: number; 
    recentFps: number; 
    slos: { fps: boolean; ttfmp: boolean; memory: boolean } 
  } {
    const recentFrames = this.getRecentEvents('render:frame', 10);
    const recentFps = recentFrames.length > 0 
      ? recentFrames.reduce((sum, e) => sum + (1000 / (e.data.dt as number)), 0) / recentFrames.length 
      : 0;

    return {
      totalEvents: this.events.length,
      recentFps: Math.round(recentFps),
      slos: this.checkSLOs()
    };
  }

  // Debug export
  public exportEvents(): TelemetryEvent[] {
    return [...this.events];
  }
}

// Singleton instance
export const telemetry = new TelemetryManager();

// F4: Convenience hooks for common patterns
export function withPerformanceTracking<T>(name: string, fn: () => T): T {
  telemetry.startPerformanceMark(name);
  const result = fn();
  const duration = telemetry.endPerformanceMark(name);
  console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
  return result;
}

export async function withAsyncPerformanceTracking<T>(name: string, fn: () => Promise<T>): Promise<T> {
  telemetry.startPerformanceMark(name);
  const result = await fn();
  const duration = telemetry.endPerformanceMark(name);
  console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
  return result;
}
