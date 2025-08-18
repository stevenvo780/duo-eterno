#!/usr/bin/env node

/**
 * Script para arreglar automáticamente variables no utilizadas.
 *
 * Estrategia: agrega el prefijo `_` a identificadores marcados como no usados para
 * cumplir la convención de ESLint/unused-imports sin cambiar la semántica de ejecución.
 *
 * Limitaciones: esta herramienta aplica reemplazos puntuales por línea basados en
 * posiciones (números de línea) y expresiones regulares simples con límites de palabra.
 * No reimprime el AST, por lo que no reordena imports ni actualiza tipos.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Arreglando variables no utilizadas...');

/**
 * Lista de correcciones a aplicar.
 * @typedef {{ line: number, old: string, new: string }} VarRename
 * @typedef {{ file: string, vars: VarRename[] }} FileFix
 * @type {FileFix[]}
 */
const fixes = [
  {
    file: 'src/archive/utils/mathPrecision.ts',
    vars: [
      { line: 436, old: 'currentResonance', new: '_currentResonance' },
      { line: 588, old: 'currentContext', new: '_currentContext' },
      { line: 925, old: 'repulsors', new: '_repulsors' },
      { line: 962, old: 'repulsors', new: '_repulsors' },
      { line: 999, old: 'repulsors', new: '_repulsors' }
    ]
  },
  {
    file: 'src/components/DialogBubble.tsx',
    vars: [{ line: 53, old: 'emotionModifiers', new: '_emotionModifiers' }]
  }
];

/**
 * Aplica renombres en un archivo concreto.
 *
 * Algoritmo:
 * - Lee el archivo y lo particiona por líneas (O(L)).
 * - Ordena los renombres de mayor a menor línea para evitar que un cambio desplace
 *   índices subsecuentes (estrategia de edición estable).
 * - Sustituye con una RegExp de límite de palabra para minimizar colisiones parciales.
 *
 * Complejidad: O(L + R), siendo L el número de líneas y R el número de reemplazos.
 *
 * @param {string} filePath - Ruta relativa del archivo a modificar.
 * @param {VarRename[]} vars - Renombres a aplicar con números de línea 1-indexed.
 */
function fixFile(filePath, vars) {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  const sortedVars = vars.sort((a, b) => b.line - a.line);

  for (const varInfo of sortedVars) {
    const lineIndex = varInfo.line - 1;
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const oldLine = lines[lineIndex];

      const newLine = oldLine.replace(new RegExp(`\\b${varInfo.old}\\b`), varInfo.new);

      if (oldLine !== newLine) {
        lines[lineIndex] = newLine;
        console.log(`✅ ${filePath}:${varInfo.line} - ${varInfo.old} → ${varInfo.new}`);
      } else {
        console.log(`⚠️  ${filePath}:${varInfo.line} - No se pudo reemplazar: ${varInfo.old}`);
      }
    }
  }

  const newContent = lines.join('\n');
  if (content !== newContent) {
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log(`📝 Archivo actualizado: ${filePath}`);
  }
}

for (const fix of fixes) {
  fixFile(fix.file, fix.vars);
}

console.log('✅ Variables no utilizadas arregladas');
console.log('💡 Ejecuta npm run lint:unused para verificar');
