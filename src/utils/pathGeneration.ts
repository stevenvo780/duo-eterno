/**
 * 🛤️ GENERADOR DE CAMINOS ENTRE ZONAS
 * 
 * Crea caminos que conectan las diferentes zonas del mapa
 */

import type { Zone, MapElement } from '../types';
import { MAP_CONFIG, checkCollision } from './proceduralMapGeneration';


export function generatePaths(
  zones: Zone[], 
  seed: string
): MapElement[] {
  let seedValue = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + 9999;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  const paths: MapElement[] = [];
  const pathWidth = 12;
  const pathTypes = ['stone', 'brick', 'dirt'];

  // Conectar zonas principales con caminos
  const zoneCenters = zones.map(zone => ({
    id: zone.id,
    x: zone.bounds.x + zone.bounds.width / 2,
    y: zone.bounds.y + zone.bounds.height / 2,
    bounds: zone.bounds
  }));

  // Crear una red de caminos conectando zonas cercanas
  for (let i = 0; i < zoneCenters.length; i++) {
    for (let j = i + 1; j < zoneCenters.length; j++) {
      const zone1 = zoneCenters[i];
      const zone2 = zoneCenters[j];
      
      const distance = Math.sqrt(
        Math.pow(zone2.x - zone1.x, 2) + Math.pow(zone2.y - zone1.y, 2)
      );

      // Solo conectar zonas relativamente cercanas
      if (distance < 200 && seededRandom() > 0.3) {
        const pathType = pathTypes[Math.floor(seededRandom() * pathTypes.length)];
        const pathSegments = createPath(zone1, zone2, pathWidth, pathType, seededRandom);
        paths.push(...pathSegments);
      }
    }
  }

  // Agregar algunos caminos decorativos adicionales
  const decorativePaths = createDecorativePaths(zones, pathWidth, seededRandom);
  paths.push(...decorativePaths);

  return paths;
}

function createPath(
  zone1: { x: number; y: number; bounds: any },
  zone2: { x: number; y: number; bounds: any },
  pathWidth: number,
  pathType: string,
  seededRandom: () => number
): MapElement[] {
  const segments: MapElement[] = [];

  // Determinar puntos de conexión en los bordes de las zonas
  const start = getConnectionPoint(zone1, zone2);
  const end = getConnectionPoint(zone2, zone1);

  // Crear camino en forma de L (horizontal luego vertical, o viceversa)
  const useHorizontalFirst = seededRandom() > 0.5;
  
  if (useHorizontalFirst) {
    // Segmento horizontal
    const horizontalSegment = {
      id: `path_h_${zone1.bounds.x}_${zone1.bounds.y}_${Date.now()}`,
      type: 'play_zone' as const,
      position: {
        x: Math.min(start.x, end.x) - pathWidth / 2,
        y: start.y - pathWidth / 2
      },
      size: {
        width: Math.abs(end.x - start.x) + pathWidth,
        height: pathWidth
      },
      color: getPathColor(pathType)
    };

    // Segmento vertical
    const verticalSegment = {
      id: `path_v_${zone2.bounds.x}_${zone2.bounds.y}_${Date.now()}`,
      type: 'play_zone' as const,
      position: {
        x: end.x - pathWidth / 2,
        y: Math.min(start.y, end.y) - pathWidth / 2
      },
      size: {
        width: pathWidth,
        height: Math.abs(end.y - start.y) + pathWidth
      },
      color: getPathColor(pathType)
    };

    segments.push(horizontalSegment, verticalSegment);
  } else {
    // Segmento vertical primero
    const verticalSegment = {
      id: `path_v_${zone1.bounds.x}_${zone1.bounds.y}_${Date.now()}`,
      type: 'play_zone' as const,
      position: {
        x: start.x - pathWidth / 2,
        y: Math.min(start.y, end.y) - pathWidth / 2
      },
      size: {
        width: pathWidth,
        height: Math.abs(end.y - start.y) + pathWidth
      },
      color: getPathColor(pathType)
    };

    // Segmento horizontal
    const horizontalSegment = {
      id: `path_h_${zone2.bounds.x}_${zone2.bounds.y}_${Date.now()}`,
      type: 'play_zone' as const,
      position: {
        x: Math.min(start.x, end.x) - pathWidth / 2,
        y: end.y - pathWidth / 2
      },
      size: {
        width: Math.abs(end.x - start.x) + pathWidth,
        height: pathWidth
      },
      color: getPathColor(pathType)
    };

    segments.push(verticalSegment, horizontalSegment);
  }

  return segments;
}

function getConnectionPoint(
  fromZone: { x: number; y: number; bounds: any },
  toZone: { x: number; y: number; bounds: any }
): { x: number; y: number } {
  const dx = toZone.x - fromZone.x;
  const dy = toZone.y - fromZone.y;

  // Determinar qué lado de la zona usar para la conexión
  if (Math.abs(dx) > Math.abs(dy)) {
    // Conexión horizontal - usar lado izquierdo o derecho
    if (dx > 0) {
      // toZone está a la derecha, usar lado derecho de fromZone
      return {
        x: fromZone.bounds.x + fromZone.bounds.width,
        y: fromZone.y
      };
    } else {
      // toZone está a la izquierda, usar lado izquierdo de fromZone
      return {
        x: fromZone.bounds.x,
        y: fromZone.y
      };
    }
  } else {
    // Conexión vertical - usar lado superior o inferior
    if (dy > 0) {
      // toZone está abajo, usar lado inferior de fromZone
      return {
        x: fromZone.x,
        y: fromZone.bounds.y + fromZone.bounds.height
      };
    } else {
      // toZone está arriba, usar lado superior de fromZone
      return {
        x: fromZone.x,
        y: fromZone.bounds.y
      };
    }
  }
}

function createDecorativePaths(
  zones: Zone[],
  pathWidth: number,
  seededRandom: () => number
): MapElement[] {
  const decorativePaths: MapElement[] = [];

  // Agregar algunos caminos decorativos en áreas vacías
  const numDecorative = Math.floor(seededRandom() * 3) + 1;

  for (let i = 0; i < numDecorative; i++) {
    const pathType = ['stone', 'brick', 'dirt'][Math.floor(seededRandom() * 3)];
    const isHorizontal = seededRandom() > 0.5;
    
    if (isHorizontal) {
      const decorativePath = {
        id: `decorative_path_h_${i}_${Date.now()}`,
        type: 'play_zone' as const,
        position: {
          x: MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.width - 2 * MAP_CONFIG.padding - 100),
          y: MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.height - 2 * MAP_CONFIG.padding - pathWidth)
        },
        size: {
          width: 60 + seededRandom() * 80,
          height: pathWidth
        },
        color: getPathColor(pathType)
      };

      // Verificar que no colisione con zonas existentes
      const hasCollision = zones.some(zone => 
        checkCollision(
          { ...decorativePath.position, width: decorativePath.size.width, height: decorativePath.size.height }, 
          zone.bounds, 10)
      );

      if (!hasCollision) {
        decorativePaths.push(decorativePath);
      }
    } else {
      const decorativePath = {
        id: `decorative_path_v_${i}_${Date.now()}`,
        type: 'play_zone' as const,
        position: {
          x: MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.width - 2 * MAP_CONFIG.padding - pathWidth),
          y: MAP_CONFIG.padding + seededRandom() * (MAP_CONFIG.height - 2 * MAP_CONFIG.padding - 100)
        },
        size: {
          width: pathWidth,
          height: 60 + seededRandom() * 80
        },
        color: getPathColor(pathType)
      };

      // Verificar que no colisione con zonas existentes
      const hasCollision = zones.some(zone => 
        checkCollision(
          { ...decorativePath.position, width: decorativePath.size.width, height: decorativePath.size.height }, 
          zone.bounds, 10)
      );

      if (!hasCollision) {
        decorativePaths.push(decorativePath);
      }
    }
  }

  return decorativePaths;
}

function getPathColor(pathType: string): string {
  const colors: Record<string, string> = {
    stone: '#696969',
    brick: '#B22222',
    dirt: '#8B4513'
  };
  
  return colors[pathType] || '#696969';
}