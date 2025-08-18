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

export function generateMapSeed(): string {
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
