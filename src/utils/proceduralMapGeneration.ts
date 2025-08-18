/**
 * 🏠 GENERADOR PROCEDIMENTAL DE MAPAS AVANZADO
 *
 * Sistema híbrido que combina generación orgánica con IA inteligente
 * para crear mapas realistas con muebles apropiados por habitación
 */

import type { Zone, MapElement } from '../types';
import { generateOrganicProceduralMap } from './organicMapGeneration';
import { generateSmartMap, type SmartMapConfig } from './smartMapGeneration';

export function generateMapSeed(): string {
  const timestamp = Date.now();
  const deterministicPart = ((timestamp * 1664525 + 1013904223) % 2147483647).toString(36);
  return timestamp.toString(36) + deterministicPart;
}

export function generateProceduralMap(seed?: string): { zones: Zone[]; mapElements: MapElement[] } {
  console.log('🧠 Usando sistema híbrido: orgánico con muebles inteligentes...');

  const result = generateOrganicProceduralMap(seed, {
    theme: 'MODERN',
    useVoronoi: true,
    organicStreets: true,
    densityVariation: 0.8,
    naturalClustering: true
  });

  // Mejorar las zonas con información de muebles
  result.zones = result.zones.map(zone => ({
    ...zone,
    // Agregar metadata sobre tipos de muebles apropiados
    metadata: {
      furnitureTypes: getFurnitureTypesForZone(zone.type),
      priority: calculateZonePriority(zone.type)
    }
  }));

  return result;
}

/**
 * Versión orgánica (sistema anterior)
 */
export function generateOrganicMap(seed?: string): { zones: Zone[]; mapElements: MapElement[] } {
  console.log('🌿 Generando mapa con algoritmos orgánicos...');

  return generateOrganicProceduralMap(seed, {
    theme: 'MODERN',
    useVoronoi: true,
    organicStreets: true,
    densityVariation: 0.8,
    naturalClustering: true
  });
}

/**
 * Versión inteligente con configuración personalizada
 */
export function generateIntelligentMap(
  config: Partial<SmartMapConfig> = {}
): Promise<{ zones: Zone[]; mapElements: MapElement[] }> {
  console.log('🏗️ Generando mapa inteligente con CSP y BSP...');
  return generateSmartMap(config);
}

/**
 * Funciones auxiliares para mejorar la compatibilidad
 */
function getFurnitureTypesForZone(zoneType: Zone['type']): string[] {
  const furnitureMap: Record<Zone['type'], string[]> = {
    food: ['kitchen', 'tables'],
    rest: ['bedroom', 'storage'],
    social: ['seating', 'tables', 'entertainment'],
    play: ['entertainment', 'decoration'],
    work: ['office', 'storage'],
    comfort: ['bathroom'],
    energy: ['office'],
    kitchen: ['kitchen', 'tables'],
    bedroom: ['bedroom', 'storage'],
    living: ['seating', 'tables', 'entertainment'],
    bathroom: ['bathroom'],
    office: ['office', 'storage'],
    gym: ['office'],
    library: ['office', 'decoration'],
    recreation: ['entertainment', 'decoration']
  };

  return furnitureMap[zoneType] || ['decoration'];
}

function calculateZonePriority(zoneType: Zone['type']): number {
  const priorities: Record<Zone['type'], number> = {
    food: 9,
    rest: 8,
    social: 7,
    bathroom: 6,
    work: 5,
    play: 4,
    comfort: 6,
    energy: 5,
    kitchen: 9,
    bedroom: 8,
    living: 7,
    office: 5,
    gym: 4,
    library: 4,
    recreation: 3
  };

  return priorities[zoneType] || 1;
}
