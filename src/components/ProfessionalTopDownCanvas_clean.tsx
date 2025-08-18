import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useGame } from '../hooks/useGame';
import { useRenderer } from '../hooks/useRenderer';
import { useDayNightCycle } from '../hooks/useDayNightCycle';
import { DayNightClock } from './DayNightClock';
import { assetManager, type Asset } from '../utils/assetManager';
import { useAnimationSystem } from '../hooks/useAnimationSystem';
import type { Entity, Zone, MapElement } from '../types';

interface GameObject {
  id: string;
  asset: Asset;
  x: number;
  y: number;
  metadata?: {
    rotation?: number;
    flipX?: boolean;
    naturalVariation?: boolean;
  };
}

interface Props {
  width: number;
  height: number;
  zoom: number;
  panX: number;
  panY: number;
  onEntityClick?: (entity: Entity) => void;
}

const ProfessionalTopDownCanvas: React.FC<Props> = ({
  width,
  height,
  zoom,
  panX,
  panY,
  onEntityClick
}) => {
  const { gameState } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  
  const { shouldRender } = useRenderer();
  const { getSkyColor, getLightIntensity, phase } = useDayNightCycle();
  useAnimationSystem();

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);

  // Usar zones y mapElements directamente del GameContext
  const zones = useMemo(() => gameState.zones || [], [gameState.zones]);
  const mapElements = useMemo(() => gameState.mapElements || [], [gameState.mapElements]);

  // Cargar assets esenciales
  useEffect(() => {
    let isMounted = true;
    
    const loadAssets = async () => {
      try {
        if (!isMounted) return;
        setLoadingProgress(10);
        console.log('🎨 Iniciando carga de assets...');

        // Precargar carpetas esenciales de assets
        await assetManager.preloadEssentialAssetsByFolders([
          'terrain_tiles',
          'structures', 
          'natural_elements',
          'infrastructure',
          'water',
          'environmental_objects',
          'furniture_objects',
          'ui_icons'
        ]);
        
        if (!isMounted) return;
        setLoadingProgress(60);

        // Precargar assets esenciales
        await assetManager.preloadEssentialAssets();
        
        if (!isMounted) return;
        setLoadingProgress(80);

        console.log('✅ Assets cargados:', assetManager.getStats());
        setLoadingProgress(100);
        setAssetsLoaded(true);
      } catch (error) {
        console.error('❌ Error cargando assets:', error);
        if (isMounted) {
          setAssetsLoaded(true);
        }
      }
    };

    loadAssets();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Generar objetos del juego
  const generateGameObjects = useCallback(async () => {
    if (!assetsLoaded || mapElements.length === 0) return;

    const objects: GameObject[] = [];
    let objectId = 0;

    // Precargar assets de muebles
    try {
      await assetManager.loadAssetsByFolderName('furniture_objects');
    } catch {
      console.warn('⚠️ No se pudieron cargar muebles, usando assets básicos');
    }

    mapElements.forEach((element: MapElement) => {
      let asset: Asset | null = null;

      // Seleccionar asset según el tipo de elemento
      switch (element.type) {
        case 'food_zone':
          asset = assetManager.getRandomAssetByType('furniture_objects') ||
                  assetManager.getRandomAssetByType('structures');
          break;
        case 'rest_zone':
          asset = assetManager.getRandomAssetByType('furniture_objects') ||
                  assetManager.getRandomAssetByType('structures');
          break;
        case 'play_zone':
        case 'decoration':
          asset = assetManager.getRandomAssetByType('environmental_objects') ||
                  assetManager.getRandomAssetByType('infrastructure');
          break;
        case 'social_zone':
          asset = assetManager.getRandomAssetByType('environmental_objects') ||
                  assetManager.getRandomAssetByType('furniture_objects');
          break;
        case 'obstacle':
          asset = Math.random() > 0.5 
            ? assetManager.getRandomAssetByType('natural_elements')
            : assetManager.getRandomAssetByType('structures');
          break;
        default:
          asset = assetManager.getRandomAssetByType('environmental_objects');
      }

      if (asset) {
        objects.push({
          id: `obj_${objectId++}`,
          asset: asset,
          x: element.position.x,
          y: element.position.y,
          metadata: {
            rotation: Math.random() * 360,
            naturalVariation: Math.random() > 0.7
          }
        });
      }
    });

    setGameObjects(objects);
    console.log(`✅ Generados ${objects.length} objetos del juego`);
  }, [assetsLoaded, mapElements]);

  useEffect(() => {
    generateGameObjects();
  }, [generateGameObjects]);

  // Función de renderizado principal
  const renderProfessionalScene = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!assetsLoaded) return;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.scale(zoom, zoom);
      ctx.translate(panX, panY);

      // Renderizar fondo simple
      ctx.fillStyle = getSkyColor();
      ctx.fillRect(-panX, -panY, width / zoom, height / zoom);

      // Renderizar zonas como fondos sutiles
      zones.forEach((zone: Zone) => {
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
        ctx.globalAlpha = 1.0;

        // Renderizar nombre de la zona
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText(zone.name, zone.bounds.x + 8, zone.bounds.y + 18);
      });

      // Renderizar objetos del juego
      gameObjects.forEach((obj: GameObject) => {
        if (obj.asset?.image) {
          ctx.save();

          // Aplicar transformaciones
          ctx.translate(obj.x + obj.asset.size / 2, obj.y + obj.asset.size / 2);
          if (obj.metadata?.rotation) {
            ctx.rotate((obj.metadata.rotation * Math.PI) / 180);
          }
          if (obj.metadata?.flipX) {
            ctx.scale(-1, 1);
          }

          // Dibujar el asset
          ctx.drawImage(
            obj.asset.image,
            -obj.asset.size / 2,
            -obj.asset.size / 2,
            obj.asset.size,
            obj.asset.size
          );

          ctx.restore();
        }
      });

      // Aplicar efectos de iluminación
      const lightIntensity = getLightIntensity();
      if (lightIntensity < 1) {
        ctx.globalAlpha = 1 - lightIntensity;
        ctx.fillStyle = phase === 'night' || phase === 'dawn' ? 'rgba(25, 25, 70, 0.6)' : 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(-panX, -panY, width / zoom, height / zoom);
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    },
    [assetsLoaded, zones, gameObjects, zoom, panX, panY, width, height, getSkyColor, getLightIntensity, phase]
  );

  // Loop de animación
  useEffect(() => {
    const animate = () => {
      if (shouldRender() && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          renderProfessionalScene(ctx);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (assetsLoaded) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [assetsLoaded, shouldRender, renderProfessionalScene]);

  if (!assetsLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width, 
        height, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎨</div>
        <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Cargando Assets...</div>
        <div style={{ 
          width: '200px', 
          height: '8px', 
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ff6b9d, #c44569)',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
          {loadingProgress}%
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          display: 'block',
          imageRendering: 'pixelated'
        }}
        onClick={(_e) => {
          // Click handler para futuras implementaciones
          if (onEntityClick) {
            // Implementar detección de entidades en futuras versiones
          }
        }}
      />
      
      {/* Overlay con información de assets */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        🎨 Assets: {assetManager.getStats().totalLoaded} | Objetos: {gameObjects.length}
      </div>

      {/* Reloj día/noche */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px'
      }}>
        <DayNightClock />
      </div>
    </div>
  );
};

export default ProfessionalTopDownCanvas;
