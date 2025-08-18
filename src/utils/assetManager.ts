/**
 * 🎨 SISTEMA SIMPLIFICADO DE GESTIÓN DE ASSETS
 *
 * Maneja assets individuales de la carpeta Tiles/ de forma eficiente
 * Sin extracción de sprites - cada tile es un archivo independiente
 */

export interface Asset {
  id: string;
  name: string;
  category: 'ground' | 'buildings' | 'furniture' | 'nature' | 'roads' | 'water' | 'decorations';
  subtype?: string;
  image: HTMLImageElement;
  size: number; // Tamaño estándar del tile
  path: string;
}

export interface AssetCategory {
  [key: string]: Asset[];
}

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

  // Muebles reales descargados (400+ assets de calidad)
  FURNITURE: {
    // Muebles de sala
    seating: [
      'furniture/tile_furniture_sofa_brown',
      'furniture/tile_furniture_armchair',
      'furniture/tile_furniture_chair_wood'
    ],
    tables: [
      'furniture/tile_furniture_table_round',
      'furniture/tile_furniture_coffee_table',
      'furniture/tile_furniture_dining_table'
    ],

    // Dormitorio
    bedroom: [
      'furniture/tile_furniture_bed_double',
      'furniture/tile_furniture_nightstand',
      'furniture/tile_furniture_dresser'
    ],

    // Cocina
    kitchen: [
      'furniture/tile_furniture_stove',
      'furniture/tile_furniture_fridge',
      'furniture/tile_furniture_sink'
    ],

    // Oficina/Estudio
    office: [
      'furniture/tile_furniture_desk',
      'furniture/tile_furniture_bookshelf',
      'furniture/tile_furniture_chair_fancy'
    ],

    // Baño
    bathroom: [
      'furniture/tile_furniture_toilet',
      'furniture/tile_furniture_bathtub',
      'furniture/tile_furniture_mirror'
    ],

    // Entretenimiento
    entertainment: [
      'furniture/tile_furniture_tv_stand',
      'furniture/tile_furniture_piano',
      'furniture/tile_furniture_fireplace'
    ],

    // Almacenamiento
    storage: ['furniture/tile_furniture_wardrobe', 'furniture/tile_furniture_cabinet'],

    // Decoración
    decoration: ['furniture/tile_furniture_lamp']
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

  constructor() {
    this.initializeCategories();
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
      // Soporte para muebles en subcarpeta
      const path = assetId.startsWith('furniture/')
        ? `/assets/Tiles/${assetId}.png`
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

    // Para suelos
    if (name.includes('cesped')) return 'cesped';
    if (name.includes('tierra')) return 'tierra';
    if (name.includes('arena')) return 'arena';
    if (name.includes('piedra')) return 'piedra';

    // Para edificios
    if (name.includes('principal')) return 'principal';
    if (name.includes('comercial')) return 'comercial';
    if (name.includes('pequeño')) return 'pequeño';
    if (name.includes('grande')) return 'grande';
    if (name.includes('alto')) return 'alto';
    if (name.includes('tejado')) return 'tejado';

    // Para árboles
    if (name.includes('grande')) return 'arbol_grande';
    if (name.includes('pequeño')) return 'arbol_pequeño';
    if (name.includes('frondoso')) return 'arbol_frondoso';
    if (name.includes('joven')) return 'arbol_joven';

    // Para carreteras
    if (name.includes('horizontal')) return 'horizontal';
    if (name.includes('vertical')) return 'vertical';
    if (name.includes('curva')) return 'curva';
    if (name.includes('cruce')) return 'cruce';

    // Para agua
    if (name.includes('profunda')) return 'profunda';
    if (name.includes('estanque')) return 'estanque';
    if (name.includes('clara')) return 'clara';
    if (name.includes('corriente')) return 'corriente';

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
   * Obtiene estadísticas de assets cargados
   */
  getStats() {
    return {
      totalLoaded: this.assets.size,
      categories: Object.keys(this.categorizedAssets).reduce(
        (acc, key) => {
          acc[key] = this.categorizedAssets[key].length;
          return acc;
        },
        {} as Record<string, number>
      )
    };
  }
}

// Instancia singleton del gestor de assets
export const assetManager = new AssetManager();
