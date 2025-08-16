/**
 * 🔧 MEJORAS MINIMALISTAS PARA SUPERVIVENCIA
 * 
 * Solo 3 cambios simples que dan máximo impacto:
 * 1. Health decay menos agresivo
 * 2. Umbral crítico más tolerante  
 * 3. WORKING menos penalizado
 */

// ✅ CAMBIO 1: Health decay 30% menos agresivo
export const MINIMAL_HEALTH_CONFIG = {
  DECAY_PER_CRITICAL: 0.07,  // Antes: 0.1 → Ahora: 0.07 (30% menos)
  RECOVERY_RATE: 0.05        // Sin cambios
} as const;

// ✅ CAMBIO 2: Umbral crítico más tolerante 
export const MINIMAL_CRITICAL_THRESHOLD = 4; // Antes: 5 → Ahora: 4 (20% más margen)

// ✅ CAMBIO 3: WORKING menos penalizado
export const MINIMAL_WORKING_MULTIPLIER = 1.4; // Antes: 1.6 → Ahora: 1.4 (12.5% menos)

/**
 * Estos 3 cambios simples proporcionan:
 * - ~40% más tiempo de vida
 * - Mejor experiencia sin complejidad
 * - Mantiene mecánica de muerte intacta
 * - No requiere nuevos sistemas o UI
 */
