import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useGame } from '../hooks/useGame';
import { useRenderer } from '../hooks/useRenderer';
import { useDayNightCycle } from '../hooks/useDayNightCycle';
import { DayNightClock } from './DayNightClock';
import { assetManager, type Asset } from '../utils/assetManager';
import { spriteAnimationManager } from '../utils/spriteAnimationManager';
import AnimatedEntity from './AnimatedEntity';
import { useAnimationSystem } from '../hooks/useAnimationSystem';
import {
  generateAdvancedTerrain,
  type TerrainGenerationResult
} from '../utils/advancedTerrainGeneration';
import type { Entity, Zone, MapElement } from '../types';

interface GameObject {
  id: string;
  asset: Asset;
  x: number;
  y: number;
  shadow?: Asset;
  metadata?: {
    rotation?: number;
    flipX?: boolean;
    weathering?: number;
    naturalVariation?: boolean;
  };
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
  const { getSkyColor, getLightIntensity, phase } = useDayNightCycle();
  const {} = useAnimationSystem();

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [terrainResult, setTerrainResult] = useState<TerrainGenerationResult | null>(null);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);

  // Usar zones y mapElements directamente del GameContext
  const zones = useMemo(() => gameState.zones || [], [gameState.zones]);
  const mapElements = useMemo(() => gameState.mapElements || [], [gameState.mapElements]);

  // Cargar assets esenciales
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoadingProgress(10);
        console.log('🎨 Iniciando carga de assets...');

        // Precargar assets esenciales tradicionales
        await assetManager.preloadEssentialAssets();
        setLoadingProgress(30);

        // Cargar assets dinámicos por carpetas actualizadas
        await assetManager.preloadEssentialAssetsByFolders([
          'terrain_tiles', 'structures', 'natural_elements', 'infrastructure', 'water', 'environmental_objects', 'ui_icons'
        ]);
        setLoadingProgress(60);

        // Cargar assets adicionales por categorías actualizadas
        await Promise.all([
          assetManager.loadAssetsByCategory('TERRAIN_TILES'),
          assetManager.loadAssetsByCategory('STRUCTURES'),
          assetManager.loadAssetsByCategory('NATURAL_ELEMENTS'),
          assetManager.loadAssetsByCategory('INFRASTRUCTURE'),
          assetManager.loadAssetsByCategory('WATER')
        ]);
        setLoadingProgress(80);

        // Precargar animaciones de entidades
        await spriteAnimationManager.preloadEntityAssets('circulo');
        await spriteAnimationManager.preloadEntityAssets('square');
        setLoadingProgress(90);

        const stats = assetManager.getStats();
        const animStats = spriteAnimationManager.getLoadedAssets();
        console.log('✅ Assets cargados:', stats);
        console.log('✅ Animaciones cargadas:', animStats);

        setLoadingProgress(100);
        setAssetsLoaded(true);

        // Assets cargados exitosamente
      } catch (error) {
        console.error('❌ Error cargando assets:', error);
      }
    };

    loadAssets();
  }, []);

  // El mapa ya se genera en el GameContext, no necesitamos regenerarlo aquí

  // Generar tilemap dinámico usando el sistema avanzado
  const generateAdvancedTileMap = useCallback(() => {
    if (!assetsLoaded) return;

    console.log('🌍 Generando mapa avanzado con terreno procedural...');

    try {
      // Generar terreno usando el nuevo sistema
      const result = generateAdvancedTerrain(width, height, Date.now(), {
        tileSize: 32,
        detailLevel: 1,
        biomeBlendRadius: 3
      });

      setTerrainResult(result);
      console.log('✅ Terreno avanzado generado:', result.metadata);
    } catch (error) {
      console.error('❌ Error generando terreno avanzado:', error);
      // Fallback al sistema básico
      console.log('🔄 Usando sistema de fallback...');
    }
  }, [width, height, assetsLoaded]);

  // Generar objetos del juego
  const generateGameObjects = useCallback(async () => {
    if (!assetsLoaded || mapElements.length === 0) return;

    const objects: GameObject[] = [];
    let objectId = 0;

    // Intentar cargar muebles reales primero
    try {
      await assetManager.loadAssetsByCategory('FURNITURE_OBJECTS');
    } catch {
      console.warn('⚠️ No se pudieron cargar muebles, usando assets básicos');
    }

    mapElements.forEach((element: MapElement) => {
      let asset: Asset | null = null;

      // Seleccionar asset según el tipo de elemento, priorizando muebles reales
      switch (element.type) {
        case 'food_zone':
          // Intentar usar muebles de cocina primero
          asset =
            assetManager.getRandomAssetByType('kitchen') ||
            assetManager.getRandomAssetByType('structures', 'houses');
          break;
        case 'rest_zone':
          // Usar muebles de dormitorio
          asset =
            assetManager.getRandomAssetByType('bedroom') ||
            assetManager.getRandomAssetByType('structures', 'houses');
          break;
        case 'play_zone':
        case 'decoration':
          // Usar decoraciones y entretenimiento
          asset =
            assetManager.getRandomAssetByType('entertainment') ||
            assetManager.getRandomAssetByType('decoration') ||
            assetManager.getRandomAssetByType('infrastructure', 'paths');
          break;
        case 'social_zone':
          // Usar muebles de sala
          asset =
            assetManager.getRandomAssetByType('seating') ||
            assetManager.getRandomAssetByType('tables') ||
            assetManager.getRandomAssetByType('structures', 'houses');
          break;
        case 'work_zone':
          // Usar muebles de oficina
          asset =
            assetManager.getRandomAssetByType('office') ||
            assetManager.getRandomAssetByType('structures', 'houses');
          break;
        case 'comfort_zone':
          // Usar muebles de baño
          asset =
            assetManager.getRandomAssetByType('bathroom') ||
            assetManager.getRandomAssetByType('structures', 'houses');
          break;
        case 'obstacle':
          asset =
            assetManager.getRandomAssetByType('natural_elements', 'trees');
          break;
        default:
          asset =
            assetManager.getRandomAssetByType('natural_elements', 'trees');
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
    console.log(`✅ Generados ${objects.length} objetos del juego (incluyendo muebles reales)`);
  }, [assetsLoaded, mapElements]);

  // Ejecutar generaciones cuando sea necesario
  useEffect(() => {
    generateAdvancedTileMap();
  }, [generateAdvancedTileMap]);

  useEffect(() => {
    generateGameObjects();
  }, [generateGameObjects]);

  // Función de renderizado principal
  const renderProfessionalScene = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!assetsLoaded || !terrainResult) return;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.scale(zoom, zoom);
      ctx.translate(panX, panY);

      // Renderizar tilemap avanzado con variaciones
      const tileMap = terrainResult.tileMap;
      for (let y = 0; y < tileMap.height; y++) {
        for (let x = 0; x < tileMap.width; x++) {
          const tileData = tileMap.tiles[y][x];
          const asset = assetManager.getAssetById(tileData.textureId);

          if (asset?.image) {
            ctx.save();

            // Aplicar transformaciones del tile
            const centerX = x * tileMap.tileSize + tileMap.tileSize / 2;
            const centerY = y * tileMap.tileSize + tileMap.tileSize / 2;

            ctx.translate(centerX, centerY);
            if (tileData.rotation) ctx.rotate((tileData.rotation * Math.PI) / 180);

            // Aplicar tint y variaciones de color
            ctx.fillStyle = tileData.tint;
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillRect(
              -tileMap.tileSize / 2,
              -tileMap.tileSize / 2,
              tileMap.tileSize,
              tileMap.tileSize
            );
            ctx.globalCompositeOperation = 'source-over';

            // Dibujar el tile
            ctx.drawImage(
              asset.image,
              -tileMap.tileSize / 2,
              -tileMap.tileSize / 2,
              tileMap.tileSize,
              tileMap.tileSize
            );

            ctx.restore();
          }
        }
      }

      // Renderizar zonas como fondos sutiles
      zones.forEach((zone: Zone) => {
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.bounds.x, zone.bounds.y, zone.bounds.width, zone.bounds.height);
        ctx.globalAlpha = 1.0;

        // Renderizar nombre de la zona con mejor tipografía
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText(zone.name, zone.bounds.x + 8, zone.bounds.y + 18);
      });

      // Renderizar objetos del terreno (generados proceduralmente)
      terrainResult.objects.forEach(obj => {
        // Renderizar objetos con colores simples por ahora
        if (obj.type === 'obstacle') {
          ctx.save();

          // Aplicar variaciones si existen
          if (obj.metadata?.rotation) {
            ctx.translate(
              obj.position.x + obj.size.width / 2,
              obj.position.y + obj.size.height / 2
            );
            ctx.rotate((obj.metadata.rotation * Math.PI) / 180);
            ctx.translate(-obj.size.width / 2, -obj.size.height / 2);
          }

          if (obj.metadata?.flipX) {
            ctx.scale(-1, 1);
          }

          // Sombra simple bajo el obstáculo
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.beginPath();
          ctx.ellipse(
            obj.position.x + obj.size.width / 2,
            obj.position.y + obj.size.height - 2,
            obj.size.width / 2,
            obj.size.height / 6,
            0,
            0,
            2 * Math.PI
          );
          ctx.fill();
          ctx.globalAlpha = 1.0;

          // Dibujar un rectángulo simple como placeholder para obstáculos
          ctx.fillStyle = obj.color || '#8B4513';
          ctx.fillRect(
            obj.metadata?.rotation ? 0 : obj.position.x,
            obj.metadata?.rotation ? 0 : obj.position.y,
            obj.size.width,
            obj.size.height
          );

          ctx.restore();
          return;
        }

        // Para senderos y detalles, dibujar formas suaves con el color definido
        const metadata = obj.metadata as Record<string, unknown> | undefined;
        const isPath = Boolean(
          metadata && 
          typeof metadata.isPath === 'boolean' && 
          metadata.isPath
        );
        const isDetail = Boolean(
          metadata && 
          typeof metadata.isDetail === 'boolean' && 
          metadata.isDetail
        );

        ctx.save();
        ctx.fillStyle = obj.color || (isPath ? '#8B7355' : '#64748b');
        ctx.globalAlpha = isPath ? 0.9 : 0.85;

        if (isPath) {
          // Sendero: manchas orgánicas redondeadas
          ctx.beginPath();
          ctx.ellipse(
            obj.position.x,
            obj.position.y,
            Math.max(3, obj.size.width / 2),
            Math.max(2, obj.size.height / 2),
            0,
            0,
            2 * Math.PI
          );
          ctx.fill();
        } else if (isDetail || obj.type === 'decoration') {
          // Detalle/Decoración: pequeñas motas/hojas/piedritas
          ctx.beginPath();
          ctx.arc(obj.position.x, obj.position.y, Math.max(1.5, obj.size.width / 4), 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.restore();
      });

      // Renderizar objetos del juego tradicionales
      gameObjects.forEach(obj => {
        if (obj.asset.image) {
          ctx.save();

          // Aplicar variaciones naturales si existen
          if (obj.metadata?.rotation) {
            ctx.translate(obj.x + obj.asset.size / 2, obj.y + obj.asset.size / 2);
            ctx.rotate((obj.metadata.rotation * Math.PI) / 180);
            ctx.translate(-obj.asset.size / 2, -obj.asset.size / 2);
            ctx.drawImage(obj.asset.image, 0, 0, obj.asset.size, obj.asset.size);
          } else {
            ctx.drawImage(obj.asset.image, obj.x, obj.y, obj.asset.size, obj.asset.size);
          }

          ctx.restore();
        }
      });

      // NOTA: Las entidades ahora se renderizan como overlay animado, no en el canvas

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
    },
    [
      assetsLoaded,
      terrainResult,
      gameObjects,
      zones,
      width,
      height,
      zoom,
      panX,
      panY,
      getLightIntensity,
      phase
    ]
  );

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
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!onEntityClick || !gameState.entities) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (event.clientX - rect.left) / zoom - panX;
      const y = (event.clientY - rect.top) / zoom - panY;

      for (const entity of gameState.entities) {
        if (!entity.position) continue;

        const distance = Math.sqrt(
          Math.pow(x - entity.position.x, 2) + Math.pow(y - entity.position.y, 2)
        );

        if (distance <= 24) {
          onEntityClick(entity);
          break;
        }
      }
    },
    [gameState.entities, onEntityClick, zoom, panX, panY]
  );

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

      {/* Entidades animadas renderizadas como overlay */}
      {assetsLoaded && gameState.entities && gameState.entities.map((entity: Entity) => (
        <AnimatedEntity
          key={entity.id}
          entity={entity}
          size={48} // Tamaño más grande para mejor visibilidad de las animaciones
          showMoodIndicator={true}
          showActivityIndicator={true}
          onClick={() => onEntityClick?.(entity)}
        />
      ))}

      {/* Loading indicator */}
      {!assetsLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}
        >
          <div>Cargando assets y animaciones... {loadingProgress}%</div>
          <div
            style={{
              width: '200px',
              height: '10px',
              background: '#333',
              borderRadius: '5px',
              marginTop: '10px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: '#4ECDC4',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      )}

      {/* Debug info mejorado */}
      {assetsLoaded && (
        <div
          style={{
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
          }}
        >
          🎨 Assets: {assetManager.getStats().totalLoaded} | 🎬 Animaciones: {spriteAnimationManager.getLoadedAssets().animations} | Objetos: {gameObjects.length}
        </div>
      )}

      {/* Reloj de día y noche */}
      {assetsLoaded && <DayNightClock position="top-right" size="medium" showPhase={true} />}
    </div>
  );
};

export default ProfessionalTopDownCanvas;
