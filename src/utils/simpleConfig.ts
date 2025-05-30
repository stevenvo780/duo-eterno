/**
 * CONFIGURACIÓN DEL SISTEMA SIMPLIFICADO - Dúo Eterno
 */

import type { EntityStats } from '../types';

// ==================== CONFIGURACIÓN SIMPLE ====================

export const SIMPLE_CONFIG = {
  // Velocidades de cambio (por segundo) - REBALANCEADO PARA MÁS DINAMISMO
  STAT_DECAY_RATE: 1.5,         // Stats bajan 1.5 puntos por segundo (más dinámico)
  ZONE_RECOVERY_RATE: 4,        // Stats suben 4 puntos por segundo en zona correcta
  BOND_RECOVERY_RATE: 2.5,      // Vínculo sube 2.5 puntos por segundo juntos
  BOND_DECAY_RATE: 0.8,         // Vínculo baja 0.8 punto por segundo separados
  
  // Umbrales críticos - AJUSTADOS PARA MÁS MOVIMIENTO
  CRITICAL_STAT: 25,            // Stat por debajo de esto es crítico (subido para más actividad)
  EMERGENCY_STAT: 10,           // Stat por debajo de esto es emergencia
  HIGH_STAT: 70,                // Stat por encima de esto está bien (bajado)
  
  // Distancias
  BOND_DISTANCE: 80,            // Distancia para generar vínculo
  SEEK_DISTANCE: 200,           // Distancia máxima para buscar compañero
  
  // Tiempos de actividad (en segundos) - REDUCIDOS PARA MÁS DINAMISMO
  MIN_ACTIVITY_TIME: 2,         // Mínimo tiempo en una actividad (antes 3)
  MAX_ACTIVITY_TIME: 8,         // Máximo tiempo en una actividad (antes 15)
  
  // Sistema de vida - EQUILIBRADO PARA SUPERVIVENCIA
  HEALTH_DECAY_RATE: 1.2,       // Vida baja 1.2 puntos por segundo
  HEALTH_RECOVERY_RATE: 1.8,    // Vida sube 1.8 puntos por segundo
};

// ==================== MAPEO ZONA -> ESTADÍSTICA ====================

export const ZONE_EFFECTS: Record<string, { recovers: keyof EntityStats; cost?: Partial<EntityStats> }> = {
  food: { 
    recovers: 'hunger', 
    cost: { energy: 1 } // Comer cansa un poco
  },
  rest: { 
    recovers: 'energy',
    cost: { boredom: 2 } // Descansar aburre
  },
  play: { 
    recovers: 'boredom',
    cost: { energy: 3 } // Jugar cansa
  },
  social: { 
    recovers: 'loneliness',
    cost: { energy: 1 } // Socializar cansa un poco
  },
  comfort: { 
    recovers: 'happiness',
    cost: { energy: 1 } // Buscar comodidad cansa un poco
  },
  work: {
    recovers: 'money',
    cost: { energy: 4, happiness: 2 } // Trabajar cansa y puede reducir felicidad
  }
};

// ==================== TIPOS DE PERSONALIDAD ====================

export interface Personality {
  priority: (keyof EntityStats)[];  // Orden de prioridad de stats
  bondNeed: number;                 // Qué tanto necesita vínculo (0-100)
  restlessness: number;             // Qué tan inquieto es (0-100)
}

export const PERSONALITIES: Record<string, Personality> = {
  circle: {
    priority: ['energy', 'hunger', 'loneliness', 'happiness', 'boredom'],
    bondNeed: 80,     // Muy social
    restlessness: 40  // Moderadamente activo
  },
  square: {
    priority: ['hunger', 'energy', 'happiness', 'boredom', 'loneliness'],
    bondNeed: 60,     // Algo social
    restlessness: 70  // Más inquieto
  }
};
