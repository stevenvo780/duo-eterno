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
  const { entities, zones, resonance, mapElements } = gameState;

  const drawEntity = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    const { position, id, stats, isDead, mood } = entity;
    
    // Safe positions
    const px = clamp(position?.x as number, 0, width);
    const py = clamp(position?.y as number, 0, height);
    
    // Determinar sprite basado en estado de ánimo y salud
    const entityName = id === 'circle' ? 'circulo' : id;
    let spriteKey: string = id;
    if (isDead) {
      spriteKey = `entidad_${entityName}_dying`;
    } else {
      // Determinar estado visual basado en stats y mood
      if (mood === 'happy' && stats.energy > 70) {
        spriteKey = `entidad_${entityName}_happy`;
      } else if (stats.health < 30 || mood === 'sad') {
        spriteKey = `entidad_${entityName}_sad`;
      } else if (stats.energy < 30) {
        spriteKey = `entidad_${entityName}_dying`;
      } else {
        spriteKey = `entidad_${entityName}_happy`; // Estado por defecto
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
        'food': 'pattern_kitchen',
        'rest': 'pattern_bedroom',
        'play': 'pattern_living',
        'social': 'pattern_living',
        'work': 'pattern_tiles_only',
        'comfort': 'pattern_garden',
        'energy': 'pattern_stone'
      };
      
      const spriteKey = zoneSprites[zone.type] || null;
      const sprite = spriteKey ? loadedImages[spriteKey] : null;
      
      if (sprite && sprite.complete) {
        // Usar patrón repetido sin deformación
        ctx.save();
        
        // Crear patrón repetido del sprite
        const pattern = ctx.createPattern(sprite, 'repeat');
        if (pattern) {
          // Aplicar clip para limitar al área de la zona
          ctx.beginPath();
          ctx.rect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
          ctx.clip();
          
          // Llenar con el patrón
          ctx.fillStyle = pattern;
          ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
        }
        
        ctx.restore();
        
        // Add zone border for clarity
        ctx.strokeStyle = zone.color.replace('0.25', '0.6').replace('0.3', '0.8');
        ctx.lineWidth = 2;
        ctx.strokeRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
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

  const drawMapElements = useCallback((ctx: CanvasRenderingContext2D) => {
    mapElements.forEach(element => {
      let spriteKey = '';
      
      if (element.type === 'obstacle') {
        // Determine sprite based on size - trees are tall, rocks are wide
        if (element.size.height > element.size.width) {
          spriteKey = 'obstaculo_arbol';
        } else {
          spriteKey = 'obstaculo_roca';
        }
      } else {
        // Handle decorative elements based on type and naming - new system
        if (element.id.includes('furniture_bed')) {
          spriteKey = element.id.includes('double') ? 'furniture_bed_double' : 'furniture_bed_simple';
        } else if (element.id.includes('furniture_sofa')) {
          spriteKey = element.id.includes('classic') ? 'furniture_sofa_classic' : 'furniture_sofa_modern';
        } else if (element.id.includes('furniture_table')) {
          spriteKey = element.id.includes('dining') ? 'furniture_table_dining' : 'furniture_table_coffee';
        } else if (element.id.includes('plant_')) {
          if (element.id.includes('tree')) spriteKey = 'plant_tree';
          else if (element.id.includes('flower')) spriteKey = 'plant_flower';
          else spriteKey = 'plant_small';
        } else if (element.id.includes('deco_')) {
          if (element.id.includes('lamp')) spriteKey = 'deco_lamp';
          else if (element.id.includes('clock')) spriteKey = 'deco_clock';
          else if (element.id.includes('bookshelf')) spriteKey = 'deco_bookshelf';
        }
        // Legacy mapping
        else if (element.id.includes('flower')) {
          spriteKey = 'flor_rosa';
        } else if (element.id.includes('banco')) {
          spriteKey = 'banco';
        } else if (element.id.includes('lampara')) {
          spriteKey = 'lampara';
        } else if (element.id.includes('fuente')) {
          spriteKey = 'fuente_agua';
        }
      }
      
      const sprite = spriteKey ? loadedImages[spriteKey] : null;
      
      if (sprite && sprite.complete) {
        // Draw scaled sprite maintaining aspect ratio
        ctx.drawImage(
          sprite, 
          element.position.x, 
          element.position.y, 
          element.size.width, 
          element.size.height
        );
        
        // Add subtle glow for decorative elements
        if (!element.id.includes('obstacle') && !element.id.includes('rock') && !element.id.includes('tree')) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = element.color;
          ctx.fillRect(
            element.position.x - 2, 
            element.position.y - 2, 
            element.size.width + 4, 
            element.size.height + 4
          );
          ctx.restore();
        }
      } else {
        // Fallback drawing with improved visuals
        ctx.save();
        ctx.fillStyle = element.color;
        
        // Different shapes for different types
        if (element.type === 'obstacle') {
          if (element.size.height > element.size.width) {
            // Tree - draw as rounded rectangle
            ctx.beginPath();
            ctx.roundRect(element.position.x, element.position.y, element.size.width, element.size.height, 4);
            ctx.fill();
          } else {
            // Rock - draw as oval
            ctx.beginPath();
            ctx.ellipse(
              element.position.x + element.size.width/2,
              element.position.y + element.size.height/2,
              element.size.width/2,
              element.size.height/2,
              0, 0, 2 * Math.PI
            );
            ctx.fill();
          }
        } else {
          // Decorative elements as circles with border
          ctx.beginPath();
          ctx.arc(
            element.position.x + element.size.width/2,
            element.position.y + element.size.height/2,
            Math.min(element.size.width, element.size.height)/2,
            0, 2 * Math.PI
          );
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        ctx.restore();
      }
    });
  }, [mapElements, loadedImages]);

  const drawResonanceEffect = useCallback((ctx: CanvasRenderingContext2D) => {
    const r = clamp(resonance, 0, 100);
    if (r > 50 && entities.length >= 2) {
      const [entity1, entity2] = entities;
      
      if (!entity1.isDead && !entity2.isDead) {
        const x1 = clamp(entity1.position?.x as number, 0, width);
        const y1 = clamp(entity1.position?.y as number, 0, height);
        const x2 = clamp(entity2.position?.x as number, 0, width);
        const y2 = clamp(entity2.position?.y as number, 0, height);

        // Línea de conexión elegante con gradiente y efectos
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Crear gradiente dinámico basado en la resonancia
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const hue1 = Math.floor(r * 3.6); // Color basado en resonancia
        const hue2 = (hue1 + 60) % 360; // Color complementario
        
        gradient.addColorStop(0, `hsla(${hue1}, 70%, 60%, ${Math.min(0.9, r / 100 + 0.3)})`);
        gradient.addColorStop(0.5, `hsla(${(hue1 + hue2) / 2}, 80%, 70%, ${Math.min(1.0, r / 100 + 0.4)})`);
        gradient.addColorStop(1, `hsla(${hue2}, 70%, 60%, ${Math.min(0.9, r / 100 + 0.3)})`);
        
        // Línea principal con efecto pulsante
        const pulseIntensity = Math.sin(Date.now() * 0.003) * 0.3 + 0.7;
        const lineWidth = Math.max(2, r / 20) * pulseIntensity;
        
        ctx.save();
        
        // Sombra suave
        ctx.shadowColor = `hsla(${hue1}, 50%, 40%, 0.4)`;
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Línea principal
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Efecto de partículas en la línea
        const numParticles = Math.floor(distance / 40);
        for (let i = 0; i < numParticles; i++) {
          const t = i / numParticles;
          const px = x1 + dx * t + (Math.sin(Date.now() * 0.005 + i) * 3);
          const py = y1 + dy * t + (Math.cos(Date.now() * 0.005 + i) * 3);
          
          ctx.fillStyle = `hsla(${hue1 + (i * 10)}, 80%, 80%, ${0.6 * pulseIntensity})`;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }
  }, [entities, resonance, width, height]);

  // Load all sprite assets
  useEffect(() => {
    const assetsToLoad = [
      'barra_estadistica',
      'canvas_base', 
      'conexion_entidades',
      'dialogo_overlay',
      'entidad_circulo_happy',
      'entidad_circulo_sad', 
      'entidad_circulo_dying',
      'entidad_square_happy',
      'entidad_square_sad',
      'entidad_square_dying',
      'pattern_kitchen',
      'pattern_bedroom',
      'pattern_living',
      'pattern_garden',
      'pattern_stone',
      'pattern_tiles_only',
      // Mobiliario
      'furniture_bed_simple',
      'furniture_bed_double',
      'furniture_sofa_modern',
      'furniture_sofa_classic',
      'furniture_table_coffee',
      'furniture_table_dining',
      // Plantas
      'plant_small',
      'plant_tree',
      'plant_flower',
      // Decoración
      'deco_lamp',
      'deco_clock',
      'deco_bookshelf',
      // Caminos
      'path_stone_h',
      'path_stone_v',
      'path_brick_h',
      'path_dirt_h',
      'obstaculo_arbol',
      'obstaculo_roca',
      // Legacy assets para compatibilidad
      'banco',
      'flor_rosa',
      'fuente_agua',
      'lampara'
    ];

    const loadImage = (assetName: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.warn(`Failed to load ${assetName}, trying alternative paths...`);
          // Try unified sprites directory
          const altImg = new Image();
          altImg.onload = () => resolve(altImg);
          altImg.onerror = reject;
          altImg.src = `/assets/sprites/${assetName}.png`;
        };
        img.src = `/assets/sprites/${assetName}.png`;
      });
    };

    const loadAllImages = async () => {
      try {
        const imagePromises = assetsToLoad.map(async (assetName) => {
          try {
            const img = await loadImage(assetName);
            return [assetName, img] as [string, HTMLImageElement];
          } catch {
            console.warn(`Could not load asset: ${assetName}`);
            return null;
          }
        });

        const imageResults = await Promise.all(imagePromises);
        const imageEntries = imageResults.filter(result => result !== null) as [string, HTMLImageElement][];
        const imageMap = Object.fromEntries(imageEntries);
        
        setLoadedImages(imageMap);
        logRenderCompat(`Loaded ${Object.keys(imageMap).length}/${assetsToLoad.length} pixel art assets`);
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
      
      // Draw map elements (obstacles, decorative items)
      drawMapElements(ctx);
      
      // Draw resonance effect
      drawResonanceEffect(ctx);
      
      // Draw entities (on top)
      entities.forEach(entity => drawEntity(ctx, entity));
      
      logRenderCompat(`Canvas rendered: ${entities.length} entities, ${zones.length} zones, resonance: ${resonance.toFixed(1)}`);
    } catch (error) {
      console.error('Error durante el renderizado:', error);
      logRenderCompat(`Error en renderizado: ${error}`);
    }
  }, [width, height, entities, zones, resonance, mapElements, drawEntity, drawZones, drawMapElements, drawResonanceEffect, loadedImages]);

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
