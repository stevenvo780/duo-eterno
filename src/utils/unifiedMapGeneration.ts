/**
 * 🗺️ SISTEMA UNIFICADO DE GENERACIÓN DE MAPAS
 *
 * Sistema principal que combina todos los algoritmos de generación existentes
 * y utiliza el asset manager mejorado con carpetas descriptivas
 */

import type { Zone, MapElement } from '../types';
import { assetManager } from './assetManager';
import { generateOrganicProceduralMap } from './organicMapGeneration';
import { createDefaultZones, createDefaultMapElements } from './mapGeneration';

export interface UnifiedMapConfig {
  width: number;
  height: number;
  seed?: string;
  algorithm: 'default' | 'organic';
  theme: 'modern' | 'rustic' | 'ecological' | 'urban';
  density: number; // 0.1 - 1.0
  useRealAssets: boolean;
  preloadAssets: boolean;
}

export interface MapGenerationResult {
  zones: Zone[];
  mapElements: MapElement[];
  assetStats: {
    loaded: number;
    categories: Record<string, number>;
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

    switch (this.config.algorithm) {
      case 'organic':
        ({ zones, mapElements } = this.generateOrganicMap());
        break;
      default:
        ({ zones, mapElements } = this.generateDefaultMap());
    }

    // Aplicar assets reales si está habilitado
    if (this.config.useRealAssets) {
      mapElements = await this.applyRealAssets(mapElements);
    }

    const stats = assetManager.getStats();
    return {
      zones,
      mapElements,
      assetStats: {
        loaded: stats.totalLoaded,
        categories: stats.categories
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
        ? (await assetManager.searchAssetsByPattern(searchPattern, folderName))[0]
        : await assetManager.getRandomAssetFromFolder(folderName);

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
   * Filtrar elementos por tipo
   */
  private filterElementsByType(elements: MapElement[], types: string[]): MapElement[] {
    return elements.filter(element => types.includes(element.type));
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
