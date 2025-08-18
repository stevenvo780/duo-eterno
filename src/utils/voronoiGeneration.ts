/**
 * 🔷 GENERACIÓN DE DIAGRAMAS DE VORONOI
 *
 * Crea regiones irregulares con distribución orgánica.
 *
 * Notas científicas
 * -----------------
 * - Semillas: muestreo tipo Poisson-disk aproximado para separación mínima.
 * - Relajación de Lloyd: desplaza puntos hacia centroides aproximados para células
 *   más regulares sin perder organicidad.
 * - Área: fórmula de lazo (shoelace) para polígono simple.
 * - Vecinos: aproximación por umbral de distancia entre centros.
 */

import type { Point } from './noiseGeneration';
import { PerlinNoise } from './noiseGeneration';

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

    const seedPoints = this.generateOrganicSeedPoints();
    

    const relaxedPoints = this.lloydRelaxation(seedPoints);
    

    this.cells = this.createVoronoiCells(relaxedPoints);
    

    this.calculateNeighbors();
    this.assignCellTypes();
    
    return this.cells;
  }

  /**
   * Genera puntos semilla con Poisson-disk aproximado en rejilla y bias de habitabilidad.
   * Complejidad O(k·N) con chequeo local en vecinos de celda (ventana 5x5).
   */
  private generateOrganicSeedPoints(): Point[] {
    const points: Point[] = [];
    const { width, height, numCells, minCellDistance, boundaryPadding } = this.config;
    

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


    for (let attempts = 0; attempts < numCells * 10 && points.length < numCells; attempts++) {

      const candidate = this.generateCandidatePoint(seededRandom);
      

      if (this.isValidPoint(candidate, grid, cellSize, gridWidth, gridHeight)) {
        points.push(candidate);
        

        const gridX = Math.floor(candidate.x / cellSize);
        const gridY = Math.floor(candidate.y / cellSize);
        if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
          grid[gridY][gridX] = candidate;
        }
      }
    }


    while (points.length < Math.max(4, numCells * 0.7)) {
      const fallbackPoint = {
        x: boundaryPadding + seededRandom() * (width - 2 * boundaryPadding),
        y: boundaryPadding + seededRandom() * (height - 2 * boundaryPadding)
      };
      
      if (this.isValidPoint(fallbackPoint, grid, cellSize, gridWidth, gridHeight)) {
        points.push(fallbackPoint);
      }
    }

    return points;
  }

  /**
   * Elige un candidato entre varios muestreados y aplica un score:
   * habitability (ruido Perlin) y cercanía al centro (mezcla 70/30).
   */
  private generateCandidatePoint(seededRandom: () => number): Point {
    const { width, height, boundaryPadding } = this.config;
    

    let bestPoint = { x: 0, y: 0 };
    let bestScore = -Infinity;
    
    for (let i = 0; i < 5; i++) {
      const candidate = {
        x: boundaryPadding + seededRandom() * (width - 2 * boundaryPadding),
        y: boundaryPadding + seededRandom() * (height - 2 * boundaryPadding)
      };
      

      const habitabilityScore = this.noise.generateNoise2D(
        candidate.x * 0.01, 
        candidate.y * 0.01
      );
      

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
   * Valida separación mínima usando rejilla de aceleración (cellSize=r/√2).
   */
  private isValidPoint(
    candidate: Point,
    grid: Point[][],
    cellSize: number,
    gridWidth: number,
    gridHeight: number
  ): boolean {
    const gridX = Math.floor(candidate.x / cellSize);
    const gridY = Math.floor(candidate.y / cellSize);
    

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
   * Lloyd's relaxation: aproxima el centroide de la célula evaluando muestras
   * radiales y promediando los puntos más cercanos al centro.
   */
  private lloydRelaxation(points: Point[]): Point[] {
    let currentPoints = [...points];
    
    for (let iteration = 0; iteration < this.config.relaxationIterations; iteration++) {
      const newPoints: Point[] = [];
      
      currentPoints.forEach(point => {

        const centroid = this.calculateCellCentroid(point, currentPoints);
        newPoints.push(centroid);
      });
      
      currentPoints = newPoints;
    }
    
    return currentPoints;
  }

  /**
   * Centroide aproximado: muestrea puntos en un radio y conserva los que
   * pertenecen a la región del centro en diagrama de Voronoi implícito.
   */
  private calculateCellCentroid(center: Point, allPoints: Point[]): Point {
    const sampleSize = 50;
    const radius = this.config.minCellDistance;
    
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    

    for (let i = 0; i < sampleSize; i++) {
      const angle = (i / sampleSize) * 2 * Math.PI;
      const distance = Math.random() * radius;
      
      const sampleX = center.x + Math.cos(angle) * distance;
      const sampleY = center.y + Math.sin(angle) * distance;
      

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
        type: 'residential',
        size: this.calculateCellArea(vertices),
        bounds,
        density: this.calculateCellDensity(point)
      };
      
      cells.push(cell);
    });
    
    return cells;
  }

  /**
   * Vértices aproximados: proyecta rayos equiespaciados y recorta según
   * bisectrices con puntos vecinos (aproximación distancia mínima).
   */
  private calculateCellVertices(center: Point, allPoints: Point[]): Point[] {
    const vertices: Point[] = [];
    const numVertices = 8;
    const radius = this.config.minCellDistance * 0.7;
    
    for (let i = 0; i < numVertices; i++) {
      const angle = (i / numVertices) * 2 * Math.PI;
      let vertex = {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius
      };
      

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
   * Área por fórmula de lazo (shoelace). Requiere vértices ordenados.
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
