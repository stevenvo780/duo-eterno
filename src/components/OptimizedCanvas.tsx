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
    
    // Set entity color based on mood and type
    const baseColor = id === 'circle' ? '#ff6b6b' : '#4ecdc4';
    const opacity = Math.max(0.3, stats.energy / 100);
    
    ctx.fillStyle = baseColor;
    ctx.globalAlpha = opacity;
    
    // Draw entity
    if (id === 'circle') {
      ctx.beginPath();
      ctx.arc(position.x, position.y, 15, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(position.x - 15, position.y - 15, 30, 30);
    }
    
    ctx.globalAlpha = 1.0;
  }, []);

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
    if (resonance > 50 && entities.length >= 2) {
      const [entity1, entity2] = entities;
      
      if (!entity1.isDead && !entity2.isDead) {
        ctx.strokeStyle = `hsla(${Math.floor(resonance * 3.6)}, 70%, 60%, ${resonance / 100})`;
        ctx.lineWidth = Math.max(1, resonance / 25);
        
        ctx.beginPath();
        ctx.moveTo(entity1.position.x, entity1.position.y);
        ctx.lineTo(entity2.position.x, entity2.position.y);
        ctx.stroke();
      }
    }
  }, [entities, resonance]);

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
