import React, { useState } from 'react';
import './App.css';
import { GameProvider } from './state/GameContext';
import ProfessionalTopDownCanvas from './components/ProfessionalTopDownCanvas';
import UIControls from './components/UIControls';
import DialogOverlay from './components/DialogOverlay';
import EntityDialogueSystem from './components/EntityDialogueSystem';
import IntroNarrative from './components/IntroNarrative';
import { SpriteDemoPage } from './components/SpriteDemoPage';
import { useGameLoop } from './hooks/useGameLoop';
import { useDialogueSystem } from './hooks/useDialogueSystem';
import { useZoneEffects } from './hooks/useZoneEffects';
import { useEntityMovementOptimized } from './hooks/useEntityMovementOptimized';
import { gameConfig } from './config/gameConfig';
import { logGeneralCompat as logGeneral } from './utils/optimizedDynamicsLogger';
import type { Entity } from './types';
import { safeLoad, markIntroAsSeen } from './utils/persistence';

type AppMode = 'game' | 'demo';

const GameContent: React.FC = React.memo(() => {
  const [mode, setMode] = useState<AppMode>('game');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  // Mostrar la intro solo si no existe partida guardada O si existe pero no ha visto la intro
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    const savedGame = safeLoad();
    return !savedGame || !savedGame.hasSeenIntro;
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useGameLoop();
  useDialogueSystem();
  useZoneEffects();
  useEntityMovementOptimized();

  React.useEffect(() => {
    logGeneral('Aplicación Dúo Eterno iniciada', { debugMode: gameConfig.debugMode });
  }, []);

  // Manejar redimensionado de ventana
  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEntitySelect = React.useCallback((entity: Entity) => {
    setSelectedEntityId(entity.id);
  }, []);

  const handleEntitySelectString = React.useCallback((entityId: string | null) => {
    setSelectedEntityId(entityId);
  }, []);

  const handleIntroComplete = React.useCallback(() => {
    setShowIntro(false);
    markIntroAsSeen();
  }, []);

  // Si estamos en modo demo, mostrar solo la página de demo
  if (mode === 'demo') {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        {/* Botón para volver al juego */}
        <button
          onClick={() => setMode('game')}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🎮 Volver al Juego
        </button>
        
        <SpriteDemoPage />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0f1419',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {/* Botón para alternar a demo */}
      <button
        onClick={() => setMode('demo')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        🎬 Demo Sprites
      </button>

      {/* Narrativa de introducción */}
      {showIntro && <IntroNarrative onComplete={handleIntroComplete} />}

      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <ProfessionalTopDownCanvas
          width={windowSize.width}
          height={windowSize.height - 80}
          onEntityClick={handleEntitySelect}
        />
        <EntityDialogueSystem />
        <DialogOverlay />
      </div>

      <UIControls
        selectedEntityId={selectedEntityId}
        onEntitySelect={handleEntitySelectString}
        onShowIntro={() => setShowIntro(true)}
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
