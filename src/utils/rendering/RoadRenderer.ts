/**
 * F3: RoadRenderer - Renderizado de caminos con bitmask y variantes
 */

import { assetManager, type Asset } from '../modernAssetManager';
import { TILE_SIZE } from '../../constants/mapConstants';
import type { RoadPolyline as BaseRoadPolyline } from '../../types';

// Use the base type from types/index.ts
export type RoadPolyline = BaseRoadPolyline;

export interface RoadTile {
  x: number;
  y: number;
  bitmask: number; // N=1, E=2, S=4, W=8
  variant: 'straight' | 'curve' | 't_junction' | 'cross' | 'end';
  asset: Asset | null;
}

export class RoadRenderer {
  private roadAssets: Asset[] = [];
  private roadTiles: Map<string, RoadTile> = new Map();
  private isInitialized = false;

  constructor() {
    this.initializeRoadAssets();
  }

  /**
   * F3: Inicializa assets de roads desde la carpeta real
   */
  private async initializeRoadAssets(): Promise<void> {
    try {
      // Cargar assets de la carpeta roads real
      this.roadAssets = await assetManager.loadAssetsByFolderName('roads');
      console.log(`🛣️ RoadRenderer: Cargados ${this.roadAssets.length} assets de roads`);
      this.isInitialized = true;
    } catch (error) {
      console.warn('⚠️ RoadRenderer: Error cargando assets de roads:', error);
      this.isInitialized = false;
    }
  }

  /**
   * F3: Convierte polylines de roads a tiles con bitmask
   */
  public rasterizeRoads(roads: RoadPolyline[]): RoadTile[] {
    const roadTiles: RoadTile[] = [];
    const tileMap = new Map<string, number>(); // "x,y" -> bitmask

    // Rasterizar cada polyline a tiles
    for (const road of roads) {
      for (let i = 0; i < road.points.length - 1; i++) {
        const start = road.points[i];
        const end = road.points[i + 1];
        
        // Interpolación de línea entre puntos
        const tiles = this.interpolateLine(start, end, road.width);
        
        for (const tile of tiles) {
          const key = `${tile.x},${tile.y}`;
          const existingBitmask = tileMap.get(key) || 0;
          tileMap.set(key, existingBitmask | tile.bitmask);
        }
      }
    }

    // Convertir mapa de bitmasks a RoadTiles con variantes
    for (const [key, bitmask] of tileMap) {
      const [x, y] = key.split(',').map(Number);
      const variant = this.bitmaskToVariant(bitmask);
      const asset = this.getAssetForVariant(variant);
      
      roadTiles.push({
        x,
        y,
        bitmask,
        variant,
        asset
      });
    }

    console.log(`🛣️ RoadRenderer: Rasterizados ${roadTiles.length} road tiles`);
    return roadTiles;
  }

  /**
   * F3: Interpola línea entre dos puntos
   */
  private interpolateLine(start: { x: number; y: number }, end: { x: number; y: number }, _width: number): RoadTile[] {
    const tiles: RoadTile[] = [];
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(distance / (TILE_SIZE / 2)); // Más granular
    
    for (let i = 0; i <= steps; i++) {
      const t = steps > 0 ? i / steps : 0;
      const x = Math.floor((start.x + dx * t) / TILE_SIZE);
      const y = Math.floor((start.y + dy * t) / TILE_SIZE);
      
      // Calcular dirección para bitmask
      let bitmask = 0;
      if (i > 0) { // No es el primer punto
        if (Math.abs(dx) > Math.abs(dy)) {
          bitmask |= dx > 0 ? 8 : 2; // W o E
        } else {
          bitmask |= dy > 0 ? 1 : 4; // N o S
        }
      }
      if (i < steps) { // No es el último punto
        if (Math.abs(dx) > Math.abs(dy)) {
          bitmask |= dx > 0 ? 2 : 8; // E o W
        } else {
          bitmask |= dy > 0 ? 4 : 1; // S o N
        }
      }
      
      tiles.push({
        x,
        y,
        bitmask,
        variant: 'straight', // Se recalculará después
        asset: null
      });
    }
    
    return tiles;
  }

  /**
   * F3: Convierte bitmask a variante de camino
   */
  private bitmaskToVariant(bitmask: number): 'straight' | 'curve' | 't_junction' | 'cross' | 'end' {
    const connectionCount = this.countBits(bitmask);
    
    switch (connectionCount) {
      case 1:
        return 'end';
      case 2:
        // Verificar si es línea recta (opuestos) o curva
        if ((bitmask & 5) === 5 || (bitmask & 10) === 10) { // N-S o E-W
          return 'straight';
        } else {
          return 'curve';
        }
      case 3:
        return 't_junction';
      case 4:
        return 'cross';
      default:
        return 'straight';
    }
  }

  /**
   * F3: Cuenta bits activos en bitmask
   */
  private countBits(bitmask: number): number {
    let count = 0;
    for (let i = 0; i < 4; i++) {
      if (bitmask & (1 << i)) count++;
    }
    return count;
  }

  /**
   * F3: Obtiene asset apropiado para variante
   */
  private getAssetForVariant(variant: string): Asset | null {
    if (!this.isInitialized || this.roadAssets.length === 0) {
      return null;
    }

    // Buscar asset por nombre de variante
    const assetNames = {
      'straight': ['road_straight', 'path_straight', 'line'],
      'curve': ['road_curve', 'path_curve', 'corner'],
      't_junction': ['road_t', 'path_t', 'junction_t'],
      'cross': ['road_cross', 'path_cross', 'intersection'],
      'end': ['road_end', 'path_end', 'terminal']
    };

    const possibleNames = assetNames[variant as keyof typeof assetNames] || ['road_straight'];
    
    for (const name of possibleNames) {
      const asset = this.roadAssets.find(a => a.id?.includes(name) || a.path.includes(name));
      if (asset) {
        return asset;
      }
    }

    // Fallback al primer asset disponible
    return this.roadAssets[0] || null;
  }

  /**
   * F3: Renderiza roads en el canvas
   */
  public render(
    ctx: CanvasRenderingContext2D,
    roads: RoadPolyline[],
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number,
    zoom: number = 1
  ): void {
    if (!this.isInitialized || roads.length === 0) {
      return;
    }

    // F3: Configurar pixel-perfect para roads
    ctx.imageSmoothingEnabled = false;

    // Rasterizar roads a tiles
    const roadTiles = this.rasterizeRoads(roads);
    
    // Renderizar cada tile
    let renderedCount = 0;
    for (const tile of roadTiles) {
      if (!tile.asset?.image) continue;

      const screenX = (tile.x * TILE_SIZE - viewportX) * zoom;
      const screenY = (tile.y * TILE_SIZE - viewportY) * zoom;
      const scaledSize = TILE_SIZE * zoom;

      // Culling: verificar si está en viewport
      if (screenX + scaledSize < 0 || screenX > viewportWidth ||
          screenY + scaledSize < 0 || screenY > viewportHeight) {
        continue;
      }

      // Renderizar tile de road
      ctx.drawImage(
        tile.asset.image,
        screenX,
        screenY,
        scaledSize,
        scaledSize
      );
      
      renderedCount++;
    }

    if (renderedCount > 0) {
      console.log(`🛣️ RoadRenderer: Renderizados ${renderedCount}/${roadTiles.length} road tiles`);
    }
  }

  /**
   * F3: Estadísticas de roads renderizados
   */
  public getStats() {
    const variantCounts = new Map<string, number>();
    
    for (const tile of this.roadTiles.values()) {
      const current = variantCounts.get(tile.variant) || 0;
      variantCounts.set(tile.variant, current + 1);
    }

    return {
      totalTiles: this.roadTiles.size,
      assetsLoaded: this.roadAssets.length,
      isInitialized: this.isInitialized,
      variants: Object.fromEntries(variantCounts)
    };
  }
}
