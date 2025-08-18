/**
 * Canvas con navegación y arrastre de entidades integrado.
 */

import React, { useCallback, useRef } from 'react';
import GameCanvas from './GameCanvas';
import { MapControls } from './MapControls';
import { useMapNavigation } from '../hooks/useMapNavigation';
import { useEntityDrag } from '../hooks/useEntityDrag';
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

  const entityDrag = useEntityDrag();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    // First check if we're clicking on an entity that can be dragged
    const entity = entityDrag.checkEntityAtPosition(
      e.clientX, e.clientY, canvasRef.current, 
      navigation.state.zoom, navigation.state.panX, navigation.state.panY
    );

    if (entity) {
      // Start entity drag
      const success = entityDrag.startDrag(
        entity, e.clientX, e.clientY, canvasRef.current,
        navigation.state.zoom, navigation.state.panX, navigation.state.panY
      );
      if (success) {
        return; // Don't start map navigation
      }
    }

    // If no entity drag started, handle map navigation
    navigation.handleMouseDown(e);
  }, [entityDrag, navigation]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    if (entityDrag.dragState.isDragging) {
      // Update entity drag
      entityDrag.updateDrag(
        e.clientX, e.clientY, canvasRef.current,
        navigation.state.zoom, navigation.state.panX, navigation.state.panY
      );
    } else {
      // Handle map navigation
      navigation.handleMouseMove(e);
    }
  }, [entityDrag, navigation]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (entityDrag.dragState.isDragging) {
      entityDrag.endDrag();
    } else {
      navigation.handleMouseUp(e);
    }
  }, [entityDrag, navigation]);

  const handleEntityClick = useCallback((entity: Entity) => {
    // Only trigger entity click if we're not dragging
    if (!entityDrag.dragState.isDragging && onEntityClick) {
      onEntityClick(entity);
    }
  }, [entityDrag.dragState.isDragging, onEntityClick]);

  return (
    <div 
      style={{ 
        position: 'relative', 
        width, 
        height, 
        overflow: 'hidden',
        cursor: entityDrag.dragState.isDragging ? 'grabbing' : 
                navigation.state.isDragging ? 'grabbing' : 'grab'
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
        onEntityClick={handleEntityClick}
      />
      
      <MapControls 
        navigation={navigation}
        showInstructions={true}
      />
      
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
        {entityDrag.dragState.isDragging && (
          <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>
            🎮 Arrastrando entidad
          </div>
        )}
      </div>

      {entityDrag.dragState.isDragging && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(245, 158, 11, 0.9)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          border: '2px solid #f59e0b',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
          zIndex: 100
        }}>
          🎮 Arrastra la entidad a una zona para mejorar sus stats
        </div>
      )}
    </div>
  );
};
