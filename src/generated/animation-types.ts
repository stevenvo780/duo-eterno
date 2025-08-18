/**
 * 🎬 TIPOS DE ANIMACIÓN GENERADOS AUTOMÁTICAMENTE
 * 
 * Este archivo contiene tipos TypeScript específicos para las animaciones
 * encontradas en el proyecto
 */

// IDs de animaciones disponibles
export type AnimationId = 'entidad_circulo_dying' | 'entidad_circulo_happy' | 'entidad_circulo_sad' | 'entidad_square_dying' | 'entidad_square_happy' | 'entidad_square_sad';

// Nombres de animaciones disponibles
export type AnimationName = 'sparkle' | 'pulse' | 'floating';

// Carpetas con animaciones
export type AnimationFolder = 'animations';

// Entidades con animaciones (detectadas automáticamente)
export type EntityType = 'circulo' | 'square';

// Estados de animación comunes detectados
export type AnimationState = 'dying' | 'happy' | 'sad';
