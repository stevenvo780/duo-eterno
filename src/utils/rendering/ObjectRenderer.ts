/**
 * Sistema de renderizado de objetos profesional
 * Maneja estructuras, elementos naturales, y objetos del juego
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
  };
}

export interface RenderLayer {
  name: string;
  zIndex: number;
  objects: GameObject[];
}

export class ObjectRenderer {
  private static readonly STANDARD_OBJECT_SIZE = 64; // Tamaño base para objetos
  private static readonly LARGE_OBJECT_SIZE = 128; // Para estructuras grandes
  private static readonly SMALL_OBJECT_SIZE = 32; // Para decoraciones pequeñas

  private renderLayers: Map<string, RenderLayer> = new Map();
  private structureAssets: Asset[] = [];
  private naturalAssets: Asset[] = [];
  private furnitureAssets: Asset[] = [];

  constructor() {
    this.initializeLayers();
    this.initializeAssets();
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
      // Cargar assets de diferentes categorías
      await Promise.all([
        assetManager.loadAssetsByFolderName('structures'),
        assetManager.loadAssetsByFolderName('natural_elements'),
        assetManager.loadAssetsByFolderName('furniture_objects')
      ]);

      this.structureAssets = assetManager.getAssetsByType('structures');
      this.naturalAssets = assetManager.getAssetsByType('natural_elements');
      this.furnitureAssets = assetManager.getAssetsByType('furniture_objects');

      console.log(`🏗️ ObjectRenderer: Cargados ${this.structureAssets.length} structures, ${this.naturalAssets.length} natural elements, ${this.furnitureAssets.length} furniture`);
    } catch (error) {
      console.error('❌ Error cargando object assets:', error);
    }
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
    const objectDensity = Math.max(1, Math.floor(zoneArea / 10000)); // Un objeto cada 100x100 pixels

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
        default:
          gameObject = this.createNaturalObject(x, y);
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
    
    return {
      id: `structure_${Date.now()}_${Math.random()}`,
      type: 'structure',
      asset,
      position: { x, y, z: 20 },
      scale: {
        width: ObjectRenderer.LARGE_OBJECT_SIZE,
        height: ObjectRenderer.LARGE_OBJECT_SIZE
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
    
    return {
      id: `natural_${Date.now()}_${Math.random()}`,
      type: 'natural',
      asset,
      position: { x, y, z: 30 },
      scale: {
        width: ObjectRenderer.STANDARD_OBJECT_SIZE,
        height: ObjectRenderer.STANDARD_OBJECT_SIZE
      },
      rotation: Math.random() * 360,
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
    
    return {
      id: `furniture_${Date.now()}_${Math.random()}`,
      type: 'furniture',
      asset,
      position: { x, y, z: 40 },
      scale: {
        width: ObjectRenderer.STANDARD_OBJECT_SIZE,
        height: ObjectRenderer.STANDARD_OBJECT_SIZE
      },
      rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)], // Rotaciones de 90 grados
      metadata: {
        isCollider: true,
        isInteractable: true,
        shadowOffset: { x: 2, y: 2 },
        anchor: { x: 0.5, y: 0.8 }
      }
    };
  }

  private createDecorationObject(x: number, y: number): GameObject {
    const asset = this.getRandomAsset([...this.naturalAssets, ...this.furnitureAssets]) || this.createFallbackAsset('decoration');
    
    return {
      id: `decoration_${Date.now()}_${Math.random()}`,
      type: 'decoration',
      asset,
      position: { x, y, z: 60 },
      scale: {
        width: ObjectRenderer.SMALL_OBJECT_SIZE,
        height: ObjectRenderer.SMALL_OBJECT_SIZE
      },
      rotation: Math.random() * 360,
      metadata: {
        isCollider: false,
        isInteractable: false,
        shadowOffset: { x: 1, y: 1 },
        anchor: { x: 0.5, y: 0.5 }
      }
    };
  }

  private generateRandomDecorations(zones: Zone[]): void {
    // Generar decoraciones aleatorias en áreas vacías
    zones.forEach(zone => {
      const decorationCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < decorationCount; i++) {
        const x = zone.bounds.x + Math.random() * zone.bounds.width;
        const y = zone.bounds.y + Math.random() * zone.bounds.height;
        
        const decoration = this.createDecorationObject(x, y);
        this.addObjectToLayer(decoration);
      }
    });
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
      size: ObjectRenderer.STANDARD_OBJECT_SIZE
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
