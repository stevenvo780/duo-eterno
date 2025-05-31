/**
 * SISTEMA DE ALMACENAMIENTO - Dúo Eterno
 * Interfaz simplificada que delega al backend para persistencia
 */

import type { GameState } from '../types';
import { logStorage } from './logger';
import * as apiService from '../services/apiService';

// ==================== FUNCIONES PRINCIPALES ====================

export const saveGameState = async (gameState: GameState): Promise<boolean> => {
  try {
    // Intentar guardar vía API
    const success = await apiService.saveGameState(gameState);
    
    if (success) {
      logStorage.info('Estado guardado exitosamente en backend');
      return true;
    } else {
      // Fallback a localStorage en caso de fallo del backend
      logStorage.warn('Backend no disponible, guardando en localStorage como respaldo');
      const payload = { ...gameState, lastSave: Date.now(), version: '1.0.0' };
      localStorage.setItem('duo-eterno-backup', JSON.stringify(payload));
      return true;
    }
  } catch (error) {
    logStorage.error('Error en saveGameState:', error);
    return false;
  }
};

export const loadGameState = async (): Promise<GameState | null> => {
  try {
    // Intentar cargar desde API
    const apiState = await apiService.loadGameState();
    
    if (apiState) {
      logStorage.info('Estado cargado desde backend');
      return apiState;
    }
    
    // Fallback a localStorage
    logStorage.info('Intentando cargar desde localStorage como respaldo');
    const backupData = localStorage.getItem('duo-eterno-backup');
    
    if (backupData) {
      const parsed = JSON.parse(backupData);
      logStorage.info('Estado cargado desde respaldo local');
      return parsed;
    }
    
    logStorage.info('No hay estado guardado disponible');
    return null;
  } catch (error) {
    logStorage.error('Error en loadGameState:', error);
    return null;
  }
};

// ==================== FUNCIONES DE GESTIÓN DE BACKUPS ====================

export const getAvailableBackups = async () => {
  try {
    return await apiService.getBackups();
  } catch (error) {
    logStorage.error('Error obteniendo backups:', error);
    return [];
  }
};

export const restoreFromBackup = async (filename: string): Promise<boolean> => {
  try {
    const success = await apiService.restoreFromBackup(filename);
    if (success) {
      logStorage.info('Estado restaurado desde backup:', filename);
    }
    return success;
  } catch (error) {
    logStorage.error('Error restaurando backup:', error);
    return false;
  }
};

// ==================== FUNCIONES DE CONECTIVIDAD ====================

export const checkBackendConnection = async (): Promise<boolean> => {
  return await apiService.checkConnection();
};

export const getSystemHealth = async () => {
  return await apiService.getSystemHealth();
};

// ==================== LIMPIEZA Y MANTENIMIENTO ====================

export const clearLocalBackup = (): void => {
  try {
    localStorage.removeItem('duo-eterno-backup');
    logStorage.info('Respaldo local eliminado');
  } catch (error) {
    logStorage.error('Error eliminando respaldo local:', error);
  }
};

export const syncFailedRequests = async (): Promise<void> => {
  try {
    await apiService.processFailedRequests();
  } catch (error) {
    logStorage.error('Error sincronizando peticiones fallidas:', error);
  }
};
