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
  category: 'ground' | 'buildings' | 'furniture' | 'nature' | 'roads' | 'water' | 'decorations' | 'animations' | 'activities' | 'food' | 'ambient';
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
  'ground': 'ground',
  'buildings': 'buildings', 
  'nature': 'nature',
  'roads': 'roads',
  'water': 'water',
  'animations': 'animations',
  'activities': 'decorations',
  'food': 'decorations',
  'ambient': 'decorations',
  'furniture': 'furniture'
} as const;

// Assets reales disponibles después de la limpieza (21 assets esenciales + 400+ muebles)
export const ASSET_CATEGORIES = {
  // Terreno base (8 assets)
  GROUND: {
    cesped: ['tile_0182_suelo_cesped', 'tile_0210_suelo_cesped'],
    tierra: ['tile_0144_suelo_tierra', 'tile_0184_suelo_tierra'],
    arena: ['tile_0143_suelo_arena', 'tile_0179_suelo_arena'],
    piedra: ['tile_0145_suelo_piedra', 'tile_0181_suelo_piedra']
  },

  // Edificios (5 assets)
  BUILDINGS: {
    principal: ['tile_0000_edificio_principal'],
    comercial: ['tile_0003_edificio_comercial', 'tile_0007_edificio_comercial'],
    residencial: ['tile_0004_edificio_pequeño', 'tile_0005_edificio_grande']
  },

  // Muebles reales disponibles en furniture_light
  FURNITURE: {
    // Muebles de sala
    seating: ['tile_furniture_sofa_brown', 'tile_furniture_armchair'],
    tables: [
      'tile_furniture_table_round',
      'tile_furniture_coffee_table',
      'tile_furniture_dining_table',
      'tile_furniture_table_long'
    ],

    // Dormitorio
    bedroom: ['tile_furniture_bed_double', 'tile_furniture_nightstand', 'tile_furniture_dresser'],

    // Cocina
    kitchen: ['tile_furniture_stove', 'tile_furniture_fridge'],

    // Oficina/Estudio
    office: ['tile_furniture_desk'],

    // Baño
    bathroom: ['tile_furniture_mirror'],

    // Entretenimiento
    entertainment: ['tile_furniture_tv_stand'],

    // Almacenamiento
    storage: ['tile_furniture_wardrobe'],

    // Decoración
    decoration: ['tile_furniture_stool']
  },

  // Naturaleza (3 assets)
  NATURE: {
    arboles: ['tile_0002_arbol_grande', 'tile_0033_arbol_pequeño', 'tile_0034_arbol_frondoso']
  },

  // Carreteras (4 assets completos para conectividad)
  ROADS: {
    horizontal: ['tile_0001_carretera_horizontal'],
    vertical: ['tile_0189_carretera_vertical'],
    curva: ['tile_0154_carretera_curva'],
    cruce: ['tile_0191_carretera_cruce']
  },

  // Agua (1 asset esencial)
  WATER: {
    deep: ['tile_0149_agua_profunda']
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
      // Soporte para muebles en subcarpeta furniture_light
      const path = assetId.startsWith('furniture_light/')
        ? `/assets/Tiles/${assetId}.png`
        : assetId.startsWith('tile_furniture_')
          ? `/assets/Tiles/furniture_light/${assetId}.png`
          : `/assets/Tiles/${assetId}.png`;

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
    if (id.startsWith('furniture/') || id.includes('furniture_')) return 'furniture';
    if (id.includes('suelo_')) return 'ground';
    if (id.includes('edificio_') || id.includes('tejado_')) return 'buildings';
    if (id.includes('arbol_')) return 'nature';
    if (id.includes('carretera_')) return 'roads';
    if (id.includes('agua_')) return 'water';
    return 'decorations';
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

    // Para suelos
    if (name.includes('cesped')) return 'cesped';
    if (name.includes('tierra')) return 'tierra';
    if (name.includes('arena')) return 'arena';
    if (name.includes('piedra')) return 'piedra';

    // Para edificios
    if (name.includes('principal')) return 'principal';
    if (name.includes('comercial')) return 'comercial';
    if (name.includes('pequeño')) return 'residencial';
    if (name.includes('grande')) return 'residencial';
    if (name.includes('alto')) return 'alto';
    if (name.includes('tejado')) return 'tejado';

    // Para árboles (simplificado)
    if (name.includes('arbol')) return 'arboles';

    // Para carreteras
    if (name.includes('horizontal')) return 'horizontal';
    if (name.includes('vertical')) return 'vertical';
    if (name.includes('curva')) return 'curva';
    if (name.includes('cruce')) return 'cruce';

    // Para agua
    if (name.includes('agua')) return 'deep';

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
      // Suelos básicos
      'tile_0182_suelo_cesped',
      'tile_0144_suelo_tierra',
      'tile_0143_suelo_arena',
      'tile_0145_suelo_piedra',

      // Edificios básicos
      'tile_0000_edificio_principal',
      'tile_0003_edificio_comercial',
      'tile_0004_edificio_pequeño',

      // Naturaleza básica
      'tile_0002_arbol_grande',
      'tile_0033_arbol_pequeño',

      // Carreteras básicas
      'tile_0001_carretera_horizontal',
      'tile_0189_carretera_vertical',

      // Agua básica
      'tile_0149_agua_profunda'
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
      // Fallback a lista conocida
      return ['ground', 'buildings', 'nature', 'roads', 'water', 'animations', 'activities', 'food', 'ambient'];
    }
  }
}

// Instancia singleton del gestor de assets
export const assetManager = new AssetManager();
