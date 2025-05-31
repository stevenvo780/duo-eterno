/**
 * SERVICIO API - Dúo Eterno
 * Centraliza toda la comunicación con el backend
 */

import type { GameState } from '../types';
import { logStorage } from '../utils/logger';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ==================== TIPOS ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TelemetrySnapshot {
  timestamp: number;
  gameTime: number;
  resonance: number;
  entities: Array<{
    id: string;
    position: { x: number; y: number };
    health: number;
    stats: Record<string, number>;
    state: string;
    activity: string;
    isDead: boolean;
    currentZone?: string;
  }>;
  systemMetrics: {
    totalEntitiesAlive: number;
    averageHealth: number;
    distanceBetweenEntities: number;
    entitiesInZones: Record<string, number>;
    activitiesCount: Record<string, number>;
  };
}

export interface AnalyticsReport {
  reportId: string;
  analysisType: string;
  generatedAt: string;
  dataPoints: number;
  analytics: Record<string, unknown>;
}

// ==================== FUNCIONES DE UTILIDAD ====================

const makeRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (response.status === 204) {
      return { success: true, data: null as T };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    logStorage.error('Error en petición API:', { endpoint, error });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error de conexión' 
    };
  }
};

// ==================== FUNCIONES DE ESTADO DEL JUEGO ====================

export const saveGameState = async (gameState: GameState): Promise<boolean> => {
  const result = await makeRequest('/saveState', {
    method: 'POST',
    body: JSON.stringify(gameState)
  });

  if (result.success) {
    logStorage.info('Estado guardado exitosamente', result.data);
    return true;
  } else {
    logStorage.error('Error guardando estado:', result.error);
    return false;
  }
};

export const loadGameState = async (): Promise<GameState | null> => {
  const result = await makeRequest<GameState>('/loadState');

  if (result.success && result.data) {
    logStorage.info('Estado cargado exitosamente');
    return result.data;
  } else if (result.success && !result.data) {
    logStorage.info('No hay estado guardado disponible');
    return null;
  } else {
    logStorage.error('Error cargando estado:', result.error);
    return null;
  }
};

export const getBackups = async () => {
  const result = await makeRequest('/backups');
  return result.success ? result.data : [];
};

export const restoreFromBackup = async (filename: string): Promise<boolean> => {
  const result = await makeRequest(`/restore/${filename}`, { method: 'POST' });
  return result.success;
};

// ==================== FUNCIONES DE TELEMETRÍA ====================

export const sendTelemetrySnapshot = async (snapshot: TelemetrySnapshot): Promise<boolean> => {
  const result = await makeRequest('/telemetry', {
    method: 'POST',
    body: JSON.stringify(snapshot)
  });

  if (result.success) {
    logStorage.debug('Snapshot de telemetría enviado');
    return true;
  } else {
    logStorage.warn('Error enviando telemetría:', result.error);
    return false;
  }
};

export const getTelemetrySessions = async () => {
  const result = await makeRequest('/telemetry/sessions');
  return result.success ? result.data : [];
};

export const getTelemetrySession = async (sessionId: string) => {
  const result = await makeRequest(`/telemetry/session/${sessionId}`);
  return result.success ? result.data : null;
};

// ==================== FUNCIONES DE ANALYTICS ====================

export const generateAnalyticsReport = async (
  sessionId?: string, 
  analysisType: 'summary' | 'detailed' = 'summary'
): Promise<AnalyticsReport | null> => {
  const result = await makeRequest<AnalyticsReport>('/analytics/generate', {
    method: 'POST',
    body: JSON.stringify({ sessionId, analysisType })
  });

  if (result.success && result.data) {
    logStorage.info('Reporte de analytics generado:', result.data.reportId);
    return result.data;
  } else {
    logStorage.error('Error generando reporte:', result.error);
    return null;
  }
};

export const getAnalyticsReports = async () => {
  const result = await makeRequest('/analytics/reports');
  return result.success ? result.data : [];
};

export const getAnalyticsReport = async (reportId: string) => {
  const result = await makeRequest(`/analytics/report/${reportId}`);
  return result.success ? result.data : null;
};

// ==================== FUNCIONES DE SALUD DEL SISTEMA ====================

export const getSystemHealth = async () => {
  const result = await makeRequest('/health');
  return result.success ? result.data : null;
};

// ==================== FUNCIONES DE CONECTIVIDAD ====================

export const checkConnection = async (): Promise<boolean> => {
  try {
    const result = await makeRequest('/health');
    return result.success;
  } catch {
    return false;
  }
};

export const waitForConnection = async (maxRetries: number = 5): Promise<boolean> => {
  for (let i = 0; i < maxRetries; i++) {
    if (await checkConnection()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Backoff exponencial
  }
  return false;
};

// ==================== MANEJO DE ERRORES OFFLINE ====================

// Queue para peticiones fallidas
const failedRequests: Array<{ 
  endpoint: string; 
  options: RequestInit; 
  timestamp: number;
  retries: number;
}> = [];

export const processFailedRequests = async (): Promise<void> => {
  if (failedRequests.length === 0) return;

  const isOnline = await checkConnection();
  if (!isOnline) return;

  const requestsToRetry = failedRequests.splice(0); // Tomar todas las peticiones fallidas

  for (const request of requestsToRetry) {
    if (request.retries < 3) { // Máximo 3 reintentos
      try {
        await makeRequest(request.endpoint, request.options);
        logStorage.info('Petición fallida procesada exitosamente:', request.endpoint);
      } catch {
        request.retries++;
        if (request.retries < 3) {
          failedRequests.push(request); // Volver a encolar si no se ha alcanzado el máximo
        }
      }
    }
  }
};

// Exportar funciones adicionales para debugging
export const getFailedRequestsCount = (): number => failedRequests.length;
export const clearFailedRequests = (): void => {
  failedRequests.splice(0);
};
