/**
 * 🔧 MEJORAS MINIMALISTAS PARA SUPERVIVENCIA
 * 
 * Solo 3 cambios simples que dan máximo impacto:
 * 1. Health decay menos agresivo
 * 2. Umbral crítico más tolerante  
 * 3. WORKING menos penalizado
 */


export const MINIMAL_HEALTH_CONFIG = {
  DECAY_PER_CRITICAL: 0.07,
  RECOVERY_RATE: 0.05
} as const;


export const MINIMAL_CRITICAL_THRESHOLD = 4;


export const MINIMAL_WORKING_MULTIPLIER = 1.4;

/**
 * Estos 3 cambios simples proporcionan:
 * - ~40% más tiempo de vida
 * - Mejor experiencia sin complejidad
 * - Mantiene mecánica de muerte intacta
 * - No requiere nuevos sistemas o UI
 */
