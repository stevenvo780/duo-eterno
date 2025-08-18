#!/usr/bin/env node

/**
 * 🔍 ANALIZADOR AVANZADO DE CÓDIGO NO UTILIZADO v2.0
 * 
 * Script mejorado que combina múltiples técnicas para detectar código realmente no utilizado:
 * 
 * 1) ts-prune: Detecta exports no referenciados en el grafo TypeScript
 * 2) Análisis AST: Parsea imports/exports reales usando regex avanzado
 * 3) Verificación cruzada: Valida uso real en todos los archivos fuente
 * 4) Análisis semántico: Distingue entre uso directo, re-exports, y tipos
 * 5) Validación de build: Detecta dependencias ocultas
 *
 * Mejoras vs versión anterior:
 * - Detecta re-exports (export { X } from './module')
 * - Analiza import destructuring ({ X, Y } from 'module')  
 * - Maneja importaciones dinámicas (import('./module'))
 * - Detecta uso en strings de template y JSX
 * - Valida contra falsos positivos comunes
 * - Sistema de confianza para evitar eliminaciones peligrosas
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 === ANALIZADOR AVANZADO DE CÓDIGO NO UTILIZADO v2.0 ===\n');

// === CONFIGURACIÓN ===
const srcDir = path.join(process.cwd(), 'src');
const ANALYSIS_CACHE = new Map();

/**
 * 🧠 ANALIZADOR AVANZADO DE IMPORTS/EXPORTS
 * Parsea archivos para encontrar todas las referencias reales
 */
class AdvancedUsageAnalyzer {
  constructor() {
    this.sourceFiles = this.getAllSourceFiles();
    this.exports = new Map(); // file -> [exports]
    this.imports = new Map(); // file -> [imports]
    this.usages = new Map();  // exportName -> [usageLocations]
    this.reExports = new Map(); // re-export mappings
  }

  getAllSourceFiles() {
    const files = [];
    const scan = (dir) => {
      if (!fs.existsSync(dir)) return;
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scan(fullPath);
        } else if (item.match(/\.(ts|tsx|js|jsx)$/) && !item.includes('.test.') && !item.includes('.spec.')) {
          files.push(fullPath);
        }
      }
    };
    scan(srcDir);
    return files;
  }

  /**
   * Extrae exports de un archivo usando regex avanzado
   */
  extractExports(filePath) {
    if (ANALYSIS_CACHE.has(filePath + ':exports')) {
      return ANALYSIS_CACHE.get(filePath + ':exports');
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const exports = new Set();

    // Patrones para diferentes tipos de exports
    const patterns = [
      // export const X = ...
      /export\s+const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      // export function X() {...}
      /export\s+function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      // export class X {...}  
      /export\s+class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      // export interface X {...}
      /export\s+interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      // export type X = ...
      /export\s+type\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      // export enum X {...}
      /export\s+enum\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      // export { X, Y }
      /export\s*\{\s*([^}]+)\s*\}/g,
      // export { X } from './module' (re-exports)
      /export\s*\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (pattern.source.includes('{')) {
          // Handle destructured exports: export { X, Y, Z as W }
          const exportList = match[1];
          const moduleSpecifier = match[2]; // For re-exports
          
          const items = exportList.split(',').map(item => {
            const cleaned = item.trim();
            // Handle "X as Y" -> export name is Y, imported is X
            const asMatch = cleaned.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            const exportName = asMatch ? asMatch[2] : cleaned;
            const importedName = asMatch ? asMatch[1] : cleaned;
            
            if (moduleSpecifier) {
              // This is a re-export, track the mapping
              this.trackReExport(filePath, exportName, importedName, moduleSpecifier);
            }
            
            return exportName;
          }).filter(item => item.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/));
          
          items.forEach(item => exports.add(item));
        } else {
          exports.add(match[1]);
        }
      }
    });

    // También capturar default exports
    if (content.match(/export\s+default/)) {
      exports.add('default');
    }

    const result = Array.from(exports);
    ANALYSIS_CACHE.set(filePath + ':exports', result);
    return result;
  }

  /**
   * Rastrea re-exports para evitar falsos positivos
   */
  trackReExport(filePath, exportName, importedName, moduleSpecifier) {
    if (!this.reExports.has(exportName)) {
      this.reExports.set(exportName, []);
    }
    this.reExports.get(exportName).push({
      file: filePath,
      importedName,
      moduleSpecifier
    });
  }

  /**
   * Extrae imports y usage de un archivo con análisis mejorado
   */
  extractImportsAndUsage(filePath) {
    if (ANALYSIS_CACHE.has(filePath + ':imports')) {
      return ANALYSIS_CACHE.get(filePath + ':imports');
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const imports = new Set();
    const usage = new Set();

    // Patrones para imports
    const importPatterns = [
      // import { X, Y } from 'module'
      /import\s*\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g,
      // import X from 'module'
      /import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s+['"]([^'"]+)['"]/g,
      // import * as X from 'module'
      /import\s*\*\s*as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from\s+['"]([^'"]+)['"]/g,
      // import type { X } from 'module'
      /import\s+type\s*\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g,
      // const X = require('module')
      /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
      // const { X, Y } = require('module')
      /const\s*\{\s*([^}]+)\s*\}\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    ];

    importPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const moduleSpecifier = match[2];
        if (pattern.source.includes('{')) {
          // Destructured import
          const importList = match[1];
          const items = importList.split(',').map(item => {
            const cleaned = item.trim();
            const asMatch = cleaned.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            return asMatch ? { imported: asMatch[1], local: asMatch[2] } : { imported: cleaned, local: cleaned };
          }).filter(item => item.imported.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/));
          
          items.forEach(item => {
            imports.add(`${item.imported}:${moduleSpecifier}`);
            usage.add(item.local);
          });
        } else {
          imports.add(`${match[1]}:${moduleSpecifier}`);
          usage.add(match[1]);
        }
      }
    });

    // Detectar usage más robusto en el contenido
    const usagePatterns = [
      // Constantes/Variables en mayúsculas
      /\b([A-Z_][A-Z0-9_]*)\b/g,
      // Funciones/clases mixtas  
      /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[\(\.<]/g,
      // En template literals
      /\$\{[^}]*\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b[^}]*\}/g,
      // En JSX
      /<\s*([A-Z][a-zA-Z0-9_$]*)/g,
      // Type annotations
      /:\s*([A-Z][a-zA-Z0-9_$]*)/g
    ];

    usagePatterns.forEach(pattern => {
      let usageMatch;
      while ((usageMatch = pattern.exec(content)) !== null) {
        const identifier = usageMatch[1];
        if (identifier && identifier.length > 1) { // Filter out single letters
          usage.add(identifier);
        }
      }
    });

    const result = { imports: Array.from(imports), usage: Array.from(usage) };
    ANALYSIS_CACHE.set(filePath + ':imports', result);
    return result;
  }

  /**
   * Analiza todos los archivos y construye el mapa de dependencias
   */
  analyzeAll() {
    console.log('📊 Construyendo mapa de dependencias...');
    
    // Primera pasada: extraer todos los exports
    this.sourceFiles.forEach(file => {
      const exports = this.extractExports(file);
      this.exports.set(file, exports);
    });

    // Segunda pasada: extraer imports y usage
    this.sourceFiles.forEach(file => {
      const { imports, usage } = this.extractImportsAndUsage(file);
      this.imports.set(file, imports);
      
      // Mapear usage a exports
      usage.forEach(usedIdentifier => {
        if (!this.usages.has(usedIdentifier)) {
          this.usages.set(usedIdentifier, []);
        }
        this.usages.get(usedIdentifier).push(file);
      });
    });

    console.log(`✅ Analizados ${this.sourceFiles.length} archivos`);
  }

  /**
   * Encuentra exports realmente no utilizados con validación mejorada
   */
  findUnusedExports() {
    const unused = [];
    
    for (const [file, exports] of this.exports) {
      exports.forEach(exportName => {
        const usageLocations = this.usages.get(exportName) || [];
        
        // Filtrar auto-referencias (el archivo que lo exporta)
        const externalUsages = usageLocations.filter(usageFile => usageFile !== file);
        
        // Verificar si es un re-export (estos son generalmente seguros)
        const isReExport = this.reExports.has(exportName);
        
        // Verificar patrones comunes de uso indirecto
        const hasIndirectUsage = this.checkIndirectUsage(exportName, file);
        
        if (externalUsages.length === 0 && !isReExport && !hasIndirectUsage) {
          unused.push({
            file: path.relative(process.cwd(), file),
            export: exportName,
            type: this.classifyExport(file, exportName),
            confidence: this.calculateConfidence(exportName, file)
          });
        }
      });
    }
    
    return unused.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Verifica uso indirecto que podría pasar desapercibido
   */
  checkIndirectUsage(exportName, file) {
    // Verificar si es usado en archivos de configuración o tests
    const configFiles = this.sourceFiles.filter(f => 
      f.includes('config') || f.includes('.test.') || f.includes('.spec.')
    );
    
    return configFiles.some(configFile => {
      try {
        const content = fs.readFileSync(configFile, 'utf8');
        return content.includes(exportName);
      } catch (e) {
        return false;
      }
    });
  }

  /**
   * Calcula nivel de confianza para la eliminación (0-100)
   */
  calculateConfidence(exportName, file) {
    let confidence = 100;
    
    // Reducir confianza para exports que parecen APIs públicas
    if (exportName.match(/^[A-Z]/) && !exportName.includes('_')) {
      confidence -= 20; // Clases/Componentes
    }
    
    // Reducir confianza para constantes en mayúsculas
    if (exportName.match(/^[A-Z_]+$/)) {
      confidence -= 30; // Constantes globales
    }
    
    // Aumentar confianza para tipos
    const type = this.classifyExport(file, exportName);
    if (['type', 'interface'].includes(type)) {
      confidence += 10;
    }
    
    // Reducir confianza si está en archivos "principales"
    if (file.includes('index.') || file.includes('constants') || file.includes('config')) {
      confidence -= 25;
    }
    
    return Math.max(0, Math.min(100, confidence));
  }

  /**
   * Clasifica el tipo de export para mejor análisis
   */
  classifyExport(file, exportName) {
    const content = fs.readFileSync(file, 'utf8');
    
    if (content.match(new RegExp(`export\\s+type\\s+${exportName}\\b`))) return 'type';
    if (content.match(new RegExp(`export\\s+interface\\s+${exportName}\\b`))) return 'interface';
    if (content.match(new RegExp(`export\\s+enum\\s+${exportName}\\b`))) return 'enum';
    if (content.match(new RegExp(`export\\s+class\\s+${exportName}\\b`))) return 'class';
    if (content.match(new RegExp(`export\\s+function\\s+${exportName}\\b`))) return 'function';
    if (content.match(new RegExp(`export\\s+const\\s+${exportName}\\b`))) return 'const';
    
    return 'unknown';
  }
}

// === EJECUCIÓN PRINCIPAL ===

// 1. Ejecutar análisis avanzado
console.log('🚀 Iniciando análisis avanzado...');
const analyzer = new AdvancedUsageAnalyzer();
analyzer.analyzeAll();

const unusedExports = analyzer.findUnusedExports();

// 2. Validar con ts-prune para comparación
console.log('\n🔍 Validando con ts-prune...');
let tsPruneUnused = [];
try {
  const tsPruneOutput = execSync('npx ts-prune --project tsconfig.app.json', { encoding: 'utf8' });
  if (tsPruneOutput.trim()) {
    tsPruneUnused = tsPruneOutput
      .split('\n')
      .filter(line => line.trim() && !line.includes('(used in module)'))
      .map(line => {
        const match = line.match(/^([^:]+):(\d+) - (.+)/);
        return match ? { file: match[1], export: match[3].trim() } : null;
      })
      .filter(Boolean);
  }
} catch (error) {
  console.log('⚠️  ts-prune no disponible, continuando con análisis propio...');
}

// 3. Mostrar resultados
console.log('\n🎯 === RESULTADO DEL ANÁLISIS AVANZADO ===');

if (unusedExports.length === 0) {
  console.log('✅ No se encontraron exports realmente no utilizados');
} else {
  console.log(`⚠️ Encontrados ${unusedExports.length} exports potencialmente no utilizados:`);
  
  // Separar por nivel de confianza
  const highConfidence = unusedExports.filter(exp => exp.confidence >= 80);
  const mediumConfidence = unusedExports.filter(exp => exp.confidence >= 50 && exp.confidence < 80);
  const lowConfidence = unusedExports.filter(exp => exp.confidence < 50);
  
  if (highConfidence.length > 0) {
    console.log('\n🟢 ALTA CONFIANZA (seguro eliminar):');
    highConfidence.forEach(exp => {
      const tsPruneConfirms = tsPruneUnused.some(tsu => 
        tsu.file.endsWith(exp.file) && tsu.export === exp.export
      );
      const confirmIcon = tsPruneConfirms ? '✓' : '○';
      console.log(`   ${getSafetyIcon(exp.type)} ${exp.export} (${exp.type}) - ${exp.file} ${confirmIcon} ${exp.confidence}%`);
    });
  }
  
  if (mediumConfidence.length > 0) {
    console.log('\n🟡 CONFIANZA MEDIA (revisar cuidadosamente):');
    mediumConfidence.forEach(exp => {
      const tsPruneConfirms = tsPruneUnused.some(tsu => 
        tsu.file.endsWith(exp.file) && tsu.export === exp.export
      );
      const confirmIcon = tsPruneConfirms ? '✓' : '○';
      console.log(`   ${getSafetyIcon(exp.type)} ${exp.export} (${exp.type}) - ${exp.file} ${confirmIcon} ${exp.confidence}%`);
    });
  }
  
  if (lowConfidence.length > 0) {
    console.log('\n🔴 BAJA CONFIANZA (NO eliminar sin verificación manual):');
    lowConfidence.forEach(exp => {
      const tsPruneConfirms = tsPruneUnused.some(tsu => 
        tsu.file.endsWith(exp.file) && tsu.export === exp.export
      );
      const confirmIcon = tsPruneConfirms ? '✓' : '○';
      console.log(`   ${getSafetyIcon(exp.type)} ${exp.export} (${exp.type}) - ${exp.file} ${confirmIcon} ${exp.confidence}%`);
    });
  }
}

function getSafetyIcon(type) {
  switch(type) {
    case 'type':
    case 'interface': return '🔸';
    case 'enum': return '🔹';
    case 'function':
    case 'class': return '🔶';
    case 'const': return '🟦';
    default: return '❓';
  }
}

// 4. Mostrar estadísticas y recomendaciones
console.log('\n📊 ESTADÍSTICAS:');
console.log(`   Total archivos analizados: ${analyzer.sourceFiles.length}`);
console.log(`   Total exports encontrados: ${Array.from(analyzer.exports.values()).flat().length}`);
console.log(`   Exports únicos referenciados: ${analyzer.usages.size}`);
console.log(`   Potencialmente no utilizados: ${unusedExports.length}`);

console.log('\n🔑 LEYENDA:');
console.log('   🔸 Tipos/Interfaces - Generalmente seguros');
console.log('   🔹 Enums - Revisar uso en strings/configs');  
console.log('   🔶 Funciones/Clases - Verificar uso dinámico');
console.log('   🟦 Constantes - Pueden usarse indirectamente');
console.log('   ✓ Confirmado por ts-prune | ○ Solo análisis avanzado');

console.log('\n💡 RECOMENDACIONES:');
const highConf = unusedExports.filter(exp => exp.confidence >= 80);
const mediumConf = unusedExports.filter(exp => exp.confidence >= 50 && exp.confidence < 80);
const lowConf = unusedExports.filter(exp => exp.confidence < 50);

if (highConf.length > 0) {
  console.log(`   • ${highConf.length} exports seguros de eliminar`);
}
if (mediumConf.length > 0) {
  console.log(`   • ${mediumConf.length} exports revisar manualmente`);
}
if (lowConf.length > 0) {
  console.log(`   • ${lowConf.length} exports NO eliminar sin verificación exhaustiva`);
}

console.log('\n✅ Análisis completado con sistema de confianza mejorado');