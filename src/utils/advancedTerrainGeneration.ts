/**
 * 🌍 SISTEMA AVANZADO DE GENERACIÓN DE TERRENO
 *
 * Sistema de generación procedural multi-capa que produce mapas naturales
 * y orgánicos usando técnicas modernas de game development.
 */

import { PerlinNoise } from './noiseGeneration';
import type { MapElement } from '../types';
import { assetManager, type Asset } from './assetManager';

// Configuración del generador de terreno
export interface TerrainConfig {
  width: number;
  height: number;
  seed: number;
  tileSize: number;
  biomeBlendRadius: number;
  detailLevel: number;
}

// Definición de biomas naturales
export interface Biome {
  id: string;
  name: string;
  baseColor: string;
  secondaryColor: string;
  textureVariants: string[];
  objectDensity: number;
  preferredObjects: BiomeObject[];
  transitionSoftness: number;
}

export interface BiomeObject {
  type: string;
  spawnChance: number;
  clusterSize: { min: number; max: number };
  sizeVariation: { min: number; max: number };
  rotationVariation: boolean;
  colorTint?: string;
}

// Sistema de variación visual
export interface VisualVariation {
  rotation: number;
  scale: number;
  tint: string;
  weathering: number;
  flipX: boolean;
  flipY: boolean;
}

// Cache para almacenar los assets dinámicos por bioma
const biomeAssetsCache = new Map<string, string[]>();

// Función para obtener assets dinámicamente usando categorías existentes
async function getAssetsByBiomeType(biomeType: string): Promise<string[]> {
  if (biomeAssetsCache.has(biomeType)) {
    return biomeAssetsCache.get(biomeType)!;
  }

  let assets: string[] = [];
  
  try {
    switch (biomeType) {
      case 'grass': {
        // Cargar todos los assets de césped existentes
        const terrainAssets = await assetManager.loadAssetsBySubtype('TERRAIN_TILES', 'grass');
        assets = terrainAssets.map(asset => asset.id);
        break;
      }
      case 'textured': {
        const texturedAssets = await assetManager.loadAssetsBySubtype('TERRAIN_TILES', 'textured');
        assets = texturedAssets.map(asset => asset.id);
        break;
      }
      case 'water': {
        const waterAssets = await assetManager.loadAssetsBySubtype('WATER', 'tiles');
        assets = waterAssets.map(asset => asset.id);
        break;
      }
      case 'trees': {
        const treeAssets = await assetManager.loadAssetsBySubtype('NATURAL_ELEMENTS', 'trees');
        assets = treeAssets.map(asset => asset.id);
        break;
      }
      case 'bushes': {
        const bushAssets = await assetManager.loadAssetsBySubtype('NATURAL_ELEMENTS', 'bushes');
        assets = bushAssets.map(asset => asset.id);
        break;
      }
      case 'rocks': {
        const rockAssets = await assetManager.loadAssetsBySubtype('NATURAL_ELEMENTS', 'rocks');
        assets = rockAssets.map(asset => asset.id);
        break;
      }
      case 'logs': {
        const logAssets = await assetManager.loadAssetsBySubtype('NATURAL_ELEMENTS', 'logs');
        assets = logAssets.map(asset => asset.id);
        break;
      }
      case 'cliffs': {
        const cliffAssets = await assetManager.loadAssetsBySubtype('NATURAL_ELEMENTS', 'cliffs');
        assets = cliffAssets.map(asset => asset.id);
        break;
      }
      case 'paths': {
        const pathAssets = await assetManager.loadAssetsBySubtype('INFRASTRUCTURE', 'paths');
        assets = pathAssets.map(asset => asset.id);
        break;
      }
      default:
        // Fallback: usar algunos assets de césped si están disponibles
        try {
          const fallbackAssets = await assetManager.getRandomAssetsFromCategory('TERRAIN_TILES', 3);
          assets = fallbackAssets.map(asset => asset.id);
        } catch {
          assets = ['Grass_Middle', 'TexturedGrass', 'cesped1'];
        }
    }
  } catch (error) {
    console.warn(`Error cargando assets para bioma ${biomeType}:`, error);
    // Fallback seguro usando assets básicos
    assets = ['Grass_Middle', 'TexturedGrass'];
  }

  // Si no se encontraron assets, usar fallback
  if (assets.length === 0) {
    assets = ['Grass_Middle', 'TexturedGrass'];
  }

  biomeAssetsCache.set(biomeType, assets);
  return assets;
}

// Definiciones de biomas con carga dinámica de assets
export const TERRAIN_BIOMES: Record<string, Biome> = {
  GRASSLAND: {
    id: 'grassland',
    name: 'Pradera',
    baseColor: '#4A7C59',
    secondaryColor: '#5E8B6B',
    textureVariants: [], // Se llenará dinámicamente
    objectDensity: 0.25,
    preferredObjects: [
      {
        type: 'wildflower',
        spawnChance: 0.4,
        clusterSize: { min: 2, max: 5 },
        sizeVariation: { min: 0.8, max: 1.2 },
        rotationVariation: true
      },
      {
        type: 'small_bush',
        spawnChance: 0.2,
        clusterSize: { min: 1, max: 3 },
        sizeVariation: { min: 0.9, max: 1.3 },
        rotationVariation: true
      },
      {
        type: 'grass_tuft',
        spawnChance: 0.6,
        clusterSize: { min: 3, max: 8 },
        sizeVariation: { min: 0.7, max: 1.1 },
        rotationVariation: true
      }
    ],
    transitionSoftness: 0.7
  },
  FOREST: {
    id: 'forest',
    name: 'Bosque',
    baseColor: '#2D4A32',
    secondaryColor: '#3A5C3F',
    textureVariants: [], // Se llenará dinámicamente
    objectDensity: 0.5,
    preferredObjects: [
      {
        type: 'tree_large',
        spawnChance: 0.3,
        clusterSize: { min: 1, max: 2 },
        sizeVariation: { min: 0.9, max: 1.4 },
        rotationVariation: true
      },
      {
        type: 'tree_medium',
        spawnChance: 0.5,
        clusterSize: { min: 2, max: 4 },
        sizeVariation: { min: 0.8, max: 1.2 },
        rotationVariation: true
      },
      {
        type: 'fern',
        spawnChance: 0.7,
        clusterSize: { min: 3, max: 6 },
        sizeVariation: { min: 0.6, max: 1.0 },
        rotationVariation: true
      },
      {
        type: 'mushroom',
        spawnChance: 0.2,
        clusterSize: { min: 1, max: 3 },
        sizeVariation: { min: 0.8, max: 1.1 },
        rotationVariation: false
      }
    ],
    transitionSoftness: 0.8
  },
  GARDEN: {
    id: 'garden',
    name: 'Jardín',
    baseColor: '#5A8B47',
    secondaryColor: '#6B9B58',
    textureVariants: [], // Se llenará dinámicamente
    objectDensity: 0.4,
    preferredObjects: [
      {
        type: 'flower_bed',
        spawnChance: 0.6,
        clusterSize: { min: 2, max: 5 },
        sizeVariation: { min: 0.9, max: 1.2 },
        rotationVariation: true,
        colorTint: '#FF6B9D'
      },
      {
        type: 'hedge',
        spawnChance: 0.3,
        clusterSize: { min: 1, max: 2 },
        sizeVariation: { min: 1.0, max: 1.1 },
        rotationVariation: false
      },
      {
        type: 'garden_stone',
        spawnChance: 0.2,
        clusterSize: { min: 1, max: 3 },
        sizeVariation: { min: 0.8, max: 1.3 },
        rotationVariation: true
      }
    ],
    transitionSoftness: 0.6
  },
  ROCKY: {
    id: 'rocky',
    name: 'Terreno Rocoso',
    baseColor: '#6B6B6B',
    secondaryColor: '#7A7A7A',
    textureVariants: [], // Se llenará dinámicamente
    objectDensity: 0.25,
    preferredObjects: [
      {
        type: 'rock_large',
        spawnChance: 0.4,
        clusterSize: { min: 1, max: 2 },
        sizeVariation: { min: 0.8, max: 1.5 },
        rotationVariation: true
      },
      {
        type: 'rock_medium',
        spawnChance: 0.6,
        clusterSize: { min: 2, max: 4 },
        sizeVariation: { min: 0.7, max: 1.2 },
        rotationVariation: true
      },
      {
        type: 'pebbles',
        spawnChance: 0.5,
        clusterSize: { min: 3, max: 7 },
        sizeVariation: { min: 0.5, max: 0.9 },
        rotationVariation: true
      }
    ],
    transitionSoftness: 0.5
  },
  SAND: {
    id: 'sand',
    name: 'Arenal',
    baseColor: '#C9B26B',
    secondaryColor: '#D7C27B',
    textureVariants: [], // Se llenará dinámicamente
    objectDensity: 0.08,
    preferredObjects: [
      {
        type: 'pebbles',
        spawnChance: 0.25,
        clusterSize: { min: 1, max: 3 },
        sizeVariation: { min: 0.6, max: 1.0 },
        rotationVariation: true
      }
    ],
    transitionSoftness: 0.6
  },
  WATER: {
    id: 'water',
    name: 'Agua',
    baseColor: '#3A6EA5',
    secondaryColor: '#2B5D8C',
    textureVariants: [], // Se llenará dinámicamente
    objectDensity: 0.0,
    preferredObjects: [],
    transitionSoftness: 0.9
  }
};

/**
 * Generador principal de terreno avanzado
 */
export class AdvancedTerrainGenerator {
  private config: TerrainConfig;
  private elevationNoise: PerlinNoise;
  private humidityNoise: PerlinNoise;
  private temperatureNoise: PerlinNoise;
  private detailNoise: PerlinNoise;

  // Maps de propiedades del terreno
  private elevationMap: number[][];
  private humidityMap: number[][];
  private temperatureMap: number[][];
  private biomeMap: string[][];
  private biomeInfluenceMap: Map<string, number[][]>;

  constructor(config: TerrainConfig) {
    this.config = config;

    // Inicializar generadores de ruido con diferentes frecuencias
    this.elevationNoise = new PerlinNoise(config.seed);
    this.humidityNoise = new PerlinNoise(config.seed + 1000);
    this.temperatureNoise = new PerlinNoise(config.seed + 2000);
    this.detailNoise = new PerlinNoise(config.seed + 3000);

    this.elevationMap = [];
    this.humidityMap = [];
    this.temperatureMap = [];
    this.biomeMap = [];
    this.biomeInfluenceMap = new Map();
  }

  /**
   * Inicializa los assets dinámicos para todos los biomas usando assets existentes
   */
  private async initializeBiomeAssets(): Promise<void> {
    console.log('🎨 Inicializando assets dinámicos de biomas usando assets reales...');
    
    try {
      // Cargar todos los assets de césped existentes
      const grassAssets = await getAssetsByBiomeType('grass');
      console.log(`📦 Cargados ${grassAssets.length} assets de césped`);
      
      // Distribuir assets de césped entre biomas
      const grassCount = grassAssets.length;
      TERRAIN_BIOMES.GRASSLAND.textureVariants = grassAssets.slice(0, Math.min(grassCount, 12));
      TERRAIN_BIOMES.GARDEN.textureVariants = grassAssets.slice(Math.floor(grassCount/3), Math.min(grassCount, 18));
      TERRAIN_BIOMES.FOREST.textureVariants = grassAssets.slice(0, Math.min(grassCount/2, 8));
      
      // Intentar cargar assets texturizados
      const texturedAssets = await getAssetsByBiomeType('textured');
      if (texturedAssets.length > 0) {
        TERRAIN_BIOMES.FOREST.textureVariants.push(...texturedAssets);
      }
      
      // Para ROCKY, usar assets de roca si están disponibles, sino césped más oscuro
      const rockAssets = await getAssetsByBiomeType('rocks');
      if (rockAssets.length > 0) {
        // Usar IDs de rocas como texturas de fondo rocoso (simulación)
        TERRAIN_BIOMES.ROCKY.textureVariants = grassAssets.slice(-5).concat(['TexturedGrass']);
      } else {
        TERRAIN_BIOMES.ROCKY.textureVariants = grassAssets.slice(-6);
      }
      
      // Para SAND, usar césped claro como arena
      TERRAIN_BIOMES.SAND.textureVariants = grassAssets.slice(Math.floor(grassCount/4), Math.floor(grassCount/2));
      
      // Cargar assets de agua
      const waterAssets = await getAssetsByBiomeType('water');
      TERRAIN_BIOMES.WATER.textureVariants = waterAssets.length > 0 ? waterAssets : ['Water_Middle'];
      
      console.log('✅ Assets dinámicos de biomas inicializados');
      console.log(`   GRASSLAND: ${TERRAIN_BIOMES.GRASSLAND.textureVariants.length} variantes`);
      console.log(`   GARDEN: ${TERRAIN_BIOMES.GARDEN.textureVariants.length} variantes`);
      console.log(`   FOREST: ${TERRAIN_BIOMES.FOREST.textureVariants.length} variantes`);
      console.log(`   ROCKY: ${TERRAIN_BIOMES.ROCKY.textureVariants.length} variantes`);
      console.log(`   SAND: ${TERRAIN_BIOMES.SAND.textureVariants.length} variantes`);
      console.log(`   WATER: ${TERRAIN_BIOMES.WATER.textureVariants.length} variantes`);
      
    } catch (error) {
      console.error('❌ Error inicializando assets de biomas:', error);
      // Fallback con assets básicos
      const fallbackAssets = ['Grass_Middle', 'TexturedGrass', 'cesped1', 'cesped2', 'cesped3'];
      Object.values(TERRAIN_BIOMES).forEach(biome => {
        if (biome.textureVariants.length === 0) {
          biome.textureVariants = fallbackAssets.slice(0, 3);
        }
      });
    }
  }

  /**
   * Genera el terreno completo con todas las capas
   */
  public async generateTerrain(): Promise<TerrainGenerationResult> {
    console.log('🌍 Generando terreno avanzado multi-capa...');

    // 0. Inicializar assets dinámicos
    await this.initializeBiomeAssets();

    // 1. Generar mapas base de propiedades
    this.generatePropertyMaps();

    // 2. Determinar biomas basado en propiedades
    this.generateBiomeMap();

    // 3. Crear mapa de tiles con blend
    const tileMap = this.generateBlendedTileMap();

    // 4. Generar distribución orgánica de objetos
    const objects = await this.generateNaturalObjects();

    // 5. Crear senderos naturales
    const paths = this.generateOrganicPaths();

    // 6. Añadir detalles menores
    const details = this.generateDetailElements();

    console.log(
      `✅ Terreno generado: ${objects.length} objetos, ${paths.length} segmentos de sendero, ${details.length} detalles`
    );

    return {
      tileMap,
      objects: [...objects, ...paths, ...details],
      biomeMap: this.biomeMap,
      metadata: {
        biomes: this.getBiomeStatistics(),
        generation: {
          seed: this.config.seed,
          timestamp: Date.now(),
          version: '2.1.0'
        }
      }
    };
  }

  /**
   * Genera mapas de propiedades del terreno (elevación, humedad, temperatura)
   */
  private generatePropertyMaps(): void {
    const { width, height } = this.config;
    const gridWidth = Math.ceil(width / this.config.tileSize);
    const gridHeight = Math.ceil(height / this.config.tileSize);

    for (let y = 0; y < gridHeight; y++) {
      this.elevationMap[y] = [];
      this.humidityMap[y] = [];
      this.temperatureMap[y] = [];
      this.biomeMap[y] = [];

      for (let x = 0; x < gridWidth; x++) {
        // Coordenadas normalizadas para el ruido
        const nx = x / gridWidth;
        const ny = y / gridHeight;

        // Generar propiedades usando múltiples octavas de ruido
        this.elevationMap[y][x] = this.generateElevation(nx, ny);
        this.humidityMap[y][x] = this.generateHumidity(nx, ny);
        this.temperatureMap[y][x] = this.generateTemperature(nx, ny);
      }
    }
  }

  /**
   * Genera mapa de elevación con múltiples octavas
   */
  private generateElevation(x: number, y: number): number {
    let elevation = 0;
    let amplitude = 1;
    let frequency = 0.01;

    // Múltiples octavas para detalle
    for (let i = 0; i < 4; i++) {
      elevation += this.elevationNoise.generateNoise2D(x * frequency, y * frequency) * amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    // Normalizar a [0, 1]
    return Math.max(0, Math.min(1, (elevation + 1) / 2));
  }

  /**
   * Genera mapa de humedad
   */
  private generateHumidity(x: number, y: number): number {
    const humidity = this.humidityNoise.generateNoise2D(x * 0.008, y * 0.008);
    return Math.max(0, Math.min(1, (humidity + 1) / 2));
  }

  /**
   * Genera mapa de temperatura
   */
  private generateTemperature(x: number, y: number): number {
    const temperature = this.temperatureNoise.generateNoise2D(x * 0.006, y * 0.006);
    return Math.max(0, Math.min(1, (temperature + 1) / 2));
  }

  /**
   * Determina biomas basado en condiciones ambientales
   */
  private generateBiomeMap(): void {
    const { width, height } = this.config;
    const gridWidth = Math.ceil(width / this.config.tileSize);
    const gridHeight = Math.ceil(height / this.config.tileSize);

    // Inicializar mapas de influencia de bioma
    for (const biomeId of Object.keys(TERRAIN_BIOMES)) {
      this.biomeInfluenceMap.set(biomeId, []);
      for (let y = 0; y < gridHeight; y++) {
        this.biomeInfluenceMap.get(biomeId)![y] = [];
      }
    }

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const elevation = this.elevationMap[y][x];
        const humidity = this.humidityMap[y][x];
        const temperature = this.temperatureMap[y][x];

        // Determinar bioma principal basado en condiciones
        const primaryBiome = this.determinePrimaryBiome(elevation, humidity, temperature);
        this.biomeMap[y][x] = primaryBiome;

        // Calcular influencias de biomas para blending
        this.calculateBiomeInfluences(x, y, elevation, humidity, temperature);
      }
    }
  }

  /**
   * Determina el bioma principal basado en condiciones ambientales
   */
  private determinePrimaryBiome(elevation: number, humidity: number, temperature: number): string {
    // Prioridades claras para aspectos dominantes
    if (elevation < 0.18 && humidity > 0.4) {
      return 'WATER';
    }
    if (humidity < 0.28 && temperature > 0.55) {
      return 'SAND';
    }
    if (elevation > 0.7) {
      return 'ROCKY';
    }
    if (humidity > 0.6 && temperature > 0.4) {
      return 'FOREST';
    }
    if (humidity > 0.35 && temperature > 0.5) {
      return 'GARDEN';
    }
    return 'GRASSLAND';
  }

  /**
   * Calcula influencias de biomas para transiciones suaves
   */
  private calculateBiomeInfluences(
    x: number,
    y: number,
    elevation: number,
    humidity: number,
    temperature: number
  ): void {
    for (const [biomeId, biome] of Object.entries(TERRAIN_BIOMES)) {
      let influence = 0;

      switch (biomeId) {
        case 'WATER':
          influence = Math.max(0, (0.2 - elevation) * 5) * humidity;
          break;
        case 'SAND':
          influence = (1 - humidity) * Math.max(0, temperature - 0.5) * (1 - elevation * 0.5);
          break;
        case 'ROCKY':
          influence = Math.max(0, elevation - 0.5) * 2;
          break;
        case 'FOREST':
          influence = humidity * temperature * (1 - Math.abs(elevation - 0.4));
          break;
        case 'GARDEN':
          influence = humidity * (1 - Math.abs(temperature - 0.7)) * (1 - Math.abs(elevation - 0.3));
          break;
        case 'GRASSLAND':
          influence = (1 - humidity) * (1 - Math.abs(elevation - 0.2));
          break;
      }

      influence *= biome.transitionSoftness;
      this.biomeInfluenceMap.get(biomeId)![y][x] = Math.max(0, Math.min(1, influence));
    }
  }

  /**
   * Genera tilemap con blending suave entre biomas
   */
  private generateBlendedTileMap(): TileMapData {
    const { width, height } = this.config;
    const gridWidth = Math.ceil(width / this.config.tileSize);
    const gridHeight = Math.ceil(height / this.config.tileSize);

    const tiles: TileData[][] = [];

    for (let y = 0; y < gridHeight; y++) {
      tiles[y] = [];
      for (let x = 0; x < gridWidth; x++) {
        const primaryBiome = this.biomeMap[y][x];
        const biomeConfig = TERRAIN_BIOMES[primaryBiome];

        // Seleccionar textura base con variación
        const textureVariant = this.selectTextureVariant(biomeConfig, x, y);

        // Calcular color con blending de biomas vecinos
        const blendedColor = this.calculateBlendedColor(x, y);

        // Añadir variación de detalle
        const detailVariation = this.detailNoise.generateNoise2D(x * 0.1, y * 0.1);

        tiles[y][x] = {
          textureId: textureVariant,
          baseColor: blendedColor,
          tint: this.calculateTint(detailVariation),
          rotation: this.shouldRotateTile(x, y) ? Math.floor(Math.random() * 4) * 90 : 0,
          variation: Math.floor(detailVariation * 3) // 0-2 para variaciones de la misma textura
        };
      }
    }

    return {
      tiles,
      tileSize: this.config.tileSize,
      width: gridWidth,
      height: gridHeight
    };
  }

  /**
   * Selecciona variante de textura para un tile
   */
  private selectTextureVariant(biome: Biome, x: number, y: number): string {
    const noise = this.detailNoise.generateNoise2D(x * 0.05, y * 0.05);
    const index = Math.floor(((noise + 1) / 2) * biome.textureVariants.length);
    return biome.textureVariants[Math.min(index, biome.textureVariants.length - 1)];
  }

  /**
   * Calcula color blendado considerando biomas vecinos
   */
  private calculateBlendedColor(x: number, y: number): string {
    const influences = this.getBiomeInfluencesAt(x, y);
    let r = 0,
      g = 0,
      b = 0,
      totalInfluence = 0;

    for (const [biomeId, influence] of influences) {
      if (influence > 0.1) {
        const biome = TERRAIN_BIOMES[biomeId];
        const color = this.hexToRgb(biome.baseColor);
        if (color) {
          r += color.r * influence;
          g += color.g * influence;
          b += color.b * influence;
          totalInfluence += influence;
        }
      }
    }

    if (totalInfluence > 0) {
      r = Math.round(r / totalInfluence);
      g = Math.round(g / totalInfluence);
      b = Math.round(b / totalInfluence);
      return `rgb(${r}, ${g}, ${b})`;
    }

    return TERRAIN_BIOMES[this.biomeMap[y][x]].baseColor;
  }

  /**
   * Obtiene influencias de biomas en una posición
   */
  private getBiomeInfluencesAt(x: number, y: number): [string, number][] {
    const influences: [string, number][] = [];

    for (const [biomeId, influenceMap] of this.biomeInfluenceMap) {
      const influence = influenceMap[y]?.[x] || 0;
      influences.push([biomeId, influence]);
    }

    return influences.sort((a, b) => b[1] - a[1]);
  }

  /**
   * Calcula tint basado en variación de detalle
   */
  private calculateTint(detailNoise: number): string {
    const brightness = 0.95 + detailNoise * 0.1; // ±5% variación de brillo
    const tintValue = Math.round(255 * brightness);
    return `rgb(${tintValue}, ${tintValue}, ${tintValue})`;
  }

  /**
   * Determina si un tile debe rotarse para variación
   */
  private shouldRotateTile(x: number, y: number): boolean {
    const noise = this.detailNoise.generateNoise2D(x * 0.03, y * 0.03);
    return noise > 0.3; // 35% de tiles rotados
  }

  /**
   * Genera objetos naturales usando distribución orgánica
   */
  private async generateNaturalObjects(): Promise<MapElement[]> {
    console.log('🌱 Generando distribución orgánica de objetos...');

    const objects: MapElement[] = [];
    const { width, height } = this.config;
    const gridWidth = Math.ceil(width / this.config.tileSize);
    const gridHeight = Math.ceil(height / this.config.tileSize);

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const biomeId = this.biomeMap[y][x];
        if (biomeId === 'WATER') continue; // No objetos en agua
        const biome = TERRAIN_BIOMES[biomeId];

        // Densidad base modificada por elevación y humedad
        let density = biome.objectDensity * 0.9; // menos clutter
        if (biomeId === 'SAND') density *= 0.5; // más vacío en arena
        density *= this.calculateDensityModifier(x, y);

        if (Math.random() < density) {
          const cellObjects = await this.generateObjectsForCell(x, y, biome);
          objects.push(...cellObjects);
        }
      }
    }

    console.log(`✅ Generados ${objects.length} objetos naturales`);
    return objects;
  }

  /**
   * Calcula modificador de densidad basado en condiciones locales
   */
  private calculateDensityModifier(x: number, y: number): number {
    const elevation = this.elevationMap[y][x];
    const humidity = this.humidityMap[y][x];

    // Reducir densidad en elevaciones extremas y muy baja humedad
    let modifier = 1.0;

    if (elevation > 0.8) modifier *= 0.3;
    else if (elevation > 0.6) modifier *= 0.7;

    if (humidity < 0.2) modifier *= 0.5;
    else if (humidity > 0.8) modifier *= 1.2;

    return modifier;
  }

  /**
   * Genera objetos para una celda específica
   */
  private async generateObjectsForCell(x: number, y: number, biome: Biome): Promise<MapElement[]> {
    const objects: MapElement[] = [];
    const cellX = x * this.config.tileSize;
    const cellY = y * this.config.tileSize;

    // Seleccionar objeto basado en probabilidades del bioma
    for (const objConfig of biome.preferredObjects) {
      if (Math.random() < objConfig.spawnChance) {
        const clusterSize = this.randomBetween(
          objConfig.clusterSize.min,
          objConfig.clusterSize.max
        );

        // Generar cluster de objetos
        for (let i = 0; i < clusterSize; i++) {
          const obj = await this.createVariedObject(objConfig, cellX, cellY);
          if (obj) objects.push(obj);
        }
      }
    }

    return objects;
  }

  /**
   * Crea objeto con variaciones visuales usando assets dinámicos
   */
  private async createVariedObject(config: BiomeObject, baseX: number, baseY: number): Promise<MapElement | null> {
    // Posición con dispersión natural dentro de la celda
    const offsetX = this.gaussianRandom() * this.config.tileSize * 0.3;
    const offsetY = this.gaussianRandom() * this.config.tileSize * 0.3;

    const x = baseX + this.config.tileSize / 2 + offsetX;
    const y = baseY + this.config.tileSize / 2 + offsetY;

    // Variaciones
    const scale = this.randomBetween(config.sizeVariation.min, config.sizeVariation.max);
    const rotation = config.rotationVariation ? Math.random() * 360 : 0;
    const flipX = Math.random() < 0.5;

    // Intentar obtener asset dinámico del tipo apropiado
    let textureId = config.type;
    try {
      const asset = await this.getDynamicAssetForObjectType(config.type);
      if (asset) textureId = asset.id;
    } catch (error) {
      console.warn(`Error obteniendo asset dinámico para ${config.type}:`, error);
    }

    return {
      id: `natural_${config.type}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      type: this.mapObjectTypeToMapElementType(config.type),
      position: { x: Math.round(x), y: Math.round(y) },
      size: {
        width: Math.round(32 * scale),
        height: Math.round(32 * scale)
      },
      color: config.colorTint || this.generateObjectColor(config.type),
      metadata: {
        rotation,
        flipX,
        weathering: Math.random() * 0.3,
        naturalVariation: true,
        textureId // Incluir el ID de textura dinámico
      }
    };
  }

  /**
   * Obtiene asset dinámico para un tipo de objeto usando categorías existentes
   */
  private async getDynamicAssetForObjectType(objectType: string): Promise<Asset | null> {
    try {
      switch (objectType) {
        case 'tree_large':
        case 'tree_medium': {
          const trees = await assetManager.loadAssetsBySubtype('NATURAL_ELEMENTS', 'trees');
          return trees.length > 0 ? trees[Math.floor(Math.random() * trees.length)] : null;
        }
        case 'rock_large':
        case 'rock_medium': {
          const rocks = await assetManager.loadAssetsBySubtype('NATURAL_ELEMENTS', 'rocks');
          return rocks.length > 0 ? rocks[Math.floor(Math.random() * rocks.length)] : null;
        }
        case 'small_bush':
        case 'fern': {
          const bushes = await assetManager.loadAssetsBySubtype('NATURAL_ELEMENTS', 'bushes');
          return bushes.length > 0 ? bushes[Math.floor(Math.random() * bushes.length)] : null;
        }
        case 'wildflower':
        case 'flower_bed': {
          // Usar decoraciones o plantas del entorno
          const decorations = await assetManager.loadAssetsBySubtype('ENVIRONMENTAL_OBJECTS', 'decorations');
          return decorations.length > 0 ? decorations[Math.floor(Math.random() * decorations.length)] : null;
        }
        case 'hedge':
        case 'garden_stone': {
          // Usar muebles de jardín o elementos estructurales
          const furniture = await assetManager.loadAssetsBySubtype('ENVIRONMENTAL_OBJECTS', 'furniture');
          return furniture.length > 0 ? furniture[Math.floor(Math.random() * furniture.length)] : null;
        }
        case 'pebbles': {
          // Usar contenedores pequeños como simulación de guijarros
          const containers = await assetManager.loadAssetsBySubtype('ENVIRONMENTAL_OBJECTS', 'containers');
          return containers.length > 0 ? containers[Math.floor(Math.random() * containers.length)] : null;
        }
        case 'mushroom': {
          // Usar elementos naturales variados
          const logs = await assetManager.loadAssetsBySubtype('NATURAL_ELEMENTS', 'logs');
          return logs.length > 0 ? logs[Math.floor(Math.random() * logs.length)] : null;
        }
        case 'grass_tuft': {
          // Usar elementos de césped como matas
          const randomGrass = await assetManager.getRandomAssetsFromCategory('TERRAIN_TILES', 1);
          return randomGrass.length > 0 ? randomGrass[0] : null;
        }
        default: {
          // Fallback genérico
          const randomEnv = await assetManager.getRandomAssetsFromCategory('ENVIRONMENTAL_OBJECTS', 1);
          return randomEnv.length > 0 ? randomEnv[0] : null;
        }
      }
    } catch (error) {
      console.warn(`Error cargando asset dinámico para ${objectType}:`, error);
      return null;
    }
  }

  /**
   * Genera senderos orgánicos entre puntos de interés
   */
  private generateOrganicPaths(): MapElement[] {
    console.log('🛤️ Generando senderos orgánicos...');

    const paths: MapElement[] = [];

    // Encontrar puntos de interés (centros de biomas diferentes)
    const interestPoints = this.findInterestPoints();

    // Generar senderos entre puntos usando curvas naturales
    for (let i = 0; i < interestPoints.length - 1; i++) {
      const start = interestPoints[i];
      const end = interestPoints[i + 1];

      const pathSegments = this.generateCurvedPath(start, end);
      paths.push(...pathSegments);
    }

    console.log(`✅ Generados ${paths.length} segmentos de sendero`);
    return paths;
  }

  /**
   * Encuentra puntos de interés en el mapa
   */
  private findInterestPoints(): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = [];
    const { width, height } = this.config;

    // Añadir algunos puntos distribuidos naturalmente
    const numPoints = 4 + Math.floor(Math.random() * 3);

    for (let i = 0; i < numPoints; i++) {
      const x = (width / numPoints) * i + Math.random() * (width / numPoints);
      const y = height * 0.2 + Math.random() * (height * 0.6);

      points.push({ x: Math.round(x), y: Math.round(y) });
    }

    return points;
  }

  /**
   * Genera sendero curvo entre dos puntos
   */
  private generateCurvedPath(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ): MapElement[] {
    const segments: MapElement[] = [];
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const numSegments = Math.floor(distance / 20); // Segmento cada 20 píxeles

    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments;

      // Interpolación con curva Bézier para naturalidad
      const curveStrength = 0.3;
      const midX = (start.x + end.x) / 2 + (Math.random() - 0.5) * distance * curveStrength;
      const midY = (start.y + end.y) / 2 + (Math.random() - 0.5) * distance * curveStrength;

      const x = this.quadraticBezier(start.x, midX, end.x, t);
      const y = this.quadraticBezier(start.y, midY, end.y, t);

      segments.push({
        id: `path_segment_${i}_${Date.now()}`,
        type: 'decoration',
        position: { x: Math.round(x), y: Math.round(y) },
        size: { width: 8 + Math.random() * 4, height: 8 + Math.random() * 4 },
        color: '#8B7355',
        metadata: { isPath: true }
      });
    }

    return segments;
  }

  /**
   * Genera elementos de detalle menores
   */
  private generateDetailElements(): MapElement[] {
    console.log('✨ Añadiendo detalles menores...');

    const details: MapElement[] = [];
    const { width, height } = this.config;
    const numDetails = Math.floor((width * height) / 5000); // 1 detalle cada 5000 píxeles²

    for (let i = 0; i < numDetails; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;

      const detail = this.createDetailElement(x, y);
      if (detail) details.push(detail);
    }

    console.log(`✅ Añadidos ${details.length} elementos de detalle`);
    return details;
  }

  /**
   * Crea elemento de detalle individual
   */
  private createDetailElement(x: number, y: number): MapElement | null {
    const detailTypes = ['small_stone', 'tiny_flower', 'grass_blade', 'twig', 'leaf'];
    const type = detailTypes[Math.floor(Math.random() * detailTypes.length)];

    return {
      id: `detail_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      type: 'decoration',
      position: { x: Math.round(x), y: Math.round(y) },
      size: {
        width: 2 + Math.random() * 4,
        height: 2 + Math.random() * 4
      },
      color: this.generateDetailColor(type),
      metadata: { isDetail: true, detailType: type }
    };
  }

  // Funciones auxiliares
  private randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private gaussianRandom(): number {
    // Box-Muller transform para distribución gaussiana
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  private quadraticBezier(p0: number, p1: number, p2: number, t: number): number {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  private mapObjectTypeToMapElementType(type: string): MapElement['type'] {
    const mapping: Record<string, MapElement['type']> = {
      tree_large: 'obstacle',
      tree_medium: 'obstacle',
      rock_large: 'obstacle',
      rock_medium: 'obstacle',
      wildflower: 'decoration',
      flower_bed: 'decoration',
      small_bush: 'decoration',
      grass_tuft: 'decoration',
      fern: 'decoration',
      mushroom: 'decoration',
      hedge: 'decoration',
      garden_stone: 'decoration',
      pebbles: 'decoration'
    };

    return mapping[type] || 'decoration';
  }

  private generateObjectColor(type: string): string {
    // Colores más naturales y variados para diferentes tipos de objetos
    const colors: Record<string, string[]> = {
      tree_large: ['#2D4A32', '#3A5C3F', '#1E3A23', '#4B5D4A', '#3D5A41'],
      tree_medium: ['#2D4A32', '#3A5C3F', '#1E3A23', '#4B5D4A'],
      wildflower: ['#FF6B9D', '#FFD93D', '#6BCF7F', '#9B59B6', '#FF8C42', '#A8E6CF'],
      rock_large: ['#6B6B6B', '#7A7A7A', '#5A5A5A', '#8B8B8B', '#505050'],
      rock_medium: ['#6B6B6B', '#7A7A7A', '#5A5A5A', '#8B8B8B'],
      flower_bed: ['#FF6B9D', '#FFD93D', '#6BCF7F', '#FF8C69', '#DDA0DD'],
      small_bush: ['#4A7C59', '#5E8B6B', '#228B22', '#32CD32'],
      grass_tuft: ['#4A7C59', '#5E8B6B', '#3E6B4C', '#90EE90', '#7CFC00'],
      hedge: ['#228B22', '#32CD32', '#006400', '#4A7C59'],
      garden_stone: ['#A0A0A0', '#808080', '#696969', '#778899'],
      pebbles: ['#C0C0C0', '#A9A9A9', '#808080', '#D3D3D3'],
      mushroom: ['#8B4513', '#A0522D', '#CD853F', '#D2B48C'],
      // Nuevos tipos basados en assets existentes
      logs: ['#8B4513', '#A0522D', '#CD853F', '#DEB887'],
      cliffs: ['#696969', '#708090', '#2F4F4F', '#556B2F']
    };

    const typeColors = colors[type] || ['#64748b', '#87CEEB', '#98FB98', '#F0E68C'];
    return typeColors[Math.floor(Math.random() * typeColors.length)];
  }

  private generateDetailColor(type: string): string {
    const colors: Record<string, string> = {
      small_stone: '#8B8B8B',
      tiny_flower: '#FFB6C1',
      grass_blade: '#228B22',
      twig: '#8B4513',
      leaf: '#32CD32'
    };

    return colors[type] || '#64748b';
  }

  private getBiomeStatistics(): Record<string, number> {
    const stats: Record<string, number> = {};
    let total = 0;

    for (const row of this.biomeMap) {
      for (const biome of row) {
        stats[biome] = (stats[biome] || 0) + 1;
        total++;
      }
    }

    // Convertir a porcentajes
    for (const biome in stats) {
      stats[biome] = Math.round((stats[biome] / total) * 100);
    }

    return stats;
  }
}

// Interfaces de resultado
export interface TerrainGenerationResult {
  tileMap: TileMapData;
  objects: MapElement[];
  biomeMap: string[][];
  metadata: {
    biomes: Record<string, number>;
    generation: {
      seed: number;
      timestamp: number;
      version: string;
    };
  };
}

export interface TileMapData {
  tiles: TileData[][];
  tileSize: number;
  width: number;
  height: number;
}

export interface TileData {
  textureId: string;
  baseColor: string;
  tint: string;
  rotation: number;
  variation: number;
}

/**
 * Función principal para integración con el sistema existente
 */
export async function generateAdvancedTerrain(
  width: number,
  height: number,
  seed?: number,
  options: Partial<TerrainConfig> = {}
): Promise<TerrainGenerationResult> {
  const config: TerrainConfig = {
    width,
    height,
    seed: seed || Date.now(),
    tileSize: 32,
    biomeBlendRadius: 3,
    detailLevel: 1,
    ...options
  };

  const generator = new AdvancedTerrainGenerator(config);
  return await generator.generateTerrain();
}
