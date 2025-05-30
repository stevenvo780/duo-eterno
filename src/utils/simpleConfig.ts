/**
 * CONFIGURACIÓN DEL SISTEMA SIMPLIFICADO - Dúo Eterno
 */

import type { EntityStats } from '../types';

// ==================== CONFIGURACIÓN SIMPLE ====================

export const SIMPLE_CONFIG = {
  // Velocidades de cambio (por segundo) - DRÁSTICAMENTE REDUCIDO PARA SUPERVIVENCIA
  STAT_DECAY_RATE: 0.15,        // Stats bajan 0.15 puntos por segundo (MUY lento)
  ZONE_RECOVERY_RATE: 8,        // Stats suben 8 puntos por segundo en zona correcta (más rápido)
  BOND_RECOVERY_RATE: 4,        // Vínculo sube 4 puntos por segundo juntos
  BOND_DECAY_RATE: 0.1,         // Vínculo baja 0.1 punto por segundo separados (muy lento)
  
  // Umbrales críticos - AJUSTADOS PARA MÁS SUPERVIVENCIA
  CRITICAL_STAT: 30,            // Stat por debajo de esto es crítico
  EMERGENCY_STAT: 10,           // Stat por debajo de esto es emergencia
  HIGH_STAT: 70,                // Stat por encima de esto está bien
  
  // Distancias
  BOND_DISTANCE: 80,            // Distancia para generar vínculo
  SEEK_DISTANCE: 200,           // Distancia máxima para buscar compañero
  
  // Tiempos de actividad (en segundos) - REDUCIDOS PARA MÁS DINAMISMO
  MIN_ACTIVITY_TIME: 3,         // Mínimo tiempo en una actividad
  MAX_ACTIVITY_TIME: 12,        // Máximo tiempo en una actividad
  
  // Sistema de vida - MUCHO MÁS CONSERVADOR
  HEALTH_DECAY_RATE: 0.05,      // Vida baja 0.05 puntos por segundo (extremadamente lento)
  HEALTH_RECOVERY_RATE: 3,      // Vida sube 3 puntos por segundo (muy rápido)
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
