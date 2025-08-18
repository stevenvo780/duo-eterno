#!/usr/bin/env node

/**
 * Script de verificación de sprites
 * Verifica que todos los sprites requeridos por la aplicación estén disponibles
 */

const fs = require('fs');
const path = require('path');

// Lista de sprites requeridos (debe coincidir con OptimizedCanvas.tsx)
const requiredSprites = [
  // Interface y elementos UI
  'barra_estadistica',
  'canvas_base', 
  'conexion_entidades',
  'dialogo_overlay',
  // Entidades principales
  'entidad_circulo_happy',
  'entidad_circulo_sad', 
  'entidad_circulo_dying',
  'entidad_square_happy',
  'entidad_square_sad',
  'entidad_square_dying',
  // Patrones de zonas
  'pattern_kitchen',
  'pattern_bedroom',
  'pattern_living',
  'pattern_garden',
  'pattern_stone',
  'pattern_tiles_only',
  // Mobiliario
  'furniture_bed_simple',
  'furniture_bed_double',
  'furniture_sofa_modern',
  'furniture_sofa_classic',
  'furniture_table_coffee',
  'furniture_table_dining',
  // Plantas y naturaleza
  'plant_small',
  'plant_tree',
  'plant_flower',
  'flor_rosa',
  // Decoración
  'deco_lamp',
  'deco_clock',
  'deco_bookshelf',
  'banco',
  'lampara',
  'fuente_agua',
  // Caminos y obstáculos
  'path_stone_h',
  'path_stone_v',
  'path_brick_h',
  'path_dirt_h',
  'obstaculo_arbol',
  'obstaculo_roca'
];

const spritesDir = path.join(__dirname, '..', 'public', 'assets', 'sprites');

console.log('🔍 Verificando sprites...');
console.log(`📁 Directorio: ${spritesDir}\n`);

let missing = [];
let found = [];

requiredSprites.forEach(spriteName => {
  const spritePath = path.join(spritesDir, `${spriteName}.png`);
  if (fs.existsSync(spritePath)) {
    found.push(spriteName);
    console.log(`✅ ${spriteName}.png`);
  } else {
    missing.push(spriteName);
    console.log(`❌ ${spriteName}.png - FALTANTE`);
  }
});

console.log('\n📊 Resumen:');
console.log(`✅ Encontrados: ${found.length}`);
console.log(`❌ Faltantes: ${missing.length}`);
console.log(`📈 Cobertura: ${((found.length / requiredSprites.length) * 100).toFixed(1)}%`);

if (missing.length > 0) {
  console.log('\n🚨 Sprites faltantes:');
  missing.forEach(sprite => console.log(`   - ${sprite}.png`));
  console.log('\n💡 Para regenerar sprites faltantes:');
  console.log('   python3 scripts/create-pixel-art.py sprites "' + missing.join(',') + '" public/assets/sprites');
  process.exit(1);
} else {
  console.log('\n🎉 ¡Todos los sprites están disponibles!');
  process.exit(0);
}
