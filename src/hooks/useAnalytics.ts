/**
 * HOOK DE ANALYTICS - Dúo Eterno
 * Maneja la generación y obtención de reportes de analytics
 */

import { useState, useCallback } from 'react';
import * as apiService from '../services/apiService';

export interface AnalyticsState {
  isGenerating: boolean;
  reports: unknown[];
  sessions: unknown[];
  lastReport: unknown | null;
  error: string | null;
}

export const useAnalytics = () => {
  const [state, setState] = useState<AnalyticsState>({
    isGenerating: false,
    reports: [],
    sessions: [],
    lastReport: null,
    error: null
  });

  // Generar reporte de analytics
  const generateReport = useCallback(async (
    sessionId?: string, 
    analysisType: 'summary' | 'detailed' = 'summary'
  ) => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const report = await apiService.generateAnalyticsReport(sessionId, analysisType);
      
      if (report) {
        setState(prev => ({
          ...prev,
          isGenerating: false,
          lastReport: report,
          reports: [report, ...prev.reports],
          error: null
        }));
        return report;
      } else {
        setState(prev => ({
          ...prev,
          isGenerating: false,
          error: 'No se pudo generar el reporte'
        }));
        return null;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
      return null;
    }
  }, []);

  // Obtener lista de reportes
  const loadReports = useCallback(async () => {
    try {
      const reports = await apiService.getAnalyticsReports();
      setState(prev => ({ ...prev, reports: Array.isArray(reports) ? reports : [], error: null }));
      return reports;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error cargando reportes'
      }));
      return [];
    }
  }, []);

  // Obtener sesiones de telemetría
  const loadSessions = useCallback(async () => {
    try {
      const sessions = await apiService.getTelemetrySessions();
      setState(prev => ({ ...prev, sessions: Array.isArray(sessions) ? sessions : [], error: null }));
      return sessions;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error cargando sesiones'
      }));
      return [];
    }
  }, []);

  // Obtener reporte específico
  const getReport = useCallback(async (reportId: string) => {
    try {
      const report = await apiService.getAnalyticsReport(reportId);
      if (report) {
        setState(prev => ({ ...prev, lastReport: report, error: null }));
      }
      return report;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error cargando reporte'
      }));
      return null;
    }
  }, []);

  // Obtener datos de sesión específica
  const getSessionData = useCallback(async (sessionId: string) => {
    try {
      const sessionData = await apiService.getTelemetrySession(sessionId);
      return sessionData;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error cargando datos de sesión'
      }));
      return null;
    }
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Generar reporte rápido con datos recientes
  const generateQuickReport = useCallback(async () => {
    return await generateReport(undefined, 'summary');
  }, [generateReport]);

  return {
    ...state,
    generateReport,
    generateQuickReport,
    loadReports,
    loadSessions,
    getReport,
    getSessionData,
    clearError
  };
};
