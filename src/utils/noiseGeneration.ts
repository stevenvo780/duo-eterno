/**
 * Sistema simplificado de generación de ruido para mapas orgánicos
 */

export interface Point {
  x: number;
  y: number;
}

export interface NoiseConfig {
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  seed: number;
}

export const NOISE_PRESETS = {
  SMOOTH: {
    scale: 50,
    octaves: 4,
    persistence: 0.5,
    lacunarity: 2,
    seed: 0
  },
  ROUGH: {
    scale: 25,
    octaves: 6,
    persistence: 0.6,
    lacunarity: 2.5,
    seed: 0
  },
  FINE: {
    scale: 100,
    octaves: 8,
    persistence: 0.4,
    lacunarity: 2,
    seed: 0
  },
  ORGANIC_VARIATION: {
    scale: 75,
    octaves: 5,
    persistence: 0.55,
    lacunarity: 2.2,
    seed: 0
  },
  TERRAIN: {
    scale: 30,
    octaves: 6,
    persistence: 0.7,
    lacunarity: 2.1,
    seed: 0
  }
} as const;

export class PerlinNoise {
  private permutation: number[] = [];
  private p: number[] = [];

  constructor(seed: number = 0) {
    const safeSeed = isFinite(seed) ? Math.abs(seed) % 2147483647 : 0;
    this.initializePermutation(safeSeed);
  }

  private initializePermutation(seed: number) {
    if (!isFinite(seed)) {
      seed = 0;
    }
    
    const rng = this.seedRandom(seed);
    
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }
    
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
    
    for (let i = 0; i < 512; i++) {
      this.p[i] = this.permutation[i % 256];
    }
  }

  private seedRandom(seed: number) {
    const m = 2147483647;
    const a = 1103515245;
    const c = 12345;
    let state = Math.abs(seed) % m;
    
    return function() {
      state = (a * state + c) % m;
      return state / (m - 1);
    };
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : (h === 12 || h === 14) ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number): number {
    if (!isFinite(x) || !isFinite(y)) {
      return 0;
    }
    
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const A = this.p[X] + Y;
    const AA = this.p[A];
    const AB = this.p[A + 1];
    const B = this.p[X + 1] + Y;
    const BA = this.p[B];
    const BB = this.p[B + 1];
    
    const result = this.lerp(
      this.lerp(
        this.grad(this.p[AA], x, y),
        this.grad(this.p[BA], x - 1, y),
        u
      ),
      this.lerp(
        this.grad(this.p[AB], x, y - 1),
        this.grad(this.p[BB], x - 1, y - 1),
        u
      ),
      v
    );
    
    return isFinite(result) ? Math.max(-1, Math.min(1, result)) : 0;
  }

  octaveNoise(x: number, y: number, config: NoiseConfig): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1 / config.scale;
    let maxValue = 0;

    for (let i = 0; i < config.octaves; i++) {
      value += this.noise(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= config.persistence;
      frequency *= config.lacunarity;
    }

    return value / maxValue;
  }

  generateNoise2D(x: number, y: number, preset?: keyof typeof NOISE_PRESETS): number {
    const config = preset ? NOISE_PRESETS[preset] : NOISE_PRESETS.SMOOTH;
    return this.octaveNoise(x, y, config);
  }

  generateElevationMap(width: number, height: number, config: NoiseConfig): number[][] {
    const elevationMap: number[][] = [];
    
    for (let y = 0; y < height; y++) {
      elevationMap[y] = [];
      for (let x = 0; x < width; x++) {
        const value = this.octaveNoise(x, y, config);
        elevationMap[y][x] = (value + 1) / 2;
      }
    }
    
    return elevationMap;
  }
}

export function generateDensityMap(
  width: number,
  height: number,
  config: NoiseConfig,
  naturalClustering?: boolean
): number[][] {
  const noise = new PerlinNoise(config.seed);
  const densityMap: number[][] = [];

  for (let y = 0; y < height; y++) {
    densityMap[y] = [];
    for (let x = 0; x < width; x++) {
      let value = noise.octaveNoise(x, y, config);
      
      if (naturalClustering) {
        const clusterNoise = noise.octaveNoise(x * 0.5, y * 0.5, {
          ...config,
          scale: config.scale * 2,
          octaves: 3
        });
        value = (value + clusterNoise * 0.3) / 1.3;
      }
      
      densityMap[y][x] = (value + 1) / 2;
    }
  }

  return densityMap;
}