/**
 * 🏘️ GENERADOR AVANZADO DE CAMINOS URBANOS
 * 
 * Crea una red de caminos jerárquica que simula un pequeño pueblo
 * con calles principales, secundarias, senderos y espacios públicos
 */

import type { Zone, MapElement } from '../types';
import { MAP_CONFIG, checkCollision, ARCHITECTURAL_THEMES } from './proceduralMapGeneration';

// 🛣️ CONFIGURACIÓN DE CAMINOS JERÁRQUICOS
const PATH_CONFIG = {
  MAIN_STREET: {
    width: 20,
    type: 'main_road',
    color: '#4A5568',
    priority: 1
  },
  SECONDARY_STREET: {
    width: 16,
    type: 'secondary_road', 
    color: '#6B7280',
    priority: 2
  },
  PATHWAY: {
    width: 12,
    type: 'pathway',
    color: '#9CA3AF',
    priority: 3
  },
  PEDESTRIAN: {
    width: 8,
    type: 'pedestrian',
    color: '#D1D5DB',
    priority: 4
  }
} as const;

// 🏛️ CONFIGURACIÓN DE ESPACIOS PÚBLICOS (comentado - no utilizado actualmente)
/*
const PUBLIC_SPACES = {
  PLAZA: {
    width: 80,
    height: 80,
    type: 'plaza',
    decorations: ['fountain', 'benches', 'trees']
  },
  PARK: {
    width: 100,
    height: 60,
    type: 'park', 
    decorations: ['trees', 'flowers', 'pathways']
  },
  INTERSECTION: {
    width: 24,
    height: 24,
    type: 'intersection',
    decorations: ['street_lamp']
  }
} as const;
*/

// 🎨 ESTILOS TEMÁTICOS DE CAMINOS
const THEMED_PATH_STYLES = {
  MODERN: {
    mainStreet: '#4A5568',    // Asfalto moderno
    secondary: '#6B7280',     // Concreto
    pathway: '#9CA3AF',       // Pavimento
    pedestrian: '#E5E7EB',    // Acera clara
    plaza: '#F3F4F6'          // Plaza minimalista
  },
  RUSTIC: {
    mainStreet: '#8B4513',    // Tierra compacta
    secondary: '#A0522D',     // Adoquines
    pathway: '#CD853F',       // Sendero de grava
    pedestrian: '#DEB887',    // Camino de tierra
    plaza: '#D2691E'          // Plaza de adoquines
  },
  ECOLOGICAL: {
    mainStreet: '#6B8E23',    // Camino ecológico
    secondary: '#8FBC8F',     // Sendero natural
    pathway: '#9ACD32',       // Sendero verde
    pedestrian: '#98FB98',    // Camino de césped
    plaza: '#90EE90'          // Jardín comunitario
  },
  URBAN: {
    mainStreet: '#2F4F4F',    // Asfalto urbano
    secondary: '#555555',     // Calle secundaria
    pathway: '#708090',       // Acera urbana
    pedestrian: '#BEBEBE',    // Camino peatonal
    plaza: '#C0C0C0'          // Plaza urbana
  }
} as const;

// 🏭 FUNCIÓN PRINCIPAL: Generar red completa de caminos temática
export function generatePaths(zones: Zone[], _rooms: unknown[], _mapWidth: number, _mapHeight: number, theme: string): MapElement[] {
  // 🌱 Generar semilla para reproducibilidad
  let seedValue = theme.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0) + 9999;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  const currentTheme = (theme.toUpperCase() as keyof typeof THEMED_PATH_STYLES) || 'MODERN';
  const pathStyle = THEMED_PATH_STYLES[currentTheme];
  const allElements: MapElement[] = [];

  // 1. 🏛️ Crear plaza central como punto focal
  const plaza = createCentralPlaza(zones, seededRandom, pathStyle, currentTheme as keyof typeof ARCHITECTURAL_THEMES);
  if (plaza) {
    allElements.push(plaza);
  }

  // 2. 🛣️ Generar calle principal
  const mainStreet = createMainStreet(zones, plaza, seededRandom, pathStyle);
  allElements.push(...mainStreet);

  // 3. 🛤️ Crear calles secundarias perpendiculares
  const secondaryStreets = createSecondaryStreets(mainStreet, zones, seededRandom, pathStyle);
  allElements.push(...secondaryStreets);

  // 4. 🚶‍♂️ Conectar zonas con senderos
  const pathways = createZoneConnections(zones, [...mainStreet, ...secondaryStreets], seededRandom, pathStyle);
  allElements.push(...pathways);

  // 5. 🌳 Agregar espacios verdes y elementos urbanos
  const urbanElements = createUrbanElements(zones, allElements, seededRandom);
  allElements.push(...urbanElements);

  // 6. ✨ Crear intersecciones y detalles
  const intersections = createIntersections(allElements);
  allElements.push(...intersections);

  return allElements;
}

// 🏛️ CREAR PLAZA CENTRAL
function createCentralPlaza(
  zones: Zone[],
  seededRandom: () => number,
  pathStyle: typeof THEMED_PATH_STYLES[keyof typeof THEMED_PATH_STYLES],
  theme: keyof typeof ARCHITECTURAL_THEMES
): MapElement | null {
  // Encontrar el centro del mapa considerando las zonas
  const centerX = MAP_CONFIG.width / 2;
  const centerY = MAP_CONFIG.height / 2;
  
  const plazaSize = theme === 'URBAN' ? 60 : 80;
  const plazaBounds = {
    x: centerX - plazaSize / 2,
    y: centerY - plazaSize / 2,
    width: plazaSize,
    height: plazaSize
  };

  // Verificar que no colisione con zonas existentes
  const hasCollision = zones.some(zone => 
    checkCollision(plazaBounds, zone.bounds, 15)
  );

  if (hasCollision) {
    // Buscar ubicación alternativa
    for (let attempts = 0; attempts < 20; attempts++) {
      const altX = MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.width - 2 * MAP_CONFIG.padding - plazaSize);
      const altY = MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.height - 2 * MAP_CONFIG.padding - plazaSize);
      
      const altBounds = { x: altX, y: altY, width: plazaSize, height: plazaSize };
      const altCollision = zones.some(zone => checkCollision(altBounds, zone.bounds, 15));
      
      if (!altCollision) {
        return {
          id: `plaza_central_${Date.now()}`,
          type: 'social_zone',
          position: { x: altX, y: altY },
          size: { width: plazaSize, height: plazaSize },
          color: pathStyle.plaza
        };
      }
    }
    return null;
  }

  return {
    id: `plaza_central_${Date.now()}`,
    type: 'social_zone',
    position: { x: plazaBounds.x, y: plazaBounds.y },
    size: { width: plazaSize, height: plazaSize },
    color: pathStyle.plaza
  };
}

// 🛣️ CREAR CALLE PRINCIPAL
function createMainStreet(
  _zones: Zone[],
  plaza: MapElement | null,
  seededRandom: () => number,
  pathStyle: typeof THEMED_PATH_STYLES[keyof typeof THEMED_PATH_STYLES]
): MapElement[] {
  const mainStreet: MapElement[] = [];
  const streetWidth = PATH_CONFIG.MAIN_STREET.width;
  
  // Determinar orientación de la calle principal
  const isHorizontal = seededRandom() > 0.5;
  
  if (isHorizontal) {
    // Calle principal horizontal
    const streetY = plaza ? plaza.position.y + plaza.size.height / 2 - streetWidth / 2 : 
                           MAP_CONFIG.height / 2 - streetWidth / 2;
    
    mainStreet.push({
      id: `main_street_h_${Date.now()}`,
      type: 'play_zone',
      position: { x: MAP_CONFIG.padding, y: streetY },
      size: { width: MAP_CONFIG.width - 2 * MAP_CONFIG.padding, height: streetWidth },
      color: pathStyle.mainStreet
    });
  } else {
    // Calle principal vertical
    const streetX = plaza ? plaza.position.x + plaza.size.width / 2 - streetWidth / 2 : 
                           MAP_CONFIG.width / 2 - streetWidth / 2;
    
    mainStreet.push({
      id: `main_street_v_${Date.now()}`,
      type: 'play_zone',
      position: { x: streetX, y: MAP_CONFIG.padding },
      size: { width: streetWidth, height: MAP_CONFIG.height - 2 * MAP_CONFIG.padding },
      color: pathStyle.mainStreet
    });
  }

  return mainStreet;
}

// 🛤️ CREAR CALLES SECUNDARIAS
function createSecondaryStreets(
  mainStreet: MapElement[],
  _zones: Zone[],
  seededRandom: () => number,
  pathStyle: typeof THEMED_PATH_STYLES[keyof typeof THEMED_PATH_STYLES]
): MapElement[] {
  const secondaryStreets: MapElement[] = [];
  const streetWidth = PATH_CONFIG.SECONDARY_STREET.width;
  
  if (mainStreet.length === 0) return secondaryStreets;
  
  const mainPath = mainStreet[0];
  const isMainHorizontal = mainPath.size.width > mainPath.size.height;
  
  // Crear 2-4 calles secundarias perpendiculares
  const numSecondary = Math.floor(seededRandom() * 3) + 2;
  
  for (let i = 0; i < numSecondary; i++) {
    if (isMainHorizontal) {
      // Calles verticales secundarias
      const streetX = MAP_CONFIG.padding + (i + 1) * (MAP_CONFIG.width - 2 * MAP_CONFIG.padding) / (numSecondary + 1);
      
      secondaryStreets.push({
        id: `secondary_street_v_${i}_${Date.now()}`,
        type: 'play_zone',
        position: { x: streetX - streetWidth / 2, y: MAP_CONFIG.padding },
        size: { width: streetWidth, height: MAP_CONFIG.height - 2 * MAP_CONFIG.padding },
        color: pathStyle.secondary
      });
    } else {
      // Calles horizontales secundarias
      const streetY = MAP_CONFIG.padding + (i + 1) * (MAP_CONFIG.height - 2 * MAP_CONFIG.padding) / (numSecondary + 1);
      
      secondaryStreets.push({
        id: `secondary_street_h_${i}_${Date.now()}`,
        type: 'play_zone',
        position: { x: MAP_CONFIG.padding, y: streetY - streetWidth / 2 },
        size: { width: MAP_CONFIG.width - 2 * MAP_CONFIG.padding, height: streetWidth },
        color: pathStyle.secondary
      });
    }
  }

  return secondaryStreets;
}

// 🚶‍♂️ CONECTAR ZONAS CON SENDEROS
function createZoneConnections(
  zones: Zone[],
  existingPaths: MapElement[],
  _seededRandom: () => number,
  pathStyle: typeof THEMED_PATH_STYLES[keyof typeof THEMED_PATH_STYLES]
): MapElement[] {
  const pathways: MapElement[] = [];
  const pathwayWidth = PATH_CONFIG.PATHWAY.width;
  
  zones.forEach((zone, index) => {
    // Encontrar la calle más cercana
    const zoneCenterX = zone.bounds.x + zone.bounds.width / 2;
    const zoneCenterY = zone.bounds.y + zone.bounds.height / 2;
    
    let closestPath: MapElement | null = null;
    let minDistance = Infinity;
    
    existingPaths.forEach(path => {
      const pathCenterX = path.position.x + path.size.width / 2;
      const pathCenterY = path.position.y + path.size.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(pathCenterX - zoneCenterX, 2) + 
        Math.pow(pathCenterY - zoneCenterY, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestPath = path;
      }
    });
    
    if (closestPath) {
      // Crear sendero conectando la zona con la calle más cercana (con detección de colisiones)
      const pathway = createDirectConnection(
        zone, 
        closestPath, 
        pathwayWidth, 
        pathStyle.pathway, 
        index,
        zones, // Pasar todas las zonas para detección de colisiones
        existingPaths // Pasar caminos existentes
      );
      if (pathway && pathway.length > 0) {
        pathways.push(...pathway);
      }
    }
  });

  return pathways;
}

// 🌳 CREAR ELEMENTOS URBANOS
function createUrbanElements(
  zones: Zone[],
  existingElements: MapElement[],
  seededRandom: () => number
): MapElement[] {
  const urbanElements: MapElement[] = [];
  
  // Crear pequeños parques o jardines
  if (seededRandom() > 0.6) {
    const parkSize = 50;
    
    for (let attempts = 0; attempts < 10; attempts++) {
      const parkX = MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.width - 2 * MAP_CONFIG.padding - parkSize);
      const parkY = MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.height - 2 * MAP_CONFIG.padding - parkSize);
      
      const parkBounds = { x: parkX, y: parkY, width: parkSize, height: parkSize };
      
      const hasCollision = [...zones, ...existingElements].some(element => {
        const elementBounds = 'bounds' in element ? element.bounds : 
          { x: element.position.x, y: element.position.y, width: element.size.width, height: element.size.height };
        return checkCollision(parkBounds, elementBounds, 20);
      });
      
      if (!hasCollision) {
        urbanElements.push({
          id: `park_${attempts}_${Date.now()}`,
          type: 'social_zone',
          position: { x: parkX, y: parkY },
          size: { width: parkSize, height: parkSize },
          color: '#90EE90' // Verde para parques
        });
        break;
      }
    }
  }

  return urbanElements;
}

// ✨ CREAR INTERSECCIONES
function createIntersections(
  allElements: MapElement[]
): MapElement[] {
  const intersections: MapElement[] = [];
  
  // Encontrar intersecciones entre calles principales y secundarias
  const streets = allElements.filter(element => 
    element.id.includes('main_street') || element.id.includes('secondary_street')
  );
  
  for (let i = 0; i < streets.length; i++) {
    for (let j = i + 1; j < streets.length; j++) {
      const street1 = streets[i];
      const street2 = streets[j];
      
      // Calcular intersección
      const intersection = findIntersectionPoint(street1, street2);
      if (intersection) {
        intersections.push({
          id: `intersection_${i}_${j}_${Date.now()}`,
          type: 'play_zone',
          position: { x: intersection.x - 12, y: intersection.y - 12 },
          size: { width: 24, height: 24 },
          color: '#4A5568' // Color fijo para intersecciones
        });
      }
    }
  }

  return intersections;
}

// 🔗 CREAR CONEXIÓN DIRECTA (MEJORADA CON DETECCIÓN DE COLISIONES)
function createDirectConnection(
  zone: Zone,
  targetPath: MapElement,
  width: number,
  color: string,
  index: number,
  allZones: Zone[] = [],
  existingPaths: MapElement[] = []
): MapElement[] {
  const connections: MapElement[] = [];
  
  // Calcular punto de conexión en el borde de la zona (no en el centro)
  const zoneBounds = zone.bounds;
  const pathBounds = { 
    x: targetPath.position.x, 
    y: targetPath.position.y, 
    width: targetPath.size.width, 
    height: targetPath.size.height 
  };
  
  // Encontrar el punto más cercano entre zona y camino
  const zoneEdgePoint = findClosestEdgePoint(zoneBounds, pathBounds);
  const pathEdgePoint = findClosestEdgePoint(pathBounds, zoneBounds);
  
  // Crear conexión con buffer para evitar solapamiento
  const buffer = 10; // Espacio mínimo entre rutas y edificios
  
  // Determinar dirección de conexión
  const isHorizontalConnection = Math.abs(zoneEdgePoint.x - pathEdgePoint.x) > Math.abs(zoneEdgePoint.y - pathEdgePoint.y);
  
  if (isHorizontalConnection) {
    // Conexión horizontal
    const startX = Math.min(zoneEdgePoint.x, pathEdgePoint.x);
    const endX = Math.max(zoneEdgePoint.x, pathEdgePoint.x);
    const connectionY = zoneEdgePoint.y - width / 2;
    
    const connectionBounds = {
      x: startX,
      y: connectionY,
      width: endX - startX,
      height: width
    };
    
    // Verificar colisiones con zonas existentes
    const hasZoneCollision = allZones.some(z => 
      z !== zone && checkCollision(connectionBounds, z.bounds, buffer)
    );
    
    // Verificar colisiones con otros caminos
    const hasPathCollision = existingPaths.some(p => {
      const pBounds = { x: p.position.x, y: p.position.y, width: p.size.width, height: p.size.height };
      return checkCollision(connectionBounds, pBounds, 5);
    });
    
    if (!hasZoneCollision && !hasPathCollision) {
      connections.push({
        id: `zone_connection_h_${index}_${Date.now()}`,
        type: 'play_zone',
        position: { x: connectionBounds.x, y: connectionBounds.y },
        size: { width: connectionBounds.width, height: connectionBounds.height },
        color: color
      });
    }
  } else {
    // Conexión vertical
    const startY = Math.min(zoneEdgePoint.y, pathEdgePoint.y);
    const endY = Math.max(zoneEdgePoint.y, pathEdgePoint.y);
    const connectionX = zoneEdgePoint.x - width / 2;
    
    const connectionBounds = {
      x: connectionX,
      y: startY,
      width: width,
      height: endY - startY
    };
    
    // Verificar colisiones con zonas existentes
    const hasZoneCollision = allZones.some(z => 
      z !== zone && checkCollision(connectionBounds, z.bounds, buffer)
    );
    
    // Verificar colisiones con otros caminos
    const hasPathCollision = existingPaths.some(p => {
      const pBounds = { x: p.position.x, y: p.position.y, width: p.size.width, height: p.size.height };
      return checkCollision(connectionBounds, pBounds, 5);
    });
    
    if (!hasZoneCollision && !hasPathCollision) {
      connections.push({
        id: `zone_connection_v_${index}_${Date.now()}`,
        type: 'play_zone',
        position: { x: connectionBounds.x, y: connectionBounds.y },
        size: { width: connectionBounds.width, height: connectionBounds.height },
        color: color
      });
    }
  }

  return connections;
}

// 🎯 ENCONTRAR PUNTO MÁS CERCANO EN EL BORDE
function findClosestEdgePoint(
  bounds1: { x: number; y: number; width: number; height: number },
  bounds2: { x: number; y: number; width: number; height: number }
): { x: number; y: number } {
  const center1 = { x: bounds1.x + bounds1.width / 2, y: bounds1.y + bounds1.height / 2 };
  const center2 = { x: bounds2.x + bounds2.width / 2, y: bounds2.y + bounds2.height / 2 };
  
  // Calcular qué borde de bounds1 está más cerca de bounds2
  const edges = [
    { x: center1.x, y: bounds1.y }, // Top
    { x: center1.x, y: bounds1.y + bounds1.height }, // Bottom
    { x: bounds1.x, y: center1.y }, // Left
    { x: bounds1.x + bounds1.width, y: center1.y } // Right
  ];
  
  let closestEdge = edges[0];
  let minDistance = Infinity;
  
  edges.forEach(edge => {
    const distance = Math.sqrt(
      Math.pow(edge.x - center2.x, 2) + Math.pow(edge.y - center2.y, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestEdge = edge;
    }
  });
  
  return closestEdge;
}

// 📍 ENCONTRAR PUNTO DE INTERSECCIÓN
function findIntersectionPoint(
  element1: MapElement,
  element2: MapElement
): { x: number; y: number } | null {
  const el1 = {
    left: element1.position.x,
    right: element1.position.x + element1.size.width,
    top: element1.position.y,
    bottom: element1.position.y + element1.size.height
  };
  
  const el2 = {
    left: element2.position.x,
    right: element2.position.x + element2.size.width,
    top: element2.position.y,
    bottom: element2.position.y + element2.size.height
  };
  
  // Verificar si se intersectan
  if (el1.right >= el2.left && el1.left <= el2.right && 
      el1.bottom >= el2.top && el1.top <= el2.bottom) {
    
    return {
      x: Math.max(el1.left, el2.left) + Math.abs(Math.min(el1.right, el2.right) - Math.max(el1.left, el2.left)) / 2,
      y: Math.max(el1.top, el2.top) + Math.abs(Math.min(el1.bottom, el2.bottom) - Math.max(el1.top, el2.top)) / 2
    };
  }
  
  return null;
}