/**
 * 🚀 Sistema de Carga Optimizado de Assets
 * Mejora la gestión de memoria y velocidad de carga
 */

interface AssetLoadOptions {
  priority: 'low' | 'medium' | 'high';
  preload?: boolean;
  lazy?: boolean;
}

interface AssetCache {
  sprites: Map<string, HTMLImageElement>;
  tiles: Map<string, ExtractedTile>;
  lastAccess: Map<string, number>;
  maxCacheSize: number;
}

export class OptimizedAssetManager {
  private cache: AssetCache;
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();
  
  constructor(maxCacheSize = 100) {
    this.cache = {
      sprites: new Map(),
      tiles: new Map(),
      lastAccess: new Map(),
      maxCacheSize
    };
  }

  async loadSprite(name: string, options: AssetLoadOptions = { priority: 'medium' }): Promise<HTMLImageElement> {
    // Check cache first
    if (this.cache.sprites.has(name)) {
      this.cache.lastAccess.set(name, Date.now());
      return this.cache.sprites.get(name)!;
    }

    // Check if already loading
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!;
    }

    // Start loading
    const loadPromise = this.loadImageWithFallback(name, options);
    this.loadingPromises.set(name, loadPromise);

    try {
      const image = await loadPromise;
      
      // Add to cache with memory management
      this.addToCache(name, image);
      this.loadingPromises.delete(name);
      
      return image;
    } catch (error) {
      this.loadingPromises.delete(name);
      throw error;
    }
  }

  private async loadImageWithFallback(name: string, options: AssetLoadOptions): Promise<HTMLImageElement> {
    const paths = [
      `/assets/sprites/${name}.png`,
      `/assets/sprites/generated/${name}.png`,
      `/assets/fallback/${name}.png`
    ];

    for (const path of paths) {
      try {
        return await this.loadSingleImage(path, options);
      } catch (error) {
        console.warn(`Failed to load sprite from ${path}:`, error);
      }
    }

    throw new Error(`Could not load sprite: ${name}`);
  }

  private loadSingleImage(src: string, options: AssetLoadOptions): Promise<HTMLImageImage> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Optimize loading based on priority
      if (options.priority === 'high') {
        img.fetchPriority = 'high';
      }
      
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private addToCache(name: string, image: HTMLImageElement) {
    // Memory management - remove oldest items if cache is full
    if (this.cache.sprites.size >= this.cache.maxCacheSize) {
      this.evictOldestItems();
    }

    this.cache.sprites.set(name, image);
    this.cache.lastAccess.set(name, Date.now());
  }

  private evictOldestItems() {
    const entries = Array.from(this.cache.lastAccess.entries())
      .sort((a, b) => a[1] - b[1]);
    
    // Remove oldest 25% of items
    const itemsToRemove = Math.floor(entries.length * 0.25);
    
    for (let i = 0; i < itemsToRemove; i++) {
      const [name] = entries[i];
      this.cache.sprites.delete(name);
      this.cache.lastAccess.delete(name);
    }
  }

  preloadCriticalAssets(assetNames: string[]): Promise<void[]> {
    return Promise.all(
      assetNames.map(name => 
        this.loadSprite(name, { priority: 'high', preload: true })
          .catch(error => console.warn(`Failed to preload ${name}:`, error))
      )
    );
  }

  getCacheStats() {
    return {
      spritesLoaded: this.cache.sprites.size,
      memoryUsage: this.estimateMemoryUsage(),
      hitRate: this.calculateHitRate()
    };
  }

  private estimateMemoryUsage(): number {
    // Rough estimation: 32x32 RGBA = 4KB per sprite
    return this.cache.sprites.size * 4; // KB
  }

  private calculateHitRate(): number {
    // Implementation for cache hit rate calculation
    return 0; // Placeholder
  }
}

export const assetManager = new OptimizedAssetManager();
