/**
 * UTILIDADES PARA ANÁLISIS DE ESTADÍSTICAS - Dúo Eterno
 */

import type { EntityStats } from '../types';
import { SIMPLE_CONFIG } from './simpleConfig';

/**
 * Obtiene las estadísticas más críticas de una entidad
 */
export function getCriticalStats(stats: EntityStats): (keyof EntityStats)[] {
  const critical: (keyof EntityStats)[] = [];
  
  Object.entries(stats).forEach(([key, value]) => {
    if (key === 'health' || key === 'money') return; // Skip these in critical analysis
    
    if (value < SIMPLE_CONFIG.CRITICAL_STAT) {
      critical.push(key as keyof EntityStats);
    }
  });
  
  return critical;
}

/**
 * Obtiene las estadísticas de emergencia de una entidad
 */
export function getEmergencyStats(stats: EntityStats): (keyof EntityStats)[] {
  const emergency: (keyof EntityStats)[] = [];
  
  Object.entries(stats).forEach(([key, value]) => {
    if (key === 'health' || key === 'money') return; // Skip these in emergency analysis
    
    if (value < SIMPLE_CONFIG.EMERGENCY_STAT) {
      emergency.push(key as keyof EntityStats);
    }
  });
  
  return emergency;
}

/**
 * Obtiene las estadísticas altas de una entidad
 */
export function getHighStats(stats: EntityStats): (keyof EntityStats)[] {
  const high: (keyof EntityStats)[] = [];
  
  Object.entries(stats).forEach(([key, value]) => {
    if (key === 'health' || key === 'money') return; // Skip these in high analysis
    
    if (value > SIMPLE_CONFIG.HIGH_STAT) {
      high.push(key as keyof EntityStats);
    }
  });
  
  return high;
}
