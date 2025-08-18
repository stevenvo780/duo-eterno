import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useGame } from '../hooks/useGame';
import { useRenderer } from '../hooks/useRenderer';
import { useDayNightCycle } from '../hooks/useDayNightCycle';
import { DayNightClock } from './DayNightClock';
import { mapRenderer, type Viewport, type SceneData } from '../utils/rendering/MapRenderer';
import { assetManager } from '../utils/modernAssetManager';
import { useAnimationSystem } from '../hooks/useAnimationSystem';
import type { Entity } from '../types';

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
  const fpsCounter = useRef({ frames: 0, lastTime: 0, fps: 60 });
  
  const { shouldRender } = useRenderer();
  const { getSkyColor, getLightIntensity, phase } = useDayNightCycle();
  useAnimationSystem();

  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [rendererInitialized, setRendererInitialized] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // Datos de la escena
  const sceneData: SceneData = useMemo(() => ({
    terrainMap: {
      width: 100,
      height: 100,
      tileSize: 64,
      tiles: [] // Se generará en el renderer
    },
    zones: gameState.zones || [],
    mapElements: gameState.mapElements || [],
    entities: gameState.entities || []
  }), [gameState.zones, gameState.mapElements, gameState.entities]);

  // Viewport calculation
  const viewport: Viewport = useMemo(() => ({
    x: panX,
    y: panY,
    width: width / zoom,
    height: height / zoom,
    zoom
  }), [panX, panY, width, height, zoom]);

  // Cargar assets y inicializar renderer
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      try {
        setLoadingProgress(10);
        console.log('🎨 Iniciando sistema de renderizado profesional...');

        // Precargar carpetas esenciales de assets
        await assetManager.preloadEssentialAssetsByFolders([
          'terrain_tiles',
          'structures', 
          'natural_elements',
          'water',
          'furniture_objects',
          'environmental_objects'
        ]);
        
        if (!isMounted) return;
        setLoadingProgress(60);

        // Precargar assets esenciales adicionales
        await assetManager.preloadEssentialAssets();
        
        if (!isMounted) return;
        setLoadingProgress(80);

        // Inicializar el renderer con datos de la escena
        await mapRenderer.initialize(sceneData);
        
        if (!isMounted) return;
        setLoadingProgress(95);

        console.log('✅ Sistema de renderizado profesional inicializado:', assetManager.getStats());
        setLoadingProgress(100);
        setAssetsLoaded(true);
        setRendererInitialized(true);
        
      } catch (error) {
        console.error('❌ Error inicializando sistema de renderizado:', error);
        if (isMounted) {
          setAssetsLoaded(true); // Continuar con modo fallback
        }
      }
    };

    initialize();
    
    return () => {
      isMounted = false;
    };
  }, [sceneData]);

  // Función de renderizado principal usando el nuevo sistema
  const renderScene = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!assetsLoaded || !rendererInitialized) {
        // Renderizado de fallback mientras se carga
        ctx.fillStyle = getSkyColor();
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.font = '18px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(
          `Inicializando sistema profesional... ${loadingProgress}%`,
          width / 2,
          height / 2
        );
        ctx.textAlign = 'left';
        return;
      }

      // Usar el nuevo sistema de renderizado profesional
      mapRenderer.render(
        ctx,
        viewport,
        sceneData,
        getLightIntensity(),
        getSkyColor()
      );
    },
    [assetsLoaded, rendererInitialized, viewport, sceneData, getLightIntensity, getSkyColor, loadingProgress, width, height]
  );

  // Contador de FPS y optimización automática
  const updateFPS = useCallback(() => {
    const now = performance.now();
    fpsCounter.current.frames++;
    
    if (now - fpsCounter.current.lastTime >= 1000) {
      fpsCounter.current.fps = fpsCounter.current.frames;
      fpsCounter.current.frames = 0;
      fpsCounter.current.lastTime = now;
      
      // Optimización automática de calidad basada en rendimiento
      if (rendererInitialized) {
        mapRenderer.adjustQuality(fpsCounter.current.fps);
      }
    }
  }, [rendererInitialized]);

  // Loop de animación mejorado
  useEffect(() => {
    const animate = () => {
      if (shouldRender() && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          renderScene(ctx);
          updateFPS();
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
  }, [assetsLoaded, shouldRender, renderScene, updateFPS]);

  // Manejadores de eventos
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onEntityClick || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoom + panX;
    const clickY = (e.clientY - rect.top) / zoom + panY;
    
    // Buscar entidad clickeada
    const clickedEntity = sceneData.entities.find(entity => {
      const distance = Math.sqrt(
        Math.pow(clickX - entity.position.x, 2) + 
        Math.pow(clickY - entity.position.y, 2)
      );
      return distance < 30; // Radio de click
    });
    
    if (clickedEntity) {
      onEntityClick(clickedEntity);
    }
  }, [onEntityClick, zoom, panX, panY, sceneData.entities]);

  const toggleDebugMode = useCallback(() => {
    setDebugMode(!debugMode);
    mapRenderer.toggleDebugMode();
  }, [debugMode]);

  // Renderizado de pantalla de carga
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
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎨</div>
        <div style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Sistema de Renderizado Profesional
        </div>
        <div style={{ fontSize: '1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
          Cargando assets y configurando tiles...
        </div>
        <div style={{ 
          width: '300px', 
          height: '12px', 
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00ff88, #00cc66)',
            borderRadius: '6px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(0,255,136,0.5)'
          }} />
        </div>
        <div style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.8 }}>
          {loadingProgress}% completado
        </div>
        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6 }}>
          {loadingProgress < 60 ? 'Cargando assets...' : 
           loadingProgress < 80 ? 'Inicializando terreno...' : 
           loadingProgress < 95 ? 'Generando objetos...' : 'Finalizando...'}
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
          imageRendering: 'pixelated',
          cursor: onEntityClick ? 'pointer' : 'default'
        }}
        onClick={handleCanvasClick}
      />
      
      {/* Overlay con información de assets y rendimiento */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div>🎨 Assets: {assetManager.getStats().totalLoaded}</div>
        <div>🏗️ Objetos: {sceneData.mapElements.length}</div>
        <div>📊 FPS: {fpsCounter.current.fps}</div>
        <div>🎛️ Zoom: {zoom.toFixed(1)}x</div>
        <div>📍 Pos: {Math.round(panX)}, {Math.round(panY)}</div>
      </div>

      {/* Controles de debug */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        display: 'flex',
        gap: '5px'
      }}>
        <button
          onClick={toggleDebugMode}
          style={{
            padding: '8px 12px',
            background: debugMode ? 'rgba(255,0,0,0.8)' : 'rgba(0,0,0,0.8)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '4px',
            fontSize: '11px',
            cursor: 'pointer',
            fontFamily: 'monospace'
          }}
        >
          🐛 {debugMode ? 'Debug ON' : 'Debug OFF'}
        </button>
      </div>

      {/* Reloj día/noche */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px'
      }}>
        <DayNightClock />
      </div>
      
      {/* Indicador de fase del día */}
      <div style={{
        position: 'absolute',
        top: '70px',
        left: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '15px',
        fontSize: '12px',
        fontFamily: 'system-ui'
      }}>
        {phase === 'dawn' && '🌅'} 
        {phase === 'day' && '☀️'} 
        {phase === 'dusk' && '🌇'} 
        {phase === 'night' && '🌙'} 
        {phase}
      </div>
    </div>
  );
};

export default ProfessionalTopDownCanvas;
