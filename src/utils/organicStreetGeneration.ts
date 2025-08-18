/**
 * 🛣️ GENERACIÓN ORGÁNICA DE CALLES Y CAMINOS
 * 
 * Sistemas de pathfinding y generación de redes de transporte naturales
 * basados en algoritmos utilizados en RPGs y city builders profesionales
 */

import type { Point } from './noiseGeneration';
import { PerlinNoise, NOISE_PRESETS } from './noiseGeneration';
import type { VoronoiCell } from './voronoiGeneration';

export interface OrganicStreet {
  id: string;
  path: Point[];
  width: number;
  type: 'main' | 'secondary' | 'path' | 'connection';
  curvature: number;
  color: string;
}

export interface StreetNetwork {
  streets: OrganicStreet[];
  intersections: Point[];
  connectivity: Map<string, string[]>;
}

export interface StreetConfig {
  seed: number;
  elevationInfluence: number;
  curvatureAmount: number;
  branchingProbability: number;
  maxStreetLength: number;
  minStreetLength: number;
  streetSpacing: number;
}

/**
 * 🌿 GENERADOR DE CALLES ORGÁNICAS
 * Utiliza algoritmos de crecimiento natural y pathfinding con costos variables
 */
export class OrganicStreetGenerator {
  private noise: PerlinNoise;
  private elevationMap: number[][];
  private config: StreetConfig;
  private width: number;
  private height: number;
  private streets: OrganicStreet[] = [];
  private occupancyGrid: boolean[][];

  constructor(
    width: number, 
    height: number, 
    config: StreetConfig
  ) {
    this.width = width;
    this.height = height;
    this.config = config;
    this.noise = new PerlinNoise(config.seed);
    
    // Generar mapa de elevación que influye en los costos de pathfinding
    this.generateElevationMap();
    
    // Inicializar grid de ocupación
    this.initializeOccupancyGrid();
  }

  /**
   * Generar red completa de calles orgánicas
   */
  generateStreetNetwork(anchors: Point[]): StreetNetwork {
    this.streets = [];
    
    // 1. Crear calle principal que conecta puntos clave
    const mainStreet = this.generateMainStreet(anchors);
    if (mainStreet) {
      this.streets.push(mainStreet);
      this.markStreetOccupied(mainStreet);
    }

    // 2. Generar calles secundarias desde la principal
    const secondaryStreets = this.generateSecondaryStreets(mainStreet);
    secondaryStreets.forEach(street => {
      this.streets.push(street);
      this.markStreetOccupied(street);
    });

    // 3. Conectar puntos aislados con senderos
    const connectionPaths = this.generateConnectionPaths(anchors);
    connectionPaths.forEach(path => {
      this.streets.push(path);
      this.markStreetOccupied(path);
    });

    // 4. Calcular intersecciones
    const intersections = this.calculateIntersections();

    // 5. Generar mapa de conectividad
    const connectivity = this.buildConnectivityMap();

    return {
      streets: this.streets,
      intersections,
      connectivity
    };
  }

  /**
   * Generar mapa de elevación usando ruido
   */
  private generateElevationMap(): void {
    const noiseConfig = { 
      ...NOISE_PRESETS.TERRAIN, 
      seed: this.config.seed 
    };
    
    this.elevationMap = this.noise.generateElevationMap(
      this.width, 
      this.height, 
      noiseConfig
    );
  }

  /**
   * Inicializar grid de ocupación
   */
  private initializeOccupancyGrid(): void {
    this.occupancyGrid = Array.from({ length: this.height }, () => 
      Array.from({ length: this.width }, () => false)
    );
  }

  /**
   * Generar calle principal usando A* con costos de elevación
   */
  private generateMainStreet(anchors: Point[]): OrganicStreet | null {
    if (anchors.length < 2) return null;

    // Encontrar los dos puntos más importantes (más separados)
    let maxDistance = 0;
    let startPoint = anchors[0];
    let endPoint = anchors[1];

    for (let i = 0; i < anchors.length; i++) {
      for (let j = i + 1; j < anchors.length; j++) {
        const distance = this.calculateDistance(anchors[i], anchors[j]);
        if (distance > maxDistance) {
          maxDistance = distance;
          startPoint = anchors[i];
          endPoint = anchors[j];
        }
      }
    }

    // Pathfinding con A* modificado
    const path = this.findOrganicPath(startPoint, endPoint, 'main');
    
    if (!path || path.length < 2) return null;

    // Suavizar el path con curvas orgánicas
    const smoothPath = this.smoothPath(path, this.config.curvatureAmount);

    return {
      id: `main_street_${Date.now()}`,
      path: smoothPath,
      width: 20,
      type: 'main',
      curvature: this.config.curvatureAmount,
      color: '#4A5568'
    };
  }

  /**
   * Generar calles secundarias desde la principal
   */
  private generateSecondaryStreets(mainStreet: OrganicStreet | null): OrganicStreet[] {
    if (!mainStreet) return [];

    const secondaryStreets: OrganicStreet[] = [];
    const branchPoints = this.selectBranchPoints(mainStreet.path);

    branchPoints.forEach((branchPoint, index) => {
      // Intentar crear rama en dirección perpendicular
      const direction = this.calculatePerpendicularDirection(branchPoint, mainStreet.path);
      const branchEnd = this.findBranchEndpoint(branchPoint, direction);

      if (branchEnd) {
        const branchPath = this.findOrganicPath(branchPoint, branchEnd, 'secondary');
        
        if (branchPath && branchPath.length > 3) {
          const smoothBranch = this.smoothPath(branchPath, this.config.curvatureAmount * 0.7);
          
          secondaryStreets.push({
            id: `secondary_street_${index}_${Date.now()}`,
            path: smoothBranch,
            width: 16,
            type: 'secondary',
            curvature: this.config.curvatureAmount * 0.7,
            color: '#6B7280'
          });
        }
      }
    });

    return secondaryStreets;
  }

  /**
   * Generar senderos de conexión para puntos aislados
   */
  private generateConnectionPaths(anchors: Point[]): OrganicStreet[] {
    const connectionPaths: OrganicStreet[] = [];
    
    anchors.forEach((anchor, index) => {
      // Verificar si el punto ya está conectado a la red
      if (!this.isPointConnectedToNetwork(anchor)) {
        // Encontrar la calle más cercana
        const nearestStreet = this.findNearestStreet(anchor);
        
        if (nearestStreet) {
          const connectionPoint = this.findClosestPointOnPath(anchor, nearestStreet.path);
          const connectionPath = this.findOrganicPath(anchor, connectionPoint, 'connection');
          
          if (connectionPath && connectionPath.length > 1) {
            const smoothConnection = this.smoothPath(connectionPath, this.config.curvatureAmount * 0.5);
            
            connectionPaths.push({
              id: `connection_${index}_${Date.now()}`,
              path: smoothConnection,
              width: 12,
              type: 'connection',
              curvature: this.config.curvatureAmount * 0.5,
              color: '#9CA3AF'
            });
          }
        }
      }
    });

    return connectionPaths;
  }

  /**
   * A* pathfinding modificado con costos de elevación
   */
  private findOrganicPath(start: Point, end: Point, streetType: string): Point[] | null {
    const openSet: Array<{
      point: Point;
      gScore: number;
      fScore: number;
      parent: Point | null;
    }> = [];

    const closedSet = new Set<string>();
    const gScores = new Map<string, number>();
    const parents = new Map<string, Point>();

    const startKey = `${Math.floor(start.x)},${Math.floor(start.y)}`;
    openSet.push({
      point: start,
      gScore: 0,
      fScore: this.calculateDistance(start, end),
      parent: null
    });
    gScores.set(startKey, 0);

    while (openSet.length > 0) {
      // Encontrar nodo con menor fScore
      openSet.sort((a, b) => a.fScore - b.fScore);
      const current = openSet.shift()!;
      const currentKey = `${Math.floor(current.point.x)},${Math.floor(current.point.y)}`;

      if (this.calculateDistance(current.point, end) < 5) {
        // Reconstruir path
        return this.reconstructPath(current.point, parents);
      }

      closedSet.add(currentKey);

      // Explorar vecinos
      const neighbors = this.getNeighbors(current.point, streetType);
      
      for (const neighbor of neighbors) {
        const neighborKey = `${Math.floor(neighbor.x)},${Math.floor(neighbor.y)}`;
        
        if (closedSet.has(neighborKey)) continue;

        const tentativeGScore = current.gScore + this.calculateMovementCost(
          current.point, 
          neighbor, 
          streetType
        );

        const existingGScore = gScores.get(neighborKey) ?? Infinity;
        
        if (tentativeGScore < existingGScore) {
          parents.set(neighborKey, current.point);
          gScores.set(neighborKey, tentativeGScore);

          const heuristicScore = this.calculateDistance(neighbor, end);
          const fScore = tentativeGScore + heuristicScore;

          // Añadir a openSet si no está ya
          const existingIndex = openSet.findIndex(item => 
            Math.floor(item.point.x) === Math.floor(neighbor.x) && 
            Math.floor(item.point.y) === Math.floor(neighbor.y)
          );

          if (existingIndex === -1) {
            openSet.push({
              point: neighbor,
              gScore: tentativeGScore,
              fScore,
              parent: current.point
            });
          } else {
            openSet[existingIndex].gScore = tentativeGScore;
            openSet[existingIndex].fScore = fScore;
          }
        }
      }
    }

    return null; // No se encontró path
  }

  /**
   * Calcular costo de movimiento considerando elevación y ocupación
   */
  private calculateMovementCost(from: Point, to: Point, streetType: string): number {
    const distance = this.calculateDistance(from, to);
    
    // Costo base por distancia
    let cost = distance;

    // Factor de elevación
    const fromElevation = this.getElevationAt(from);
    const toElevation = this.getElevationAt(to);
    const elevationDiff = Math.abs(toElevation - fromElevation);
    const elevationCost = elevationDiff * this.config.elevationInfluence;
    
    cost += elevationCost;

    // Penalización por ocupación existente
    if (this.isPointOccupied(to)) {
      cost += distance * 2; // Doble costo para cruzar calles existentes
    }

    // Bonus por seguir gradientes naturales
    const gradientBonus = this.calculateGradientBonus(from, to);
    cost -= gradientBonus;

    // Ajustes por tipo de calle
    switch (streetType) {
      case 'main':
        cost *= 0.8; // Las calles principales prefieren rutas directas
        break;
      case 'secondary':
        cost *= 1.0; // Costo normal
        break;
      case 'connection':
        cost *= 1.2; // Las conexiones pueden ser más tortuosas
        break;
    }

    return Math.max(distance * 0.5, cost);
  }

  /**
   * Obtener vecinos para pathfinding
   */
  private getNeighbors(point: Point, streetType: string): Point[] {
    const neighbors: Point[] = [];
    const stepSize = streetType === 'main' ? 8 : 6;

    // 8 direcciones principales
    const directions = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
      { x: 1, y: 1 }, { x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 1 }
    ];

    directions.forEach(dir => {
      const neighbor = {
        x: point.x + dir.x * stepSize,
        y: point.y + dir.y * stepSize
      };

      // Verificar límites
      if (neighbor.x >= 0 && neighbor.x < this.width && 
          neighbor.y >= 0 && neighbor.y < this.height) {
        neighbors.push(neighbor);
      }
    });

    return neighbors;
  }

  /**
   * Suavizar path con curvas orgánicas usando interpolación
   */
  private smoothPath(path: Point[], curvatureAmount: number): Point[] {
    if (path.length < 3) return path;

    const smoothed: Point[] = [path[0]]; // Mantener primer punto

    for (let i = 1; i < path.length - 1; i++) {
      const prev = path[i - 1];
      const current = path[i];
      const next = path[i + 1];

      // Calcular punto de control para curva de Bézier
      const controlPoint = this.calculateBezierControl(prev, current, next, curvatureAmount);
      
      // Agregar puntos interpolados
      const segments = 3;
      for (let t = 0; t <= segments; t++) {
        const tNorm = t / segments;
        const interpolated = this.interpolateBezier(prev, controlPoint, next, tNorm);
        
        // Agregar variación orgánica con noise
        const variation = this.noise.generateNoise2D(
          interpolated.x * 0.02, 
          interpolated.y * 0.02
        ) * 3;
        
        interpolated.x += variation;
        interpolated.y += variation;
        
        smoothed.push(interpolated);
      }
    }

    smoothed.push(path[path.length - 1]); // Mantener último punto

    return smoothed;
  }

  /**
   * Calcular punto de control para curva de Bézier
   */
  private calculateBezierControl(prev: Point, current: Point, next: Point, amount: number): Point {
    // Vector de dirección suavizada
    const dirX = (next.x - prev.x) * 0.5;
    const dirY = (next.y - prev.y) * 0.5;
    
    // Perpendicular para curvatura
    const perpX = -dirY * amount;
    const perpY = dirX * amount;
    
    return {
      x: current.x + perpX,
      y: current.y + perpY
    };
  }

  /**
   * Interpolación de Bézier cuadrática
   */
  private interpolateBezier(start: Point, control: Point, end: Point, t: number): Point {
    const oneMinusT = 1 - t;
    
    return {
      x: oneMinusT * oneMinusT * start.x + 
         2 * oneMinusT * t * control.x + 
         t * t * end.x,
      y: oneMinusT * oneMinusT * start.y + 
         2 * oneMinusT * t * control.y + 
         t * t * end.y
    };
  }

  // FUNCIONES AUXILIARES

  private calculateDistance(a: Point, b: Point): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  private getElevationAt(point: Point): number {
    const x = Math.max(0, Math.min(this.width - 1, Math.floor(point.x)));
    const y = Math.max(0, Math.min(this.height - 1, Math.floor(point.y)));
    return this.elevationMap[y] ? this.elevationMap[y][x] || 0 : 0;
  }

  private isPointOccupied(point: Point): boolean {
    const x = Math.floor(point.x);
    const y = Math.floor(point.y);
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return true;
    return this.occupancyGrid[y][x];
  }

  private markStreetOccupied(street: OrganicStreet): void {
    street.path.forEach(point => {
      const x = Math.floor(point.x);
      const y = Math.floor(point.y);
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.occupancyGrid[y][x] = true;
      }
    });
  }

  private calculateGradientBonus(from: Point, to: Point): number {
    // Bonus por seguir contornos naturales
    const fromElev = this.getElevationAt(from);
    const toElev = this.getElevationAt(to);
    const gradientAlignment = Math.abs(fromElev - toElev);
    return Math.max(0, (0.1 - gradientAlignment) * 5);
  }

  private selectBranchPoints(path: Point[]): Point[] {
    const branchPoints: Point[] = [];
    const minDistance = 50;
    
    for (let i = minDistance; i < path.length - minDistance; i += minDistance) {
      if (Math.random() < this.config.branchingProbability) {
        branchPoints.push(path[i]);
      }
    }
    
    return branchPoints;
  }

  private calculatePerpendicularDirection(point: Point, path: Point[]): Point {
    // Encontrar dirección perpendicular aproximada
    const pathIndex = path.findIndex(p => 
      this.calculateDistance(p, point) < 10
    );
    
    if (pathIndex > 0 && pathIndex < path.length - 1) {
      const dirX = path[pathIndex + 1].x - path[pathIndex - 1].x;
      const dirY = path[pathIndex + 1].y - path[pathIndex - 1].y;
      
      // Perpendicular
      return { x: -dirY, y: dirX };
    }
    
    return { x: 1, y: 0 };
  }

  private findBranchEndpoint(start: Point, direction: Point): Point | null {
    const distance = this.config.maxStreetLength * 0.6;
    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    
    if (magnitude === 0) return null;
    
    const normalizedDir = {
      x: direction.x / magnitude,
      y: direction.y / magnitude
    };
    
    return {
      x: start.x + normalizedDir.x * distance,
      y: start.y + normalizedDir.y * distance
    };
  }

  private isPointConnectedToNetwork(point: Point): boolean {
    return this.streets.some(street => 
      street.path.some(pathPoint => 
        this.calculateDistance(point, pathPoint) < 20
      )
    );
  }

  private findNearestStreet(point: Point): OrganicStreet | null {
    let nearestStreet: OrganicStreet | null = null;
    let minDistance = Infinity;
    
    this.streets.forEach(street => {
      const closestPoint = this.findClosestPointOnPath(point, street.path);
      const distance = this.calculateDistance(point, closestPoint);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestStreet = street;
      }
    });
    
    return nearestStreet;
  }

  private findClosestPointOnPath(point: Point, path: Point[]): Point {
    let closestPoint = path[0];
    let minDistance = this.calculateDistance(point, path[0]);
    
    path.forEach(pathPoint => {
      const distance = this.calculateDistance(point, pathPoint);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = pathPoint;
      }
    });
    
    return closestPoint;
  }

  private reconstructPath(endPoint: Point, parents: Map<string, Point>): Point[] {
    const path: Point[] = [endPoint];
    let current = endPoint;
    
    while (current) {
      const currentKey = `${Math.floor(current.x)},${Math.floor(current.y)}`;
      const parent = parents.get(currentKey);
      if (parent) {
        path.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }
    
    return path;
  }

  private calculateIntersections(): Point[] {
    const intersections: Point[] = [];
    
    for (let i = 0; i < this.streets.length; i++) {
      for (let j = i + 1; j < this.streets.length; j++) {
        const intersection = this.findPathIntersection(
          this.streets[i].path, 
          this.streets[j].path
        );
        if (intersection) {
          intersections.push(intersection);
        }
      }
    }
    
    return intersections;
  }

  private findPathIntersection(path1: Point[], path2: Point[]): Point | null {
    for (const point1 of path1) {
      for (const point2 of path2) {
        if (this.calculateDistance(point1, point2) < 15) {
          return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2
          };
        }
      }
    }
    return null;
  }

  private buildConnectivityMap(): Map<string, string[]> {
    const connectivity = new Map<string, string[]>();
    
    this.streets.forEach(street => {
      connectivity.set(street.id, []);
    });
    
    // Conectar calles que se intersectan
    for (let i = 0; i < this.streets.length; i++) {
      for (let j = i + 1; j < this.streets.length; j++) {
        const street1 = this.streets[i];
        const street2 = this.streets[j];
        
        if (this.findPathIntersection(street1.path, street2.path)) {
          connectivity.get(street1.id)?.push(street2.id);
          connectivity.get(street2.id)?.push(street1.id);
        }
      }
    }
    
    return connectivity;
  }
}

/**
 * 🛠️ FUNCIONES AUXILIARES DE CONFIGURACIÓN
 */

export function createOrganicStreetConfig(overrides: Partial<StreetConfig> = {}): StreetConfig {
  return {
    seed: 42,
    elevationInfluence: 10,
    curvatureAmount: 0.3,
    branchingProbability: 0.4,
    maxStreetLength: 200,
    minStreetLength: 30,
    streetSpacing: 80,
    ...overrides
  };
}
