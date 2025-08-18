/**
 * 🌊 GENERACIÓN DE RUIDO PROCEDIMENTAL
 * 
 * Implementa algoritmos de ruido para crear variación orgánica y natural
 * basados en técnicas utilizadas en RPGs profesionales
 */

export interface Point {
  x: number;
  y: number;
}

export interface NoiseConfig {
  seed: number;
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
}

/**
 * 🎲 IMPLEMENTACIÓN DE PERLIN NOISE
 * Algoritmo estándar para generar ruido coherente y orgánico
 */
export class PerlinNoise {
  private permutation: number[];
  private gradients: Point[];

  constructor(seed: number = 12345) {
    this.initializePermutation(seed);
    this.initializeGradients();
  }

  private initializePermutation(seed: number): void {
    // Crear tabla de permutación seeded
    this.permutation = [];
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }

    // Shuffle usando seed reproducible
    let seedValue = seed;
    const seededRandom = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };

    for (let i = 255; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }

    // Duplicar para evitar wrapping
    for (let i = 0; i < 256; i++) {
      this.permutation[i + 256] = this.permutation[i];
    }
  }

  private initializeGradients(): void {
    // Vectores de gradiente 2D
    this.gradients = [
      { x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 },
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }
    ];
  }

  private fade(t: number): number {
    // Función de fade suave: 6t^5 - 15t^4 + 10t^3
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const gradient = this.gradients[hash & 7];
    return gradient.x * x + gradient.y * y;
  }

  /**
   * Generar ruido Perlin en un punto específico
   */
  generateNoise2D(x: number, y: number): number {
    // Coordenadas de la celda
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;

    // Posición relativa dentro de la celda
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    // Coordenadas suavizadas
    const u = this.fade(xf);
    const v = this.fade(yf);

    // Hash de las esquinas
    const aa = this.permutation[this.permutation[xi] + yi];
    const ab = this.permutation[this.permutation[xi] + yi + 1];
    const ba = this.permutation[this.permutation[xi + 1] + yi];
    const bb = this.permutation[this.permutation[xi + 1] + yi + 1];

    // Gradientes en las esquinas
    const x1 = this.lerp(
      this.grad(aa, xf, yf),
      this.grad(ba, xf - 1, yf),
      u
    );
    const x2 = this.lerp(
      this.grad(ab, xf, yf - 1),
      this.grad(bb, xf - 1, yf - 1),
      u
    );

    return this.lerp(x1, x2, v);
  }

  /**
   * Generar ruido fractal con múltiples octavas
   */
  generateFractalNoise(x: number, y: number, config: NoiseConfig): number {
    let value = 0;
    let amplitude = 1;
    let frequency = config.scale;
    let maxValue = 0;

    for (let i = 0; i < config.octaves; i++) {
      value += this.generateNoise2D(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= config.persistence;
      frequency *= config.lacunarity;
    }

    return value / maxValue;
  }

  /**
   * Generar mapa de elevación usando ruido
   */
  generateElevationMap(width: number, height: number, config: NoiseConfig): number[][] {
    const elevationMap: number[][] = [];
    
    for (let y = 0; y < height; y++) {
      elevationMap[y] = [];
      for (let x = 0; x < width; x++) {
        const noise = this.generateFractalNoise(x / width, y / height, config);
        elevationMap[y][x] = (noise + 1) * 0.5; // Normalizar a 0-1
      }
    }

    return elevationMap;
  }
}

/**
 * 🌀 GENERACIÓN DE RUIDO SIMPLEX (ALTERNATIVA MÁS EFICIENTE)
 * Versión simplificada para casos que requieren mayor performance
 */
export class SimplexNoise {
  private perm: number[];
  private F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  private G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

  constructor(seed: number = 12345) {
    this.initializePermutation(seed);
  }

  private initializePermutation(seed: number): void {
    this.perm = [];
    const p = [];
    
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }

    let seedValue = seed;
    const seededRandom = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };

    for (let i = 255; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }

    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
    }
  }

  generateNoise2D(xin: number, yin: number): number {
    let n0, n1, n2;

    const s = (xin + yin) * this.F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * this.G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + this.G2;
    const y1 = y0 - j1 + this.G2;
    const x2 = x0 - 1.0 + 2.0 * this.G2;
    const y2 = y0 - 1.0 + 2.0 * this.G2;

    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.perm[ii + this.perm[jj]] % 12;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
    const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0.0;
    else {
      t0 *= t0;
      n0 = t0 * t0 * this.grad(gi0, x0, y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0.0;
    else {
      t1 *= t1;
      n1 = t1 * t1 * this.grad(gi1, x1, y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0.0;
    else {
      t2 *= t2;
      n2 = t2 * t2 * this.grad(gi2, x2, y2);
    }

    return 70.0 * (n0 + n1 + n2);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
  }
}

/**
 * 🎯 FUNCIONES AUXILIARES PARA APLICACIONES ESPECÍFICAS
 */

/**
 * Generar mapa de densidad para distribución orgánica de elementos
 */
export function generateDensityMap(
  width: number, 
  height: number, 
  config: NoiseConfig,
  centerBias: boolean = true
): number[][] {
  const noise = new PerlinNoise(config.seed);
  const densityMap: number[][] = [];

  for (let y = 0; y < height; y++) {
    densityMap[y] = [];
    for (let x = 0; x < width; x++) {
      let density = noise.generateFractalNoise(x / width, y / height, config);
      
      // Agregar bias hacia el centro si se solicita
      if (centerBias) {
        const centerX = width / 2;
        const centerY = height / 2;
        const distanceFromCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const centerWeight = 1 - (distanceFromCenter / maxDistance);
        
        density = density * 0.7 + centerWeight * 0.3;
      }

      densityMap[y][x] = Math.max(0, Math.min(1, (density + 1) * 0.5));
    }
  }

  return densityMap;
}

/**
 * Generar variación orgánica para tamaños y posiciones
 */
export function generateOrganicVariation(
  baseValue: number,
  x: number,
  y: number,
  noise: PerlinNoise,
  variationAmount: number = 0.3
): number {
  const noiseValue = noise.generateNoise2D(x * 0.1, y * 0.1);
  const variation = noiseValue * variationAmount;
  return baseValue * (1 + variation);
}

/**
 * Crear coordenadas con jitter natural
 */
export function addOrganicJitter(
  point: Point,
  noise: PerlinNoise,
  jitterAmount: number = 10
): Point {
  const noiseX = noise.generateNoise2D(point.x * 0.05, point.y * 0.05);
  const noiseY = noise.generateNoise2D(point.x * 0.05 + 100, point.y * 0.05 + 100);
  
  return {
    x: point.x + noiseX * jitterAmount,
    y: point.y + noiseY * jitterAmount
  };
}

/**
 * Presets de configuración para diferentes usos
 */
export const NOISE_PRESETS = {
  TERRAIN: {
    seed: 42,
    scale: 0.01,
    octaves: 4,
    persistence: 0.5,
    lacunarity: 2.0
  },
  SETTLEMENT_LAYOUT: {
    seed: 123,
    scale: 0.02,
    octaves: 3,
    persistence: 0.6,
    lacunarity: 1.8
  },
  ORGANIC_VARIATION: {
    seed: 456,
    scale: 0.05,
    octaves: 2,
    persistence: 0.4,
    lacunarity: 2.2
  },
  STREET_CURVATURE: {
    seed: 789,
    scale: 0.03,
    octaves: 2,
    persistence: 0.3,
    lacunarity: 2.5
  }
} as const;
