/**
 * 🎨 SISTEMA AVANZADO DE GESTIÓN DE ASSETS
 *
 * Sistema híbrido que combina:
 * 1. Assets tradicionales (tiles) para compatibilidad
 * 2. Sistema dinámico basado en manifest generado automáticamente
 * 3. Carga automática por nombre de carpeta
 */

import { spriteAnimationManager } from './spriteAnimationManager';

export interface Asset {
  id: string;
  name: string;
  category: 'terrain_tiles' | 'structures' | 'furniture_objects' | 'natural_elements' | 'infrastructure' | 'water' | 'environmental_objects' | 'animated_entities' | 'ui_icons' | 'consumable_items' | 'dialogs';
  subtype?: string;
  image: HTMLImageElement;
  size: number;
  path: string;
}

export interface AssetCategory {
  [key: string]: Asset[];
}

// Mapeo de categorías dinámicas a tipos estáticos
const DYNAMIC_CATEGORY_MAPPING = {
  'terrain_tiles': 'terrain_tiles',
  'structures': 'structures', 
  'natural_elements': 'natural_elements',
  'infrastructure': 'infrastructure',
  'water': 'water',
  'animated_entities': 'animated_entities',
  'ui_icons': 'environmental_objects',
  'consumable_items': 'environmental_objects',
  'environmental_objects': 'environmental_objects',
  'furniture_objects': 'furniture_objects',
  'dialogs': 'dialogs'
} as const;

// Assets organizados por las nuevas carpetas descriptivas
export const ASSET_CATEGORIES = {
  // Terreno base - terrain_tiles
  TERRAIN_TILES: {
    grass: ['cesped1', 'cesped2', 'cesped3', 'cesped4', 'cesped5'],
    dirt: ['Grass_Middle', 'TexturedGrass'],
    stone: ['tile_0533_suelo_piedra', 'tile_0545_suelo_piedra'],
    sand: ['tile_0547_suelo_arena'],
    earth: ['tile_0548_suelo_tierra']
  },

  // Edificios - structures  
  STRUCTURES: {
    houses: ['House', 'House_Hay_1', 'House_Hay_2', 'House_Hay_3', 'House_Hay_4_Purple'],
    walls: ['muros1', 'muros2', 'muros3', 'CityWall_Gate_1'],
    fences: ['Fences'],
    wells: ['Well_Hay_1'],
    glass: ['vidrio']
  },

  // Muebles - furniture_objects
  FURNITURE_OBJECTS: {
    storage: ['Barrel_Small_Empty', 'Basket_Empty', 'Chest', 'Chests_001', 'Chests_002'],
    containers: ['Crate_Large_Empty', 'Crate_Medium_Closed'],
    waste: ['basuras2', 'basuras3', 'basuras4', 'basuras_calle2', 'basuras_calle3'],
    bottles: ['botellas2', 'botellas3'],
    boxes: ['cajas2', 'cajas3'],
    windows: ['ventana1', 'ventana2', 'ventana3', 'ventana4', 'ventana5']
  },

  // Naturaleza - natural_elements
  NATURAL_ELEMENTS: {
    trees: ['Oak_Tree', 'Tree_Emerald_1', 'Tree_Emerald_2', 'Tree_Emerald_3'],
    bushes: ['Bush_Emerald_1', 'Bush_Emerald_2', 'Bush_Emerald_3'],
    rocks: ['Rock_Brown_1', 'Rock_Brown_2', 'Rock_Brown_4', 'Rock_Brown_6'],
    cliffs: ['Cliff_001_001', 'Cliff_001_002'],
    logs: ['troncos1', 'troncos2', 'troncos3']
  },

  // Infraestructura - infrastructure
  INFRASTRUCTURE: {
    paths: ['Path_Middle', 'FarmLand_Tile']
  },

  // Agua - water
  WATER: {
    tiles: ['Water_Middle', 'tile_0198', 'tile_0230']
  },

  // Objetos ambientales - environmental_objects
  ENVIRONMENTAL_OBJECTS: {
    decorations: ['Banner_Stick_1_Purple', 'BulletinBoard_1', 'Sign_1', 'Sign_2'],
    furniture: ['Bench_1', 'Bench_3', 'Table_Medium_1', 'silla'],
    lighting: ['LampPost_3', 'lamparas1', 'lamparas2', 'lamparas3'],
    poles: ['poste1', 'poste2', 'poste3', 'poste4'],
    clothing: ['ropas_tendidas1', 'ropas_tendidas2', 'ropas_tendidas3'],
    umbrellas: ['sombrilla1', 'sombrilla2', 'sombrilla3'],
    waste: ['basuras1', 'basuras_calle1', 'botellas1', 'cajas1'],
    street_furniture: ['sillas_de_calle1', 'sillas_de_calle2', 'sillas_de_calle3']
  }
} as const;

export class AssetManager {
  private assets: Map<string, Asset> = new Map();
  private categorizedAssets: AssetCategory = {};
  private loadingPromises: Map<string, Promise<Asset>> = new Map();
  private dynamicAssetsLoaded: Set<string> = new Set();

  constructor() {
    this.initializeCategories();
  }

  /**
   * Cargar assets dinámicamente por nombre de carpeta
   */
  async loadAssetsByFolderName(folderName: string): Promise<Asset[]> {
    if (this.dynamicAssetsLoaded.has(folderName)) {
      return this.getAssetsByType(folderName);
    }

    try {
      // Usar el sprite animation manager para obtener assets de la carpeta
      const folderAssets = await spriteAnimationManager.loadAssetsByFolder(folderName);
      const assets: Asset[] = [];

      // Convertir sprites estáticos a assets
      for (const sprite of folderAssets.sprites) {
        const asset: Asset = {
          id: sprite.asset.id,
          name: sprite.asset.name,
          category: this.mapDynamicCategory(folderName),
          image: sprite.image,
          size: 32, // tamaño por defecto
          path: sprite.asset.path
        };
        
        this.assets.set(asset.id, asset);
        assets.push(asset);
      }

      // Categorizar los assets cargados
      this.categorizeAssetsByFolder(assets, folderName);
      this.dynamicAssetsLoaded.add(folderName);

      console.log(`✅ Cargados ${assets.length} assets dinámicos de la carpeta: ${folderName}`);
      return assets;
    } catch (error) {
      console.warn(`⚠️ Error cargando assets de la carpeta ${folderName}:`, error);
      return [];
    }
  }

  /**
   * Obtener asset aleatorio de una carpeta específica
   */
  async getRandomAssetFromFolder(folderName: string): Promise<Asset | null> {
    const assets = await this.loadAssetsByFolderName(folderName);
    if (assets.length === 0) return null;

    const index = Math.floor(Math.random() * assets.length);
    return assets[index];
  }

  /**
   * Buscar assets por patrón de nombre
   */
  async searchAssetsByPattern(pattern: string, folderName?: string): Promise<Asset[]> {
    const results: Asset[] = [];
    const searchTerm = pattern.toLowerCase();

    if (folderName) {
      const folderAssets = await this.loadAssetsByFolderName(folderName);
      results.push(...folderAssets.filter(asset => 
        asset.id.toLowerCase().includes(searchTerm) ||
        asset.name.toLowerCase().includes(searchTerm)
      ));
    } else {
      // Buscar en todos los assets cargados
      for (const asset of this.assets.values()) {
        if (asset.id.toLowerCase().includes(searchTerm) ||
            asset.name.toLowerCase().includes(searchTerm)) {
          results.push(asset);
        }
      }
    }

    return results;
  }

  /**
   * Precargar assets esenciales de múltiples carpetas
   */
  async preloadEssentialAssetsByFolders(folderNames: string[]): Promise<void> {
    console.log('🎨 Precargando assets dinámicos de carpetas:', folderNames);
    
    const promises = folderNames.map(async (folderName) => {
      try {
        await this.loadAssetsByFolderName(folderName);
      } catch (error) {
        console.warn(`Error precargando carpeta ${folderName}:`, error);
      }
    });

    await Promise.all(promises);
    console.log('✅ Precarga de assets dinámicos completada');
  }

  // Métodos auxiliares privados

  private mapDynamicCategory(folderName: string): Asset['category'] {
    return DYNAMIC_CATEGORY_MAPPING[folderName as keyof typeof DYNAMIC_CATEGORY_MAPPING] || 'decorations';
  }

  private categorizeAssetsByFolder(assets: Asset[], folderName: string) {
    // Categorizar por nombre de carpeta
    if (!this.categorizedAssets[folderName]) {
      this.categorizedAssets[folderName] = [];
    }
    this.categorizedAssets[folderName].push(...assets);

    // También categorizar por category
    assets.forEach(asset => {
      if (!this.categorizedAssets[asset.category]) {
        this.categorizedAssets[asset.category] = [];
      }
      this.categorizedAssets[asset.category].push(asset);
    });
  }

  private initializeCategories() {
    Object.entries(ASSET_CATEGORIES).forEach(([category, subtypes]) => {
      this.categorizedAssets[category.toLowerCase()] = [];

      Object.entries(subtypes).forEach(([subtype]) => {
        if (!this.categorizedAssets[subtype]) {
          this.categorizedAssets[subtype] = [];
        }
      });
    });
  }

  /**
   * Carga un asset individual
   */
  async loadAsset(assetId: string): Promise<Asset> {
    // Si ya está cargado, devolverlo
    if (this.assets.has(assetId)) {
      return this.assets.get(assetId)!;
    }

    // Si ya se está cargando, devolver la promesa existente
    if (this.loadingPromises.has(assetId)) {
      return this.loadingPromises.get(assetId)!;
    }

    // Crear nueva promesa de carga
    const loadPromise = this.createLoadPromise(assetId);
    this.loadingPromises.set(assetId, loadPromise);

    try {
      const asset = await loadPromise;
      this.assets.set(assetId, asset);
      this.categorizeAsset(asset);
      return asset;
    } finally {
      this.loadingPromises.delete(assetId);
    }
  }

  private createLoadPromise(assetId: string): Promise<Asset> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      // Determinar la carpeta correcta basada en el tipo de asset
      let folderPath = '/assets/';
      
      if (assetId.includes('cesped') || assetId.includes('Grass') || assetId.includes('tile_0') && assetId.includes('suelo')) {
        folderPath += 'terrain_tiles/';
      } else if (assetId.includes('House') || assetId.includes('muro') || assetId.includes('Wall') || assetId.includes('vidrio')) {
        folderPath += 'structures/';
      } else if (assetId.includes('Barrel') || assetId.includes('Chest') || assetId.includes('ventana') || assetId.includes('basuras')) {
        folderPath += 'furniture_objects/';
      } else if (assetId.includes('Tree') || assetId.includes('Bush') || assetId.includes('Rock') || assetId.includes('tronco')) {
        folderPath += 'natural_elements/';
      } else if (assetId.includes('Path') || assetId.includes('FarmLand')) {
        folderPath += 'infrastructure/';
      } else if (assetId.includes('Water') || assetId.includes('tile_0198') || assetId.includes('tile_0230')) {
        folderPath += 'water/';
      } else if (assetId.includes('lampara') || assetId.includes('poste') || assetId.includes('silla') || assetId.includes('sombrilla')) {
        folderPath += 'environmental_objects/';
      } else {
        // Fallback a environmental_objects para assets no categorizados
        folderPath += 'environmental_objects/';
      }
      
      const path = folderPath + assetId + '.png';

      image.onload = () => {
        const asset: Asset = {
          id: assetId,
          name: this.extractNameFromId(assetId),
          category: this.detectCategory(assetId),
          subtype: this.detectSubtype(assetId),
          image,
          size: this.detectSize(assetId),
          path
        };
        resolve(asset);
      };

      image.onerror = () => {
        reject(new Error(`Failed to load asset: ${assetId}`));
      };

      image.src = path;
    });
  }

  /**
   * Carga múltiples assets de una categoría
   */
  async loadAssetsByCategory(category: keyof typeof ASSET_CATEGORIES): Promise<Asset[]> {
    const categoryData = ASSET_CATEGORIES[category];
    const allAssetIds = Object.values(categoryData).flat();

    const loadPromises = allAssetIds.map(id => this.loadAsset(id));
    return Promise.all(loadPromises);
  }

  /**
   * Carga assets de un subtipo específico
   */
  async loadAssetsBySubtype(
    category: keyof typeof ASSET_CATEGORIES,
    subtype: string
  ): Promise<Asset[]> {
    const categoryData = ASSET_CATEGORIES[category] as Record<string, readonly string[]>;
    const assetIds: readonly string[] = categoryData[subtype] || [];

    const loadPromises = Array.from(assetIds).map((id: string) => this.loadAsset(id));
    return Promise.all(loadPromises);
  }

  /**
   * Obtiene un asset aleatorio de un tipo específico
   */
  getRandomAssetByType(category: string, subtype?: string): Asset | null {
    const key = subtype || category;
    const assetsOfType = this.categorizedAssets[key] || [];

    if (assetsOfType.length === 0) return null;

    // Selección determinista basada en timestamp
    const seed = Date.now() * 1664525 + 1013904223;
    const index = Math.abs(seed % 2147483647) % assetsOfType.length;
    return assetsOfType[index];
  }

  /**
   * Obtiene todos los assets de un tipo
   */
  getAssetsByType(category: string, subtype?: string): Asset[] {
    const key = subtype || category;
    return this.categorizedAssets[key] || [];
  }

  /**
   * Obtiene muebles apropiados por tipo de habitación
   */
  getFurnitureByRoomType(
    roomType: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'storage'
  ): Asset[] {
    const furnitureMap: Record<string, string[]> = {
      living: ['seating', 'tables', 'entertainment', 'decoration'],
      bedroom: ['bedroom', 'storage', 'decoration'],
      kitchen: ['kitchen', 'tables'],
      bathroom: ['bathroom'],
      office: ['office', 'storage'],
      storage: ['storage']
    };

    const furniture: Asset[] = [];
    const subtypes = furnitureMap[roomType] || [];

    subtypes.forEach(subtype => {
      const assets = this.categorizedAssets[subtype] || [];
      furniture.push(...assets);
    });

    return furniture;
  }

  /**
   * Obtiene asset por ID
   */
  getAssetById(id: string): Asset | null {
    return this.assets.get(id) || null;
  }

  private extractNameFromId(id: string): string {
    // Extrae el nombre legible del ID del tile
    const parts = id.split('_');
    if (parts.length >= 3) {
      return parts.slice(2).join(' ').replace(/[-_]/g, ' ');
    }
    return id;
  }

  private detectCategory(id: string): Asset['category'] {
    if (id.includes('cesped') || id.includes('Grass') || id.includes('suelo') || id.includes('tile_0')) return 'terrain_tiles';
    if (id.includes('House') || id.includes('muro') || id.includes('Wall') || id.includes('vidrio')) return 'structures';
    if (id.includes('Barrel') || id.includes('Chest') || id.includes('ventana') || id.includes('basuras')) return 'furniture_objects';
    if (id.includes('Tree') || id.includes('Bush') || id.includes('Rock') || id.includes('tronco')) return 'natural_elements';
    if (id.includes('Path') || id.includes('FarmLand')) return 'infrastructure';
    if (id.includes('Water') || id.includes('agua')) return 'water';
    if (id.includes('lampara') || id.includes('poste') || id.includes('silla') || id.includes('sombrilla')) return 'environmental_objects';
    return 'environmental_objects';
  }

  private detectSubtype(id: string): string | undefined {
    // Detecta el subtipo basado en el nombre del archivo
    const name = id.toLowerCase();

    // Para muebles (prioridad alta)
    if (name.includes('furniture_')) {
      if (name.includes('sofa') || name.includes('chair') || name.includes('armchair'))
        return 'seating';
      if (name.includes('table') || name.includes('coffee_table') || name.includes('dining_table'))
        return 'tables';
      if (name.includes('bed') || name.includes('nightstand') || name.includes('dresser'))
        return 'bedroom';
      if (name.includes('stove') || name.includes('fridge') || name.includes('sink'))
        return 'kitchen';
      if (name.includes('desk') || name.includes('bookshelf') || name.includes('chair_fancy'))
        return 'office';
      if (name.includes('toilet') || name.includes('bathtub') || name.includes('mirror'))
        return 'bathroom';
      if (name.includes('tv_stand') || name.includes('piano') || name.includes('fireplace'))
        return 'entertainment';
      if (name.includes('wardrobe') || name.includes('cabinet')) return 'storage';
      if (name.includes('lamp')) return 'decoration';
      return 'decoration'; // fallback para muebles no categorizados
    }

    // Para terreno
    if (name.includes('cesped') || name.includes('grass')) return 'grass';
    if (name.includes('tierra') || name.includes('dirt')) return 'dirt';
    if (name.includes('arena') || name.includes('sand')) return 'sand';
    if (name.includes('piedra') || name.includes('stone')) return 'stone';

    // Para estructuras
    if (name.includes('house')) return 'houses';
    if (name.includes('muro') || name.includes('wall')) return 'walls';
    if (name.includes('fence')) return 'fences';
    if (name.includes('well')) return 'wells';
    if (name.includes('vidrio') || name.includes('glass')) return 'glass';

    // Para elementos naturales
    if (name.includes('tree')) return 'trees';
    if (name.includes('bush')) return 'bushes';
    if (name.includes('rock')) return 'rocks';
    if (name.includes('cliff')) return 'cliffs';
    if (name.includes('tronco') || name.includes('log')) return 'logs';

    // Para infraestructura
    if (name.includes('path') || name.includes('farm')) return 'paths';

    // Para agua
    if (name.includes('water') || name.includes('agua')) return 'tiles';

    return undefined;
  }

  private detectSize(id: string): number {
    // La mayoría de los tiles son 32x32, algunos especiales pueden ser diferentes
    if (id.includes('edificio_alto') || id.includes('arbol_grande')) {
      return 64;
    }
    return 32;
  }

  private categorizeAsset(asset: Asset) {
    // Categorizar por category principal
    if (!this.categorizedAssets[asset.category]) {
      this.categorizedAssets[asset.category] = [];
    }
    this.categorizedAssets[asset.category].push(asset);

    // Categorizar por subtype si existe
    if (asset.subtype) {
      if (!this.categorizedAssets[asset.subtype]) {
        this.categorizedAssets[asset.subtype] = [];
      }
      this.categorizedAssets[asset.subtype].push(asset);
    }
  }

  /**
   * Precargar assets esenciales para el juego
   */
  async preloadEssentialAssets(): Promise<void> {
    console.log('🎨 Precargando assets esenciales...');

    const essentialAssets = [
      // Terreno básico
      'cesped1',
      'cesped2', 
      'Grass_Middle',
      'TexturedGrass',
      'tile_0533_suelo_piedra',

      // Estructuras básicas
      'House',
      'House_Hay_1',
      'muros1',

      // Naturaleza básica
      'Oak_Tree',
      'Tree_Emerald_1',
      'Bush_Emerald_1',
      'Rock_Brown_1',

      // Infraestructura básica
      'Path_Middle',

      // Agua básica
      'Water_Middle'
    ];

    await Promise.all(essentialAssets.map(id => this.loadAsset(id)));
    console.log(`✅ Precargados ${essentialAssets.length} assets esenciales`);
  }

  /**
   * Obtiene estadísticas de assets cargados (incluyendo dinámicos)
   */
  getStats() {
    const dynamicFolders = Array.from(this.dynamicAssetsLoaded);
    
    return {
      totalLoaded: this.assets.size,
      dynamicFoldersLoaded: dynamicFolders,
      categories: Object.keys(this.categorizedAssets).reduce(
        (acc, key) => {
          acc[key] = this.categorizedAssets[key].length;
          return acc;
        },
        {} as Record<string, number>
      )
    };
  }

  /**
   * Obtener lista de carpetas disponibles para carga dinámica
   */
  async getAvailableFolders(): Promise<string[]> {
    try {
      // Intentar usar el sprite animation manager para obtener carpetas disponibles
      const manifestModule = await import('../generated/asset-manifest');
      return Object.keys(manifestModule.ASSET_MANIFEST);
    } catch {
      // Fallback a lista conocida con los nuevos nombres
      return ['terrain_tiles', 'structures', 'natural_elements', 'infrastructure', 'water', 'animated_entities', 'ui_icons', 'consumable_items', 'environmental_objects', 'furniture_objects', 'dialogs'];
    }
  }
}

// Instancia singleton del gestor de assets
export const assetManager = new AssetManager();
