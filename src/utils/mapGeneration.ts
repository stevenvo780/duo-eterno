import type { Zone, MapElement, EntityStats } from '../types';

export const createDefaultZones = (): Zone[] => {
  // Definición de zonas esenciales
  return [
    // Jardín de Alimentos
    {
      id: 'food_garden',
      name: 'Jardín de Alimentos',
      bounds: { x: 50, y: 50, width: 140, height: 100 },
      type: 'food',
      color: 'rgba(34, 197, 94, 0.25)',
      attractiveness: 0.9
    },
    // Cocina Comunal
    {
      id: 'kitchen',
      name: 'Cocina Comunal',
      bounds: { x: 220, y: 40, width: 120, height: 80 },
      type: 'food',
      color: 'rgba(34, 197, 94, 0.3)',
      attractiveness: 1.0
    },
    // Santuario de Descanso
    {
      id: 'rest_sanctuary',
      name: 'Santuario de Descanso',
      bounds: { x: 400, y: 50, width: 140, height: 100 },
      type: 'rest',
      color: 'rgba(168, 85, 247, 0.25)',
      attractiveness: 0.8
    },
    // Área de Juegos
    {
      id: 'play_area',
      name: 'Área de Juegos',
      bounds: { x: 350, y: 220, width: 200, height: 140 },
      type: 'play',
      color: 'rgba(251, 191, 36, 0.3)',
      attractiveness: 1.0
    },
    // Plaza Social
    {
      id: 'social_plaza',
      name: 'Plaza Social',
      bounds: { x: 50, y: 400, width: 180, height: 120 },
      type: 'social',
      color: 'rgba(236, 72, 153, 0.3)',
      attractiveness: 0.9
    },
    // Bosque de Meditación
    {
      id: 'meditation_grove',
      name: 'Bosque de Meditación',
      bounds: { x: 280, y: 420, width: 160, height: 130 },
      type: 'comfort',
      color: 'rgba(139, 92, 246, 0.25)',
      attractiveness: 0.7
    },
    // Estación Energética
    {
      id: 'energy_station',
      name: 'Estación Energética',
      bounds: { x: 800, y: 200, width: 120, height: 100 },
      type: 'energy',
      color: 'rgba(245, 158, 11, 0.25)',
      attractiveness: 1.0
    }
  ];
};

export const createDefaultMapElements = (): MapElement[] => {
  return [
    // Obstáculos decorativos
    {
      id: 'rock1',
      type: 'obstacle',
      position: { x: 200, y: 150 },
      size: { width: 40, height: 40 },
      color: '#64748b'
    },
    {
      id: 'rock2',
      type: 'obstacle',
      position: { x: 550, y: 250 },
      size: { width: 30, height: 30 },
      color: '#64748b'
    },
    {
      id: 'tree1',
      type: 'obstacle',
      position: { x: 400, y: 100 },
      size: { width: 25, height: 60 },
      color: '#059669'
    },
    {
      id: 'tree2',
      type: 'obstacle',
      position: { x: 150, y: 350 },
      size: { width: 25, height: 60 },
      color: '#059669'
    },

    // Elementos interactivos básicos mapeados a zonas principales
    // ...ninguno por defecto...
  ];
};

// Función para verificar colisiones con obstáculos
export const checkCollisionWithObstacles = (
  position: { x: number; y: number },
  entitySize: number,
  mapElements: MapElement[]
): boolean => {
  const obstacles = mapElements.filter(element => element.type === 'obstacle');
  
  for (const obstacle of obstacles) {
    const distance = Math.sqrt(
      Math.pow(position.x - (obstacle.position.x + obstacle.size.width / 2), 2) +
      Math.pow(position.y - (obstacle.position.y + obstacle.size.height / 2), 2)
    );
    
    if (distance < entitySize + Math.min(obstacle.size.width, obstacle.size.height) / 2) {
      return true;
    }
  }
  
  return false;
};

// Función para verificar si una entidad está en una zona específica
export const getEntityZone = (
  entityPosition: { x: number; y: number },
  zones: Zone[]
): Zone | null => {
  for (const zone of zones) {
    if (
      entityPosition.x >= zone.bounds.x &&
      entityPosition.x <= zone.bounds.x + zone.bounds.width &&
      entityPosition.y >= zone.bounds.y &&
      entityPosition.y <= zone.bounds.y + zone.bounds.height
    ) {
      return zone;
    }
  }
  return null;
};

// Función para calcular el punto más atractivo para una entidad basado en sus necesidades
export const getAttractionTarget = (
  entityStats: EntityStats,
  zones: Zone[],
  currentPosition: { x: number; y: number }
): { x: number; y: number } | null => {
  let bestZone: Zone | null = null;
  let bestScore = 0;

  for (const zone of zones) {
    let score = zone.attractiveness;
    
    // Calcular score basado en las necesidades de la entidad
    if (zone.effects?.hunger && entityStats.hunger > 70) score += 0.5;
    if (zone.effects?.sleepiness && entityStats.sleepiness > 70) score += 0.5;
    if (zone.effects?.loneliness && entityStats.loneliness > 70) score += 0.5;
    if (zone.effects?.boredom && entityStats.boredom > 70) score += 0.5;
    
    // Penalizar por distancia
    const distance = Math.sqrt(
      Math.pow(currentPosition.x - (zone.bounds.x + zone.bounds.width / 2), 2) +
      Math.pow(currentPosition.y - (zone.bounds.y + zone.bounds.height / 2), 2)
    );
    score -= distance / 1000; // Penalización leve por distancia
    
    if (score > bestScore) {
      bestScore = score;
      bestZone = zone;
    }
  }

  if (bestZone) {
    return {
      x: bestZone.bounds.x + bestZone.bounds.width / 2,
      y: bestZone.bounds.y + bestZone.bounds.height / 2
    };
  }

  return null;
};
