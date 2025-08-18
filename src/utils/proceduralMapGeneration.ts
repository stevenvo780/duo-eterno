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


// Eliminadas constantes de layout/temas no usadas en la versión orgánica


// Eliminada definición ROOM_TYPES no utilizada


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
