import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { useGame } from '../hooks/useGame';
import { useRenderer } from '../hooks/useRenderer';
import { useDayNightCycle } from '../hooks/useDayNightCycle';
import { mapRenderer, type Viewport, type SceneData } from '../utils/rendering/MapRenderer';
import { assetManager } from '../utils/modernAssetManager';
import { entityAnimationRenderer } from '../utils/rendering/EntityAnimationRenderer';
import { useAnimationSystem } from '../hooks/useAnimationSystem';
import { createDefaultZones, createDefaultMapElements } from '../utils/mapGeneration';
import type { Entity } from '../types';
import { TelemetryDebugPanel } from './TelemetryDebugPanel'; // F4: Add telemetry panel

interface Props {
  width: number;
  height: number;
  zoom: number;
  panX: number;
  panY: number;
  onEntityClick?: (entity: Entity) => void;
}

const GameCanvas = React.forwardRef<HTMLCanvasElement, Props>(({
  width,
  height,
  zoom,
  panX,
  panY,
  onEntityClick
}, ref) => {
  const { gameState, dispatch } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const fpsCounter = useRef({ frames: 0, lastTime: 0, fps: 60 });
  
  const { shouldRender } = useRenderer();
  const { getSkyColor, getLightIntensity, phase, currentTime } = useDayNightCycle();
  useAnimationSystem();

  const [assetsLoaded, setAssetsLoaded] = useState(true); // TEMPORAL: forzar assetsLoaded para debug
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [rendererInitialized, setRendererInitialized] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const initializationStarted = useRef(false);

  // Datos de la escena: memo para evitar renders innecesarios
  const sceneData: SceneData = useMemo(() => ({
    terrainTiles: gameState.terrainTiles || [], // F3: Use unified terrain data
    roads: gameState.roads || [], // F3: Include roads
    zones: gameState.zones || [],
    mapElements: gameState.mapElements || [],
    entities: gameState.entities || [],
    worldSize: gameState.worldSize || { width: 2000, height: 1500 } // F3: Dynamic world size
  }), [gameState.terrainTiles, gameState.roads, gameState.zones, gameState.mapElements, gameState.entities, gameState.worldSize]);

  const viewport: Viewport = useMemo(() => ({
    x: panX,
    y: panY,
    width: width / zoom,
    height: height / zoom,
    zoom
  }), [panX, panY, width, height, zoom]);

  useEffect(() => {
    console.log('🎬 GameCanvas: useEffect iniciando, initializationStarted:', initializationStarted.current);
    if (initializationStarted.current) return; // Evita reiniciar carga
    initializationStarted.current = true;
    
    const initializeEverything = async () => {
      try {
        // Paso 1: Cargar assets
        setLoadingProgress(10);
        console.log('🎨 Iniciando carga de assets...');

        await assetManager.preloadEssentialAssetsByFolders([
          'terrain_tiles',
          'structures', 
          'natural_elements',
          'water',
          'furniture_objects',
          'environmental_objects'
        ]);
        
        setLoadingProgress(40);
        console.log('🎯 Assets por carpetas completados, iniciando precarga adicional...');

        await assetManager.preloadEssentialAssets();
        
        setLoadingProgress(60);
        console.log('🎯 Precarga adicional completada, precargando animaciones...');

        await entityAnimationRenderer.preloadCommonAnimations();

        setLoadingProgress(70);
        console.log('🎭 Animaciones precargadas, marcando assets como cargados...');
        console.log('✅ Assets cargados:', assetManager.getStats());
        setAssetsLoaded(true);
        
        // Paso 2: Inicializar renderer
        setLoadingProgress(80);
        console.log('� GameCanvas: Inicializando renderer...');
        
        let zones = gameState.zones;
        let mapElements = gameState.mapElements;
        
        if (zones.length === 0) {
          console.log('🏗️ GameCanvas: Generando zonas por defecto...');
          zones = createDefaultZones();
          mapElements = createDefaultMapElements();
          
          setTimeout(() => {
            dispatch({ type: 'GENERATE_NEW_MAP', payload: { seed: gameState.mapSeed } });
          }, 100);
        }
        
        const initialData: SceneData = {
          terrainTiles: gameState.terrainTiles || [], // F3: Use actual terrain tiles from unified generation
          roads: [], // F3: Start with empty roads
          zones,
          mapElements,
          entities: gameState.entities,
          worldSize: { width: 2000, height: 1500 } // F3: Dynamic world size
        };
        
        console.log('🎯 GameCanvas: Inicializando mapRenderer con datos:', {
          terrainTiles: initialData.terrainTiles.length,
          zones: initialData.zones.length,
          mapElements: initialData.mapElements.length,
          entities: initialData.entities.length
        });
        
        await mapRenderer.initialize(initialData);
        
        setLoadingProgress(100);
        setRendererInitialized(true);
        console.log('✅ GameCanvas: Renderer inicializado correctamente');
        
      } catch (error) {
        console.error('❌ Error en inicialización:', error);
        // Forzar inicialización en caso de error para evitar pantalla de carga infinita
        setAssetsLoaded(true);
        setRendererInitialized(true);
      }
    };

    initializeEverything();
  }, []); // ✅ VACÍO - solo ejecuta UNA VEZ al montar el componente

  const renderScene = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!rendererInitialized) {
        console.log('🎬 GameCanvas.renderScene: renderer no inicializado, mostrando pantalla de carga');
        ctx.fillStyle = getSkyColor();
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.font = '18px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(
          `Inicializando sistema de renderizado... ${loadingProgress}%`,
          width / 2,
          height / 2
        );
        ctx.textAlign = 'left';
        return;
      }

      // console.log('🎨 GameCanvas.renderScene: renderizando mapa completo'); // Comentado para reducir spam de logs
      ctx.save();
      ctx.scale(zoom, zoom);
      ctx.translate(-panX, -panY);
      
      mapRenderer.render(
        ctx,
        viewport,
        sceneData,
        getLightIntensity(),
        getSkyColor()
      );
      
      ctx.restore();
    },
    [rendererInitialized, viewport, sceneData, getLightIntensity, getSkyColor, loadingProgress, width, height, zoom, panX, panY]
  );

  const updateFPS = useCallback(() => {
    const now = performance.now();
    fpsCounter.current.frames++;
    
    if (now - fpsCounter.current.lastTime >= 1000) {
      fpsCounter.current.fps = fpsCounter.current.frames;
      fpsCounter.current.frames = 0;
      fpsCounter.current.lastTime = now;
      
      if (rendererInitialized) {
        mapRenderer.adjustQuality(fpsCounter.current.fps);
      }
    }
  }, [rendererInitialized]);

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

    // Comenzar animación inmediatamente - renderScene manejará los estados internamente
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [assetsLoaded, rendererInitialized]); // ✅ Solo estados, no funciones

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onEntityClick || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / zoom + panX;
    const clickY = (e.clientY - rect.top) / zoom + panY;
    
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

  if (!rendererInitialized) {
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
          Inicializando Renderer
        </div>
        <div style={{ fontSize: '1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
          Configurando sistema de renderizado...
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
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas
        ref={(node) => {
          canvasRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        width={width}
        height={height}
        style={{
          display: 'block',
          imageRendering: 'pixelated',
          cursor: onEntityClick ? 'pointer' : 'default'
        }}
        onClick={handleCanvasClick}
      />
      
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
        <div>� Tiles: {sceneData.terrainTiles.length}</div>
        <div>📊 FPS: {fpsCounter.current.fps}</div>
        <div>🎛️ Zoom: {zoom.toFixed(1)}x</div>
        <div>📍 Pos: {Math.round(panX)}, {Math.round(panY)}</div>
      </div>

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

      {/* Reloj mejorado */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px',
        borderRadius: '12px',
        fontSize: '14px',
        fontFamily: 'monospace',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        minWidth: '100px',
        textAlign: 'center'
      }}>
        {/* Hora digital */}
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '6px',
          color: '#fff'
        }}>
          🕐 {currentTime.hour.toString().padStart(2, '0')}:{currentTime.minute.toString().padStart(2, '0')}
        </div>
        
        {/* Fase del día */}
        <div style={{
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          opacity: 0.9
        }}>
          <span style={{ fontSize: '14px' }}>
            {phase === 'dawn' && '🌅'}
            {phase === 'day' && '☀️'}
            {phase === 'dusk' && '🌇'}
            {phase === 'night' && '🌙'}
          </span>
          <span style={{ textTransform: 'capitalize' }}>{phase}</span>
        </div>
      </div>
      
      {/* F4: Telemetry Debug Panel */}
      <TelemetryDebugPanel />
    </div>
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
