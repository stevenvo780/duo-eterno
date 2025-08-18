#!/usr/bin/env node

/**
 * Script de verificación de sprites para Duo Eterno.
 *
 * Revisa la presencia de archivos .png requeridos en `public/assets/sprites` y
 * entrega un resumen de cobertura. Esta utilidad no inspecciona atlas/tilesets,
 * sólo nombres de archivo planos.
 */

const fs = require('fs');
const path = require('path');

/**
 * Conjunto canónico de nombres de sprite requeridos.
 * Mantener sincronizado con la UI/escenas que los referencian.
 * @type {string[]}
 */
const REQUIRED_SPRITES = [
  'barra_estadistica',
  'canvas_base',
  'conexion_entidades',
  'dialogo_overlay',
  'entidad_circulo_happy',
  'entidad_circulo_sad',
  'entidad_circulo_dying',
  'entidad_square_happy',
  'entidad_square_sad',
  'entidad_square_dying',
  'pattern_kitchen',
  'pattern_bedroom',
  'pattern_living',
  'pattern_garden',
  'pattern_stone',
  'pattern_tiles_only',
  'furniture_bed_simple',
  'furniture_bed_double',
  'furniture_sofa_modern',
  'furniture_sofa_classic',
  'furniture_table_coffee',
  'furniture_table_dining',
  'plant_small',
  'plant_tree',
  'plant_flower',
  'deco_lamp',
  'deco_clock',
  'deco_bookshelf',
  'path_stone_h',
  'path_stone_v',
  'path_brick_h',
  'path_dirt_h',
  'obstaculo_arbol',
  'obstaculo_roca',
  'flor_rosa',
  'banco',
  'lampara',
  'fuente_agua'
];

/**
 * Directorio base donde se esperan los sprites PNG.
 */
const SPRITES_DIR = path.join(__dirname, '../public/assets/sprites');

/**
 * Verifica la existencia de sprites requeridos y emite un reporte.
 *
 * Detalles:
 * - Complejidad O(N) en número de sprites requeridos.
 * - Mide cobertura simple: encontrados / requeridos.
 * - Retorna código de salida 1 si faltan sprites (útil en CI).
 */
function checkSprites() {
  console.log('🔍 Verificando sprites requeridos...\n');

  if (!fs.existsSync(SPRITES_DIR)) {
    console.error(`❌ Directorio de sprites no encontrado: ${SPRITES_DIR}`);
    console.error('💡 Crea el directorio: mkdir -p public/assets/sprites');
    process.exit(1);
  }

  const missing = [];
  const found = [];

  for (const sprite of REQUIRED_SPRITES) {
    const spritePath = path.join(SPRITES_DIR, `${sprite}.png`);
    if (fs.existsSync(spritePath)) {
      found.push(sprite);
      console.log(`✅ ${sprite}.png`);
    } else {
      missing.push(sprite);
      console.log(`❌ ${sprite}.png`);
    }
  }

  console.log(`\n📊 Resumen:`);
  console.log(`✅ Encontrados: ${found.length}/${REQUIRED_SPRITES.length}`);
  console.log(`❌ Faltantes: ${missing.length}/${REQUIRED_SPRITES.length}`);

  if (missing.length > 0) {
    console.log(`\n🚨 Sprites faltantes:`);
    missing.forEach(sprite => console.log(`   - ${sprite}.png`));

    console.log(`\n💡 Para generar sprites faltantes:`);
    console.log(`   npm run generate-sprites`);
    console.log(`   # o específicos:`);
    console.log(
      `   python3 scripts/create-pixel-art.py sprites "${missing.join(',')}" public/assets/sprites`
    );

    process.exit(1);
  }

  console.log(`\n🎉 ¡Todos los sprites están disponibles!`);
  const coverage = (found.length / REQUIRED_SPRITES.length) * 100;
  console.log(`📈 Cobertura: ${coverage.toFixed(1)}%`);
}

if (require.main === module) {
  checkSprites();
}

module.exports = { checkSprites, REQUIRED_SPRITES };
