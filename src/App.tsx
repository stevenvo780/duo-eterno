import React, { useState } from 'react';
import './App.css';
import { GameProvider } from './state/GameContext';
import Canvas from './components/Canvas';
import UIControls from './components/UIControls';
import DialogOverlay from './components/DialogOverlay';
import PerformanceOverlay from './components/PerformanceOverlay';
import TimeControls from './components/TimeControls';
import MapControls from './components/MapControls';
import { useSimpleGameLoop } from './hooks/useSimpleGameLoop';
import { useSimpleMovement } from './hooks/useSimpleMovement';
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
  
  // Hooks del nuevo sistema simplificado
  useSimpleGameLoop();
  useSimpleMovement();

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
        </h1>
        <p style={{
          margin: '4px 0 0 0',
          color: '#cbd5e1',
          fontSize: '14px',
          opacity: 0.8
        }}>
          Un Tamagotchi del Vínculo
        </p>
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