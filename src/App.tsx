import React, { useState } from 'react';
import './App.css';
import { GameProvider } from './state/GameContext';
import Canvas from './components/Canvas';
import UIControls from './components/UIControls';
import DialogOverlay from './components/DialogOverlay';
import PerformanceOverlay from './components/PerformanceOverlay';
import TimeControls from './components/TimeControls';
import MapControls from './components/MapControls';
// import { useUnifiedGameEngine } from './hooks/useUnifiedGameEngine'; // Temporalmente comentado
import { useUltraSimpleMovement } from './hooks/useUltraSimpleMovement';
import { gameConfig } from './config/gameConfig';
import { logGeneral } from './utils/logger';

const GameContent: React.FC = React.memo(() => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [showPerformance, setShowPerformance] = useState<boolean>(gameConfig.debugMode);
  
  // Estado para controles flotantes
  const [showTimeControls, setShowTimeControls] = useState<boolean>(true);
  const [showMapControls, setShowMapControls] = useState<boolean>(true);
  
  // Estado para navegación del mapa
  const [zoom, setZoom] = useState<number>(1);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  
  // Estado para controles de tiempo
  const [gameSpeed, setGameSpeed] = useState<number>(gameConfig.gameSpeedMultiplier);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Hooks del sistema unificado (temporalmente usando ultra-simple para debug)
  // const gameEngine = useUnifiedGameEngine();
  const gameEngine = useUltraSimpleMovement();

  React.useEffect(() => {
    logGeneral.info('Aplicación Dúo Eterno iniciada', { debugMode: gameConfig.debugMode });
  }, []);

  const handleEntityClick = React.useCallback((entityId: string) => {
    setSelectedEntityId(entityId);
  }, []);

  const handleEntitySelect = React.useCallback((entityId: string | null) => {
    setSelectedEntityId(entityId);
  }, []);

  // Funciones para controlar el tiempo del juego
  const handleSpeedChange = React.useCallback((speed: number) => {
    setGameSpeed(speed);
    // También actualizar la configuración global del juego
    gameConfig.gameSpeedMultiplier = speed;
  }, []);

  const handlePauseToggle = React.useCallback(() => {
    setIsPaused(prev => !prev);
    // Pausar/reanudar usando velocidad 0
    gameConfig.gameSpeedMultiplier = isPaused ? gameSpeed : 0;
  }, [isPaused, gameSpeed]);

  const handleReset = React.useCallback(() => {
    // Implementar reset del juego si es necesario
    logGeneral.info('Reset del juego solicitado');
  }, []);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'p') {
        setShowPerformance(prev => !prev);
        logGeneral.debug('Overlay de performance ' + (!showPerformance ? 'activado' : 'desactivado'));
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showPerformance]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f1419',
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderBottom: '2px solid #475569',
        textAlign: 'center'
      }}>
        <h1 style={{
          margin: 0,
          color: '#f1f5f9',
          fontSize: '24px',
          fontWeight: 600,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Dúo Eterno
          {gameConfig.debugMode && (
            <span style={{ fontSize: '12px', marginLeft: '10px', opacity: 0.7 }}>
              🎮 {gameEngine.isActive ? '✅ Activo' : '❌ Inactivo'} | 
              👥 {gameEngine.livingEntities} entidades | 
              🎯 {gameEngine.activeTargets} objetivos |
              ⏱️ Tick #{gameEngine.tickCount}
            </span>
          )}
        </h1>
        <p style={{
          margin: '4px 0 0 0',
          color: '#cbd5e1',
          fontSize: '14px',
          opacity: 0.8
        }}>
          Un Tamagotchi del Vínculo
        </p>
        {gameConfig.debugMode && (
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                console.log('🔧 Estado del motor:', gameEngine);
                console.log(`🎮 Tick: ${gameEngine.tickCount}, Activo: ${gameEngine.isActive}, Entidades: ${gameEngine.livingEntities}, Objetivos: ${gameEngine.activeTargets}`);
              }}
              style={{
                padding: '4px 8px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Debug Info
            </button>
            <button 
              onClick={() => {
                // Mover entidades manualmente para probar
                const entities = ['circle', 'square'];
                entities.forEach(id => {
                  const randomX = 100 + Math.random() * 700;
                  const randomY = 100 + Math.random() * 400;
                  console.log(`🎯 Moviendo ${id} a (${randomX.toFixed(0)}, ${randomY.toFixed(0)})`);
                  window.dispatchEvent(new CustomEvent('forceEntityMove', { 
                    detail: { entityId: id, position: { x: randomX, y: randomY } }
                  }));
                });
              }}
              style={{
                padding: '4px 8px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Forzar Movimiento
            </button>
          </div>
        )}
      </div>

      {/* Main game area */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '20px',
        position: 'relative'
      }}>
        <Canvas 
          width={1000} 
          height={600} 
          onEntityClick={handleEntityClick}
          zoom={zoom}
          panX={panX}
          panY={panY}
        />
        <DialogOverlay />
        <PerformanceOverlay enabled={showPerformance} />
        
        {/* Menú de paneles flotantes */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 1000
        }}>
          {!showTimeControls && (
            <button
              onClick={() => setShowTimeControls(true)}
              style={{
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9',
                padding: '8px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)'
              }}
            >
              ⏱️ Tiempo
            </button>
          )}
          
          {!showMapControls && (
            <button
              onClick={() => setShowMapControls(true)}
              style={{
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9',
                padding: '8px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)'
              }}
            >
              🗺️ Mapa
            </button>
          )}
        </div>
        
        {/* Controles flotantes */}
        {showTimeControls && (
          <TimeControls 
            gameSpeed={gameSpeed}
            isPaused={isPaused}
            onSpeedChange={handleSpeedChange}
            onPauseToggle={handlePauseToggle}
            onReset={handleReset}
            onClose={() => setShowTimeControls(false)}
          />
        )}
        
        {showMapControls && (
          <MapControls
            initialZoom={zoom}
            initialPan={{ x: panX, y: panY }}
            onZoomChange={setZoom}
            onPanChange={(pan) => {
              setPanX(pan.x);
              setPanY(pan.y);
            }}
            onClose={() => setShowMapControls(false)}
          />
        )}
      </div>

      {/* Controls */}
      <UIControls 
        selectedEntityId={selectedEntityId}
        onEntitySelect={handleEntitySelect}
      />
    </div>
  );
});

GameContent.displayName = 'GameContent';

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;