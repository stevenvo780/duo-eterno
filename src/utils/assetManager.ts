/**
 * 🎨 SISTEMA SIMPLIFICADO DE GESTIÓN DE ASSETS
 * 
 * Sistema que carga dinámicamente assets desde carpetas
 */

export interface Asset {
  id: string;
  name: string;
  category: string;
  image: HTMLImageElement;
  size: number;
  path: string;
}

export interface AssetCategory {
  [key: string]: Asset[];
}

// Carpetas disponibles para carga dinámica
const ASSET_FOLDERS = [
  'terrain_tiles', 'structures', 'building', 'furniture_objects', 
  'natural_elements', 'infrastructure', 'water', 'environmental_objects',
  'animated_entities', 'ui_icons', 'consumable_items', 'dialogs'
];


export class AssetManager {
  private assets: Map<string, Asset> = new Map();
  private categorizedAssets: AssetCategory = {};
  private loadingPromises: Map<string, Promise<Asset>> = new Map();
  private dynamicAssetsLoaded: Set<string> = new Set();

  /**
   * Cargar assets dinámicamente por nombre de carpeta
   */
  async loadAssetsByFolderName(folderName: string): Promise<Asset[]> {
    if (this.dynamicAssetsLoaded.has(folderName)) {
      return this.getAssetsByType(folderName);
    }

    const assets: Asset[] = [];
    const basePath = `/assets/${folderName}/`;

    try {
      // Intentar cargar archivos comunes de la carpeta
      const commonFiles = await this.scanFolderForAssets(basePath);
      
      for (const fileName of commonFiles) {
        const asset = await this.createAssetFromFile(fileName, folderName, basePath);
        if (asset) {
          this.assets.set(asset.id, asset);
          assets.push(asset);
        }
      }

      this.categorizeAssetsByFolder(assets, folderName);
      this.dynamicAssetsLoaded.add(folderName);

      console.log(`✅ Cargados ${assets.length} assets de la carpeta: ${folderName}`);
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
   * Buscar archivos de assets en una carpeta
   */
  private async scanFolderForAssets(basePath: string): Promise<string[]> {
    // Lista estática de archivos conocidos por carpeta
    const knownFiles: Record<string, string[]> = {
      'terrain_tiles': ['Grass_Middle', 'TexturedGrass', 'cesped1', 'cesped2', 'cesped3'],
      'structures': ['House', 'House_Hay_1', 'CityWall_Gate_1', 'Well_Hay_1', 'Fences'],
      'natural_elements': ['Oak_Tree', 'Tree_Emerald_1', 'Bush_Emerald_1', 'Rock_Brown_1'],
      'water': ['Water_Middle'],
      'infrastructure': ['Path_Middle', 'FarmLand_Tile']
    };
    
    const folderName = basePath.split('/').filter(Boolean)[1];
    return knownFiles[folderName] || [];
  }

  /**
   * Crear un asset desde un archivo
   */
  private async createAssetFromFile(fileName: string, folderName: string, basePath: string): Promise<Asset | null> {
    return new Promise((resolve) => {
      const image = new Image();
      const path = basePath + fileName + '.png';
      
      image.onload = () => {
        resolve({
          id: fileName,
          name: fileName.replace(/_/g, ' '),
          category: folderName,
          image,
          size: 32,
          path
        });
      };
      
      image.onerror = () => resolve(null);
      image.src = path;
    });
  }

  /**
   * Precargar assets esenciales de múltiples carpetas
   */
  async preloadEssentialAssetsByFolders(folderNames: string[]): Promise<void> {
    console.log('🎨 Precargando assets de carpetas:', folderNames);
    
    const promises = folderNames.map(async (folderName) => {
      try {
        await this.loadAssetsByFolderName(folderName);
      } catch (error) {
        console.warn(`Error precargando carpeta ${folderName}:`, error);
      }
    });

    await Promise.all(promises);
    console.log('✅ Precarga completada');
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
      const category = this.detectCategory(assetId);
      const path = `/assets/${category}/${assetId}.png`;

      image.onload = () => {
        const asset: Asset = {
          id: assetId,
          name: assetId.replace(/_/g, ' '),
          category: category,
          image,
          size: 32,
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
   * Obtiene un asset aleatorio de un tipo específico
   */
  getRandomAssetByType(category: string): Asset | null {
    const assetsOfType = this.categorizedAssets[category] || [];

    if (assetsOfType.length === 0) return null;

    // Selección determinista basada en timestamp
    const seed = Date.now() * 1664525 + 1013904223;
    const index = Math.abs(seed % 2147483647) % assetsOfType.length;
    return assetsOfType[index];
  }

  /**
   * Obtiene todos los assets de un tipo
   */
  getAssetsByType(category: string): Asset[] {
    return this.categorizedAssets[category] || [];
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


  private detectCategory(id: string): string {
    if (id.includes('cesped') || id.includes('Grass') || id.includes('grass')) return 'terrain_tiles';
    if (id.includes('House') || id.includes('Wall') || id.includes('Well') || id.includes('Fence')) return 'structures';
    if (id.includes('Tree') || id.includes('Bush') || id.includes('Rock') || id.includes('Cliff')) return 'natural_elements';
    if (id.includes('Water') || id.includes('water')) return 'water';
    if (id.includes('Path') || id.includes('Farm')) return 'infrastructure';
    if (id.includes('muro') || id.includes('vidrio') || id.includes('piso')) return 'building';
    if (id.includes('ventana') || id.includes('Chest') || id.includes('Barrel') || id.includes('Crate')) return 'furniture_objects';
    if (id.includes('Chicken') || id.includes('Pig') || id.includes('Sheep') || id.includes('Cow')) return 'animated_entities';
    if (id.includes('bread') || id.includes('burger') || id.includes('pizza')) return 'consumable_items';
    if (id.includes('Google') || id.includes('Microsoft') || id.includes('Facebook')) return 'ui_icons';
    if (id.includes('dialog')) return 'dialogs';
    
    return 'environmental_objects';
  }


  private categorizeAsset(asset: Asset) {
    // Categorizar por category principal
    if (!this.categorizedAssets[asset.category]) {
      this.categorizedAssets[asset.category] = [];
    }
    this.categorizedAssets[asset.category].push(asset);
  }

  /**
   * Precargar assets esenciales
   */
  async preloadEssentialAssets(): Promise<void> {
    console.log('🎨 Precargando assets esenciales...');
    
    const essentialFolders = ['terrain_tiles', 'structures', 'water', 'natural_elements'];
    await this.preloadEssentialAssetsByFolders(essentialFolders);
    
    console.log('✅ Precarga completada');
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
   * Obtener lista de carpetas disponibles
   */
  getAvailableFolders(): string[] {
    return ASSET_FOLDERS;
  }


}

// Instancia singleton del gestor de assets
export const assetManager = new AssetManager();
