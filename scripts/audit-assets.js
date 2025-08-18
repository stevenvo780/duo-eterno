#!/usr/bin/env node

/**
 * 🔍 AUDITORÍA DE ASSETS - Verifica assets definidos vs disponibles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de assets desde assetManager.ts
const ASSET_CATEGORIES = {
  GROUND: {
    cesped: ['tile_0182_suelo_cesped', 'tile_0210_suelo_cesped', 'tile_0246_suelo_cesped', 'tile_0278_suelo_cesped'],
    tierra: ['tile_0144_suelo_tierra', 'tile_0184_suelo_tierra', 'tile_0216_suelo_tierra', 'tile_0256_suelo_tierra'],
    arena: ['tile_0143_suelo_arena', 'tile_0179_suelo_arena', 'tile_0219_suelo_arena', 'tile_0243_suelo_arena'],
    piedra: ['tile_0145_suelo_piedra', 'tile_0181_suelo_piedra', 'tile_0209_suelo_piedra', 'tile_0221_suelo_piedra']
  },
  BUILDINGS: {
    principal: ['tile_0000_edificio_principal'],
    comercial: ['tile_0003_edificio_comercial', 'tile_0007_edificio_comercial', 'tile_0011_edificio_comercial'],
    pequeño: ['tile_0004_edificio_pequeño', 'tile_0008_edificio_pequeño', 'tile_0012_edificio_pequeño'],
    grande: ['tile_0005_edificio_grande', 'tile_0009_edificio_grande', 'tile_0013_edificio_grande'],
    alto: ['tile_0006_edificio_alto', 'tile_0010_edificio_alto', 'tile_0014_edificio_alto'],
    tejado: ['tile_0024_tejado', 'tile_0025_tejado', 'tile_0026_tejado', 'tile_0027_tejado']
  },
  NATURE: {
    arbol_grande: ['tile_0002_arbol_grande', 'tile_0032_arbol_grande', 'tile_0036_arbol_grande', 'tile_0160_arbol_grande'],
    arbol_pequeño: ['tile_0033_arbol_pequeño', 'tile_0069_arbol_pequeño', 'tile_0161_arbol_pequeño', 'tile_0173_arbol_pequeño'],
    arbol_frondoso: ['tile_0034_arbol_frondoso', 'tile_0070_arbol_frondoso', 'tile_0146_arbol_frondoso', 'tile_0162_arbol_frondoso'],
    arbol_joven: ['tile_0035_arbol_joven', 'tile_0071_arbol_joven', 'tile_0107_arbol_joven', 'tile_0147_arbol_joven']
  },
  ROADS: {
    horizontal: ['tile_0001_carretera_horizontal', 'tile_0192_carretera_horizontal', 'tile_0208_carretera_horizontal'],
    vertical: ['tile_0189_carretera_vertical', 'tile_0229_carretera_vertical', 'tile_0245_carretera_vertical'],
    curva: ['tile_0154_carretera_curva', 'tile_0190_carretera_curva', 'tile_0226_carretera_curva'],
    cruce: ['tile_0191_carretera_cruce', 'tile_0227_carretera_cruce', 'tile_0263_carretera_cruce']
  },
  WATER: {
    profunda: ['tile_0149_agua_profunda', 'tile_0157_agua_profunda', 'tile_0237_agua_profunda'],
    estanque: ['tile_0235_agua_estanque', 'tile_0239_agua_estanque', 'tile_0271_agua_estanque'],
    clara: ['tile_0236_agua_clara', 'tile_0240_agua_clara', 'tile_0272_agua_clara'],
    corriente: ['tile_0238_agua_corriente', 'tile_0242_agua_corriente', 'tile_0274_agua_corriente']
  }
};

function main() {
  console.log('🔍 AUDITORÍA DE ASSETS\n');
  
  const tilesDir = path.join(__dirname, '..', 'public', 'assets', 'Tiles');
  
  // Obtener todos los archivos disponibles
  const availableFiles = fs.readdirSync(tilesDir)
    .filter(file => file.endsWith('.png'))
    .map(file => file.replace('.png', ''));
  
  console.log(`📁 Assets disponibles: ${availableFiles.length}`);
  console.log(`   ${availableFiles.join(', ')}\n`);
  
  // Obtener todos los assets definidos
  const definedAssets = [];
  Object.entries(ASSET_CATEGORIES).forEach(([category, subtypes]) => {
    Object.entries(subtypes).forEach(([subtype, assets]) => {
      definedAssets.push(...assets);
    });
  });
  
  console.log(`📋 Assets definidos: ${definedAssets.length}`);
  
  // Encontrar assets faltantes
  const missingAssets = definedAssets.filter(asset => !availableFiles.includes(asset));
  const extraAssets = availableFiles.filter(asset => !definedAssets.includes(asset));
  
  if (missingAssets.length > 0) {
    console.log(`\n❌ ASSETS FALTANTES (${missingAssets.length}):`);
    missingAssets.forEach(asset => console.log(`   - ${asset}`));
  }
  
  if (extraAssets.length > 0) {
    console.log(`\n📦 ASSETS NO DEFINIDOS (${extraAssets.length}):`);
    extraAssets.forEach(asset => console.log(`   + ${asset}`));
  }
  
  if (missingAssets.length === 0 && extraAssets.length === 0) {
    console.log('\n✅ Todos los assets están sincronizados');
  }
  
  // Estadísticas por categoría
  console.log('\n📊 ESTADÍSTICAS POR CATEGORÍA:');
  Object.entries(ASSET_CATEGORIES).forEach(([category, subtypes]) => {
    console.log(`\n${category}:`);
    Object.entries(subtypes).forEach(([subtype, assets]) => {
      const available = assets.filter(asset => availableFiles.includes(asset)).length;
      const total = assets.length;
      const status = available === total ? '✅' : '❌';
      console.log(`  ${status} ${subtype}: ${available}/${total}`);
    });
  });
  
  console.log('\n🏁 Auditoría completada');
}

main();
