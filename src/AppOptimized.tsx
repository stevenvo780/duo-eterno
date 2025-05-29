import React, { useState, memo } from 'react';
import './App.css';
import { GameProvider } from './state/GameContext';
import CanvasOptimized from './components/CanvasOptimized';
import DialogOverlay from './components/DialogOverlay';
import UIControls from './components/UIControls';
import PerformanceOverlay from './components/PerformanceOverlay';
import { useGameClockOptimized } from './hooks/useGameClockOptimized';
import { useEntityMovementOptimized } from './hooks/useEntityMovementOptimized';
import { useDialogueSystem } from './hooks/useDialogueSystem';
import { useAutopoiesisOptimized } from './hooks/useAutopoiesisOptimized';
import { useZoneEffectsOptimized } from './hooks/useZoneEffectsOptimized';

// Memoized game content component for better performance
const GameContent: React.FC = memo(() => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [showPerformance, setShowPerformance] = useState<boolean>(false);
  
  // Use optimized hooks
  useGameClockOptimized();
  useEntityMovementOptimized();
  useDialogueSystem();
  useAutopoiesisOptimized();
  useZoneEffectsOptimized();

  const handleEntityClick = React.useCallback((entityId: string) => {
    setSelectedEntityId(entityId);
  }, []);

  const handleEntitySelect = React.useCallback((entityId: string | null) => {
    setSelectedEntityId(entityId);
  }, []);

  // Toggle performance overlay with 'P' key
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'p' || event.key === 'P') {
        setShowPerformance(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
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
        padding: '20px',
        position: 'relative'
      }}>
        <CanvasOptimized 
          width={800} 
          height={600} 
          onEntityClick={handleEntityClick}
        />
        <DialogOverlay />
        <PerformanceOverlay enabled={showPerformance} />
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
