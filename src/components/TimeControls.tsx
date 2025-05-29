import React, { useState } from 'react';
import FloatingPanel from './FloatingPanel';
import { gameConfig, speedPresets } from '../config/gameConfig';

interface TimeControlsProps {
  gameSpeed: number;
  isPaused: boolean;
  onSpeedChange: (speed: number) => void;
  onPauseToggle: () => void;
  onReset: () => void;
  onClose?: () => void;
}

const TimeControls: React.FC<TimeControlsProps> = ({
  gameSpeed,
  isPaused,
  onSpeedChange,
  onPauseToggle,
  onReset,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#f1f5f9',
          cursor: 'pointer',
          fontSize: '14px',
          zIndex: 999,
          backdropFilter: 'blur(8px)'
        }}
      >
        ⏱️ Tiempo
      </button>
    );
  }

  return (
    <FloatingPanel
      title="Control de Tiempo"
      icon="⏱️"
      defaultPosition={{ x: window.innerWidth - 350, y: 10 }}
      defaultSize={{ width: 320, height: 420 }}
      defaultMinimized={false}
      onClose={handleClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Pause/Play */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onPauseToggle}
            style={{
              background: isPaused 
                ? 'linear-gradient(135deg, #10b981, #059669)' 
                : 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              flex: 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            {isPaused ? '▶️ Continuar' : '⏸️ Pausar'}
          </button>
        </div>

        {/* Speed Slider */}
        <div>
          <label style={{ 
            fontSize: '14px', 
            color: '#f1f5f9', 
            fontWeight: '600',
            marginBottom: '8px', 
            display: 'block' 
          }}>
            Velocidad del Juego: {gameSpeed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={gameSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #374151 0%, #6b7280 50%, #3b82f6 100%)',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#6b7280',
            marginTop: '4px'
          }}>
            <span>0.1x</span>
            <span>1x Normal</span>
            <span>10x</span>
          </div>
        </div>

        {/* Speed Presets */}
        <div>
          <label style={{ 
            fontSize: '12px', 
            color: '#94a3b8', 
            marginBottom: '8px', 
            display: 'block' 
          }}>
            Presets de Velocidad:
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            marginBottom: '8px'
          }}>
            {Object.entries(speedPresets).slice(0, 6).map(([name, speed]) => (
              <button
                key={name}
                onClick={() => onSpeedChange(speed)}
                style={{
                  background: gameSpeed === speed 
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                    : 'rgba(51, 65, 85, 0.5)',
                  border: gameSpeed === speed ? '2px solid #60a5fa' : '1px solid #475569',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  color: '#f1f5f9',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {name.split('(')[0].trim()}
              </button>
            ))}
          </div>
          
          {/* Preset extremo */}
          <button
            onClick={() => onSpeedChange(speedPresets['Hiper (10x)'])}
            style={{
              background: gameSpeed === speedPresets['Hiper (10x)'] 
                ? 'linear-gradient(135deg, #dc2626, #991b1b)' 
                : 'rgba(239, 68, 68, 0.2)',
              border: gameSpeed === speedPresets['Hiper (10x)'] ? '2px solid #ef4444' : '1px solid #ef4444',
              borderRadius: '6px',
              padding: '6px 12px',
              color: gameSpeed === speedPresets['Hiper (10x)'] ? '#fff' : '#fca5a5',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '500',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
          >
            ⚡ Hiper (10x)
          </button>
        </div>

        {/* Sistema Info */}
        {gameConfig.debugMode && (
          <div style={{
            padding: '12px',
            background: 'rgba(15, 20, 25, 0.5)',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#94a3b8',
            lineHeight: '1.4'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '6px', color: '#f1f5f9' }}>
              Sistema Activo:
            </div>
            <div>🧬 Autopoiesis: {(200 / gameSpeed).toFixed(0)}ms</div>
            <div>🏛️ Efectos de Zona: {(150 / gameSpeed).toFixed(0)}ms</div>
            <div>🎯 Movimiento: {(2 * gameSpeed).toFixed(1)}px/frame</div>
            <div>⚡ Decay: {gameSpeed.toFixed(1)}x más rápido</div>
            <div style={{ marginTop: '6px', fontSize: '10px', color: '#6b7280' }}>
              Intervalos se ajustan automáticamente
            </div>
          </div>
        )}

        {/* Reset */}
        <button
          onClick={onReset}
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#fca5a5',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          🔄 Reiniciar Juego
        </button>
      </div>
    </FloatingPanel>
  );
};

export default TimeControls;
