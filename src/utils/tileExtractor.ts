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
    tileSize: 16,
    tilesPerRow: 16,
    tilesPerCol: 16,
    mapping: [
      // Fila 0 - Grass básico y variaciones
      { id: 'grass_base', col: 0, row: 0, type: 'ground', description: 'Grass básico' },
      { id: 'grass_flower1', col: 1, row: 0, type: 'ground', description: 'Grass con flores pequeñas' },
      { id: 'grass_flower2', col: 2, row: 0, type: 'ground', description: 'Grass con flores' },
      { id: 'grass_rocks1', col: 3, row: 0, type: 'ground', description: 'Grass con rocas pequeñas' },
      { id: 'grass_rocks2', col: 4, row: 0, type: 'ground', description: 'Grass con rocas' },
      { id: 'grass_rocks3', col: 5, row: 0, type: 'ground', description: 'Grass con rocas grandes' },
      { id: 'grass_patch1', col: 6, row: 0, type: 'ground', description: 'Parche de grass 1' },
      { id: 'grass_patch2', col: 7, row: 0, type: 'ground', description: 'Parche de grass 2' },
      
      // Fila 1 - Más variaciones
      { id: 'grass_detail1', col: 0, row: 1, type: 'ground', description: 'Grass detallado 1' },
      { id: 'grass_detail2', col: 1, row: 1, type: 'ground', description: 'Grass detallado 2' },
      { id: 'grass_detail3', col: 2, row: 1, type: 'ground', description: 'Grass detallado 3' },
      { id: 'grass_detail4', col: 3, row: 1, type: 'ground', description: 'Grass detallado 4' },
      { id: 'grass_detail5', col: 4, row: 1, type: 'ground', description: 'Grass detallado 5' },
      { id: 'grass_detail6', col: 5, row: 1, type: 'ground', description: 'Grass detallado 6' },
      { id: 'grass_detail7', col: 6, row: 1, type: 'ground', description: 'Grass detallado 7' },
      { id: 'grass_detail8', col: 7, row: 1, type: 'ground', description: 'Grass detallado 8' },
      
      // Añadir más tiles de la grilla visible
      { id: 'grass_border1', col: 8, row: 0, type: 'ground', description: 'Borde grass 1' },
      { id: 'grass_border2', col: 9, row: 0, type: 'ground', description: 'Borde grass 2' },
      { id: 'grass_border3', col: 10, row: 0, type: 'ground', description: 'Borde grass 3' },
      { id: 'grass_border4', col: 11, row: 0, type: 'ground', description: 'Borde grass 4' },
      { id: 'grass_border5', col: 12, row: 0, type: 'ground', description: 'Borde grass 5' },
      { id: 'grass_border6', col: 13, row: 0, type: 'ground', description: 'Borde grass 6' },
      { id: 'grass_border7', col: 14, row: 0, type: 'ground', description: 'Borde grass 7' },
      { id: 'grass_border8', col: 15, row: 0, type: 'ground', description: 'Borde grass 8' }
    ]
  },
  
  'TX Tileset Stone Ground.png': {
    tileSize: 64,
    tilesPerRow: 4,
    tilesPerCol: 4,
    mapping: [
      // Fila 0 - Tiles principales de piedra
      { id: 'stone_large_1', col: 0, row: 0, type: 'ground', description: 'Piedra grande 1' },
      { id: 'stone_large_2', col: 1, row: 0, type: 'ground', description: 'Piedra grande 2' },
      { id: 'stone_detailed', col: 2, row: 0, type: 'ground', description: 'Piedra detallada' },
      
      // Fila 1 - Más variaciones
      { id: 'stone_base', col: 0, row: 1, type: 'ground', description: 'Piedra base' },
      { id: 'stone_smooth', col: 1, row: 1, type: 'ground', description: 'Piedra lisa' },
      
      // Fila 2 - Tiles pequeños y detalles
      { id: 'stone_small_1', col: 0, row: 2, type: 'ground', description: 'Piedra pequeña 1' },
      { id: 'stone_small_2', col: 1, row: 2, type: 'ground', description: 'Piedra pequeña 2' },
      { id: 'stone_small_3', col: 2, row: 2, type: 'ground', description: 'Piedra pequeña 3' },
      
      // Fila 3 - Más detalles
      { id: 'stone_corner_1', col: 1, row: 3, type: 'ground', description: 'Esquina piedra 1' },
      { id: 'stone_corner_2', col: 2, row: 3, type: 'ground', description: 'Esquina piedra 2' }
    ]
  },
  
  'TX Props.png': {
    tileSize: 32,
    tilesPerRow: 7,
    tilesPerCol: 8,
    mapping: [
      // Fila 0 - Objetos principales
      { id: 'crate_stone', col: 0, row: 0, type: 'container', description: 'Caja de piedra' },
      { id: 'barrel_wood', col: 1, row: 0, type: 'container', description: 'Barril de madera' },
      { id: 'chest_wood', col: 2, row: 0, type: 'container', description: 'Cofre de madera' },
      { id: 'pillar_stone', col: 3, row: 0, type: 'structure', description: 'Pilar de piedra' },
      { id: 'sofa_stone', col: 4, row: 0, type: 'furniture', description: 'Sofá de piedra' },
      { id: 'chair_stone', col: 5, row: 0, type: 'furniture', description: 'Silla de piedra' },
      { id: 'statue_large', col: 6, row: 0, type: 'decoration', description: 'Estatua grande' },
      
      // Fila 1 - Más objetos
      { id: 'door_wood', col: 0, row: 1, type: 'structure', description: 'Puerta de madera' },
      { id: 'crate_metal', col: 1, row: 1, type: 'container', description: 'Caja metálica' },
      { id: 'table_stone', col: 2, row: 1, type: 'furniture', description: 'Mesa de piedra' },
      { id: 'pillar_decorated', col: 3, row: 1, type: 'structure', description: 'Pilar decorado' },
      { id: 'sofa_decorated', col: 4, row: 1, type: 'furniture', description: 'Sofá decorado' },
      { id: 'chair_decorated', col: 5, row: 1, type: 'furniture', description: 'Silla decorada' },
      { id: 'bookcase', col: 6, row: 1, type: 'furniture', description: 'Librería' },
      
      // Fila 2 - Objetos pequeños y decoraciones
      { id: 'staff_1', col: 0, row: 2, type: 'item', description: 'Bastón 1' },
      { id: 'staff_2', col: 1, row: 2, type: 'item', description: 'Bastón 2' },
      { id: 'barrel_small', col: 2, row: 2, type: 'container', description: 'Barril pequeño' },
      { id: 'gravestone_1', col: 3, row: 2, type: 'decoration', description: 'Lápida 1' },
      { id: 'altar_stone', col: 4, row: 2, type: 'mystical', description: 'Altar de piedra' },
      { id: 'throne_decorated', col: 5, row: 2, type: 'furniture', description: 'Trono decorado' },
      { id: 'pedestal_round', col: 6, row: 2, type: 'decoration', description: 'Pedestal redondo' },
      
      // Fila 3 - Más objetos diversos
      { id: 'cross_stone', col: 0, row: 3, type: 'decoration', description: 'Cruz de piedra' },
      { id: 'bag_small', col: 1, row: 3, type: 'container', description: 'Bolsa pequeña' },
      { id: 'pot', col: 2, row: 3, type: 'container', description: 'Vasija' },
      { id: 'gravestone_2', col: 3, row: 3, type: 'decoration', description: 'Lápida 2' },
      { id: 'urn', col: 4, row: 3, type: 'decoration', description: 'Urna' },
      { id: 'fountain_decorated', col: 5, row: 3, type: 'structure', description: 'Fuente decorada' },
      
      // Fila 4 - Objetos finales y elementos especiales
      { id: 'rock_large', col: 0, row: 4, type: 'environment', description: 'Roca grande' },
      { id: 'fountain_center', col: 4, row: 4, type: 'structure', description: 'Fuente central' },
      { id: 'fountain_spiral', col: 5, row: 4, type: 'structure', description: 'Fuente espiral' },
      
      // Fila 5 - Elementos decorativos finales (stones en la parte inferior)
      { id: 'stone_deco_1', col: 0, row: 5, type: 'decoration', description: 'Piedra decorativa 1' },
      { id: 'stone_deco_2', col: 1, row: 5, type: 'decoration', description: 'Piedra decorativa 2' },
      { id: 'stone_deco_3', col: 2, row: 5, type: 'decoration', description: 'Piedra decorativa 3' },
      { id: 'stone_deco_4', col: 3, row: 5, type: 'decoration', description: 'Piedra decorativa 4' },
      { id: 'stone_deco_5', col: 4, row: 5, type: 'decoration', description: 'Piedra decorativa 5' },
      { id: 'stone_deco_6', col: 5, row: 5, type: 'decoration', description: 'Piedra decorativa 6' }
    ]
  },
  
  'TX Plant.png': {
    tileSize: 64,
    tilesPerRow: 3,
    tilesPerCol: 4,
    mapping: [
      // Fila 0 - Árboles grandes
      { id: 'tree_large_1', col: 0, row: 0, type: 'tree', description: 'Árbol grande tipo 1' },
      { id: 'tree_large_2', col: 1, row: 0, type: 'tree', description: 'Árbol grande tipo 2' },
      { id: 'tree_large_3', col: 2, row: 0, type: 'tree', description: 'Árbol grande tipo 3' },
      
      // Fila 1 - Arbustos medianos (32x32 dentro del grid de 64x64)
      { id: 'bush_large', col: 0, row: 1, type: 'bush', description: 'Arbusto grande' },
      { id: 'bush_medium', col: 1, row: 1, type: 'bush', description: 'Arbusto mediano' },
      { id: 'bush_small', col: 2, row: 1, type: 'bush', description: 'Arbusto pequeño' },
      
      // Fila 2 - Más arbustos
      { id: 'bush_flower', col: 0, row: 2, type: 'bush', description: 'Arbusto con flores' },
      { id: 'bush_berry', col: 1, row: 2, type: 'bush', description: 'Arbusto con bayas' },
      { id: 'bush_dense', col: 2, row: 2, type: 'bush', description: 'Arbusto denso' },
      
      // Fila 3 - Plantas pequeñas (reducir tamaño a 16x16 para estos)
      { id: 'grass_tuft_1', col: 0, row: 3, type: 'grass_detail', description: 'Mata de hierba 1' },
      { id: 'grass_tuft_2', col: 1, row: 3, type: 'grass_detail', description: 'Mata de hierba 2' },
      { id: 'grass_tuft_3', col: 2, row: 3, type: 'grass_detail', description: 'Mata de hierba 3' }
    ]
  },
  
  'TX Shadow.png': {
    tileSize: 32,
    tilesPerRow: 7,
    tilesPerCol: 8,
    mapping: [
      // Fila 0 - Sombras rectangulares
      { id: 'shadow_rect_1', col: 0, row: 0, type: 'shadow', description: 'Sombra rectangular 1' },
      { id: 'shadow_rect_2', col: 1, row: 0, type: 'shadow', description: 'Sombra rectangular 2' },
      { id: 'shadow_rect_3', col: 2, row: 0, type: 'shadow', description: 'Sombra rectangular 3' },
      { id: 'shadow_rect_4', col: 3, row: 0, type: 'shadow', description: 'Sombra rectangular 4' },
      { id: 'shadow_large_1', col: 4, row: 0, type: 'shadow', description: 'Sombra grande 1' },
      { id: 'shadow_large_2', col: 5, row: 0, type: 'shadow', description: 'Sombra grande 2' },
      { id: 'shadow_complex', col: 6, row: 0, type: 'shadow', description: 'Sombra compleja' },
      
      // Fila 1 - Más sombras rectangulares
      { id: 'shadow_rect_5', col: 0, row: 1, type: 'shadow', description: 'Sombra rectangular 5' },
      { id: 'shadow_rect_6', col: 1, row: 1, type: 'shadow', description: 'Sombra rectangular 6' },
      { id: 'shadow_rect_7', col: 2, row: 1, type: 'shadow', description: 'Sombra rectangular 7' },
      { id: 'shadow_rect_8', col: 3, row: 1, type: 'shadow', description: 'Sombra rectangular 8' },
      { id: 'shadow_large_3', col: 4, row: 1, type: 'shadow', description: 'Sombra grande 3' },
      { id: 'shadow_large_4', col: 5, row: 1, type: 'shadow', description: 'Sombra grande 4' },
      { id: 'shadow_small_1', col: 6, row: 1, type: 'shadow', description: 'Sombra pequeña 1' },
      
      // Fila 2 - Sombras especiales
      { id: 'shadow_cross_1', col: 0, row: 2, type: 'shadow', description: 'Sombra cruz 1' },
      { id: 'shadow_round_1', col: 1, row: 2, type: 'shadow', description: 'Sombra redonda 1' },
      { id: 'shadow_cross_2', col: 2, row: 2, type: 'shadow', description: 'Sombra cruz 2' },
      { id: 'shadow_round_2', col: 3, row: 2, type: 'shadow', description: 'Sombra redonda 2' },
      { id: 'shadow_rect_large', col: 4, row: 2, type: 'shadow', description: 'Sombra rectangular grande' },
      { id: 'shadow_small_2', col: 5, row: 2, type: 'shadow', description: 'Sombra pequeña 2' },
      { id: 'shadow_small_3', col: 6, row: 2, type: 'shadow', description: 'Sombra pequeña 3' },
      
      // Fila 3 - Sombras adicionales
      { id: 'shadow_oval_1', col: 0, row: 3, type: 'shadow', description: 'Sombra oval 1' },
      { id: 'shadow_oval_2', col: 1, row: 3, type: 'shadow', description: 'Sombra oval 2' },
      { id: 'shadow_oval_3', col: 2, row: 3, type: 'shadow', description: 'Sombra oval 3' },
      { id: 'shadow_cross_3', col: 3, row: 3, type: 'shadow', description: 'Sombra cruz 3' },
      { id: 'shadow_oval_large', col: 4, row: 3, type: 'shadow', description: 'Sombra oval grande' },
      { id: 'shadow_spiral', col: 5, row: 3, type: 'shadow', description: 'Sombra espiral' },
      
      // Fila 4 - Sombras de piedras decorativas
      { id: 'shadow_rock', col: 0, row: 4, type: 'shadow', description: 'Sombra de roca' },
      
      // Fila 5 - Sombras pequeñas del bottom
      { id: 'shadow_tiny_1', col: 0, row: 5, type: 'shadow', description: 'Sombra diminuta 1' },
      { id: 'shadow_tiny_2', col: 1, row: 5, type: 'shadow', description: 'Sombra diminuta 2' },
      { id: 'shadow_tiny_3', col: 2, row: 5, type: 'shadow', description: 'Sombra diminuta 3' },
      { id: 'shadow_tiny_4', col: 3, row: 5, type: 'shadow', description: 'Sombra diminuta 4' },
      { id: 'shadow_tiny_5', col: 4, row: 5, type: 'shadow', description: 'Sombra diminuta 5' },
      { id: 'shadow_tiny_6', col: 5, row: 5, type: 'shadow', description: 'Sombra diminuta 6' }
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