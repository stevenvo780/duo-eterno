/**
 * Render de animaciones de entidades: carga, caché y reproducción.
 * Unifica el manejo para distintos tipos de entidades.
 */

import type { Entity } from '../../types';

export interface AnimationFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
}

export interface AnimationMetadata {
  name: string;
  frame_count: number;
  frame_size: [number, number];
  columns: number;
  rows: number;
  total_duration: number;
  loop: boolean;
  frames: Array<{ duration: number }>;
}

export interface LoadedAnimation {
  image: HTMLImageElement;
  metadata: AnimationMetadata;
  frames: AnimationFrame[];
  isLoaded: boolean;
}

export interface EntityAnimationState {
  currentFrame: number;
  elapsedTime: number;
  isPlaying: boolean;
  lastUpdateTime: number;
}

export class EntityAnimationRenderer {
  private static instance: EntityAnimationRenderer;
  private animationCache: Map<string, LoadedAnimation | null> = new Map();
  private loadingPromises: Map<string, Promise<LoadedAnimation | null>> = new Map();
  private entityStates: Map<string, EntityAnimationState> = new Map();

  static getInstance(): EntityAnimationRenderer {
    if (!EntityAnimationRenderer.instance) {
      EntityAnimationRenderer.instance = new EntityAnimationRenderer();
    }
    return EntityAnimationRenderer.instance;
  }

  /**
   * Renderiza una entidad con su animación correspondiente
   */
  public async renderEntity(
    ctx: CanvasRenderingContext2D,
    entity: Entity,
    x: number,
    y: number,
    size: number
  ): Promise<void> {
    const animationKey = this.getAnimationKey(entity);
    
    // Intentar obtener animación
    let animation = this.animationCache.get(animationKey);
    
    if (animation === undefined) {
      // No hemos intentado cargar esta animación aún
      animation = await this.loadAnimation(animationKey);
      this.animationCache.set(animationKey, animation);
    }

    if (animation && animation.isLoaded) {
      // Renderizar con animación
      this.renderAnimatedEntity(ctx, entity, animation, x, y, size);
    } else {
      // Fallback a renderizado básico animado
      this.renderBasicAnimatedEntity(ctx, entity, x, y, size);
    }
  }

  /**
   * Determina la clave de animación basada en el estado de la entidad
   */
  private getAnimationKey(entity: Entity): string {
    // Mapear IDs de entidades a nombres de animaciones
    const entityMap: Record<string, string> = {
      'isa': 'women',
      'stev': 'women'
    };
    
    const entityType = entityMap[entity.id] || entity.id;
    let animState = 'happy';
    
    // Determinar estado de animación basado en emojis
    if (entity.stats?.health !== undefined && entity.stats.health <= 10) {
      animState = 'dying';
    } else if (entity.mood) {
      switch (entity.mood) {
        case '😢': // SAD
        case '😔': // LONELY  
        case '😑': // BORED
        case '😰': // ANXIOUS
          animState = 'sad';
          break;
        case '😊': // HAPPY/CONTENT
        case '🤩': // EXCITED
        case '😌': // CALM
        case '😴': // TIRED
        default:
          animState = 'happy';
          break;
      }
    }

    return `entidad_${entityType}_${animState}_anim`;
  }

  /**
   * Carga una animación desde los assets
   */
  private async loadAnimation(animationKey: string): Promise<LoadedAnimation | null> {
    // Evitar cargas duplicadas
    const existingPromise = this.loadingPromises.get(animationKey);
    if (existingPromise) {
      return existingPromise;
    }

    const loadPromise = this.loadAnimationFiles(animationKey);
    this.loadingPromises.set(animationKey, loadPromise);
    
    try {
      const result = await loadPromise;
      this.loadingPromises.delete(animationKey);
      return result;
    } catch (error) {
      console.warn(`❌ No se pudo cargar animación: ${animationKey}`, error);
      this.loadingPromises.delete(animationKey);
      return null;
    }
  }

  /**
   * Carga los archivos de animación (solo PNG, sin JSON)
   */
  private async loadAnimationFiles(animationKey: string): Promise<LoadedAnimation | null> {
    // Path a animated_entities donde ahora están los archivos  
    const basePath = `/assets/animated_entities/${animationKey}`;

    try {
      // Crear metadatos por defecto (sin JSON)
      const metadata: AnimationMetadata = {
        name: animationKey,
        frame_count: 4,
        frame_size: [64, 64],
        columns: 4,
        rows: 1,
        total_duration: 800,
        loop: true,
        frames: [
          { duration: 200 },
          { duration: 200 },
          { duration: 200 },
          { duration: 200 }
        ]
      };

      // Cargar imagen PNG
      const image = new Image();
      const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Image not found: ${basePath}.png`));
        image.src = `${basePath}.png`;
      });

      await imagePromise;

      // Calcular frames
      const frames = this.calculateFrames(metadata);

      return {
        image,
        metadata,
        frames,
        isLoaded: true
      };
    } catch (error) {
      console.warn(`⚠️ Animación no disponible: ${animationKey}`, error);
      return null;
    }
  }

  /**
   * Calcula los frames de la animación basado en los metadatos
   */
  private calculateFrames(metadata: AnimationMetadata): AnimationFrame[] {
    const frames: AnimationFrame[] = [];
    const [frameWidth, frameHeight] = metadata.frame_size;

    for (let i = 0; i < metadata.frame_count; i++) {
      const col = i % metadata.columns;
      const row = Math.floor(i / metadata.columns);

      frames.push({
        x: col * frameWidth,
        y: row * frameHeight,
        width: frameWidth,
        height: frameHeight,
        duration: metadata.frames[i]?.duration || 100
      });
    }

    return frames;
  }

  /**
   * Renderiza entidad con animación cargada
   */
  private renderAnimatedEntity(
    ctx: CanvasRenderingContext2D,
    entity: Entity,
    animation: LoadedAnimation,
    x: number,
    y: number,
    size: number
  ): void {
    const currentTime = Date.now();
    const entityId = entity.id;
    
    // Obtener o crear estado de animación para esta entidad
    let state = this.entityStates.get(entityId);
    if (!state) {
      state = {
        currentFrame: 0,
        elapsedTime: 0,
        isPlaying: true,
        lastUpdateTime: currentTime
      };
      this.entityStates.set(entityId, state);
    }

    // Actualizar frame de animación
    if (state.isPlaying) {
      const deltaTime = currentTime - state.lastUpdateTime;
      state.elapsedTime += deltaTime;
      state.lastUpdateTime = currentTime;

      const currentFrameData = animation.frames[state.currentFrame];
      if (state.elapsedTime >= currentFrameData.duration) {
        state.elapsedTime = 0;
        state.currentFrame = (state.currentFrame + 1) % animation.frames.length;
      }
    }

    // Renderizar frame actual
    const frame = animation.frames[state.currentFrame];
    
    ctx.save();
    
    // Aplicar efectos según el estado de la entidad
    this.applyEntityEffects(ctx, entity);
    
    ctx.drawImage(
      animation.image,
      frame.x, frame.y, frame.width, frame.height,
      x - size / 2, y - size / 2, size, size
    );
    
    ctx.restore();
  }

  /**
   * Renderizado básico animado como fallback
   */
  private renderBasicAnimatedEntity(
    ctx: CanvasRenderingContext2D,
    entity: Entity,
    x: number,
    y: number,
    size: number
  ): void {
    const time = Date.now();
    
    ctx.save();
    
    // Aplicar efectos según el estado de la entidad
    this.applyEntityEffects(ctx, entity);
    
    // Animación de pulsación o respiración
    const pulseSpeed = entity.mood === '😊' ? 300 : 800;
    const pulseAmount = entity.mood === '😊' ? 0.15 : 0.05;
    const pulse = 1 + Math.sin(time / pulseSpeed) * pulseAmount;
    const adjustedSize = size * pulse;
    
    if (entity.id === 'isa') {
      ctx.fillStyle = this.getEntityColor(entity);
      ctx.beginPath();
      ctx.arc(x, y, adjustedSize / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (entity.id === 'stev') {
      ctx.fillStyle = this.getEntityColor(entity);
      ctx.fillRect(x - adjustedSize / 2, y - adjustedSize / 2, adjustedSize, adjustedSize);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - adjustedSize / 2, y - adjustedSize / 2, adjustedSize, adjustedSize);
    }
    
    ctx.restore();
  }

  /**
   * Aplica efectos visuales según el estado de la entidad
   */
  private applyEntityEffects(ctx: CanvasRenderingContext2D, entity: Entity): void {
    // Efectos basados en salud
    if (entity.stats?.health !== undefined) {
      if (entity.stats.health <= 10) {
        // Efecto de desvanecimiento para entidades muriendo
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 200) * 0.3;
      } else if (entity.stats.health <= 30) {
        // Efecto de parpadeo para baja salud
        ctx.globalAlpha = 0.8 + Math.sin(Date.now() / 400) * 0.2;
      }
    }

    // Efectos basados en mood
    if (entity.mood === '😊' || entity.mood === '🤩') {
      // Brillo sutil para entidades felices
      ctx.shadowColor = this.getEntityColor(entity);
      ctx.shadowBlur = 5;
    }
  }

  /**
   * Obtiene el color de la entidad basado en su estado
   */
  private getEntityColor(entity: Entity): string {
    if (entity.stats?.health !== undefined && entity.stats.health <= 10) {
      return '#666'; // Gris para dying
    }

    if (entity.mood) {
      switch (entity.mood) {
        case '😊': // HAPPY/CONTENT
        case '🤩': // EXCITED
        case '😌': // CALM
          return entity.id === 'isa' ? '#ff6b9d' : '#4ade80'; // Rosa/Verde vibrante
        case '😢': // SAD
        case '😔': // LONELY
        case '😑': // BORED
          return '#f87171'; // Rojo
        default:
          return entity.id === 'isa' ? '#e91e63' : '#10b981'; // Rosa/Verde normal
      }
    }

    return entity.id === 'isa' ? '#e91e63' : '#10b981'; // Rosa/Verde por defecto
  }

  /**
   * Precarga animaciones comunes
   */
  public async preloadCommonAnimations(): Promise<void> {
    const commonAnimations = [
      'entidad_circulo_happy_anim',
      'entidad_circulo_sad_anim',
      'entidad_circulo_dying_anim',
      'entidad_square_happy_anim', 
      'entidad_square_sad_anim',
      'entidad_square_dying_anim'
    ];

    console.log('🎬 Precargando animaciones comunes...');
    
    const loadPromises = commonAnimations.map(async (animKey) => {
      try {
        const animation = await this.loadAnimation(animKey);
        this.animationCache.set(animKey, animation);
        if (animation) {
          console.log(`✅ Animación cargada: ${animKey}`);
        }
      } catch (error) {
        console.warn(`⚠️ No se pudo precargar: ${animKey}`, error);
      }
    });

    await Promise.all(loadPromises);
    console.log('✅ Precarga de animaciones completada');
  }

  /**
   * Limpia el cache de animaciones
   */
  public clearCache(): void {
    this.animationCache.clear();
    this.entityStates.clear();
    this.loadingPromises.clear();
  }

  /**
   * Obtiene estadísticas del sistema de animaciones
   */
  public getStats(): { 
    cachedAnimations: number; 
    activeEntities: number; 
    loadingAnimations: number 
  } {
    return {
      cachedAnimations: this.animationCache.size,
      activeEntities: this.entityStates.size,
      loadingAnimations: this.loadingPromises.size
    };
  }
}

// Instancia singleton para uso global
export const entityAnimationRenderer = EntityAnimationRenderer.getInstance();
