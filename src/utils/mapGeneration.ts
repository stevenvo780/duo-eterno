import type { Zone, MapElement, EntityStats } from '../types';

export const createDefaultZones = (): Zone[] => {
  return [
    // === ZONA DE ALIMENTOS (Superior Izquierda) ===
    {
      id: 'food_garden',
      name: 'Jardín de Alimentos',
      bounds: { x: 50, y: 50, width: 140, height: 100 },
      type: 'food',
      effects: { hunger: -25, happiness: 10, sleepiness: 4 },
      color: 'rgba(34, 197, 94, 0.25)',
      attractiveness: 0.9
    },

    // === ZONA DE COCINA (Superior Centro-Izquierda) ===
    {
      id: 'kitchen',
      name: 'Cocina Comunal',
      bounds: { x: 220, y: 40, width: 120, height: 80 },
      type: 'food',
      effects: { hunger: -35, happiness: 15, boredom: -5 },
      color: 'rgba(34, 197, 94, 0.3)',
      attractiveness: 1.0
    },

    // === ZONA DE TRABAJO (Superior Derecha) ===
    {
      id: 'work_office',
      name: 'Oficina de Trabajo',
      bounds: { x: 850, y: 50, width: 130, height: 90 },
      type: 'work',
      effects: { boredom: 8, energy: -10, money: 25 }, // Genera dinero
      color: 'rgba(99, 102, 241, 0.3)',
      attractiveness: 0.6
    },

    // === ZONA DE DESCANSO (Centro-Superior) ===
    {
      id: 'rest_sanctuary',
      name: 'Santuario de Descanso',
      bounds: { x: 400, y: 50, width: 140, height: 100 },
      type: 'rest',
      effects: { sleepiness: -30, energy: 25, boredom: 3 },
      color: 'rgba(168, 85, 247, 0.25)',
      attractiveness: 0.8
    },

    // === ZONA DE EJERCICIO (Centro-Izquierda) ===
    {
      id: 'gym_area',
      name: 'Área de Ejercicio',
      bounds: { x: 50, y: 200, width: 150, height: 120 },
      type: 'exercise',
      effects: { energy: 15, boredom: -15, happiness: 12, hunger: 8 },
      color: 'rgba(239, 68, 68, 0.25)',
      attractiveness: 0.7
    },

    // === ZONA DE JUEGOS (Centro) ===
    {
      id: 'play_area',
      name: 'Área de Juegos',
      bounds: { x: 350, y: 220, width: 200, height: 140 },
      type: 'play',
      effects: { boredom: -35, happiness: 30, energy: -5, loneliness: -8 },
      color: 'rgba(251, 191, 36, 0.3)',
      attractiveness: 1.0
    },

    // === ZONA DE ENTRETENIMIENTO (Centro-Derecha) ===
    {
      id: 'entertainment_center',
      name: 'Centro de Entretenimiento',
      bounds: { x: 600, y: 200, width: 160, height: 120 },
      type: 'entertainment',
      effects: { boredom: -25, happiness: 20, loneliness: -5 },
      color: 'rgba(251, 191, 36, 0.25)',
      attractiveness: 0.8
    },

    // === ZONA SOCIAL (Inferior Izquierda) ===
    {
      id: 'social_plaza',
      name: 'Plaza Social',
      bounds: { x: 50, y: 400, width: 180, height: 120 },
      type: 'social',
      effects: { loneliness: -40, happiness: 25, energy: -3 },
      color: 'rgba(236, 72, 153, 0.3)',
      attractiveness: 0.9
    },

    // === ZONA DE MEDITACIÓN (Inferior Centro) ===
    {
      id: 'meditation_grove',
      name: 'Bosque de Meditación',
      bounds: { x: 280, y: 420, width: 160, height: 130 },
      type: 'comfort',
      effects: { happiness: 18, boredom: -12, loneliness: -10, sleepiness: -8 },
      color: 'rgba(139, 92, 246, 0.25)',
      attractiveness: 0.7
    },

    // === ZONA DE TIENDA (Inferior Centro-Derecha) ===
    {
      id: 'shopping_district',
      name: 'Distrito Comercial',
      bounds: { x: 480, y: 400, width: 140, height: 100 },
      type: 'shopping',
      effects: { happiness: 20, hunger: -15, boredom: -10 }, // Requiere dinero
      color: 'rgba(6, 182, 212, 0.25)',
      attractiveness: 0.8
    },

    // === ZONA DE BIBLIOTECA (Inferior Derecha) ===
    {
      id: 'library',
      name: 'Biblioteca Silenciosa',
      bounds: { x: 670, y: 400, width: 140, height: 120 },
      type: 'learning',
      effects: { boredom: -20, happiness: 8, loneliness: 5, energy: -2 },
      color: 'rgba(168, 85, 247, 0.2)',
      attractiveness: 0.6
    },

    // === ZONA ENERGÉTICA (Esquina Superior Derecha) ===
    {
      id: 'energy_station',
      name: 'Estación Energética',
      bounds: { x: 800, y: 200, width: 120, height: 100 },
      type: 'energy',
      effects: { energy: 30, sleepiness: -10, happiness: 5 },
      color: 'rgba(245, 158, 11, 0.25)',
      attractiveness: 0.7
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
