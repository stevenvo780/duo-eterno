/**
 * 🎬 SISTEMA AVANZADO DE ANIMACIONES Y SPRITES
 * 
 * Sistema centralizado que:
 * 1. Carga automáticamente sprites por carpeta
 * 2. Gestiona animaciones con metadatos JSON
 * 3. Proporciona una API simple para entidades
 * 4. Optimiza la carga y el rendimiento
 */

import React from 'react';

// Definir tipos básicos (fallback si no existe el manifest)
interface AnimationMetadata {
  name: string;
  frame_count: number;
  frame_size: [number, number];
  columns: number;
  rows: number;
  total_duration: number;
  loop: boolean;
  frames: Array<{ duration: number }>;
}

interface AnimationAsset {
  id: string;
  name: string;
  jsonPath: string;
  spritePath: string;
  metadata: AnimationMetadata;
}

interface StaticSpriteAsset {
  id: string;
  name: string;
  path: string;
  extension: string;
}

interface AssetFolder {
  name: string;
  path: string;
  animations: AnimationAsset[];
  staticSprites: StaticSpriteAsset[];
  subfolders?: Record<string, AssetFolder>;
  totalAssets: number;
}

export interface AnimationFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
}

export interface LoadedAnimation {
  asset: AnimationAsset;
  image: HTMLImageElement;
  frames: AnimationFrame[];
  totalDuration: number;
}

export interface LoadedSprite {
  asset: StaticSpriteAsset;
  image: HTMLImageElement;
}

export interface AnimationState {
  currentFrame: number;
  elapsedTime: number;
  isPlaying: boolean;
  loop: boolean;
  onComplete?: () => void;
}

export interface SpriteAnimationManager {
  // Carga de assets
  loadAnimation(id: string, folder?: string): Promise<LoadedAnimation>;
  loadSprite(id: string, folder?: string): Promise<LoadedSprite>;
  loadAssetsByFolder(folderName: string): Promise<{ animations: LoadedAnimation[], sprites: LoadedSprite[] }>;
  
  // Gestión de animaciones
  createAnimationState(animationId: string, autoPlay?: boolean): AnimationState;
  updateAnimationState(state: AnimationState, deltaTime: number, animation: LoadedAnimation): AnimationState;
  
  // Utilidades
  getAvailableAnimations(entityType?: string): string[];
  getAvailableSprites(folder?: string): string[];
  preloadEntityAssets(entityType: string): Promise<void>;
  
  // Estadísticas y debug
  getLoadedAssets(): { animations: number; sprites: number };
  getCacheStats(): { hits: number; misses: number; size: number };
}

class AdvancedSpriteAnimationManager implements SpriteAnimationManager {
  private loadedAnimations = new Map<string, LoadedAnimation>();
  private loadedSprites = new Map<string, LoadedSprite>();
  private loadingPromises = new Map<string, Promise<LoadedAnimation | LoadedSprite>>();
  
  // Cache y estadísticas
  private cacheHits = 0;
  private cacheMisses = 0;
  
  // Manifest de assets (se carga dinámicamente)
  private assetManifest: Record<string, AssetFolder> | null = null;

  constructor() {
    this.loadAssetManifest();
  }

  private async loadAssetManifest(): Promise<void> {
    try {
      // Cargar el manifest generado dinámicamente
      const manifestModule = await import('../generated/asset-manifest');
      this.assetManifest = manifestModule.ASSET_MANIFEST;
      console.log('✅ Asset manifest cargado:', Object.keys(this.assetManifest || {}).length, 'carpetas');
    } catch {
      console.warn('⚠️ No se pudo cargar el asset manifest. Ejecuta npm run sprite-loader primero.');
      this.assetManifest = {};
    }
  }

  async loadAnimation(id: string, folder?: string): Promise<LoadedAnimation> {
    const cacheKey = folder ? `${folder}/${id}` : id;
    
    // Verificar cache
    if (this.loadedAnimations.has(cacheKey)) {
      this.cacheHits++;
      return this.loadedAnimations.get(cacheKey)!;
    }

    // Verificar si ya se está cargando
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey) as Promise<LoadedAnimation>;
    }

    this.cacheMisses++;

    // Buscar el asset en el manifest
    const animationAsset = this.findAnimationAsset(id, folder);
    if (!animationAsset) {
      throw new Error(`Animation not found: ${cacheKey}`);
    }

    // Crear promesa de carga
    const loadPromise = this.performAnimationLoad(animationAsset);
    this.loadingPromises.set(cacheKey, loadPromise);

    try {
      const loadedAnimation = await loadPromise;
      this.loadedAnimations.set(cacheKey, loadedAnimation);
      this.loadingPromises.delete(cacheKey);
      return loadedAnimation;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }

  async loadSprite(id: string, folder?: string): Promise<LoadedSprite> {
    const cacheKey = folder ? `${folder}/${id}` : id;
    
    // Verificar cache
    if (this.loadedSprites.has(cacheKey)) {
      this.cacheHits++;
      return this.loadedSprites.get(cacheKey)!;
    }

    // Verificar si ya se está cargando
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey) as Promise<LoadedSprite>;
    }

    this.cacheMisses++;

    // Buscar el asset en el manifest
    const spriteAsset = this.findSpriteAsset(id, folder);
    if (!spriteAsset) {
      throw new Error(`Sprite not found: ${cacheKey}`);
    }

    // Crear promesa de carga
    const loadPromise = this.performSpriteLoad(spriteAsset);
    this.loadingPromises.set(cacheKey, loadPromise);

    try {
      const loadedSprite = await loadPromise;
      this.loadedSprites.set(cacheKey, loadedSprite);
      this.loadingPromises.delete(cacheKey);
      return loadedSprite;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }

  async loadAssetsByFolder(folderName: string): Promise<{ animations: LoadedAnimation[], sprites: LoadedSprite[] }> {
    if (!this.assetManifest) {
      await this.loadAssetManifest();
    }

    const folder = this.assetManifest?.[folderName];
    if (!folder) {
      throw new Error(`Folder not found: ${folderName}`);
    }

    // Cargar todas las animaciones y sprites en paralelo
    const animationPromises = folder.animations.map(anim => 
      this.loadAnimation(anim.id, folderName)
    );
    
    const spritePromises = folder.staticSprites.map(sprite => 
      this.loadSprite(sprite.id, folderName)
    );

    const [animations, sprites] = await Promise.all([
      Promise.allSettled(animationPromises),
      Promise.allSettled(spritePromises)
    ]);

    // Filtrar solo los exitosos y loggar errores
    const successfulAnimations = animations
      .filter((result): result is PromiseFulfilledResult<LoadedAnimation> => result.status === 'fulfilled')
      .map(result => result.value);

    const successfulSprites = sprites
      .filter((result): result is PromiseFulfilledResult<LoadedSprite> => result.status === 'fulfilled')
      .map(result => result.value);

    // Loggar errores si los hay
    animations.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`Failed to load animation ${folder.animations[index].id}:`, result.reason);
      }
    });

    sprites.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`Failed to load sprite ${folder.staticSprites[index].id}:`, result.reason);
      }
    });

    return {
      animations: successfulAnimations,
      sprites: successfulSprites
    };
  }

  createAnimationState(_animationId: string, autoPlay: boolean = true): AnimationState {
    return {
      currentFrame: 0,
      elapsedTime: 0,
      isPlaying: autoPlay,
      loop: true // Por defecto loop
    };
  }

  updateAnimationState(
    state: AnimationState, 
    deltaTime: number, 
    animation: LoadedAnimation
  ): AnimationState {
    if (!state.isPlaying || animation.frames.length === 0) {
      return state;
    }

    const newElapsedTime = state.elapsedTime + deltaTime;
    const currentFrame = animation.frames[state.currentFrame];
    
    if (newElapsedTime >= currentFrame.duration) {
      const nextFrameIndex = (state.currentFrame + 1) % animation.frames.length;
      
      // Verificar si hemos completado la animación (y no está en loop)
      if (!state.loop && nextFrameIndex === 0 && state.currentFrame === animation.frames.length - 1) {
        state.onComplete?.();
        return {
          ...state,
          isPlaying: false
        };
      }

      return {
        ...state,
        currentFrame: nextFrameIndex,
        elapsedTime: newElapsedTime - currentFrame.duration
      };
    }

    return {
      ...state,
      elapsedTime: newElapsedTime
    };
  }

  getAvailableAnimations(entityType?: string): string[] {
    if (!this.assetManifest) return [];

    const animations: string[] = [];
    
    Object.values(this.assetManifest).forEach(folder => {
      folder.animations.forEach(anim => {
        if (!entityType || anim.id.includes(entityType) || anim.name.includes(entityType)) {
          animations.push(anim.id);
        }
      });
      
      // Buscar en subcarpetas
      if (folder.subfolders) {
        Object.values(folder.subfolders).forEach(subfolder => {
          subfolder.animations.forEach(anim => {
            if (!entityType || anim.id.includes(entityType) || anim.name.includes(entityType)) {
              animations.push(anim.id);
            }
          });
        });
      }
    });

    return [...new Set(animations)];
  }

  getAvailableSprites(folder?: string): string[] {
    if (!this.assetManifest) return [];

    if (folder) {
      const folderData = this.assetManifest[folder];
      return folderData ? folderData.staticSprites.map(s => s.id) : [];
    }

    const sprites: string[] = [];
    Object.values(this.assetManifest).forEach(folderData => {
      sprites.push(...folderData.staticSprites.map(s => s.id));
      
      if (folderData.subfolders) {
        Object.values(folderData.subfolders).forEach(subfolder => {
          sprites.push(...subfolder.staticSprites.map(s => s.id));
        });
      }
    });

    return [...new Set(sprites)];
  }

  async preloadEntityAssets(entityType: string): Promise<void> {
    const animationIds = this.getAvailableAnimations(entityType);
    
    const promises = animationIds.map(async (id) => {
      try {
        await this.loadAnimation(id);
      } catch (error) {
        console.warn(`Failed to preload animation ${id}:`, error);
      }
    });

    await Promise.all(promises);
    console.log(`✅ Preloaded ${promises.length} animations for entity: ${entityType}`);
  }

  getLoadedAssets(): { animations: number; sprites: number } {
    return {
      animations: this.loadedAnimations.size,
      sprites: this.loadedSprites.size
    };
  }

  getCacheStats(): { hits: number; misses: number; size: number } {
    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      size: this.loadedAnimations.size + this.loadedSprites.size
    };
  }

  // Métodos privados

  private findAnimationAsset(id: string, folder?: string): AnimationAsset | null {
    if (!this.assetManifest) return null;

    if (folder) {
      const folderData = this.assetManifest[folder];
      if (folderData) {
        const found = folderData.animations.find(anim => anim.id === id);
        if (found) return found;
        
        // Buscar en subcarpetas
        if (folderData.subfolders) {
          for (const subfolder of Object.values(folderData.subfolders)) {
            const found = subfolder.animations.find(anim => anim.id === id);
            if (found) return found;
          }
        }
      }
    } else {
      // Buscar en todas las carpetas
      for (const folderData of Object.values(this.assetManifest)) {
        const found = folderData.animations.find(anim => anim.id === id);
        if (found) return found;
        
        if (folderData.subfolders) {
          for (const subfolder of Object.values(folderData.subfolders)) {
            const found = subfolder.animations.find(anim => anim.id === id);
            if (found) return found;
          }
        }
      }
    }

    return null;
  }

  private findSpriteAsset(id: string, folder?: string): StaticSpriteAsset | null {
    if (!this.assetManifest) return null;

    if (folder) {
      const folderData = this.assetManifest[folder];
      if (folderData) {
        const found = folderData.staticSprites.find(sprite => sprite.id === id);
        if (found) return found;
        
        // Buscar en subcarpetas
        if (folderData.subfolders) {
          for (const subfolder of Object.values(folderData.subfolders)) {
            const found = subfolder.staticSprites.find(sprite => sprite.id === id);
            if (found) return found;
          }
        }
      }
    } else {
      // Buscar en todas las carpetas
      for (const folderData of Object.values(this.assetManifest)) {
        const found = folderData.staticSprites.find(sprite => sprite.id === id);
        if (found) return found;
        
        if (folderData.subfolders) {
          for (const subfolder of Object.values(folderData.subfolders)) {
            const found = subfolder.staticSprites.find(sprite => sprite.id === id);
            if (found) return found;
          }
        }
      }
    }

    return null;
  }

  private async performAnimationLoad(asset: AnimationAsset): Promise<LoadedAnimation> {
    // Cargar imagen sprite
    const image = new Image();
    const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load animation sprite: ${asset.spritePath}`));
      image.src = `/assets/${asset.spritePath}`;
    });

    await imagePromise;

    // Calcular frames basado en metadatos
    const frames = this.calculateAnimationFrames(asset.metadata);

    return {
      asset,
      image,
      frames,
      totalDuration: asset.metadata.total_duration
    };
  }

  private async performSpriteLoad(asset: StaticSpriteAsset): Promise<LoadedSprite> {
    const image = new Image();
    const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load sprite: ${asset.path}`));
      image.src = `/assets/${asset.path}`;
    });

    await imagePromise;

    return {
      asset,
      image
    };
  }

  private calculateAnimationFrames(metadata: AnimationMetadata): AnimationFrame[] {
    const frames: AnimationFrame[] = [];
    const [frameWidth, frameHeight] = metadata.frame_size;

    for (let i = 0; i < metadata.frame_count; i++) {
      const col = i % metadata.columns;
      const row = Math.floor(i / metadata.columns);

      frames.push({
        x: col * frameWidth,
        y: row * frameHeight,
        width: frameWidth,
        height: frameHeight,
        duration: metadata.frames[i]?.duration || 100
      });
    }

    return frames;
  }
}

// Instancia singleton
export const spriteAnimationManager = new AdvancedSpriteAnimationManager();

// Hook para React
export function useSpriteAnimation(animationId: string, folder?: string, autoPlay: boolean = true) {
  const [animation, setAnimation] = React.useState<LoadedAnimation | null>(null);
  const [state, setState] = React.useState<AnimationState | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    spriteAnimationManager.loadAnimation(animationId, folder)
      .then(loadedAnimation => {
        if (mounted) {
          setAnimation(loadedAnimation);
          setState(spriteAnimationManager.createAnimationState(animationId, autoPlay));
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [animationId, folder, autoPlay]);

  // Sistema de actualización de animación
  React.useEffect(() => {
    if (!animation || !state?.isPlaying) return;

    let lastTime = performance.now();
    let animationFrameId: number;

    const updateLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setState(prevState => {
        if (!prevState || !animation) return prevState;
        return spriteAnimationManager.updateAnimationState(prevState, deltaTime, animation);
      });

      if (state?.isPlaying) {
        animationFrameId = requestAnimationFrame(updateLoop);
      }
    };

    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [animation, state?.isPlaying]);

  const play = React.useCallback(() => {
    setState(prev => prev ? { ...prev, isPlaying: true } : null);
  }, []);

  const pause = React.useCallback(() => {
    setState(prev => prev ? { ...prev, isPlaying: false } : null);
  }, []);

  const reset = React.useCallback(() => {
    setState(prev => prev ? { ...prev, currentFrame: 0, elapsedTime: 0 } : null);
  }, []);

  const getCurrentFrame = React.useCallback(() => {
    if (!animation || !state) return null;
    return animation.frames[state.currentFrame];
  }, [animation, state]);

  return {
    animation,
    state,
    loading,
    error,
    getCurrentFrame,
    play,
    pause,
    reset
  };
}

// Re-export para compatibilidad
export { spriteAnimationManager as animationManager };
