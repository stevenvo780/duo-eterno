import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useRenderer } from '../hooks/useRenderer';
import type { Entity } from '../types';
import { 
  updateEntityFeedback, 
  generateContextualAnimation,
  calculateIndicatorPosition,
  type EntityFeedback,
  type ContextualAnimation
} from '../utils/feedbackSystem';
import { logRender } from '../utils/logger';
import { getCurrentMetrics } from '../utils/performanceOptimizer';

interface CanvasProps {
  width: number;
  height: number;
  onEntityClick?: (entityId: string) => void;
  zoom?: number;
  panX?: number;
  panY?: number;
}

// Animated sprite interfaces
interface SpriteMetadata {
  frame_count: number;
  frame_size: [number, number];
  frame_duration: number;
  columns: number;
  rows: number;
}

interface AnimatedSprite {
  image: HTMLImageElement;
  metadata: SpriteMetadata;
  currentFrame: number;
  frameTimer: number;
  currentAnimation: string;
}

interface AssetsState {
  background: HTMLImageElement | null;
  props: Map<string, HTMLImageElement>;
  animatedSprites: Map<string, AnimatedSprite>;
  mapElements: Map<string, HTMLImageElement>;
  isLoading: boolean;
}

// Particle system with reduced count and object pooling
const PARTICLE_COUNT = 4; // Significantly reduced for better performance
const PARTICLE_POOL: Array<{
  x: number;
  y: number;
  alpha: number;
  size: number;
  speed: number;
  angle: number;
  lastUpdate: number;
}> = [];

// Initialize particle pool
for (let i = 0; i < PARTICLE_COUNT; i++) {
  PARTICLE_POOL.push({
    x: Math.random(),
    y: Math.random(),
    alpha: Math.random() * 0.15 + 0.05,
    size: Math.random() * 1 + 0.5,
    speed: Math.random() * 0.0003 + 0.0001,
    angle: Math.random() * Math.PI * 2,
    lastUpdate: 0
  });
}

const Canvas: React.FC<CanvasProps> = ({ width, height, onEntityClick, zoom = 1, panX = 0, panY = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastRenderTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const { gameState } = useGame();
  const { shouldRender, getQualityLevel } = useRenderer();
  
  // Asset loading state
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // Estado para assets - usar Maps organizados por tipo
  const assetsRef = useRef<AssetsState>({
    background: null,
    props: new Map<string, HTMLImageElement>(),
    animatedSprites: new Map<string, AnimatedSprite>(), 
    mapElements: new Map<string, HTMLImageElement>(),
    isLoading: false
  });
  
  // Estado para el sistema de feedback
  const [entityFeedbacks, setEntityFeedbacks] = useState<Map<string, EntityFeedback>>(new Map());
  const [contextualAnimations, setContextualAnimations] = useState<ContextualAnimation[]>([]);
  const feedbackUpdateRef = useRef<number>(0);

  // Memoize background gradient to avoid recreating it every frame
  const backgroundGradient = useMemo(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    return gradient;
  }, [width, height]);

  // Function to load assets once
  const loadAssets = useCallback(async () => {
    const hasSprites = assetsRef.current.animatedSprites?.size > 0;
    
    if (assetsRef.current.isLoading && hasSprites) {
      console.log('⏭️ Assets ya cargados correctamente...', {
        isLoading: assetsRef.current.isLoading,
        assetsLoaded,
        spritesCount: assetsRef.current.animatedSprites?.size || 0
      });
      return;
    }
    
    if (assetsLoaded && hasSprites) {
      console.log('⏭️ Assets finalizados y presentes...');
      return;
    }
    
    // Reset loading state if we lost sprites (StrictMode unmount/remount)
    if (assetsRef.current.isLoading && !hasSprites) {
      console.log('🔄 Reseteando estado de carga tras pérdida de sprites...');
      assetsRef.current.isLoading = false;
    }
    
    assetsRef.current.isLoading = true;
    console.log('🚀 Iniciando carga completa de assets...');
    
    try {
      // Load background
      const backgroundImg = new Image();
      backgroundImg.src = '/assets/backgrounds/grass/magical_grass_base.png';
      await new Promise<void>((resolve) => {
        backgroundImg.onload = () => {
          console.log('✅ Fondo de pasto cargado');
          resolve();
        };
        backgroundImg.onerror = () => {
          console.warn('⚠️ No se pudo cargar el fondo');
          resolve(); // Continue even if background fails
        };
      });
      assetsRef.current.background = backgroundImg;
      
      // Load entity sprites for emotions
      const entityAssets = [
        { key: 'circle-happy', imagePath: '/assets/animations/entities/entidad_circulo_happy_anim.png', jsonPath: '/assets/animations/entities/entidad_circulo_happy_anim.json' },
        { key: 'circle-sad', imagePath: '/assets/animations/entities/entidad_circulo_sad_anim.png', jsonPath: '/assets/animations/entities/entidad_circulo_sad_anim.json' },
        { key: 'circle-dying', imagePath: '/assets/animations/entities/entidad_circulo_dying_anim.png', jsonPath: '/assets/animations/entities/entidad_circulo_dying_anim.json' },
        { key: 'square-happy', imagePath: '/assets/animations/entities/entidad_square_happy_anim.png', jsonPath: '/assets/animations/entities/entidad_square_happy_anim.json' },
        { key: 'square-sad', imagePath: '/assets/animations/entities/entidad_square_sad_anim.png', jsonPath: '/assets/animations/entities/entidad_square_sad_anim.json' },
        { key: 'square-dying', imagePath: '/assets/animations/entities/entidad_square_dying_anim.png', jsonPath: '/assets/animations/entities/entidad_square_dying_anim.json' }
      ];
      
      for (const asset of entityAssets) {
        // Load sprite image
        const entityImg = new Image();
        entityImg.src = asset.imagePath;
        await new Promise<void>((resolve) => {
          entityImg.onload = () => resolve();
          entityImg.onerror = () => {
            console.warn(`⚠️ No se pudo cargar sprite de entidad: ${asset.key}`);
            resolve(); // Continue even if some sprites fail
          };
        });

        // Load animation metadata JSON
        let metadata: SpriteMetadata;
        try {
          const response = await fetch(asset.jsonPath);
          metadata = await response.json();
        } catch (error) {
          console.warn(`⚠️ No se pudo cargar JSON de animación: ${asset.key}`, error);
          // Fallback metadata for single frame
          metadata = {
            frame_count: 1,
            frame_size: [32, 32],
            frame_duration: 80,
            columns: 1,
            rows: 1
          };
        }

        assetsRef.current.animatedSprites.set(asset.key, { 
          image: entityImg, 
          metadata,
          currentFrame: 0,
          frameTimer: 0,
          currentAnimation: 'idle'
        });
      }
      
      // Load diverse props
      const propAssets = [
        { key: 'banco', path: '/assets/props/banco.png' },
        { key: 'bookshelf', path: '/assets/props/deco_bookshelf.png' },
        { key: 'clock', path: '/assets/props/deco_clock.png' },
        { key: 'lamp', path: '/assets/props/deco_lamp.png' },
        { key: 'sofa', path: '/assets/props/furniture_sofa_modern.png' },
        { key: 'table', path: '/assets/props/furniture_table_coffee.png' },
        { key: 'flower', path: '/assets/props/flor_rosa.png' },
        { key: 'plant-small', path: '/assets/props/plant_small.png' },
        { key: 'plant-tree', path: '/assets/props/plant_tree.png' }
      ];
      
      for (const asset of propAssets) {
        const propImg = new Image();
        propImg.src = asset.path;
        await new Promise<void>((resolve) => {
          propImg.onload = () => resolve();
          propImg.onerror = () => {
            console.warn(`⚠️ No se pudo cargar prop: ${asset.key}`);
            resolve(); // Continue even if some props fail
          };
        });
        assetsRef.current.props.set(asset.key, propImg);
      }
      
      // Load map elements 
      const mapAssets = [
        { key: 'fountain', path: '/assets/props/fuente_agua.png' },
        { key: 'tree', path: '/assets/props/obstaculo_arbol.png' },
        { key: 'rock', path: '/assets/props/obstaculo_roca.png' },
        { key: 'path-stone-h', path: '/assets/props/path_stone_h.png' },
        { key: 'path-stone-v', path: '/assets/props/path_stone_v.png' }
      ];
      
      for (const asset of mapAssets) {
        const mapImg = new Image();
        mapImg.src = asset.path;
        await new Promise<void>((resolve) => {
          mapImg.onload = () => resolve();
          mapImg.onerror = () => {
            console.warn(`⚠️ No se pudo cargar elemento de mapa: ${asset.key}`);
            resolve(); // Continue even if some elements fail
          };
        });
        assetsRef.current.mapElements.set(asset.key, mapImg);
      }
      
            console.log('✅ Carga única de assets completada', {
        fondo: !!assetsRef.current.background,
        sprites: assetsRef.current.animatedSprites.size,
        props: assetsRef.current.props.size,
        mapas: assetsRef.current.mapElements.size
      });
      
      assetsRef.current.isLoading = false;
      setAssetsLoaded(true);
    } catch (error) {
      console.warn('⚠️ Error cargando algunos assets:', error);
      assetsRef.current.isLoading = false;
      setAssetsLoaded(true); // Continue without assets
    }
  }, [assetsLoaded]);

  // Load assets once on mount
  useEffect(() => {
    const currentAssetsRef = assetsRef.current; // Copy ref to avoid issues
    loadAssets();
    
    // Cleanup function to reset loading state on unmount (StrictMode compatibility)
    return () => {
      if (currentAssetsRef) {
        currentAssetsRef.isLoading = false;
      }
    };
  }, [loadAssets]);

  // Function to update animated sprite frame
  const updateSpriteAnimation = useCallback((sprite: AnimatedSprite, deltaTime: number) => {
    sprite.frameTimer += deltaTime;
    
    if (sprite.frameTimer >= sprite.metadata.frame_duration) {
      sprite.currentFrame = (sprite.currentFrame + 1) % sprite.metadata.frame_count;
      sprite.frameTimer = 0;
    }
  }, []);

  // Function to render animated sprite
  const drawAnimatedSprite = useCallback((
    ctx: CanvasRenderingContext2D, 
    sprite: AnimatedSprite, 
    x: number, 
    y: number, 
    width: number,
    height: number
  ) => {
    if (!sprite.image || !sprite.metadata) return;
    
    // Update animation frame
    updateSpriteAnimation(sprite, 16); // Approximate 60fps delta
    
    const { currentFrame, metadata } = sprite;
    const { frame_size, columns } = metadata;
    
    // Calculate source coordinates in spritesheet
    const frameX = (currentFrame % columns) * frame_size[0];
    const frameY = Math.floor(currentFrame / columns) * frame_size[1];
    
    // Draw the specific frame from spritesheet
    ctx.drawImage(
      sprite.image,
      frameX, frameY, frame_size[0], frame_size[1], // Source coordinates
      x, y, width, height // Destination coordinates
    );
  }, [updateSpriteAnimation]);

  // Actualizar feedback de entidades cada 500ms
  useEffect(() => {
    const updateFeedback = () => {
      const now = performance.now();
      if (now - feedbackUpdateRef.current > 500) {
        const newFeedbacks = new Map<string, EntityFeedback>();
        
        for (const entity of gameState.entities) {
          // Encontrar el compañero
          const companion = gameState.entities.find(e => e.id !== entity.id) || null;
          const feedback = updateEntityFeedback(entity, companion, gameState.resonance);
          newFeedbacks.set(entity.id, feedback);
        }
        
        setEntityFeedbacks(newFeedbacks);
        feedbackUpdateRef.current = now;
      }
    };

    const interval = setInterval(updateFeedback, 500);
    return () => clearInterval(interval);
  }, [gameState.entities, gameState.zones, gameState.resonance]);

  // Generar animaciones contextuales basadas en eventos
  useEffect(() => {
    const newAnimations: ContextualAnimation[] = [];
    
    for (const entity of gameState.entities) {
      const animation = generateContextualAnimation(entity, gameState.resonance);
      if (animation) {
        newAnimations.push(animation);
      }
    }
    
    setContextualAnimations(newAnimations);
  }, [gameState.entities, gameState.resonance]);

  // Función para renderizar indicadores de feedback
  const drawEntityFeedback = useCallback((ctx: CanvasRenderingContext2D, entity: Entity, now: number, quality: 'low' | 'medium' | 'high') => {
    if (quality === 'low') return; // Skip feedback en calidad baja
    
    const feedback = entityFeedbacks.get(entity.id);
    if (!feedback) return;

    // Dibujar indicador de intención
    if (feedback.intention && quality === 'high') {
      const position = calculateIndicatorPosition(entity, width, height);
      
      // Fondo del indicador
      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = feedback.intention.color;
      ctx.shadowColor = feedback.intention.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(position.x - 40, position.y - 15, 80, 20);
      
      // Texto del indicador
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'white';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(feedback.intention.message, position.x, position.y - 3);
      ctx.restore();
    }

    // Indicador de humor (emoji)
    if (feedback.moodIndicator && (quality === 'medium' || quality === 'high')) {
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(feedback.moodIndicator, entity.position.x + 20, entity.position.y - 20);
    }

    // Barra de progreso de actividad
    if (feedback.activityProgress > 0 && quality === 'high') {
      const barWidth = 30;
      const barHeight = 4;
      const barX = entity.position.x - barWidth / 2;
      const barY = entity.position.y + 25;
      
      // Fondo de la barra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Progreso
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(barX, barY, barWidth * feedback.activityProgress, barHeight);
    }

    // Alerta de necesidades críticas
    if (feedback.needsAlert && (quality === 'medium' || quality === 'high')) {
      const pulse = Math.sin(now * 0.008) * 0.5 + 0.5;
      ctx.save();
      ctx.globalAlpha = pulse * 0.6;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(entity.position.x, entity.position.y, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }, [entityFeedbacks, width, height]);

  // Utilidad para ajustar alpha de un color rgba/hsla o fallback
  const setAlpha = (color: string, alpha: number): string => {
    // Si ya es rgba/hsla, intenta reemplazar alpha
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      const r = rgbaMatch[1];
      const g = rgbaMatch[2];
      const b = rgbaMatch[3];
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    const hslaMatch = color.match(/hsla?\((\d+),\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/);
    if (hslaMatch) {
      const h = hslaMatch[1];
      const s = hslaMatch[2];
      const l = hslaMatch[3];
      return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
    }
    // Fallback: envolver como rgba con alpha
    return color.includes('#') ? color : `rgba(255,255,255,${alpha})`;
  };

  // Clamping utilitario y defaults seguros para el render
  const clamp = (v: number, min: number, max: number) => {
    if (!Number.isFinite(v)) return min;
    return Math.min(max, Math.max(min, v));
  };

  // Función para aplicar animaciones contextuales (devuelve un restore flag)
  const applyContextualAnimations = useCallback((ctx: CanvasRenderingContext2D, entity: Entity, now: number) => {
    let transformed = false;
    for (const animation of contextualAnimations) {
      switch (animation.type) {
        case 'PULSE': {
          const pulseScale = 1 + Math.sin(now * 0.01) * 0.2 * animation.intensity;
          ctx.translate(entity.position.x, entity.position.y);
          ctx.scale(pulseScale, pulseScale);
          ctx.translate(-entity.position.x, -entity.position.y);
          transformed = true;
          break;
        }
        case 'GLOW': {
          ctx.shadowColor = animation.color;
          ctx.shadowBlur = 20 * animation.intensity;
          break;
        }
        case 'SHAKE': {
          const shakeX = (Math.random() - 0.5) * 4 * animation.intensity;
          const shakeY = (Math.random() - 0.5) * 4 * animation.intensity;
          ctx.translate(shakeX, shakeY);
          transformed = true;
          break;
        }
        case 'BOUNCE': {
          const bounceOffset = Math.abs(Math.sin(now * 0.015)) * 10 * animation.intensity;
          ctx.translate(0, -bounceOffset);
          transformed = true;
          break;
        }
        case 'TRAIL': {
          ctx.globalAlpha *= 0.7;
          ctx.fillStyle = animation.color;
          break;
        }
      }
    }
    return transformed;
  }, [contextualAnimations]);

  //  entity click handler
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onEntityClick) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Apply transformations to get world coordinates
    const clickX = ((event.clientX - rect.left) * scaleX - panX) / zoom;
    const clickY = ((event.clientY - rect.top) * scaleY - panY) / zoom;

    // Use for...of for better performance than forEach
    for (const entity of gameState.entities) {
      const entitySize = 16;
      const dx = clickX - entity.position.x;
      const dy = clickY - entity.position.y;
      const distanceSquared = dx * dx + dy * dy; // Avoid sqrt for better performance
      
      if (distanceSquared <= entitySize * entitySize) {
        onEntityClick(entity.id);
        break;
      }
    }
  }, [onEntityClick, gameState.entities, zoom, panX, panY]);

  //  entity drawing function with sprites and emotions
  const drawEntity = useCallback((ctx: CanvasRenderingContext2D, entity: Entity, now: number, quality: 'low' | 'medium' | 'high') => {
    const { position, state, pulsePhase, colorHue, id, isDead } = entity;

    // Defaults y clamping antes de dibujar
    const px = Number.isFinite(position?.x) ? clamp(position.x, 0, width) : width / 2;
    const py = Number.isFinite(position?.y) ? clamp(position.y, 0, height) : height / 2;
    const hueRaw = Number.isFinite(colorHue) ? colorHue : 200;
    const hue = clamp(hueRaw, 0, 360);
    const safeRes = clamp(gameState.resonance, 0, 100);

    // Desfase de dibujo si el estado contiene valores fuera de rango
    const offsetX = px - (Number.isFinite(position?.x) ? position.x : px);
    const offsetY = py - (Number.isFinite(position?.y) ? position.y : py);

    // Envolver todo el dibujo en un translate que corrige coordenadas
    ctx.save();
    if (offsetX !== 0 || offsetY !== 0) {
      ctx.translate(offsetX, offsetY);
    }
    
    // Determine emotion based on state and resonance
    let emotionKey = '';
    if (isDead || state === 'DEAD') {
      emotionKey = `${id}-dying`;
    } else if (state === 'LOW_RESONANCE' || safeRes < 30) {
      emotionKey = `${id}-sad`;
    } else {
      emotionKey = `${id}-happy`;
    }
    
    // Try to use animated sprite - with safety checks
    const animatedSprite = assetsRef.current?.animatedSprites?.get(emotionKey);
    let spriteDrawn = false;
    
    if (animatedSprite && quality !== 'low') {
      // Draw animated sprite with emotion
      const scale = quality === 'medium' ? 0.8 : 1.0;
      const baseSize = 32; // Base sprite size
      const spriteSize = baseSize * scale;
      
      // Calculate pulse animation for alive entities
      const pulse = isDead || state === 'DEAD' ? 0.8 : Math.sin((now * 0.002) + pulsePhase) * 0.1 + 0.9;
      const finalSize = spriteSize * pulse;
      
      // Calculate opacity based on state
      let opacity = 1;
      if (state === 'FADING') {
        opacity = Math.max(0.3, gameState.resonance / 100);
      } else if (state === 'LOW_RESONANCE') {
        opacity = 0.7 + (pulse * 0.2);
      } else if (isDead || state === 'DEAD') {
        opacity = 0.4;
      }
      
      // Ensure the sprite has current animation  
      if (!animatedSprite.currentAnimation) {
        animatedSprite.currentAnimation = 'idle';
        animatedSprite.currentFrame = 0;
        animatedSprite.frameTimer = 0;
      }
      
      ctx.globalAlpha = opacity;
      
      // Draw animated sprite centered on entity position
      drawAnimatedSprite(
        ctx,
        animatedSprite,
        position.x - finalSize / 2,
        position.y - finalSize / 2,
        finalSize,
        finalSize
      );
      
      spriteDrawn = true;
    }
    
    // Fallback to simple shapes if no sprite or low quality
    if (!spriteDrawn) {
      // Dead entities have simple rendering
      if (isDead || state === 'DEAD') {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;

        const size = 12;
        if (id === 'circle') {
          ctx.beginPath();
          ctx.arc(position.x, position.y, size / 2, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.strokeRect(
            position.x - size / 2,
            position.y - size / 2,
            size,
            size
          );
        }
        
        // Draw X mark (simplified for low quality)
        if (quality !== 'low') {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ef4444';
          ctx.beginPath();
          ctx.moveTo(position.x - 6, position.y - 6);
          ctx.lineTo(position.x + 6, position.y + 6);
          ctx.moveTo(position.x + 6, position.y - 6);
          ctx.lineTo(position.x - 6, position.y + 6);
          ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        ctx.restore();
        return;
      }
      
      // Calculate pulse animation (reduced frequency for better performance)
      const pulseSpeed = state === 'LOW_RESONANCE' ? 0.3 : 0.6;
      const pulse = Math.sin((now * 0.002 * pulseSpeed) + pulsePhase) * 0.2 + 0.8;
      
      // Calculate opacity based on state
      let opacity = 1;
      if (state === 'FADING') {
        opacity = Math.max(0.1, gameState.resonance / 100);
      } else if (state === 'LOW_RESONANCE') {
        opacity = 0.6 + (pulse * 0.3);
      }

      // Color changes based on resonance and state - emotion-based colors
      let finalHue = hue;
      if (state === 'LOW_RESONANCE' || safeRes < 30) {
        finalHue = 240; // Blue for sad
      } else if (safeRes > 70) {
        finalHue = 120; // Green for happy
      }
      
      const saturation = Math.max(30, safeRes * 0.8);
      const lightness = state === 'LOW_RESONANCE' ? 40 + (pulse * 15) : 60;
      
      ctx.globalAlpha = opacity;
      ctx.fillStyle = `hsl(${finalHue}, ${saturation}%, ${lightness}%)`;

      const size = Math.max(4, 16 * pulse);

      if (id === 'circle') {
        // Draw circle entity
        ctx.beginPath();
        ctx.arc(position.x, position.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw square entity
        ctx.fillRect(
          position.x - size / 2,
          position.y - size / 2,
          size,
          size
        );
      }
      
      // Add glow effect only for medium/high quality
      if (quality !== 'low') {
        ctx.globalAlpha = opacity * 0.2;
        ctx.fillStyle = `hsl(${finalHue}, ${saturation}%, 80%)`;
        const glowSize = size * 1.3;
        
        if (id === 'circle') {
          ctx.beginPath();
          ctx.arc(position.x, position.y, glowSize / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(
            position.x - glowSize / 2,
            position.y - glowSize / 2,
            glowSize,
            glowSize
          );
        }
      }
    }
    
    ctx.globalAlpha = 1;
    ctx.restore();
  }, [gameState.resonance, width, height, drawAnimatedSprite]);

  //  particle update function
  const updateParticles = useCallback((now: number, quality: 'low' | 'medium' | 'high') => {
    if (quality === 'low') return; // Skip particles in low quality mode
    
    for (let i = 0; i < PARTICLE_POOL.length; i++) {
      const particle = PARTICLE_POOL[i];
      const deltaTime = now - particle.lastUpdate;
      
      if (deltaTime > 16) { // Update at most 60fps
        particle.x += Math.cos(particle.angle) * particle.speed * deltaTime;
        particle.y += Math.sin(particle.angle) * particle.speed * deltaTime;
        
        // Wrap around screen
        if (particle.x > 1) particle.x = 0;
        if (particle.x < 0) particle.x = 1;
        if (particle.y > 1) particle.y = 0;
        if (particle.y < 0) particle.y = 1;
        
        particle.lastUpdate = now;
      }
    }
  }, []);

  //  main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = performance.now();
    
    // Frame rate limiting
    if (!shouldRender(now)) {
      animationRef.current = requestAnimationFrame(render);
      return;
    }

    const quality = getQualityLevel();
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply zoom and pan transformations
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Draw background (use cached gradient when possible)
    if (backgroundGradient) {
      ctx.fillStyle = backgroundGradient;
    } else {
      const g = ctx.createLinearGradient(0, 0, width / zoom, height / zoom);
      g.addColorStop(0, '#1e293b');
      g.addColorStop(1, '#0f172a');
      ctx.fillStyle = g;
    }
    ctx.fillRect(-panX / zoom, -panY / zoom, width / zoom, height / zoom);

    // Draw background image if loaded
    if (assetsRef.current.background && assetsLoaded) {
      const bg = assetsRef.current.background;
      const tileWidth = bg.width * 0.5; // Scale down for better fit
      const tileHeight = bg.height * 0.5;
      
      // Calculate tiling area based on zoom and pan
      const startX = Math.floor((-panX / zoom) / tileWidth) * tileWidth;
      const startY = Math.floor((-panY / zoom) / tileHeight) * tileHeight;
      const endX = startX + (width / zoom) + tileWidth;
      const endY = startY + (height / zoom) + tileHeight;
      
      for (let x = startX; x < endX; x += tileWidth) {
        for (let y = startY; y < endY; y += tileHeight) {
          ctx.drawImage(bg, x, y, tileWidth, tileHeight);
        }
      }
    }

    // Draw zones (simplified for low quality but always visible)
    if (gameState.zones) {
      for (const zone of gameState.zones) {
        // Draw zone background with reduced opacity for low quality
        const alpha = quality === 'low' ? 0.3 : 0.5;
        ctx.fillStyle = setAlpha(zone.color, alpha);
        ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
        
        // Draw zone border only for medium/high quality
        if (quality !== 'low') {
          ctx.strokeStyle = setAlpha(zone.color, 0.6);
          ctx.lineWidth = 2;
          ctx.strokeRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
          
          // Draw zone name only for high quality
          if (quality === 'high') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(
              zone.name,
              zone.bounds.x + zone.bounds.width / 2,
              zone.bounds.y + 20
            );
          }
        }
      }
    }

    // Draw props if loaded (critical assets always visible)
    if (assetsRef.current?.props?.size > 0 && assetsLoaded) {
      const props = assetsRef.current.props;
      
      // Scale props based on quality but always render them
      const scale = quality === 'low' ? 0.3 : quality === 'medium' ? 0.4 : 0.5;
      
      // Render various props in strategic positions
      const banco = props?.get('banco');
      if (banco) {
        ctx.drawImage(banco, 150, 200, banco.width * scale, banco.height * scale);
      }
      
      const bookshelf = props?.get('bookshelf');
      if (bookshelf) {
        ctx.drawImage(bookshelf, 400, 150, bookshelf.width * (scale * 0.8), bookshelf.height * (scale * 0.8));
      }
      
      const clock = props?.get('clock');
      if (clock) {
        ctx.drawImage(clock, 250, 350, clock.width * (scale * 0.6), clock.height * (scale * 0.6));
      }
      
      const sofa = props?.get('sofa');
      if (sofa) {
        ctx.drawImage(sofa, 50, 300, sofa.width * (scale * 0.7), sofa.height * (scale * 0.7));
      }
      
      const flower = props?.get('flower');
      if (flower) {
        ctx.drawImage(flower, 300, 100, flower.width * (scale * 0.5), flower.height * (scale * 0.5));
      }
      
      const plantSmall = props?.get('plant-small');
      if (plantSmall) {
        ctx.drawImage(plantSmall, 480, 280, plantSmall.width * (scale * 0.4), plantSmall.height * (scale * 0.4));
      }
      
      const table = props?.get('table');
      if (table) {
        ctx.drawImage(table, 350, 250, table.width * (scale * 0.6), table.height * (scale * 0.6));
      }
    }

    // Draw map elements with real sprites (simplified for low quality but always visible)
    if (gameState.mapElements) {
      for (const element of gameState.mapElements) {
        const mapAssets = assetsRef.current.mapElements;
        let spriteDrawn = false;
        
        // Try to use actual sprites first
        if (element.id === 'fountain') {
          const fountainSprite = mapAssets?.get('fountain');
          if (fountainSprite) {
            const scale = quality === 'low' ? 0.6 : quality === 'medium' ? 0.8 : 1.0;
            ctx.drawImage(
              fountainSprite, 
              element.position.x, 
              element.position.y, 
              fountainSprite.width * scale, 
              fountainSprite.height * scale
            );
            spriteDrawn = true;
          }
        } else if (element.type === 'obstacle') {
          // Try different obstacle sprites
        const treeSprite = mapAssets?.get('tree');
        const rockSprite = mapAssets?.get('rock');          if (treeSprite && element.id?.includes('tree')) {
            const scale = quality === 'low' ? 0.5 : quality === 'medium' ? 0.7 : 0.9;
            ctx.drawImage(
              treeSprite,
              element.position.x,
              element.position.y,
              treeSprite.width * scale,
              treeSprite.height * scale
            );
            spriteDrawn = true;
          } else if (rockSprite && element.id?.includes('rock')) {
            const scale = quality === 'low' ? 0.4 : quality === 'medium' ? 0.6 : 0.8;
            ctx.drawImage(
              rockSprite,
              element.position.x,
              element.position.y,
              rockSprite.width * scale,
              rockSprite.height * scale
            );
            spriteDrawn = true;
          }
        } else {
          // Use path sprites for other elements
          const pathH = mapAssets?.get('path-stone-h');
          const pathV = mapAssets?.get('path-stone-v');
          if (pathH && element.size.width > element.size.height) {
            ctx.drawImage(pathH, element.position.x, element.position.y, element.size.width, element.size.height);
            spriteDrawn = true;
          } else if (pathV && element.size.height > element.size.width) {
            ctx.drawImage(pathV, element.position.x, element.position.y, element.size.width, element.size.height);
            spriteDrawn = true;
          }
        }
        
        // Fallback to colored shapes if no sprite available
        if (!spriteDrawn) {
          ctx.fillStyle = element.color || '#8B4513';
          
          if (element.type === 'obstacle') {
            // Simple rectangles for low/medium quality, rounded for high
            if (quality === 'high') {
              ctx.beginPath();
              ctx.roundRect(element.position.x, element.position.y, element.size.width, element.size.height, 5);
              ctx.fill();
            } else {
              ctx.fillRect(element.position.x, element.position.y, element.size.width, element.size.height);
            }
          } else if (element.id === 'fountain') {
            // Draw fountain as a circle (simplified for low quality)
            ctx.beginPath();
            ctx.arc(
              element.position.x + element.size.width / 2, 
              element.position.y + element.size.height / 2, 
              element.size.width / 2, 
              0, 
              Math.PI * 2
            );
            ctx.fill();
            
            // Add ripples only for high quality
            if (quality === 'high') {
              ctx.strokeStyle = element.color;
              ctx.lineWidth = 1;
              for (let i = 1; i <= 2; i++) {
                ctx.beginPath();
                ctx.arc(
                  element.position.x + element.size.width / 2, 
                  element.position.y + element.size.height / 2, 
                  (element.size.width / 2) + (i * 8), 
                  0, 
                  Math.PI * 2
                );
                ctx.stroke();
              }
            }
          } else {
            // Default rectangular shape
            ctx.fillRect(element.position.x, element.position.y, element.size.width, element.size.height);
          }
        }
      }
    }

    // Draw entities
    for (const entity of gameState.entities) {
      // Aplicar animaciones contextuales envolviendo el dibujado de la entidad
      ctx.save();
      const transformed = applyContextualAnimations(ctx, entity, now);
      drawEntity(ctx, entity, now, quality);
      if (transformed) {
        ctx.restore();
      } else {
        ctx.restore();
      }
      
      // Dibujar feedback de entidad después de la entidad
      drawEntityFeedback(ctx, entity, now, quality);
      
      // Draw zone effect indicators only for high quality
      if (gameState.zones && quality === 'high') {
        const currentZone = gameState.zones.find(zone => 
          entity.position.x >= zone.bounds.x &&
          entity.position.x <= zone.bounds.x + zone.bounds.width &&
          entity.position.y >= zone.bounds.y &&
          entity.position.y <= zone.bounds.y + zone.bounds.height
        );
        
        if (currentZone && !entity.isDead) {
          // Draw zone effect indicator above entity
          const pulse = Math.sin(now * 0.003) * 0.3 + 0.7;
          ctx.globalAlpha = pulse * 0.6;
          ctx.fillStyle = setAlpha(currentZone.color, 0.8);
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          
          // Zone effect symbol
          const symbols = {
            food: '🍃',
            rest: '💤',
            play: '🎮',
            social: '💫',
            comfort: '🧘'
          } as const;
          
          const symbol = symbols[currentZone.type as keyof typeof symbols] || '✨';
          ctx.fillText(symbol, entity.position.x, entity.position.y - 25);
          ctx.globalAlpha = 1;
        }
      }
    }

    // Draw connection lines between entities when close (medium/high quality only)
    if (gameState.entities.length === 2 && quality !== 'low') {
      const [entity1, entity2] = gameState.entities;
      const dx = entity1.position.x - entity2.position.x;
      const dy = entity1.position.y - entity2.position.y;
      const distanceSquared = dx * dx + dy * dy;
      const maxDistance = 100;

      if (distanceSquared < maxDistance * maxDistance && !entity1.isDead && !entity2.isDead) {
        const distance = Math.sqrt(distanceSquared);
        const opacity = Math.max(0, 1 - distance / maxDistance);
        ctx.strokeStyle = `rgba(147, 197, 253, ${opacity * 0.4})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(entity1.position.x, entity1.position.y);
        ctx.lineTo(entity2.position.x, entity2.position.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Update and draw particles (medium/high quality only)
    if (quality !== 'low') {
      updateParticles(now, quality);
      
      // Reduced particle count for medium quality
      const particleCount = quality === 'high' ? PARTICLE_COUNT : Math.floor(PARTICLE_COUNT / 2);
      
      for (let i = 0; i < particleCount; i++) {
        const particle = PARTICLE_POOL[i];
        const x = particle.x * width;
        const y = particle.y * height;
        
        ctx.fillStyle = `rgba(147, 197, 253, ${particle.alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Update frame counter
    frameCount.current++;
    lastRenderTime.current = now;

    // Restore transformations
    ctx.restore();

    // Opcional: verificar rendimiento cada 60 frames
    if (frameCount.current % 60 === 0) {
      const metrics = getCurrentMetrics();
      if (metrics.fps < 30) {
        logRender.warn(`FPS bajo detectado: ${metrics.fps.toFixed(1)} FPS`);
      }
    }

    animationRef.current = requestAnimationFrame(render);
  }, [
    shouldRender,
    getQualityLevel,
    backgroundGradient,
    width,
    height,
    panX,
    panY,
    zoom,
    gameState.zones,
    gameState.mapElements,
    gameState.entities,
    drawEntity,
    updateParticles,
    drawEntityFeedback,
    applyContextualAnimations,
    assetsLoaded
  ]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleCanvasClick}
      style={{
        border: '2px solid #475569',
        borderRadius: '8px',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
      }}
    />
  );
};

export default React.memo(Canvas);
