/**
 * Gestor de assets basado en carpetas con caché y carga perezosa.
 */

import assetAnalysis from '../generated/asset-analysis.json';
import { telemetry } from './telemetry';
import { budgetedPreloader } from './budgetedPreloader'; // F4: Add telemetry

export interface Asset {
  path: string;
  image: HTMLImageElement | null;
  type: string;
  size: number;
  id?: string;
  loaded?: boolean;
  // F2: Dimensiones naturales y metadatos pixel-art
  naturalWidth?: number;
  naturalHeight?: number;
  aspectRatio?: number;
  isPixelArt?: boolean;
  taxonomy?: {
    category: string;
    subcategory?: string;
    tags?: string[];
  };
}

export class ModernAssetManager {
  private assets: Map<string, Asset> = new Map();
  private loadingPromises: Map<string, Promise<Asset>> = new Map();
  private loadedFolders: Set<string> = new Set();

  // Assets conocidos por carpeta - cargados dinámicamente del análisis
  private static getKnownAssets(): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    
    // Convertir los assets del análisis, agregando extensión .png si no está presente
    if (assetAnalysis && assetAnalysis.assetMap) {
      Object.entries(assetAnalysis.assetMap).forEach(([folder, assets]) => {
        result[folder] = (assets as string[]).map(asset => 
          asset.endsWith('.png') ? asset : `${asset}.png`
        );
      });
    }
    
    return result;
  }

  /**
   * F5: Preload con presupuesto optimizado
   */
  public async preloadAssetsByPriority(folders: string[], onProgress?: (loaded: number, total: number) => void): Promise<void> {
    console.log(`🚀 F5: Iniciando preload presupuestado de ${folders.length} carpetas`);
    
    await budgetedPreloader.preloadAssetsByPriority(folders, onProgress);
    
    console.log(`✅ F5: Preload completado para ${folders.length} carpetas`);
  }

  /**
   * Carga assets de una carpeta específica
   */
  public async loadAssetsByFolderName(folderName: string): Promise<Asset[]> {
    if (this.loadedFolders.has(folderName)) {
      return this.getAssetsByType(folderName);
    }

    const assets: Asset[] = [];
    const knownAssets = ModernAssetManager.getKnownAssets();
    const knownFiles = knownAssets[folderName] || [];

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
    const loadStart = performance.now(); // F4: Track decode time
    return new Promise((resolve, _reject) => {
      const img = new Image();
      
      // F2: Configurar pixel-perfect rendering
      img.style.imageRendering = 'pixelated';
      img.style.imageRendering = '-moz-crisp-edges';
      img.style.imageRendering = 'crisp-edges';
      
      img.onload = () => {
        // F4: Log decode telemetry
        const decodeTime = performance.now() - loadStart;
        const estimatedBytes = img.naturalWidth * img.naturalHeight * 4; // RGBA estimate
        telemetry.logAssetDecoded({
          path,
          ms: decodeTime,
          bytes: estimatedBytes
        });

        // F2: Capturar dimensiones naturales y clasificar taxonomía
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        const aspectRatio = naturalWidth / naturalHeight;
        
        // Detectar si es pixel art basado en tamaño y tipo
        const isPixelArt = this.detectPixelArt(naturalWidth, naturalHeight, folderName);
        
        // Crear taxonomía basada en carpeta real
        const taxonomy = this.createTaxonomy(folderName, path);
        
        const asset: Asset = {
          path,
          image: img,
          type: folderName,
          size: Math.max(naturalWidth, naturalHeight), // F2: Usar dimensión mayor como tamaño base
          id: path.split('/').pop()?.replace('.png', '') || path,
          loaded: true,
          // F2: Nuevos campos para dimensiones naturales
          naturalWidth,
          naturalHeight,
          aspectRatio,
          isPixelArt,
          taxonomy
        };
        
        this.assets.set(path, asset);
        resolve(asset);
      };

      img.onerror = () => {
        // En caso de error, crear asset placeholder con dimensiones por defecto
        const placeholderAsset: Asset = {
          path,
          image: null,
          type: folderName,
          size: 64,
          id: path.split('/').pop()?.replace('.png', '') || path,
          loaded: false,
          naturalWidth: 64,
          naturalHeight: 64,
          aspectRatio: 1,
          isPixelArt: true,
          taxonomy: this.createTaxonomy(folderName, path)
        };
        
        this.assets.set(path, placeholderAsset);
        resolve(placeholderAsset);
      };

      img.src = path;
    });
  }

  /**
   * F2: Detecta si una imagen es pixel art basado en dimensiones y tipo
   */
  private detectPixelArt(width: number, height: number, folderName: string): boolean {
    // Heurísticas para detectar pixel art:
    // 1. Tamaños típicos de pixel art (potencias de 2, múltiplos de 8, 16, 32)
    const isTypicalPixelArtSize = (width <= 128 && height <= 128) || 
                                  (width % 16 === 0 && height % 16 === 0) ||
                                  (width % 32 === 0 && height % 32 === 0);
    
    // 2. Carpetas que típicamente contienen pixel art
    const pixelArtFolders = ['terrain', 'structures', 'props', 'entities', 'ui_icons', 'decals'];
    const isFolderPixelArt = pixelArtFolders.some(folder => folderName.includes(folder));
    
    // 3. Tamaños exactos comunes en pixel art
    const commonPixelArtSizes = [16, 24, 32, 48, 64, 96, 128];
    const hasCommonSize = commonPixelArtSizes.includes(width) || commonPixelArtSizes.includes(height);
    
    return isTypicalPixelArtSize || isFolderPixelArt || hasCommonSize;
  }

  /**
   * F2: Crea taxonomía basada en carpetas reales y análisis de assets
   */
  private createTaxonomy(folderName: string, _path: string): { category: string; subcategory?: string; tags?: string[] } {
    // Mapeo de carpetas reales a categorías semánticas
    const categoryMap: Record<string, { category: string; subcategory?: string; tags?: string[] }> = {
      'animated_entities': { category: 'entities', subcategory: 'animated', tags: ['living', 'interactive'] },
      'cliffs': { category: 'terrain', subcategory: 'elevation', tags: ['solid', 'impassable'] },
      'consumable_items': { category: 'items', subcategory: 'consumable', tags: ['interactive', 'food'] },
      'decals': { category: 'decoration', subcategory: 'overlay', tags: ['visual', 'detail'] },
      'entities': { category: 'entities', subcategory: 'static', tags: ['interactive'] },
      'foliage': { category: 'nature', subcategory: 'plants', tags: ['decorative', 'organic'] },
      'mushrooms': { category: 'nature', subcategory: 'fungi', tags: ['organic', 'small'] },
      'props': { category: 'objects', subcategory: 'props', tags: ['interactive', 'functional'] },
      'roads': { category: 'infrastructure', subcategory: 'paths', tags: ['navigation', 'connectivity'] },
      'rocks': { category: 'nature', subcategory: 'minerals', tags: ['solid', 'decorative'] },
      'ruins': { category: 'structures', subcategory: 'ruins', tags: ['ancient', 'decorative'] },
      'structures': { category: 'buildings', subcategory: 'complete', tags: ['solid', 'functional'] },
      'terrain': { category: 'terrain', subcategory: 'base', tags: ['ground', 'foundation'] },
      'ui_icons': { category: 'interface', subcategory: 'icons', tags: ['ui', 'symbolic'] },
      'water': { category: 'nature', subcategory: 'liquid', tags: ['animated', 'flowing'] }
    };

    // Buscar taxonomía exacta o por patrones
    const exactMatch = categoryMap[folderName];
    if (exactMatch) {
      return exactMatch;
    }

    // Fallback para subcarpetas o nombres no mapeados
    const fallbackCategory = folderName.includes('terrain') ? 'terrain' :
                           folderName.includes('structure') ? 'buildings' :
                           folderName.includes('natural') ? 'nature' :
                           folderName.includes('animated') ? 'entities' :
                           'objects';

    return {
      category: fallbackCategory,
      subcategory: folderName,
      tags: ['unknown']
    };
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
   * Obtiene asset por ID
   */
  public getAssetById(id: string): Asset | null {
    for (const asset of this.assets.values()) {
      if (asset.id === id) {
        return asset;
      }
    }
    return null;
  }

  /**
   * F2: Obtiene assets por categoría de taxonomía
   */
  public getAssetsByCategory(category: string): Asset[] {
    return Array.from(this.assets.values()).filter(asset => 
      asset.taxonomy?.category === category && asset.loaded
    );
  }

  /**
   * F2: Obtiene assets por subcategoría
   */
  public getAssetsBySubcategory(subcategory: string): Asset[] {
    return Array.from(this.assets.values()).filter(asset => 
      asset.taxonomy?.subcategory === subcategory && asset.loaded
    );
  }

  /**
   * F2: Obtiene assets por tags
   */
  public getAssetsByTags(tags: string[]): Asset[] {
    return Array.from(this.assets.values()).filter(asset => {
      if (!asset.taxonomy?.tags || !asset.loaded) return false;
      return tags.some(tag => asset.taxonomy!.tags!.includes(tag));
    });
  }

  /**
   * F2: Obtiene assets pixel-art
   */
  public getPixelArtAssets(): Asset[] {
    return Array.from(this.assets.values()).filter(asset => 
      asset.isPixelArt && asset.loaded
    );
  }

  /**
   * F2: Obtiene asset aleatorio por categoría
   */
  public getRandomAssetByCategory(category: string): Asset | null {
    const assets = this.getAssetsByCategory(category);
    return assets.length > 0 ? assets[Math.floor(Math.random() * assets.length)] : null;
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
