/**
 * Constantes unificadas para generación y renderizado de mapas
 */

// Tamaño único de tiles - unificado entre generador y renderer
export const TILE_SIZE = 64; // px

// Tamaño del mundo unificado
export const WORLD_SIZE = {
  width: 2000,  // px
  height: 1500  // px
} as const;

// Configuración de renderizado
export const RENDER_CONFIG = {
  // Pixel-perfect rendering
  imageSmoothingEnabled: false,
  
  // Viewport mínimo y máximo
  minViewportWidth: 800,
  minViewportHeight: 600,
  maxViewportWidth: 2560,
  maxViewportHeight: 1440,
  
  // Zoom levels (escalas enteras)
  minZoom: 0.5,
  maxZoom: 3.0,
  zoomStep: 0.25,
  
  // Performance limits
  maxTilesVisible: 900,
  maxObjectsVisible: 150
} as const;

// Feature flags para migración gradual
export const FEATURE_FLAGS = {
  renderer: {
    road: true,
    autotile: false, // Por implementar en F3
    pixelPerfect: true
  },
  camera: {
    fitToContent: true
  },
  assets: {
    pixelPerfect: true,
    useNewTaxonomy: true
  },
  compatMode: false // Para mantener comportamiento legacy si es necesario
} as const;

// Versión del generador para compatibilidad
export const GENERATOR_VERSION = '1.0.0';
