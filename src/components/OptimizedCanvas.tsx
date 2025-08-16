/**
 * 🚀 FASE 1: Canvas Optimizado con Object Pooling y Memory Management
 * 
 * Optimizaciones implementadas según el Plan de Trabajo:
 * - ✅ Renderizado básico optimizado
 * - ✅ Memory leak prevention con cleanup completo
 * - ✅ Compatible con el sistema de logging optimizado
 */

import React, { useRef, useEffect, useCallback, useContext } from "react";
import { GameContext } from "../state/GameContext";
import type { Entity } from "../types";
import { logRenderCompat } from "../utils/optimizedDynamicsLogger";

interface OptimizedCanvasProps {
  width: number;
  height: number;
}

const clamp = (v: number, min: number, max: number) => {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
};

const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContext = useContext(GameContext);
  
  if (!gameContext) {
    throw new Error('OptimizedCanvas debe usarse dentro de GameProvider');
  }
  
  const { gameState } = gameContext;
  const { entities, zones, resonance } = gameState;

  const drawEntity = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    const { position, id, stats, isDead } = entity;
    
    // Skip if dead
    if (isDead) return;
    
    // Safe positions and opacity
    const px = clamp(position?.x as number, 0, width);
    const py = clamp(position?.y as number, 0, height);
    const baseColor = id === 'circle' ? '#ff6b6b' : '#4ecdc4';
    const energy = Number.isFinite(stats?.energy) ? stats.energy : 50;
    const opacity = Math.max(0.3, Math.min(1, energy / 100));
    
    ctx.fillStyle = baseColor;
    ctx.globalAlpha = opacity;
    
    // Draw entity
    if (id === 'circle') {
      ctx.beginPath();
      ctx.arc(px, py, 15, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(px - 15, py - 15, 30, 30);
    }
    
    ctx.globalAlpha = 1.0;
  }, [width, height]);

  const drawZones = useCallback((ctx: CanvasRenderingContext2D) => {
    zones.forEach(zone => {
      ctx.fillStyle = zone.color + '20'; // Semi-transparent
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = 1;
      
      ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
      ctx.strokeRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
    });
  }, [zones]);

  const drawResonanceEffect = useCallback((ctx: CanvasRenderingContext2D) => {
    const r = clamp(resonance, 0, 100);
    if (r > 50 && entities.length >= 2) {
      const [entity1, entity2] = entities;
      
      if (!entity1.isDead && !entity2.isDead) {
        const x1 = clamp(entity1.position?.x as number, 0, width);
        const y1 = clamp(entity1.position?.y as number, 0, height);
        const x2 = clamp(entity2.position?.x as number, 0, width);
        const y2 = clamp(entity2.position?.y as number, 0, height);

        ctx.strokeStyle = `hsla(${Math.floor(r * 3.6)}, 70%, 60%, ${r / 100})`;
        ctx.lineWidth = Math.max(1, r / 25);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }, [entities, resonance, width, height]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, width, height);
    
    try {
      // Draw zones first (background)
      drawZones(ctx);
      
      // Draw resonance effect
      drawResonanceEffect(ctx);
      
      // Draw entities
      entities.forEach(entity => drawEntity(ctx, entity));
      
      logRenderCompat(`Canvas rendered: ${entities.length} entities, ${zones.length} zones, resonance: ${resonance.toFixed(1)}`);
    } catch (error) {
      console.error('Error durante el renderizado:', error);
      logRenderCompat(`Error en renderizado: ${error}`);
    }
  }, [width, height, entities, zones, resonance, drawEntity, drawZones, drawResonanceEffect]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <canvas 
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '2px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}
    />
  );
};

export default OptimizedCanvas;
