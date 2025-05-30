/**
 * SISTEMA DE TELEMETRÍA UNIFICADO - Dúo Eterno
 * Captura snapshots JSON cada 4 segundos para análisis optimizado
 */

import type { Entity, GameState, Zone } from '../types';
import { findEntityZone } from './zoneUtils';

// ==================== TIPOS DE DATOS ====================

export interface GameSnapshot {
  timestamp: number;
  gameTime: number;
  resonance: number;
  entities: {
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
    };
    state: string;
    activity: string;
    isDead: boolean;
    currentZone?: string;
    movementDistance?: number;
  }[];
  systemMetrics: {
    totalEntitiesAlive: number;
    averageHealth: number;
    averageHunger: number;
    averageEnergy: number;
    averageSleepiness: number;
    averageLoneliness: number;
    averageHappiness: number;
    averageBoredom: number;
    distanceBetweenEntities: number;
    entitiesInZones: Record<string, number>;
    activitiesCount: Record<string, number>;
  };
}

export interface TelemetryConfig {
  captureIntervalMs: number; // 4000ms por defecto
  maxSnapshots: number; // límite para evitar memory leaks
  enableConsoleOutput: boolean;
}

// ==================== COLECTOR PRINCIPAL ====================

class UnifiedTelemetryCollector {
  private snapshots: GameSnapshot[] = [];
  private isRecording = false;
  private lastSnapshot: GameSnapshot | null = null;
  private captureInterval: number | null = null;
  private recordingStartTime = 0;
  
  private config: TelemetryConfig = {
    captureIntervalMs: 4000, // 4 segundos
    maxSnapshots: 450, // ~30 minutos de datos
    enableConsoleOutput: true
  };

  // ==================== CONTROL DE GRABACIÓN ====================

  startRecording(customConfig?: Partial<TelemetryConfig>): void {
    if (this.isRecording) {
      this.stopRecording();
    }

    this.config = { ...this.config, ...customConfig };
    this.isRecording = true;
    this.recordingStartTime = Date.now();
    this.snapshots = [];
    
    if (this.config.enableConsoleOutput) {
      console.log(`🔍 Telemetría unificada iniciada - Capturas cada ${this.config.captureIntervalMs/1000}s`);
    }
  }

  stopRecording(): void {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }
    
    if (this.config.enableConsoleOutput) {
      const duration = (Date.now() - this.recordingStartTime) / 1000;
      console.log(`🛑 Telemetría detenida. Duración: ${duration.toFixed(1)}s, Snapshots: ${this.snapshots.length}`);
    }
  }

  // ==================== CAPTURA DE DATOS ====================

  setupAutoCapture(gameStateProvider: () => GameState): void {
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
    }

    this.captureInterval = window.setInterval(() => {
      if (this.isRecording) {
        this.captureSnapshot(gameStateProvider());
      }
    }, this.config.captureIntervalMs);
  }

  captureSnapshot(gameState: GameState): void {
    if (!this.isRecording) return;

    const now = Date.now();
    const currentSnapshot = this.buildSnapshot(gameState, now);
    
    // Calcular distancias de movimiento
    if (this.lastSnapshot) {
      currentSnapshot.entities.forEach(entity => {
        const lastEntity = this.lastSnapshot?.entities.find(e => e.id === entity.id);
        if (lastEntity) {
          const dx = entity.position.x - lastEntity.position.x;
          const dy = entity.position.y - lastEntity.position.y;
          entity.movementDistance = Math.sqrt(dx * dx + dy * dy);
        }
      });
    }

    this.snapshots.push(currentSnapshot);
    this.lastSnapshot = currentSnapshot;

    // Mantener límite de snapshots
    if (this.snapshots.length > this.config.maxSnapshots) {
      this.snapshots.shift(); // Eliminar el más antiguo
    }

    // NUEVO: enviar al servidor remoto
    fetch('http://localhost:3001/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentSnapshot)
    }).catch(() => {/* Silenciar errores */});

    // Log periódico opcional
    if (this.config.enableConsoleOutput && this.snapshots.length % 15 === 0) { // Cada minuto aprox
      this.logProgressSummary();
    }
  }

  private buildSnapshot(gameState: GameState, timestamp: number): GameSnapshot {
    const aliveEntities = gameState.entities.filter(e => !e.isDead);
    
    // Detectar zonas para cada entidad
    const entitiesWithZones = gameState.entities.map(entity => {
      const currentZone = this.findEntityZone(entity, gameState.zones || []);
      return {
        id: entity.id,
        position: { ...entity.position },
        health: entity.stats.health,
        stats: {
          hunger: entity.stats?.hunger || 0,
          energy: entity.stats?.energy || 0,
          sleepiness: entity.stats?.sleepiness || 0,
          loneliness: entity.stats?.loneliness || 0,
          happiness: entity.stats?.happiness || 0,
          boredom: entity.stats?.boredom || 0,
        },
        state: entity.state || 'IDLE',
        activity: entity.activity || 'NONE',
        isDead: entity.isDead,
        currentZone: currentZone?.type
      };
    });

    // Calcular métricas del sistema
    const totalHealth = aliveEntities.reduce((sum, e) => sum + e.stats.health, 0);
    const totalHunger = aliveEntities.reduce((sum, e) => sum + (e.stats?.hunger || 0), 0);
    const totalEnergy = aliveEntities.reduce((sum, e) => sum + (e.stats?.energy || 0), 0);
    const totalSleepiness = aliveEntities.reduce((sum, e) => sum + (e.stats?.sleepiness || 0), 0);
    const totalLoneliness = aliveEntities.reduce((sum, e) => sum + (e.stats?.loneliness || 0), 0);
    const totalHappiness = aliveEntities.reduce((sum, e) => sum + (e.stats?.happiness || 0), 0);
    const totalBoredom = aliveEntities.reduce((sum, e) => sum + (e.stats?.boredom || 0), 0);

    // Contar entidades por zona
    const entitiesInZones: Record<string, number> = {};
    entitiesWithZones.forEach(entity => {
      if (entity.currentZone && !entity.isDead) {
        entitiesInZones[entity.currentZone] = (entitiesInZones[entity.currentZone] || 0) + 1;
      }
    });

    // Contar actividades
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
      timestamp,
      gameTime: gameState.cycles || 0,
      resonance: gameState.resonance,
      entities: entitiesWithZones,
      systemMetrics: {
        totalEntitiesAlive: aliveEntities.length,
        averageHealth: aliveEntities.length > 0 ? totalHealth / aliveEntities.length : 0,
        averageHunger: aliveEntities.length > 0 ? totalHunger / aliveEntities.length : 0,
        averageEnergy: aliveEntities.length > 0 ? totalEnergy / aliveEntities.length : 0,
        averageSleepiness: aliveEntities.length > 0 ? totalSleepiness / aliveEntities.length : 0,
        averageLoneliness: aliveEntities.length > 0 ? totalLoneliness / aliveEntities.length : 0,
        averageHappiness: aliveEntities.length > 0 ? totalHappiness / aliveEntities.length : 0,
        averageBoredom: aliveEntities.length > 0 ? totalBoredom / aliveEntities.length : 0,
        distanceBetweenEntities,
        entitiesInZones,
        activitiesCount
      }
    };
  }

  private findEntityZone(entity: Entity, zones: Zone[]): Zone | null {
    return findEntityZone(entity, zones);
  }

  // ==================== ANÁLISIS Y ACCESO ====================

  getSnapshots(): GameSnapshot[] {
    return [...this.snapshots];
  }

  getLatestSnapshot(): GameSnapshot | null {
    return this.snapshots[this.snapshots.length - 1] || null;
  }

  getSnapshotCount(): number {
    return this.snapshots.length;
  }

  exportToJSON(): string {
    const exportData = {
      recordingPeriod: {
        start: this.recordingStartTime,
        end: Date.now(),
        durationMs: Date.now() - this.recordingStartTime
      },
      config: this.config,
      totalSnapshots: this.snapshots.length,
      snapshots: this.snapshots
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  private logProgressSummary(): void {
    const latest = this.getLatestSnapshot();
    if (!latest) return;

    const aliveCount = latest.systemMetrics.totalEntitiesAlive;
    const avgHealth = latest.systemMetrics.averageHealth.toFixed(1);
    const resonance = latest.resonance.toFixed(1);
    const movementData = latest.entities
      .filter(e => !e.isDead && e.movementDistance)
      .map(e => e.movementDistance!.toFixed(1))
      .join(', ');

    console.log(`📊 Telemetría [${this.snapshots.length} snapshots]: ` +
                `${aliveCount} vivos, salud avg: ${avgHealth}, resonancia: ${resonance}` +
                (movementData ? `, movimiento: [${movementData}]` : ''));
  }

  // ==================== ANÁLISIS RÁPIDO ====================

  getQuickAnalysis(): {
    recordingTime: number;
    totalSnapshots: number;
    avgSurvivalTime: number;
    currentResonance: number;
    totalMovementDistance: number;
    zoneUsageStats: Record<string, number>;
  } | null {
    if (this.snapshots.length === 0) return null;

    const latest = this.getLatestSnapshot()!;
    const recordingTime = (Date.now() - this.recordingStartTime) / 1000;
    
    // Calcular distancia total de movimiento
    const totalMovement = this.snapshots.reduce((sum, snapshot) => {
      return sum + snapshot.entities.reduce((entitySum, entity) => {
        return entitySum + (entity.movementDistance || 0);
      }, 0);
    }, 0);

    // Estadísticas de uso de zonas
    const zoneStats: Record<string, number> = {};
    this.snapshots.forEach(snapshot => {
      Object.entries(snapshot.systemMetrics.entitiesInZones).forEach(([zone, count]) => {
        zoneStats[zone] = (zoneStats[zone] || 0) + count;
      });
    });

    return {
      recordingTime,
      totalSnapshots: this.snapshots.length,
      avgSurvivalTime: recordingTime, // Simplificado
      currentResonance: latest.resonance,
      totalMovementDistance: totalMovement,
      zoneUsageStats: zoneStats
    };
  }

  clearData(): void {
    this.snapshots = [];
    this.lastSnapshot = null;
    if (this.config.enableConsoleOutput) {
      console.log('🗑️ Datos de telemetría eliminados');
    }
  }
}

// ==================== INSTANCIA GLOBAL ====================

export const unifiedTelemetry = new UnifiedTelemetryCollector();

// ==================== UTILIDADES ====================

export function startTelemetryRecording(options?: Partial<TelemetryConfig>) {
  unifiedTelemetry.startRecording(options);
}

export function stopTelemetryRecording() {
  unifiedTelemetry.stopRecording();
}

export function getCurrentTelemetryData(): GameSnapshot[] {
  return unifiedTelemetry.getSnapshots();
}

export function exportTelemetryData(): string {
  return unifiedTelemetry.exportToJSON();
}
