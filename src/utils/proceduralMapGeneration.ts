/**
 * 🏠 GENERADOR PROCEDIMENTAL DE MAPAS AVANZADO
 * 
 * Crea mapas únicos con diseños arquitectónicos variados, múltiples temas,
 * layouts inteligentes y decoración contextual
 * 
 * ⚠️ DEPRECATED: Use organicMapGeneration.ts for realistic RPG-style generation
 */

import type { Zone, MapElement } from '../types';
import { generateOrganicProceduralMap } from './organicMapGeneration';


export const MAP_CONFIG = {
  width: 1000,
  height: 600,
  padding: 50,
  minDistance: 15,
  maxAttempts: 100
} as const;


export const ARCHITECTURAL_THEMES = {
  MODERN: {
    name: 'Casa Moderna',
    colors: {
      primary: 'rgba(64, 64, 64, 0.3)',
      secondary: 'rgba(128, 128, 128, 0.25)',
      accent: 'rgba(220, 220, 220, 0.35)'
    },
    decorationStyle: 'minimal',
    roomSizeMultiplier: 1.1,
    preferredMaterials: ['glass', 'steel', 'concrete']
  },
  
  RUSTIC: {
    name: 'Casa Rústica',
    colors: {
      primary: 'rgba(139, 69, 19, 0.3)',
      secondary: 'rgba(160, 82, 45, 0.25)',
      accent: 'rgba(210, 180, 140, 0.35)'
    },
    decorationStyle: 'cozy',
    roomSizeMultiplier: 0.9,
    preferredMaterials: ['wood', 'stone', 'brick']
  },
  
  ECOLOGICAL: {
    name: 'Casa Ecológica',
    colors: {
      primary: 'rgba(34, 139, 34, 0.3)',
      secondary: 'rgba(85, 107, 47, 0.25)',
      accent: 'rgba(144, 238, 144, 0.35)'
    },
    decorationStyle: 'natural',
    roomSizeMultiplier: 1.0,
    preferredMaterials: ['bamboo', 'recycled', 'natural']
  },
  
  URBAN: {
    name: 'Apartamento Urbano',
    colors: {
      primary: 'rgba(70, 130, 180, 0.3)',
      secondary: 'rgba(100, 149, 237, 0.25)',
      accent: 'rgba(173, 216, 230, 0.35)'
    },
    decorationStyle: 'compact',
    roomSizeMultiplier: 0.8,
    preferredMaterials: ['metal', 'glass', 'plastic']
  }
} as const;


export const LAYOUT_ALGORITHMS = {
  TRADITIONAL_L: 'traditional_l',
  COURTYARD: 'courtyard',
  LINEAR: 'linear',
  U_SHAPED: 'u_shaped',
  COMPACT_GRID: 'compact_grid'
} as const;


export const ROOM_TYPES = {
  KITCHEN: {
    name: 'Cocina',
    type: 'food' as const,
    baseSize: { width: 120, height: 80 },
    priority: 'high',
    adjacencyPreferences: {
      preferred: ['DINING', 'LIVING_ROOM'],
      avoided: ['BEDROOM', 'BATHROOM'],
      required: []
    },
    functionalZones: ['cooking_area', 'prep_area', 'storage_area'],
    decorations: {
      essential: ['furniture_table_dining'],
      optional: ['plant_small', 'deco_lamp'],
      themed: {
        modern: ['appliance_modern'],
        rustic: ['furniture_table_wood'],
        ecological: ['plant_herb', 'compost_bin'],
        urban: ['appliance_compact']
      }
    },
    minInstances: 1,
    maxInstances: 1
  },
  
  BEDROOM: {
    name: 'Dormitorio',
    type: 'rest' as const,
    baseSize: { width: 140, height: 100 },
    priority: 'high',
    adjacencyPreferences: {
      preferred: ['BATHROOM', 'HALLWAY'],
      avoided: ['KITCHEN', 'LIVING_ROOM'],
      required: []
    },
    functionalZones: ['sleeping_area', 'storage_area', 'personal_area'],
    decorations: {
      essential: ['furniture_bed_simple', 'furniture_bed_double'],
      optional: ['deco_lamp', 'plant_small'],
      themed: {
        modern: ['furniture_bed_modern', 'deco_minimal'],
        rustic: ['furniture_bed_wood', 'deco_vintage'],
        ecological: ['furniture_bed_natural', 'plant_air'],
        urban: ['furniture_bed_compact', 'storage_compact']
      }
    },
    minInstances: 1,
    maxInstances: 3
  },
  
  LIVING_ROOM: {
    name: 'Sala de Estar',
    type: 'social' as const,
    baseSize: { width: 180, height: 120 },
    priority: 'high',
    adjacencyPreferences: {
      preferred: ['KITCHEN', 'HALLWAY', 'DINING'],
      avoided: [],
      required: []
    },
    functionalZones: ['seating_area', 'entertainment_area', 'social_area'],
    decorations: {
      essential: ['furniture_sofa_modern', 'furniture_sofa_classic'],
      optional: ['furniture_table_coffee', 'plant_tree', 'deco_bookshelf'],
      themed: {
        modern: ['furniture_sofa_modern', 'tv_wall_mount'],
        rustic: ['furniture_sofa_classic', 'fireplace'],
        ecological: ['furniture_bamboo', 'plant_large'],
        urban: ['furniture_sofa_compact', 'storage_wall']
      }
    },
    minInstances: 1,
    maxInstances: 1
  },
  
  DINING: {
    name: 'Comedor',
    type: 'social' as const,
    baseSize: { width: 140, height: 100 },
    priority: 'medium',
    adjacencyPreferences: {
      preferred: ['KITCHEN', 'LIVING_ROOM'],
      avoided: ['BEDROOM', 'BATHROOM'],
      required: ['KITCHEN']
    },
    functionalZones: ['dining_area', 'serving_area'],
    decorations: {
      essential: ['furniture_table_dining'],
      optional: ['deco_lamp', 'plant_flower'],
      themed: {
        modern: ['furniture_table_glass', 'chairs_modern'],
        rustic: ['furniture_table_wood', 'chairs_wood'],
        ecological: ['furniture_table_reclaimed', 'chairs_bamboo'],
        urban: ['furniture_table_compact', 'chairs_stackable']
      }
    },
    minInstances: 0,
    maxInstances: 1
  },
  
  BATHROOM: {
    name: 'Baño',
    type: 'comfort' as const,
    baseSize: { width: 80, height: 80 },
    priority: 'high',
    adjacencyPreferences: {
      preferred: ['BEDROOM', 'HALLWAY'],
      avoided: ['KITCHEN', 'DINING'],
      required: []
    },
    functionalZones: ['hygiene_area', 'storage_area'],
    decorations: {
      essential: ['bathroom_essentials'],
      optional: ['plant_small', 'deco_mirror'],
      themed: {
        modern: ['bathroom_modern', 'mirror_led'],
        rustic: ['bathroom_vintage', 'mirror_wood'],
        ecological: ['bathroom_eco', 'plant_bathroom'],
        urban: ['bathroom_compact', 'storage_vertical']
      }
    },
    minInstances: 1,
    maxInstances: 2
  },
  
  STUDY: {
    name: 'Estudio',
    type: 'work' as const,
    baseSize: { width: 120, height: 100 },
    priority: 'medium',
    adjacencyPreferences: {
      preferred: ['HALLWAY', 'LIVING_ROOM'],
      avoided: ['KITCHEN', 'BATHROOM'],
      required: []
    },
    functionalZones: ['work_area', 'storage_area', 'reading_area'],
    decorations: {
      essential: ['deco_bookshelf', 'desk'],
      optional: ['deco_lamp', 'plant_small', 'deco_clock'],
      themed: {
        modern: ['desk_modern', 'chair_ergonomic'],
        rustic: ['desk_wood', 'chair_leather'],
        ecological: ['desk_bamboo', 'plant_desk'],
        urban: ['desk_compact', 'storage_vertical']
      }
    },
    minInstances: 0,
    maxInstances: 1
  },
  
  GARDEN: {
    name: 'Jardín',
    type: 'comfort' as const,
    baseSize: { width: 160, height: 130 },
    priority: 'low',
    adjacencyPreferences: {
      preferred: ['KITCHEN', 'LIVING_ROOM'],
      avoided: ['BATHROOM'],
      required: []
    },
    functionalZones: ['planting_area', 'seating_area', 'pathway_area'],
    decorations: {
      essential: ['plant_flower', 'plant_tree'],
      optional: ['banco', 'fountain'],
      themed: {
        modern: ['garden_zen', 'sculpture_modern'],
        rustic: ['garden_cottage', 'bench_wood'],
        ecological: ['garden_permaculture', 'compost_area'],
        urban: ['garden_vertical', 'planter_modern']
      }
    },
    minInstances: 0,
    maxInstances: 1
  },
  
  UTILITY: {
    name: 'Zona de Servicios',
    type: 'energy' as const,
    baseSize: { width: 100, height: 80 },
    priority: 'low',
    adjacencyPreferences: {
      preferred: ['KITCHEN', 'BATHROOM'],
      avoided: ['LIVING_ROOM', 'BEDROOM'],
      required: []
    },
    functionalZones: ['laundry_area', 'storage_area', 'utility_area'],
    decorations: {
      essential: ['utility_essentials'],
      optional: ['deco_lamp', 'plant_small'],
      themed: {
        modern: ['washer_modern', 'storage_sleek'],
        rustic: ['washer_vintage', 'shelving_wood'],
        ecological: ['washer_eco', 'storage_bamboo'],
        urban: ['washer_compact', 'storage_wall']
      }
    },
    minInstances: 0,
    maxInstances: 1
  }
} as const;

type RoomType = keyof typeof ROOM_TYPES;


export function generateMapSeed(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}


export function checkCollision(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number },
  minDistance: number = MAP_CONFIG.minDistance
): boolean {
  return !(
    rect1.x + rect1.width + minDistance < rect2.x ||
    rect2.x + rect2.width + minDistance < rect1.x ||
    rect1.y + rect1.height + minDistance < rect2.y ||
    rect2.y + rect2.height + minDistance < rect1.y
  );
}


// CORRIGIDO: Exportar funciones para evitar errores de TS6133
export function selectThemeAndLayout(seed: string): {
  theme: keyof typeof ARCHITECTURAL_THEMES;
  layout: string;
} {
  let seedValue = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  const themes = Object.keys(ARCHITECTURAL_THEMES) as Array<keyof typeof ARCHITECTURAL_THEMES>;
  const layouts = Object.values(LAYOUT_ALGORITHMS);
  
  return {
    theme: themes[Math.floor(seededRandom() * themes.length)],
    layout: layouts[Math.floor(seededRandom() * layouts.length)]
  };
}


export function selectRoomsForLayout(layout: string, seededRandom: () => number): RoomType[] {
  const allRoomTypes = Object.keys(ROOM_TYPES) as RoomType[];
  const selectedRooms: RoomType[] = [];
  

  const essentialRooms: RoomType[] = ['KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'BATHROOM'];
  

  essentialRooms.forEach(roomType => {
    const roomConfig = ROOM_TYPES[roomType];
    const maxInstances = roomConfig.maxInstances;
    

    if (maxInstances > 1) {
      const numInstances = Math.min(
        Math.floor(seededRandom() * maxInstances) + 1,
        maxInstances
      );
      for (let i = 0; i < numInstances; i++) {
        selectedRooms.push(roomType);
      }
    } else {

      selectedRooms.push(roomType);
    }
  });
  

  const optionalRooms = allRoomTypes.filter(room => !essentialRooms.includes(room));
  const maxOptionalRooms = layout === LAYOUT_ALGORITHMS.COMPACT_GRID ? 2 : 3;
  

  const availableOptional = optionalRooms.filter(roomType => {
    const roomConfig = ROOM_TYPES[roomType];

    return !selectedRooms.includes(roomType) || roomConfig.maxInstances > 1;
  });
  
  for (let i = 0; i < maxOptionalRooms && availableOptional.length > 0; i++) {
    const randomIndex = Math.floor(seededRandom() * availableOptional.length);
    const roomType = availableOptional[randomIndex];
    const roomConfig = ROOM_TYPES[roomType];
    

    const currentCount = selectedRooms.filter(r => r === roomType).length;
    if (currentCount < roomConfig.maxInstances) {
      selectedRooms.push(roomType);
    }
    

    if (currentCount + 1 >= roomConfig.maxInstances) {
      availableOptional.splice(randomIndex, 1);
    }
  }
  
  return selectedRooms;
}


export function generateTraditionalLLayout(
  roomTypes: RoomType[], 
  themeConfig: typeof ARCHITECTURAL_THEMES[keyof typeof ARCHITECTURAL_THEMES],
  seededRandom: () => number
): Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> {
  const rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> = [];
  const placedBounds: Array<{ x: number; y: number; width: number; height: number }> = [];
  

  const livingRoom = roomTypes.find(r => r === 'LIVING_ROOM');
  if (livingRoom) {
    const roomConfig = ROOM_TYPES[livingRoom];
    const size = getAdjustedRoomSize(roomConfig.baseSize, themeConfig);
    const centerBounds = {
      x: MAP_CONFIG.width / 2 - size.width / 2,
      y: MAP_CONFIG.height / 2 - size.height / 2,
      width: size.width,
      height: size.height
    };
    
    rooms.push({ room: livingRoom, bounds: centerBounds });
    placedBounds.push(centerBounds);
  }


  const remainingRooms = roomTypes.filter(r => r !== 'LIVING_ROOM');
  
  remainingRooms.forEach(roomType => {
    const roomConfig = ROOM_TYPES[roomType];
    const size = getAdjustedRoomSize(roomConfig.baseSize, themeConfig);
    let attempts = 0;
    
    while (attempts < MAP_CONFIG.maxAttempts) {
      const roomBounds = findBestPosition(roomType, size, placedBounds, seededRandom);
      
      if (roomBounds) {
        rooms.push({ room: roomType, bounds: roomBounds });
        placedBounds.push(roomBounds);
        break;
      }
      
      attempts++;
    }
  });

  return rooms;
}

export function generateCourtyardLayout(
  roomTypes: RoomType[], 
  themeConfig: typeof ARCHITECTURAL_THEMES[keyof typeof ARCHITECTURAL_THEMES]
): Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> {
  const rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> = [];
  

  const courtyardSize = { width: 150, height: 120 };
  const courtyardCenter = {
    x: MAP_CONFIG.width / 2 - courtyardSize.width / 2,
    y: MAP_CONFIG.height / 2 - courtyardSize.height / 2
  };
  

  const sides = ['top', 'right', 'bottom', 'left'];
  const roomsPerSide = Math.ceil(roomTypes.length / 4);
  
  roomTypes.forEach((roomType, index) => {
    const side = sides[Math.floor(index / roomsPerSide)];
    const roomConfig = ROOM_TYPES[roomType];
    const size = getAdjustedRoomSize(roomConfig.baseSize, themeConfig);
    
    const roomBounds = getPositionAroundCourtyard(side, index % roomsPerSide, size, courtyardCenter, courtyardSize);
    
    if (roomBounds) {
      rooms.push({ room: roomType, bounds: roomBounds });
    }
  });
  
  return rooms;
}

export function generateLinearLayout(
  roomTypes: RoomType[], 
  themeConfig: typeof ARCHITECTURAL_THEMES[keyof typeof ARCHITECTURAL_THEMES],
  seededRandom: () => number
): Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> {
  const rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> = [];
  
  const isHorizontal = seededRandom() > 0.5;
  
  let currentPosition = MAP_CONFIG.padding;
  
  roomTypes.forEach(roomType => {
    const roomConfig = ROOM_TYPES[roomType];
    const size = getAdjustedRoomSize(roomConfig.baseSize, themeConfig);
    
    if (isHorizontal) {
      const roomBounds = {
        x: currentPosition,
        y: MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.height - 2 * MAP_CONFIG.padding - size.height),
        width: size.width,
        height: size.height
      };
      
      rooms.push({ room: roomType, bounds: roomBounds });
      currentPosition += size.width + 20;
    } else {
      const roomBounds = {
        x: MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.width - 2 * MAP_CONFIG.padding - size.width),
        y: currentPosition,
        width: size.width,
        height: size.height
      };
      
      rooms.push({ room: roomType, bounds: roomBounds });
      currentPosition += size.height + 20;
    }
  });
  
  return rooms;
}

function getAdjustedRoomSize(
  baseSize: { width: number; height: number }, 
  themeConfig: typeof ARCHITECTURAL_THEMES[keyof typeof ARCHITECTURAL_THEMES]
): { width: number; height: number } {
  return {
    width: Math.floor(baseSize.width * themeConfig.roomSizeMultiplier),
    height: Math.floor(baseSize.height * themeConfig.roomSizeMultiplier)
  };
}

function findBestPosition(
  roomType: RoomType,
  size: { width: number; height: number },
  placedBounds: Array<{ x: number; y: number; width: number; height: number }>,
  seededRandom: () => number
): { x: number; y: number; width: number; height: number } | null {
  let bestPosition: { x: number; y: number; width: number; height: number } | null = null;
  let bestScore = -1;
  
  for (let attempts = 0; attempts < 50; attempts++) {
    const candidate = {
      x: MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.width - 2 * MAP_CONFIG.padding - size.width),
      y: MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.height - 2 * MAP_CONFIG.padding - size.height),
      width: size.width,
      height: size.height
    };
    

    const hasCollision = placedBounds.some(placed => checkCollision(candidate, placed, 25));
    if (hasCollision) continue;
    

    const score = calculatePositionScore(roomType, candidate);
    
    if (score > bestScore) {
      bestScore = score;
      bestPosition = candidate;
    }
  }
  
  return bestPosition;
}

function calculatePositionScore(
  roomType: RoomType,
  position: { x: number; y: number; width: number; height: number }
): number {

  let score = 1;
  

  const centerDistance = Math.sqrt(
    Math.pow(position.x + position.width/2 - MAP_CONFIG.width/2, 2) +
    Math.pow(position.y + position.height/2 - MAP_CONFIG.height/2, 2)
  );
  
  if (ROOM_TYPES[roomType].type === 'social') {
    score += Math.max(0, (200 - centerDistance) / 200);
  }
  
  return score;
}

function getPositionAroundCourtyard(
  side: string,
  index: number,
  size: { width: number; height: number },
  courtyardCenter: { x: number; y: number },
  courtyardSize: { width: number; height: number }
): { x: number; y: number; width: number; height: number } | null {
  switch (side) {
    case 'top':
      return {
        x: courtyardCenter.x + index * (size.width + 10),
        y: courtyardCenter.y - size.height - 20,
        width: size.width,
        height: size.height
      };
    case 'right':
      return {
        x: courtyardCenter.x + courtyardSize.width + 20,
        y: courtyardCenter.y + index * (size.height + 10),
        width: size.width,
        height: size.height
      };
    case 'bottom':
      return {
        x: courtyardCenter.x + index * (size.width + 10),
        y: courtyardCenter.y + courtyardSize.height + 20,
        width: size.width,
        height: size.height
      };
    case 'left':
      return {
        x: courtyardCenter.x - size.width - 20,
        y: courtyardCenter.y + index * (size.height + 10),
        width: size.width,
        height: size.height
      };
    default:
      return null;
  }
}

export function generateProceduralMap(seed?: string): { zones: Zone[]; mapElements: MapElement[] } {
  console.log('🌿 Generando mapa con algoritmos orgánicos...');
  

  return generateOrganicProceduralMap(seed, {
    theme: 'MODERN',
    useVoronoi: true,
    organicStreets: true,
    densityVariation: 0.8,
    naturalClustering: true
  });
}
