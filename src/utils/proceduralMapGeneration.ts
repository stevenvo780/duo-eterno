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

// 📐 CONFIGURACIÓN DEL LIENZO
export const MAP_CONFIG = {
  width: 1000,
  height: 600,
  padding: 50,        // Margen desde los bordes
  minDistance: 15,    // Distancia mínima entre elementos
  maxAttempts: 100    // Intentos máximos para colocar un elemento
} as const;

// 🎨 TEMAS ARQUITECTÓNICOS
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

// 🏗️ ALGORITMOS DE LAYOUT
export const LAYOUT_ALGORITHMS = {
  TRADITIONAL_L: 'traditional_l',
  COURTYARD: 'courtyard',
  LINEAR: 'linear',
  U_SHAPED: 'u_shaped',
  COMPACT_GRID: 'compact_grid'
} as const;

// 🏠 TIPOS DE HABITACIONES MEJORADOS CON ADYACENCIAS
export const ROOM_TYPES = {
  KITCHEN: {
    name: 'Cocina',
    type: 'food' as const,
    baseSize: { width: 120, height: 80 },
    priority: 'high', // high, medium, low
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

// � GENERAR SEMILLA ÚNICA PARA LA PARTIDA
export function generateMapSeed(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 🎯 VERIFICAR COLISIONES
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

// �🏗️ SELECCIÓN DE TEMA Y ALGORITMO DE LAYOUT
function selectThemeAndLayout(seed: string): {
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

// 🏠 ALGORITMO DE DISEÑO DE CASA MEJORADO
export function generateHouseLayout(seed: string): {
  rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }>;
  hallways: Array<{ x: number; y: number; width: number; height: number }>;
  theme: keyof typeof ARCHITECTURAL_THEMES;
} {
  const { theme, layout } = selectThemeAndLayout(seed);
  const themeConfig = ARCHITECTURAL_THEMES[theme];
  
  // Usar seed para generar números pseudo-aleatorios reproducibles
  let seedValue = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  // Seleccionar habitaciones según el tema y algoritmo
  const selectedRooms = selectRoomsForLayout(layout, seededRandom);
  
  // Generar layout específico
  let rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> = [];
  
  switch (layout) {
    case LAYOUT_ALGORITHMS.TRADITIONAL_L:
      rooms = generateTraditionalLLayout(selectedRooms, themeConfig, seededRandom);
      break;
    case LAYOUT_ALGORITHMS.COURTYARD:
      rooms = generateCourtyardLayout(selectedRooms, themeConfig, seededRandom);
      break;
    case LAYOUT_ALGORITHMS.LINEAR:
      rooms = generateLinearLayout(selectedRooms, themeConfig, seededRandom);
      break;
    case LAYOUT_ALGORITHMS.U_SHAPED:
      rooms = generateUShapedLayout(selectedRooms, themeConfig, seededRandom);
      break;
    case LAYOUT_ALGORITHMS.COMPACT_GRID:
      rooms = generateCompactGridLayout(selectedRooms, themeConfig, seededRandom);
      break;
    default:
      rooms = generateTraditionalLLayout(selectedRooms, themeConfig, seededRandom);
  }

  return { rooms, hallways: [], theme };
}

// 🎯 SELECCIÓN INTELIGENTE DE HABITACIONES
function selectRoomsForLayout(layout: string, seededRandom: () => number): RoomType[] {
  const allRoomTypes = Object.keys(ROOM_TYPES) as RoomType[];
  const selectedRooms: RoomType[] = [];
  
  // Habitaciones esenciales (siempre incluidas, respetando maxInstances)
  const essentialRooms: RoomType[] = ['KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'BATHROOM'];
  
  // Agregar habitaciones esenciales respetando maxInstances
  essentialRooms.forEach(roomType => {
    const roomConfig = ROOM_TYPES[roomType];
    const maxInstances = roomConfig.maxInstances;
    
    // Para habitaciones que permiten múltiples instancias (como BEDROOM)
    if (maxInstances > 1) {
      const numInstances = Math.min(
        Math.floor(seededRandom() * maxInstances) + 1,
        maxInstances
      );
      for (let i = 0; i < numInstances; i++) {
        selectedRooms.push(roomType);
      }
    } else {
      // Para habitaciones únicas
      selectedRooms.push(roomType);
    }
  });
  
  // Habitaciones opcionales (respetando maxInstances)
  const optionalRooms = allRoomTypes.filter(room => !essentialRooms.includes(room));
  const maxOptionalRooms = layout === LAYOUT_ALGORITHMS.COMPACT_GRID ? 2 : 3;
  
  // Seleccionar habitaciones opcionales sin duplicar las que ya tienen maxInstances = 1
  const availableOptional = optionalRooms.filter(roomType => {
    const roomConfig = ROOM_TYPES[roomType];
    // Solo incluir si no está ya seleccionada o si permite múltiples instancias
    return !selectedRooms.includes(roomType) || roomConfig.maxInstances > 1;
  });
  
  for (let i = 0; i < maxOptionalRooms && availableOptional.length > 0; i++) {
    const randomIndex = Math.floor(seededRandom() * availableOptional.length);
    const roomType = availableOptional[randomIndex];
    const roomConfig = ROOM_TYPES[roomType];
    
    // Verificar si ya tenemos el máximo de instancias
    const currentCount = selectedRooms.filter(r => r === roomType).length;
    if (currentCount < roomConfig.maxInstances) {
      selectedRooms.push(roomType);
    }
    
    // Si llegamos al máximo, remover de disponibles
    if (currentCount + 1 >= roomConfig.maxInstances) {
      availableOptional.splice(randomIndex, 1);
    }
  }
  
  return selectedRooms;
}

// 🏗️ ALGORITMOS DE LAYOUT ESPECÍFICOS
function generateTraditionalLLayout(
  roomTypes: RoomType[], 
  themeConfig: typeof ARCHITECTURAL_THEMES[keyof typeof ARCHITECTURAL_THEMES],
  seededRandom: () => number
): Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> {
  const rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> = [];
  const placedBounds: Array<{ x: number; y: number; width: number; height: number }> = [];
  
  // 1. Colocar sala de estar en el centro
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

  // 2. Colocar habitaciones restantes usando adyacencias
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

function generateCourtyardLayout(
  roomTypes: RoomType[], 
  themeConfig: typeof ARCHITECTURAL_THEMES[keyof typeof ARCHITECTURAL_THEMES],
  _seededRandom: () => number
): Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> {
  const rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> = [];
  
  // Crear patio central
  const courtyardSize = { width: 150, height: 120 };
  const courtyardCenter = {
    x: MAP_CONFIG.width / 2 - courtyardSize.width / 2,
    y: MAP_CONFIG.height / 2 - courtyardSize.height / 2
  };
  
  // Distribuir habitaciones alrededor del patio
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

function generateLinearLayout(
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

function generateUShapedLayout(
  roomTypes: RoomType[], 
  themeConfig: typeof ARCHITECTURAL_THEMES[keyof typeof ARCHITECTURAL_THEMES],
  _seededRandom: () => number
): Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> {
  const rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> = [];
  
  // Dividir habitaciones en tres grupos para las tres alas de la U
  const leftWing = roomTypes.slice(0, Math.ceil(roomTypes.length / 3));
  const centerWing = roomTypes.slice(Math.ceil(roomTypes.length / 3), Math.ceil(2 * roomTypes.length / 3));
  const rightWing = roomTypes.slice(Math.ceil(2 * roomTypes.length / 3));
  
  // Posicionar cada ala
  [leftWing, centerWing, rightWing].forEach((wing, wingIndex) => {
    wing.forEach((roomType, roomIndex) => {
      const roomConfig = ROOM_TYPES[roomType];
      const size = getAdjustedRoomSize(roomConfig.baseSize, themeConfig);
      
      let roomBounds: { x: number; y: number; width: number; height: number };
      
      switch (wingIndex) {
        case 0: // Left wing
          roomBounds = {
            x: MAP_CONFIG.padding,
            y: MAP_CONFIG.padding + roomIndex * (size.height + 20),
            width: size.width,
            height: size.height
          };
          break;
        case 1: // Center wing
          roomBounds = {
            x: MAP_CONFIG.padding + size.width + 40,
            y: MAP_CONFIG.height - MAP_CONFIG.padding - size.height,
            width: size.width,
            height: size.height
          };
          break;
        case 2: // Right wing
          roomBounds = {
            x: MAP_CONFIG.width - MAP_CONFIG.padding - size.width,
            y: MAP_CONFIG.padding + roomIndex * (size.height + 20),
            width: size.width,
            height: size.height
          };
          break;
        default:
          roomBounds = {
            x: MAP_CONFIG.padding,
            y: MAP_CONFIG.padding,
            width: size.width,
            height: size.height
          };
      }
      
      rooms.push({ room: roomType, bounds: roomBounds });
    });
  });
  
  return rooms;
}

function generateCompactGridLayout(
  roomTypes: RoomType[], 
  themeConfig: typeof ARCHITECTURAL_THEMES[keyof typeof ARCHITECTURAL_THEMES],
  _seededRandom: () => number
): Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> {
  const rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> = [];
  
  // Calcular grid óptimo
  const gridCols = Math.ceil(Math.sqrt(roomTypes.length));
  const gridRows = Math.ceil(roomTypes.length / gridCols);
  
  const cellWidth = (MAP_CONFIG.width - 2 * MAP_CONFIG.padding) / gridCols;
  const cellHeight = (MAP_CONFIG.height - 2 * MAP_CONFIG.padding) / gridRows;
  
  roomTypes.forEach((roomType, index) => {
    const row = Math.floor(index / gridCols);
    const col = index % gridCols;
    
    const roomConfig = ROOM_TYPES[roomType];
    let size = getAdjustedRoomSize(roomConfig.baseSize, themeConfig);
    
    // Ajustar tamaño a la celda disponible
    size = {
      width: Math.min(size.width, cellWidth - 20),
      height: Math.min(size.height, cellHeight - 20)
    };
    
    const roomBounds = {
      x: MAP_CONFIG.padding + col * cellWidth + (cellWidth - size.width) / 2,
      y: MAP_CONFIG.padding + row * cellHeight + (cellHeight - size.height) / 2,
      width: size.width,
      height: size.height
    };
    
    rooms.push({ room: roomType, bounds: roomBounds });
  });
  
  return rooms;
}

// 🛠️ FUNCIONES AUXILIARES
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
    
    // Verificar colisiones
    const hasCollision = placedBounds.some(placed => checkCollision(candidate, placed, 25));
    if (hasCollision) continue;
    
    // Calcular score basado en adyacencias preferidas
    const score = calculatePositionScore(roomType, candidate, placedBounds);
    
    if (score > bestScore) {
      bestScore = score;
      bestPosition = candidate;
    }
  }
  
  return bestPosition;
}

function calculatePositionScore(
  roomType: RoomType,
  position: { x: number; y: number; width: number; height: number },
  _placedBounds: Array<{ x: number; y: number; width: number; height: number }>
): number {
  // Score básico por estar dentro de límites
  let score = 1;
  
  // Bonus por estar cerca del centro (para habitaciones sociales)
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

// 🎨 COLOCAR DECORACIONES MEJORADAS
export function placeDecorations(
  rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }>,
  seed: string,
  theme: keyof typeof ARCHITECTURAL_THEMES
): MapElement[] {
  let seedValue = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + 12345;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  const decorations: MapElement[] = [];
  const occupiedSpaces: Array<{ x: number; y: number; width: number; height: number }> = [];
  const themeConfig = ARCHITECTURAL_THEMES[theme];

  rooms.forEach(({ room, bounds }) => {
    const roomConfig = ROOM_TYPES[room];
    const decorationConfig = roomConfig.decorations;
    
    // Decoraciones esenciales
    decorationConfig.essential.forEach((decorationType, index) => {
      const decorationSize = getDecorationSize(decorationType);
      let attempts = 0;
      
      while (attempts < 30) {
        const decorationBounds = {
          x: bounds.x + 15 + seededRandom() * (bounds.width - decorationSize.width - 30),
          y: bounds.y + 15 + seededRandom() * (bounds.height - decorationSize.height - 30),
          width: decorationSize.width,
          height: decorationSize.height
        };

        const hasCollision = occupiedSpaces.some(space => 
          checkCollision(decorationBounds, space, 8)
        );

        if (!hasCollision) {
          decorations.push({
            id: `${decorationType}_${room}_essential_${index}`,
            type: getDecorationMapType(decorationType),
            position: { x: decorationBounds.x, y: decorationBounds.y },
            size: { width: decorationBounds.width, height: decorationBounds.height },
            color: getThemedDecorationColor(decorationType, theme)
          });
          
          occupiedSpaces.push(decorationBounds);
          break;
        }
        
        attempts++;
      }
    });

    // Decoraciones opcionales (basadas en probabilidad y tema)
    const numOptional = themeConfig.decorationStyle === 'minimal' ? 1 : 
                       themeConfig.decorationStyle === 'compact' ? 2 : 3;
    
    for (let i = 0; i < numOptional && i < decorationConfig.optional.length; i++) {
      const decorationType = decorationConfig.optional[Math.floor(seededRandom() * decorationConfig.optional.length)];
      const decorationSize = getDecorationSize(decorationType);
      let attempts = 0;
      
      while (attempts < 20) {
        const decorationBounds = {
          x: bounds.x + 10 + seededRandom() * (bounds.width - decorationSize.width - 20),
          y: bounds.y + 10 + seededRandom() * (bounds.height - decorationSize.height - 20),
          width: decorationSize.width,
          height: decorationSize.height
        };

        const hasCollision = occupiedSpaces.some(space => 
          checkCollision(decorationBounds, space, 5)
        );

        if (!hasCollision) {
          decorations.push({
            id: `${decorationType}_${room}_optional_${i}`,
            type: getDecorationMapType(decorationType),
            position: { x: decorationBounds.x, y: decorationBounds.y },
            size: { width: decorationBounds.width, height: decorationBounds.height },
            color: getThemedDecorationColor(decorationType, theme)
          });
          
          occupiedSpaces.push(decorationBounds);
          break;
        }
        
        attempts++;
      }
    }

    // Decoraciones temáticas específicas
    const themedDecorations = decorationConfig.themed[theme.toLowerCase() as keyof typeof decorationConfig.themed] || [];
    if (themedDecorations.length > 0) {
      const decorationType = themedDecorations[Math.floor(seededRandom() * themedDecorations.length)];
      const decorationSize = getDecorationSize(decorationType);
      let attempts = 0;
      
      while (attempts < 15) {
        const decorationBounds = {
          x: bounds.x + 10 + seededRandom() * (bounds.width - decorationSize.width - 20),
          y: bounds.y + 10 + seededRandom() * (bounds.height - decorationSize.height - 20),
          width: decorationSize.width,
          height: decorationSize.height
        };

        const hasCollision = occupiedSpaces.some(space => 
          checkCollision(decorationBounds, space, 5)
        );

        if (!hasCollision) {
          decorations.push({
            id: `${decorationType}_${room}_themed`,
            type: getDecorationMapType(decorationType),
            position: { x: decorationBounds.x, y: decorationBounds.y },
            size: { width: decorationBounds.width, height: decorationBounds.height },
            color: getThemedDecorationColor(decorationType, theme)
          });
          
          occupiedSpaces.push(decorationBounds);
          break;
        }
        
        attempts++;
      }
    }
  });

  return decorations;
}

// 🛠️ FUNCIONES AUXILIARES MEJORADAS
function getThemedDecorationColor(decorationType: string, theme: keyof typeof ARCHITECTURAL_THEMES): string {
  const baseColors = getDecorationColor(decorationType);
  
  // Aplicar tinte del tema a los colores base
  switch (theme) {
    case 'MODERN':
      return baseColors === '#64748b' ? '#9CA3AF' : baseColors;
    case 'RUSTIC':
      return baseColors === '#64748b' ? '#8B4513' : baseColors;
    case 'ECOLOGICAL':
      return baseColors === '#64748b' ? '#059669' : baseColors;
    case 'URBAN':
      return baseColors === '#64748b' ? '#6B7280' : baseColors;
    default:
      return baseColors;
  }
}

// 🛠️ FUNCIONES AUXILIARES
function getDecorationSize(type: string): { width: number; height: number } {
  const sizes: Record<string, { width: number; height: number }> = {
    // Muebles
    furniture_bed_simple: { width: 32, height: 20 },
    furniture_bed_double: { width: 32, height: 24 },
    furniture_sofa_modern: { width: 32, height: 16 },
    furniture_sofa_classic: { width: 32, height: 18 },
    furniture_table_coffee: { width: 24, height: 16 },
    furniture_table_dining: { width: 32, height: 20 },
    
    // Plantas
    plant_small: { width: 12, height: 12 },
    plant_tree: { width: 32, height: 40 },
    plant_flower: { width: 16, height: 16 },
    
    // Decoración
    deco_lamp: { width: 12, height: 20 },
    deco_clock: { width: 16, height: 16 },
    deco_bookshelf: { width: 28, height: 32 },
    
    // Legacy (mantener compatibilidad)
    flower: { width: 8, height: 8 },
    banco: { width: 24, height: 12 },
    lamp: { width: 16, height: 24 },
    fuente: { width: 32, height: 32 },
    arbol: { width: 25, height: 60 }
  };
  
  return sizes[type] || { width: 16, height: 16 };
}

function getDecorationMapType(decorationType: string): MapElement['type'] {
  const typeMap: Record<string, MapElement['type']> = {
    // Muebles
    furniture_bed_simple: 'rest_zone',
    furniture_bed_double: 'rest_zone',
    furniture_sofa_modern: 'social_zone',
    furniture_sofa_classic: 'social_zone',
    furniture_table_coffee: 'social_zone',
    furniture_table_dining: 'food_zone',
    
    // Plantas
    plant_small: 'food_zone',
    plant_tree: 'obstacle',
    plant_flower: 'food_zone',
    
    // Decoración
    deco_lamp: 'play_zone',
    deco_clock: 'play_zone',
    deco_bookshelf: 'play_zone',
    
    // Legacy
    flower: 'food_zone',
    banco: 'rest_zone',
    lamp: 'play_zone',
    fuente: 'social_zone',
    arbol: 'obstacle'
  };
  
  return typeMap[decorationType] || 'obstacle';
}

function getDecorationColor(decorationType: string): string {
  const colors: Record<string, string> = {
    // Muebles
    furniture_bed_simple: '#8B4513',
    furniture_bed_double: '#654321',
    furniture_sofa_modern: '#4169E1',
    furniture_sofa_classic: '#DC143C',
    furniture_table_coffee: '#DEB887',
    furniture_table_dining: '#A0522D',
    
    // Plantas
    plant_small: '#228B22',
    plant_tree: '#006400',
    plant_flower: '#ff6b9d',
    
    // Decoración
    deco_lamp: '#f2d450',
    deco_clock: '#B5A642',
    deco_bookshelf: '#8B4513',
    
    // Legacy
    flower: '#ff6b9d',
    banco: '#9e684c',
    lamp: '#f2d450',
    fuente: '#63bda4',
    arbol: '#059669'
  };
  
  return colors[decorationType] || '#64748b';
}

// 🎮 GENERAR MAPA COMPLETO - MIGRADO A SISTEMA ORGÁNICO
export function generateProceduralMap(seed?: string): { zones: Zone[]; mapElements: MapElement[] } {
  console.log('🌿 Generando mapa con algoritmos orgánicos...');
  
  // Usar el nuevo sistema orgánico por defecto
  return generateOrganicProceduralMap(seed, {
    theme: 'MODERN',
    useVoronoi: true,
    organicStreets: true,
    densityVariation: 0.8,
    naturalClustering: true
  });
}

// 🎨 OBTENER COLOR TEMÁTICO PARA HABITACIONES
export function getThemedRoomColor(zoneType: Zone['type'], theme: keyof typeof ARCHITECTURAL_THEMES): string {
  const themeConfig = ARCHITECTURAL_THEMES[theme];
  
  // Mapear tipos de zona a colores según el tema
  const colorMap: Record<Zone['type'], keyof typeof themeConfig.colors> = {
    food: 'primary',
    rest: 'secondary',
    social: 'accent',
    play: 'accent',
    work: 'secondary',
    comfort: 'primary',
    energy: 'primary',
    kitchen: 'primary',
    bedroom: 'secondary',
    living: 'accent',
    bathroom: 'secondary',
    office: 'secondary',
    gym: 'primary',
    library: 'secondary',
    recreation: 'accent'
  };
  
  return themeConfig.colors[colorMap[zoneType] || 'primary'];
}

// 🛠️ FUNCIONES AUXILIARES MEJORADAS (CONTINUACIÓN)

export function getZoneEffects(zoneType: Zone['type']): Zone['effects'] {
  const effects: Record<Zone['type'], Zone['effects']> = {
    food: { hunger: 30, happiness: 12, energy: 5 },
    rest: { sleepiness: 35, energy: 30, happiness: 15 },
    play: { boredom: 45, happiness: 25, loneliness: 20 },
    social: { loneliness: 40, happiness: 20, boredom: 15 },
    work: { money: 80 },
    comfort: { happiness: 18, boredom: 20, loneliness: 15 },
    energy: { energy: 50, sleepiness: 25, happiness: 10 },
    kitchen: { hunger: 25, happiness: 10 },
    bedroom: { sleepiness: 40, energy: 25 },
    living: { happiness: 15, loneliness: 10 },
    bathroom: { health: 10, happiness: 5 },
    office: { money: 60, boredom: -5 },
    gym: { energy: -10, health: 20, happiness: 15 },
    library: { happiness: 10, boredom: 30 },
    recreation: { happiness: 20, boredom: 25 }
  };
  
  return effects[zoneType] || {};
}