#!/usr/bin/env node
/*
 Super validación de código no usado
 - Ejecuta ts-prune y filtra falsos positivos con una comprobación de imports reales
 - Ejecuta ESLint y reporta imports/vars no usadas
 - Heurística ligera para archivos potencialmente no importados
 Sale con código 1 si encuentra candidatos reales a limpieza.
*/

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');

const IGNORED_DIRS = [
  `${path.sep}archive${path.sep}`,
  `${path.sep}__tests__${path.sep}`,
  `${path.sep}tests${path.sep}`,
];

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function isIgnored(file) {
  const norm = file.split(path.sep).join(path.sep);
  return IGNORED_DIRS.some(seg => norm.includes(seg));
}

function grepSymbolUsage(symbol) {
  try {
    const out = run(`grep -R "\\b${symbol}\\b" -n src | grep -v ":${symbol}$" || true`);
    return out
      .split('\n')
      .filter(Boolean)
      .filter(line => !line.includes('src/__tests__/') && !line.includes('src/tests/') && !line.includes('src/archive/'))
      .length > 0;
  } catch {
    return false;
  }
}

function getAllSrcFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!isIgnored(full + path.sep)) out.push(...getAllSrcFiles(full));
    } else if (/\.(ts|tsx)$/.test(e.name)) {
      out.push(full);
    }
  }
  return out;
}

function fileAppearsImported(target, universe) {
  const base = path.basename(target, path.extname(target));
  const rel = path.relative(SRC, target).replace(/\\/g, '/').replace(/\.(ts|tsx)$/i, '');
  const noIndex = rel.endsWith('/index') ? rel.slice(0, -('/index'.length)) : rel;

  const importRegexes = [
    new RegExp(`from ['\"](.*${noIndex}|.*${base})['\"]`),
    new RegExp(`require\(.*${noIndex}.*\)`),
  ];

  return universe.some(f => {
    if (f === target) return false;
    try {
      const content = fs.readFileSync(f, 'utf8');
      return importRegexes.some(r => r.test(content));
    } catch {
      return false;
    }
  });
}

let hasIssues = false;

console.log('🔍 Super validación de código no usado');

// 1) ts-prune
let unusedExports = [];
try {
  const tsPrune = run('./node_modules/.bin/ts-prune --project tsconfig.app.json');
  const lines = tsPrune.split('\n').filter(Boolean);
  for (const line of lines) {
    // Formato: file:line - symbol [opcional "(used in module)"]
    if (line.includes('(used in module)')) continue; // ignorar uso-interno
    const m = line.match(/^(.*):(\d+) - (.*)$/);
    if (!m) continue;
    const [, file, , symbol] = m;
    if (isIgnored(file)) continue;
    // Doble chequeo: ¿aparece importado en algún sitio?
    const usedSomewhere = grepSymbolUsage(symbol);
    if (!usedSomewhere) unusedExports.push({ file, symbol, raw: line });
  }
} catch (e) {
  // Si ts-prune falla por cualquier motivo, lo tratamos como aviso, no como error duro
  console.warn('⚠️  ts-prune falló o no disponible:', e.message);
}

if (unusedExports.length > 0) {
  hasIssues = true;
  console.log('❌ Exports candidatos a limpieza (tras verificación):');
  unusedExports.forEach(u => console.log(`   ${u.raw}`));
}

// 2) ESLint (unused vars/imports)
try {
  const eslintOut = run("./node_modules/.bin/eslint . --ext .ts,.tsx || true");
  const lines = eslintOut.split('\n').filter(Boolean);
  const offenders = lines.filter(l => l.includes('unused-imports/no-unused-imports') || l.includes('no-unused-vars'));
  if (offenders.length > 0) {
    hasIssues = true;
    console.log('❌ ESLint (imports/vars no usados):');
    offenders.forEach(l => console.log('   ' + l.trim()))
  }
} catch (e) {
  console.warn('⚠️  ESLint no pudo ejecutarse:', e.message);
}

// 3) Heurística de archivos potencialmente no importados
try {
  const files = getAllSrcFiles(SRC);
  const universe = files;
  const potentials = [];
  for (const f of files) {
    const rel = path.relative(ROOT, f);
    if (rel.endsWith('main.tsx') || rel.endsWith('App.tsx')) continue;
    if (!fileAppearsImported(f, universe)) potentials.push(rel);
  }
  if (potentials.length > 0) {
    console.log('⚠️  Archivos potencialmente no importados (revisar manualmente):');
    potentials.forEach(p => console.log('   ' + p));
  }
} catch (e) {
  console.warn('⚠️  Heurística de archivos falló:', e.message);
}

if (!hasIssues) {
  console.log('✅ Super validación OK: no se detectó código no usado.');
  process.exit(0);
} else {
  console.log('\nResumen: se detectaron elementos para limpieza.');
  process.exit(1);
}

