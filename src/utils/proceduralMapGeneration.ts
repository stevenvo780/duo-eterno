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
  // CORRIGIDO: Usar generación de seed determinista en lugar de Math.random()
  const timestamp = Date.now();
  const deterministicPart = ((timestamp * 1664525 + 1013904223) % 2147483647).toString(36);
  return timestamp.toString(36) + deterministicPart;
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
