/**
 * Re-export de funciones de telemetría para compatibilidad
 * Evita duplicación y centraliza las importaciones
 */

export { 
  unifiedTelemetry, 
  getCurrentTelemetryData, 
  exportTelemetryData 
} from './telemetry';
