/**
 * Sistema de logs especializado para monitorear dinámicas del tamagochi
 * Permite seguir en tiempo real el comportamiento de los agentes autónomos
 * y las mecánicas de amor y supervivencia
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

export class DynamicsLogger {
  private logs: LogEntry[] = [];
  private entitySnapshots: EntitySnapshot[] = [];
  private systemSnapshots: SystemSnapshot[] = [];
  private maxLogSize = 1000;
  private isEnabled = true;
  private lastProximityLog = 0;

  private config = {
    showAutonomy: true,
    showLove: true,
    showSurvival: true,
    showInteractions: true,
    showSystem: false,
    logLevel: 'INFO' as const
  };

  constructor() {
    setInterval(() => this.cleanup(), 30000);

    console.log('🚀 DynamicsLogger iniciado en modo local');
  }

  private cleanup() {
    if (this.logs.length > this.maxLogSize) {
      this.logs = this.logs.slice(-this.maxLogSize * 0.8);
    }

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    this.entitySnapshots = this.entitySnapshots.filter(s => s.timestamp > fiveMinutesAgo);
    this.systemSnapshots = this.systemSnapshots.filter(s => s.timestamp > fiveMinutesAgo);
  }

  private shouldLog(level: LogEntry['level'], category: LogEntry['category']): boolean {
    if (!this.isEnabled) return false;

    const levelPriority = { DEBUG: 0, INFO: 1, WARNING: 2, ERROR: 3 };
    const configLevelPriority = levelPriority[this.config.logLevel];

    if (levelPriority[level] < configLevelPriority) return false;

    switch (category) {
      case 'AUTONOMY':
        return this.config.showAutonomy;
      case 'LOVE':
        return this.config.showLove;
      case 'SURVIVAL':
        return this.config.showSurvival;
      case 'INTERACTION':
        return this.config.showInteractions;
      case 'SYSTEM':
        return this.config.showSystem;
      default:
        return true;
    }
  }

  private log(entry: Omit<LogEntry, 'timestamp'>) {
    if (!this.shouldLog(entry.level, entry.category)) return;

    const logEntry: LogEntry = {
      ...entry,
      timestamp: Date.now()
    };

    this.logs.push(logEntry);
  }

  logActivityChange(
    entityId: string,
    oldActivity: EntityActivity,
    newActivity: EntityActivity,
    reason: string
  ) {
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
  ) {
    this.log({
      system: 'activity',
      category: 'AUTONOMY',
      level: 'INFO',
      entityId,
      message: `${entityId} cambió estado emocional: ${oldMood} → ${newMood}`,
      data: { oldMood, newMood, stats }
    });
  }

  logDecisionMaking(
    entityId: string,
    availableActivities: { activity: EntityActivity; score: number }[],
    chosen: EntityActivity
  ) {
    this.log({
      system: 'activity',
      category: 'AUTONOMY',
      level: 'DEBUG',
      entityId,
      message: `${entityId} tomó decisión autónoma: eligió ${chosen}`,
      data: { availableActivities, chosen }
    });
  }

  logResonanceChange(
    oldResonance: number,
    newResonance: number,
    reason: string,
    entities: Entity[]
  ) {
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
  ) {
    if (effect === 'NEUTRAL') return;

    const now = Date.now();
    if (!this.lastProximityLog || now - this.lastProximityLog > 5000) {
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
      this.lastProximityLog = now;
    }
  }

  logTogetherTimeUpdate(oldTime: number, newTime: number, isIncreasing: boolean) {
    this.log({
      system: 'love',
      category: 'LOVE',
      level: 'DEBUG',
      message: `Tiempo juntos ${isIncreasing ? 'aumenta' : 'disminuye'}: ${(newTime / 1000).toFixed(1)}s`,
      data: { oldTime, newTime, isIncreasing }
    });
  }

  logStatsCritical(entityId: string, criticalStats: string[], stats: Entity['stats']) {
    this.log({
      system: 'survival',
      category: 'SURVIVAL',
      level: 'WARNING',
      entityId,
      message: `${entityId} tiene estadísticas críticas: ${criticalStats.join(', ')}`,
      data: { criticalStats, stats }
    });
  }

  logEntityDeath(entityId: string, cause: string, finalStats: Entity['stats']) {
    this.log({
      system: 'survival',
      category: 'SURVIVAL',
      level: 'ERROR',
      entityId,
      message: `💀 ${entityId} ha muerto por ${cause}`,
      data: { cause, finalStats }
    });
  }

  logEntityRevival(entityId: string, newStats: Entity['stats']) {
    this.log({
      system: 'survival',
      category: 'SURVIVAL',
      level: 'INFO',
      entityId,
      message: `✨ ${entityId} ha sido revivido`,
      data: { newStats }
    });
  }

  logHealthChange(entityId: string, oldHealth: number, newHealth: number, factors: string[]) {
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

  logZoneEffect(entityId: string, zoneName: string, effects: Record<string, number>) {
    const significantEffects = Object.entries(effects).filter(([, value]) => Math.abs(value) > 1);
    if (significantEffects.length === 0) return;

    this.log({
      system: 'zone',
      category: 'SYSTEM',
      level: 'INFO',
      entityId,
      message: `Zone effects applied: ${zoneName}`,
      data: { zone: zoneName, effects: Object.fromEntries(significantEffects) }
    });
  }

  logUserInteraction(interactionType: string, entityId: string | undefined, effect: unknown) {
    this.log({
      system: 'interaction',
      category: 'INTERACTION',
      level: 'INFO',
      entityId,
      message: `Usuario realizó interacción: ${interactionType} ${entityId ? `en ${entityId}` : 'global'}`,
      data: { interactionType, effect }
    });
  }

  logDialogue(entityId: string | undefined, message: string, context: string) {
    this.log({
      system: 'interaction',
      category: 'INTERACTION',
      level: 'DEBUG',
      entityId,
      message: `Diálogo mostrado: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
      data: { fullMessage: message, context }
    });
  }

  takeEntitySnapshot(entity: Entity) {
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

  takeSystemSnapshot(resonance: number, togetherTime: number, cycles: number, entities: Entity[]) {
    const snapshot: SystemSnapshot = {
      timestamp: Date.now(),
      resonance,
      togetherTime,
      cycles,
      entitiesAlive: entities.filter(e => !e.isDead).length
    };

    this.systemSnapshots.push(snapshot);
  }

  getRecentLogs(category?: LogEntry['category'], limit = 50): LogEntry[] {
    let filtered = this.logs;

    if (category) {
      filtered = this.logs.filter(log => log.category === category);
    }

    return filtered.slice(-limit);
  }

  getEntityStats(entityId: string): {
    recentSnapshots: EntitySnapshot[];
    activityChanges: number;
    moodChanges: number;
    avgHealth: number;
  } {
    const snapshots = this.entitySnapshots.filter(s => s.entityId === entityId).slice(-20);

    const activityChanges = this.logs.filter(
      log => log.entityId === entityId && log.message.includes('cambió actividad')
    ).length;

    const moodChanges = this.logs.filter(
      log => log.entityId === entityId && log.message.includes('cambió estado emocional')
    ).length;

    const avgHealth =
      snapshots.length > 0
        ? snapshots.reduce((sum, s) => sum + s.stats.health, 0) / snapshots.length
        : 0;

    return {
      recentSnapshots: snapshots,
      activityChanges,
      moodChanges,
      avgHealth
    };
  }

  getLoveStats(): {
    avgResonance: number;
    resonanceChanges: number;
    proximityEvents: number;
    maxTogetherTime: number;
  } {
    const resonanceChanges = this.logs.filter(
      log => log.category === 'LOVE' && log.message.includes('Resonancia')
    ).length;

    const proximityEvents = this.logs.filter(
      log => log.category === 'LOVE' && log.message.includes('proximidad')
    ).length;

    const avgResonance =
      this.systemSnapshots.length > 0
        ? this.systemSnapshots.reduce((sum, s) => sum + s.resonance, 0) /
          this.systemSnapshots.length
        : 0;

    const maxTogetherTime =
      this.systemSnapshots.length > 0
        ? Math.max(...this.systemSnapshots.map(s => s.togetherTime))
        : 0;

    return {
      avgResonance,
      resonanceChanges,
      proximityEvents,
      maxTogetherTime
    };
  }

  private calculateDistance(entities: Entity[]): number {
    if (entities.length < 2) return 0;
    const [e1, e2] = entities;
    return Math.sqrt(
      Math.pow(e1.position.x - e2.position.x, 2) + Math.pow(e1.position.y - e2.position.y, 2)
    );
  }

  setConfig(config: Partial<typeof this.config>) {
    this.config = { ...this.config, ...config };
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  generateReport(): string {
    const loveStats = this.getLoveStats();
    const circleStats = this.getEntityStats('circle');
    const squareStats = this.getEntityStats('square');
    const recentErrors = this.getRecentLogs().filter(log => log.level === 'ERROR');

    return `
🎮 === REPORTE DE DINÁMICAS DEL TAMAGOCHI ===

💖 MECÁNICAS DE AMOR:
- Resonancia promedio: ${loveStats.avgResonance.toFixed(1)}
- Cambios de resonancia: ${loveStats.resonanceChanges}
- Eventos de proximidad: ${loveStats.proximityEvents}
- Tiempo máximo juntos: ${(loveStats.maxTogetherTime / 1000).toFixed(1)}s

🤖 AUTONOMÍA DE AGENTES:
- Círculo: ${circleStats.activityChanges} cambios de actividad, ${circleStats.moodChanges} cambios de humor
- Cuadrado: ${squareStats.activityChanges} cambios de actividad, ${squareStats.moodChanges} cambios de humor

🏠 SUPERVIVENCIA:
- Salud promedio Círculo: ${circleStats.avgHealth.toFixed(1)}
- Salud promedio Cuadrado: ${squareStats.avgHealth.toFixed(1)}

⚠️ ERRORES RECIENTES: ${recentErrors.length}
${recentErrors.map(err => `- ${err.message}`).join('\n')}

📊 Total de logs: ${this.logs.length}
    `.trim();
  }
}

export const dynamicsLogger = new DynamicsLogger();

if (typeof window !== 'undefined') {
  (window as unknown as { dynamicsLogger: DynamicsLogger }).dynamicsLogger = dynamicsLogger;
}
