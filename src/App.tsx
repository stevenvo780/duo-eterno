import React, { useState } from 'react';
import './App.css';
import { GameProvider } from './state/GameContext';
import ProfessionalTopDownCanvas from './components/ProfessionalTopDownCanvas';
import UIControls from './components/UIControls';
import DialogOverlay from './components/DialogOverlay';
import EntityDialogueSystem from './components/EntityDialogueSystem';
import { useGameLoop } from './hooks/useGameLoop';
import { useDialogueSystem } from './hooks/useDialogueSystem';
import { useZoneEffects } from './hooks/useZoneEffects';
import { useEntityMovementOptimized } from './hooks/useEntityMovementOptimized';
import { gameConfig } from './config/gameConfig';
import { logGeneralCompat as logGeneral } from './utils/optimizedDynamicsLogger';

const GameContent: React.FC = React.memo(() => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
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
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
