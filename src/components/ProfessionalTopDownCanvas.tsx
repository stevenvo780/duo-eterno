import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useRenderer } from '../hooks/useRenderer';
import { useAnimationSystem } from '../hooks/useAnimationSystem';
import { useDayNightCycle } from '../hooks/useDayNightCycle';
import { DayNightClock } from './DayNightClock';
import { assetManager, type Asset } from '../utils/assetManager';
import { generateOrganicProceduralMap } from '../utils/organicMapGeneration';
import type { Entity, Zone, MapElement } from '../types';

interface TileMap {
  tiles: string[][];
  tileSize: number;
  width: number;
  height: number;
}

interface GameObject {
  id: string;
  asset: Asset;
  x: number;
  y: number;
  shadow?: Asset;
}

interface Props {
  width: number;
  height: number;
  zoom?: number;
  panX?: number;
  panY?: number;
  onEntityClick?: (entity: Entity) => void;
}

const ProfessionalTopDownCanvas: React.FC<Props> = ({ 
  width, 
  height, 
  zoom = 1, 
  panX = 0, 
  panY = 0,
  onEntityClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const { gameState } = useGame();
  const { shouldRender } = useRenderer();
  const { preloadAnimations } = useAnimationSystem();
  const { getSkyColor, getLightIntensity, phase } = useDayNightCycle();
  
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [tileMap, setTileMap] = useState<TileMap | null>(null);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  
  // Estados para el sistema orgánico
  const [organicZones, setOrganicZones] = useState<Zone[]>([]);
  const [organicMapElements, setOrganicMapElements] = useState<MapElement[]>([]);

  // Cargar assets esenciales
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoadingProgress(10);
        console.log('🎨 Iniciando carga de assets...');
        
        // Precargar assets esenciales
        await assetManager.preloadEssentialAssets();
        setLoadingProgress(50);
        
        // Cargar assets adicionales por categorías
        await Promise.all([
          assetManager.loadAssetsByCategory('GROUND'),
          assetManager.loadAssetsByCategory('BUILDINGS'),
          assetManager.loadAssetsByCategory('NATURE'),
          assetManager.loadAssetsByCategory('ROADS'),
          assetManager.loadAssetsByCategory('WATER')
        ]);
        setLoadingProgress(90);
        
        const stats = assetManager.getStats();
        console.log('✅ Assets cargados:', stats);
        
        setLoadingProgress(100);
        setAssetsLoaded(true);
        
        // Precargar animaciones del personaje
        await preloadAnimations();
        
      } catch (error) {
        console.error('❌ Error cargando assets:', error);
      }
    };

    loadAssets();
  }, [preloadAnimations]);

  // Generar mapa orgánico cuando cambie la semilla
  useEffect(() => {
    if (!assetsLoaded) return;
    
    console.log('🗺️ Generando mapa orgánico...');
    const { zones, mapElements } = generateOrganicProceduralMap(gameState.mapSeed, {
      theme: 'MODERN',
      useVoronoi: true,
      organicStreets: true,
      densityVariation: 0.8,
      naturalClustering: true
    });
    
    setOrganicZones(zones);
    setOrganicMapElements(mapElements);
  }, [gameState.mapSeed, assetsLoaded]);

  // Generar tilemap dinámico
  const generateSmartTileMap = useCallback(() => {
    if (!assetsLoaded || organicZones.length === 0) return;
    
    const tileSize = 32;
    const mapWidth = Math.ceil(width / tileSize) + 4;
    const mapHeight = Math.ceil(height / tileSize) + 4;
    const tiles: string[][] = [];
    
    console.log('🗺️ Generando mapa inteligente...');
    
    // Crear mapa base con césped
    for (let y = 0; y < mapHeight; y++) {
      tiles[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        const grassAsset = assetManager.getRandomAssetByType('ground', 'cesped');
        tiles[y][x] = grassAsset?.id || 'tile_0182_suelo_cesped';
      }
    }
    
    // Aplicar zonas orgánicas
    organicZones.forEach(zone => {
      const startX = Math.floor(zone.bounds.x / tileSize);
      const startY = Math.floor(zone.bounds.y / tileSize);
      const endX = Math.min(mapWidth - 1, Math.floor((zone.bounds.x + zone.bounds.width) / tileSize));
      const endY = Math.min(mapHeight - 1, Math.floor((zone.bounds.y + zone.bounds.height) / tileSize));
      
      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          if (y >= 0 && y < mapHeight && x >= 0 && x < mapWidth) {
            // Seleccionar tile según el tipo de zona
            let tileAsset: Asset | null = null;
            
            switch (zone.type) {
              case 'food':
              case 'kitchen':
                tileAsset = assetManager.getRandomAssetByType('ground', 'piedra');
                break;
              case 'rest':
              case 'bedroom':
                tileAsset = assetManager.getRandomAssetByType('ground', 'tierra');
                break;
              case 'recreation':
                tileAsset = assetManager.getRandomAssetByType('ground', 'cesped');
                break;
              default:
                tileAsset = assetManager.getRandomAssetByType('ground', 'cesped');
            }
            
            if (tileAsset) {
              tiles[y][x] = tileAsset.id;
            }
          }
        }
      }
    });
    
    setTileMap({
      tiles,
      tileSize,
      width: mapWidth,
      height: mapHeight
    });
    
    console.log(`✅ Mapa inteligente generado: ${mapWidth}x${mapHeight}`);
  }, [width, height, assetsLoaded, organicZones]);

  // Generar objetos del juego
  const generateGameObjects = useCallback(() => {
    if (!assetsLoaded || organicMapElements.length === 0) return;
    
    const objects: GameObject[] = [];
    let objectId = 0;
    
    organicMapElements.forEach(element => {
      let asset: Asset | null = null;
      
      // Seleccionar asset según el tipo de elemento
      switch (element.type) {
        case 'food_zone':
          asset = assetManager.getRandomAssetByType('buildings', 'pequeño');
          break;
        case 'rest_zone':
          asset = assetManager.getRandomAssetByType('buildings', 'comercial');
          break;
        case 'play_zone':
          asset = assetManager.getRandomAssetByType('roads', 'horizontal');
          break;
        case 'social_zone':
          asset = assetManager.getRandomAssetByType('buildings', 'grande');
          break;
        case 'obstacle':
          asset = assetManager.getRandomAssetByType('nature', 'arbol_grande');
          break;
        default:
          asset = assetManager.getRandomAssetByType('nature', 'arbol_pequeño');
      }
      
      if (asset) {
        objects.push({
          id: `object_${objectId++}`,
          asset,
          x: element.position.x,
          y: element.position.y
        });
      }
    });
    
    setGameObjects(objects);
    console.log(`✅ Generados ${objects.length} objetos del juego`);
  }, [assetsLoaded, organicMapElements]);

  // Ejecutar generaciones cuando sea necesario
  useEffect(() => {
    generateSmartTileMap();
  }, [generateSmartTileMap]);

  useEffect(() => {
    generateGameObjects();
  }, [generateGameObjects]);

  // Función de renderizado principal
  const renderProfessionalScene = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!assetsLoaded || !tileMap) return;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(panX, panY);
    
    // Renderizar tilemap
    for (let y = 0; y < tileMap.height; y++) {
      for (let x = 0; x < tileMap.width; x++) {
        const tileId = tileMap.tiles[y][x];
        const asset = assetManager.getAssetById(tileId);
        
        if (asset?.image) {
          ctx.drawImage(
            asset.image,
            x * tileMap.tileSize,
            y * tileMap.tileSize,
            tileMap.tileSize,
            tileMap.tileSize
          );
        }
      }
    }
    
    // Renderizar zonas orgánicas como fondos sutiles
    organicZones.forEach(zone => {
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = zone.color;
      ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
      ctx.globalAlpha = 1.0;
    });
    
    // Renderizar objetos del juego
    gameObjects.forEach(obj => {
      if (obj.asset.image) {
        ctx.drawImage(
          obj.asset.image,
          obj.x,
          obj.y,
          obj.asset.size,
          obj.asset.size
        );
      }
    });
    
    // Renderizar entidades
    if (gameState.entities) {
      gameState.entities.forEach(entity => {
        renderTopDownEntity(ctx, entity);
      });
    }
    
    // Aplicar efectos de día/noche
    const lightIntensity = getLightIntensity();
    if (lightIntensity < 1.0) {
      // Overlay de oscuridad para la noche
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = `rgba(100, 150, 255, ${1 - lightIntensity})`;
      ctx.fillRect(-panX, -panY, width / zoom, height / zoom);
      
      // Overlay cálido para el atardecer/amanecer
      if (phase === 'dusk' || phase === 'dawn') {
        ctx.globalCompositeOperation = 'overlay';
        const warmth = phase === 'dusk' ? 0.3 : 0.2;
        ctx.fillStyle = `rgba(255, 150, 100, ${warmth})`;
        ctx.fillRect(-panX, -panY, width / zoom, height / zoom);
      }
      
      ctx.globalCompositeOperation = 'source-over';
    }
    
    ctx.restore();
  }, [assetsLoaded, tileMap, gameObjects, gameState.entities, organicZones, width, height, zoom, panX, panY, getLightIntensity, phase]);

  // Función de renderizado de entidades
  const renderTopDownEntity = useCallback((ctx: CanvasRenderingContext2D, entity: Entity) => {
    if (!entity.position) return;

    const x = entity.position.x;
    const y = entity.position.y;
    const size = 24;

    // Círculo de sombra
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + 2, y + size - 2, size / 2, size / 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Entidad principal
    ctx.fillStyle = entity.id === 'circle' ? '#FF6B6B' : '#4ECDC4';
    ctx.beginPath();
    if (entity.id === 'circle') {
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
    } else {
      ctx.roundRect(x - size / 2, y - size / 2, size, size, 4);
    }
    ctx.fill();

    // Indicador de actividad
    if (entity.activity) {
      const activityColor = getActivityColor(entity.activity);
      ctx.fillStyle = activityColor;
      ctx.beginPath();
      ctx.arc(x + size / 3, y - size / 3, 6, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Indicador de estado de ánimo
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFF';
    ctx.fillText(getMoodEmoji(entity.mood), x, y + 4);
  }, []);

  // Loop de animación
  useEffect(() => {
    if (!assetsLoaded) return;

    const animate = () => {
      if (!shouldRender || !canvasRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        renderProfessionalScene(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [assetsLoaded, shouldRender, renderProfessionalScene]);

  // Manejo de clics
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onEntityClick || !gameState.entities) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (event.clientX - rect.left) / zoom - panX;
    const y = (event.clientY - rect.top) / zoom - panY;

    for (const entity of gameState.entities) {
      if (!entity.position) continue;
      
      const distance = Math.sqrt(
        Math.pow(x - entity.position.x, 2) + 
        Math.pow(y - entity.position.y, 2)
      );
      
      if (distance <= 24) {
        onEntityClick(entity);
        break;
      }
    }
  }, [gameState.entities, onEntityClick, zoom, panX, panY]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        style={{ 
          cursor: onEntityClick ? 'pointer' : 'default',
          background: getSkyColor(),
          display: 'block',
          width: '100%',
          height: '100%',
          transition: 'background-color 2s ease'
        }}
      />
      
      {/* Loading indicator */}
      {!assetsLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div>Cargando assets... {loadingProgress}%</div>
          <div style={{
            width: '200px',
            height: '10px',
            background: '#333',
            borderRadius: '5px',
            marginTop: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${loadingProgress}%`,
              height: '100%',
              background: '#4ECDC4',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}
      
      {/* Debug info */}
      {assetsLoaded && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(45, 90, 39, 0.8)',
          color: '#f0f8e8',
          padding: '8px 12px',
          borderRadius: '5px',
          fontSize: '12px',
          fontFamily: 'monospace',
          border: '1px solid #8B4513'
        }}>
          🎨 Assets: {assetManager.getStats().totalLoaded} | Objetos: {gameObjects.length}
        </div>
      )}
      
      {/* Reloj de día y noche */}
      {assetsLoaded && (
        <DayNightClock 
          position="top-right" 
          size="medium" 
          showPhase={true}
        />
      )}
    </div>
  );
};

// Funciones auxiliares
function getActivityColor(activity: string): string {
  const colors: Record<string, string> = {
    WANDERING: '#FFD93D',
    RESTING: '#6BCF7F',
    SOCIALIZING: '#FF6B9D',
    MEDITATING: '#9B59B6',
    WRITING: '#3498DB',
    EXPLORING: '#E67E22',
    CONTEMPLATING: '#8E44AD',
    DANCING: '#E91E63',
    HIDING: '#95A5A6',
    WORKING: '#F39C12',
    SHOPPING: '#27AE60',
    EXERCISING: '#E74C3C',
    COOKING: '#FF9F43'
  };
  return colors[activity] || '#BDC3C7';
}

function getMoodEmoji(mood: string): string {
  const emojis: Record<string, string> = {
    happy: '😊',
    excited: '🤩', 
    content: '😌',
    calm: '😇',
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    bored: '😑',
    lonely: '😔',
    tired: '😴'
  };
  return emojis[mood.toLowerCase()] || '😐';
}

export default ProfessionalTopDownCanvas;