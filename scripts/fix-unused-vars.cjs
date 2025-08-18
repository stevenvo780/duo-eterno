#!/usr/bin/env node

/**
 * Script para arreglar automáticamente variables no utilizadas
 * Añade el prefijo _ a variables no utilizadas para que cumplan con las reglas de ESLint
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Arreglando variables no utilizadas...');


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
    vars: [
      { line: 53, old: 'emotionModifiers', new: '_emotionModifiers' }
    ]
  }
];

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
      

      const newLine = oldLine.replace(
        new RegExp(`\\b${varInfo.old}\\b`), 
        varInfo.new
      );
      
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
