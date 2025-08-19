/**
 * Canvas con navegación y arrastre de entidades integrado.
 */

import React, { useCallback, useRef, useContext, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import { MapControls } from './MapControls';
import { useMapNavigation } from '../hooks/useMapNavigation';
import { useEntityDrag } from '../hooks/useEntityDrag';
import { GameContext } from '../state/GameContext';
import type { Entity } from '../types';
import { FEATURE_FLAGS } from '../constants/mapConstants';

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
  
  // Use worldSize from gameState (unified source of truth)
  const worldSize = gameState.worldSize;
  
  const navigation = useMapNavigation({
    initialX: worldSize.width / 2, // Center on unified world size
    initialY: worldSize.height / 2,
    initialZoom: 1,
    minZoom: 0.2,
    maxZoom: 4,
    mapWidth: worldSize.width, // Use unified world bounds
    mapHeight: worldSize.height,
    panSpeed: 12
  });

  const entityDrag = useEntityDrag();

  // Fit-to-content functionality
  const fitToContent = useCallback(() => {
    if (!FEATURE_FLAGS.camera.fitToContent) return;

    console.log('📐 Calculating fit-to-content...');
    
    // Calculate bounding box of all zones and entities
    let minX = worldSize.width;
    let minY = worldSize.height;
    let maxX = 0;
    let maxY = 0;

    // Include zones in bounding box
    gameState.zones.forEach(zone => {
      minX = Math.min(minX, zone.bounds.x);
      minY = Math.min(minY, zone.bounds.y);
      maxX = Math.max(maxX, zone.bounds.x + zone.bounds.width);
      maxY = Math.max(maxY, zone.bounds.y + zone.bounds.height);
    });

    // Include entities in bounding box
    gameState.entities.forEach(entity => {
      if (!entity.isDead) {
        minX = Math.min(minX, entity.position.x - 32);
        minY = Math.min(minY, entity.position.y - 32);
        maxX = Math.max(maxX, entity.position.x + 32);
        maxY = Math.max(maxY, entity.position.y + 32);
      }
    });

    // Add padding
    const padding = 100;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    // Calculate center
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Calculate zoom to fit content
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const zoomX = width / contentWidth;
    const zoomY = height / contentHeight;
    const targetZoom = Math.min(zoomX, zoomY, 2); // Max zoom of 2x

    console.log('📐 Fit-to-content calculated:', {
      bounds: { minX, minY, maxX, maxY },
      center: { centerX, centerY },
      targetZoom,
      contentSize: { contentWidth, contentHeight }
    });

    // Apply new position and zoom using available navigation methods
    navigation.moveToPosition(centerX - width / 2 / targetZoom, centerY - height / 2 / targetZoom);
    // TODO: Implement zoom setting in navigation hook or use manual state update
    console.log('🔄 Fit-to-content: Position set, zoom adjustment pending implementation');
  }, [gameState.zones, gameState.entities, worldSize, width, height, navigation]);

  // Auto fit-to-content on initial load if enabled
  useEffect(() => {
    if (FEATURE_FLAGS.camera.fitToContent && gameState.zones.length > 0) {
      // Delay to ensure everything is loaded
      const timer = setTimeout(fitToContent, 500);
      return () => clearTimeout(timer);
    }
  }, [fitToContent, gameState.zones.length]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    // Prevent default to avoid any browser drag behavior
    e.preventDefault();

    // First check if we're clicking on an entity that can be dragged
    const entity = entityDrag.checkEntityAtPosition(
      e.clientX, e.clientY, canvasRef.current, 
      navigation.state.zoom, navigation.state.panX, navigation.state.panY
    );

    if (entity) {
      // For manual control entities, try to start drag
      if (entity.controlMode === 'manual') {
        const success = entityDrag.startDrag(
          entity, e.clientX, e.clientY, canvasRef.current,
          navigation.state.zoom, navigation.state.panX, navigation.state.panY
        );
        if (success) {
          return; // Don't start map navigation
        }
      }
      // For any entity (including autonomous), prevent map navigation in entity area
      return; // Don't start map navigation near entities
    }

    // If no entity nearby, handle map navigation
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
      
      {/* Fit-to-content button */}
      {FEATURE_FLAGS.camera.fitToContent && (
        <button
          onClick={fitToContent}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            zIndex: 100,
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 1)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Centrar vista en el contenido del mapa"
        >
          🎯 Centrar contenido
        </button>
      )}
      
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
        <div>🗺️ Mundo: {worldSize.width}×{worldSize.height}</div>
        <div>🎭 Generador v{gameState.generatorVersion}</div>
        <div>🧩 Tiles: {gameState.terrainTiles.length}</div>
        <div>⚡ Pixel-perfect: ON</div>
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
