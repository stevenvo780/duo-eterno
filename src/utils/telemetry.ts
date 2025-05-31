/**
 * SISTEMA DE TELEMETRÍA SIMPLIFICADO - Dúo Eterno
 * Captura snapshots y los envía al backend para almacenamiento
 */

import type { GameState } from '../types';
import { findEntityZone } from './zoneUtils';
import * as apiService from '../services/apiService';

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
  captureIntervalMs: number;
  enableConsoleOutput: boolean;
  sendToBackend: boolean;
}

// ==================== COLECTOR SIMPLIFICADO ====================

class SimplifiedTelemetryCollector {
  private isRecording = false;
  private lastSnapshot: GameSnapshot | null = null;
  private captureInterval: number | null = null;
  private recordingStartTime = 0;
  private snapshotCount = 0;
  
  private config: TelemetryConfig = {
    captureIntervalMs: 4000, // 4 segundos
    enableConsoleOutput: false, // Reducir spam de logs
    sendToBackend: true
  };

  // ==================== CONTROL DE GRABACIÓN ====================

  startRecording(customConfig?: Partial<TelemetryConfig>): void {
    if (this.isRecording) {
      this.stopRecording();
    }

    this.config = { ...this.config, ...customConfig };
    this.isRecording = true;
    this.recordingStartTime = Date.now();
    this.snapshotCount = 0;
    
    console.log(`📊 Telemetría iniciada - Enviando al backend cada ${this.config.captureIntervalMs/1000}s`);
  }

  stopRecording(): void {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }
    
    const duration = (Date.now() - this.recordingStartTime) / 1000;
    console.log(`📊 Telemetría detenida. Duración: ${duration.toFixed(1)}s, Snapshots enviados: ${this.snapshotCount}`);
  }

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

  // ==================== CAPTURA DE DATOS ====================

  async captureSnapshot(gameState: GameState): Promise<void> {
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

    // Enviar al backend si está habilitado
    if (this.config.sendToBackend) {
      const success = await apiService.sendTelemetrySnapshot(currentSnapshot);
      if (success) {
        this.snapshotCount++;
      }
    }

    this.lastSnapshot = currentSnapshot;

    // Log periódico opcional
    if (this.config.enableConsoleOutput && this.snapshotCount % 15 === 0) {
      console.log(`📊 Snapshots enviados: ${this.snapshotCount}`);
    }
  }

  private buildSnapshot(gameState: GameState, timestamp: number): GameSnapshot {
    const aliveEntities = gameState.entities.filter(e => !e.isDead);
    
    // Detectar zonas para cada entidad
    const entitiesWithZones = gameState.entities.map(entity => {
      const currentZone = findEntityZone(entity, gameState.zones || []);
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
    const aliveCount = aliveEntities.length;
    const avgHealth = aliveCount > 0 ? aliveEntities.reduce((sum, e) => sum + e.stats.health, 0) / aliveCount : 0;
    const avgHunger = aliveCount > 0 ? aliveEntities.reduce((sum, e) => sum + (e.stats?.hunger || 0), 0) / aliveCount : 0;
    const avgEnergy = aliveCount > 0 ? aliveEntities.reduce((sum, e) => sum + (e.stats?.energy || 0), 0) / aliveCount : 0;
    const avgSleepiness = aliveCount > 0 ? aliveEntities.reduce((sum, e) => sum + (e.stats?.sleepiness || 0), 0) / aliveCount : 0;
    const avgLoneliness = aliveCount > 0 ? aliveEntities.reduce((sum, e) => sum + (e.stats?.loneliness || 0), 0) / aliveCount : 0;
    const avgHappiness = aliveCount > 0 ? aliveEntities.reduce((sum, e) => sum + (e.stats?.happiness || 0), 0) / aliveCount : 0;
    const avgBoredom = aliveCount > 0 ? aliveEntities.reduce((sum, e) => sum + (e.stats?.boredom || 0), 0) / aliveCount : 0;

    // Distancia entre entidades
    let distanceBetweenEntities = 0;
    if (aliveEntities.length >= 2) {
      const dx = aliveEntities[0].position.x - aliveEntities[1].position.x;
      const dy = aliveEntities[0].position.y - aliveEntities[1].position.y;
      distanceBetweenEntities = Math.sqrt(dx * dx + dy * dy);
    }

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

    return {
      timestamp,
      gameTime: gameState.cycles || 0,
      resonance: gameState.resonance || 0,
      entities: entitiesWithZones,
      systemMetrics: {
        totalEntitiesAlive: aliveCount,
        averageHealth: Math.round(avgHealth * 100) / 100,
        averageHunger: Math.round(avgHunger * 100) / 100,
        averageEnergy: Math.round(avgEnergy * 100) / 100,
        averageSleepiness: Math.round(avgSleepiness * 100) / 100,
        averageLoneliness: Math.round(avgLoneliness * 100) / 100,
        averageHappiness: Math.round(avgHappiness * 100) / 100,
        averageBoredom: Math.round(avgBoredom * 100) / 100,
        distanceBetweenEntities: Math.round(distanceBetweenEntities * 100) / 100,
        entitiesInZones,
        activitiesCount
      }
    };
  }

  // ==================== INFORMACIÓN PÚBLICA ====================

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  getSnapshotCount(): number {
    return this.snapshotCount;
  }

  getRecordingDuration(): number {
    if (!this.isRecording) return 0;
    return (Date.now() - this.recordingStartTime) / 1000;
  }
}

// ==================== INSTANCIA GLOBAL ====================

export const telemetry = new SimplifiedTelemetryCollector();

// ==================== FUNCIONES DE CONVENIENCIA ====================

export function startTelemetryRecording(options?: Partial<TelemetryConfig>) {
  telemetry.startRecording(options);
}

export function stopTelemetryRecording() {
  telemetry.stopRecording();
}

// ==================== FUNCIONES PARA ANALYTICS ====================

export async function generateAnalyticsReport(analysisType: 'summary' | 'detailed' = 'summary') {
  return await apiService.generateAnalyticsReport(undefined, analysisType);
}

export async function getAvailableReports() {
  return await apiService.getAnalyticsReports();
}

export async function getTelemetrySessions() {
  return await apiService.getTelemetrySessions();
}

// ==================== FUNCIONES DE DATOS LOCALES (COMPATIBILIDAD) ====================

// Estas funciones están aquí para mantener compatibilidad con el código existente
// Pero ahora los datos reales se almacenan en el backend

export function getCurrentTelemetryData(): GameSnapshot[] {
  console.warn('getCurrentTelemetryData(): Los datos ahora se almacenan en el backend. Use getTelemetrySessions() en su lugar.');
  return [];
}

export function exportTelemetryData(): string {
  console.warn('exportTelemetryData(): Use las funciones de analytics del backend en su lugar.');
  return JSON.stringify({ message: 'Los datos ahora se almacenan en el backend' }, null, 2);
}
