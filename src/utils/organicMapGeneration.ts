/**
 * 🌳 GENERACIÓN ORGÁNICA DE MAPAS PROCEDIMENTALES
 *
 * Sistema principal que combina todos los algoritmos orgánicos para crear
 * layouts realistas similares a RPGs profesionales, eliminando la apariencia de grid
 */

import type { Zone, MapElement } from '../types';
import type { Point } from './noiseGeneration';
import { PerlinNoise, NOISE_PRESETS, generateDensityMap } from './noiseGeneration';
import {
  VoronoiGenerator,
  createVoronoiConfig,
  convertVoronoiCellsToZones
} from './voronoiGeneration';
import { OrganicStreetGenerator, createOrganicStreetConfig } from './organicStreetGeneration';

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
    preferredMaterials: ['bamboo', 'recycled_wood', 'adobe']
  },
  URBAN: {
    name: 'Loft Urbano',
    colors: {
      primary: 'rgba(70, 70, 70, 0.3)',
      secondary: 'rgba(105, 105, 105, 0.25)',
      accent: 'rgba(169, 169, 169, 0.35)'
    },
    decorationStyle: 'industrial',
    roomSizeMultiplier: 1.2,
    preferredMaterials: ['metal', 'exposed_brick', 'concrete']
  }
} as const;

export const ROOM_TYPES = {
  KITCHEN: {
    name: 'Cocina',
    type: 'kitchen' as const,
    baseSize: { width: 120, height: 100 },
    priority: 9,
    decorations: {
      essential: ['furniture_table_dining', 'deco_lamp'],
      optional: ['plant_small', 'deco_clock']
    }
  },
  LIVING_ROOM: {
    name: 'Sala de Estar',
    type: 'living' as const,
    baseSize: { width: 140, height: 120 },
    priority: 8,
    decorations: {
      essential: ['furniture_sofa_modern', 'furniture_table_coffee'],
      optional: ['plant_small', 'deco_lamp', 'deco_bookshelf']
    }
  },
  BEDROOM: {
    name: 'Dormitorio',
    type: 'bedroom' as const,
    baseSize: { width: 110, height: 100 },
    priority: 7,
    decorations: {
      essential: ['furniture_bed_double', 'deco_lamp'],
      optional: ['plant_small', 'deco_clock']
    }
  },
  BATHROOM: {
    name: 'Baño',
    type: 'bathroom' as const,
    baseSize: { width: 80, height: 80 },
    priority: 6,
    decorations: {
      essential: ['deco_lamp'],
      optional: ['plant_small']
    }
  },
  STUDY: {
    name: 'Estudio',
    type: 'office' as const,
    baseSize: { width: 100, height: 90 },
    priority: 5,
    decorations: {
      essential: ['deco_bookshelf', 'deco_lamp'],
      optional: ['plant_small', 'deco_clock']
    }
  },
  UTILITY: {
    name: 'Lavandería',
    type: 'gym' as const,
    baseSize: { width: 90, height: 70 },
    priority: 4,
    decorations: {
      essential: ['deco_lamp'],
      optional: ['plant_small']
    }
  },
  GARDEN: {
    name: 'Jardín',
    type: 'recreation' as const,
    baseSize: { width: 150, height: 120 },
    priority: 3,
    decorations: {
      essential: ['plant_tree', 'plant_flower'],
      optional: ['furniture_table_coffee', 'deco_lamp']
    }
  }
} as const;

export interface OrganicMapConfig {
  seed: string;
  theme: keyof typeof ARCHITECTURAL_THEMES;
  useVoronoi: boolean;
  organicStreets: boolean;
  densityVariation: number;
  naturalClustering: boolean;
}

/**
 * 🎯 DISTRIBUIDOR POISSON DISK SAMPLING
 * Para distribución natural de elementos decorativos
 */
export class PoissonDiskSampler {
  private radius: number;
  private width: number;
  private height: number;
  private cellSize: number;
  private grid: Point[][];
  private activeList: Point[];
  private noise: PerlinNoise;

  constructor(width: number, height: number, radius: number, seed: number) {
    this.radius = radius;
    this.width = width;
    this.height = height;
    this.cellSize = radius / Math.sqrt(2);
    this.noise = new PerlinNoise(seed);

    const gridWidth = Math.ceil(width / this.cellSize);
    const gridHeight = Math.ceil(height / this.cellSize);

    this.grid = Array.from({ length: gridHeight }, () =>
      Array.from({ length: gridWidth }, () => ({ x: -1, y: -1 }))
    );
    this.activeList = [];
  }

  /**
   * Generar puntos usando Poisson disk sampling con bias de densidad
   */
  generatePoints(densityMap?: number[][]): Point[] {
    const points: Point[] = [];

    const initialPoint = {
      x: this.width / 2 + this.noise.generateNoise2D(this.width * 0.01, this.height * 0.01) * 50,
      y:
        this.height / 2 +
        this.noise.generateNoise2D(this.width * 0.01 + 100, this.height * 0.01 + 100) * 50
    };

    this.addPoint(initialPoint, points);

    while (this.activeList.length > 0) {
      const seed = (Date.now() * 1664525 + 1013904223) % 2147483647;
      const randomIndex = Math.abs(seed) % this.activeList.length;
      const point = this.activeList[randomIndex];

      let foundValidPoint = false;

      for (let i = 0; i < 30; i++) {
        const candidate = this.generateCandidate(point, densityMap);

        if (this.isValidCandidate(candidate)) {
          this.addPoint(candidate, points);
          foundValidPoint = true;
          break;
        }
      }

      if (!foundValidPoint) {
        this.activeList.splice(randomIndex, 1);
      }
    }

    return points;
  }

  private generateCandidate(center: Point, densityMap?: number[][]): Point {
    const timeSeed = Date.now();
    const angle = (((timeSeed * 1664525 + 1013904223) % 2147483647) / 2147483647) * 2 * Math.PI;
    const distanceSeed = ((timeSeed + 12345) * 1664525 + 1013904223) % 2147483647;
    let distance = this.radius + (distanceSeed / 2147483647) * this.radius;

    if (densityMap) {
      const densityX = Math.floor((center.x * densityMap[0].length) / this.width);
      const densityY = Math.floor((center.y * densityMap.length) / this.height);

      if (
        densityX >= 0 &&
        densityX < densityMap[0].length &&
        densityY >= 0 &&
        densityY < densityMap.length
      ) {
        const density = densityMap[densityY][densityX];
        distance *= 2 - density;
      }
    }

    return {
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance
    };
  }

  private isValidCandidate(candidate: Point): boolean {
    if (
      candidate.x < 0 ||
      candidate.x >= this.width ||
      candidate.y < 0 ||
      candidate.y >= this.height
    ) {
      return false;
    }

    const gridX = Math.floor(candidate.x / this.cellSize);
    const gridY = Math.floor(candidate.y / this.cellSize);

    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const checkX = gridX + dx;
        const checkY = gridY + dy;

        if (
          checkX >= 0 &&
          checkX < this.grid[0].length &&
          checkY >= 0 &&
          checkY < this.grid.length
        ) {
          const gridPoint = this.grid[checkY][checkX];

          if (gridPoint.x !== -1) {
            const distance = Math.sqrt(
              Math.pow(candidate.x - gridPoint.x, 2) + Math.pow(candidate.y - gridPoint.y, 2)
            );

            if (distance < this.radius) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  private addPoint(point: Point, points: Point[]): void {
    points.push(point);
    this.activeList.push(point);

    const gridX = Math.floor(point.x / this.cellSize);
    const gridY = Math.floor(point.y / this.cellSize);

    if (gridX >= 0 && gridX < this.grid[0].length && gridY >= 0 && gridY < this.grid.length) {
      this.grid[gridY][gridX] = point;
    }
  }
}

/**
 * 🏗️ GENERADOR PRINCIPAL DE MAPAS ORGÁNICOS
 */
export class OrganicMapGenerator {
  private config: OrganicMapConfig;
  private noise: PerlinNoise;

  constructor(config: OrganicMapConfig) {
    this.config = config;
    this.noise = new PerlinNoise(this.seedToNumber(config.seed));
  }

  /**
   * Generar mapa completo usando algoritmos orgánicos
   */
  generateOrganicMap(): { zones: Zone[]; mapElements: MapElement[] } {
    let zones: Zone[];

    if (this.config.useVoronoi) {
      zones = this.generateVoronoiBasedZones();
    } else {
      zones = this.generateImprovedGridZones();
    }

    zones = this.applyOrganicVariation(zones);

    const decorations = this.generateOrganicDecorations(zones);

    let streets: MapElement[];

    if (this.config.organicStreets) {
      streets = this.generateOrganicStreets(zones);
    } else {
      streets = this.generateImprovedStreets(zones);
    }

    const mapElements = [...decorations, ...streets];

    return { zones, mapElements };
  }

  /**
   * Generar zonas usando células de Voronoi
   */
  private generateVoronoiBasedZones(): Zone[] {
    const voronoiConfig = createVoronoiConfig(MAP_CONFIG.width, MAP_CONFIG.height, {
      seed: this.seedToNumber(this.config.seed),
      numCells: Math.floor(
        6 +
          (((this.seedToNumber(this.config.seed) * 1664525 + 1013904223) % 2147483647) /
            2147483647) *
            8
      ),
      relaxationIterations: 2,
      minCellDistance: 80
    });

    const voronoi = new VoronoiGenerator(voronoiConfig);
    const cells = voronoi.generateCells();

    const roomTypes = this.selectRoomTypesForCells(cells.length);
    const voronoiZones = convertVoronoiCellsToZones(cells, roomTypes);

    return voronoiZones.map((voronoiZone, index) => {
      const roomTypeName = roomTypes[index];

      if (!roomTypeName || !ROOM_TYPES[roomTypeName as keyof typeof ROOM_TYPES]) {
        console.warn(
          `Tipo de habitación no válido: ${roomTypeName}, usando LIVING_ROOM por defecto`
        );
        const fallbackType = 'LIVING_ROOM';
        const roomConfig = ROOM_TYPES[fallbackType];

        return {
          id: `organic_zone_fallback_${index}_${this.config.seed.slice(-4)}`,
          name: roomConfig.name,
          bounds: voronoiZone.bounds,
          type: roomConfig.type,
          color: this.getThemedRoomColor(roomConfig.type),
          attractiveness: 1.0,
          effects: this.getZoneEffects(roomConfig.type)
        };
      }

      const roomType = roomTypeName as keyof typeof ROOM_TYPES;
      const roomConfig = ROOM_TYPES[roomType];

      return {
        id: `organic_zone_${index}_${this.config.seed.slice(-4)}`,
        name: roomConfig.name,
        bounds: voronoiZone.bounds,
        type: roomConfig.type,
        color: this.getThemedRoomColor(roomConfig.type),
        attractiveness: 1.0,
        effects: this.getZoneEffects(roomConfig.type)
      };
    });
  }

  /**
   * Generar zonas mejoradas sin Voronoi (fallback)
   */
  private generateImprovedGridZones(): Zone[] {
    const roomTypes = Object.keys(ROOM_TYPES).slice(0, 6) as Array<keyof typeof ROOM_TYPES>;
    const zones: Zone[] = [];

    roomTypes.forEach((roomType, index) => {
      const roomConfig = ROOM_TYPES[roomType];

      let baseX = 100 + (index % 3) * 250;
      let baseY = 100 + Math.floor(index / 3) * 200;

      const jitterX = this.noise.generateNoise2D(baseX * 0.01, baseY * 0.01) * 50;
      const jitterY = this.noise.generateNoise2D(baseX * 0.01 + 100, baseY * 0.01 + 100) * 50;

      baseX += jitterX;
      baseY += jitterY;

      const baseSize = roomConfig.baseSize;
      const sizeVariation = this.noise.generateNoise2D(index * 0.5, index * 0.3) * 0.3;

      const width = Math.floor(baseSize.width * (1 + sizeVariation));
      const height = Math.floor(baseSize.height * (1 + sizeVariation));

      zones.push({
        id: `improved_zone_${roomType}_${index}`,
        name: roomConfig.name,
        bounds: {
          x: Math.max(50, Math.min(MAP_CONFIG.width - width - 50, baseX)),
          y: Math.max(50, Math.min(MAP_CONFIG.height - height - 50, baseY)),
          width,
          height
        },
        type: roomConfig.type,
        color: this.getThemedRoomColor(roomConfig.type),
        attractiveness: 1.0,
        effects: this.getZoneEffects(roomConfig.type)
      });
    });

    return zones;
  }

  /**
   * Aplicar variación orgánica a zonas existentes
   */
  private applyOrganicVariation(zones: Zone[]): Zone[] {
    if (this.config.densityVariation === 0) return zones;

    return zones.map(zone => {
      const noiseX = this.noise.generateNoise2D(zone.bounds.x * 0.005, zone.bounds.y * 0.005);
      const noiseY = this.noise.generateNoise2D(
        zone.bounds.x * 0.005 + 50,
        zone.bounds.y * 0.005 + 50
      );

      const variationAmount = this.config.densityVariation * 20;
      const newX = zone.bounds.x + noiseX * variationAmount;
      const newY = zone.bounds.y + noiseY * variationAmount;

      const sizeNoiseX = this.noise.generateNoise2D(zone.bounds.x * 0.008, zone.bounds.y * 0.008);
      const sizeNoiseY = this.noise.generateNoise2D(
        zone.bounds.x * 0.008 + 75,
        zone.bounds.y * 0.008 + 75
      );

      const sizeVariation = this.config.densityVariation * 0.15;
      const newWidth = Math.floor(zone.bounds.width * (1 + sizeNoiseX * sizeVariation));
      const newHeight = Math.floor(zone.bounds.height * (1 + sizeNoiseY * sizeVariation));

      return {
        ...zone,
        bounds: {
          x: Math.max(30, Math.min(MAP_CONFIG.width - newWidth - 30, newX)),
          y: Math.max(30, Math.min(MAP_CONFIG.height - newHeight - 30, newY)),
          width: Math.max(60, newWidth),
          height: Math.max(60, newHeight)
        }
      };
    });
  }

  /**
   * Generar decoraciones usando Poisson disk sampling
   */
  private generateOrganicDecorations(zones: Zone[]): MapElement[] {
    const decorations: MapElement[] = [];

    const densityMap = generateDensityMap(
      MAP_CONFIG.width,
      MAP_CONFIG.height,
      { ...NOISE_PRESETS.ORGANIC_VARIATION, seed: this.seedToNumber(this.config.seed) },
      this.config.naturalClustering
    );

    zones.forEach((zone, zoneIndex) => {
      const sampler = new PoissonDiskSampler(
        zone.bounds.width - 20,
        zone.bounds.height - 20,
        25,
        this.seedToNumber(this.config.seed) + zoneIndex
      );

      const decorationPoints = sampler.generatePoints(densityMap);

      const roomType = this.mapZoneTypeToRoomType(zone.type);
      const roomConfig = ROOM_TYPES[roomType];
      const availableDecorations = [
        ...roomConfig.decorations.essential,
        ...roomConfig.decorations.optional
      ];

      decorationPoints.forEach((point, pointIndex) => {
        if (pointIndex < availableDecorations.length) {
          const decorationType = availableDecorations[pointIndex % availableDecorations.length];
          const decorationSize = this.getDecorationSize(decorationType);

          const sizeVariation = this.noise.generateNoise2D(point.x * 0.02, point.y * 0.02) * 0.2;
          const finalWidth = Math.floor(decorationSize.width * (1 + sizeVariation));
          const finalHeight = Math.floor(decorationSize.height * (1 + sizeVariation));

          decorations.push({
            id: `organic_decoration_${zoneIndex}_${pointIndex}`,
            type: this.getDecorationMapType(decorationType),
            position: {
              x: zone.bounds.x + point.x + 10,
              y: zone.bounds.y + point.y + 10
            },
            size: {
              width: finalWidth,
              height: finalHeight
            },
            color: this.getThemedDecorationColor(decorationType)
          });
        }
      });
    });

    return decorations;
  }

  /**
   * Generar calles orgánicas usando el nuevo sistema
   */
  private generateOrganicStreets(zones: Zone[]): MapElement[] {
    const streetConfig = createOrganicStreetConfig({
      seed: this.seedToNumber(this.config.seed),
      curvatureAmount: 0.4,
      branchingProbability: 0.3,
      elevationInfluence: 8
    });

    const streetGenerator = new OrganicStreetGenerator(
      MAP_CONFIG.width,
      MAP_CONFIG.height,
      streetConfig
    );

    const anchors: Point[] = zones.map(zone => ({
      x: zone.bounds.x + zone.bounds.width / 2,
      y: zone.bounds.y + zone.bounds.height / 2
    }));

    const streetNetwork = streetGenerator.generateStreetNetwork(anchors);

    const streetElements: MapElement[] = [];

    streetNetwork.streets.forEach(street => {
      for (let i = 0; i < street.path.length - 1; i++) {
        const start = street.path[i];
        const end = street.path[i + 1];

        const segmentLength = Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );

        streetElements.push({
          id: `organic_street_${street.id}_segment_${i}`,
          type: 'play_zone',
          position: { x: start.x, y: start.y },
          size: { width: segmentLength, height: street.width },
          color: street.color
        });
      }
    });

    streetNetwork.intersections.forEach((intersection, index) => {
      streetElements.push({
        id: `organic_intersection_${index}`,
        type: 'play_zone',
        position: { x: intersection.x - 12, y: intersection.y - 12 },
        size: { width: 24, height: 24 },
        color: '#4A5568'
      });
    });

    return streetElements;
  }

  /**
   * Generar calles mejoradas (fallback)
   */
  private generateImprovedStreets(zones: Zone[]): MapElement[] {
    const streets: MapElement[] = [];

    zones.forEach((zone, index) => {
      if (index < zones.length - 1) {
        const nextZone = zones[index + 1];

        const start = {
          x: zone.bounds.x + zone.bounds.width / 2,
          y: zone.bounds.y + zone.bounds.height / 2
        };

        const end = {
          x: nextZone.bounds.x + nextZone.bounds.width / 2,
          y: nextZone.bounds.y + nextZone.bounds.height / 2
        };

        const midPoint = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2
        };

        const curveOffset = this.noise.generateNoise2D(midPoint.x * 0.01, midPoint.y * 0.01) * 30;
        midPoint.x += curveOffset;
        midPoint.y += curveOffset;

        const segments = [
          { from: start, to: midPoint },
          { from: midPoint, to: end }
        ];

        segments.forEach((segment, segmentIndex) => {
          const length = Math.sqrt(
            Math.pow(segment.to.x - segment.from.x, 2) + Math.pow(segment.to.y - segment.from.y, 2)
          );

          streets.push({
            id: `improved_street_${index}_${segmentIndex}`,
            type: 'play_zone',
            position: { x: segment.from.x, y: segment.from.y },
            size: { width: length, height: 14 },
            color: '#6B7280'
          });
        });
      }
    });

    return streets;
  }

  private seedToNumber(seed: string): number {
    return seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  }

  private selectRoomTypesForCells(numCells: number): string[] {
    const allRoomTypes = Object.keys(ROOM_TYPES);
    const selectedTypes: string[] = [];

    const essentialRooms = ['KITCHEN', 'LIVING_ROOM', 'BEDROOM', 'BATHROOM'];
    selectedTypes.push(...essentialRooms.slice(0, Math.min(essentialRooms.length, numCells)));

    const optionalRooms = allRoomTypes.filter(room => !essentialRooms.includes(room));
    while (selectedTypes.length < numCells && optionalRooms.length > 0) {
      const randomIndex = Math.floor(Math.random() * optionalRooms.length);
      selectedTypes.push(optionalRooms.splice(randomIndex, 1)[0]);
    }

    while (selectedTypes.length < numCells) {
      const randomRoomType = allRoomTypes[Math.floor(Math.random() * allRoomTypes.length)];
      selectedTypes.push(randomRoomType);
    }

    return selectedTypes.slice(0, numCells);
  }

  private mapZoneTypeToRoomType(zoneType: Zone['type']): keyof typeof ROOM_TYPES {
    const mapping: Record<Zone['type'], keyof typeof ROOM_TYPES> = {
      food: 'KITCHEN',
      rest: 'BEDROOM',
      social: 'LIVING_ROOM',
      play: 'STUDY',
      work: 'STUDY',
      comfort: 'BATHROOM',
      energy: 'UTILITY',
      kitchen: 'KITCHEN',
      bedroom: 'BEDROOM',
      living: 'LIVING_ROOM',
      bathroom: 'BATHROOM',
      office: 'STUDY',
      gym: 'UTILITY',
      library: 'STUDY',
      recreation: 'GARDEN'
    };

    return mapping[zoneType] || 'LIVING_ROOM';
  }

  private getThemedRoomColor(zoneType: Zone['type']): string {
    const themeConfig = ARCHITECTURAL_THEMES[this.config.theme];

    const colorMap: Record<Zone['type'], keyof typeof themeConfig.colors> = {
      food: 'primary',
      rest: 'secondary',
      social: 'accent',
      play: 'accent',
      work: 'secondary',
      comfort: 'primary',
      energy: 'primary',
      kitchen: 'primary',
      bedroom: 'secondary',
      living: 'accent',
      bathroom: 'secondary',
      office: 'secondary',
      gym: 'primary',
      library: 'secondary',
      recreation: 'accent'
    };

    return themeConfig.colors[colorMap[zoneType] || 'primary'];
  }

  private getZoneEffects(zoneType: Zone['type']): Zone['effects'] {
    const effects: Record<Zone['type'], Zone['effects']> = {
      food: { hunger: 30, happiness: 12, energy: 5 },
      rest: { sleepiness: 35, energy: 30, happiness: 15 },
      play: { boredom: 45, happiness: 25, loneliness: 20 },
      social: { loneliness: 40, happiness: 20, boredom: 15 },
      work: { money: 80 },
      comfort: { happiness: 18, boredom: 20, loneliness: 15 },
      energy: { energy: 50, sleepiness: 25, happiness: 10 },
      kitchen: { hunger: 25, happiness: 10 },
      bedroom: { sleepiness: 40, energy: 25 },
      living: { happiness: 15, loneliness: 10 },
      bathroom: { health: 10, happiness: 5 },
      office: { money: 60, boredom: -5 },
      gym: { energy: -10, health: 20, happiness: 15 },
      library: { happiness: 10, boredom: 30 },
      recreation: { happiness: 20, boredom: 25 }
    };

    return effects[zoneType] || {};
  }

  private getDecorationSize(type: string): { width: number; height: number } {
    const sizes: Record<string, { width: number; height: number }> = {
      furniture_bed_simple: { width: 32, height: 20 },
      furniture_bed_double: { width: 32, height: 24 },
      furniture_sofa_modern: { width: 32, height: 16 },
      furniture_sofa_classic: { width: 32, height: 18 },
      furniture_table_coffee: { width: 24, height: 16 },
      furniture_table_dining: { width: 32, height: 20 },
      plant_small: { width: 12, height: 12 },
      plant_tree: { width: 32, height: 40 },
      plant_flower: { width: 16, height: 16 },
      deco_lamp: { width: 12, height: 20 },
      deco_clock: { width: 16, height: 16 },
      deco_bookshelf: { width: 28, height: 32 }
    };

    return sizes[type] || { width: 16, height: 16 };
  }

  private getDecorationMapType(decorationType: string): MapElement['type'] {
    const typeMap: Record<string, MapElement['type']> = {
      furniture_bed_simple: 'rest_zone',
      furniture_bed_double: 'rest_zone',
      furniture_sofa_modern: 'social_zone',
      furniture_sofa_classic: 'social_zone',
      furniture_table_coffee: 'social_zone',
      furniture_table_dining: 'food_zone',
      plant_small: 'food_zone',
      plant_tree: 'obstacle',
      plant_flower: 'food_zone',
      deco_lamp: 'play_zone',
      deco_clock: 'play_zone',
      deco_bookshelf: 'play_zone'
    };

    return typeMap[decorationType] || 'obstacle';
  }

  private getThemedDecorationColor(decorationType: string): string {
    const baseColors: Record<string, string> = {
      furniture_bed_simple: '#8B4513',
      furniture_bed_double: '#654321',
      furniture_sofa_modern: '#4169E1',
      furniture_sofa_classic: '#DC143C',
      furniture_table_coffee: '#DEB887',
      furniture_table_dining: '#A0522D',
      plant_small: '#228B22',
      plant_tree: '#006400',
      plant_flower: '#ff6b9d',
      deco_lamp: '#f2d450',
      deco_clock: '#B5A642',
      deco_bookshelf: '#8B4513'
    };

    const baseColor = baseColors[decorationType] || '#64748b';

    switch (this.config.theme) {
      case 'MODERN':
        return baseColor === '#64748b' ? '#9CA3AF' : baseColor;
      case 'RUSTIC':
        return baseColor === '#64748b' ? '#8B4513' : baseColor;
      case 'ECOLOGICAL':
        return baseColor === '#64748b' ? '#059669' : baseColor;
      case 'URBAN':
        return baseColor === '#64748b' ? '#6B7280' : baseColor;
      default:
        return baseColor;
    }
  }
}

/**
 * 🎮 FUNCIÓN PRINCIPAL PARA INTEGRACIÓN CON SISTEMA EXISTENTE
 */
export function generateOrganicProceduralMap(
  seed?: string,
  options: Partial<OrganicMapConfig> = {}
): { zones: Zone[]; mapElements: MapElement[] } {
  const mapSeed = seed || Date.now().toString(36) + Math.random().toString(36).substr(2);

  const config: OrganicMapConfig = {
    seed: mapSeed,
    theme: 'MODERN',
    useVoronoi: true,
    organicStreets: true,
    densityVariation: 0.8,
    naturalClustering: true,
    ...options
  };

  const generator = new OrganicMapGenerator(config);
  return generator.generateOrganicMap();
}
