/**
 * 🎨 SISTEMA SIMPLIFICADO DE GESTIÓN DE ASSETS
 * 
 * Maneja assets individuales de la carpeta Tiles/ de forma eficiente
 * Sin extracción de sprites - cada tile es un archivo independiente
 */

export interface Asset {
  id: string;
  name: string;
  category: 'ground' | 'buildings' | 'nature' | 'roads' | 'water' | 'decorations';
  subtype?: string;
  image: HTMLImageElement;
  size: number; // Tamaño estándar del tile
  path: string;
}

export interface AssetCategory {
  [key: string]: Asset[];
}

export const ASSET_CATEGORIES = {
  GROUND: {
    cesped: ['tile_0182_suelo_cesped', 'tile_0210_suelo_cesped', 'tile_0246_suelo_cesped', 'tile_0278_suelo_cesped'],
    tierra: ['tile_0144_suelo_tierra', 'tile_0184_suelo_tierra', 'tile_0216_suelo_tierra', 'tile_0256_suelo_tierra'],
    arena: ['tile_0143_suelo_arena', 'tile_0179_suelo_arena', 'tile_0219_suelo_arena', 'tile_0243_suelo_arena'],
    piedra: ['tile_0145_suelo_piedra', 'tile_0181_suelo_piedra', 'tile_0209_suelo_piedra', 'tile_0221_suelo_piedra']
  },
  BUILDINGS: {
    principal: ['tile_0000_edificio_principal'],
    comercial: ['tile_0003_edificio_comercial', 'tile_0007_edificio_comercial', 'tile_0011_edificio_comercial'],
    pequeño: ['tile_0004_edificio_pequeño', 'tile_0008_edificio_pequeño', 'tile_0012_edificio_pequeño'],
    grande: ['tile_0005_edificio_grande', 'tile_0009_edificio_grande', 'tile_0013_edificio_grande'],
    alto: ['tile_0006_edificio_alto', 'tile_0010_edificio_alto', 'tile_0014_edificio_alto'],
    tejado: ['tile_0024_tejado', 'tile_0025_tejado', 'tile_0026_tejado', 'tile_0027_tejado']
  },
  NATURE: {
    arbol_grande: ['tile_0002_arbol_grande', 'tile_0032_arbol_grande', 'tile_0036_arbol_grande', 'tile_0160_arbol_grande'],
    arbol_pequeño: ['tile_0033_arbol_pequeño', 'tile_0069_arbol_pequeño', 'tile_0161_arbol_pequeño', 'tile_0173_arbol_pequeño'],
    arbol_frondoso: ['tile_0034_arbol_frondoso', 'tile_0070_arbol_frondoso', 'tile_0146_arbol_frondoso', 'tile_0162_arbol_frondoso'],
    arbol_joven: ['tile_0035_arbol_joven', 'tile_0071_arbol_joven', 'tile_0107_arbol_joven', 'tile_0147_arbol_joven']
  },
  ROADS: {
    horizontal: ['tile_0001_carretera_horizontal', 'tile_0192_carretera_horizontal', 'tile_0208_carretera_horizontal'],
    vertical: ['tile_0189_carretera_vertical', 'tile_0229_carretera_vertical', 'tile_0245_carretera_vertical'],
    curva: ['tile_0154_carretera_curva', 'tile_0190_carretera_curva', 'tile_0226_carretera_curva'],
    cruce: ['tile_0191_carretera_cruce', 'tile_0227_carretera_cruce', 'tile_0263_carretera_cruce']
  },
  WATER: {
    profunda: ['tile_0149_agua_profunda', 'tile_0157_agua_profunda', 'tile_0237_agua_profunda'],
    estanque: ['tile_0235_agua_estanque', 'tile_0239_agua_estanque', 'tile_0271_agua_estanque'],
    clara: ['tile_0236_agua_clara', 'tile_0240_agua_clara', 'tile_0272_agua_clara'],
    corriente: ['tile_0238_agua_corriente', 'tile_0242_agua_corriente', 'tile_0274_agua_corriente']
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
      const path = `/assets/Tiles/${assetId}.png`;
      
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
  async loadAssetsBySubtype(category: keyof typeof ASSET_CATEGORIES, subtype: string): Promise<Asset[]> {
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
      categories: Object.keys(this.categorizedAssets).reduce((acc, key) => {
        acc[key] = this.categorizedAssets[key].length;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

// Instancia singleton del gestor de assets
export const assetManager = new AssetManager();
