/**
 * Generación unificada de mapas con terreno, decoraciones y objetos.
 */

import type { Zone, MapElement, ZoneType } from '../types';
import { assetManager } from './modernAssetManager';
import { generateOrganicProceduralMap } from './organicMapGeneration';
import { createDefaultZones, createDefaultMapElements } from './mapGeneration';

export interface UnifiedMapConfig {
  width: number;
  height: number;
  seed?: string;
  algorithm: 'default' | 'organic' | 'grid';
  theme: 'modern' | 'rustic' | 'ecological' | 'urban';
  density: number; // 0.1 - 1.0
  useRealAssets: boolean;
  preloadAssets: boolean;
  tileSize: number; // Tamaño de cada tile del terreno
  generateTerrain: boolean; // Si generar malla de terreno base
}

export interface TerrainTile {
  x: number;
  y: number;
  assetId: string;
  type: 'grass' | 'stone' | 'water' | 'path';
  variant?: number;
}

export interface MapGenerationResult {
  zones: Zone[];
  mapElements: MapElement[];
  terrainTiles: TerrainTile[]; // Nueva propiedad para tiles de terreno
  assetStats: {
    loaded: number;
    categories: Record<string, number>;
    terrainTiles: number;
  };
}

/**
 * Sistema unificado de generación de mapas
 */
export class UnifiedMapGenerator {
  private config: UnifiedMapConfig;

  constructor(config: Partial<UnifiedMapConfig> = {}) {
    this.config = {
      width: 1000,
      height: 600,
      seed: Date.now().toString(36),
      algorithm: 'organic',
      theme: 'modern',
      density: 0.7,
      useRealAssets: true,
      preloadAssets: true,
      tileSize: 32,
      generateTerrain: true,
      ...config
    };
  }

  /**
   * Generar mapa usando el algoritmo seleccionado
   */
  async generateMap(): Promise<MapGenerationResult> {
    console.log(`🗺️ Generando mapa usando algoritmo: ${this.config.algorithm}`);

    // Precargar assets si está habilitado
    if (this.config.preloadAssets) {
      await this.preloadRequiredAssets();
    }

    let zones: Zone[];
    let mapElements: MapElement[];
    let terrainTiles: TerrainTile[] = [];

    switch (this.config.algorithm) {
      case 'organic':
        ({ zones, mapElements } = this.generateOrganicMap());
        break;
      case 'grid':
        ({ zones, mapElements } = this.generateGridMap());
        break;
      default:
        ({ zones, mapElements } = this.generateDefaultMap());
    }

    // Generar terreno base si está habilitado
    if (this.config.generateTerrain) {
      terrainTiles = await this.generateTerrainTiles();
    }

    // Aplicar assets reales si está habilitado
    if (this.config.useRealAssets) {
      mapElements = await this.applyRealAssets(mapElements);
    }

    const stats = assetManager.getStats();
    return {
      zones,
      mapElements,
      terrainTiles,
      assetStats: {
        loaded: stats.totalLoaded,
        categories: stats.categories,
        terrainTiles: terrainTiles.length
      }
    };
  }

  /**
   * Generar mapa orgánico usando el sistema existente
   */
  private generateOrganicMap(): { zones: Zone[]; mapElements: MapElement[] } {
    return generateOrganicProceduralMap(this.config.seed, {
      theme: this.mapThemeToOrganic(this.config.theme),
      useVoronoi: true,
      organicStreets: true,
      densityVariation: this.config.density,
      naturalClustering: true
    });
  }


  /**
   * Generar mapa por defecto
   */
  private generateDefaultMap(): { zones: Zone[]; mapElements: MapElement[] } {
    return {
      zones: createDefaultZones(),
      mapElements: createDefaultMapElements()
    };
  }

  /**
   * Generar mapa en cuadrícula regular
   */
  private generateGridMap(): { zones: Zone[]; mapElements: MapElement[] } {
    const zones: Zone[] = [];
    const mapElements: MapElement[] = [];
    
    // Crear una cuadrícula simple de zonas
    const gridCols = 4;
    const gridRows = 3;
    const zoneWidth = this.config.width / gridCols;
    const zoneHeight = this.config.height / gridRows;
    
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const zoneId = `zone_${row}_${col}`;
        const zoneTypes: ZoneType[] = ['rest', 'food', 'play', 'social'];
        const zoneType = zoneTypes[Math.floor(Math.random() * zoneTypes.length)];
        
        zones.push({
          id: zoneId,
          name: `${zoneType} ${row}-${col}`,
          type: zoneType,
          bounds: {
            x: col * zoneWidth,
            y: row * zoneHeight,
            width: zoneWidth,
            height: zoneHeight
          },
          color: this.getZoneColor(zoneType),
          effects: { happiness: 10 },
          attractiveness: 50
        });

        // Agregar algunos elementos en la zona
        const elementsInZone = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < elementsInZone; i++) {
          const elementType = `${zoneType}_zone` as MapElement['type'];
          mapElements.push({
            id: `element_${zoneId}_${i}`,
            type: elementType,
            position: {
              x: col * zoneWidth + Math.random() * (zoneWidth - 64),
              y: row * zoneHeight + Math.random() * (zoneHeight - 64)
            },
            size: { width: 32, height: 32 },
            color: this.getZoneColor(zoneType),
            metadata: { zone: zoneId }
          });
        }
      }
    }
    
    return { zones, mapElements };
  }

  /**
   * Generar malla de terreno completa con tiles
   */
  private async generateTerrainTiles(): Promise<TerrainTile[]> {
    console.log('🌱 Generando terreno base...');
    
    const tiles: TerrainTile[] = [];
    const tilesX = Math.ceil(this.config.width / this.config.tileSize);
    const tilesY = Math.ceil(this.config.height / this.config.tileSize);
    
    // Cargar assets de terreno
    await assetManager.loadAssetsByFolderName('terrain_tiles');
    const grassAssets = assetManager.getAssetsByType('terrain_tiles');
    
    if (grassAssets.length === 0) {
      console.warn('⚠️ No se encontraron assets de terreno');
      return tiles;
    }

    // Generar noise para variación de terreno
    const noiseScale = 0.1;
    
    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        const worldX = x * this.config.tileSize;
        const worldY = y * this.config.tileSize;
        
        // Usar noise simple para determinar tipo de terreno
        const noiseValue = this.simpleNoise(x * noiseScale, y * noiseScale);
        
        let tileType: 'grass' | 'stone' | 'water' | 'path' = 'grass';
        let assetId = '';
        
        if (noiseValue > 0.7) {
          tileType = 'water';
          // Intentar usar assets de agua si están disponibles
          const waterAssets = assetManager.getAssetsByType('water');
          if (waterAssets.length > 0) {
            assetId = waterAssets[Math.floor(Math.random() * waterAssets.length)].id || 'default-water';
          } else {
            assetId = 'default-water';
          }
        } else if (noiseValue < -0.3) {
          tileType = 'stone';
          // Usar un asset de césped diferente para stone
          assetId = grassAssets[Math.floor(Math.random() * Math.min(5, grassAssets.length))]?.id || 'default-grass';
        } else {
          tileType = 'grass';
          // Usar variaciones de césped
          assetId = grassAssets[Math.floor(Math.random() * grassAssets.length)]?.id || 'default-grass';
        }
        
        // Si no se encontró asset específico, usar césped por defecto
        if (!assetId && grassAssets.length > 0) {
          assetId = grassAssets[Math.floor(Math.random() * grassAssets.length)]?.id || 'default-grass';
        }
        
        if (assetId) {
          tiles.push({
            x: worldX,
            y: worldY,
            assetId,
            type: tileType,
            variant: Math.floor(Math.random() * 4)
          });
        }
      }
    }
    
    console.log(`✅ Generados ${tiles.length} tiles de terreno`);
    return tiles;
  }

  /**
   * Generador de noise simple para variación de terreno
   */
  private simpleNoise(x: number, y: number): number {
    const seed = this.stringToSeed(this.config.seed || '');
    return Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453 % 1 * 2 - 1;
  }

  /**
   * Convertir string a seed numérico
   */
  private stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Obtener color de zona según tipo
   */
  private getZoneColor(zoneType: string): string {
    const colors: Record<string, string> = {
      rest: '#e8f5e8',
      rest_zone: '#e8f5e8',
      food: '#fff2e8',
      food_zone: '#fff2e8',
      play: '#e8f0ff',
      play_zone: '#e8f0ff',
      social: '#ffe8f5',
      social_zone: '#ffe8f5',
      work: '#f0f8ff',
      work_zone: '#f0f8ff',
      comfort: '#fff8e1',
      comfort_zone: '#fff8e1',
      obstacle: '#f0f0f0',
      decoration: '#f9f9f9'
    };
    return colors[zoneType] || '#f5f5f5';
  }

  /**
   * Precargar assets necesarios basados en la configuración
   */
  private async preloadRequiredAssets(): Promise<void> {
    console.log('🎨 Precargando assets necesarios...');

    // Precargar assets esenciales
    await assetManager.preloadEssentialAssets();

    // Precargar assets específicos por categorías
    const categoriesToPreload = [
      'terrain_tiles',
      'structures',
      'environmental_objects',
      'natural_elements'
    ];

    await assetManager.preloadEssentialAssetsByFolders(categoriesToPreload);

    console.log('✅ Precarga de assets completada');
  }

  /**
   * Aplicar assets reales a los elementos del mapa
   */
  private async applyRealAssets(mapElements: MapElement[]): Promise<MapElement[]> {
    const enhancedElements: MapElement[] = [];

    for (const element of mapElements) {
      const enhancedElement = await this.enhanceElementWithRealAsset(element);
      enhancedElements.push(enhancedElement);
    }

    return enhancedElements;
  }

  /**
   * Mejorar un elemento con assets reales
   */
  private async enhanceElementWithRealAsset(element: MapElement): Promise<MapElement> {
    let folderName: string;
    let searchPattern: string;

    // Mapear tipo de elemento a carpeta y patrón de búsqueda
    switch (element.type) {
      case 'obstacle':
        if (Math.random() > 0.5) {
          folderName = 'natural_elements';
          searchPattern = Math.random() > 0.5 ? 'tree' : 'rock';
        } else {
          folderName = 'structures';
          searchPattern = 'house';
        }
        break;
      case 'decoration':
        folderName = 'environmental_objects';
        searchPattern = Math.random() > 0.5 ? 'lampara' : 'silla';
        break;
      case 'rest_zone':
        folderName = 'furniture_objects';
        searchPattern = 'chest';
        break;
      case 'food_zone':
        folderName = 'environmental_objects';
        searchPattern = 'furniture';
        break;
      case 'social_zone':
        folderName = 'environmental_objects';
        searchPattern = 'bench';
        break;
      default:
        folderName = 'environmental_objects';
        searchPattern = '';
    }

    try {
      // Buscar asset apropiado
      const asset = searchPattern
        ? assetManager.searchAssets(searchPattern)?.[0]
        : assetManager.getAssetsByType(folderName)?.[0];

      if (asset) {
        return {
          ...element,
          metadata: {
            ...element.metadata,
            assetId: asset.id
          },
          size: { width: asset.size, height: asset.size }
        };
      }
    } catch (error) {
      console.warn(`⚠️ Error aplicando asset real a elemento ${element.id}:`, error);
    }

    return element;
  }

  /**
   * Mapear tema a formato orgánico
   */
  private mapThemeToOrganic(theme: string): 'MODERN' | 'RUSTIC' | 'ECOLOGICAL' | 'URBAN' {
    const mapping: Record<string, 'MODERN' | 'RUSTIC' | 'ECOLOGICAL' | 'URBAN'> = {
      modern: 'MODERN',
      rustic: 'RUSTIC',
      ecological: 'ECOLOGICAL',
      urban: 'URBAN'
    };
    return mapping[theme] || 'MODERN';
  }

}

/**
 * Función principal para generar mapas unificados
 */
export async function generateUnifiedMap(
  config: Partial<UnifiedMapConfig> = {}
): Promise<MapGenerationResult> {
  const generator = new UnifiedMapGenerator(config);
  return await generator.generateMap();
}

/**
 * Función helper para generar mapas rápidos con configuración preestablecida
 */
export async function generateQuickMap(
  type: 'small' | 'medium' | 'large' = 'medium'
): Promise<MapGenerationResult> {
  const configs = {
    small: { width: 600, height: 400, density: 0.5, algorithm: 'default' as const },
    medium: { width: 1000, height: 600, density: 0.7, algorithm: 'organic' as const },
    large: { width: 1400, height: 800, density: 0.9, algorithm: 'organic' as const }
  };

  return await generateUnifiedMap(configs[type]);
}
