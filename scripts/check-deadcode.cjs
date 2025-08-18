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
  const tsPruneOutput = execSync('npx ts-prune --project tsconfig.app.json', { encoding: 'utf8' });
  
  if (tsPruneOutput.trim()) {
    console.log('❌ Exports no utilizados encontrados:');
    
    const unusedExports = tsPruneOutput
      .split('\n')
      .filter(line => line.trim() && !line.includes('(used in module)'))
      .map(line => {
        const match = line.match(/^([^:]+):(\d+) - (.+)/);
        if (match) {
          return {
            file: match[1],
            line: parseInt(match[2]),
            export: match[3].trim()
          };
        }
        return null;
      })
      .filter(Boolean);

    if (unusedExports.length > 0) {
      const fileGroups = unusedExports.reduce((acc, item) => {
        if (!acc[item.file]) acc[item.file] = [];
        acc[item.file].push(item);
        return acc;
      }, {});
      
      console.log('\n📊 Exports realmente no utilizados:');
      Object.entries(fileGroups).forEach(([file, exports]) => {
        console.log(`\n   📁 ${file}:`);
        exports.forEach(exp => {
          console.log(`      ❌ Línea ${exp.line}: ${exp.export}`);
        });
      });

      // Análisis más profundo: verificar si son tipos vs código ejecutable
      console.log('\n🔍 Análisis detallado:');
      Object.entries(fileGroups).forEach(([file, exports]) => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          const lines = content.split('\n');
          
          exports.forEach(exp => {
            if (exp.line <= lines.length) {
              const lineContent = lines[exp.line - 1].trim();
              const isType = /^(export\s+)?(type|interface|enum)\s/.test(lineContent);
              const isFunction = /^(export\s+)?(function|const\s+\w+\s*=|class)\s/.test(lineContent);
              
              if (isType) {
                console.log(`      🔸 TIPO: ${exp.export} - Seguro eliminar`);
              } else if (isFunction) {
                console.log(`      🔶 FUNCIÓN/CLASE: ${exp.export} - Revisar uso dinámico`);
              } else {
                console.log(`      🔹 OTRO: ${exp.export} - ${lineContent.substring(0, 50)}`);
              }
            }
          });
        } catch (err) {
          console.log(`      ⚠️ Error leyendo ${file}`);
        }
      });
    } else {
      console.log('✅ Todos los exports están siendo utilizados');
    }
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
  const fileName = path.basename(file, path.extname(file));
  
  // Excluir archivos esenciales y de configuración
  const isEssentialFile = relativePath.includes('main.tsx') || 
                         relativePath.includes('App.tsx') ||
                         relativePath.includes('vite-env.d.ts') ||
                         relativePath.includes('global.d.ts') ||
                         fileName.includes('.test') ||
                         fileName.includes('.config');
  
  if (isEssentialFile) continue;

  let isImported = false;
  let importedBy = [];
  
  // Buscar importaciones más precisamente
  for (const otherFile of sourceFiles) {
    if (file === otherFile) continue;
    
    try {
      const content = fs.readFileSync(otherFile, 'utf8');
      
      // Patrones más precisos para detectar importaciones
      const patterns = [
        // import ... from './path/file'
        new RegExp(`from ['\"][^'\"]*${fileName}['\"]`, 'g'),
        // import('./path/file')
        new RegExp(`import\\(['\"][^'\"]*${fileName}['\"]\\)`, 'g'),
        // require('./path/file')
        new RegExp(`require\\(['\"][^'\"]*${fileName}['\"]\\)`, 'g')
      ];
      
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          isImported = true;
          importedBy.push(path.relative(process.cwd(), otherFile));
          break;
        }
      }
      
      if (isImported) break;
    } catch (error) {
      // Continuar con el siguiente archivo
    }
  }
  
  if (!isImported) {
    // Verificar si es un archivo de entry point no detectado
    const content = fs.readFileSync(file, 'utf8');
    const hasExports = /^export\s+/.test(content, 'm');
    const isUtilityFile = relativePath.includes('utils/') || relativePath.includes('constants/');
    
    potentiallyUnused.push({
      file: relativePath,
      hasExports,
      isUtilityFile,
      size: fs.statSync(file).size
    });
  }
}

if (potentiallyUnused.length > 0) {
  console.log('⚠️  Archivos potencialmente no utilizados:');
  
  // Separar por categorías
  const categories = {
    utilities: potentiallyUnused.filter(f => f.isUtilityFile),
    withExports: potentiallyUnused.filter(f => !f.isUtilityFile && f.hasExports),
    noExports: potentiallyUnused.filter(f => !f.isUtilityFile && !f.hasExports)
  };
  
  if (categories.utilities.length > 0) {
    console.log('\n   🔧 UTILIDADES (probablemente seguro eliminar):');
    categories.utilities.forEach(f => {
      console.log(`      📁 ${f.file} (${(f.size/1024).toFixed(1)}KB)`);
    });
  }
  
  if (categories.withExports.length > 0) {
    console.log('\n   📤 CON EXPORTS (revisar cuidadosamente):');
    categories.withExports.forEach(f => {
      console.log(`      📁 ${f.file} (${(f.size/1024).toFixed(1)}KB)`);
    });
  }
  
  if (categories.noExports.length > 0) {
    console.log('\n   📄 SIN EXPORTS (posiblemente archivos huérfanos):');
    categories.noExports.forEach(f => {
      console.log(`      📁 ${f.file} (${(f.size/1024).toFixed(1)}KB)`);
    });
  }
  
  const totalSize = potentiallyUnused.reduce((sum, f) => sum + f.size, 0);
  console.log(`\n   💾 Tamaño total: ${(totalSize/1024).toFixed(1)}KB`);
  console.log('   💡 Revisar manualmente antes de eliminar');
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
