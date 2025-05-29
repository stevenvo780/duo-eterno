import React, { useState } from 'react';
import { GameProvider } from './state/GameContext';
import Canvas from './components/Canvas';
import UIControls from './components/UIControls';
import DialogOverlay from './components/DialogOverlay';
import { useGameClock } from './hooks/useGameClock';
import { useEntityMovement } from './hooks/useEntityMovement';
import { useDialogueSystem } from './hooks/useDialogueSystem';
import { useAutopoiesis } from './hooks/useAutopoiesis';
import { useZoneEffects } from './hooks/useZoneEffects';
import './App.css';

const GameContent: React.FC = () => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  
  useGameClock();
  useEntityMovement();
  useDialogueSystem();
  useAutopoiesis();
  useZoneEffects(); // ✨ Nuevo hook para efectos de zona

  const handleEntityClick = (entityId: string) => {
    setSelectedEntityId(entityId);
  };

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
      {/* Header Bar */}
      <header style={{
        height: '60px',
        background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid #334155',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 12px #10b981'
          }} />
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#f1f5f9',
            margin: 0
          }}>
            Dúo Eterno
          </h1>
        </div>
        <div style={{
          fontSize: '14px',
          color: '#94a3b8',
          fontStyle: 'italic'
        }}>
          Mundo Autónomo de Vínculos
        </div>
      </header>

      {/* Main Game Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        position: 'relative'
      }}>
        {/* Game World (Canvas) - Takes most of the space */}
        <div style={{
          flex: 1,
          position: 'relative',
          background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f1419 70%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Canvas 
            width={Math.min(800, window.innerWidth - 100)} 
            height={Math.min(600, window.innerHeight - 200)}
            onEntityClick={handleEntityClick}
          />
          <DialogOverlay />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <UIControls selectedEntityId={selectedEntityId} onEntitySelect={setSelectedEntityId} />
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
