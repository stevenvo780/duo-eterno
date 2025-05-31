/**
 * HOOK DE CONECTIVIDAD - Dúo Eterno
 * Maneja la conexión con el backend y sincronización de datos
 */

import { useState, useEffect, useCallback } from 'react';
import * as apiService from '../services/apiService';
import { syncFailedRequests } from '../utils/storage';

export interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: Date | null;
  failedRequestsCount: number;
  isChecking: boolean;
}

export const useBackendConnection = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    lastChecked: null,
    failedRequestsCount: 0,
    isChecking: false
  });

  // Verificar conexión
  const checkConnection = useCallback(async () => {
    setStatus(prev => ({ ...prev, isChecking: true }));
    
    try {
      const isConnected = await apiService.checkConnection();
      const failedRequestsCount = apiService.getFailedRequestsCount();
      
      setStatus({
        isConnected,
        lastChecked: new Date(),
        failedRequestsCount,
        isChecking: false
      });

      // Si se reconectó, procesar peticiones fallidas
      if (isConnected && failedRequestsCount > 0) {
        await syncFailedRequests();
        // Actualizar el contador después de sincronizar
        setStatus(prev => ({
          ...prev,
          failedRequestsCount: apiService.getFailedRequestsCount()
        }));
      }

      return isConnected;
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        lastChecked: new Date(),
        isChecking: false
      }));
      return false;
    }
  }, []);

  // Verificación periódica
  useEffect(() => {
    // Verificación inicial
    checkConnection();

    // Verificación cada 30 segundos
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [checkConnection]);

  // Intentar reconectar manualmente
  const reconnect = useCallback(async () => {
    return await checkConnection();
  }, [checkConnection]);

  // Limpiar peticiones fallidas manualmente
  const clearFailedRequests = useCallback(() => {
    apiService.clearFailedRequests();
    setStatus(prev => ({ ...prev, failedRequestsCount: 0 }));
  }, []);

  return {
    ...status,
    checkConnection,
    reconnect,
    clearFailedRequests
  };
};
