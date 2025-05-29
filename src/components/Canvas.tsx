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
import { getCurrentMetrics } from '../utils/performanceOptimizer';

interface CanvasProps {
  width: number;
  height: number;
  onEntityClick?: (entityId: string) => void;
}

//  particle system with reduced count and object pooling
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

const Canvas: React.FC<CanvasProps> = ({ width, height, onEntityClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastRenderTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const { gameState } = useGame();
  const { shouldRender, getQualityLevel } = useRenderer();
  
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

  // Actualizar feedback de entidades cada 500ms
  useEffect(() => {
    const updateFeedback = () => {
      const now = performance.now();
      if (now - feedbackUpdateRef.current > 500) {
        const newFeedbacks = new Map<string, EntityFeedback>();
        
        for (const entity of gameState.entities) {
          // Encontrar el compañero
          const companion = gameState.entities.find(e => e.id !== entity.id) || null;
          const feedback = updateEntityFeedback(entity, gameState.zones || [], companion, gameState.resonance);
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
    if (feedback.moodIndicator && quality === 'medium' || quality === 'high') {
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

  // Función para aplicar animaciones contextuales
  const applyContextualAnimations = useCallback((ctx: CanvasRenderingContext2D, entity: Entity, now: number) => {
    for (const animation of contextualAnimations) {
      ctx.save();
      
      switch (animation.type) {
        case 'PULSE': {
          const pulseScale = 1 + Math.sin(now * 0.01) * 0.2 * animation.intensity;
          ctx.translate(entity.position.x, entity.position.y);
          ctx.scale(pulseScale, pulseScale);
          ctx.translate(-entity.position.x, -entity.position.y);
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
          break;
        }
          
        case 'BOUNCE': {
          const bounceOffset = Math.abs(Math.sin(now * 0.015)) * 10 * animation.intensity;
          ctx.translate(0, -bounceOffset);
          break;
        }
          
        case 'TRAIL': {
          ctx.globalAlpha *= 0.7;
          ctx.fillStyle = animation.color;
          break;
        }
      }
      
      ctx.restore();
    }
  }, [contextualAnimations]);

  //  entity click handler
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onEntityClick) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

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
  }, [onEntityClick, gameState.entities]);

  //  entity drawing function with quality levels
  const drawEntity = useCallback((ctx: CanvasRenderingContext2D, entity: Entity, now: number, quality: 'low' | 'medium' | 'high') => {
    const { position, state, pulsePhase, colorHue, id, isDead } = entity;
    
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

    // Color changes based on resonance and state
    const saturation = Math.max(30, gameState.resonance * 0.8); // Slight optimization
    const lightness = state === 'LOW_RESONANCE' ? 40 + (pulse * 15) : 60;
    
    ctx.globalAlpha = opacity;
    ctx.fillStyle = `hsl(${colorHue}, ${saturation}%, ${lightness}%)`;

    const size = 16 * pulse;

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
      ctx.fillStyle = `hsl(${colorHue}, ${saturation}%, 80%)`;
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

    ctx.globalAlpha = 1;
  }, [gameState.resonance]);

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

    // Draw background (use cached gradient when possible)
    if (backgroundGradient) {
      ctx.fillStyle = backgroundGradient;
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
    }
    ctx.fillRect(0, 0, width, height);

    // Draw zones (simplified for low quality)
    if (gameState.zones && quality !== 'low') {
      for (const zone of gameState.zones) {
        // Draw zone background
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
        
        // Draw zone border only for high quality
        if (quality === 'high') {
          ctx.strokeStyle = zone.color.replace('0.2', '0.6');
          ctx.lineWidth = 2;
          ctx.strokeRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
          
          // Draw zone name
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

    // Draw map elements (simplified for low quality)
    if (gameState.mapElements && quality !== 'low') {
      for (const element of gameState.mapElements) {
        ctx.fillStyle = element.color;
        
        if (element.type === 'obstacle') {
          // Simple rectangles for low/medium quality
          if (quality === 'high') {
            ctx.beginPath();
            ctx.roundRect(element.position.x, element.position.y, element.size.width, element.size.height, 5);
            ctx.fill();
          } else {
            ctx.fillRect(element.position.x, element.position.y, element.size.width, element.size.height);
          }
        } else if (element.id === 'fountain' && quality === 'high') {
          // Draw fountain as a circle with ripples (high quality only)
          ctx.beginPath();
          ctx.arc(
            element.position.x + element.size.width / 2, 
            element.position.y + element.size.height / 2, 
            element.size.width / 2, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
          
          // Add ripples
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
      }
    }

    // Draw entities
    for (const entity of gameState.entities) {
      // Aplicar animaciones contextuales antes de dibujar
      applyContextualAnimations(ctx, entity, now);
      
      drawEntity(ctx, entity, now, quality);
      
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
          ctx.fillStyle = currentZone.color.replace('0.2', '0.8');
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

    // Opcional: verificar rendimiento cada 60 frames
    if (frameCount.current % 60 === 0) {
      const metrics = getCurrentMetrics();
      if (metrics.fps < 30) {
        console.warn(`FPS bajo detectado: ${metrics.fps.toFixed(1)} FPS`);
      }
    }

    animationRef.current = requestAnimationFrame(render);
  }, [
    shouldRender,
    getQualityLevel,
    backgroundGradient,
    width,
    height,
    gameState.zones,
    gameState.mapElements,
    gameState.entities,
    drawEntity,
    updateParticles,
    drawEntityFeedback,
    applyContextualAnimations
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
