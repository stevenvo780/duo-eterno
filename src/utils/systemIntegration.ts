/**
 * 🔗 INTEGRACIÓN Y VALIDACIÓN DEL SISTEMA COMPLETO
 * 
 * Módulo que:
 * - Integra todas las mejoras realizadas
 * - Valida coherencia entre subsistemas
 * - Proporciona interfaz unificada
 * - Documenta las correcciones aplicadas
 */

import { validateAllGameConstants } from "../constants";
import { getGameConfig } from '../config/gameConfig';
import { fixedMathUtils } from './fixedMathPrecision';
import { robustStateUtils } from './robustStateManagement';
import { logGeneral } from './logger';

/**
 * Valida la configuración del juego
 */
function validateGameConfiguration(): boolean {
  try {
    // Validación básica de la configuración
    const config = getGameConfig();
    return !!(config && config.entityInitialStats !== undefined);
  } catch (error) {
    logGeneral.warn('Error validating game configuration:', error);
    return false;
  }
}

// === RESUMEN DE CORRECCIONES APLICADAS ===

export const APPLIED_FIXES = {
  CRITICAL: [
    {
      issue: 'Movimiento aleatorio de emergencia',
      location: 'useEntityMovementOptimized.ts:241-247',
      solution: 'Reemplazado por navegación inteligente determinista en useIntelligentMovement.ts',
      impact: 'Comportamiento predecible y natural de agentes'
    },
    {
      issue: 'Tabla de permutación no determinista',
      location: 'mathPrecision.ts:914-917',
      solution: 'Generador de ruido con seed determinista en fixedMathPrecision.ts',
      impact: 'Reproducibilidad perfecta entre sesiones'
    },
    {
      issue: 'Validación insuficiente de stats',
      location: 'GameContext.tsx:169-173',
      solution: 'Sistema robusto de validación en robustStateManagement.ts',
      impact: 'Estados consistentes, prevención de divisiones por cero'
    }
  ],
  HIGH: [
    {
      issue: 'Delta time sin límite superior robusto',
      location: 'useBalancedGameLoop.ts:142-145',
      solution: 'Sistema de timing unificado con límites adaptativos',
      impact: 'Estabilidad tras pausas y lag'
    },
    {
      issue: 'Detección de colisión simplificada',
      location: 'mapGeneration.ts:267',
      solution: 'Sistema de pathfinding inteligente con evasión precisa',
      impact: 'Navegación natural sin atravesar obstáculos'
    }
  ],
  MEDIUM: [
    {
      issue: 'Softmax con temperatura fija',
      location: 'aiDecisionEngine.ts:182-193',
      solution: 'Configuración adaptativa en unifiedGameConfig.ts',
      impact: 'Decisiones AI más contextuales'
    },
    {
      issue: 'Carga de sprites sin error handling',
      location: 'OptimizedCanvas.tsx:314-401',
      solution: 'Sistema de fallbacks robusto documentado',
      impact: 'Renderizado estable sin sprites críticos'
    }
  ],
  LOW: [
    {
      issue: 'Sesgo epsilon en redondeo',
      location: 'mathPrecision.ts:79-82',
      solution: 'Redondeo sin sesgo en fixedMathPrecision.ts',
      impact: 'Precisión matemática mejorada'
    },
    {
      issue: 'Magic numbers sin documentación',
      location: 'gameConstants.ts:42-45',
      solution: 'Constantes justificadas matemáticamente en módulos especializados',
      impact: 'Mantenibilidad y comprensión del código'
    }
  ]
} as const;

// === MÉTRICAS DE MEJORA ===

export interface SystemMetrics {
  constantsValidation: boolean;
  configurationCoherence: boolean;
  mathematicalPrecision: boolean;
  stateManagementRobustness: boolean;
  overallSystemHealth: number; // 0-100
  recommendations: string[];
}

/**
 * Evalúa la salud general del sistema tras las mejoras
 */
export async function evaluateSystemHealth(): Promise<SystemMetrics> {
  const results: Partial<SystemMetrics> = {};
  const recommendations: string[] = [];
  
  try {
    // Validar constantes
    results.constantsValidation = await validateAllGameConstants();
    if (!results.constantsValidation) {
      recommendations.push('Revisar constantes matemáticas - algunas validaciones fallaron');
    }
    
    // Validar configuración
    results.configurationCoherence = validateGameConfiguration();
    if (!results.configurationCoherence) {
      recommendations.push('Ajustar configuración del juego - parámetros inconsistentes');
    }
    
    // Probar precisión matemática
    results.mathematicalPrecision = testMathematicalPrecision();
    if (!results.mathematicalPrecision) {
      recommendations.push('Verificar cálculos matemáticos - posibles problemas de precisión');
    }
    
    // Probar gestión de estados
    results.stateManagementRobustness = testStateManagement();
    if (!results.stateManagementRobustness) {
      recommendations.push('Revisar gestión de estados - validaciones insuficientes');
    }
    
    // Calcular salud general
    const validationResults = [
      results.constantsValidation,
      results.configurationCoherence,
      results.mathematicalPrecision,
      results.stateManagementRobustness
    ];
    
    const passedTests = validationResults.filter(r => r === true).length;
    results.overallSystemHealth = (passedTests / validationResults.length) * 100;
    
    // Recomendaciones generales
    if (results.overallSystemHealth === 100) {
      recommendations.push('Sistema en excelente estado - todas las validaciones pasaron');
    } else if (results.overallSystemHealth >= 75) {
      recommendations.push('Sistema en buen estado - problemas menores detectados');
    } else if (results.overallSystemHealth >= 50) {
      recommendations.push('Sistema funcional - requiere atención a problemas identificados');
    } else {
      recommendations.push('Sistema requiere revisión urgente - múltiples problemas críticos');
    }
    
  } catch (error) {
    console.error('Error evaluando salud del sistema:', error);
    recommendations.push('Error durante evaluación - revisar logs para detalles');
    results.overallSystemHealth = 0;
  }
  
  return {
    constantsValidation: results.constantsValidation ?? false,
    configurationCoherence: results.configurationCoherence ?? false,
    mathematicalPrecision: results.mathematicalPrecision ?? false,
    stateManagementRobustness: results.stateManagementRobustness ?? false,
    overallSystemHealth: results.overallSystemHealth ?? 0,
    recommendations
  };
}

/**
 * Prueba la precisión de las funciones matemáticas corregidas
 */
function testMathematicalPrecision(): boolean {
  const tests = [
    // Test redondeo sin sesgo
    () => {
      const result = fixedMathUtils.preciseRound(1.999999, 3);
      return result === 2.0; // Sin epsilon bias
    },
    
    // Test comparación con epsilon relativo
    () => {
      return fixedMathUtils.areEqual(1000000.1, 1000000.2, 1e-6);
    },
    
    // Test clamp seguro
    () => {
      const result = fixedMathUtils.safeClamp(NaN, 0, 10);
      return result === 5; // Valor medio para NaN
    },
    
    // Test normalización robusta
    () => {
      const result = fixedMathUtils.safeNormalize(5, 10, 10); // Rango cero
      return result === 0.5;
    },
    
    // Test ruido determinista
    () => {
      const val1 = fixedMathUtils.deterministicNoise(1.0, 1.0);
      const val2 = fixedMathUtils.deterministicNoise(1.0, 1.0);
      return val1 === val2; // Debe ser determinista
    }
  ];
  
  return tests.every(test => {
    try {
      return test();
    } catch (error) {
      console.error('Test matemático falló:', error);
      return false;
    }
  });
}

/**
 * Prueba la robustez del sistema de gestión de estados
 */
function testStateManagement(): boolean {
  const tests = [
    // Test validación de stat negativo
    () => {
      const result = robustStateUtils.validateAndFixStat('money', -50, 'test');
      return result === 0; // No debe permitir money negativo
    },
    
    // Test validación de stat infinito
    () => {
      const result = robustStateUtils.validateAndFixStat('health', Infinity, 'test');
      return result === 100; // Debe usar valor por defecto
    },
    
    // Test aplicación de cambio seguro
    () => {
      const initialStats = robustStateUtils.createInitialStats();
      const newStats = robustStateUtils.applyStatChange(initialStats, 'money', -1000, 'test');
      return newStats.money === 0; // No debe permitir negativo
    },
    
    // Test cálculo de supervivencia robusto
    () => {
      const extremeStats = robustStateUtils.createInitialStats({
        hunger: 999, // Valor extremo
        health: -50  // Valor inválido
      });
      const survival = robustStateUtils.calculateSurvivalLevel(extremeStats);
      return survival.score >= 0 && survival.score <= 100; // Debe estar en rango válido
    },
    
    // Test coherencia de stats
    () => {
      const stats = robustStateUtils.validateAndFixStats({
        hunger: 100,
        sleepiness: 100,
        energy: 100, // Incoherente - alta energía con alta necesidad de sueño
        health: 0
      }, 'test');
      return stats.energy < 100; // Debe corregir incoherencia
    }
  ];
  
  return tests.every(test => {
    try {
      return test();
    } catch (error) {
      console.error('Test de gestión de estados falló:', error);
      return false;
    }
  });
}

// === MIGRACIÓN Y COMPATIBILIDAD ===

/**
 * Guía de migración para integrar las mejoras
 */
export const MIGRATION_GUIDE = {
  steps: [
    {
      step: 1,
      title: 'Reemplazar mathPrecision.ts',
      description: 'Importar fixedMathPrecision.ts en lugar de mathPrecision.ts',
      files: ['Todos los archivos que usen mathUtils'],
      breaking: false
    },
    {
      step: 2,
      title: 'Actualizar sistema de movimiento',
      description: 'Reemplazar useEntityMovementOptimized con useIntelligentMovement',
      files: ['App.tsx', 'GameContext.tsx'],
      breaking: true
    },
    {
      step: 3,
      title: 'Integrar configuración unificada',
      description: 'Migrar de gameConfig.ts a unifiedGameConfig.ts',
      files: ['Todos los archivos que usen gameConfig'],
      breaking: true
    },
    {
      step: 4,
      title: 'Implementar validación robusta',
      description: 'Usar robustStateManagement para actualizaciones de estado',
      files: ['GameContext.tsx', 'hooks que modifiquen stats'],
      breaking: false
    },
    {
      step: 5,
      title: 'Eliminar dependencias .env',
      description: 'Remover todas las referencias a variables de entorno',
      files: ['gameConfig.ts', '.env*'],
      breaking: true
    }
  ],
  compatibility: {
    preservedAPIs: [
      'Interfaz de Entity sin cambios',
      'Tipos de actividades y zonas inalterados',
      'Estructura básica de stats mantenida'
    ],
    newAPIs: [
      'fixedMathUtils - versión mejorada de mathUtils',
      'robustStateUtils - gestión segura de estados',
      'getGameConfig() - configuración unificada',
      'useIntelligentMovement - navegación avanzada'
    ],
    deprecatedAPIs: [
      'mathUtils de mathPrecision.ts',
      'gameConfig basado en .env',
      'useEntityMovementOptimized',
      'validaciones básicas de stats'
    ]
  }
} as const;

// === DOCUMENTACIÓN DE ARQUITECTURA ===

export const ARCHITECTURE_OVERVIEW = {
  layers: {
    'Mathematical Core': {
      files: ['mathematicalCore.ts'],
      purpose: 'Constantes matemáticas universales inmutables',
      dependencies: []
    },
    'Biological Dynamics': {
      files: ['biologicalDynamics.ts'],
      purpose: 'Simulación de procesos vitales naturales',
      dependencies: ['Mathematical Core']
    },
    'Physics & Movement': {
      files: ['physicsAndMovement.ts'],
      purpose: 'Comportamiento físico y navegación',
      dependencies: ['Mathematical Core']
    },
    'System Timing': {
      files: ['systemTiming.ts'],
      purpose: 'Gestión temporal unificada',
      dependencies: ['Mathematical Core']
    },
    'Configuration': {
      files: ['unifiedGameConfig.ts'],
      purpose: 'Configuración integrada sin .env',
      dependencies: ['Todas las capas de constantes']
    },
    'Utilities': {
      files: ['fixedMathPrecision.ts', 'robustStateManagement.ts'],
      purpose: 'Herramientas robustas para cálculos y estado',
      dependencies: ['Mathematical Core', 'Biological Dynamics']
    },
    'Application': {
      files: ['useIntelligentMovement.ts', 'GameContext.tsx'],
      purpose: 'Lógica de aplicación usando capas inferiores',
      dependencies: ['Configuration', 'Utilities']
    }
  },
  principles: [
    'Separación de responsabilidades por dominio',
    'Constantes matemáticamente justificadas',
    'Validación exhaustiva en todos los niveles',
    'Determinismo y reproducibilidad',
    'Escalabilidad y mantenibilidad'
  ]
} as const;

// === FUNCIÓN DE INICIALIZACIÓN ===

/**
 * Inicializa el sistema mejorado y reporta el estado
 */
export async function initializeImprovedSystem(): Promise<SystemMetrics> {
  console.log('🚀 Inicializando sistema mejorado de Dúo Eterno...');
  
  // Validar sistema
  const metrics = await evaluateSystemHealth();
  
  // Reportar estado
  console.log('📊 Métricas del sistema:', {
    'Constantes': metrics.constantsValidation ? '✅' : '❌',
    'Configuración': metrics.configurationCoherence ? '✅' : '❌',
    'Matemáticas': metrics.mathematicalPrecision ? '✅' : '❌',
    'Estados': metrics.stateManagementRobustness ? '✅' : '❌',
    'Salud General': `${metrics.overallSystemHealth.toFixed(1)}%`
  });
  
  // Mostrar recomendaciones
  if (metrics.recommendations.length > 0) {
    console.log('📝 Recomendaciones:');
    metrics.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
  }
  
  // Mostrar correcciones aplicadas
  console.log('🔧 Correcciones aplicadas:');
  console.log(`   Críticas: ${APPLIED_FIXES.CRITICAL.length}`);
  console.log(`   Altas: ${APPLIED_FIXES.HIGH.length}`);
  console.log(`   Medias: ${APPLIED_FIXES.MEDIUM.length}`);
  console.log(`   Bajas: ${APPLIED_FIXES.LOW.length}`);
  
  return metrics;
}

// === EXPORTACIONES PRINCIPALES ===

export {
  fixedMathUtils,
  robustStateUtils,
  getGameConfig,
  validateGameConfiguration
};

// Auto-inicializar en desarrollo
if (import.meta.env.DEV) {
  initializeImprovedSystem().then(metrics => {
    if (metrics.overallSystemHealth === 100) {
      console.log('🎉 Sistema completamente optimizado y funcional!');
    }
  });
}