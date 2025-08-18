/**
 * 🔷 GENERACIÓN DE DIAGRAMAS DE VORONOI
 * 
 * Crea regiones irregulares para eliminar la apariencia de grid geométrico
 * Utilizado en RPGs como Dwarf Fortress, Prison Architect, etc.
 */

import type { Point } from './noiseGeneration';
import { PerlinNoise, generateOrganicVariation } from './noiseGeneration';

export interface VoronoiCell {
  id: string;
  center: Point;
  vertices: Point[];
  neighbors: VoronoiCell[];
  type: 'residential' | 'commercial' | 'public' | 'green' | 'mixed';
  size: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  density: number;
}

export interface VoronoiConfig {
  width: number;
  height: number;
  numCells: number;
  relaxationIterations: number;
  seed: number;
  minCellDistance: number;
  boundaryPadding: number;
}

/**
 * 🎯 GENERADOR DE DIAGRAMAS DE VORONOI SIMPLIFICADO
 * Implementación optimizada para tiempo real usando distance fields
 */
export class VoronoiGenerator {
  private noise: PerlinNoise;
  private config: VoronoiConfig;
  private cells: VoronoiCell[] = [];

  constructor(config: VoronoiConfig) {
    this.config = config;
    this.noise = new PerlinNoise(config.seed);
  }

  /**
   * Generar células de Voronoi con distribución orgánica
   */
  generateCells(): VoronoiCell[] {
    // 1. Generar puntos semilla con distribución orgánica
    const seedPoints = this.generateOrganicSeedPoints();
    
    // 2. Relajar posiciones usando Lloyd's algorithm
    const relaxedPoints = this.lloydRelaxation(seedPoints);
    
    // 3. Crear células de Voronoi
    this.cells = this.createVoronoiCells(relaxedPoints);
    
    // 4. Calcular vecinos y propiedades
    this.calculateNeighbors();
    this.assignCellTypes();
    
    return this.cells;
  }

  /**
   * Generar puntos semilla usando Poisson disk sampling modificado
   */
  private generateOrganicSeedPoints(): Point[] {
    const points: Point[] = [];
    const { width, height, numCells, minCellDistance, boundaryPadding } = this.config;
    
    // Usar grid para acelerar búsquedas
    const cellSize = minCellDistance / Math.sqrt(2);
    const gridWidth = Math.ceil(width / cellSize);
    const gridHeight = Math.ceil(height / cellSize);
    const grid: Point[][] = Array.from({ length: gridHeight }, () => 
      Array.from({ length: gridWidth }, () => ({ x: -1, y: -1 }))
    );

    let seedValue = this.config.seed;
    const seededRandom = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };

    // Agregar puntos usando noise-guided sampling
    for (let attempts = 0; attempts < numCells * 10 && points.length < numCells; attempts++) {
      // Generar candidato con bias hacia regiones de alta densidad
      const candidate = this.generateCandidatePoint(seededRandom);
      
      // Verificar distancia mínima con otros puntos
      if (this.isValidPoint(candidate, points, grid, cellSize, gridWidth, gridHeight)) {
        points.push(candidate);
        
        // Agregar al grid
        const gridX = Math.floor(candidate.x / cellSize);
        const gridY = Math.floor(candidate.y / cellSize);
        if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
          grid[gridY][gridX] = candidate;
        }
      }
    }

    // Si no tenemos suficientes puntos, agregar algunos aleatorios
    while (points.length < Math.max(4, numCells * 0.7)) {
      const fallbackPoint = {
        x: boundaryPadding + seededRandom() * (width - 2 * boundaryPadding),
        y: boundaryPadding + seededRandom() * (height - 2 * boundaryPadding)
      };
      
      if (this.isValidPoint(fallbackPoint, points, grid, cellSize, gridWidth, gridHeight)) {
        points.push(fallbackPoint);
      }
    }

    return points;
  }

  /**
   * Generar punto candidato con bias orgánico
   */
  private generateCandidatePoint(seededRandom: () => number): Point {
    const { width, height, boundaryPadding } = this.config;
    
    // Usar noise para crear bias hacia áreas "habitables"
    let bestPoint = { x: 0, y: 0 };
    let bestScore = -Infinity;
    
    for (let i = 0; i < 5; i++) {
      const candidate = {
        x: boundaryPadding + seededRandom() * (width - 2 * boundaryPadding),
        y: boundaryPadding + seededRandom() * (height - 2 * boundaryPadding)
      };
      
      // Score basado en noise (simula habitabilidad)
      const habitabilityScore = this.noise.generateNoise2D(
        candidate.x * 0.01, 
        candidate.y * 0.01
      );
      
      // Bias hacia el centro
      const centerX = width / 2;
      const centerY = height / 2;
      const distanceFromCenter = Math.sqrt(
        Math.pow(candidate.x - centerX, 2) + 
        Math.pow(candidate.y - centerY, 2)
      );
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const centerScore = 1 - (distanceFromCenter / maxDistance);
      
      const totalScore = habitabilityScore * 0.7 + centerScore * 0.3;
      
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestPoint = candidate;
      }
    }
    
    return bestPoint;
  }

  /**
   * Verificar si un punto es válido (no está muy cerca de otros)
   */
  private isValidPoint(
    candidate: Point,
    existingPoints: Point[],
    grid: Point[][],
    cellSize: number,
    gridWidth: number,
    gridHeight: number
  ): boolean {
    const gridX = Math.floor(candidate.x / cellSize);
    const gridY = Math.floor(candidate.y / cellSize);
    
    // Verificar celdas vecinas en el grid
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const checkX = gridX + dx;
        const checkY = gridY + dy;
        
        if (checkX >= 0 && checkX < gridWidth && checkY >= 0 && checkY < gridHeight) {
          const gridPoint = grid[checkY][checkX];
          if (gridPoint.x !== -1) {
            const distance = Math.sqrt(
              Math.pow(candidate.x - gridPoint.x, 2) + 
              Math.pow(candidate.y - gridPoint.y, 2)
            );
            if (distance < this.config.minCellDistance) {
              return false;
            }
          }
        }
      }
    }
    
    return true;
  }

  /**
   * Aplicar Lloyd's relaxation para mejorar la distribución
   */
  private lloydRelaxation(points: Point[]): Point[] {
    let currentPoints = [...points];
    
    for (let iteration = 0; iteration < this.config.relaxationIterations; iteration++) {
      const newPoints: Point[] = [];
      
      currentPoints.forEach(point => {
        // Calcular centroide de la región de Voronoi
        const centroid = this.calculateCellCentroid(point, currentPoints);
        newPoints.push(centroid);
      });
      
      currentPoints = newPoints;
    }
    
    return currentPoints;
  }

  /**
   * Calcular centroide aproximado de una célula de Voronoi
   */
  private calculateCellCentroid(center: Point, allPoints: Point[]): Point {
    const sampleSize = 50;
    const radius = this.config.minCellDistance;
    
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    
    // Samplear puntos en un área alrededor del centro
    for (let i = 0; i < sampleSize; i++) {
      const angle = (i / sampleSize) * 2 * Math.PI;
      const distance = Math.random() * radius;
      
      const sampleX = center.x + Math.cos(angle) * distance;
      const sampleY = center.y + Math.sin(angle) * distance;
      
      // Verificar que este punto pertenece a esta célula
      let closestPoint = center;
      let minDistance = Math.sqrt(
        Math.pow(sampleX - center.x, 2) + Math.pow(sampleY - center.y, 2)
      );
      
      allPoints.forEach(point => {
        const dist = Math.sqrt(
          Math.pow(sampleX - point.x, 2) + Math.pow(sampleY - point.y, 2)
        );
        if (dist < minDistance) {
          minDistance = dist;
          closestPoint = point;
        }
      });
      
      if (closestPoint === center) {
        sumX += sampleX;
        sumY += sampleY;
        count++;
      }
    }
    
    if (count > 0) {
      return {
        x: sumX / count,
        y: sumY / count
      };
    }
    
    return center;
  }

  /**
   * Crear células de Voronoi con vertices aproximados
   */
  private createVoronoiCells(points: Point[]): VoronoiCell[] {
    const cells: VoronoiCell[] = [];
    
    points.forEach((point, index) => {
      const vertices = this.calculateCellVertices(point, points);
      const bounds = this.calculateBounds(vertices);
      
      const cell: VoronoiCell = {
        id: `voronoi_cell_${index}`,
        center: point,
        vertices,
        neighbors: [],
        type: 'residential', // Se asignará después
        size: this.calculateCellArea(vertices),
        bounds,
        density: this.calculateCellDensity(point)
      };
      
      cells.push(cell);
    });
    
    return cells;
  }

  /**
   * Calcular vertices aproximados de una célula
   */
  private calculateCellVertices(center: Point, allPoints: Point[]): Point[] {
    const vertices: Point[] = [];
    const numVertices = 8; // Aproximación octagonal
    const radius = this.config.minCellDistance * 0.7;
    
    for (let i = 0; i < numVertices; i++) {
      const angle = (i / numVertices) * 2 * Math.PI;
      let vertex = {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius
      };
      
      // Ajustar vertex para que no esté más cerca de otro punto
      allPoints.forEach(otherPoint => {
        if (otherPoint !== center) {
          const distToOther = Math.sqrt(
            Math.pow(vertex.x - otherPoint.x, 2) + 
            Math.pow(vertex.y - otherPoint.y, 2)
          );
          const distToCenter = Math.sqrt(
            Math.pow(vertex.x - center.x, 2) + 
            Math.pow(vertex.y - center.y, 2)
          );
          
          if (distToOther < distToCenter) {
            // Mover vertex hacia el centro
            const midX = (center.x + otherPoint.x) / 2;
            const midY = (center.y + otherPoint.y) / 2;
            vertex = { x: midX, y: midY };
          }
        }
      });
      
      vertices.push(vertex);
    }
    
    return vertices;
  }

  /**
   * Calcular bounds de una célula
   */
  private calculateBounds(vertices: Point[]): VoronoiCell['bounds'] {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    vertices.forEach(vertex => {
      minX = Math.min(minX, vertex.x);
      maxX = Math.max(maxX, vertex.x);
      minY = Math.min(minY, vertex.y);
      maxY = Math.max(maxY, vertex.y);
    });
    
    return { minX, maxX, minY, maxY };
  }

  /**
   * Calcular área aproximada de una célula
   */
  private calculateCellArea(vertices: Point[]): number {
    if (vertices.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      area += vertices[i].x * vertices[j].y;
      area -= vertices[j].x * vertices[i].y;
    }
    
    return Math.abs(area) / 2;
  }

  /**
   * Calcular densidad de una célula basada en noise
   */
  private calculateCellDensity(center: Point): number {
    const densityNoise = this.noise.generateNoise2D(center.x * 0.02, center.y * 0.02);
    return Math.max(0.1, Math.min(1.0, (densityNoise + 1) * 0.5));
  }

  /**
   * Calcular vecinos de cada célula
   */
  private calculateNeighbors(): void {
    this.cells.forEach(cell => {
      cell.neighbors = this.cells.filter(otherCell => {
        if (otherCell === cell) return false;
        
        const distance = Math.sqrt(
          Math.pow(cell.center.x - otherCell.center.x, 2) + 
          Math.pow(cell.center.y - otherCell.center.y, 2)
        );
        
        return distance < this.config.minCellDistance * 1.5;
      });
    });
  }

  /**
   * Asignar tipos a las células basado en posición y vecinos
   */
  private assignCellTypes(): void {
    this.cells.forEach(cell => {
      const centerX = this.config.width / 2;
      const centerY = this.config.height / 2;
      
      const distanceFromCenter = Math.sqrt(
        Math.pow(cell.center.x - centerX, 2) + 
        Math.pow(cell.center.y - centerY, 2)
      );
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const centerNormalized = distanceFromCenter / maxDistance;
      
      // Asignar tipo basado en distancia del centro y noise
      const typeNoise = this.noise.generateNoise2D(
        cell.center.x * 0.005, 
        cell.center.y * 0.005
      );
      
      if (centerNormalized < 0.3 && typeNoise > 0.3) {
        cell.type = 'commercial';
      } else if (centerNormalized < 0.2) {
        cell.type = 'public';
      } else if (centerNormalized > 0.7 || typeNoise < -0.4) {
        cell.type = 'green';
      } else if (typeNoise > 0.1) {
        cell.type = 'mixed';
      } else {
        cell.type = 'residential';
      }
    });
  }

  /**
   * Obtener la célula que contiene un punto específico
   */
  getContainingCell(point: Point): VoronoiCell | null {
    let closestCell: VoronoiCell | null = null;
    let minDistance = Infinity;
    
    this.cells.forEach(cell => {
      const distance = Math.sqrt(
        Math.pow(point.x - cell.center.x, 2) + 
        Math.pow(point.y - cell.center.y, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCell = cell;
      }
    });
    
    return closestCell;
  }

  /**
   * Obtener células dentro de un radio
   */
  getCellsInRadius(center: Point, radius: number): VoronoiCell[] {
    return this.cells.filter(cell => {
      const distance = Math.sqrt(
        Math.pow(center.x - cell.center.x, 2) + 
        Math.pow(center.y - cell.center.y, 2)
      );
      return distance <= radius;
    });
  }
}

/**
 * 🛠️ FUNCIONES AUXILIARES
 */

/**
 * Crear configuración de Voronoi con valores predeterminados
 */
export function createVoronoiConfig(
  width: number, 
  height: number, 
  overrides: Partial<VoronoiConfig> = {}
): VoronoiConfig {
  const area = width * height;
  const defaultNumCells = Math.max(8, Math.min(25, Math.floor(area / 8000)));
  
  return {
    width,
    height,
    numCells: defaultNumCells,
    relaxationIterations: 2,
    seed: 12345,
    minCellDistance: Math.min(width, height) / 8,
    boundaryPadding: 30,
    ...overrides
  };
}

/**
 * Convertir células de Voronoi a formato compatible con sistema existente
 */
export function convertVoronoiCellsToZones(
  cells: VoronoiCell[],
  roomTypes: string[]
): Array<{
  id: string;
  type: string;
  bounds: { x: number; y: number; width: number; height: number };
  center: Point;
  vertices: Point[];
}> {
  return cells.map((cell, index) => {
    const roomType = roomTypes[index % roomTypes.length] || 'LIVING_ROOM';
    
    return {
      id: cell.id,
      type: roomType,
      bounds: {
        x: cell.bounds.minX,
        y: cell.bounds.minY,
        width: cell.bounds.maxX - cell.bounds.minX,
        height: cell.bounds.maxY - cell.bounds.minY
      },
      center: cell.center,
      vertices: cell.vertices
    };
  });
}
