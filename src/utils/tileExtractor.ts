/**
 * Utilidades para extraer tiles correctamente de los spritesheets profesionales
 * Basado en la documentación del paquete PixelArt Top Down Basic
 */

export interface ExtractedTile {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  id: string;
  type: string;
}

export interface TilesetConfig {
  tileSize: number;
  tilesPerRow: number;
  tilesPerCol: number;
  mapping: Array<{
    id: string;
    col: number;
    row: number;
    type: string;
    description: string;
  }>;
}


export const TILESET_CONFIGS: Record<string, TilesetConfig> = {
  'TX Tileset Grass.png': {
    tileSize: 32,
    tilesPerRow: 16,
    tilesPerCol: 16,
    mapping: [

      { id: 'grass_base', col: 0, row: 0, type: 'ground', description: 'Grass básico' },
      { id: 'grass_flower1', col: 1, row: 0, type: 'ground', description: 'Grass con flores pequeñas' },
      { id: 'grass_flower2', col: 2, row: 0, type: 'ground', description: 'Grass con flores' },
      { id: 'grass_rocks', col: 3, row: 0, type: 'ground', description: 'Grass con rocas' },
      

      { id: 'grass_detail1', col: 0, row: 1, type: 'ground', description: 'Grass detallado' },
      { id: 'grass_detail2', col: 1, row: 1, type: 'ground', description: 'Grass con hierba alta' },
      { id: 'grass_patch', col: 2, row: 1, type: 'ground', description: 'Parche de grass' },
      

      { id: 'grass_edge_top', col: 0, row: 2, type: 'edge', description: 'Borde superior' },
      { id: 'grass_edge_bottom', col: 1, row: 2, type: 'edge', description: 'Borde inferior' },
      { id: 'grass_edge_left', col: 2, row: 2, type: 'edge', description: 'Borde izquierdo' },
      { id: 'grass_edge_right', col: 3, row: 2, type: 'edge', description: 'Borde derecho' }
    ]
  },
  
  'TX Tileset Stone Ground.png': {
    tileSize: 32,
    tilesPerRow: 8,
    tilesPerCol: 8,
    mapping: [

      { id: 'stone_base', col: 0, row: 0, type: 'ground', description: 'Piedra básica' },
      { id: 'stone_cracked', col: 1, row: 0, type: 'ground', description: 'Piedra agrietada' },
      { id: 'stone_smooth', col: 0, row: 1, type: 'ground', description: 'Piedra lisa' },
      { id: 'stone_rough', col: 1, row: 1, type: 'ground', description: 'Piedra rugosa' }
    ]
  },
  
  'TX Props.png': {
    tileSize: 32,
    tilesPerRow: 7,
    tilesPerCol: 5,
    mapping: [

      { id: 'crate_wood', col: 0, row: 0, type: 'container', description: 'Caja de madera' },
      { id: 'barrel', col: 1, row: 0, type: 'container', description: 'Barril' },
      { id: 'chest_wood', col: 2, row: 0, type: 'container', description: 'Cofre de madera' },
      { id: 'chest_metal', col: 3, row: 0, type: 'container', description: 'Cofre de metal' },
      { id: 'bookshelf', col: 4, row: 0, type: 'furniture', description: 'Estantería' },
      { id: 'chair', col: 5, row: 0, type: 'furniture', description: 'Silla' },
      { id: 'statue', col: 6, row: 0, type: 'decoration', description: 'Estatua' },
      

      { id: 'door', col: 0, row: 1, type: 'structure', description: 'Puerta' },
      { id: 'crate_metal', col: 1, row: 1, type: 'container', description: 'Caja metálica' },
      { id: 'table', col: 2, row: 1, type: 'furniture', description: 'Mesa' },
      { id: 'pillar', col: 3, row: 1, type: 'structure', description: 'Pilar' },
      { id: 'sofa', col: 4, row: 1, type: 'furniture', description: 'Sofá' },
      { id: 'lamp', col: 5, row: 1, type: 'furniture', description: 'Lámpara' },
      { id: 'bookcase_tall', col: 6, row: 1, type: 'furniture', description: 'Librería alta' },
      

      { id: 'fence_post', col: 0, row: 2, type: 'structure', description: 'Poste de cerca' },
      { id: 'sign', col: 1, row: 2, type: 'decoration', description: 'Letrero' },
      { id: 'barrel_small', col: 2, row: 2, type: 'container', description: 'Barril pequeño' },
      { id: 'gravestone', col: 3, row: 2, type: 'decoration', description: 'Lápida' },
      { id: 'altar', col: 4, row: 2, type: 'mystical', description: 'Altar' },
      { id: 'throne', col: 5, row: 2, type: 'furniture', description: 'Trono' },
      { id: 'pedestal', col: 6, row: 2, type: 'decoration', description: 'Pedestal' },
      

      { id: 'staff', col: 0, row: 3, type: 'item', description: 'Bastón' },
      { id: 'bag', col: 1, row: 3, type: 'container', description: 'Bolsa' },
      { id: 'pot', col: 2, row: 3, type: 'container', description: 'Vasija' },
      { id: 'cross', col: 3, row: 3, type: 'decoration', description: 'Cruz' },
      { id: 'urn', col: 4, row: 3, type: 'decoration', description: 'Urna' },
      { id: 'fountain_base', col: 5, row: 3, type: 'structure', description: 'Base de fuente' },
      

      { id: 'rock', col: 0, row: 4, type: 'environment', description: 'Roca' },
      { id: 'fountain_center', col: 4, row: 4, type: 'structure', description: 'Fuente central' }
    ]
  },
  
  'TX Plant.png': {
    tileSize: 32,
    tilesPerRow: 6,
    tilesPerCol: 4,
    mapping: [

      { id: 'tree_large_1', col: 0, row: 0, type: 'tree', description: 'Árbol grande tipo 1' },
      { id: 'tree_large_2', col: 1, row: 0, type: 'tree', description: 'Árbol grande tipo 2' },
      { id: 'tree_large_3', col: 2, row: 0, type: 'tree', description: 'Árbol grande tipo 3' },
      

      { id: 'bush_large', col: 0, row: 1, type: 'bush', description: 'Arbusto grande' },
      { id: 'bush_medium', col: 1, row: 1, type: 'bush', description: 'Arbusto mediano' },
      { id: 'bush_small', col: 2, row: 1, type: 'bush', description: 'Arbusto pequeño' },
      { id: 'bush_flower', col: 3, row: 1, type: 'bush', description: 'Arbusto con flores' },
      { id: 'bush_berry', col: 4, row: 1, type: 'bush', description: 'Arbusto con bayas' },
      { id: 'bush_dense', col: 5, row: 1, type: 'bush', description: 'Arbusto denso' }
    ]
  },
  
  'TX Shadow.png': {
    tileSize: 32,
    tilesPerRow: 8,
    tilesPerCol: 8,
    mapping: [

      { id: 'shadow_round_small', col: 0, row: 0, type: 'shadow', description: 'Sombra redonda pequeña' },
      { id: 'shadow_round_medium', col: 1, row: 0, type: 'shadow', description: 'Sombra redonda mediana' },
      { id: 'shadow_round_large', col: 2, row: 0, type: 'shadow', description: 'Sombra redonda grande' },
      

      { id: 'shadow_oval_small', col: 0, row: 1, type: 'shadow', description: 'Sombra oval pequeña' },
      { id: 'shadow_oval_medium', col: 1, row: 1, type: 'shadow', description: 'Sombra oval mediana' },
      { id: 'shadow_oval_large', col: 2, row: 1, type: 'shadow', description: 'Sombra oval grande' },
      

      { id: 'shadow_irregular_1', col: 0, row: 2, type: 'shadow', description: 'Sombra irregular 1' },
      { id: 'shadow_irregular_2', col: 1, row: 2, type: 'shadow', description: 'Sombra irregular 2' }
    ]
  }
};

/**
 * Extrae un tile específico de un spritesheet
 */
export async function extractTile(
  spritesheet: HTMLImageElement,
  config: TilesetConfig,
  tileId: string
): Promise<ExtractedTile | null> {
  const tileMapping = config.mapping.find(m => m.id === tileId);
  if (!tileMapping) {
    console.warn(`Tile ${tileId} no encontrado en configuración`);
    return null;
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = config.tileSize;
  canvas.height = config.tileSize;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('No se pudo crear contexto 2D');
    return null;
  }
  

  ctx.drawImage(
    spritesheet,
    tileMapping.col * config.tileSize,
    tileMapping.row * config.tileSize,
    config.tileSize,
    config.tileSize,
    0,
    0,
    config.tileSize,
    config.tileSize
  );
  

  const image = new Image();
  image.src = canvas.toDataURL();
  
  return new Promise((resolve) => {
    image.onload = () => {
      resolve({
        canvas,
        image,
        id: tileId,
        type: tileMapping.type
      });
    };
    image.onerror = () => {
      console.error(`Error cargando tile ${tileId}`);
      resolve(null);
    };
  });
}

/**
 * Extrae todos los tiles de un spritesheet
 */
export async function extractAllTiles(
  spritesheet: HTMLImageElement,
  spritesheetName: string
): Promise<Map<string, ExtractedTile>> {
  const config = TILESET_CONFIGS[spritesheetName];
  if (!config) {
    console.error(`Configuración no encontrada para ${spritesheetName}`);
    return new Map();
  }
  
  const tiles = new Map<string, ExtractedTile>();
  
  for (const tileMapping of config.mapping) {
    const tile = await extractTile(spritesheet, config, tileMapping.id);
    if (tile) {
      tiles.set(tileMapping.id, tile);
    }
  }
  
  console.log(`✅ Extraídos ${tiles.size} tiles de ${spritesheetName}`);
  return tiles;
}

/**
 * Carga y extrae tiles de un spritesheet por URL
 */
export async function loadAndExtractTiles(
  spritesheetUrl: string,
  spritesheetName: string
): Promise<Map<string, ExtractedTile>> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    
    image.onload = async () => {
      try {
        const tiles = await extractAllTiles(image, spritesheetName);
        resolve(tiles);
      } catch (error) {
        reject(error);
      }
    };
    
    image.onerror = () => {
      reject(new Error(`Error cargando spritesheet: ${spritesheetUrl}`));
    };
    
    image.src = spritesheetUrl;
  });
}

/**
 * Obtiene tiles por tipo
 */
export function getTilesByType(tiles: Map<string, ExtractedTile>, type: string): ExtractedTile[] {
  return Array.from(tiles.values()).filter(tile => tile.type === type);
}

/**
 * Obtiene un tile aleatorio de un tipo específico
 */
export function getRandomTileByType(tiles: Map<string, ExtractedTile>, type: string): ExtractedTile | null {
  const tilesOfType = getTilesByType(tiles, type);
  if (tilesOfType.length === 0) return null;
  
  return tilesOfType[Math.floor(Math.random() * tilesOfType.length)];
}