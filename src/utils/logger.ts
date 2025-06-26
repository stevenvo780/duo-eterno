/**
 * Sistema de logging centralizado para Dúo Eterno
 * Permite activar/desactivar logs según configuración y agrupa logs por sistema
 */

import { gameConfig } from '../config/gameConfig';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogSystem = 'autopoiesis' | 'movement' | 'zones' | 'ai' | 'upgrades' | 'render' | 'storage' | 'general';

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  system: LogSystem;
  message: string;
  data?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private groupedSystems = new Set<LogSystem>();

  private shouldLog(level: LogLevel): boolean {
    if (!gameConfig.debugMode) return level === 'error' || level === 'warn';
    return true;
  }

  private formatMessage(system: LogSystem, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString().split('T')[1].substring(0, 8);
    const systemEmoji = this.getSystemEmoji(system);
    return `[${timestamp}] ${systemEmoji} ${system.toUpperCase()}: ${message}${data ? ` | ${JSON.stringify(data)}` : ''}`;
  }

  private getSystemEmoji(system: LogSystem): string {
    switch (system) {
      case 'autopoiesis': return '🔄';
      case 'movement': return '🏃';
      case 'zones': return '🎯';
      case 'ai': return '🧠';
      case 'upgrades': return '⬆️';
      case 'render': return '🎨';
      case 'storage': return '💾';
      case 'general': return '📋';
      default: return '📝';
    }
  }

  private addLog(level: LogLevel, system: LogSystem, message: string, data?: unknown): void {
    if (!this.shouldLog(level)) return;

    const logEntry: LogEntry = {
      timestamp: Date.now(),
      level,
      system,
      message,
      data
    };

    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  debug(system: LogSystem, message: string, data?: unknown): void {
    this.addLog('debug', system, message, data);
    if (this.shouldLog('debug')) {
      if (!this.groupedSystems.has(system)) {
        console.groupCollapsed(`${this.getSystemEmoji(system)} ${system.toUpperCase()}`);
        this.groupedSystems.add(system);
      }
    }
  }

  info(system: LogSystem, message: string, data?: unknown): void {
    this.addLog('info', system, message, data);
    if (this.shouldLog('info')) {
      console.info(this.formatMessage(system, message, data));
    }
  }

  warn(system: LogSystem, message: string, data?: unknown): void {
    this.addLog('warn', system, message, data);
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(system, message, data));
    }
  }

  error(system: LogSystem, message: string, data?: unknown): void {
    this.addLog('error', system, message, data);
    if (this.shouldLog('error')) {
      console.error(this.formatMessage(system, message, data));
    }
  }

  group(system: LogSystem, label?: string): void {
    if (this.shouldLog('debug')) {
      const groupLabel = label || `${this.getSystemEmoji(system)} ${system.toUpperCase()}`;
      console.groupCollapsed(groupLabel);
      this.groupedSystems.add(system);
    }
  }

  groupEnd(): void {
    if (this.shouldLog('debug')) {
      console.groupEnd();
    }
  }

  getSystemLogs(system: LogSystem): LogEntry[] {
    return this.logs.filter(log => log.system === system);
  }

  getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    this.groupedSystems.clear();
  }

  getLogSummary(): Record<LogSystem, number> {
    const summary: Partial<Record<LogSystem, number>> = {};
    this.logs.forEach(log => {
      summary[log.system] = (summary[log.system] || 0) + 1;
    });
    return summary as Record<LogSystem, number>;
  }
}

// Instancia singleton del logger
export const logger = new Logger();

// Funciones de conveniencia para cada sistema
export const logAutopoiesis = {
  debug: (msg: string, data?: unknown) => logger.debug('autopoiesis', msg, data),
  info: (msg: string, data?: unknown) => logger.info('autopoiesis', msg, data),
  warn: (msg: string, data?: unknown) => logger.warn('autopoiesis', msg, data),
  error: (msg: string, data?: unknown) => logger.error('autopoiesis', msg, data),
};

export const logMovement = {
  debug: (msg: string, data?: unknown) => logger.debug('movement', msg, data),
  info: (msg: string, data?: unknown) => logger.info('movement', msg, data),
  warn: (msg: string, data?: unknown) => logger.warn('movement', msg, data),
  error: (msg: string, data?: unknown) => logger.error('movement', msg, data),
};

export const logZones = {
  debug: (msg: string, data?: unknown) => logger.debug('zones', msg, data),
  info: (msg: string, data?: unknown) => logger.info('zones', msg, data),
  warn: (msg: string, data?: unknown) => logger.warn('zones', msg, data),
  error: (msg: string, data?: unknown) => logger.error('zones', msg, data),
};

export const logAI = {
  debug: (msg: string, data?: unknown) => logger.debug('ai', msg, data),
  info: (msg: string, data?: unknown) => logger.info('ai', msg, data),
  warn: (msg: string, data?: unknown) => logger.warn('ai', msg, data),
  error: (msg: string, data?: unknown) => logger.error('ai', msg, data),
};

export const logUpgrades = {
  debug: (msg: string, data?: unknown) => logger.debug('upgrades', msg, data),
  info: (msg: string, data?: unknown) => logger.info('upgrades', msg, data),
  warn: (msg: string, data?: unknown) => logger.warn('upgrades', msg, data),
  error: (msg: string, data?: unknown) => logger.error('upgrades', msg, data),
};

export const logRender = {
  debug: (msg: string, data?: unknown) => logger.debug('render', msg, data),
  info: (msg: string, data?: unknown) => logger.info('render', msg, data),
  warn: (msg: string, data?: unknown) => logger.warn('render', msg, data),
  error: (msg: string, data?: unknown) => logger.error('render', msg, data),
};

export const logStorage = {
  debug: (msg: string, data?: unknown) => logger.debug('storage', msg, data),
  info: (msg: string, data?: unknown) => logger.info('storage', msg, data),
  warn: (msg: string, data?: unknown) => logger.warn('storage', msg, data),
  error: (msg: string, data?: unknown) => logger.error('storage', msg, data),
};

export const logGeneral = {
  debug: (msg: string, data?: unknown) => logger.debug('general', msg, data),
  info: (msg: string, data?: unknown) => logger.info('general', msg, data),
  warn: (msg: string, data?: unknown) => logger.warn('general', msg, data),
  error: (msg: string, data?: unknown) => logger.error('general', msg, data),
};
