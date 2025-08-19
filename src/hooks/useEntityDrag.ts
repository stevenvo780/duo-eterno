import { useState, useCallback } from 'react';
import { useGame } from './useGame';
import type { Entity, Position } from '../types';
import { getEntityZone } from '../utils/mapGeneration';

interface DragState {
  isDragging: boolean;
  draggedEntity: Entity | null;
  dragOffset: Position;
  lastPosition: Position;
}

const initialDragState: DragState = {
  isDragging: false,
  draggedEntity: null,
  dragOffset: { x: 0, y: 0 },
  lastPosition: { x: 0, y: 0 }
};

export const useEntityDrag = () => {
  const { gameState, dispatch } = useGame();
  const [dragState, setDragState] = useState<DragState>(initialDragState);

  const startDrag = useCallback((entity: Entity, mouseX: number, mouseY: number, canvasElement: HTMLCanvasElement, zoom: number, panX: number, panY: number) => {
    if (entity.isDead || entity.controlMode !== 'manual') return false;

    const rect = canvasElement.getBoundingClientRect();
    const worldX = (mouseX - rect.left) / zoom + panX;
    const worldY = (mouseY - rect.top) / zoom + panY;

    const offset = {
      x: worldX - entity.position.x,
      y: worldY - entity.position.y
    };

    setDragState({
      isDragging: true,
      draggedEntity: entity,
      dragOffset: offset,
      lastPosition: { x: worldX, y: worldY }
    });

    dispatch({
      type: 'SET_ENTITY_DRAGGING',
      payload: { entityId: entity.id, isBeingDragged: true }
    });

    return true;
  }, [dispatch]);

  const updateDrag = useCallback((mouseX: number, mouseY: number, canvasElement: HTMLCanvasElement, zoom: number, panX: number, panY: number) => {
    if (!dragState.isDragging || !dragState.draggedEntity) return;

    const rect = canvasElement.getBoundingClientRect();
    const worldX = (mouseX - rect.left) / zoom + panX;
    const worldY = (mouseY - rect.top) / zoom + panY;

    const newPosition = {
      x: worldX - dragState.dragOffset.x,
      y: worldY - dragState.dragOffset.y
    };

    // Update entity position
    dispatch({
      type: 'UPDATE_ENTITY_POSITION',
      payload: { entityId: dragState.draggedEntity.id, position: newPosition }
    });

    setDragState(prev => ({
      ...prev,
      lastPosition: { x: worldX, y: worldY }
    }));
  }, [dragState, dispatch]);

  const endDrag = useCallback(() => {
    if (!dragState.isDragging || !dragState.draggedEntity) return;

    // Get the current entity state from gameState (it has the updated position)
    const entity = gameState.entities.find(e => e.id === dragState.draggedEntity!.id);
    if (!entity) return;
    
    // Check if entity is in a beneficial zone and apply effects
    const currentZone = getEntityZone(entity.position, gameState.zones);
    if (currentZone && currentZone.effects) {
      const statUpdates: Record<string, number> = {};
      
      Object.entries(currentZone.effects).forEach(([stat, effect]) => {
        if (effect && effect > 0) {
          const currentValue = entity.stats[stat as keyof typeof entity.stats] || 0;
          const newValue = Math.min(100, currentValue + effect * 5); // Apply zone effect
          statUpdates[stat] = newValue;
        }
      });

      if (Object.keys(statUpdates).length > 0) {
        dispatch({
          type: 'UPDATE_ENTITY_STATS',
          payload: { entityId: entity.id, stats: statUpdates }
        });
      }
    }

    dispatch({
      type: 'SET_ENTITY_DRAGGING',
      payload: { entityId: entity.id, isBeingDragged: false }
    });

    setDragState(initialDragState);
  }, [dragState, dispatch, gameState.zones]);

  const cancelDrag = useCallback(() => {
    if (dragState.draggedEntity) {
      dispatch({
        type: 'SET_ENTITY_DRAGGING',
        payload: { entityId: dragState.draggedEntity.id, isBeingDragged: false }
      });
    }
    setDragState(initialDragState);
  }, [dragState.draggedEntity, dispatch, gameState.entities, gameState.zones]);

  const checkEntityAtPosition = useCallback((mouseX: number, mouseY: number, canvasElement: HTMLCanvasElement, zoom: number, panX: number, panY: number): Entity | null => {
    const rect = canvasElement.getBoundingClientRect();
    const worldX = (mouseX - rect.left) / zoom + panX;
    const worldY = (mouseY - rect.top) / zoom + panY;

    // Find closest entity, prioritizing manual control entities
    let closestEntity = null;
    let closestDistance = Infinity;
    const detectionRadius = Math.max(50, 80 / zoom); // Dynamic radius based on zoom

    for (const entity of gameState.entities) {
      if (entity.isDead) continue;
      
      const distance = Math.sqrt(
        Math.pow(worldX - entity.position.x, 2) + 
        Math.pow(worldY - entity.position.y, 2)
      );
      
      if (distance < detectionRadius && distance < closestDistance) {
        // Only return entities in manual control mode for dragging
        if (entity.controlMode === 'manual') {
          closestEntity = entity;
          closestDistance = distance;
        }
      }
    }

    return closestEntity;
  }, [gameState.entities]);

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag,
    checkEntityAtPosition
  };
};