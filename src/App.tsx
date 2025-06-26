import React, { useState } from 'react';
import './App.css';
import { GameProvider } from './state/GameContext';
import Canvas from './components/Canvas';
import UIControls from './components/UIControls';
import DialogOverlay from './components/DialogOverlay';
import { useUnifiedGameLoop } from './hooks/useUnifiedGameLoop';
import { useDialogueSystem } from './hooks/useDialogueSystem';
import { useEntityMovementOptimized } from './hooks/useEntityMovementOptimized';
import { gameConfig } from './config/gameConfig';
import { logGeneral } from './utils/logger';

const GameContent: React.FC = React.memo(() => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  
  // Hook unificado que maneja autopoiesis, game clock y movement
  useUnifiedGameLoop();
  
  // Hooks específicos que no están incluidos en el loop unificado
  useDialogueSystem();
  
  // TEMPORAL: Añadir movimiento hasta integrarlo en el loop unificado
  useEntityMovementOptimized();

  React.useEffect(() => {
    logGeneral.info('Aplicación Dúo Eterno iniciada', { debugMode: gameConfig.debugMode });
  }, []);

  const handleEntityClick = React.useCallback((entityId: string) => {
    setSelectedEntityId(entityId);
  }, []);

  const handleEntitySelect = React.useCallback((entityId: string | null) => {
    setSelectedEntityId(entityId);
  }, []);

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
          zoom={1}
          panX={0}
          panY={0}
        />
        <DialogOverlay />
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