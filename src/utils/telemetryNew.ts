/**
 * SISTEMA DE TELEMETRÍA - Dúo Eterno
 * Captura y analiza estadísticas del progreso del juego en tiempo real
 */

import type { Entity, GameState } from '../types';

// ==================== TIPOS DE DATOS ====================

export interface TelemetrySnapshot {
  timestamp: number;
  gameTime: number;
  resonance: number;
  entities: EntitySnapshot[];
  systemMetrics: SystemMetrics;
}

export interface EntitySnapshot {
  id: string;
  position: { x: number; y: number };
  health: number;
  stats: {
    hunger: number;
    energy: number;
    sleepiness: number;
    loneliness: number;
    happiness: number;
    boredom: number;
    money: number;
  };
  state: string;
  activity: string;
  isDead: boolean;
  currentZone?: string;
  movementDistance?: number; // Distancia recorrida desde último snapshot
}

export interface SystemMetrics {
  totalEntitiesAlive: number;
  averageHealth: number;
  averageHunger: number;
  averageEnergy: number;
  averageSleepiness: number;
  entitiesInZones: Record<string, number>;
  activitiesCount: Record<string, number>;
  distanceBetweenEntities: number;
}

export interface TelemetryAnalysis {
  timeSpan: { start: number; end: number };
  totalSnapshots: number;
  entityAnalysis: EntityAnalysis[];
  systemAnalysis: SystemAnalysis;
  problems: Problem[];
  recommendations: string[];
}

export interface EntityAnalysis {
  entityId: string;
  survivalTime: number;
  averageStats: {
    health: number;
    hunger: number;
    energy: number;
    sleepiness: number;
    loneliness: number;
    happiness: number;
    boredom: number;
  };
  statsTrends: {
    health: 'increasing' | 'decreasing' | 'stable' | 'erratic';
    hunger: 'increasing' | 'decreasing' | 'stable' | 'erratic';
    energy: 'increasing' | 'decreasing' | 'stable' | 'erratic';
    sleepiness: 'increasing' | 'decreasing' | 'stable' | 'erratic';
  };
  movementAnalysis: {
    totalDistance: number;
    averageSpeed: number;
    isStuck: boolean;
    stuckDuration: number;
  };
  zoneUsage: Record<string, number>; // Tiempo pasado en cada zona
  activityUsage: Record<string, number>; // Tiempo en cada actividad
  deathCause?: string;
}

export interface SystemAnalysis {
  averageSurvivalTime: number;
  resonanceTrend: 'increasing' | 'decreasing' | 'stable' | 'erratic';
  systemStability: 'stable' | 'unstable' | 'declining';
  zoneEffectiveness: Record<string, number>; // Qué tan efectivas son las zonas
  activityEffectiveness: Record<string, number>; // Qué tan efectivas son las actividades
}

export interface Problem {
  type: 'stagnation' | 'rapid_death' | 'stat_imbalance' | 'zone_ineffective' | 'movement_stuck';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedEntities?: string[];
  suggestedFix?: string;
}

class TelemetryCollector {
  private snapshots: TelemetrySnapshot[] = [];
  private isRecording = false;
  private lastSnapshot: TelemetrySnapshot | null = null;
  private recordingStartTime = 0;

  startRecording(): void {
    this.isRecording = true;
    this.recordingStartTime = Date.now();
    this.snapshots = [];
    console.log('🔍 Telemetría iniciada');
  }

  stopRecording(): void {
    this.isRecording = false;
    console.log(`🔍 Telemetría detenida. ${this.snapshots.length} snapshots capturados.`);
  }

  captureSnapshot(gameState: GameState): void {
    if (!this.isRecording) return;

    const now = Date.now();
    const snapshot: TelemetrySnapshot = {
      timestamp: now,
      gameTime: gameState.cycles || 0,
      resonance: gameState.resonance,
      entities: this.captureEntitySnapshots(gameState.entities),
      systemMetrics: this.calculateSystemMetrics(gameState)
    };

    // Calcular distancia de movimiento si hay snapshot anterior
    if (this.lastSnapshot) {
      snapshot.entities.forEach(entity => {
        const lastEntity = this.lastSnapshot!.entities.find(e => e.id === entity.id);
        if (lastEntity) {
          const dx = entity.position.x - lastEntity.position.x;
          const dy = entity.position.y - lastEntity.position.y;
          entity.movementDistance = Math.sqrt(dx * dx + dy * dy);
        }
      });
    }

    this.snapshots.push(snapshot);
    this.lastSnapshot = snapshot;
  }

  private captureEntitySnapshots(entities: Entity[]): EntitySnapshot[] {
    return entities.map(entity => ({
      id: entity.id,
      position: { ...entity.position },
      health: entity.health || 0,
      stats: {
        hunger: entity.stats?.hunger || 0,
        energy: entity.stats?.energy || 0,
        sleepiness: entity.stats?.sleepiness || 0,
        loneliness: entity.stats?.loneliness || 0,
        happiness: entity.stats?.happiness || 0,
        boredom: entity.stats?.boredom || 0,
        money: entity.stats?.money || 0
      },
      state: entity.state,
      activity: entity.activity,
      isDead: entity.isDead || false,
      movementDistance: 0
    }));
  }

  private calculateSystemMetrics(gameState: GameState): SystemMetrics {
    const aliveEntities = gameState.entities.filter(e => !e.isDead);
    
    const totalHealth = aliveEntities.reduce((sum, e) => sum + (e.health || 0), 0);
    const totalHunger = aliveEntities.reduce((sum, e) => sum + (e.stats?.hunger || 0), 0);
    const totalEnergy = aliveEntities.reduce((sum, e) => sum + (e.stats?.energy || 0), 0);
    const totalSleepiness = aliveEntities.reduce((sum, e) => sum + (e.stats?.sleepiness || 0), 0);

    const activitiesCount: Record<string, number> = {};

    aliveEntities.forEach(entity => {
      if (entity.activity) {
        activitiesCount[entity.activity] = (activitiesCount[entity.activity] || 0) + 1;
      }
    });

    // Calcular distancia entre entidades
    let distanceBetweenEntities = 0;
    if (aliveEntities.length === 2) {
      const [entity1, entity2] = aliveEntities;
      const dx = entity1.position.x - entity2.position.x;
      const dy = entity1.position.y - entity2.position.y;
      distanceBetweenEntities = Math.sqrt(dx * dx + dy * dy);
    }

    return {
      totalEntitiesAlive: aliveEntities.length,
      averageHealth: aliveEntities.length > 0 ? totalHealth / aliveEntities.length : 0,
      averageHunger: aliveEntities.length > 0 ? totalHunger / aliveEntities.length : 0,
      averageEnergy: aliveEntities.length > 0 ? totalEnergy / aliveEntities.length : 0,
      averageSleepiness: aliveEntities.length > 0 ? totalSleepiness / aliveEntities.length : 0,
      entitiesInZones: {},
      activitiesCount,
      distanceBetweenEntities
    };
  }

  analyzeData(): TelemetryAnalysis {
    if (this.snapshots.length === 0) {
      throw new Error('No hay datos de telemetría para analizar');
    }

    const firstSnapshot = this.snapshots[0];
    const lastSnapshot = this.snapshots[this.snapshots.length - 1];

    return {
      timeSpan: {
        start: firstSnapshot.timestamp,
        end: lastSnapshot.timestamp
      },
      totalSnapshots: this.snapshots.length,
      entityAnalysis: this.analyzeEntities(),
      systemAnalysis: this.analyzeSystem(),
      problems: this.detectProblems(),
      recommendations: this.generateRecommendations()
    };
  }

  private analyzeEntities(): EntityAnalysis[] {
    const entityIds = [...new Set(this.snapshots.flatMap(s => s.entities.map(e => e.id)))];
    
    return entityIds.map(entityId => {
      const entitySnapshots = this.snapshots
        .map(s => s.entities.find(e => e.id === entityId))
        .filter(Boolean) as EntitySnapshot[];

      if (entitySnapshots.length === 0) {
        return this.createEmptyEntityAnalysis(entityId);
      }

      return this.analyzeEntityData(entityId, entitySnapshots);
    });
  }

  private createEmptyEntityAnalysis(entityId: string): EntityAnalysis {
    return {
      entityId,
      survivalTime: 0,
      averageStats: { health: 0, hunger: 0, energy: 0, sleepiness: 0, loneliness: 0, happiness: 0, boredom: 0 },
      statsTrends: { health: 'stable', hunger: 'stable', energy: 'stable', sleepiness: 'stable' },
      movementAnalysis: { totalDistance: 0, averageSpeed: 0, isStuck: false, stuckDuration: 0 },
      zoneUsage: {},
      activityUsage: {}
    };
  }

  private analyzeEntityData(entityId: string, snapshots: EntitySnapshot[]): EntityAnalysis {
    const survivalTime = snapshots.length;

    // Calcular promedios
    const totalStats = snapshots.reduce((acc, snapshot) => ({
      health: acc.health + snapshot.health,
      hunger: acc.hunger + snapshot.stats.hunger,
      energy: acc.energy + snapshot.stats.energy,
      sleepiness: acc.sleepiness + snapshot.stats.sleepiness,
      loneliness: acc.loneliness + snapshot.stats.loneliness,
      happiness: acc.happiness + snapshot.stats.happiness,
      boredom: acc.boredom + snapshot.stats.boredom
    }), { health: 0, hunger: 0, energy: 0, sleepiness: 0, loneliness: 0, happiness: 0, boredom: 0 });

    const averageStats = {
      health: totalStats.health / snapshots.length,
      hunger: totalStats.hunger / snapshots.length,
      energy: totalStats.energy / snapshots.length,
      sleepiness: totalStats.sleepiness / snapshots.length,
      loneliness: totalStats.loneliness / snapshots.length,
      happiness: totalStats.happiness / snapshots.length,
      boredom: totalStats.boredom / snapshots.length
    };

    // Analizar tendencias
    const statsTrends = {
      health: this.calculateTrend(snapshots.map(s => s.health)),
      hunger: this.calculateTrend(snapshots.map(s => s.stats.hunger)),
      energy: this.calculateTrend(snapshots.map(s => s.stats.energy)),
      sleepiness: this.calculateTrend(snapshots.map(s => s.stats.sleepiness))
    };

    // Análisis de movimiento
    const totalDistance = snapshots.reduce((sum, s) => sum + (s.movementDistance || 0), 0);
    const movementAnalysis = {
      totalDistance,
      averageSpeed: totalDistance / snapshots.length,
      isStuck: this.detectStuckMovement(snapshots),
      stuckDuration: this.calculateStuckDuration(snapshots)
    };

    // Uso de actividades
    const activityUsage: Record<string, number> = {};
    snapshots.forEach(snapshot => {
      if (snapshot.activity) {
        activityUsage[snapshot.activity] = (activityUsage[snapshot.activity] || 0) + 1;
      }
    });

    const lastSnapshot = snapshots[snapshots.length - 1];

    return {
      entityId,
      survivalTime,
      averageStats,
      statsTrends,
      movementAnalysis,
      zoneUsage: {},
      activityUsage,
      deathCause: lastSnapshot.isDead ? this.determineDealthCause(snapshots) : undefined
    };
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' | 'erratic' {
    if (values.length < 3) return 'stable';

    // Calcular pendiente usando regresión lineal simple
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    const sumX = indices.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * values[i], 0);
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Calcular varianza para detectar erraticidad
    const mean = sumY / n;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const coefficient = variance / (mean || 1);

    // Si la variación es muy alta, es errático
    if (coefficient > 0.5) return 'erratic';

    // Determinar tendencia basada en la pendiente
    if (Math.abs(slope) < 0.1) return 'stable';
    return slope > 0 ? 'increasing' : 'decreasing';
  }

  private detectStuckMovement(snapshots: EntitySnapshot[]): boolean {
    if (snapshots.length < 10) return false;

    // Verificar si la entidad se ha movido muy poco en los últimos snapshots
    const recentSnapshots = snapshots.slice(-10);
    const totalRecentMovement = recentSnapshots.reduce((sum, s) => sum + (s.movementDistance || 0), 0);
    
    return totalRecentMovement < 5; // Menos de 5 píxeles en 10 snapshots
  }

  private calculateStuckDuration(snapshots: EntitySnapshot[]): number {
    let stuckCount = 0;
    let maxStuckCount = 0;
    
    for (const snapshot of snapshots.reverse()) {
      if ((snapshot.movementDistance || 0) < 0.5) {
        stuckCount++;
      } else {
        maxStuckCount = Math.max(maxStuckCount, stuckCount);
        stuckCount = 0;
      }
    }
    
    return Math.max(maxStuckCount, stuckCount);
  }

  private determineDealthCause(snapshots: EntitySnapshot[]): string {
    const lastSnapshot = snapshots[snapshots.length - 1];
    const stats = lastSnapshot.stats;

    if (stats.hunger < 10) return 'inanición';
    if (stats.energy < 10) return 'agotamiento';
    if (lastSnapshot.health < 10) return 'deterioro de salud';
    
    return 'causa desconocida';
  }

  private analyzeSystem(): SystemAnalysis {
    const entityAnalyses = this.analyzeEntities();
    const survivalTimes = entityAnalyses.map(e => e.survivalTime);
    const averageSurvivalTime = survivalTimes.reduce((a, b) => a + b, 0) / survivalTimes.length;

    // Analizar tendencia de resonancia
    const resonanceValues = this.snapshots.map(s => s.resonance);
    const resonanceTrend = this.calculateTrend(resonanceValues);

    // Determinar estabilidad del sistema
    const aliveEntitiesOverTime = this.snapshots.map(s => s.systemMetrics.totalEntitiesAlive);
    const systemStability = this.determineSystemStability(aliveEntitiesOverTime);

    // Efectividad de zonas y actividades
    const zoneEffectiveness = this.calculateZoneEffectiveness();
    const activityEffectiveness = this.calculateActivityEffectiveness();

    return {
      averageSurvivalTime,
      resonanceTrend,
      systemStability,
      zoneEffectiveness,
      activityEffectiveness
    };
  }

  private determineSystemStability(aliveEntitiesOverTime: number[]): 'stable' | 'unstable' | 'declining' {
    const trend = this.calculateTrend(aliveEntitiesOverTime);
    const variance = this.calculateVariance(aliveEntitiesOverTime);
    
    if (trend === 'decreasing') return 'declining';
    if (variance > 0.5 || trend === 'erratic') return 'unstable';
    return 'stable';
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance / (mean || 1);
  }

  private calculateZoneEffectiveness(): Record<string, number> {
    // Calcular qué tan efectiva es cada zona para mejorar las estadísticas
    const zoneEffectiveness: Record<string, number> = {};
    
    // Esta es una implementación simplificada - se puede mejorar
    const zoneUsage = this.snapshots.flatMap(s => 
      Object.entries(s.systemMetrics.entitiesInZones)
    );
    
    zoneUsage.forEach(([zone, count]) => {
      zoneEffectiveness[zone] = (zoneEffectiveness[zone] || 0) + count;
    });

    return zoneEffectiveness;
  }

  private calculateActivityEffectiveness(): Record<string, number> {
    // Similar al cálculo de efectividad de zonas
    const activityEffectiveness: Record<string, number> = {};
    
    const activityUsage = this.snapshots.flatMap(s => 
      Object.entries(s.systemMetrics.activitiesCount)
    );
    
    activityUsage.forEach(([activity, count]) => {
      activityEffectiveness[activity] = (activityEffectiveness[activity] || 0) + count;
    });

    return activityEffectiveness;
  }

  private detectProblems(): Problem[] {
    const problems: Problem[] = [];
    const entityAnalyses = this.analyzeEntities();

    // Detectar entidades estancadas
    entityAnalyses.forEach(analysis => {
      if (analysis.movementAnalysis.isStuck) {
        problems.push({
          type: 'movement_stuck',
          severity: 'medium',
          description: `Entidad ${analysis.entityId} está estancada (movimiento mínimo)`,
          affectedEntities: [analysis.entityId],
          suggestedFix: 'Revisar algoritmo de movimiento y navegación'
        });
      }

      // Detectar muerte rápida
      if (analysis.survivalTime < 30) { // Menos de 30 snapshots
        problems.push({
          type: 'rapid_death',
          severity: 'high',
          description: `Entidad ${analysis.entityId} murió muy rápido (${analysis.survivalTime} snapshots)`,
          affectedEntities: [analysis.entityId],
          suggestedFix: 'Reducir tasas de decaimiento o mejorar recuperación'
        });
      }

      // Detectar desequilibrios de estadísticas
      const { averageStats } = analysis;
      if (averageStats.hunger < 20 || averageStats.energy < 20) {
        problems.push({
          type: 'stat_imbalance',
          severity: 'medium',
          description: `Entidad ${analysis.entityId} tiene estadísticas críticamente bajas`,
          affectedEntities: [analysis.entityId],
          suggestedFix: 'Ajustar tasas de recuperación o efectividad de zonas'
        });
      }
    });

    // Detectar problemas del sistema
    const systemAnalysis = this.analyzeSystem();
    if (systemAnalysis.systemStability === 'declining') {
      problems.push({
        type: 'stagnation',
        severity: 'critical',
        description: 'El sistema está en declive - las entidades mueren consistentemente',
        suggestedFix: 'Rebalancear parámetros globales del sistema'
      });
    }

    return problems;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const problems = this.detectProblems();

    if (problems.some(p => p.type === 'rapid_death')) {
      recommendations.push('Reducir HEALTH_DECAY_RATE y STAT_DECAY_RATE');
      recommendations.push('Aumentar valores iniciales de estadísticas');
    }

    if (problems.some(p => p.type === 'movement_stuck')) {
      recommendations.push('Mejorar algoritmo de navegación y detección de objetivos');
      recommendations.push('Añadir variabilidad en la selección de destinos');
    }

    if (problems.some(p => p.type === 'stat_imbalance')) {
      recommendations.push('Aumentar ZONE_RECOVERY_RATE');
      recommendations.push('Revisar efectividad de las zonas de recuperación');
    }

    return recommendations;
  }

  exportData(): string {
    const analysis = this.analyzeData();
    
    return JSON.stringify({
      collectionInfo: {
        startTime: this.recordingStartTime,
        endTime: Date.now(),
        totalSnapshots: this.snapshots.length,
        recordingDuration: Date.now() - this.recordingStartTime
      },
      snapshots: this.snapshots,
      analysis
    }, null, 2);
  }

  getSnapshots(): TelemetrySnapshot[] {
    return [...this.snapshots];
  }

  clearData(): void {
    this.snapshots = [];
    this.lastSnapshot = null;
  }
}

// Singleton instance
export const telemetryCollector = new TelemetryCollector();
