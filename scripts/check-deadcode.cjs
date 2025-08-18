#!/usr/bin/env node

/**
 * Script automatizado para detectar y reportar código no utilizado.
 *
 * En tres fases:
 * 1) Ejecuta ts-prune para detectar exports no referenciados en el grafo TS.
 * 2) Ejecuta ESLint y filtra reglas de imports/vars no usadas para contexto adicional.
 * 3) Heurística simple: busca archivos .ts/.tsx que no son importados por otros.
 *
 * Nota sobre complejidad: la tercera fase NO construye un grafo de dependencias
 * real; usa una expresión regular que busca el basename del archivo en sentencias
 * `from "..."`. Esto puede producir falsos positivos/negativos cuando existen
 * alias de paths, resoluciones personalizadas o importaciones dinámicas.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analizando código no utilizado...\n');


console.log('📦 Ejecutando ts-prune...');
try {
  const tsPruneOutput = execSync('npm run find-unused', { encoding: 'utf8' });
  
  if (tsPruneOutput.trim()) {
    console.log('❌ Exports no utilizados encontrados:');
    console.log(tsPruneOutput);
    

    const unusedExports = tsPruneOutput
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const match = line.match(/^([^:]+):(\d+) - (.+)/);
        if (match) {
          return {
            file: match[1],
            line: parseInt(match[2]),
            export: match[3]
          };
        }
        return null;
      })
      .filter(Boolean);
    

    const fileGroups = unusedExports.reduce((acc, item) => {
      if (!acc[item.file]) acc[item.file] = [];
      acc[item.file].push(item);
      return acc;
    }, {});
    
    console.log('\n📊 Resumen por archivo:');
    Object.entries(fileGroups).forEach(([file, exports]) => {
      console.log(`   ${file}: ${exports.length} exports no utilizados`);
    });
    
  } else {
    console.log('✅ No se encontraron exports no utilizados');
  }
} catch (error) {
  console.log('⚠️  Error ejecutando ts-prune:', error.message);
}


console.log('\n🔧 Ejecutando ESLint para imports no utilizados...');
try {
  const eslintOutput = execSync('npm run lint 2>&1 || true', { encoding: 'utf8' });
  
  const unusedImportLines = eslintOutput
    .split('\n')
    .filter(line => 
      line.includes('unused-imports/no-unused-imports') || 
      line.includes('no-unused-vars')
    );
  
  if (unusedImportLines.length > 0) {
    console.log('❌ Imports/variables no utilizados:');
    unusedImportLines.forEach(line => console.log('   ' + line.trim()));
  } else {
    console.log('✅ No se encontraron imports no utilizados');
  }
} catch (error) {
  console.log('⚠️  Error ejecutando ESLint:', error.message);
}


console.log('\n📁 Buscando archivos potencialmente no utilizados...');

const srcDir = path.join(process.cwd(), 'src');
/**
 * Recorre recursivamente un directorio para listar archivos TS/TSX.
 *
 * Complejidad: O(N) en número de entradas del árbol, con coste de E/S
 * proporcional al número de directorios y archivos visitados.
 *
 * @param {string} dir - Ruta del directorio raíz a explorar.
 * @returns {string[]} Lista de rutas absolutas de archivos fuente.
 */
const getAllFiles = (dir) => {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
};

const sourceFiles = getAllFiles(srcDir);
const potentiallyUnused = [];

for (const file of sourceFiles) {
  const relativePath = path.relative(process.cwd(), file);
  

  let isImported = false;
  
  // Heurística: comprobar si el basename del archivo aparece en una sentencia import
  // del resto de archivos. No resuelve paths relativos/alias en tiempo real.
  for (const otherFile of sourceFiles) {
    if (file === otherFile) continue;
    
    try {
      const content = fs.readFileSync(otherFile, 'utf8');
      // Construcción de la expresión regular:
      // from '"].*<basename-sin-ext>['"]
      // Limita falsos positivos buscando sólo en cadenas de importación.
      const importPattern = new RegExp(
        `from ['\"].*${path.basename(file, path.extname(file))}['\"]`,
        'g'
      );
      
      if (importPattern.test(content)) {
        isImported = true;
        break;
      }
    } catch (error) {

    }
  }
  
  if (!isImported && !relativePath.includes('main.tsx') && !relativePath.includes('App.tsx')) {
    potentiallyUnused.push(relativePath);
  }
}

if (potentiallyUnused.length > 0) {
  console.log('⚠️  Archivos potencialmente no utilizados:');
  potentiallyUnused.forEach(file => console.log(`   ${file}`));
  console.log('\n💡 Revisar manualmente antes de eliminar');
} else {
  console.log('✅ Todos los archivos parecen estar en uso');
}


console.log('\n📋 Reporte de limpieza:');
console.log('━'.repeat(50));
console.log('🔧 Comandos útiles para limpieza:');
console.log('   npm run lint:unused     # Ver imports no utilizados');
console.log('   npm run find-unused     # Ver exports no utilizados');
console.log('   npm run check-deadcode  # Análisis completo');
console.log('\n💡 Para eliminar código no utilizado:');
console.log('   1. Revisar salida de ts-prune');
console.log('   2. Eliminar exports no utilizados manualmente');
console.log('   3. Ejecutar ESLint con --fix para imports');
console.log('   4. Verificar que no se rompa nada con npm run build');

console.log('\n✅ Análisis completado');
