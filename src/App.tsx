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
  

  useGameLoop();
  
  useDialogueSystem();
  useZoneEffects();
  useEntityMovementOptimized();

  React.useEffect(() => {
    logGeneral('Aplicación Dúo Eterno iniciada', { debugMode: gameConfig.debugMode });
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
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          fontFamily: 'serif'
        }}>
          Isa & Stev: Resonancia Cuántica
        </h1>
        <p style={{
          margin: '4px 0 0 0',
          color: '#cbd5e1',
          fontSize: '14px',
          opacity: 0.8,
          fontStyle: 'italic'
        }}>
          Un Experimento en la Física del Amor Eterno
        </p>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '20px',
        position: 'relative'
      }}>
        <ProfessionalTopDownCanvas 
          width={1000} 
          height={600}
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
