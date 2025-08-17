/**
 * 🏠 GENERADOR PROCEDIMENTAL DE MAPAS
 * 
 * Crea mapas únicos para cada partida con distribución inteligente de elementos
 * y algoritmo de "casa" coherente
 */

import type { Zone, MapElement } from '../types';
import { generatePaths } from './pathGeneration';

// 📐 CONFIGURACIÓN DEL LIENZO
export const MAP_CONFIG = {
  width: 1000,
  height: 600,
  padding: 50,        // Margen desde los bordes
  minDistance: 15,    // Distancia mínima entre elementos
  maxAttempts: 100    // Intentos máximos para colocar un elemento
} as const;

// 🏠 TIPOS DE HABITACIONES Y SUS CARACTERÍSTICAS
export const ROOM_TYPES = {
  KITCHEN: {
    name: 'Cocina',
    type: 'food' as const,
    preferredSize: { width: 120, height: 80 },
    preferredPosition: 'corner', // corner, wall, center
    decorations: ['plant_small', 'deco_lamp', 'furniture_table_dining'],
    adjacentTo: ['DINING', 'GARDEN'],
    color: 'rgba(122, 199, 90, 0.25)'
  },
  
  BEDROOM: {
    name: 'Dormitorio',
    type: 'rest' as const,
    preferredSize: { width: 140, height: 100 },
    preferredPosition: 'corner',
    decorations: ['furniture_bed_simple', 'furniture_bed_double', 'deco_lamp', 'plant_small'],
    adjacentTo: ['BATHROOM', 'HALLWAY'],
    color: 'rgba(99, 155, 255, 0.25)'
  },
  
  LIVING_ROOM: {
    name: 'Sala de Estar',
    type: 'social' as const,
    preferredSize: { width: 180, height: 120 },
    preferredPosition: 'center',
    decorations: ['furniture_sofa_modern', 'furniture_sofa_classic', 'furniture_table_coffee', 'plant_tree', 'deco_bookshelf'],
    adjacentTo: ['KITCHEN', 'HALLWAY'],
    color: 'rgba(99, 189, 164, 0.3)'
  },
  
  GAME_ROOM: {
    name: 'Sala de Juegos',
    type: 'play' as const,
    preferredSize: { width: 200, height: 140 },
    preferredPosition: 'center',
    decorations: ['furniture_table_coffee', 'deco_lamp', 'plant_flower'],
    adjacentTo: ['LIVING_ROOM'],
    color: 'rgba(242, 212, 80, 0.3)'
  },
  
  STUDY: {
    name: 'Estudio',
    type: 'work' as const,
    preferredSize: { width: 140, height: 100 },
    preferredPosition: 'corner',
    decorations: ['deco_bookshelf', 'deco_lamp', 'deco_clock', 'plant_small'],
    adjacentTo: ['HALLWAY'],
    color: 'rgba(138, 95, 184, 0.25)'
  },
  
  GARDEN: {
    name: 'Jardín',
    type: 'comfort' as const,
    preferredSize: { width: 160, height: 130 },
    preferredPosition: 'wall',
    decorations: ['plant_flower', 'plant_tree', 'plant_small', 'banco'],
    adjacentTo: ['KITCHEN'],
    color: 'rgba(138, 95, 184, 0.25)'
  },
  
  UTILITY: {
    name: 'Zona de Servicios',
    type: 'energy' as const,
    preferredSize: { width: 120, height: 100 },
    preferredPosition: 'corner',
    decorations: ['deco_lamp', 'plant_small'],
    adjacentTo: [],
    color: 'rgba(245, 158, 11, 0.25)'
  }
} as const;

type RoomType = keyof typeof ROOM_TYPES;

// 🎲 GENERAR SEMILLA ÚNICA PARA LA PARTIDA
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

// 🏠 ALGORITMO DE DISEÑO DE CASA
export function generateHouseLayout(seed: string): {
  rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }>;
  hallways: Array<{ x: number; y: number; width: number; height: number }>;
} {
  // Usar seed para generar números pseudo-aleatorios reproducibles
  let seedValue = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  const rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }> = [];
  const placedBounds: Array<{ x: number; y: number; width: number; height: number }> = [];
  
  // 1. Colocar habitación principal (LIVING_ROOM) en el centro
  const centerRoom = ROOM_TYPES.LIVING_ROOM;
  const centerBounds = {
    x: MAP_CONFIG.width / 2 - centerRoom.preferredSize.width / 2,
    y: MAP_CONFIG.height / 2 - centerRoom.preferredSize.height / 2,
    width: centerRoom.preferredSize.width,
    height: centerRoom.preferredSize.height
  };
  
  rooms.push({ room: 'LIVING_ROOM', bounds: centerBounds });
  placedBounds.push(centerBounds);

  // 2. Colocar habitaciones en corners
  const cornerRooms: RoomType[] = ['KITCHEN', 'BEDROOM', 'STUDY', 'UTILITY'];
  const corners = [
    { x: MAP_CONFIG.padding, y: MAP_CONFIG.padding }, // Top-left
    { x: MAP_CONFIG.width - MAP_CONFIG.padding, y: MAP_CONFIG.padding }, // Top-right
    { x: MAP_CONFIG.padding, y: MAP_CONFIG.height - MAP_CONFIG.padding }, // Bottom-left
    { x: MAP_CONFIG.width - MAP_CONFIG.padding, y: MAP_CONFIG.height - MAP_CONFIG.padding } // Bottom-right
  ];

  cornerRooms.forEach((roomType, index) => {
    if (index >= corners.length) return;
    
    const roomConfig = ROOM_TYPES[roomType];
    const corner = corners[index];
    
    // Ajustar posición según la esquina
    const roomBounds = {
      x: corner.x,
      y: corner.y,
      width: roomConfig.preferredSize.width,
      height: roomConfig.preferredSize.height
    };

    // Ajustar para que esté dentro de los límites
    if (index === 1 || index === 3) { // Right corners
      roomBounds.x -= roomBounds.width;
    }
    if (index === 2 || index === 3) { // Bottom corners
      roomBounds.y -= roomBounds.height;
    }

    // Verificar colisiones y ajustar si es necesario
    let attempts = 0;
    while (attempts < MAP_CONFIG.maxAttempts) {
      const hasCollision = placedBounds.some(placed => 
        checkCollision(roomBounds, placed, 20)
      );

      if (!hasCollision) break;

      // Mover ligeramente
      roomBounds.x += (seededRandom() - 0.5) * 20;
      roomBounds.y += (seededRandom() - 0.5) * 20;
      
      // Mantener dentro de los límites
      roomBounds.x = Math.max(MAP_CONFIG.padding, 
        Math.min(MAP_CONFIG.width - MAP_CONFIG.padding - roomBounds.width, roomBounds.x));
      roomBounds.y = Math.max(MAP_CONFIG.padding, 
        Math.min(MAP_CONFIG.height - MAP_CONFIG.padding - roomBounds.height, roomBounds.y));
      
      attempts++;
    }

    if (attempts < MAP_CONFIG.maxAttempts) {
      rooms.push({ room: roomType, bounds: roomBounds });
      placedBounds.push(roomBounds);
    }
  });

  // 3. Colocar habitaciones restantes
  const remainingRooms: RoomType[] = ['GAME_ROOM', 'GARDEN'];
  
  remainingRooms.forEach(roomType => {
    const roomConfig = ROOM_TYPES[roomType];
    let attempts = 0;
    
    while (attempts < MAP_CONFIG.maxAttempts) {
      const roomBounds = {
        x: MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.width - 2 * MAP_CONFIG.padding - roomConfig.preferredSize.width),
        y: MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.height - 2 * MAP_CONFIG.padding - roomConfig.preferredSize.height),
        width: roomConfig.preferredSize.width,
        height: roomConfig.preferredSize.height
      };

      const hasCollision = placedBounds.some(placed => 
        checkCollision(roomBounds, placed, 25)
      );

      if (!hasCollision) {
        rooms.push({ room: roomType, bounds: roomBounds });
        placedBounds.push(roomBounds);
        break;
      }
      
      attempts++;
    }
  });

  return { rooms, hallways: [] }; // TODO: Implementar hallways en el futuro
}

// 🎨 COLOCAR DECORACIONES
export function placeDecorations(
  rooms: Array<{ room: RoomType; bounds: { x: number; y: number; width: number; height: number } }>,
  seed: string
): MapElement[] {
  let seedValue = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + 12345;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  const decorations: MapElement[] = [];
  const occupiedSpaces: Array<{ x: number; y: number; width: number; height: number }> = [];

  rooms.forEach(({ room, bounds }) => {
    const roomConfig = ROOM_TYPES[room];
    
    roomConfig.decorations.forEach(decorationType => {
      const decorationCount = Math.floor(seededRandom() * 3) + 1; // 1-3 decoraciones por tipo
      
      for (let i = 0; i < decorationCount; i++) {
        let attempts = 0;
        
        while (attempts < 50) {
          const decorationSize = getDecorationSize(decorationType);
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
              id: `${decorationType}_${room}_${i}`,
              type: getDecorationMapType(decorationType),
              position: { x: decorationBounds.x, y: decorationBounds.y },
              size: { width: decorationBounds.width, height: decorationBounds.height },
              color: getDecorationColor(decorationType)
            });
            
            occupiedSpaces.push(decorationBounds);
            break;
          }
          
          attempts++;
        }
      }
    });
  });

  return decorations;
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

// 🎮 GENERAR MAPA COMPLETO
export function generateProceduralMap(seed?: string): { zones: Zone[]; mapElements: MapElement[] } {
  const mapSeed = seed || generateMapSeed();
  
  // Generar layout de casa
  const { rooms } = generateHouseLayout(mapSeed);
  
  // Convertir habitaciones a zonas
  const zones: Zone[] = rooms.map(({ room, bounds }) => {
    const roomConfig = ROOM_TYPES[room];
    return {
      id: `${room.toLowerCase()}_${mapSeed.slice(-4)}`,
      name: roomConfig.name,
      bounds,
      type: roomConfig.type,
      color: roomConfig.color,
      attractiveness: 1.0,
      effects: getZoneEffects(roomConfig.type)
    };
  });

  // Generar decoraciones
  const decorations = placeDecorations(rooms, mapSeed);
  
  // Generar caminos entre zonas
  const paths = generatePaths(zones, mapSeed);
  
  // Combinar todas las decoraciones y caminos
  const mapElements = [...decorations, ...paths];

  return { zones, mapElements };
}

function getZoneEffects(zoneType: Zone['type']): Zone['effects'] {
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