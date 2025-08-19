/**
 * Renderizado de objetos del mapa (estructuras, naturales, mobiliario, decoración).
 */

import { assetManager, type Asset } from '../modernAssetManager';
import type { MapElement, Zone } from '../../types';

export interface GameObject {
  id: string;
  type: 'structure' | 'natural' | 'furniture' | 'decoration';
  asset: Asset;
  position: {
    x: number;
    y: number;
    z: number; // Para layering vertical
  };
  scale: {
    width: number;
    height: number;
  };
  rotation: number;
  metadata: {
    isCollider?: boolean;
    isInteractable?: boolean;
    shadowOffset?: { x: number; y: number };
    anchor?: { x: number; y: number }; // Punto de anclaje (0-1)
    isAnimated?: boolean; // Si el objeto usa animaciones
  };
}

export interface RenderLayer {
  name: string;
  zIndex: number;
  objects: GameObject[];
}

export class ObjectRenderer {
  // Tamaños base para escala de referencia
  private static readonly BASE_RESOLUTION = 64; // Resolución de referencia
  private static readonly MIN_SIZE = 24; // Tamaño mínimo
  private static readonly MAX_SIZE = 192; // Tamaño máximo
  
  // Cache de resoluciones detectadas
  private resolutionCache: Map<string, { width: number; height: number }> = new Map();

  private renderLayers: Map<string, RenderLayer> = new Map();
  private structureAssets: Asset[] = [];
  private naturalAssets: Asset[] = [];
  private furnitureAssets: Asset[] = [];
  
  // Nuevos arrays para assets animados
  private animatedAssets: Asset[] = [];

  constructor() {
    this.initializeLayers();
    this.initializeAssets();
    this.preloadAssetResolutions();
  }

  /**
   * Pre-carga las resoluciones de todos los assets para mejor performance
   */
  private async preloadAssetResolutions(): Promise<void> {
    const allAssets = [...this.structureAssets, ...this.naturalAssets, ...this.furnitureAssets];
    
    // Cargar resoluciones en paralelo
    const resolutionPromises = allAssets.map(asset => this.detectImageResolution(asset));
    
    try {
      await Promise.all(resolutionPromises);
      console.log(`🎯 ObjectRenderer: ${allAssets.length} resoluciones de assets pre-cargadas`);
    } catch (error) {
      console.warn('⚠️ ObjectRenderer: Error pre-cargando algunas resoluciones:', error);
    }
  }

  /**
   * Detecta automáticamente la resolución de una imagen y calcula el tamaño de renderizado apropiado
   */
  private async detectImageResolution(asset: Asset): Promise<{ width: number; height: number }> {
    const cacheKey = asset.path;
    
    // Verificar cache primero
    if (this.resolutionCache.has(cacheKey)) {
      return this.resolutionCache.get(cacheKey)!;
    }

    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        // Calcular tamaño basado en la resolución real
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        
        // Escalar proporcionalmente manteniendo aspect ratio
        const maxDimension = Math.max(naturalWidth, naturalHeight);
        let scaleFactor = ObjectRenderer.BASE_RESOLUTION / maxDimension;
        
        // Aplicar límites mínimos y máximos
        const calculatedSize = maxDimension * scaleFactor;
        if (calculatedSize < ObjectRenderer.MIN_SIZE) {
          scaleFactor = ObjectRenderer.MIN_SIZE / maxDimension;
        } else if (calculatedSize > ObjectRenderer.MAX_SIZE) {
          scaleFactor = ObjectRenderer.MAX_SIZE / maxDimension;
        }
        
        const finalSize = {
          width: Math.floor(naturalWidth * scaleFactor),
          height: Math.floor(naturalHeight * scaleFactor)
        };
        
        // Guardar en cache
        this.resolutionCache.set(cacheKey, finalSize);
        resolve(finalSize);
      };
      
      img.onerror = () => {
        // Fallback a tamaño base si no se puede cargar
        const fallbackSize = { width: ObjectRenderer.BASE_RESOLUTION, height: ObjectRenderer.BASE_RESOLUTION };
        this.resolutionCache.set(cacheKey, fallbackSize);
        resolve(fallbackSize);
      };
      
      img.src = asset.path;
    });
  }

  /**
   * F2: Obtiene el tamaño apropiado usando dimensiones naturales del asset
   */
  private getAssetSize(asset: Asset, fallbackSize: number = ObjectRenderer.BASE_RESOLUTION): { width: number; height: number } {
    // F2: Priorizar dimensiones naturales del asset si están disponibles
    if (asset.naturalWidth && asset.naturalHeight) {
      return {
        width: asset.naturalWidth,
        height: asset.naturalHeight
      };
    }
    
    const cached = this.resolutionCache.get(asset.path);
    if (cached) {
      return cached;
    }
    
    // Si no está en cache, usar el tamaño de la imagen si está cargada
    if (asset.image && asset.image.complete) {
      const naturalWidth = asset.image.naturalWidth;
      const naturalHeight = asset.image.naturalHeight;
      
      if (naturalWidth > 0 && naturalHeight > 0) {
        // F2: Para pixel art, usar dimensiones exactas sin escalar
        if (asset.isPixelArt) {
          const naturalSize = { width: naturalWidth, height: naturalHeight };
          this.resolutionCache.set(asset.path, naturalSize);
          return naturalSize;
        }
        
        // Para non-pixel art, aplicar lógica de escalado existente
        const maxDimension = Math.max(naturalWidth, naturalHeight);
        let scaleFactor = ObjectRenderer.BASE_RESOLUTION / maxDimension;
        
        // Aplicar límites
        const calculatedSize = maxDimension * scaleFactor;
        if (calculatedSize < ObjectRenderer.MIN_SIZE) {
          scaleFactor = ObjectRenderer.MIN_SIZE / maxDimension;
        } else if (calculatedSize > ObjectRenderer.MAX_SIZE) {
          scaleFactor = ObjectRenderer.MAX_SIZE / maxDimension;
        }
        
        const finalSize = {
          width: Math.floor(naturalWidth * scaleFactor),
          height: Math.floor(naturalHeight * scaleFactor)
        };
        
        // Guardar en cache
        this.resolutionCache.set(asset.path, finalSize);
        return finalSize;
      }
    }
    
    // Fallback si la imagen no está cargada
    return { width: fallbackSize, height: fallbackSize };
  }

  private initializeLayers(): void {
    // Crear layers estándar para renderizado en orden correcto
    const layers: RenderLayer[] = [
      { name: 'background', zIndex: 0, objects: [] },
      { name: 'terrain_decorations', zIndex: 10, objects: [] },
      { name: 'structures_back', zIndex: 20, objects: [] },
      { name: 'natural_elements', zIndex: 30, objects: [] },
      { name: 'furniture', zIndex: 40, objects: [] },
      { name: 'structures_front', zIndex: 50, objects: [] },
      { name: 'decorations', zIndex: 60, objects: [] },
      { name: 'particles', zIndex: 70, objects: [] },
    ];

    layers.forEach(layer => {
      this.renderLayers.set(layer.name, layer);
    });

    console.log(`🎭 ObjectRenderer: Inicializados ${layers.length} layers de renderizado`);
  }

  private async initializeAssets(): Promise<void> {
    try {
      // F2: Cargar assets usando las carpetas reales del catálogo
      await Promise.all([
        assetManager.loadAssetsByFolderName('structures'),
        assetManager.loadAssetsByFolderName('props'),
        assetManager.loadAssetsByFolderName('foliage'),
        assetManager.loadAssetsByFolderName('rocks'),
        assetManager.loadAssetsByFolderName('ruins'),
        assetManager.loadAssetsByFolderName('consumable_items'),
        assetManager.loadAssetsByFolderName('decals'),
        assetManager.loadAssetsByFolderName('mushrooms')
      ]);

      // F2: Usar taxonomía real en lugar de tipos hardcodeados
      this.structureAssets = [
        ...assetManager.getAssetsByCategory('buildings'),
        ...assetManager.getAssetsByCategory('structures')
      ];
      
      this.naturalAssets = [
        ...assetManager.getAssetsByCategory('nature'),
        ...assetManager.getAssetsByCategory('terrain')
      ];
      
      this.furnitureAssets = [
        ...assetManager.getAssetsByCategory('items'),
        ...assetManager.getAssetsByCategory('objects'),
        ...assetManager.getAssetsByCategory('decoration')
      ];

      // Cargar assets animados dinámicamente
      await this.loadAnimatedAssets();

      console.log(`🏗️ ObjectRenderer: Cargados ${this.structureAssets.length} structures, ${this.naturalAssets.length} natural elements, ${this.furnitureAssets.length} furniture, ${this.animatedAssets.length} animated`);
    } catch (error) {
      console.error('❌ Error cargando object assets:', error);
    }
  }

  /**
   * Detecta y carga automáticamente assets animados de cualquier carpeta/animated/
   */
  private async loadAnimatedAssets(): Promise<void> {
    try {
      // Cargar explícitamente las carpetas animadas que sabemos que existen
      const animatedFolders = [
        'animated_entities',
        'environmental_objects/animated'
      ];

      const animatedAssets: Asset[] = [];

      for (const folderPath of animatedFolders) {
        try {
          // Intentar cargar la carpeta animada
          await assetManager.loadAssetsByFolderName(folderPath);
          const assets = assetManager.getAssetsByType(folderPath);
          
          if (assets && assets.length > 0) {
            animatedAssets.push(...assets);
            console.log(`🎬 ObjectRenderer: Encontrados ${assets.length} assets animados en ${folderPath}`);
          }
        } catch {
          // Silenciosamente ignora carpetas que no existen
        }
      }

      this.animatedAssets = animatedAssets;
      console.log(`🎭 ObjectRenderer: Total assets animados cargados: ${this.animatedAssets.length}`);
    } catch (error) {
      console.error('❌ Error cargando assets animados:', error);
    }
  }

  /**
   * Set objects directly from unified MapElements (new unified approach)
   */
  public setObjectsFromMapElements(mapElements: MapElement[]): void {
    console.log('🏗️ ObjectRenderer: Configurando objetos desde MapElements unificados');
    this.clearAllLayers();

    mapElements.forEach(element => {
      const gameObject = this.createObjectFromElement(element);
      if (gameObject) {
        this.addObjectToLayer(gameObject);
      }
    });

    console.log(`✅ ObjectRenderer: ${mapElements.length} objetos configurados desde MapElements`);
  }

  /**
   * Genera objetos del juego basado en zonas y elementos del mapa
   */
  public generateGameObjects(zones: Zone[], mapElements: MapElement[]): void {
    this.clearAllLayers();

    // Generar objetos para cada zona
    zones.forEach(zone => {
      this.generateZoneObjects(zone);
    });

    // Generar objetos específicos del mapa
    mapElements.forEach(element => {
      this.generateElementObject(element);
    });

    // Generar decoraciones aleatorias
    this.generateRandomDecorations(zones);

    console.log(`🎮 ObjectRenderer: Generados objetos en ${this.getTotalObjectCount()} capas`);
  }

  private generateZoneObjects(zone: Zone): void {
    const zoneArea = zone.bounds.width * zone.bounds.height;
    // Densidad mucho mayor: 1 objeto cada 2500 píxeles (50x50) en lugar de 10000
    const objectDensity = Math.max(3, Math.floor(zoneArea / 2500)); 

    for (let i = 0; i < objectDensity; i++) {
      const x = zone.bounds.x + Math.random() * zone.bounds.width;
      const y = zone.bounds.y + Math.random() * zone.bounds.height;

      let gameObject: GameObject | null = null;

      switch (zone.type) {
        case 'rest':
          gameObject = this.createFurnitureObject(x, y, 'bed');
          break;
        case 'food':
          gameObject = this.createFurnitureObject(x, y, 'kitchen');
          break;
        case 'play':
          gameObject = this.createDecorationObject(x, y);
          break;
        case 'social':
          gameObject = this.createFurnitureObject(x, y, 'social');
          break;
        default: {
          // Más variedad de objetos para zonas generales
          const rand = Math.random();
          if (rand < 0.4) {
            gameObject = this.createNaturalObject(x, y);
          } else if (rand < 0.7) {
            gameObject = this.createStructureObject(x, y);
          } else {
            gameObject = this.createDecorationObject(x, y);
          }
          break;
        }
      }

      if (gameObject) {
        this.addObjectToLayer(gameObject);
      }
    }
  }

  private generateElementObject(element: MapElement): void {
    const gameObject = this.createObjectFromElement(element);
    if (gameObject) {
      this.addObjectToLayer(gameObject);
    }
  }

  private createObjectFromElement(element: MapElement): GameObject | null {
    const { position } = element;
    
    switch (element.type) {
      case 'food_zone':
        return this.createFurnitureObject(position.x, position.y, 'kitchen');
      case 'rest_zone':
        return this.createFurnitureObject(position.x, position.y, 'bed');
      case 'play_zone':
        return this.createDecorationObject(position.x, position.y);
      case 'social_zone':
        return this.createFurnitureObject(position.x, position.y, 'social');
      case 'obstacle':
        return this.createStructureObject(position.x, position.y);
      case 'decoration':
        return this.createNaturalObject(position.x, position.y);
      default:
        return this.createNaturalObject(position.x, position.y);
    }
  }

  private createStructureObject(x: number, y: number): GameObject {
    const asset = this.getRandomAsset(this.structureAssets) || this.createFallbackAsset('structure');
    const size = this.getAssetSize(asset, 128); // Estructuras tienden a ser más grandes
    
    return {
      id: `structure_${Date.now()}_${Math.random()}`,
      type: 'structure',
      asset,
      position: { x, y, z: 20 },
      scale: {
        width: size.width,
        height: size.height
      },
      rotation: 0,
      metadata: {
        isCollider: true,
        isInteractable: true,
        shadowOffset: { x: 4, y: 4 },
        anchor: { x: 0.5, y: 0.8 } // Anclaje inferior-centro para estructuras
      }
    };
  }

  private createNaturalObject(x: number, y: number): GameObject {
    const asset = this.getRandomAsset(this.naturalAssets) || this.createFallbackAsset('natural');
    const size = this.getAssetSize(asset, 64); // Tamaño estándar para elementos naturales
    
    return {
      id: `natural_${Date.now()}_${Math.random()}`,
      type: 'natural',
      asset,
      position: { x, y, z: 30 },
      scale: {
        width: size.width,
        height: size.height
      },
      rotation: 0, // Sin rotación aleatoria para elementos naturales
      metadata: {
        isCollider: Math.random() > 0.3, // 70% son coliders
        isInteractable: Math.random() > 0.7, // 30% son interactuables
        shadowOffset: { x: 2, y: 2 },
        anchor: { x: 0.5, y: 0.9 } // Anclaje inferior-centro
      }
    };
  }

  private createFurnitureObject(x: number, y: number, _category: string): GameObject {
    const asset = this.getRandomAsset(this.furnitureAssets) || this.createFallbackAsset('furniture');
    const size = this.getAssetSize(asset, 64); // Tamaño estándar para muebles
    
    return {
      id: `furniture_${Date.now()}_${Math.random()}`,
      type: 'furniture',
      asset,
      position: { x, y, z: 40 },
      scale: {
        width: size.width,
        height: size.height
      },
      rotation: 0, // Sin rotaciones aleatorias para muebles
      metadata: {
        isCollider: true,
        isInteractable: true,
        shadowOffset: { x: 2, y: 2 },
        anchor: { x: 0.5, y: 0.8 }
      }
    };
  }

  private createDecorationObject(x: number, y: number): GameObject {
    // 30% de probabilidad de usar un asset animado si está disponible
    const useAnimated = Math.random() < 0.3 && this.animatedAssets.length > 0;
    
    let asset: Asset;
    if (useAnimated) {
      asset = this.getRandomAsset(this.animatedAssets) || this.createFallbackAsset('decoration');
    } else {
      asset = this.getRandomAsset([...this.naturalAssets, ...this.furnitureAssets]) || this.createFallbackAsset('decoration');
    }
    
    const size = this.getAssetSize(asset, 32); // Tamaño pequeño para decoraciones
    
    return {
      id: `decoration_${Date.now()}_${Math.random()}`,
      type: 'decoration',
      asset,
      position: { x, y, z: 60 },
      scale: {
        width: size.width,
        height: size.height
      },
      rotation: Math.random() * 360,
      metadata: {
        isCollider: false,
        isInteractable: false,
        shadowOffset: { x: 1, y: 1 },
        anchor: { x: 0.5, y: 0.5 },
        isAnimated: useAnimated // Marcar si es animado
      }
    };
  }

  /**
   * Crea un objeto animado específicamente
   */
  private createAnimatedObject(x: number, y: number): GameObject {
    const asset = this.getRandomAsset(this.animatedAssets) || this.createFallbackAsset('animated');
    const size = this.getAssetSize(asset, 48); // Tamaño medio para animaciones
    
    return {
      id: `animated_${Date.now()}_${Math.random()}`,
      type: 'decoration',
      asset,
      position: { x, y, z: 45 },
      scale: {
        width: size.width,
        height: size.height
      },
      rotation: 0, // No rotar animaciones
      metadata: {
        isCollider: false,
        isInteractable: true, // Los objetos animados pueden ser interactivos
        shadowOffset: { x: 2, y: 2 },
        anchor: { x: 0.5, y: 0.8 },
        isAnimated: true
      }
    };
  }

  private generateRandomDecorations(zones: Zone[]): void {
    // Generar MUCHAS más decoraciones aleatorias en áreas vacías
    zones.forEach(zone => {
      const zoneArea = zone.bounds.width * zone.bounds.height;
      // Generar decoraciones en función del área - 1 decoración cada 1000 píxeles  
      const decorationCount = Math.max(5, Math.floor(zoneArea / 1000));
      
      for (let i = 0; i < decorationCount; i++) {
        const x = zone.bounds.x + Math.random() * zone.bounds.width;
        const y = zone.bounds.y + Math.random() * zone.bounds.height;
        
        const decoration = this.createDecorationObject(x, y);
        this.addObjectToLayer(decoration);
      }
    });

    // Además, generar objetos dispersos por todo el mapa (fuera de zonas)
    const mapWidth = 4000;
    const mapHeight = 3000;
    const extraObjectCount = Math.floor((mapWidth * mapHeight) / 5000); // 1 objeto cada 5000 píxeles

    for (let i = 0; i < extraObjectCount; i++) {
      const x = Math.random() * mapWidth;
      const y = Math.random() * mapHeight;
      
      // Verificar que no esté dentro de una zona existente
      const inZone = zones.some(zone => 
        x >= zone.bounds.x && x <= zone.bounds.x + zone.bounds.width &&
        y >= zone.bounds.y && y <= zone.bounds.y + zone.bounds.height
      );
      
      if (!inZone) {
        const rand = Math.random();
        let object: GameObject;
        
        if (rand < 0.4) {
          object = this.createNaturalObject(x, y);
        } else if (rand < 0.6) {
          object = this.createDecorationObject(x, y);
        } else if (rand < 0.8) {
          object = this.createStructureObject(x, y);
        } else {
          // 20% de probabilidad de crear un objeto específicamente animado
          object = this.createAnimatedObject(x, y);
        }
        
        this.addObjectToLayer(object);
      }
    }
  }

  private addObjectToLayer(gameObject: GameObject): void {
    let layerName: string;
    
    switch (gameObject.type) {
      case 'structure':
        layerName = gameObject.position.z < 25 ? 'structures_back' : 'structures_front';
        break;
      case 'natural':
        layerName = 'natural_elements';
        break;
      case 'furniture':
        layerName = 'furniture';
        break;
      case 'decoration':
        layerName = 'decorations';
        break;
      default:
        layerName = 'background';
    }

    const layer = this.renderLayers.get(layerName);
    if (layer) {
      layer.objects.push(gameObject);
    }
  }

  /**
   * Renderiza todos los objetos en las capas apropiadas
   */
  public renderObjects(
    ctx: CanvasRenderingContext2D,
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number,
    zoom: number = 1
  ): void {
    // Renderizar capas en orden de z-index
    const sortedLayers = Array.from(this.renderLayers.values())
      .sort((a, b) => a.zIndex - b.zIndex);

    sortedLayers.forEach(layer => {
      layer.objects.forEach(obj => {
        this.renderGameObject(ctx, obj, viewportX, viewportY, viewportWidth, viewportHeight, zoom);
      });
    });
  }

  private renderGameObject(
    ctx: CanvasRenderingContext2D,
    obj: GameObject,
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number,
    zoom: number
  ): void {
    if (!obj.asset.image) return;

    // Calcular posición en pantalla
    const screenX = (obj.position.x - viewportX) * zoom;
    const screenY = (obj.position.y - viewportY) * zoom;
    const scaledWidth = obj.scale.width * zoom;
    const scaledHeight = obj.scale.height * zoom;

    // Culling: No renderizar objetos fuera de la pantalla
    if (screenX + scaledWidth < 0 || screenX > viewportWidth ||
        screenY + scaledHeight < 0 || screenY > viewportHeight) {
      return;
    }

    ctx.save();

    // F2: Configurar pixel-perfect rendering para assets pixel-art
    if (obj.asset.isPixelArt) {
      ctx.imageSmoothingEnabled = false;
      // Fallbacks para compatibilidad con navegadores antiguos
      const ctxAny = ctx as any;
      ctxAny.webkitImageSmoothingEnabled = false;
      ctxAny.mozImageSmoothingEnabled = false;
      ctxAny.msImageSmoothingEnabled = false;
    } else {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    // Aplicar anclaje
    const anchorX = obj.metadata.anchor?.x || 0.5;
    const anchorY = obj.metadata.anchor?.y || 0.5;
    const drawX = screenX - (scaledWidth * anchorX);
    const drawY = screenY - (scaledHeight * anchorY);

    // Renderizar sombra si existe
    if (obj.metadata.shadowOffset) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(
        drawX + (obj.metadata.shadowOffset.x * zoom),
        drawY + (scaledHeight * 0.9) + (obj.metadata.shadowOffset.y * zoom),
        scaledWidth * 0.8,
        scaledHeight * 0.2
      );
      ctx.globalAlpha = 1;
    }

    // Aplicar rotación
    if (obj.rotation !== 0) {
      ctx.translate(screenX, screenY);
      ctx.rotate((obj.rotation * Math.PI) / 180);
      ctx.translate(-screenX, -screenY);
    }

    // Renderizar objeto
    ctx.drawImage(
      obj.asset.image,
      drawX,
      drawY,
      scaledWidth,
      scaledHeight
    );

    ctx.restore();
  }

  private getRandomAsset(assets: Asset[]): Asset | null {
    return assets.length > 0 ? assets[Math.floor(Math.random() * assets.length)] : null;
  }

  private createFallbackAsset(type: string): Asset {
    return {
      path: `/assets/${type}/fallback.png`,
      image: new Image(), // Crear imagen vacía en lugar de null
      type: type as 'structures' | 'natural_elements' | 'furniture_objects',
      size: ObjectRenderer.BASE_RESOLUTION
    };
  }

  private clearAllLayers(): void {
    this.renderLayers.forEach(layer => {
      layer.objects = [];
    });
  }

  private getTotalObjectCount(): number {
    return Array.from(this.renderLayers.values())
      .reduce((total, layer) => total + layer.objects.length, 0);
  }

  public getObjectsInArea(x: number, y: number, width: number, height: number): GameObject[] {
    const result: GameObject[] = [];
    
    this.renderLayers.forEach(layer => {
      layer.objects.forEach(obj => {
        if (obj.position.x >= x && obj.position.x <= x + width &&
            obj.position.y >= y && obj.position.y <= y + height) {
          result.push(obj);
        }
      });
    });

    return result;
  }
}

export const objectRenderer = new ObjectRenderer();
