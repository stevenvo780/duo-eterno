/**
 * 🎮 CONTROLES DE NAVEGACIÓN DEL MAPA
 * 
 * Panel de controles para navegación WASD, zoom y reset
 */

import React from 'react';
import type { NavigationControls } from '../hooks/useMapNavigation';

interface MapControlsProps {
  navigation: NavigationControls;
  showInstructions?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({ 
  navigation, 
  showInstructions = true 
}) => {
  const { state, zoomIn, zoomOut, resetView } = navigation;

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 100
    }}>
      {/* Instrucciones de navegación */}
      {showInstructions && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'system-ui',
          maxWidth: '200px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>🗺️ Navegación</div>
          <div>WASD / Flechas: Mover</div>
          <div>Mouse: Arrastrar</div>
          <div>Rueda: Zoom</div>
        </div>
      )}

      {/* Controles de zoom */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <button
          onClick={zoomIn}
          style={{
            padding: '6px 10px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          title="Zoom In (+)"
        >
          🔍+
        </button>
        
        <div style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '11px',
          fontFamily: 'monospace',
          padding: '2px'
        }}>
          {(state.zoom * 100).toFixed(0)}%
        </div>
        
        <button
          onClick={zoomOut}
          style={{
            padding: '6px 10px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          title="Zoom Out (-)"
        >
          🔍-
        </button>
      </div>

      {/* Botón de reset */}
      <button
        onClick={resetView}
        style={{
          padding: '8px 12px',
          background: 'rgba(74, 144, 226, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
        title="Reset View (Home)"
      >
        🏠 Centro
      </button>

      {/* Información de posición */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '6px 8px',
        borderRadius: '6px',
        fontSize: '10px',
        fontFamily: 'monospace',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>X: {Math.round(state.panX)}</div>
        <div>Y: {Math.round(state.panY)}</div>
        {state.isDragging && <div style={{ color: '#4ade80' }}>📱 Arrastrando</div>}
      </div>
    </div>
  );
};
