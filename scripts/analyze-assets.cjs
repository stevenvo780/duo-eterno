/**
 * Script para analizar todos los assets existentes y generar mapeo dinámico
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../public/assets');

function getAssetsInDirectory(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files
      .filter(file => file.endsWith('.png'))
      .map(file => file.replace('.png', ''));
  } catch (error) {
    console.warn(`No se pudo leer directorio: ${dirPath}`);
    return [];
  }
}

function analyzeAssetFolders() {
  console.log('🔍 Analizando estructura de assets...\n');
  
  const assetMap = {};
  
  try {
    const folders = fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    folders.forEach(folder => {
      const folderPath = path.join(ASSETS_DIR, folder);
      const assets = getAssetsInDirectory(folderPath);
      
      if (assets.length > 0) {
        assetMap[folder] = assets;
        console.log(`📁 ${folder}: ${assets.length} assets`);
        console.log(`   ${assets.slice(0, 5).join(', ')}${assets.length > 5 ? '...' : ''}\n`);
      }
    });
    
  } catch (error) {
    console.error('Error analizando assets:', error);
  }
  
  return assetMap;
}

function generateAssetCategories(assetMap) {
  console.log('🎨 Generando categorías dinámicas...\n');
  
  const categories = {};
  
  Object.entries(assetMap).forEach(([folder, assets]) => {
    switch (folder) {
      case 'terrain_tiles':
        categories.TERRAIN_TILES = {
          grass: assets.filter(asset => asset.includes('cesped') || asset.includes('Grass')),
          dirt: assets.filter(asset => asset.includes('tierra') || asset.includes('dirt')),
          stone: assets.filter(asset => asset.includes('piedra') || asset.includes('stone')),
          sand: assets.filter(asset => asset.includes('arena') || asset.includes('sand')),
          textured: assets.filter(asset => asset.includes('Textured'))
        };
        break;
        
      case 'structures':
        categories.STRUCTURES = {
          houses: assets.filter(asset => asset.includes('House')),
          walls: assets.filter(asset => asset.includes('muro') || asset.includes('Wall')),
          fences: assets.filter(asset => asset.includes('Fence')),
          wells: assets.filter(asset => asset.includes('Well')),
          glass: assets.filter(asset => asset.includes('vidrio') || asset.includes('glass'))
        };
        break;
        
      case 'natural_elements':
        categories.NATURAL_ELEMENTS = {
          trees: assets.filter(asset => asset.includes('Tree') || asset.includes('Oak')),
          bushes: assets.filter(asset => asset.includes('Bush')),
          rocks: assets.filter(asset => asset.includes('Rock')),
          cliffs: assets.filter(asset => asset.includes('Cliff')),
          logs: assets.filter(asset => asset.includes('tronco'))
        };
        break;
        
      case 'water':
        categories.WATER = {
          tiles: assets
        };
        break;
        
      case 'infrastructure':
        categories.INFRASTRUCTURE = {
          paths: assets
        };
        break;
        
      case 'environmental_objects':
        categories.ENVIRONMENTAL_OBJECTS = {
          furniture: assets.filter(asset => 
            asset.includes('Bench') || asset.includes('Table') || asset.includes('silla')
          ),
          lighting: assets.filter(asset => 
            asset.includes('Lamp') || asset.includes('lampara')
          ),
          signs: assets.filter(asset => asset.includes('Sign')),
          decorations: assets.filter(asset => 
            asset.includes('Banner') || asset.includes('Plant')
          ),
          street_items: assets.filter(asset => 
            asset.includes('poste') || asset.includes('sombrilla') || asset.includes('ropas')
          ),
          waste: assets.filter(asset => asset.includes('basuras')),
          containers: assets.filter(asset => asset.includes('botellas') || asset.includes('cajas'))
        };
        break;
        
      default:
        categories[folder.toUpperCase()] = { all: assets };
    }
  });
  
  // Filtrar categorías vacías
  Object.keys(categories).forEach(category => {
    Object.keys(categories[category]).forEach(subcategory => {
      if (categories[category][subcategory].length === 0) {
        delete categories[category][subcategory];
      }
    });
  });
  
  return categories;
}

// Ejecutar análisis
const assetMap = analyzeAssetFolders();
const categories = generateAssetCategories(assetMap);

console.log('📊 Resumen de categorías generadas:');
Object.entries(categories).forEach(([category, subcategories]) => {
  console.log(`\n${category}:`);
  Object.entries(subcategories).forEach(([sub, assets]) => {
    console.log(`  ${sub}: ${assets.length} assets`);
  });
});

// Exportar resultado
const output = {
  assetMap,
  categories,
  generatedAt: new Date().toISOString()
};

fs.writeFileSync(
  path.join(__dirname, '../src/generated/asset-analysis.json'),
  JSON.stringify(output, null, 2)
);

console.log('\n✅ Análisis guardado en src/generated/asset-analysis.json');