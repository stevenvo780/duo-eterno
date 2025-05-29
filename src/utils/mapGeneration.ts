import type { Zone, MapElement, EntityStats } from '../types';

export const createDefaultZones = (): Zone[] => {
  return [
    // Zona de comida (esquina superior izquierda) - Satisface hambre pero aumenta un poco sleepiness
    {
      id: 'food_garden',
      name: 'Jardín de Alimentos',
      bounds: { x: 50, y: 50, width: 120, height: 80 },
      type: 'food',
      effects: { hunger: -20, happiness: 8, sleepiness: 3 }, // Comer da sueño
      color: 'rgba(34, 197, 94, 0.2)',
      attractiveness: 0.8
    },
    
    // Zona de descanso (esquina superior derecha) - Restaura energía y reduce sleepiness
    {
      id: 'rest_sanctuary',
      name: 'Santuario de Descanso',
      bounds: { x: 650, y: 50, width: 100, height: 100 },
      type: 'rest',
      effects: { sleepiness: -25, energy: 20, boredom: 5 }, // Descansar puede aburrir
      color: 'rgba(99, 102, 241, 0.2)',
      attractiveness: 0.7
    },

    // Zona de juego (centro) - Reduce boredom y aumenta happiness, pero consume energía
    {
      id: 'play_area',
      name: 'Área de Juegos',
      bounds: { x: 300, y: 200, width: 200, height: 150 },
      type: 'play',
      effects: { boredom: -30, happiness: 25, energy: -8, loneliness: -5 }, // Jugar es social
      color: 'rgba(251, 191, 36, 0.2)',
      attractiveness: 0.9
    },

    // Zona social (esquina inferior izquierda) - Reduce loneliness significativamente
    {
      id: 'social_plaza',
      name: 'Plaza Social',
      bounds: { x: 50, y: 450, width: 150, height: 100 },
      type: 'social',
      effects: { loneliness: -35, happiness: 18, energy: -3 }, // Socializar cansa un poco
      color: 'rgba(236, 72, 153, 0.2)',
      attractiveness: 0.85
    },

    // Zona de meditación (esquina inferior derecha) - Equilibra emociones
    {
      id: 'meditation_grove',
      name: 'Bosque de Meditación',
      bounds: { x: 600, y: 400, width: 150, height: 150 },
      type: 'comfort',
      effects: { happiness: 12, boredom: -10, loneliness: -8, sleepiness: -5 }, // Meditación balancea todo
      color: 'rgba(139, 92, 246, 0.2)',
      attractiveness: 0.6
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

    // Elementos interactivos especiales
    {
      id: 'fountain',
      type: 'social_zone',
      position: { x: 400, y: 450 },
      size: { width: 50, height: 50 },
      color: '#06b6d4',
      effect: { statType: 'happiness', modifier: 5 }
    },
    {
      id: 'flower_patch',
      type: 'food_zone',
      position: { x: 250, y: 300 },
      size: { width: 60, height: 40 },
      color: '#f59e0b',
      effect: { statType: 'hunger', modifier: -8 }
    }
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
    if (zone.effects.hunger && entityStats.hunger > 70) score += 0.5;
    if (zone.effects.sleepiness && entityStats.sleepiness > 70) score += 0.5;
    if (zone.effects.loneliness && entityStats.loneliness > 70) score += 0.5;
    if (zone.effects.boredom && entityStats.boredom > 70) score += 0.5;
    
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
