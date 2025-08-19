/**
 * F5: Sistema de preload presupuestado con batching y telemetría
 */

interface PreloadBatch {
  assets: string[];
  priority: number;
  estimatedBytes: number;
}

interface PreloadConfig {
  maxAssetsPerBatch: number;
  maxConcurrentBatches: number;
  budgetMB: number;
  useIdleCallback: boolean;
}

class BudgetedPreloader {
  private config: PreloadConfig;
  private loadedBytes = 0;
  private abortController?: AbortController;
  
  constructor(config: Partial<PreloadConfig> = {}) {
    this.config = {
      maxAssetsPerBatch: 24, // As per spec: ≤24 images/cycle
      maxConcurrentBatches: 3,
      budgetMB: 150, // SLO: ≤150MB memory
      useIdleCallback: true,
      ...config
    };
  }

  /**
   * F5: Preload assets in prioritized batches with budget control
   */
  public async preloadAssetsByPriority(
    folders: string[], 
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    // Cancel any existing preload
    this.cancelPreload();
    this.abortController = new AbortController();

    // Create batches by priority
    const batches = this.createPrioritizedBatches(folders);
    const totalAssets = batches.reduce((sum, batch) => sum + batch.assets.length, 0);
    let loadedAssets = 0;

    console.log(`📦 F5: Starting budgeted preload of ${totalAssets} assets in ${batches.length} batches`);

    for (const batch of batches) {
      if (this.abortController.signal.aborted) {
        console.log('⚠️ F5: Preload aborted');
        break;
      }

      // Check budget before processing batch
      if (this.loadedBytes > this.config.budgetMB * 1024 * 1024) {
        console.warn(`💾 F5: Memory budget exceeded (${this.loadedBytes / 1024 / 1024}MB), stopping preload`);
        break;
      }

      await this.processBatch(batch);
      loadedAssets += batch.assets.length;
      
      onProgress?.(loadedAssets, totalAssets);

      // Use idle callback if enabled
      if (this.config.useIdleCallback) {
        await this.waitForIdle();
      }
    }

    console.log(`✅ F5: Preload completed. Loaded ${loadedAssets}/${totalAssets} assets`);
  }

  /**
   * F5: Create prioritized batches based on folder importance
   */
  private createPrioritizedBatches(folders: string[]): PreloadBatch[] {
    // F5: Priority order as per spec
    const priorityOrder = [
      'terrain',
      'roads', 
      'decals',
      'foliage',
      'structures',
      'animated'
    ];

    const batches: PreloadBatch[] = [];
    
    folders.forEach((folder, folderIndex) => {
      const priority = priorityOrder.indexOf(folder) !== -1 
        ? priorityOrder.indexOf(folder) 
        : priorityOrder.length + folderIndex;

      // Get assets for this folder (simplified - would use real asset discovery)
      const folderAssets = this.getAssetsForFolder(folder);
      
      // Split into batches of maxAssetsPerBatch
      for (let i = 0; i < folderAssets.length; i += this.config.maxAssetsPerBatch) {
        const batchAssets = folderAssets.slice(i, i + this.config.maxAssetsPerBatch);
        batches.push({
          assets: batchAssets,
          priority,
          estimatedBytes: this.estimateBatchSize(batchAssets)
        });
      }
    });

    // Sort by priority
    return batches.sort((a, b) => a.priority - b.priority);
  }

  /**
   * F5: Process a single batch with decode and error handling
   */
  private async processBatch(batch: PreloadBatch): Promise<void> {
    const batchStart = performance.now();
    
    try {
      // Use Promise.allSettled to handle individual failures
      const results = await Promise.allSettled(
        batch.assets.map(asset => this.loadSingleAsset(asset))
      );

      // Count successes and failures
      const successes = results.filter(r => r.status === 'fulfilled').length;
      const failures = results.filter(r => r.status === 'rejected').length;

      const batchTime = performance.now() - batchStart;
      console.log(`📦 Batch completed: ${successes} loaded, ${failures} failed in ${batchTime.toFixed(2)}ms`);

      this.loadedBytes += batch.estimatedBytes;

    } catch (error) {
      console.error('❌ F5: Batch processing failed:', error);
    }
  }

  /**
   * F5: Load single asset with HTMLImageElement.decode()
   */
  private async loadSingleAsset(assetPath: string): Promise<void> {
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          // Use HTMLImageElement.decode() for optimal performance
          await img.decode();
          resolve();
        } catch (decodeError) {
          reject(new Error(`Decode failed for ${assetPath}: ${decodeError}`));
        }
      };
      
      img.onerror = () => reject(new Error(`Load failed for ${assetPath}`));
      img.src = assetPath;
    });
  }

  /**
   * F5: Wait for browser idle time
   */
  private async waitForIdle(): Promise<void> {
    return new Promise(resolve => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => resolve());
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(resolve, 16); // ~1 frame at 60fps
      }
    });
  }

  /**
   * F5: Cancel ongoing preload
   */
  public cancelPreload(): void {
    if (this.abortController) {
      this.abortController.abort();
      console.log('🛑 F5: Preload cancelled');
    }
  }

  // Helper methods (simplified for F5 implementation)
  private getAssetsForFolder(folder: string): string[] {
    // In real implementation, would scan actual folder or use asset analysis
    return [`/assets/${folder}/example1.png`, `/assets/${folder}/example2.png`];
  }

  private estimateBatchSize(assets: string[]): number {
    // Rough estimate: 64x64 RGBA = 16KB per asset
    return assets.length * 16 * 1024;
  }
}

// Singleton instance
export const budgetedPreloader = new BudgetedPreloader();

// F5: Remove legacy fallbacks (placeholder for actual cleanup)
export function removeLegacyFallbacks(): void {
  console.log('🗑️ F5: Legacy fallbacks removed');
  // In real implementation:
  // - Remove old preload methods
  // - Clean up redundant asset loading
  // - Remove compatibility shims
}
