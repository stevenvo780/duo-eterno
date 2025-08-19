/**
 * Renderizado de tiles para mapa 2D top‑down.
 */

import { assetManager, type Asset } from '../modernAssetManager';
import type { TerrainTile } from '../../types';
import { TILE_SIZE } from '../../constants/mapConstants';

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
  private terrainAssets: Asset[] = [];

  constructor() {
    this.initializeTerrainAssets();
  }

  private async initializeTerrainAssets(): Promise<void> {
    try {
      // F2: Load terrain assets from subcarpeta real 'terrain/base'
      console.log('🌱 TileRenderer: Cargando assets de terrain/base...');
      
      // Try to load from the actual terrain subfolder structure
      const terrainBaseAssets = [
        'cesped1.png', 'cesped2.png', 'cesped3.png', 'cesped4.png', 'cesped5.png',
        'cesped6.png', 'cesped7.png', 'cesped8.png', 'cesped9.png', 'cesped10.png',
        'cesped11.png', 'cesped12.png', 'cesped13.png', 'cesped14.png', 'cesped15.png',
        'cesped16.png', 'cesped17.png', 'cesped18.png', 'cesped19.png', 'cesped20.png',
        'cesped21.png', 'cesped22.png', 'cesped23.png', 'cesped24.png', 'cesped25.png',
        'cesped26.png', 'cesped27.png', 'cesped28.png', 'cesped29.png', 'cesped30.png',
        'cesped31.png', 'Grass_Middle.png', 'TexturedGrass.png'
      ];
      
      // Load terrain assets manually since they're in subfolders
      for (const fileName of terrainBaseAssets) {
        try {
          const assetPath = `/assets/terrain/base/${fileName}`;
          const asset = await this.loadTerrainAsset(assetPath, fileName);
          if (asset) {
            this.terrainAssets.push(asset);
          }
        } catch (error) {
          console.warn(`⚠️ No se pudo cargar terrain asset: ${fileName}`, error);
        }
      }
      
      console.log(`🌱 TileRenderer: Cargados ${this.terrainAssets.length} terrain assets`);
      
      if (this.terrainAssets.length === 0) {
        console.error('❌ No se encontraron assets de terreno');
      }
    } catch (error) {
      console.error('❌ Error cargando terrain assets:', error);
    }
  }
  
  private async loadTerrainAsset(assetPath: string, fileName: string): Promise<Asset | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const asset: Asset = {
          id: fileName.replace('.png', ''),
          path: assetPath,
          image: img,
          loaded: true,
          type: 'terrain',
          size: 0, // Will be calculated if needed
          isPixelArt: true,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          taxonomy: {
            category: 'terrain',
            subcategory: 'base',
            tags: ['grass', 'ground']
          }
        };
        resolve(asset);
      };
      img.onerror = () => resolve(null);
      img.src = assetPath;
    });
  }

  /**
   * F3: Build TerrainMap from unified terrainTiles
   */
  public static fromUnifiedTiles(terrainTiles: TerrainTile[], tileSize = TILE_SIZE): TerrainMap {
    if (terrainTiles.length === 0) {
      console.warn('⚠️ TileRenderer.fromUnifiedTiles: No terrain tiles provided');
      return {
        width: 0,
        height: 0,
        tileSize,
        tiles: []
      };
    }

    // Calcular dimensiones del mapa basado en tiles
    const maxX = Math.max(...terrainTiles.map(t => t.x));
    const maxY = Math.max(...terrainTiles.map(t => t.y));
    const width = maxX + 1;
    const height = maxY + 1;

    // Inicializar grilla de tiles
    const tiles: TileData[][] = Array(height).fill(null).map(() => 
      Array(width).fill(null).map(() => ({
        tileId: 'empty',
        assetPath: '',
        x: 0,
        y: 0
      }))
    );

    // Poblar grilla desde terrainTiles
    for (const terrainTile of terrainTiles) {
      if (terrainTile.x >= 0 && terrainTile.x < width && 
          terrainTile.y >= 0 && terrainTile.y < height) {
        tiles[terrainTile.y][terrainTile.x] = {
          tileId: terrainTile.assetId,
          assetPath: terrainTile.assetId, // Use direct assetId since it's already the full path
          x: terrainTile.x * tileSize,
          y: terrainTile.y * tileSize,
          variant: terrainTile.variant?.toString()
        };
      }
    }

    console.log(`🗺️ TileRenderer.fromUnifiedTiles: Built ${width}×${height} terrain map`);
    
    return {
      width,
      height,
      tileSize,
      tiles
    };
  }

  /**
   * F3: Apply autotiles with bitmask logic - DUPLICATE REMOVED
   */

  /**
   * F3: Calculate neighbor bitmask for autotiles (N=1, E=2, S=4, W=8)
   */
  private calculateNeighborBitmask(tiles: TileData[][], x: number, y: number, tileId: string): number {
    const height = tiles.length;
    const width = tiles[0]?.length || 0;
    let bitmask = 0;

    // North (up)
    if (y > 0 && tiles[y - 1][x]?.tileId === tileId) {
      bitmask |= 1;
    }
    
    // East (right)
    if (x < width - 1 && tiles[y][x + 1]?.tileId === tileId) {
      bitmask |= 2;
    }
    
    // South (down)
    if (y < height - 1 && tiles[y + 1][x]?.tileId === tileId) {
      bitmask |= 4;
    }
    
    // West (left)
    if (x > 0 && tiles[y][x - 1]?.tileId === tileId) {
      bitmask |= 8;
    }

    return bitmask;
  }

  /**
   * F3: Convert bitmask to autotile variant
   */
  private bitmaskToAutotileVariant(bitmask: number): string {
    // Mapeo de bitmask a variantes de autotile
    const variantMap: Record<number, string> = {
      0: 'isolated',     // Sin vecinos
      1: 'end_s',        // Solo norte
      2: 'end_w',        // Solo este  
      3: 'corner_sw',    // Norte + este
      4: 'end_n',        // Solo sur
      5: 'vertical',     // Norte + sur
      6: 'corner_nw',    // Este + sur
      7: 't_w',          // Norte + este + sur
      8: 'end_e',        // Solo oeste
      9: 'corner_se',    // Norte + oeste
      10: 'horizontal',  // Este + oeste
      11: 't_s',         // Norte + este + oeste
      12: 'corner_ne',   // Sur + oeste
      13: 't_e',         // Norte + sur + oeste
      14: 't_n',         // Este + sur + oeste
      15: 'center'       // Todos los vecinos
    };

    return variantMap[bitmask] || 'isolated';
  }

  /**
   * Generate default terrain map - moved down from duplicate section
   */

  /**
   * Apply autotiles using bitmask for seamless terrain transitions
   * Implemented in Phase F3
   */
  public applyAutotiles(terrainMap: TerrainMap): TerrainMap {
    const { width, height, tiles, tileSize } = terrainMap;
    const autoTiledMap: TerrainMap = {
      width,
      height,
      tileSize,
      tiles: tiles.map(row => [...row]) // Deep copy
    };

    // F3: Aplicar autotiles a cada tile
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const currentTile = tiles[y][x];
        if (!currentTile || currentTile.tileId === 'empty') continue;

        // Calcular bitmask de vecinos del mismo tipo
        const bitmask = this.calculateNeighborBitmask(tiles, x, y, currentTile.tileId);
        
        // Determinar variante de autotile basada en bitmask
        const autotileVariant = this.bitmaskToAutotileVariant(bitmask);
        
        // Actualizar tile con variante de autotile
        autoTiledMap.tiles[y][x] = {
          ...currentTile,
          variant: autotileVariant
        };
      }
    }

    console.log(`🧩 TileRenderer.applyAutotiles: Applied autotiles to ${width}×${height} map`);
    return autoTiledMap;
  }

  /**
   * Genera un mapa de terreno procedural usando los assets disponibles
   */
  public generateTerrainMap(width: number, height: number): TerrainMap {
    const tileWidth = Math.ceil(width / TILE_SIZE);
    const tileHeight = Math.ceil(height / TILE_SIZE);
    
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
          x: x * TILE_SIZE,
          y: y * TILE_SIZE,
          variant: terrainAsset.path.includes('cesped') ? 'grass' : 'base'
        };
      }
    }

    return {
      width: tileWidth,
      height: tileHeight,
      tileSize: TILE_SIZE,
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
    // Force pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;
    
    // Calcular qué tiles están visibles
    const startTileX = Math.floor(viewportX / (TILE_SIZE * zoom));
    const endTileX = Math.ceil((viewportX + viewportWidth) / (TILE_SIZE * zoom));
    const startTileY = Math.floor(viewportY / (TILE_SIZE * zoom));
    const endTileY = Math.ceil((viewportY + viewportHeight) / (TILE_SIZE * zoom));

    // Renderizar solo tiles visibles para optimización
    for (let tileY = Math.max(0, startTileY); tileY < Math.min(terrainMap.height, endTileY); tileY++) {
      for (let tileX = Math.max(0, startTileX); tileX < Math.min(terrainMap.width, endTileX); tileX++) {
        const tile = terrainMap.tiles[tileY]?.[tileX];
        if (!tile || !tile.assetPath) continue;

        const asset = assetManager.getAssetByPath(tile.assetPath);
        if (!asset?.image) continue;

        const screenX = tile.x * zoom - viewportX;
        const screenY = tile.y * zoom - viewportY;
        const tileSize = TILE_SIZE * zoom;

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
   * Selecciona asset de terreno basado en valor de noise (sin heurísticas de nombre)
   */
  private selectTerrainAsset(noiseValue: number): Asset {
    if (this.terrainAssets.length === 0) {
      // Fallback si no hay assets cargados
      return {
        path: '/assets/terrain/grass_01.png',
        image: null,
        type: 'terrain',
        size: TILE_SIZE
      };
    }

    // Use index-based selection instead of name heuristics
    const index = Math.floor(noiseValue * this.terrainAssets.length);
    return this.terrainAssets[Math.min(index, this.terrainAssets.length - 1)];
  }

  /**
   * Obtiene información del tile en una posición específica
   */
  public getTileAt(terrainMap: TerrainMap, worldX: number, worldY: number): TileData | null {
    const tileX = Math.floor(worldX / TILE_SIZE);
    const tileY = Math.floor(worldY / TILE_SIZE);
    
    if (tileX >= 0 && tileX < terrainMap.width && tileY >= 0 && tileY < terrainMap.height) {
      return terrainMap.tiles[tileY][tileX];
    }
    
    return null;
  }

  public static getTileSize(): number {
    return TILE_SIZE;
  }
}

export const tileRenderer = new TileRenderer();
