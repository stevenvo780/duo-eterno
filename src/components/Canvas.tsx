import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useGame } from '../hooks/useGame';
import { useOptimizedRenderer } from '../hooks/useOptimizedRenderer';
import type { Entity } from '../types';

interface CanvasProps {
  width: number;
  height: number;
  onEntityClick?: (entityId: string) => void;
}

// Optimized particle system with object pooling
const PARTICLE_COUNT = 6; // Reduced further for better performance
const PARTICLE_POOL = Array.from({ length: PARTICLE_COUNT }, () => ({
  x: Math.random(),
  y: Math.random(),
  alpha: Math.random() * 0.2 + 0.1,
  size: Math.random() * 1.5 + 0.5,
  speed: Math.random() * 0.0005 + 0.0002,
  angle: Math.random() * Math.PI * 2,
  lastUpdate: 0
}));

const Canvas: React.FC<CanvasProps> = ({ width, height, onEntityClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastRenderTime = useRef<number>(0);
  const frameSkipCounter = useRef<number>(0);
  const { gameState } = useGame();
  const { shouldRender, getQualityLevel } = useOptimizedRenderer();

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

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onEntityClick) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    // Check if click is within any entity's bounds
    for (const entity of gameState.entities) {
      const entitySize = 16;
      const distance = Math.sqrt(
        Math.pow(clickX - entity.position.x, 2) + 
        Math.pow(clickY - entity.position.y, 2)
      );
      
      if (distance <= entitySize) {
        onEntityClick(entity.id);
        break;
      }
    }
  };

  const drawEntity = useCallback((ctx: CanvasRenderingContext2D, entity: Entity, now: number) => {
    const { position, state, pulsePhase, colorHue, id, isDead } = entity;
    
    // Dead entities have special rendering
    if (isDead || state === 'DEAD') {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#64748b';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;

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
      
      // Draw X mark
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(position.x - 6, position.y - 6);
      ctx.lineTo(position.x + 6, position.y + 6);
      ctx.moveTo(position.x + 6, position.y - 6);
      ctx.lineTo(position.x - 6, position.y + 6);
      ctx.stroke();
      
      ctx.globalAlpha = 1;
      return;
    }
    
    // Calculate pulse animation
    const pulseSpeed = state === 'LOW_RESONANCE' ? 0.5 : 1;
    const pulse = Math.sin((now * 0.003 * pulseSpeed) + pulsePhase) * 0.3 + 0.7;
    
    // Calculate opacity based on state
    let opacity = 1;
    if (state === 'FADING') {
      opacity = Math.max(0.1, gameState.resonance / 100);
    } else if (state === 'LOW_RESONANCE') {
      opacity = 0.6 + (pulse * 0.4);
    }

    // Color changes based on resonance and state
    const saturation = Math.max(30, gameState.resonance);
    const lightness = state === 'LOW_RESONANCE' ? 40 + (pulse * 20) : 60;
    
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

    // Add glow effect
    ctx.globalAlpha = opacity * 0.3;
    ctx.fillStyle = `hsl(${colorHue}, ${saturation}%, 80%)`;
    const glowSize = size * 1.5;
    
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

    ctx.globalAlpha = 1;
  }, [gameState.resonance]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = performance.now();

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw zones if they exist
    if (gameState.zones) {
      gameState.zones.forEach(zone => {
        // Draw zone background
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
        
        // Draw zone border
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
      });
    }

    // Draw map elements if they exist
    if (gameState.mapElements) {
      gameState.mapElements.forEach(element => {
        ctx.fillStyle = element.color;
        
        if (element.type === 'obstacle') {
          // Draw obstacles as rounded rectangles
          ctx.beginPath();
          ctx.roundRect(element.position.x, element.position.y, element.size.width, element.size.height, 5);
          ctx.fill();
        } else if (element.id === 'fountain') {
          // Draw fountain as a circle with ripples
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
          for (let i = 1; i <= 3; i++) {
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
        } else if (element.id === 'flower_patch') {
          // Draw flower patch as multiple circles
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const flowerX = element.position.x + element.size.width / 2 + Math.cos(angle) * 15;
            const flowerY = element.position.y + element.size.height / 2 + Math.sin(angle) * 10;
            
            ctx.beginPath();
            ctx.arc(flowerX, flowerY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
    }

    // Draw entities
    gameState.entities.forEach(entity => {
      drawEntity(ctx, entity, now);
      
      // Draw zone effect indicators
      if (gameState.zones) {
        const currentZone = gameState.zones.find(zone => 
          entity.position.x >= zone.bounds.x &&
          entity.position.x <= zone.bounds.x + zone.bounds.width &&
          entity.position.y >= zone.bounds.y &&
          entity.position.y <= zone.bounds.y + zone.bounds.height
        );
        
        if (currentZone && !entity.isDead) {
          // Draw zone effect indicator above entity
          const pulse = Math.sin(now * 0.005) * 0.3 + 0.7;
          ctx.globalAlpha = pulse * 0.8;
          ctx.fillStyle = currentZone.color.replace('0.2', '0.8');
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          
          // Zone effect symbol
          const symbols = {
            food: '🍃',
            rest: '💤',
            play: '🎮',
            social: '💫',
            comfort: '🧘'
          };
          
          const symbol = symbols[currentZone.type] || '✨';
          ctx.fillText(symbol, entity.position.x, entity.position.y - 25);
          ctx.globalAlpha = 1;
        }
      }
    });

    // Draw connection lines between entities when close
    if (gameState.entities.length === 2) {
      const [entity1, entity2] = gameState.entities;
      const distance = Math.sqrt(
        Math.pow(entity1.position.x - entity2.position.x, 2) +
        Math.pow(entity1.position.y - entity2.position.y, 2)
      );

      if (distance < 100 && !entity1.isDead && !entity2.isDead) {
        const opacity = Math.max(0, 1 - distance / 100);
        ctx.strokeStyle = `rgba(147, 197, 253, ${opacity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(entity1.position.x, entity1.position.y);
        ctx.lineTo(entity2.position.x, entity2.position.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Add some ambient particles
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const alpha = Math.random() * 0.3;
      const size = Math.random() * 2 + 1;
      
      ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [gameState, width, height, drawEntity]);

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

export default Canvas;
