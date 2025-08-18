#!/usr/bin/env node

/**
 * 🎬 SISTEMA DE CARGA AUTOMÁTICA DE SPRITES Y ANIMACIONES
 *
 * Este script explora dinámicamente la carpeta public/assets/ para:
 * 1. Detectar automáticamente todas las carpetas de assets
 * 2. Leer sprites de animación con sus metadatos JSON
 * 3. Generar un manifest de assets organizados por carpeta
 * 4. Crear un sistema de carga dinámica por nombre de carpeta
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const ASSETS_DIR = path.join(__dirname, '../public/assets');
const OUTPUT_DIR = path.join(__dirname, '../src/generated');
const MANIFEST_FILE = path.join(OUTPUT_DIR, 'asset-manifest.ts');
const ANIMATION_TYPES_FILE = path.join(OUTPUT_DIR, 'animation-types.ts');

// Tipos de archivos soportados
const SUPPORTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
const ANIMATION_JSON_SUFFIX = '_anim.json';
const DETECTED_JSON_SUFFIX = '_detected.json';

/**
 * Explorar recursivamente una carpeta y obtener todos los archivos
 */
function exploreDirectory(dirPath, relativePath = '') {
  const items = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        // Recursivamente explorar subdirectorios
        items.push({
          type: 'directory',
          name: entry.name,
          path: relPath,
          children: exploreDirectory(fullPath, relPath)
        });
      } else if (entry.isFile()) {
        items.push({
          type: 'file',
          name: entry.name,
          path: relPath,
          extension: path.extname(entry.name).toLowerCase(),
          nameWithoutExt: path.basename(entry.name, path.extname(entry.name))
        });
      }
    }
  } catch (error) {
    console.warn(`⚠️ No se pudo leer el directorio: ${dirPath}`, error.message);
  }

  return items;
}

/**
 * Detectar animaciones basadas en archivos JSON y PNG (recursivamente)
 */
function detectAnimations(items) {
  const animations = [];

  function findAnimationsRecursive(currentItems, basePath = '') {
    // Buscar archivos que terminen en _anim.json
    const animationJsonFiles = currentItems
      .filter(item => item.type === 'file' && item.name.endsWith(ANIMATION_JSON_SUFFIX))
      .map(item => ({
        ...item,
        baseName: item.nameWithoutExt.replace('_anim', ''),
        jsonPath: item.path
      }));

    // Buscar archivos que terminen en _detected.json (spritesheets detectados)
    const detectedJsonFiles = currentItems
      .filter(item => item.type === 'file' && item.name.endsWith(DETECTED_JSON_SUFFIX))
      .map(item => ({
        ...item,
        baseName: item.nameWithoutExt.replace('_detected', ''),
        jsonPath: item.path
      }));

    // Procesar animaciones manuales (_anim.json)
    for (const jsonFile of animationJsonFiles) {
      // Buscar el PNG correspondiente
      const pngFile = currentItems.find(
        item =>
          item.type === 'file' &&
          item.nameWithoutExt === jsonFile.nameWithoutExt &&
          item.extension === '.png'
      );

      if (pngFile) {
        // Leer metadatos de la animación
        try {
          const jsonPath = path.join(ASSETS_DIR, jsonFile.path);
          const metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

          animations.push({
            id: jsonFile.baseName,
            name: metadata.name || jsonFile.baseName,
            jsonPath: jsonFile.path,
            spritePath: pngFile.path,
            metadata: metadata
          });
        } catch (error) {
          console.warn(`⚠️ Error leyendo metadatos de ${jsonFile.path}:`, error.message);
        }
      }
    }

    // Procesar spritesheets detectados automáticamente (_detected.json)
    for (const jsonFile of detectedJsonFiles) {
      // Extraer el nombre base del archivo detectado
      // Ej: "Netflix_default_detected.json" -> baseName = "Netflix_default"
      let baseName = jsonFile.nameWithoutExt.replace('_detected', '');

      // Si el baseName contiene "_default", intentar también sin esa parte
      let possibleNames = [baseName];
      if (baseName.includes('_default')) {
        possibleNames.push(baseName.replace('_default', ''));
      }

      // Buscar el PNG correspondiente con cualquiera de los nombres posibles
      const pngFile = currentItems.find(
        item =>
          item.type === 'file' &&
          possibleNames.includes(item.nameWithoutExt) &&
          item.extension === '.png'
      );

      if (pngFile) {
        // Leer metadatos del spritesheet detectado
        try {
          const jsonPath = path.join(ASSETS_DIR, jsonFile.path);
          const metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

          animations.push({
            id: pngFile.nameWithoutExt + '_detected', // Usar el nombre del PNG + _detected para evitar duplicados
            name: metadata.name || pngFile.nameWithoutExt,
            jsonPath: jsonFile.path,
            spritePath: pngFile.path,
            metadata: metadata
          });
        } catch (error) {
          console.warn(
            `⚠️ Error leyendo metadatos de spritesheet detectado ${jsonFile.path}:`,
            error.message
          );
        }
      }
    }

    // Buscar recursivamente en subdirectorios
    currentItems
      .filter(item => item.type === 'directory' && item.children)
      .forEach(dir => {
        findAnimationsRecursive(dir.children, path.join(basePath, dir.name));
      });
  }

  findAnimationsRecursive(items);
  return animations;
}

/**
 * Detectar sprites estáticos (imágenes sin animación) recursivamente
 */
function detectStaticSprites(items) {
  const sprites = [];

  function findSpritesRecursive(currentItems) {
    const currentSprites = currentItems
      .filter(
        item =>
          item.type === 'file' &&
          SUPPORTED_IMAGE_EXTENSIONS.includes(item.extension) &&
          !item.name.includes('_anim')
      )
      .map(item => ({
        id: item.nameWithoutExt,
        name: item.nameWithoutExt.replace(/[-_]/g, ' '),
        path: item.path,
        extension: item.extension
      }));

    sprites.push(...currentSprites);

    // Buscar recursivamente en subdirectorios
    currentItems
      .filter(item => item.type === 'directory' && item.children)
      .forEach(dir => {
        findSpritesRecursive(dir.children);
      });
  }

  findSpritesRecursive(items);
  return sprites;
}

/**
 * Procesar una carpeta y extraer assets
 */
function processFolderAssets(folder, basePath = '') {
  const fullPath = path.join(ASSETS_DIR, basePath, folder.name);
  const items = folder.children || [];

  const animations = detectAnimations(items);
  const staticSprites = detectStaticSprites(items);

  // Procesar subcarpetas recursivamente
  const subfolders = items
    .filter(item => item.type === 'directory')
    .reduce((acc, subfolder) => {
      const subPath = path.join(basePath, folder.name);
      acc[subfolder.name] = processFolderAssets(subfolder, subPath);
      return acc;
    }, {});

  return {
    name: folder.name,
    path: path.join(basePath, folder.name).replace(/\\/g, '/'),
    animations,
    staticSprites,
    subfolders: Object.keys(subfolders).length > 0 ? subfolders : undefined,
    totalAssets: animations.length + staticSprites.length
  };
}

/**
 * Generar código TypeScript para el manifest
 */
function generateManifest(assetStructure) {
  const code = `/**
 * 🎨 MANIFEST DE ASSETS GENERADO AUTOMÁTICAMENTE
 * 
 * Este archivo se genera automáticamente ejecutando:
 * npm run sprite-loader
 * 
 * Contiene toda la estructura de assets organizados por carpetas
 */

export interface AnimationMetadata {
  name: string;
  frame_count: number;
  frame_size: [number, number];
  columns: number;
  rows: number;
  total_duration: number;
  loop: boolean;
  frames: Array<{ duration: number }>;
}

export interface AnimationAsset {
  id: string;
  name: string;
  jsonPath: string;
  spritePath: string;
  metadata: AnimationMetadata;
}

export interface StaticSpriteAsset {
  id: string;
  name: string;
  path: string;
  extension: string;
}

export interface AssetFolder {
  name: string;
  path: string;
  animations: AnimationAsset[];
  staticSprites: StaticSpriteAsset[];
  subfolders?: Record<string, AssetFolder>;
  totalAssets: number;
}

export const ASSET_MANIFEST: Record<string, AssetFolder> = ${JSON.stringify(assetStructure, null, 2)};

// Helper para obtener assets de una carpeta específica
export function getAssetsByFolder(folderName: string): AssetFolder | null {
  return ASSET_MANIFEST[folderName] || null;
}

// Helper para obtener todas las animaciones disponibles
export function getAllAnimations(): AnimationAsset[] {
  const animations: AnimationAsset[] = [];
  
  function collectAnimations(folder: AssetFolder) {
    animations.push(...folder.animations);
    if (folder.subfolders) {
      Object.values(folder.subfolders).forEach(collectAnimations);
    }
  }
  
  Object.values(ASSET_MANIFEST).forEach(collectAnimations);
  return animations;
}

// Helper para obtener animaciones por entidad
export function getEntityAnimations(entityName: string): AnimationAsset[] {
  return getAllAnimations().filter(anim => 
    anim.id.includes(entityName) || anim.name.includes(entityName)
  );
}

// Helper para buscar assets por nombre
export function searchAssets(query: string): (AnimationAsset | StaticSpriteAsset)[] {
  const results: (AnimationAsset | StaticSpriteAsset)[] = [];
  const searchTerm = query.toLowerCase();
  
  function searchInFolder(folder: AssetFolder) {
    // Buscar en animaciones
    results.push(...folder.animations.filter(anim => 
      anim.id.toLowerCase().includes(searchTerm) || 
      anim.name.toLowerCase().includes(searchTerm)
    ));
    
    // Buscar en sprites estáticos
    results.push(...folder.staticSprites.filter(sprite => 
      sprite.id.toLowerCase().includes(searchTerm) || 
      sprite.name.toLowerCase().includes(searchTerm)
    ));
    
    // Buscar en subcarpetas
    if (folder.subfolders) {
      Object.values(folder.subfolders).forEach(searchInFolder);
    }
  }
  
  Object.values(ASSET_MANIFEST).forEach(searchInFolder);
  return results;
}

// Generar estadísticas de assets
export function getAssetStats() {
  let totalAnimations = 0;
  let totalStaticSprites = 0;
  let totalFolders = 0;
  
  function countAssets(folder: AssetFolder) {
    totalAnimations += folder.animations.length;
    totalStaticSprites += folder.staticSprites.length;
    totalFolders += 1;
    
    if (folder.subfolders) {
      Object.values(folder.subfolders).forEach(countAssets);
    }
  }
  
  Object.values(ASSET_MANIFEST).forEach(countAssets);
  
  return {
    totalAnimations,
    totalStaticSprites,
    totalAssets: totalAnimations + totalStaticSprites,
    totalFolders,
    folders: Object.keys(ASSET_MANIFEST)
  };
}
`;

  return code;
}

/**
 * Generar tipos TypeScript para las animaciones específicas encontradas
 */
function generateAnimationTypes(assetStructure) {
  const allAnimations = [];

  function collectAnimations(folder) {
    allAnimations.push(...folder.animations);
    if (folder.subfolders) {
      Object.values(folder.subfolders).forEach(collectAnimations);
    }
  }

  Object.values(assetStructure).forEach(collectAnimations);

  const animationIds = [...new Set(allAnimations.map(anim => anim.id))];
  const animationNames = [...new Set(allAnimations.map(anim => anim.name))];

  const code = `/**
 * 🎬 TIPOS DE ANIMACIÓN GENERADOS AUTOMÁTICAMENTE
 * 
 * Este archivo contiene tipos TypeScript específicos para las animaciones
 * encontradas en el proyecto
 */

// IDs de animaciones disponibles
export type AnimationId = ${animationIds.map(id => `'${id}'`).join(' | ')};

// Nombres de animaciones disponibles
export type AnimationName = ${animationNames.map(name => `'${name}'`).join(' | ')};

// Carpetas con animaciones
export type AnimationFolder = ${Object.keys(assetStructure)
    .filter(key => assetStructure[key].animations.length > 0)
    .map(folder => `'${folder}'`)
    .join(' | ')};

// Entidades con animaciones (detectadas automáticamente)
${generateEntityTypes(allAnimations)}

// Estados de animación comunes detectados
${generateAnimationStates(allAnimations)}
`;

  return code;
}

function generateEntityTypes(animations) {
  const entities = new Set();

  animations.forEach(anim => {
    const parts = anim.id.split('_');
    if (parts.length >= 2 && parts[0] === 'entidad') {
      entities.add(parts[1]);
    }
  });

  if (entities.size === 0) return '// No se detectaron entidades con animaciones';

  return `export type EntityType = ${Array.from(entities)
    .map(e => `'${e}'`)
    .join(' | ')};`;
}

function generateAnimationStates(animations) {
  const states = new Set();

  animations.forEach(anim => {
    // Detectar estados comunes en los nombres
    const name = anim.name.toLowerCase();
    const id = anim.id.toLowerCase();

    ['happy', 'sad', 'dying', 'idle', 'walk', 'run', 'jump', 'attack'].forEach(state => {
      if (name.includes(state) || id.includes(state)) {
        states.add(state);
      }
    });
  });

  if (states.size === 0) return '// No se detectaron estados de animación comunes';

  return `export type AnimationState = ${Array.from(states)
    .map(s => `'${s}'`)
    .join(' | ')};`;
}

/**
 * Script principal
 */
function main() {
  console.log('🎬 Iniciando carga automática de sprites y animaciones...');

  // Verificar que existe la carpeta de assets
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`❌ No se encontró la carpeta de assets: ${ASSETS_DIR}`);
    process.exit(1);
  }

  // Crear directorio de salida si no existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Creado directorio: ${OUTPUT_DIR}`);
  }

  // Explorar estructura de assets
  console.log('🔍 Explorando estructura de assets...');
  const rootItems = exploreDirectory(ASSETS_DIR);

  // Procesar cada carpeta principal
  const assetStructure = {};
  rootItems
    .filter(item => item.type === 'directory')
    .forEach(folder => {
      assetStructure[folder.name] = processFolderAssets(folder);
    });

  // Generar archivos TypeScript
  console.log('📝 Generando manifest de assets...');
  const manifestCode = generateManifest(assetStructure);
  fs.writeFileSync(MANIFEST_FILE, manifestCode, 'utf-8');

  console.log('🎯 Generando tipos de animación...');
  const typesCode = generateAnimationTypes(assetStructure);
  fs.writeFileSync(ANIMATION_TYPES_FILE, typesCode, 'utf-8');

  // Mostrar estadísticas
  console.log('\n📊 ESTADÍSTICAS DE ASSETS:');
  let totalAnimations = 0;
  let totalSprites = 0;

  Object.entries(assetStructure).forEach(([folderName, folder]) => {
    console.log(`   📁 ${folderName}:`);
    console.log(`      🎬 ${folder.animations.length} animaciones`);
    console.log(`      🖼️  ${folder.staticSprites.length} sprites estáticos`);

    if (folder.subfolders) {
      Object.entries(folder.subfolders).forEach(([subName, subfolder]) => {
        console.log(`      📁 ${subName}: ${subfolder.totalAssets} assets`);
      });
    }

    totalAnimations += folder.animations.length;
    totalSprites += folder.staticSprites.length;
  });

  console.log(`\n✅ RESUMEN:`);
  console.log(`   🎬 ${totalAnimations} animaciones totales`);
  console.log(`   🖼️  ${totalSprites} sprites estáticos`);
  console.log(`   📁 ${Object.keys(assetStructure).length} carpetas principales`);
  console.log(`   📄 Archivos generados:`);
  console.log(`      - ${MANIFEST_FILE}`);
  console.log(`      - ${ANIMATION_TYPES_FILE}`);

  console.log('\n🎉 ¡Carga de sprites completada exitosamente!');
}

// Ejecutar script
main();
