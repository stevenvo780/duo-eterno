/**
 * Canvas con navegación simplificado - mantiene TODA la funcionalidad
 */

import React, { useCallback, useRef, useContext } from 'react';
import GameCanvas from './GameCanvas';
import { useMapNavigation } from '../hooks/useMapNavigation';
import { GameContext } from '../state/GameContext';
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useContext(GameContext);
  
  if (!context) {
    throw new Error('NavigableGameCanvas must be used within a GameProvider');
  }

  const { gameState } = context;
  const worldSize = gameState.worldSize;
  
  const navigation = useMapNavigation({
    initialX: worldSize.width / 2 - width / 2,
    initialY: worldSize.height / 2 - height / 2,
    initialZoom: 1,
    minZoom: 0.2,
    maxZoom: 4,
    mapWidth: worldSize.width,
    mapHeight: worldSize.height,
    panSpeed: 12,
    canvasWidth: width,
    canvasHeight: height
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    navigation.handleMouseDown(e);
  }, [navigation]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    navigation.handleMouseMove(e);
  }, [navigation]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    navigation.handleMouseUp(e);
  }, [navigation]);

  const fitToContent = useCallback(() => {
    let minX = worldSize.width, minY = worldSize.height, maxX = 0, maxY = 0;

    gameState.zones.forEach(zone => {
      minX = Math.min(minX, zone.bounds.x);
      minY = Math.min(minY, zone.bounds.y);
      maxX = Math.max(maxX, zone.bounds.x + zone.bounds.width);
      maxY = Math.max(maxY, zone.bounds.y + zone.bounds.height);
    });

    gameState.entities.forEach(entity => {
      if (!entity.isDead) {
        minX = Math.min(minX, entity.position.x - 32);
        minY = Math.min(minY, entity.position.y - 32);
        maxX = Math.max(maxX, entity.position.x + 32);
        maxY = Math.max(maxY, entity.position.y + 32);
      }
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    navigation.moveToPosition(centerX - width / 2, centerY - height / 2);
  }, [gameState.zones, gameState.entities, worldSize, width, height, navigation]);

  return (
    <div 
      style={{ 
        position: 'relative', 
        width, 
        height, 
        overflow: 'hidden',
        cursor: navigation.state.isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={navigation.handleWheel}
    >
      <GameCanvas
        ref={canvasRef}
        width={width}
        height={height}
        zoom={navigation.state.zoom}
        panX={navigation.state.panX}
        panY={navigation.state.panY}
        onEntityClick={onEntityClick}
      />
      
      {/* Controles de navegación */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '8px',
          borderRadius: '8px'
        }}>
          <button
            onClick={navigation.zoomIn}
            style={{
              background: '#3b82f6',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            +
          </button>
          <button
            onClick={navigation.zoomOut}
            style={{
              background: '#3b82f6',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            -
          </button>
          <button
            onClick={navigation.resetView}
            style={{
              background: '#10b981',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Reset
          </button>
          <button
            onClick={fitToContent}
            style={{
              background: '#f59e0b',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🎯 Centro
          </button>
        </div>
        
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          fontFamily: 'monospace'
        }}>
          <div>🗺️ {worldSize.width}×{worldSize.height}</div>
          <div>🔍 Zoom: {navigation.state.zoom.toFixed(1)}x</div>
          <div>📍 {navigation.state.panX.toFixed(0)}, {navigation.state.panY.toFixed(0)}</div>
          <div style={{ marginTop: '4px', fontSize: '10px', color: '#94a3b8' }}>
            WASD o arrastra para mover
          </div>
        </div>
      </div>
    </div>
  );
};