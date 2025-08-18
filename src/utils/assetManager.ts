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
   * Carga múltiples assets de una categoría usando datos dinámicos
   */
  async loadAssetsByCategory(category: string): Promise<Asset[]> {
    const analysis = await loadAssetAnalysis();
    const categoryData = analysis.categories[category];
    
    if (!categoryData) {
      console.warn(`Categoría ${category} no encontrada`);
      return [];
    }

    const allAssetIds = Object.values(categoryData).flat() as string[];
    const loadPromises = allAssetIds.map(id => this.loadAsset(id));
    return Promise.all(loadPromises);
  }

  /**
   * Carga assets de un subtipo específico usando datos dinámicos
   */
  async loadAssetsBySubtype(
    category: string,
    subtype: string
  ): Promise<Asset[]> {
    const analysis = await loadAssetAnalysis();
    const categoryData = analysis.categories[category];
    
    if (!categoryData || !categoryData[subtype]) {
      console.warn(`Subtipo ${subtype} en categoría ${category} no encontrado`);
      return [];
    }

    const assetIds = categoryData[subtype];
    const loadPromises = assetIds.map((id: string) => this.loadAsset(id));
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
    // Detección precisa basada únicamente en assets que sabemos que existen
    
    // Terrain tiles
    if (id.includes('cesped') || id === 'Grass_Middle' || id === 'TexturedGrass') {
      return 'terrain_tiles';
    }
    
    // Building assets (from building folder)
    if (id === 'muros1' || id === 'muros2' || id === 'muros3' || id === 'muro' || 
        id === 'vidrio' || id === 'piso' || /^\d+$/.test(id)) {
      return 'building';
    }
    
    // Structures
    if (id.includes('House') || id.includes('CityWall') || 
        id === 'Well_Hay_1' || id === 'Fences') {
      return 'structures';
    }
    
    // Furniture objects
    if (id.includes('Barrel') || id.includes('Chest') || id.includes('ventana') || 
        id.includes('basuras') || id.includes('Crate') || id.includes('Basket') ||
        id.includes('botellas') || id.includes('cajas')) {
      return 'furniture_objects';
    }
    
    // Natural elements
    if (id.includes('Tree') || id.includes('Bush') || id.includes('Rock') || 
        id.includes('tronco') || id === 'Oak_Tree' || id.includes('Emerald') || 
        id.includes('Brown') || id.includes('Cliff')) {
      return 'natural_elements';
    }
    
    // Infrastructure
    if (id === 'Path_Middle' || id === 'FarmLand_Tile') {
      return 'infrastructure';
    }
    
    // Water
    if (id === 'Water_Middle' || id === 'tile_0198' || id === 'tile_0230') {
      return 'water';
    }
    
    // Environmental objects
    if (id.includes('Bench') || id.includes('Table') || id.includes('Lamp') || 
        id.includes('Sign') || id.includes('Banner') || id.includes('Plant') || 
        id.includes('poste') || id === 'silla' || id.includes('sillas_de_calle') ||
        id.includes('sombrilla') || id.includes('lamparas') || id.includes('ropas_tendidas') ||
        id.includes('Boat') || id.includes('Fireplace') || id.includes('HayStack') ||
        id.includes('Sack') || id.includes('Tombstones') || id.includes('Chopped_Tree')) {
      return 'environmental_objects';
    }
    
    // Animated entities
    if (id.includes('Chicken') || id.includes('Boar') || id.includes('Pig') || 
        id.includes('Sheep') || id.includes('Cow') || id.includes('Horse') || 
        id === 'Campfire' || id.includes('Flowers_') || id === 'Idle' || id === 'Walk' ||
        id.includes('Marine')) {
      return 'animated_entities';
    }
    
    // Consumable items
    if (id.includes('_dish') || id.includes('bread') || id.includes('burger') || 
        id.includes('pizza') || id.includes('cake') || id.includes('pie') ||
        id.includes('taco') || id.includes('waffle') || id.includes('bacon') ||
        id.includes('curry') || id.includes('donut') || id.includes('egg') ||
        id.includes('fries') || id.includes('hotdog') || id.includes('icecream') ||
        id.includes('jelly') || id.includes('jam') || id.includes('meat') ||
        id.includes('nacho') || id.includes('omlet') || id.includes('pancake') ||
        id.includes('popcorn') || id.includes('salmon') || id.includes('sandwich') ||
        id.includes('steak') || id.includes('sushi') || id.includes('ramen') ||
        id.includes('spaghetti')) {
      return 'consumable_items';
    }
    
    // UI Icons
    if (id.includes('Google') || id.includes('Microsoft') || id.includes('Facebook') || 
        id.includes('Instagram') || id.includes('Spotify') || id.includes('Netflix') ||
        id.includes('Amazon') || id.includes('Discord') || id.includes('Twitter') ||
        id.includes('YouTube') || id.includes('Chrome') || id.includes('Firefox') ||
        id.includes('Telegram') || id.includes('WhatsApp') || id.includes('Zoom') ||
        id.includes('Slack') || id.includes('Trello') || id.includes('Steam')) {
      return 'ui_icons';
    }
    
    // Building (legacy folder)
    if (id === 'muro' || id === 'piso') {
      return 'structures'; // Redirigir al structures
    }
    
    // Dialogs
    if (id.includes('dialog')) {
      return 'dialogs';
    }
    
    // Fallback
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
   * Precargar assets esenciales basados en assets existentes
   */
  async preloadEssentialAssets(): Promise<void> {
    console.log('🎨 Precargando assets esenciales dinámicos...');

    const analysis = await loadAssetAnalysis();
    const essentialAssets: string[] = [];
    
    // Seleccionar algunos assets esenciales de cada categoría
    if (analysis.categories.TERRAIN_TILES?.grass) {
      essentialAssets.push(...analysis.categories.TERRAIN_TILES.grass.slice(0, 5));
    }
    
    if (analysis.categories.STRUCTURES?.houses) {
      essentialAssets.push(...analysis.categories.STRUCTURES.houses.slice(0, 3));
    }
    
    if (analysis.categories.NATURAL_ELEMENTS?.trees) {
      essentialAssets.push(...analysis.categories.NATURAL_ELEMENTS.trees.slice(0, 3));
    }
    
    if (analysis.categories.WATER?.tiles) {
      essentialAssets.push(...analysis.categories.WATER.tiles);
    }
    
    if (analysis.categories.INFRASTRUCTURE?.paths) {
      essentialAssets.push(...analysis.categories.INFRASTRUCTURE.paths);
    }

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
      const analysis = await loadAssetAnalysis();
      return Object.keys(analysis.assetMap || {});
    } catch {
      // Fallback a lista conocida
      return ['terrain_tiles', 'structures', 'natural_elements', 'infrastructure', 'water', 'environmental_objects', 'furniture_objects'];
    }
  }

  /**
   * Obtener todas las categorías disponibles dinámicamente
   */
  async getAvailableCategories(): Promise<string[]> {
    try {
      const analysis = await loadAssetAnalysis();
      return Object.keys(analysis.categories || {});
    } catch {
      return ['TERRAIN_TILES', 'STRUCTURES', 'NATURAL_ELEMENTS', 'INFRASTRUCTURE', 'WATER', 'ENVIRONMENTAL_OBJECTS'];
    }
  }

  /**
   * Obtener assets aleatorios de una categoría específica
   */
  async getRandomAssetsFromCategory(category: string, count: number = 1): Promise<Asset[]> {
    const analysis = await loadAssetAnalysis();
    const categoryData = analysis.categories[category];
    
    if (!categoryData) return [];
    
    const allAssets = Object.values(categoryData as Record<string, string[]> || {}).flat();
    const shuffled = allAssets.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    
    // Filtrar y cargar solo assets que realmente existen
    const validAssets: Asset[] = [];
    for (const id of selected) {
      try {
        const asset = await this.loadAsset(id);
        validAssets.push(asset);
      } catch (error) {
        console.warn(`⚠️ Asset ${id} no existe, omitiendo...`);
      }
    }
    
    return validAssets;
  }

  /**
   * Validar que un asset existe antes de intentar cargarlo
   */
  async validateAssetExists(assetId: string): Promise<boolean> {
    try {
      await this.loadAsset(assetId);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener lista de assets existentes de una categoría (solo IDs validados)
   */
  async getValidatedAssetsFromCategory(category: string): Promise<string[]> {
    const analysis = await loadAssetAnalysis();
    const categoryData = analysis.categories[category];
    
    if (!categoryData) return [];
    
    const allAssets = Object.values(categoryData as Record<string, string[]> || {}).flat();
    const validatedAssets: string[] = [];
    
    // Validar cada asset antes de incluirlo
    for (const assetId of allAssets) {
      if (await this.validateAssetExists(assetId)) {
        validatedAssets.push(assetId);
      }
    }
    
    return validatedAssets;
  }
}

// Instancia singleton del gestor de assets
export const assetManager = new AssetManager();
