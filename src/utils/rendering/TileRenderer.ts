/**
 * Sistema de renderizado de tiles profesional
 * Implementa estándares de la industria para juegos 2D top-down
 */

import { assetManager, type Asset } from '../modernAssetManager';

export interface TileData {
  tileId: string;
  assetPath: string;
  x: number;
  y: number;
  variant?: string;
}

export interface TerrainMap {
  width: number;
  height: number;
  tileSize: number;
  tiles: TileData[][];
}

export class TileRenderer {
  private static readonly TILE_SIZE = 64; // Tamaño estándar para tiles
  
  private terrainAssets: Asset[] = [];

  constructor() {
    this.initializeTerrainAssets();
  }

  private async initializeTerrainAssets(): Promise<void> {
    try {
      // Cargar todos los assets de terrain_tiles
      await assetManager.loadAssetsByFolderName('terrain_tiles');
      this.terrainAssets = assetManager.getAssetsByType('terrain_tiles');
      console.log(`🌱 TileRenderer: Cargados ${this.terrainAssets.length} terrain assets`);
    } catch (error) {
      console.error('❌ Error cargando terrain assets:', error);
    }
  }

  /**
   * Genera un mapa de terreno procedural usando los assets disponibles
   */
  public generateTerrainMap(width: number, height: number): TerrainMap {
    const tileWidth = Math.ceil(width / TileRenderer.TILE_SIZE);
    const tileHeight = Math.ceil(height / TileRenderer.TILE_SIZE);
    
    const tiles: TileData[][] = [];
    
    for (let y = 0; y < tileHeight; y++) {
      tiles[y] = [];
      for (let x = 0; x < tileWidth; x++) {
        // Usar noise o patrón para variar los tiles
        const noiseValue = this.generateNoise(x, y);
        const terrainAsset = this.selectTerrainAsset(noiseValue);
        
        tiles[y][x] = {
          tileId: `${x}_${y}`,
          assetPath: terrainAsset.path,
          x: x * TileRenderer.TILE_SIZE,
          y: y * TileRenderer.TILE_SIZE,
          variant: terrainAsset.path.includes('cesped') ? 'grass' : 'base'
        };
      }
    }

    return {
      width: tileWidth,
      height: tileHeight,
      tileSize: TileRenderer.TILE_SIZE,
      tiles
    };
  }

  /**
   * Renderiza el mapa de terreno en el canvas
   */
  public renderTerrain(
    ctx: CanvasRenderingContext2D,
    terrainMap: TerrainMap,
    viewportX: number,
    viewportY: number,
    viewportWidth: number,
    viewportHeight: number,
    zoom: number = 1
  ): void {
    // Calcular qué tiles están visibles
    const startTileX = Math.floor(viewportX / (TileRenderer.TILE_SIZE * zoom));
    const endTileX = Math.ceil((viewportX + viewportWidth) / (TileRenderer.TILE_SIZE * zoom));
    const startTileY = Math.floor(viewportY / (TileRenderer.TILE_SIZE * zoom));
    const endTileY = Math.ceil((viewportY + viewportHeight) / (TileRenderer.TILE_SIZE * zoom));

    // Renderizar solo tiles visibles para optimización
    for (let tileY = Math.max(0, startTileY); tileY < Math.min(terrainMap.height, endTileY); tileY++) {
      for (let tileX = Math.max(0, startTileX); tileX < Math.min(terrainMap.width, endTileX); tileX++) {
        const tile = terrainMap.tiles[tileY]?.[tileX];
        if (!tile) continue;

        const asset = assetManager.getAssetByPath(tile.assetPath);
        if (!asset?.image) continue;

        const screenX = tile.x * zoom - viewportX;
        const screenY = tile.y * zoom - viewportY;
        const tileSize = TileRenderer.TILE_SIZE * zoom;

        ctx.drawImage(
          asset.image,
          screenX,
          screenY,
          tileSize,
          tileSize
        );
      }
    }
  }

  /**
   * Genera ruido simple para variación de terreno
   */
  private generateNoise(x: number, y: number): number {
    // Simple noise function basada en posición
    const a = Math.sin(x * 0.1) * Math.cos(y * 0.1);
    const b = Math.sin(x * 0.05 + y * 0.05) * 0.5;
    return (a + b + 2) / 4; // Normalizar a 0-1
  }

  /**
   * Selecciona asset de terreno basado en valor de noise
   */
  private selectTerrainAsset(noiseValue: number): Asset {
    if (this.terrainAssets.length === 0) {
      // Fallback si no hay assets cargados
      return {
        path: '/assets/terrain_tiles/cesped1.png',
        image: null,
        type: 'terrain_tiles',
        size: TileRenderer.TILE_SIZE
      };
    }

    // Usar diferentes césped basado en noise
    const grassAssets = this.terrainAssets.filter(asset => asset.path.includes('cesped'));
    if (grassAssets.length > 0) {
      const index = Math.floor(noiseValue * grassAssets.length);
      return grassAssets[Math.min(index, grassAssets.length - 1)];
    }

    return this.terrainAssets[0];
  }

  /**
   * Obtiene información del tile en una posición específica
   */
  public getTileAt(terrainMap: TerrainMap, worldX: number, worldY: number): TileData | null {
    const tileX = Math.floor(worldX / TileRenderer.TILE_SIZE);
    const tileY = Math.floor(worldY / TileRenderer.TILE_SIZE);
    
    if (tileX >= 0 && tileX < terrainMap.width && tileY >= 0 && tileY < terrainMap.height) {
      return terrainMap.tiles[tileY][tileX];
    }
    
    return null;
  }

  public static getTileSize(): number {
    return TileRenderer.TILE_SIZE;
  }
}

export const tileRenderer = new TileRenderer();
