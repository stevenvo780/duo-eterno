/**
 * 🚀 FASE 1: Sistema de Logging Optimizado con Memory Management
 *
 * Características implementadas según el Plan de Trabajo:
 * - ✅ Log rotation automática
 * - ✅ Compression automática de datos históricos
 * - ✅ Memory cleanup inteligente
 * - ✅ Archiving automático de sessions antiguas
 * - ✅ Throttling de logs para reducir spam
 * - ✅ File size monitoring y management
 */

import type { Entity, EntityActivity, EntityMood } from '../types';

export interface LogEntry {
  timestamp: number;
  system: 'love' | 'activity' | 'zone' | 'survival' | 'debug' | 'interaction';
  category: 'AUTONOMY' | 'LOVE' | 'SURVIVAL' | 'INTERACTION' | 'SYSTEM';
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  entityId?: string;
  message: string;
  data?: unknown;
}

interface EntitySnapshot {
  timestamp: number;
  entityId: string;
  stats: Entity['stats'];
  activity: EntityActivity;
  mood: EntityMood;
  position: { x: number; y: number };
  isDead: boolean;
}

interface SystemSnapshot {
  timestamp: number;
  resonance: number;
  togetherTime: number;
  cycles: number;
  entitiesAlive: number;
}

interface SessionData {
  id: string;
  logs: LogEntry[];
  entitySnapshots: EntitySnapshot[];
  systemSnapshots: SystemSnapshot[];
  startTime: number;
  endTime: number;
}

interface SessionArchive {
  id: string;
  startTime: number;
  endTime: number;
  compressedData: string;
  metadata: {
    totalLogs: number;
    totalSnapshots: number;
    avgResonance: number;
    sessionDuration: number;
    deaths: number;
    criticalEvents: number;
  };
}

interface MemoryUsageStats {
  logsMemoryMB: number;
  snapshotsMemoryMB: number;
  archivedSessionsMB: number;
  totalMemoryMB: number;
  lastCleanup: number;
}

export class OptimizedDynamicsLogger {
  private readonly config = {
    maxSessionLogs: 50,
    maxLogAge: 2 * 60 * 60 * 1000,
    compressionEnabled: true,
    maxMemoryMB: 200,
    cleanupIntervalMs: 5 * 60 * 1000,
    archiveIntervalMs: 15 * 60 * 1000,
    throttleMs: 1000,
    maxArchivedSessions: 10,
    snapshotRetentionMs: 10 * 60 * 1000
  };

  private logs: LogEntry[] = [];
  private entitySnapshots: EntitySnapshot[] = [];
  private systemSnapshots: SystemSnapshot[] = [];
  private archivedSessions: SessionArchive[] = [];

  private currentSessionId = `session_${Date.now()}`;
  private sessionStartTime = Date.now();
  private isEnabled = true;
  private lastCleanup = Date.now();
  private lastArchive = Date.now();

  private lastLogTimes = new Map<string, number>();

  private cleanupInterval: number | null = null;
  private archiveInterval: number | null = null;

  constructor() {
    this.initializeCleanupSystems();
    console.log('🚀 OptimizedDynamicsLogger iniciado:', {
      maxMemoryMB: this.config.maxMemoryMB,
      cleanupIntervalMin: this.config.cleanupIntervalMs / 60000,
      archiveIntervalMin: this.config.archiveIntervalMs / 60000,
      compressionEnabled: this.config.compressionEnabled
    });
  }

  private initializeCleanupSystems(): void {
    this.cleanupInterval = window.setInterval(() => {
      this.performAutomaticCleanup();
    }, this.config.cleanupIntervalMs);

    this.archiveInterval = window.setInterval(() => {
      this.performAutomaticArchiving();
    }, this.config.archiveIntervalMs);

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.performFinalCleanup();
      });
    }
  }

  private performAutomaticCleanup(): void {
    const startTime = performance.now();
    const beforeStats = this.getMemoryUsageStats();

    this.cleanupOldLogs();

    this.cleanupOldSnapshots();

    this.cleanupArchivedSessions();

    this.cleanupThrottlingCache();

    const afterStats = this.getMemoryUsageStats();
    const cleanupTime = performance.now() - startTime;

    console.log('🧹 Cleanup automático completado:', {
      duration: `${cleanupTime.toFixed(2)}ms`,
      memoryBefore: `${beforeStats.totalMemoryMB.toFixed(2)}MB`,
      memoryAfter: `${afterStats.totalMemoryMB.toFixed(2)}MB`,
      memorySaved: `${(beforeStats.totalMemoryMB - afterStats.totalMemoryMB).toFixed(2)}MB`,
      logsRemaining: this.logs.length,
      snapshotsRemaining: this.entitySnapshots.length + this.systemSnapshots.length,
      archivedSessions: this.archivedSessions.length
    });

    this.lastCleanup = Date.now();
  }

  private cleanupOldLogs(): void {
    const cutoffTime = Date.now() - this.config.maxLogAge;
    const initialCount = this.logs.length;

    this.logs = this.logs.filter(log => log.timestamp > cutoffTime);

    if (this.logs.length > this.config.maxSessionLogs) {
      this.logs = this.logs.slice(-this.config.maxSessionLogs);
    }

    const removed = initialCount - this.logs.length;
    if (removed > 0) {
      console.log(`📝 Logs cleanup: eliminados ${removed} logs antiguos`);
    }
  }

  private cleanupOldSnapshots(): void {
    const cutoffTime = Date.now() - this.config.snapshotRetentionMs;

    const initialEntitySnapshots = this.entitySnapshots.length;
    const initialSystemSnapshots = this.systemSnapshots.length;

    this.entitySnapshots = this.entitySnapshots.filter(s => s.timestamp > cutoffTime);
    this.systemSnapshots = this.systemSnapshots.filter(s => s.timestamp > cutoffTime);

    const entityRemoved = initialEntitySnapshots - this.entitySnapshots.length;
    const systemRemoved = initialSystemSnapshots - this.systemSnapshots.length;

    if (entityRemoved > 0 || systemRemoved > 0) {
      console.log(
        `📸 Snapshots cleanup: eliminados ${entityRemoved} entity + ${systemRemoved} system snapshots`
      );
    }
  }

  private cleanupArchivedSessions(): void {
    if (this.archivedSessions.length > this.config.maxArchivedSessions) {
      const toRemove = this.archivedSessions.length - this.config.maxArchivedSessions;

      this.archivedSessions = this.archivedSessions
        .sort((a, b) => b.endTime - a.endTime)
        .slice(0, this.config.maxArchivedSessions);

      console.log(`🗄️ Archive cleanup: eliminadas ${toRemove} sessions archivadas antiguas`);
    }
  }

  private cleanupThrottlingCache(): void {
    const cutoffTime = Date.now() - this.config.throttleMs * 2;

    for (const [key, timestamp] of this.lastLogTimes.entries()) {
      if (timestamp < cutoffTime) {
        this.lastLogTimes.delete(key);
      }
    }
  }

  private performAutomaticArchiving(): void {
    if (!this.config.compressionEnabled) return;

    const startTime = performance.now();

    if (this.shouldArchiveCurrentSession()) {
      this.archiveCurrentSession();
    }

    const archiveTime = performance.now() - startTime;
    console.log(`🗄️ Archive check completado en ${archiveTime.toFixed(2)}ms`);

    this.lastArchive = Date.now();
  }

  private shouldArchiveCurrentSession(): boolean {
    const sessionAge = Date.now() - this.sessionStartTime;
    const timeSinceLastArchive = Date.now() - this.lastArchive;
    const hasSignificantData = this.logs.length >= 50 || this.entitySnapshots.length >= 20;
    const isOldEnough = sessionAge > this.config.maxLogAge / 2;
    const archiveIntervalReached = timeSinceLastArchive > 30000;

    return hasSignificantData && isOldEnough && archiveIntervalReached;
  }

  private archiveCurrentSession(): void {
    const sessionData = {
      id: this.currentSessionId,
      logs: [...this.logs],
      entitySnapshots: [...this.entitySnapshots],
      systemSnapshots: [...this.systemSnapshots],
      startTime: this.sessionStartTime,
      endTime: Date.now()
    };

    const compressedData = this.compressSessionData(sessionData);
    const metadata = this.calculateSessionMetadata(sessionData);

    const archive: SessionArchive = {
      id: this.currentSessionId,
      startTime: this.sessionStartTime,
      endTime: Date.now(),
      compressedData,
      metadata
    };

    this.archivedSessions.push(archive);

    this.startNewSession();

    console.log('📦 Sesión archivada:', {
      sessionId: archive.id,
      duration: `${(archive.metadata.sessionDuration / 60000).toFixed(1)}min`,
      totalLogs: archive.metadata.totalLogs,
      avgResonance: archive.metadata.avgResonance.toFixed(1),
      compressionRatio: `${((compressedData.length / JSON.stringify(sessionData).length) * 100).toFixed(1)}%`
    });
  }

  private compressSessionData(sessionData: SessionData): string {
    const jsonString = JSON.stringify(sessionData);

    if (!this.config.compressionEnabled) {
      return jsonString;
    }

    const optimized = {
      i: sessionData.id,
      l: sessionData.logs.map((log: LogEntry) => [
        log.timestamp,
        log.system[0],
        log.category[0],
        log.level[0],
        log.entityId || '',
        log.message.substring(0, 100),
        log.data ? JSON.stringify(log.data).substring(0, 200) : null
      ]),
      e: sessionData.entitySnapshots.map((snap: EntitySnapshot) => [
        snap.timestamp,
        snap.entityId,
        Object.values(snap.stats),
        snap.activity,
        snap.mood,
        [snap.position.x, snap.position.y],
        snap.isDead
      ]),
      s: sessionData.systemSnapshots.map((snap: SystemSnapshot) => [
        snap.timestamp,
        snap.resonance,
        snap.togetherTime,
        snap.cycles,
        snap.entitiesAlive
      ]),
      st: sessionData.startTime,
      et: sessionData.endTime
    };

    return JSON.stringify(optimized);
  }

  private calculateSessionMetadata(sessionData: SessionData): SessionArchive['metadata'] {
    const logs = sessionData.logs as LogEntry[];
    const systemSnapshots = sessionData.systemSnapshots as SystemSnapshot[];

    return {
      totalLogs: logs.length,
      totalSnapshots: sessionData.entitySnapshots.length + systemSnapshots.length,
      avgResonance:
        systemSnapshots.length > 0
          ? systemSnapshots.reduce((sum, s) => sum + s.resonance, 0) / systemSnapshots.length
          : 0,
      sessionDuration: sessionData.endTime - sessionData.startTime,
      deaths: logs.filter(log => log.message.includes('murió') || log.message.includes('muerte'))
        .length,
      criticalEvents: logs.filter(
        log => log.level === 'ERROR' || log.level === 'WARNING' || log.message.includes('críticas')
      ).length
    };
  }

  private startNewSession(): void {
    this.logs = [];
    this.entitySnapshots = [];
    this.systemSnapshots = [];

    this.currentSessionId = `session_${Date.now()}`;
    this.sessionStartTime = Date.now();

    console.log(`🔄 Nueva sesión iniciada: ${this.currentSessionId}`);
  }

  getMemoryUsageStats(): MemoryUsageStats {
    const logsSize = this.estimateObjectSize(this.logs);
    const snapshotsSize =
      this.estimateObjectSize(this.entitySnapshots) + this.estimateObjectSize(this.systemSnapshots);
    const archivesSize = this.estimateObjectSize(this.archivedSessions);

    return {
      logsMemoryMB: logsSize / (1024 * 1024),
      snapshotsMemoryMB: snapshotsSize / (1024 * 1024),
      archivedSessionsMB: archivesSize / (1024 * 1024),
      totalMemoryMB: (logsSize + snapshotsSize + archivesSize) / (1024 * 1024),
      lastCleanup: this.lastCleanup
    };
  }

  private estimateObjectSize(obj: unknown): number {
    return JSON.stringify(obj).length * 2;
  }

  private shouldThrottleLog(system: string, category: string, message: string): boolean {
    const key = `${system}:${category}:${message.substring(0, 50)}`;
    const now = Date.now();
    const lastTime = this.lastLogTimes.get(key);

    if (!lastTime || now - lastTime > this.config.throttleMs) {
      this.lastLogTimes.set(key, now);
      return false;
    }

    return true;
  }

  private log(entry: Omit<LogEntry, 'timestamp'>): void {
    if (!this.isEnabled) return;

    if (this.shouldThrottleLog(entry.system, entry.category, entry.message)) {
      return;
    }

    const logEntry: LogEntry = {
      ...entry,
      timestamp: Date.now()
    };

    this.logs.push(logEntry);

    const memoryStats = this.getMemoryUsageStats();
    if (memoryStats.totalMemoryMB > this.config.maxMemoryMB) {
      console.warn(
        `⚠️ Memory limit exceeded: ${memoryStats.totalMemoryMB.toFixed(2)}MB > ${this.config.maxMemoryMB}MB`
      );
      this.performEmergencyCleanup();
    }
  }

  private performEmergencyCleanup(): void {
    console.log('🚨 Realizando cleanup de emergencia...');

    this.logs = this.logs.slice(-Math.floor(this.config.maxSessionLogs * 0.5));
    this.entitySnapshots = this.entitySnapshots.slice(-50);
    this.systemSnapshots = this.systemSnapshots.slice(-50);

    if (this.config.compressionEnabled && this.logs.length > 0) {
      this.archiveCurrentSession();
    }

    console.log('✅ Emergency cleanup completado');
  }

  logActivityChange(
    entityId: string,
    oldActivity: EntityActivity,
    newActivity: EntityActivity,
    reason: string
  ): void {
    this.log({
      system: 'activity',
      category: 'AUTONOMY',
      level: 'INFO',
      entityId,
      message: `${entityId} cambió actividad: ${oldActivity} → ${newActivity}`,
      data: { reason, oldActivity, newActivity, type: 'CHANGE' }
    });
  }

  logMoodChange(
    entityId: string,
    oldMood: EntityMood,
    newMood: EntityMood,
    stats: Entity['stats']
  ): void {
    this.log({
      system: 'activity',
      category: 'AUTONOMY',
      level: 'INFO',
      entityId,
      message: `${entityId} cambió estado emocional: ${oldMood} → ${newMood}`,
      data: { oldMood, newMood, stats }
    });
  }

  logResonanceChange(
    oldResonance: number,
    newResonance: number,
    reason: string,
    entities: Entity[]
  ): void {
    const change = newResonance - oldResonance;
    const level = Math.abs(change) > 5 ? 'INFO' : 'DEBUG';

    this.log({
      system: 'love',
      category: 'LOVE',
      level,
      message: `Resonancia ${change > 0 ? 'aumentó' : 'disminuyó'}: ${oldResonance.toFixed(1)} → ${newResonance.toFixed(1)}`,
      data: {
        reason,
        change: change.toFixed(2),
        distance: this.calculateDistance(entities),
        bothAlive: entities.filter(e => !e.isDead).length === 2,
        subtype: 'RESONANCE'
      }
    });
  }

  logProximityEffect(
    entities: Entity[],
    distance: number,
    effect: 'BONDING' | 'SEPARATION' | 'NEUTRAL'
  ): void {
    if (effect === 'NEUTRAL') return;

    this.log({
      system: 'love',
      category: 'LOVE',
      level: 'INFO',
      message: `Efecto de proximidad: ${effect} (distancia: ${distance.toFixed(1)})`,
      data: {
        distance,
        effect,
        entity1: entities[0]?.id,
        entity2: entities[1]?.id,
        moods: entities.map(e => e.mood)
      }
    });
  }

  logStatsCritical(entityId: string, criticalStats: string[], stats: Entity['stats']): void {
    this.log({
      system: 'survival',
      category: 'SURVIVAL',
      level: 'WARNING',
      entityId,
      message: `${entityId} tiene estadísticas críticas: ${criticalStats.join(', ')}`,
      data: { criticalStats, stats }
    });
  }

  logEntityDeath(entityId: string, cause: string, finalStats: Entity['stats']): void {
    this.log({
      system: 'survival',
      category: 'SURVIVAL',
      level: 'ERROR',
      entityId,
      message: `💀 ${entityId} ha muerto por ${cause}`,
      data: { cause, finalStats }
    });
  }

  logHealthChange(entityId: string, oldHealth: number, newHealth: number, factors: string[]): void {
    const change = newHealth - oldHealth;
    const level = Math.abs(change) > 5 ? 'INFO' : 'DEBUG';

    this.log({
      system: 'survival',
      category: 'SURVIVAL',
      level,
      entityId,
      message: `${entityId} salud ${change > 0 ? 'mejora' : 'empeora'}: ${oldHealth.toFixed(1)} → ${newHealth.toFixed(1)}`,
      data: { change: change.toFixed(2), factors }
    });
  }

  logUserInteraction(interactionType: string, entityId: string | undefined, effect: unknown): void {
    this.log({
      system: 'interaction',
      category: 'INTERACTION',
      level: 'INFO',
      entityId,
      message: `Usuario realizó interacción: ${interactionType} ${entityId ? `en ${entityId}` : 'global'}`,
      data: { interactionType, effect }
    });
  }

  takeEntitySnapshot(entity: Entity): void {
    const snapshot: EntitySnapshot = {
      timestamp: Date.now(),
      entityId: entity.id,
      stats: { ...entity.stats },
      activity: entity.activity,
      mood: entity.mood,
      position: { ...entity.position },
      isDead: entity.isDead
    };

    this.entitySnapshots.push(snapshot);
  }

  takeSystemSnapshot(
    resonance: number,
    togetherTime: number,
    cycles: number,
    entities: Entity[]
  ): void {
    const snapshot: SystemSnapshot = {
      timestamp: Date.now(),
      resonance,
      togetherTime,
      cycles,
      entitiesAlive: entities.filter(e => !e.isDead).length
    };

    this.systemSnapshots.push(snapshot);
  }

  private calculateDistance(entities: Entity[]): number {
    if (entities.length < 2) return 0;
    const [e1, e2] = entities;
    return Math.sqrt(
      Math.pow(e1.position.x - e2.position.x, 2) + Math.pow(e1.position.y - e2.position.y, 2)
    );
  }

  getRecentLogs(category?: LogEntry['category'], limit = 50): LogEntry[] {
    let filtered = this.logs;

    if (category) {
      filtered = this.logs.filter(log => log.category === category);
    }

    return filtered.slice(-limit);
  }

  getCurrentMemoryStats(): MemoryUsageStats {
    return this.getMemoryUsageStats();
  }

  forceCleanup(): void {
    this.performAutomaticCleanup();
  }

  forceArchive(): void {
    if (this.logs.length > 0) {
      this.archiveCurrentSession();
    }
  }

  getArchivedSessions(): SessionArchive[] {
    return [...this.archivedSessions];
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  private performFinalCleanup(): void {
    console.log('🏁 Realizando cleanup final...');

    if (this.logs.length > 0 && this.config.compressionEnabled) {
      this.archiveCurrentSession();
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    if (this.archiveInterval) {
      clearInterval(this.archiveInterval);
      this.archiveInterval = null;
    }

    console.log('✅ Cleanup final completado');
  }

  destroy(): void {
    this.performFinalCleanup();
  }
}

export const optimizedDynamicsLogger = new OptimizedDynamicsLogger();

if (typeof window !== 'undefined') {
  (
    window as typeof window & {
      optimizedDynamicsLogger: OptimizedDynamicsLogger;
      loggerCommands: {
        getMemoryStats: () => MemoryUsageStats;
        forceCleanup: () => void;
        forceArchive: () => void;
        getArchives: () => SessionArchive[];
        getRecentLogs: (category?: LogEntry['category'], limit?: number) => LogEntry[];
      };
    }
  ).optimizedDynamicsLogger = optimizedDynamicsLogger;

  (
    window as typeof window & {
      loggerCommands: {
        getMemoryStats: () => MemoryUsageStats;
        forceCleanup: () => void;
        forceArchive: () => void;
        getArchives: () => SessionArchive[];
        getRecentLogs: (category?: LogEntry['category'], limit?: number) => LogEntry[];
      };
    }
  ).loggerCommands = {
    getMemoryStats: () => optimizedDynamicsLogger.getCurrentMemoryStats(),
    forceCleanup: () => optimizedDynamicsLogger.forceCleanup(),
    forceArchive: () => optimizedDynamicsLogger.forceArchive(),
    getArchives: () => optimizedDynamicsLogger.getArchivedSessions(),
    getRecentLogs: (category?: LogEntry['category'], limit?: number) =>
      optimizedDynamicsLogger.getRecentLogs(category, limit)
  };
}

export const logGeneral = {
  info: (message: string, data?: unknown) => {
    console.info(`ℹ️ ${message}`, data);
    optimizedDynamicsLogger.logUserInteraction('INFO', undefined, { message, data });
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`⚠️ ${message}`, data);
    optimizedDynamicsLogger.logUserInteraction('WARNING', undefined, { message, data });
  },
  error: (message: string, data?: unknown) => {
    console.error(`❌ ${message}`, data);
    optimizedDynamicsLogger.logUserInteraction('ERROR', undefined, { message, data });
  },
  debug: (message: string, data?: unknown) => {
    console.debug(`🔧 ${message}`, data);
    optimizedDynamicsLogger.logUserInteraction('DEBUG', undefined, { message, data });
  }
};

export const logGeneralCompat = (message: string, data?: unknown) => {
  console.log(`📋 [GENERAL] ${message}`, data);
};

export const logRenderCompat = (message: string, data?: unknown) => {
  if (data !== undefined) console.log(`🎨 [RENDER] ${message}`, data);
  else console.log(`🎨 [RENDER] ${message}`);
};
