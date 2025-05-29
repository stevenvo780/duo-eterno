import React, { useRef, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import type { Entity, Zone, MapElement } from '../types';

interface CanvasProps {
  width: number;
  height: number;
  onEntityClick?: (entityId: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ width, height, onEntityClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameState } = useGame();

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
      const entitySize = 16; // Entity radius/half-size
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawZone = (ctx: CanvasRenderingContext2D, zone: Zone) => {
      ctx.fillStyle = zone.color;
      ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
      
      // Draw zone border
      ctx.strokeStyle = zone.color.replace('0.2', '0.6');
      ctx.lineWidth = 2;
      ctx.strokeRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
      
      // Draw zone name
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        zone.name,
        zone.bounds.x + zone.bounds.width / 2,
        zone.bounds.y + 20
      );
    };

    const drawMapElement = (ctx: CanvasRenderingContext2D, element: MapElement) => {
      ctx.fillStyle = element.color;
      
      if (element.type === 'obstacle') {
        // Draw obstacles as rounded rectangles
        const radius = 5;
        ctx.beginPath();
        ctx.roundRect(element.position.x, element.position.y, element.size.width, element.size.height, radius);
        ctx.fill();
      } else {
        // Draw interactive elements with special shapes
        ctx.save();
        ctx.translate(element.position.x + element.size.width / 2, element.position.y + element.size.height / 2);
        
        if (element.id === 'fountain') {
          // Draw fountain as a circle with waves
          ctx.beginPath();
          ctx.arc(0, 0, element.size.width / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Add water ripples
          ctx.strokeStyle = element.color;
          ctx.lineWidth = 2;
          for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, (element.size.width / 2) + (i * 5), 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (element.id === 'flower_patch') {
          // Draw flower patch as multiple small circles
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const flowerX = Math.cos(angle) * 15;
            const flowerY = Math.sin(angle) * 10;
            
            ctx.beginPath();
            ctx.arc(flowerX, flowerY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        ctx.restore();
      }
    };

    const drawEntity = (ctx: CanvasRenderingContext2D, entity: Entity, now: number) => {
      const { position, state, pulsePhase, colorHue, id, isDead } = entity;
      
      // Dead entities have special rendering
      if (isDead || state === 'DEAD') {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;

        const size = 12;
        if (id === 'circle') {
          ctx.beginPath();
          ctx.arc(position.x, position.y, size / 2, 0, Math.PI * 2);
          ctx.stroke();
          // Draw X inside
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(position.x - 4, position.y - 4);
          ctx.lineTo(position.x + 4, position.y + 4);
          ctx.moveTo(position.x + 4, position.y - 4);
          ctx.lineTo(position.x - 4, position.y + 4);
          ctx.stroke();
        } else {
          ctx.strokeRect(
            position.x - size / 2,
            position.y - size / 2,
            size,
            size
          );
          // Draw X inside
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(position.x - 4, position.y - 4);
          ctx.lineTo(position.x + 4, position.y + 4);
          ctx.moveTo(position.x + 4, position.y - 4);
          ctx.lineTo(position.x - 4, position.y + 4);
          ctx.stroke();
        }
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

      ctx.globalAlpha = 1;
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const outerRadius = size;
        const innerRadius = size * 0.4;
        
        const outerX = x + Math.cos(angle) * outerRadius;
        const outerY = y + Math.sin(angle) * outerRadius;
        
        const innerAngle = angle + Math.PI / 5;
        const innerX = x + Math.cos(innerAngle) * innerRadius;
        const innerY = y + Math.sin(innerAngle) * innerRadius;
        
        if (i === 0) {
          ctx.moveTo(outerX, outerY);
        } else {
          ctx.lineTo(outerX, outerY);
        }
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      // Clear canvas with soft background
      ctx.fillStyle = '#f8f9fb';
      ctx.fillRect(0, 0, width, height);

      // Draw star in corner (optional decoration)
      drawStar(ctx, 30, 30, 8, '#e0e5eb');

      const now = Date.now();

      // Draw connection animation if active
      if (gameState.connectionAnimation.active) {
        const animationAge = now - gameState.connectionAnimation.startTime;
        if (animationAge < 2000) { // 2 second animation
          const [entity1, entity2] = gameState.entities;
          const alpha = 1 - (animationAge / 2000);
          
          ctx.strokeStyle = `rgba(150, 100, 255, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(entity1.position.x, entity1.position.y);
          ctx.lineTo(entity2.position.x, entity2.position.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw zones
      gameState.zones.forEach(zone => {
        drawZone(ctx, zone);
      });

      // Draw map elements
      gameState.mapElements.forEach(element => {
        drawMapElement(ctx, element);
      });

      // Draw entities
      gameState.entities.forEach(entity => {
        drawEntity(ctx, entity, now);
      });

      requestAnimationFrame(render);
    };

    render();
  }, [gameState, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onClick={handleCanvasClick}
      style={{
        border: '1px solid #e0e5eb',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: onEntityClick ? 'pointer' : 'default'
      }}
    />
  );
};

export default Canvas;
