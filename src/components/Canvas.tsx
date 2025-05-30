import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useGame } from '../hooks/useGame';
import { useRenderer } from '../hooks/useRenderer';
import type { Entity } from '../types';
import { logRender } from '../utils/logger';

interface CanvasProps {
  width: number;
  height: number;
  onEntityClick?: (entityId: string) => void;
  zoom?: number;
  panX?: number;
  panY?: number;
}

// Optimized particle system - initialized per quality level
let PARTICLE_POOL: Array<{
  x: number;
  y: number;
  alpha: number;
  size: number;
  speed: number;
  angle: number;
  lastUpdate: number;
}> = [];

const initializeParticles = (quality: 'low' | 'medium' | 'high') => {
  const counts = { low: 0, medium: 2, high: 4 };
  const count = counts[quality];
  
  PARTICLE_POOL = [];
  for (let i = 0; i < count; i++) {
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
};

const Canvas: React.FC<CanvasProps> = ({ width, height, onEntityClick, zoom = 1, panX = 0, panY = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastRenderTime = useRef<number>(0);
  const { gameState } = useGame();
  const { shouldRender, getQualityLevel } = useRenderer();

  // Initialize particles based on quality level
  useEffect(() => {
    const quality = getQualityLevel();
    initializeParticles(quality);
  }, [getQualityLevel]);
  const frameCount = useRef<number>(0);

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

  // Simplified entity click handler
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
    
    const particleCount = PARTICLE_POOL.length;
    for (let i = 0; i < particleCount; i++) {
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
      const gradient = ctx.createLinearGradient(0, 0, width / zoom, height / zoom);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
    }
    ctx.fillRect(-panX / zoom, -panY / zoom, width / zoom, height / zoom);

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
      drawEntity(ctx, entity, now, quality);
      
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
      
      // Use actual particle count based on current quality
      const particleCount = PARTICLE_POOL.length;
      
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
      // Performance monitoring simplified (removed getCurrentMetrics dependency)
      const currentTime = performance.now();
      const timeDiff = currentTime - lastRenderTime.current;
      const fps = timeDiff > 0 ? 1000 / timeDiff : 0;
      if (fps < 30) {
        logRender.warn(`FPS bajo detectado: ${fps.toFixed(1)} FPS`);
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
    updateParticles
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
    <div style={{ position: 'relative' }}>
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
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        width: '320px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
      </div>
    </div>
  );
};

export default React.memo(Canvas);
