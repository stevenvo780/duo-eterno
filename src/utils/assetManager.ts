/**
 * 🎨 SISTEMA SIMPLIFICADO DE GESTIÓN DE ASSETS
 * 
 * Sistema que carga dinámicamente assets desde carpetas
 */

export interface Asset {
  id?: string;
  name?: string;
  category?: string;
  image: HTMLImageElement | null;
  size: number;
  path: string;
  type: string;
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
    // Lista completa de archivos conocidos por carpeta
    const knownFiles: Record<string, string[]> = {
      'terrain_tiles': [
        'Grass_Middle', 'TexturedGrass', 
        'cesped1', 'cesped2', 'cesped3', 'cesped4', 'cesped5',
        'cesped6', 'cesped7', 'cesped8', 'cesped9', 'cesped10',
        'cesped11', 'cesped12', 'cesped13', 'cesped14', 'cesped15',
        'cesped16', 'cesped17', 'cesped18', 'cesped19', 'cesped20',
        'cesped21', 'cesped22', 'cesped23', 'cesped24', 'cesped25',
        'cesped26', 'cesped27', 'cesped28', 'cesped29', 'cesped30', 'cesped31'
      ],
      'structures': [
        'House', 'House_Hay_1', 'House_Hay_2', 'House_Hay_3', 'House_Hay_4_Purple',
        'CityWall_Gate_1', 'Well_Hay_1', 'Fences',
        'Assets_source_002_001', 'Assets_source_002_002', 'Assets_source_002_003',
        'Assets_source_002_004', 'Assets_source_002_005', 'Assets_source_002_006',
        'Assets_source_002_007', 'Assets_source_002_008', 'Assets_source_002_009',
        'Assets_source_002_010', 'Assets_source_002_011'
      ],
      'natural_elements': [
        'Oak_Tree', 'Tree_Emerald_1', 'Tree_Emerald_2', 'Tree_Emerald_3', 'Tree_Emerald_4',
        'Bush_Emerald_1', 'Bush_Emerald_2', 'Bush_Emerald_3', 'Bush_Emerald_4', 'Bush_Emerald_5',
        'Rock_Brown_1', 'Rock_Brown_2', 'Rock_Brown_4', 'Rock_Brown_6', 'Rock_Brown_9',
        'Rock1_1', 'Rock1_2', 'Rock1_3', 'Rock1_4', 'Rock1_5',
        'Rock2_1', 'Rock2_2', 'Rock2_3', 'Rock2_4', 'Rock2_5',
        'Mega_tree1', 'Mega_tree2', 'Luminous_tree1', 'Luminous_tree2', 'Luminous_tree3',
        'Curved_tree1', 'Curved_tree2', 'Curved_tree3', 'Willow1', 'Willow2', 'Willow3',
        'Blue-green_balls_tree1', 'Blue-green_balls_tree2', 'Blue-green_balls_tree3',
        'White_tree1', 'White_tree2', 'Light_balls_tree1', 'Light_balls_tree2', 'Light_balls_tree3',
        'Swirling tree1', 'Swirling tree2', 'Swirling tree3',
        'Beige_green_mushroom1', 'Beige_green_mushroom2', 'Beige_green_mushroom3',
        'White-red_mushroom1', 'White-red_mushroom2', 'White-red_mushroom3',
        'Chanterelles1', 'Chanterelles2', 'Chanterelles3',
        'troncos1', 'troncos2', 'troncos3', 'Ent_man', 'Ent_woman'
      ],
      'building': [
        '1', '2', '3', '4', '5', '6', 'muro', 'muros1', 'muros2', 'muros3', 'piso', 'vidrio'
      ],
      'water': ['Water_Middle'],
      'infrastructure': ['Path_Middle', 'FarmLand_Tile'],
      'furniture_objects': [],
      'environmental_objects': [],
      'animated_entities': [],
      'ui_icons': [],
      'consumable_items': [],
      'dialogs': []
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
   * Obtener asset por path específico
   */
  getAssetByPath(path: string): Asset | null {
    return this.assets.get(path) || null;
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
