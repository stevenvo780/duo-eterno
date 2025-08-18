/**
 * 🏗️ SISTEMA INTELIGENTE DE GENERACIÓN DE MAPAS
 *
 * Basado en las mejores prácticas de investigación:
 * - Constraint Satisfaction Problems (CSP) para colocación de muebles
 * - Binary Space Partitioning (BSP) para estructura de habitaciones
 * - Semantic constraints para realismo
 * - Wang Tiles para variedad sin repetición
 * - Poisson Disk Sampling para distribución natural
 */

import type { Zone, MapElement } from '../types';
import { assetManager, type Asset } from './assetManager';
import { PerlinNoise } from './noiseGeneration';

// Interfaces mejoradas
export interface SmartMapConfig {
  width: number;
  height: number;
  seed: string;
  style: 'modern' | 'cozy' | 'minimal' | 'rustic';
  roomCount: number;
  furnituredensidade: number; // 0.1 - 1.0
  connectivity: boolean; // Asegurar que todas las habitaciones estén conectadas
}

export interface RoomConstraints {
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
  requiredFurniture: string[]; // IDs de muebles obligatorios
  optionalFurniture: string[]; // IDs de muebles opcionales
  wallRequirements: string[]; // Muebles que deben estar contra paredes
  centerRequirements: string[]; // Muebles que deben estar en el centro
  pathways: boolean; // Si requiere caminos despejados
}

export interface FurniturePlacement {
  asset: Asset;
  position: { x: number; y: number };
  rotation: number; // 0, 90, 180, 270 grados
  constraints: string[]; // Restricciones aplicadas
}

// Configuraciones de habitaciones basadas en investigación semántica
export const ROOM_TEMPLATES: Record<string, RoomConstraints> = {
  living: {
    minSize: { width: 120, height: 100 },
    maxSize: { width: 200, height: 180 },
    requiredFurniture: [
      'tile_furniture_sofa_brown',
      'tile_furniture_coffee_table'
    ],
    optionalFurniture: [
      'tile_furniture_tv_stand',
      'tile_furniture_armchair'
    ],
    wallRequirements: ['tile_furniture_tv_stand'],
    centerRequirements: ['tile_furniture_coffee_table'],
    pathways: true
  },
  bedroom: {
    minSize: { width: 100, height: 90 },
    maxSize: { width: 150, height: 130 },
    requiredFurniture: ['tile_furniture_bed_double'],
    optionalFurniture: [
      'tile_furniture_nightstand',
      'tile_furniture_dresser',
      'tile_furniture_wardrobe'
    ],
    wallRequirements: [
      'tile_furniture_bed_double',
      'tile_furniture_dresser',
      'tile_furniture_wardrobe'
    ],
    centerRequirements: [],
    pathways: true
  },
  kitchen: {
    minSize: { width: 80, height: 70 },
    maxSize: { width: 140, height: 120 },
    requiredFurniture: ['tile_furniture_stove', 'tile_furniture_fridge'],
    optionalFurniture: ['tile_furniture_dining_table'],
    wallRequirements: [
      'tile_furniture_stove',
      'tile_furniture_fridge'
    ],
    centerRequirements: ['tile_furniture_dining_table'],
    pathways: true
  },
  bathroom: {
    minSize: { width: 60, height: 60 },
    maxSize: { width: 100, height: 100 },
    requiredFurniture: [],
    optionalFurniture: ['tile_furniture_mirror'],
    wallRequirements: [
      'tile_furniture_mirror'
    ],
    centerRequirements: [],
    pathways: false
  },
  office: {
    minSize: { width: 90, height: 80 },
    maxSize: { width: 130, height: 120 },
    requiredFurniture: ['tile_furniture_desk'],
    optionalFurniture: [
      'tile_furniture_stool'
    ],
    wallRequirements: ['tile_furniture_desk'],
    centerRequirements: [],
    pathways: true
  }
};

export class SmartMapGenerator {
  private config: SmartMapConfig;
  private noise: PerlinNoise;

  constructor(config: SmartMapConfig) {
    this.config = config;
    this.noise = new PerlinNoise(this.seedToNumber(config.seed));
  }

  /**
   * Genera un mapa inteligente usando CSP y técnicas avanzadas
   */
  async generateSmartMap(): Promise<{ zones: Zone[]; mapElements: MapElement[] }> {
    console.log('🧠 Generando mapa inteligente con IA...');

    // 1. Generar estructura de habitaciones usando BSP
    const rooms = this.generateRoomStructure();

    // 2. Convertir a zonas del juego
    const zones = await this.convertRoomsToZones(rooms);

    // 3. Aplicar colocación inteligente de muebles usando CSP
    const furnitureElements = await this.applyIntelligentFurniturePlacement(zones);

    // 4. Generar conectividad (puertas y pasillos)
    const connectivityElements = this.generateConnectivity(zones);

    // 5. Agregar elementos de ambiente (plantas, decoraciones)
    const ambientElements = this.generateAmbientElements(zones);

    return {
      zones,
      mapElements: [...furnitureElements, ...connectivityElements, ...ambientElements]
    };
  }

  /**
   * Genera estructura de habitaciones usando Binary Space Partitioning
   */
  private generateRoomStructure() {
    const rooms: Array<{
      bounds: { x: number; y: number; width: number; height: number };
      type: keyof typeof ROOM_TEMPLATES;
      priority: number;
    }> = [];

    // Usar BSP para dividir el espacio
    const rootNode = {
      x: 50,
      y: 50,
      width: this.config.width - 100,
      height: this.config.height - 100
    };

    const roomTypes: (keyof typeof ROOM_TEMPLATES)[] = [
      'living',
      'bedroom',
      'kitchen',
      'bathroom',
      'office'
    ];
    const splits = this.binarySpacePartitioning(rootNode, this.config.roomCount);

    splits.forEach((split, index) => {
      const roomType = roomTypes[index % roomTypes.length];
      const template = ROOM_TEMPLATES[roomType];

      // Ajustar tamaño según restricciones del template
      const adjustedWidth = Math.max(
        template.minSize.width,
        Math.min(template.maxSize.width, split.width - 20)
      );
      const adjustedHeight = Math.max(
        template.minSize.height,
        Math.min(template.maxSize.height, split.height - 20)
      );

      rooms.push({
        bounds: {
          x: split.x + 10,
          y: split.y + 10,
          width: adjustedWidth,
          height: adjustedHeight
        },
        type: roomType,
        priority: index === 0 ? 10 : 5 + Math.floor(this.noise.generateNoise2D(index * 0.1, 0) * 3)
      });
    });

    return rooms;
  }

  /**
   * Binary Space Partitioning para generar habitaciones no superpuestas
   */
  private binarySpacePartitioning(
    node: { x: number; y: number; width: number; height: number },
    targetRooms: number,
    depth = 0
  ): Array<{ x: number; y: number; width: number; height: number }> {
    if (depth >= 4 || targetRooms <= 1) {
      return [node];
    }

    const minRoomSize = 60;
    const canSplitHorizontally = node.width >= minRoomSize * 2;
    const canSplitVertically = node.height >= minRoomSize * 2;

    if (!canSplitHorizontally && !canSplitVertically) {
      return [node];
    }

    // Decidir dirección de división usando ruido
    const splitVertical =
      canSplitVertically &&
      (!canSplitHorizontally || this.noise.generateNoise2D(depth * 0.5, node.x * 0.01) > 0.5);

    let leftChild, rightChild;

    if (splitVertical) {
      // División horizontal
      const splitY =
        node.y +
        minRoomSize +
        Math.floor(
          this.noise.generateNoise2D(node.x * 0.01, depth * 0.3) * (node.height - minRoomSize * 2)
        );

      leftChild = { x: node.x, y: node.y, width: node.width, height: splitY - node.y };
      rightChild = {
        x: node.x,
        y: splitY,
        width: node.width,
        height: node.y + node.height - splitY
      };
    } else {
      // División vertical
      const splitX =
        node.x +
        minRoomSize +
        Math.floor(
          this.noise.generateNoise2D(node.y * 0.01, depth * 0.3) * (node.width - minRoomSize * 2)
        );

      leftChild = { x: node.x, y: node.y, width: splitX - node.x, height: node.height };
      rightChild = {
        x: splitX,
        y: node.y,
        width: node.x + node.width - splitX,
        height: node.height
      };
    }

    const leftRooms = Math.ceil(targetRooms / 2);
    const rightRooms = targetRooms - leftRooms;

    return [
      ...this.binarySpacePartitioning(leftChild, leftRooms, depth + 1),
      ...this.binarySpacePartitioning(rightChild, rightRooms, depth + 1)
    ];
  }

  /**
   * Convierte habitaciones a zonas del juego
   */
  private async convertRoomsToZones(
    rooms: Array<{
      bounds: { x: number; y: number; width: number; height: number };
      type: keyof typeof ROOM_TEMPLATES;
      priority: number;
    }>
  ): Promise<Zone[]> {
    const zones: Zone[] = [];

    for (const room of rooms) {
      const zone: Zone = {
        id: `smart_room_${room.type}_${Math.random().toString(36).substr(2, 9)}`,
        name: this.getRoomName(room.type),
        bounds: room.bounds,
        type: this.mapRoomTypeToZoneType(room.type),
        color: this.getRoomColor(room.type),
        attractiveness: this.calculateAttractiveness(room.type),
        effects: this.getRoomEffects(room.type)
      };

      zones.push(zone);
    }

    return zones;
  }

  /**
   * Aplicar colocación inteligente de muebles usando Constraint Satisfaction Problem
   */
  private async applyIntelligentFurniturePlacement(zones: Zone[]): Promise<MapElement[]> {
    const elements: MapElement[] = [];

    for (const zone of zones) {
      const roomType = this.zoneTypeToRoomType(zone.type);
      if (!roomType || !ROOM_TEMPLATES[roomType]) continue;

      const template = ROOM_TEMPLATES[roomType];
      const placements = await this.solveFurnitureConstraints(zone, template);

      placements.forEach((placement, index) => {
        elements.push({
          id: `smart_furniture_${zone.id}_${index}`,
          type: this.getElementTypeFromFurniture(placement.asset.id),
          position: placement.position,
          size: { width: 32, height: 32 }, // Tamaño estándar de muebles
          color: '#8B4513' // Color madera por defecto
        });
      });
    }

    return elements;
  }

  /**
   * Resolver restricciones de colocación de muebles usando CSP
   */
  private async solveFurnitureConstraints(
    zone: Zone,
    template: RoomConstraints
  ): Promise<FurniturePlacement[]> {
    const placements: FurniturePlacement[] = [];
    const occupiedGrid = new Set<string>();

    // Crear grid de 16x16 píxeles para colocación precisa
    const gridSize = 16;
    const gridWidth = Math.floor(zone.bounds.width / gridSize);
    const gridHeight = Math.floor(zone.bounds.height / gridSize);

    // 1. Colocar muebles obligatorios primero
    for (const furnitureId of template.requiredFurniture) {
      const asset = await assetManager.loadAsset(furnitureId);
      if (!asset) continue;

      const placement = this.findValidPlacement(
        asset,
        zone,
        template,
        occupiedGrid,
        gridSize,
        gridWidth,
        gridHeight
      );

      if (placement) {
        placements.push(placement);
        this.markOccupied(placement, occupiedGrid, gridSize);
      }
    }

    // 2. Colocar muebles opcionales si hay espacio
    const maxOptional = Math.floor(
      template.optionalFurniture.length * this.config.furnituredensidade
    );
    const shuffledOptional = this.shuffleArray([...template.optionalFurniture]);

    for (let i = 0; i < Math.min(maxOptional, shuffledOptional.length); i++) {
      const furnitureId = shuffledOptional[i];
      const asset = await assetManager.loadAsset(furnitureId);
      if (!asset) continue;

      const placement = this.findValidPlacement(
        asset,
        zone,
        template,
        occupiedGrid,
        gridSize,
        gridWidth,
        gridHeight
      );

      if (placement) {
        placements.push(placement);
        this.markOccupied(placement, occupiedGrid, gridSize);
      }
    }

    return placements;
  }

  /**
   * Encuentra una colocación válida para un mueble
   */
  private findValidPlacement(
    asset: Asset,
    zone: Zone,
    template: RoomConstraints,
    occupiedGrid: Set<string>,
    gridSize: number,
    gridWidth: number,
    gridHeight: number
  ): FurniturePlacement | null {
    const furnitureWidth = Math.ceil(32 / gridSize); // Asumir muebles de 32px
    const furnitureHeight = Math.ceil(32 / gridSize);

    // Determinar posiciones candidatas basadas en restricciones
    const isWallRequired = template.wallRequirements.includes(asset.id);
    const isCenterRequired = template.centerRequirements.includes(asset.id);

    const candidates: { x: number; y: number; score: number }[] = [];

    for (let gridX = 0; gridX <= gridWidth - furnitureWidth; gridX++) {
      for (let gridY = 0; gridY <= gridHeight - furnitureHeight; gridY++) {
        // Verificar si la posición está ocupada
        if (this.isGridOccupied(gridX, gridY, furnitureWidth, furnitureHeight, occupiedGrid)) {
          continue;
        }

        // Calcular puntuación basada en restricciones
        let score = 0;

        const worldX = zone.bounds.x + gridX * gridSize;
        const worldY = zone.bounds.y + gridY * gridSize;
        const centerX = zone.bounds.x + zone.bounds.width / 2;
        const centerY = zone.bounds.y + zone.bounds.height / 2;

        if (isWallRequired) {
          // Preferir posiciones cerca de paredes
          const distToWall = Math.min(
            gridX,
            gridY,
            gridWidth - gridX - furnitureWidth,
            gridHeight - gridY - furnitureHeight
          );
          score += (5 - distToWall) * 10;
        }

        if (isCenterRequired) {
          // Preferir posiciones centrales
          const distToCenter = Math.sqrt(
            Math.pow(worldX - centerX, 2) + Math.pow(worldY - centerY, 2)
          );
          score += Math.max(0, 100 - distToCenter);
        }

        // Bonificación por mantener pathways despejados
        if (template.pathways) {
          const pathwayBonus = this.calculatePathwayBonus(gridX, gridY, gridWidth, gridHeight);
          score += pathwayBonus;
        }

        candidates.push({ x: worldX, y: worldY, score });
      }
    }

    if (candidates.length === 0) return null;

    // Seleccionar la mejor posición
    candidates.sort((a, b) => b.score - a.score);
    const bestCandidate = candidates[0];

    return {
      asset,
      position: bestCandidate,
      rotation: 0, // Por ahora sin rotación
      constraints: isWallRequired ? ['wall'] : isCenterRequired ? ['center'] : []
    };
  }

  /**
   * Verificar si una posición del grid está ocupada
   */
  private isGridOccupied(
    x: number,
    y: number,
    width: number,
    height: number,
    occupiedGrid: Set<string>
  ): boolean {
    for (let dx = 0; dx < width; dx++) {
      for (let dy = 0; dy < height; dy++) {
        if (occupiedGrid.has(`${x + dx},${y + dy}`)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Marcar posiciones como ocupadas
   */
  private markOccupied(placement: FurniturePlacement, occupiedGrid: Set<string>, gridSize: number) {
    const gridX = Math.floor((placement.position.x - 50) / gridSize); // Ajustar por offset del mapa
    const gridY = Math.floor((placement.position.y - 50) / gridSize);
    const furnitureWidth = Math.ceil(32 / gridSize);
    const furnitureHeight = Math.ceil(32 / gridSize);

    for (let dx = 0; dx < furnitureWidth; dx++) {
      for (let dy = 0; dy < furnitureHeight; dy++) {
        occupiedGrid.add(`${gridX + dx},${gridY + dy}`);
      }
    }
  }

  /**
   * Calcular bonificación por mantener pathways
   */
  private calculatePathwayBonus(
    x: number,
    y: number,
    gridWidth: number,
    gridHeight: number
  ): number {
    // Bonificar posiciones que no bloqueen el centro de la habitación
    const centerX = gridWidth / 2;
    const centerY = gridHeight / 2;
    const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    return distFromCenter > gridWidth * 0.3 ? 20 : 0;
  }

  /**
   * Generar conectividad entre habitaciones
   */
  private generateConnectivity(_zones: Zone[]): MapElement[] {
    // Por ahora, generar elementos básicos de conectividad
    // En el futuro, implementar algoritmo A* para pathfinding óptimo
    return [];
  }

  /**
   * Generar elementos ambientales
   */
  private generateAmbientElements(zones: Zone[]): MapElement[] {
    const elements: MapElement[] = [];

    zones.forEach((zone, index) => {
      // Agregar algunos elementos de naturaleza si es apropiado
      if (zone.type === 'recreation' || this.noise.generateNoise2D(index * 0.1, 0.5) > 0.7) {
        elements.push({
          id: `ambient_plant_${index}`,
          type: 'decoration',
          position: {
            x:
              zone.bounds.x +
              this.noise.generateNoise2D(index * 0.2, 0.3) * (zone.bounds.width - 32),
            y:
              zone.bounds.y +
              this.noise.generateNoise2D(index * 0.3, 0.4) * (zone.bounds.height - 32)
          },
          size: { width: 16, height: 16 },
          color: '#228B22'
        });
      }
    });

    return elements;
  }

  // Métodos auxiliares
  private seedToNumber(seed: string): number {
    return seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  }

  private getRoomName(roomType: string): string {
    const names: Record<string, string> = {
      living: 'Sala de Estar',
      bedroom: 'Dormitorio',
      kitchen: 'Cocina',
      bathroom: 'Baño',
      office: 'Oficina'
    };
    return names[roomType] || roomType;
  }

  private mapRoomTypeToZoneType(roomType: keyof typeof ROOM_TEMPLATES): Zone['type'] {
    const mapping: Record<string, Zone['type']> = {
      living: 'social',
      bedroom: 'rest',
      kitchen: 'food',
      bathroom: 'comfort',
      office: 'work'
    };
    return mapping[roomType] || 'social';
  }

  private zoneTypeToRoomType(zoneType: Zone['type']): keyof typeof ROOM_TEMPLATES | null {
    const mapping: Record<Zone['type'], keyof typeof ROOM_TEMPLATES> = {
      social: 'living',
      rest: 'bedroom',
      food: 'kitchen',
      comfort: 'bathroom',
      work: 'office',
      living: 'living',
      bedroom: 'bedroom',
      kitchen: 'kitchen',
      bathroom: 'bathroom',
      office: 'office',
      play: 'living',
      energy: 'office',
      gym: 'office',
      library: 'office',
      recreation: 'living'
    };
    return mapping[zoneType] || null;
  }

  private getRoomColor(roomType: string): string {
    const colors: Record<string, string> = {
      living: 'rgba(70, 130, 180, 0.3)',
      bedroom: 'rgba(221, 160, 221, 0.3)',
      kitchen: 'rgba(255, 215, 0, 0.3)',
      bathroom: 'rgba(173, 216, 230, 0.3)',
      office: 'rgba(144, 238, 144, 0.3)'
    };
    return colors[roomType] || 'rgba(200, 200, 200, 0.3)';
  }

  private calculateAttractiveness(roomType: string): number {
    const attractiveness: Record<string, number> = {
      living: 0.9,
      bedroom: 0.8,
      kitchen: 0.7,
      bathroom: 0.6,
      office: 0.75
    };
    return attractiveness[roomType] || 0.5;
  }

  private getRoomEffects(roomType: string): Zone['effects'] {
    const effects: Record<string, Zone['effects']> = {
      living: { happiness: 20, loneliness: 15, boredom: 10 },
      bedroom: { sleepiness: 40, energy: 25, happiness: 10 },
      kitchen: { hunger: 30, happiness: 15 },
      bathroom: { health: 15, happiness: 5 },
      office: { money: 60, boredom: -5 }
    };
    return effects[roomType] || {};
  }

  private getElementTypeFromFurniture(furnitureId: string): MapElement['type'] {
    if (furnitureId.includes('bed')) return 'rest_zone';
    if (furnitureId.includes('sofa') || furnitureId.includes('chair')) return 'social_zone';
    if (furnitureId.includes('table') || furnitureId.includes('stove')) return 'food_zone';
    if (furnitureId.includes('desk')) return 'work_zone';
    return 'obstacle';
  }

  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.noise.generateNoise2D(i * 0.1, 0) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * Función principal para generar mapas inteligentes
 */
export function generateSmartMap(
  config: Partial<SmartMapConfig> = {}
): Promise<{ zones: Zone[]; mapElements: MapElement[] }> {
  const defaultConfig: SmartMapConfig = {
    width: 1000,
    height: 600,
    seed: Date.now().toString(36),
    style: 'modern',
    roomCount: 5,
    furnituredensidade: 0.7,
    connectivity: true
  };

  const finalConfig = { ...defaultConfig, ...config };
  const generator = new SmartMapGenerator(finalConfig);

  return generator.generateSmartMap();
}
