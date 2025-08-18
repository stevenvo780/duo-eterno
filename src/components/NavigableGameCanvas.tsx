/**
 * 🎮 CANVAS PRINCIPAL CON NAVEGACIÓN MEJORADA
 * 
 * Integra el GameCanvas con los nuevos controles de navegación y animaciones
 */

import React from 'react';
import GameCanvas from './GameCanvas';
import { MapControls } from './MapControls';
import { useMapNavigation } from '../hooks/useMapNavigation';
import type { Entity } from '../types';

interface NavigableGameCanvasProps {
  width: number;
  height: number;
  onEntityClick?: (entity: Entity) => void;
}

export const NavigableGameCanvas: React.FC<NavigableGameCanvasProps> = ({
  width,
  height,
  onEntityClick
}) => {
  // Sistema de navegación mejorado
  const navigation = useMapNavigation({
    initialX: 1000, // Centrar en el mapa más grande
    initialY: 750,
    initialZoom: 1,
    minZoom: 0.2,
    maxZoom: 4,
    mapWidth: 4000, // Mapa mucho más grande
    mapHeight: 3000,
    panSpeed: 12
  });

  return (
    <div 
      style={{ 
        position: 'relative', 
        width, 
        height, 
        overflow: 'hidden',
        cursor: navigation.state.isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={navigation.handleMouseDown}
      onMouseMove={navigation.handleMouseMove}
      onMouseUp={navigation.handleMouseUp}
      onWheel={navigation.handleWheel}
    >
      {/* Canvas principal del juego */}
      <GameCanvas
        width={width}
        height={height}
        zoom={navigation.state.zoom}
        panX={navigation.state.panX}
        panY={navigation.state.panY}
        onEntityClick={onEntityClick}
      />
      
      {/* Controles de navegación */}
      <MapControls 
        navigation={navigation}
        showInstructions={true}
      />
      
      {/* Indicador de carga/rendimiento en la esquina superior derecha */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        fontFamily: 'monospace',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 99
      }}>
        <div>🗺️ Mundo Expandido</div>
        <div>🎭 Animaciones Activas</div>
        <div>⚡ Navegación Fluida</div>
      </div>
    </div>
  );
};
