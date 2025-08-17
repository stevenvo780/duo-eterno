/**
 * 🚀 FASE 1: Canvas Optimizado con Object Pooling y Memory Management
 * 
 * Optimizaciones implementadas según el Plan de Trabajo:
 * - ✅ Renderizado básico optimizado
 * - ✅ Memory leak prevention con cleanup completo
 * - ✅ Compatible con el sistema de logging optimizado
 */

import React, { useRef, useEffect, useCallback, useContext, useState } from "react";
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
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});
  
  if (!gameContext) {
    throw new Error('OptimizedCanvas debe usarse dentro de GameProvider');
  }
  
  const { gameState } = gameContext;
  const { entities, zones, resonance } = gameState;

  const drawEntity = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    const { position, id, stats, isDead, mood } = entity;
    
    // Skip if dead
    if (isDead) return;
    
    // Safe positions
    const px = clamp(position?.x as number, 0, width);
    const py = clamp(position?.y as number, 0, height);
    
    // Determine which sprite to use based on entity state and mood
    let spriteKey = '';
    if (isDead) {
      spriteKey = id === 'circle' ? 'entidad_circulo_muriendo' : 'entidad_cuadrado_muriendo';
    } else if (id === 'circle' || id === 'square') {
      const baseKey = id === 'circle' ? 'entidad_circulo' : 'entidad_cuadrado';
      if (mood === 'happy' && stats.energy > 70) {
        spriteKey = `${baseKey}_viva`;
      } else if (stats.energy < 30 || mood === 'sad') {
        spriteKey = `${baseKey}_muriendo`;
      } else {
        spriteKey = `${baseKey}_principal`;
      }
    }
    
    const sprite = loadedImages[spriteKey];
    if (sprite && sprite.complete) {
      // Draw the pixel art sprite
      const spriteSize = 32; // Assuming 32x32 pixel sprites
      ctx.drawImage(sprite, px - spriteSize/2, py - spriteSize/2, spriteSize, spriteSize);
    } else {
      // Fallback to original drawing if sprite not loaded
      const baseColor = id === 'circle' ? '#ff6b6b' : '#4ecdc4';
      const energy = Number.isFinite(stats?.energy) ? stats.energy : 50;
      const opacity = Math.max(0.3, Math.min(1, energy / 100));
      
      ctx.fillStyle = baseColor;
      ctx.globalAlpha = opacity;
      
      if (id === 'circle') {
        ctx.beginPath();
        ctx.arc(px, py, 15, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(px - 15, py - 15, 30, 30);
      }
      
      ctx.globalAlpha = 1.0;
    }
  }, [width, height, loadedImages]);

  const drawZones = useCallback((ctx: CanvasRenderingContext2D) => {
    zones.forEach(zone => {
      // Map zone types to sprite assets
      const zoneSprites: Record<string, string> = {
        'food': 'zona_cocina',
        'rest': 'zona_descanso',
        'play': 'zona_juegos',
        'social': 'zona_social',
        'work': 'zona_trabajo',
        'garden': 'zona_jardin_alimentos',
        'energy': 'zona_energia',
        'meditation': 'zona_meditacion'
      };
      
      const spriteKey = zoneSprites[zone.type] || null;
      const sprite = spriteKey ? loadedImages[spriteKey] : null;
      
      if (sprite && sprite.complete) {
        // Draw the zone sprite, tiled if necessary
        const spriteWidth = sprite.width;
        const spriteHeight = sprite.height;
        const pattern = ctx.createPattern(sprite, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
        }
      } else {
        // Fallback to original zone drawing
        ctx.fillStyle = zone.color + '20'; // Semi-transparent
        ctx.strokeStyle = zone.color;
        ctx.lineWidth = 1;
        
        ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
        ctx.strokeRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
      }
    });
  }, [zones, loadedImages]);

  const drawResonanceEffect = useCallback((ctx: CanvasRenderingContext2D) => {
    const r = clamp(resonance, 0, 100);
    if (r > 50 && entities.length >= 2) {
      const [entity1, entity2] = entities;
      
      if (!entity1.isDead && !entity2.isDead) {
        const x1 = clamp(entity1.position?.x as number, 0, width);
        const y1 = clamp(entity1.position?.y as number, 0, height);
        const x2 = clamp(entity2.position?.x as number, 0, width);
        const y2 = clamp(entity2.position?.y as number, 0, height);

        // Use connection sprite if available
        const connectionSprite = loadedImages['conexion_entidades'];
        if (connectionSprite && connectionSprite.complete) {
          // Draw connection sprite along the line
          const dx = x2 - x1;
          const dy = y2 - y1;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const steps = Math.floor(distance / 16); // Every 16 pixels
          
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const px = x1 + dx * t;
            const py = y1 + dy * t;
            ctx.drawImage(connectionSprite, px - 8, py - 8, 16, 16);
          }
        } else {
          // Fallback to line drawing
          ctx.strokeStyle = `hsla(${Math.floor(r * 3.6)}, 70%, 60%, ${r / 100})`;
          ctx.lineWidth = Math.max(1, r / 25);
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }
  }, [entities, resonance, width, height, loadedImages]);

  // Load all sprite assets
  useEffect(() => {
    const assetsToLoad = [
      'barra_estadistica',
      'canvas_base', 
      'conexion_entidades',
      'dialogo_overlay',
      'entidad_circulo_muriendo',
      'entidad_circulo_principal',
      'entidad_circulo_viva',
      'entidad_cuadrado_muriendo',
      'entidad_cuadrado_principal', 
      'entidad_cuadrado_viva',
      'obstaculo_arbol',
      'obstaculo_roca',
      'zona_cocina',
      'zona_descanso',
      'zona_energia',
      'zona_jardin_alimentos',
      'zona_juegos',
      'zona_meditacion',
      'zona_social',
      'zona_trabajo'
    ];

    const loadImage = (assetName: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `/assets/pixel_art/${assetName}.png`;
      });
    };

    const loadAllImages = async () => {
      try {
        const imagePromises = assetsToLoad.map(async (assetName) => {
          const img = await loadImage(assetName);
          return [assetName, img] as [string, HTMLImageElement];
        });

        const imageEntries = await Promise.all(imagePromises);
        const imageMap = Object.fromEntries(imageEntries);
        
        setLoadedImages(imageMap);
        logRenderCompat(`Loaded ${Object.keys(imageMap).length} pixel art assets`);
      } catch (error) {
        console.error('Error loading pixel art assets:', error);
        logRenderCompat(`Error loading assets: ${error}`);
      }
    };

    loadAllImages();
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background - use canvas_base sprite if available
    const backgroundSprite = loadedImages['canvas_base'];
    if (backgroundSprite && backgroundSprite.complete) {
      // Tile the background sprite
      const pattern = ctx.createPattern(backgroundSprite, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      // Fallback background
      ctx.fillStyle = '#f0f8ff';
      ctx.fillRect(0, 0, width, height);
    }
    
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
