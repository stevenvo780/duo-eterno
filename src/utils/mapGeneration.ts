import type { Zone, MapElement, EntityStats } from '../types';
import { generateUnifiedMap } from './unifiedMapGeneration';

export const createDefaultZones = (): Zone[] => {
  return [
    {
      id: 'food_complex',
      name: 'Complejo Alimentario',
      bounds: { x: 50, y: 40, width: 300, height: 120 },
      type: 'food',
      color: 'rgba(122, 199, 90, 0.25)',
      attractiveness: 1.0,
      effects: {
        hunger: 30,
        happiness: 12,
        energy: 5
      }
    },

    {
      id: 'rest_sanctuary',
      name: 'Santuario de Descanso',
      bounds: { x: 400, y: 50, width: 200, height: 120 },
      type: 'rest',
      color: 'rgba(99, 155, 255, 0.25)',
      attractiveness: 0.9,
      effects: {
        sleepiness: 35,
        energy: 30,
        happiness: 15
      }
    },

    {
      id: 'play_central',
      name: 'Plaza de Juegos Central',
      bounds: { x: 350, y: 200, width: 250, height: 180 },
      type: 'play',
      color: 'rgba(242, 212, 80, 0.3)',
      attractiveness: 1.2,
      effects: {
        boredom: 45,
        happiness: 25,
        loneliness: 20,
        energy: -5
      }
    },

    {
      id: 'social_plaza',
      name: 'Plaza Social Comunitaria',
      bounds: { x: 50, y: 400, width: 200, height: 140 },
      type: 'social',
      color: 'rgba(99, 189, 164, 0.3)',
      attractiveness: 1.1,
      effects: {
        loneliness: 40,
        happiness: 20,
        boredom: 15,
        energy: 5
      }
    },

    {
      id: 'meditation_grove',
      name: 'Bosque de Meditación Zen',
      bounds: { x: 280, y: 420, width: 180, height: 150 },
      type: 'comfort',
      color: 'rgba(138, 95, 184, 0.25)',
      attractiveness: 0.8,
      effects: {
        happiness: 18,
        boredom: 20,
        loneliness: 15,
        sleepiness: 15,
        energy: 10
      }
    },

    {
      id: 'work_station',
      name: 'Centro de Trabajo Productivo',
      bounds: { x: 650, y: 50, width: 180, height: 120 },
      type: 'work',
      color: 'rgba(138, 95, 184, 0.25)',
      attractiveness: 0.7,
      effects: {
        money: 80,
        boredom: -10,
        energy: -15
      }
    },

    {
      id: 'energy_station',
      name: 'Reactor Energético',
      bounds: { x: 700, y: 200, width: 150, height: 120 },
      type: 'energy',
      color: 'rgba(245, 158, 11, 0.25)',
      attractiveness: 1.0,
      effects: {
        energy: 50,
        sleepiness: 25,
        happiness: 10,
        money: -10
      }
    }
  ];
};

export const createDefaultMapElements = (): MapElement[] => {
  return [
    {
      id: 'rock_central',
      type: 'obstacle',
      position: { x: 480, y: 280 },
      size: { width: 40, height: 35 },
      color: '#64748b'
    },
    {
      id: 'tree_kitchen_shade',
      type: 'obstacle',
      position: { x: 190, y: 35 },
      size: { width: 25, height: 60 },
      color: '#059669'
    },
    {
      id: 'tree_social_corner',
      type: 'obstacle',
      position: { x: 240, y: 410 },
      size: { width: 25, height: 60 },
      color: '#059669'
    },

    {
      id: 'flower_garden_1',
      type: 'food_zone',
      position: { x: 70, y: 70 },
      size: { width: 8, height: 8 },
      color: '#ff6b9d'
    },
    {
      id: 'flower_garden_2',
      type: 'food_zone',
      position: { x: 120, y: 90 },
      size: { width: 8, height: 8 },
      color: '#f2d450'
    },
    {
      id: 'flower_garden_3',
      type: 'food_zone',
      position: { x: 160, y: 120 },
      size: { width: 8, height: 8 },
      color: '#639bff'
    },

    {
      id: 'banco_rest_1',
      type: 'rest_zone',
      position: { x: 420, y: 80 },
      size: { width: 24, height: 12 },
      color: '#9e684c'
    },
    {
      id: 'banco_rest_2',
      type: 'rest_zone',
      position: { x: 480, y: 130 },
      size: { width: 24, height: 12 },
      color: '#9e684c'
    },

    {
      id: 'fuente_social',
      type: 'social_zone',
      position: { x: 130, y: 450 },
      size: { width: 32, height: 32 },
      color: '#63bda4'
    },
    {
      id: 'banco_social_1',
      type: 'social_zone',
      position: { x: 80, y: 480 },
      size: { width: 24, height: 12 },
      color: '#9e684c'
    },
    {
      id: 'banco_social_2',
      type: 'social_zone',
      position: { x: 190, y: 480 },
      size: { width: 24, height: 12 },
      color: '#9e684c'
    },

    {
      id: 'lampara_juegos_1',
      type: 'play_zone',
      position: { x: 370, y: 240 },
      size: { width: 16, height: 24 },
      color: '#f2d450'
    },
    {
      id: 'lampara_juegos_2',
      type: 'play_zone',
      position: { x: 520, y: 240 },
      size: { width: 16, height: 24 },
      color: '#f2d450'
    },

    {
      id: 'lampara_work',
      type: 'play_zone',
      position: { x: 720, y: 70 },
      size: { width: 16, height: 24 },
      color: '#f2d450'
    },

    {
      id: 'flower_meditation_1',
      type: 'food_zone',
      position: { x: 300, y: 440 },
      size: { width: 8, height: 8 },
      color: '#8a5fb8'
    },
    {
      id: 'flower_meditation_2',
      type: 'food_zone',
      position: { x: 380, y: 480 },
      size: { width: 8, height: 8 },
      color: '#639bff'
    },
    {
      id: 'flower_meditation_3',
      type: 'food_zone',
      position: { x: 420, y: 520 },
      size: { width: 8, height: 8 },
      color: '#ff6b9d'
    }
  ];
};

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

export const getAttractionTarget = (
  entityStats: EntityStats,
  zones: Zone[],
  currentPosition: { x: number; y: number }
): { x: number; y: number } | null => {
  let bestZone: Zone | null = null;
  let bestScore = 0;

  for (const zone of zones) {
    let score = zone.attractiveness;

    if (zone.effects?.hunger && entityStats.hunger < 30) score += 0.5;
    if (zone.effects?.sleepiness && entityStats.sleepiness < 30) score += 0.5;
    if (zone.effects?.loneliness && entityStats.loneliness < 30) score += 0.5;
    if (zone.effects?.boredom && entityStats.boredom < 30) score += 0.5;
    if (zone.effects?.money && entityStats.money < 40) score += 0.5;

    const distance = Math.sqrt(
      Math.pow(currentPosition.x - (zone.bounds.x + zone.bounds.width / 2), 2) +
        Math.pow(currentPosition.y - (zone.bounds.y + zone.bounds.height / 2), 2)
    );
    score -= distance / 1000;

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

/**
 * 🚀 NUEVA FUNCIÓN PRINCIPAL DE GENERACIÓN DE MAPAS
 * 
 * Utiliza el sistema unificado con assets mejorados
 */
export async function generateEnhancedMap(
  seed?: string,
  algorithm: 'default' | 'organic' | 'smart' | 'hybrid' = 'hybrid'
): Promise<{ zones: Zone[]; mapElements: MapElement[] }> {
  try {
    const result = await generateUnifiedMap({
      seed,
      algorithm,
      theme: 'modern',
      density: 0.7,
      useRealAssets: true,
      preloadAssets: true
    });

    console.log(`✅ Mapa generado exitosamente con ${result.zones.length} zonas y ${result.mapElements.length} elementos`);
    console.log('📊 Stats de assets:', result.assetStats);

    return {
      zones: result.zones,
      mapElements: result.mapElements
    };
  } catch (error) {
    console.error('❌ Error generando mapa mejorado, fallback a sistema por defecto:', error);
    return {
      zones: createDefaultZones(),
      mapElements: createDefaultMapElements()
    };
  }
}
