/**
 * Sistema de Asset Manager moderno para el sistema de renderizado
 */

export interface Asset {
  path: string;
  image: HTMLImageElement | null;
  type: string;
  size: number;
  id?: string;
  loaded?: boolean;
}

export class ModernAssetManager {
  private assets: Map<string, Asset> = new Map();
  private loadingPromises: Map<string, Promise<Asset>> = new Map();
  private loadedFolders: Set<string> = new Set();

  // Assets conocidos por carpeta
  private static readonly KNOWN_ASSETS: Record<string, string[]> = {
    terrain_tiles: [
      'Grass_Middle.png', 'TexturedGrass.png', 'cesped1.png', 'cesped2.png', 'cesped3.png',
      'cesped4.png', 'cesped5.png', 'cesped6.png', 'cesped7.png', 'cesped8.png', 'cesped9.png',
      'cesped10.png', 'cesped11.png', 'cesped12.png', 'cesped13.png', 'cesped14.png', 'cesped15.png',
      'cesped16.png', 'cesped17.png', 'cesped18.png', 'cesped19.png', 'cesped20.png', 'cesped21.png',
      'cesped22.png', 'cesped23.png', 'cesped24.png', 'cesped25.png', 'cesped26.png', 'cesped27.png',
      'cesped28.png', 'cesped29.png', 'cesped30.png', 'cesped31.png'
    ],
    structures: [
      'Assets_source_002_001.png', 'Assets_source_002_002.png', 'Assets_source_002_003.png',
      'Assets_source_002_004.png', 'Assets_source_002_005.png', 'Assets_source_002_006.png',
      'Assets_source_002_007.png', 'Assets_source_002_008.png', 'Assets_source_002_009.png',
      'Assets_source_002_010.png', 'Assets_source_002_011.png', 'CityWall_Gate_1.png',
      'Fences.png', 'House.png', 'House_Hay_1.png', 'House_Hay_2.png', 'House_Hay_3.png',
      'House_Hay_4_Purple.png', 'Well_Hay_1.png'
    ],
    natural_elements: [
      // Placeholder - serán detectados dinámicamente
    ],
    water: [
      // Placeholder - serán detectados dinámicamente  
    ],
    furniture_objects: [
      // Placeholder - serán detectados dinámicamente
    ],
    environmental_objects: [
      // Placeholder - serán detectados dinámicamente
    ]
  };

  /**
   * Carga assets de una carpeta específica
   */
  public async loadAssetsByFolderName(folderName: string): Promise<Asset[]> {
    if (this.loadedFolders.has(folderName)) {
      return this.getAssetsByType(folderName);
    }

    const assets: Asset[] = [];
    const knownFiles = ModernAssetManager.KNOWN_ASSETS[folderName] || [];

    console.log(`🎨 Cargando assets de: ${folderName} (${knownFiles.length} archivos conocidos)`);

    for (const fileName of knownFiles) {
      try {
        const asset = await this.loadAsset(folderName, fileName);
        if (asset) {
          assets.push(asset);
        }
      } catch (error) {
        console.warn(`⚠️ No se pudo cargar ${fileName} de ${folderName}:`, error);
      }
    }

    this.loadedFolders.add(folderName);
    console.log(`✅ Cargados ${assets.length} assets de la carpeta: ${folderName}`);
    
    return assets;
  }

  /**
   * Carga un asset individual
   */
  private async loadAsset(folderName: string, fileName: string): Promise<Asset | null> {
    const path = `/assets/${folderName}/${fileName}`;
    
    // Si ya existe, devolverlo
    if (this.assets.has(path)) {
      return this.assets.get(path)!;
    }

    // Si ya se está cargando, esperar a que termine
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path)!;
    }

    // Crear promesa de carga
    const loadPromise = this.createLoadPromise(path, folderName);
    this.loadingPromises.set(path, loadPromise);

    try {
      const asset = await loadPromise;
      this.loadingPromises.delete(path);
      return asset;
    } catch (error) {
      this.loadingPromises.delete(path);
      throw error;
    }
  }

  private createLoadPromise(path: string, folderName: string): Promise<Asset> {
    return new Promise((resolve, _reject) => {
      const img = new Image();
      
      img.onload = () => {
        const asset: Asset = {
          path,
          image: img,
          type: folderName,
          size: 64, // Tamaño por defecto
          id: path.split('/').pop()?.replace('.png', '') || path,
          loaded: true
        };
        
        this.assets.set(path, asset);
        resolve(asset);
      };

      img.onerror = () => {
        // En caso de error, crear asset placeholder
        const placeholderAsset: Asset = {
          path,
          image: null,
          type: folderName,
          size: 64,
          id: path.split('/').pop()?.replace('.png', '') || path,
          loaded: false
        };
        
        this.assets.set(path, placeholderAsset);
        resolve(placeholderAsset);
      };

      img.src = path;
    });
  }

  /**
   * Precarga assets esenciales por carpetas
   */
  public async preloadEssentialAssetsByFolders(folderNames: string[]): Promise<void> {
    console.log('🎨 Precargando assets de carpetas:', folderNames);
    
    const loadPromises = folderNames.map(folderName => 
      this.loadAssetsByFolderName(folderName)
    );
    
    await Promise.all(loadPromises);
    console.log('✅ Precarga completada');
  }

  /**
   * Precarga assets esenciales
   */
  public async preloadEssentialAssets(): Promise<void> {
    console.log('🎨 Precargando assets esenciales adicionales...');
    
    // Los assets principales ya se cargaron en preloadEssentialAssetsByFolders
    // Aquí podemos cargar assets específicos si es necesario
    
    console.log('✅ Precarga de assets esenciales completada');
  }

  /**
   * Obtiene assets por tipo/carpeta
   */
  public getAssetsByType(type: string): Asset[] {
    return Array.from(this.assets.values()).filter(asset => asset.type === type);
  }

  /**
   * Obtiene un asset aleatorio por tipo
   */
  public getRandomAssetByType(type: string): Asset | null {
    const assets = this.getAssetsByType(type);
    return assets.length > 0 ? assets[Math.floor(Math.random() * assets.length)] : null;
  }

  /**
   * Obtiene asset por path
   */
  public getAssetByPath(path: string): Asset | null {
    return this.assets.get(path) || null;
  }

  /**
   * Obtiene estadísticas
   */
  public getStats() {
    const typeCount: Record<string, number> = {};
    
    this.assets.forEach(asset => {
      typeCount[asset.type] = (typeCount[asset.type] || 0) + 1;
    });

    return {
      totalLoaded: this.assets.size,
      dynamicFoldersLoaded: Array.from(this.loadedFolders),
      categories: typeCount
    };
  }

  /**
   * Busca assets por término
   */
  public searchAssets(searchTerm: string): Asset[] {
    const term = searchTerm.toLowerCase();
    return Array.from(this.assets.values()).filter(asset =>
      asset.path.toLowerCase().includes(term) ||
      (asset.id && asset.id.toLowerCase().includes(term))
    );
  }

  /**
   * Limpia cache de assets
   */
  public clearCache(): void {
    this.assets.clear();
    this.loadingPromises.clear();
    this.loadedFolders.clear();
    console.log('🧹 AssetManager: Cache limpiado');
  }
}

// Instancia singleton
export const assetManager = new ModernAssetManager();
