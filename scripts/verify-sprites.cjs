#!/usr/bin/env node

/**
 * Script de verificación de sprites animados
 * Verifica que todos los sprites requeridos por el sistema de animación estén disponibles
 */

const fs = require('fs');
const path = require('path');

// Lista de sprites animados requeridos (debe coincidir con Canvas.tsx)
const requiredAnimatedSprites = [
  // Entidades con emociones
  'entidad_circulo_happy_anim',
  'entidad_circulo_sad_anim', 
  'entidad_circulo_dying_anim',
  'entidad_square_happy_anim',
  'entidad_square_sad_anim',
  'entidad_square_dying_anim'
];

// Directorios de assets
const animationsDir = path.join(__dirname, '..', 'public', 'assets', 'animations', 'entities');
const propsDir = path.join(__dirname, '..', 'public', 'assets', 'props');
const backgroundsDir = path.join(__dirname, '..', 'public', 'assets', 'backgrounds');

console.log('🔍 Verificando sistema de sprites animados...');
console.log(`📁 Animaciones: ${animationsDir}`);
console.log(`📁 Props: ${propsDir}`);
console.log(`📁 Fondos: ${backgroundsDir}\n`);

let missing = [];
let found = [];

// Verificar sprites animados (PNG + JSON)
console.log('🎬 Verificando sprites animados:');
requiredAnimatedSprites.forEach(spriteName => {
  const pngPath = path.join(animationsDir, `${spriteName}.png`);
  const jsonPath = path.join(animationsDir, `${spriteName}.json`);
  
  const hasPng = fs.existsSync(pngPath);
  const hasJson = fs.existsSync(jsonPath);
  
  if (hasPng && hasJson) {
    found.push(spriteName);
    console.log(`✅ ${spriteName} (PNG + JSON)`);
  } else {
    missing.push(spriteName);
    const missingParts = [];
    if (!hasPng) missingParts.push('PNG');
    if (!hasJson) missingParts.push('JSON');
    console.log(`❌ ${spriteName} - FALTANTE (${missingParts.join(', ')})`);
  }
});

// Verificar fondo principal
console.log('\n🌿 Verificando fondo:');
const backgroundPath = path.join(backgroundsDir, 'grass', 'magical_grass_base.png');
if (fs.existsSync(backgroundPath)) {
  console.log('✅ magical_grass_base.png');
} else {
  console.log('❌ magical_grass_base.png - FALTANTE');
  missing.push('background');
}

// Verificar algunos props esenciales
console.log('\n🏠 Verificando props esenciales:');
const essentialProps = ['banco', 'deco_bookshelf', 'deco_clock', 'furniture_sofa_modern', 'flor_rosa'];
essentialProps.forEach(propName => {
  const propPath = path.join(propsDir, `${propName}.png`);
  if (fs.existsSync(propPath)) {
    console.log(`✅ ${propName}.png`);
  } else {
    console.log(`❌ ${propName}.png - FALTANTE`);
    missing.push(propName);
  }
});

console.log('\n📊 Resumen:');
console.log(`✅ Encontrados: ${found.length}`);
console.log(`❌ Faltantes: ${missing.length}`);
console.log(`📈 Cobertura: ${((found.length / requiredAnimatedSprites.length) * 100).toFixed(1)}%`);

if (missing.length > 0) {
  console.log('\n🚨 Assets faltantes:');
  missing.forEach(asset => console.log(`   - ${asset}`));
  console.log('\n💡 Para regenerar assets faltantes, ejecutar:');
  console.log('   python3 scripts/create-animations.py');
  process.exit(1);
} else {
  console.log('\n🎉 ¡Todos los sprites están disponibles!');
  process.exit(0);
}
