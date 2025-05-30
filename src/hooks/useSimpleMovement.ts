/**
 * Sistema de movimiento simplificado para Dúo Eterno
 * Movimiento directo hacia objetivos con lógica clara
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import type { Position } from '../types';

const MOVEMENT_CONFIG = {
  SPEED: 50,              // Píxeles por segundo
  ARRIVAL_THRESHOLD: 20,  // Distancia para considerar "llegado"
  UPDATE_INTERVAL: 50,    // ms entre actualizaciones de movimiento
};

export const useSimpleMovement = () => {
  const { gameState, dispatch } = useGame();
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(Date.now());

  const calculateDistance = useCallback((pos1: Position, pos2: Position): number => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const moveTowardsTarget = useCallback((
    current: Position, 
    target: Position, 
    speed: number, 
    deltaTime: number
  ): Position => {
    const distance = calculateDistance(current, target);
    
    if (distance <= MOVEMENT_CONFIG.ARRIVAL_THRESHOLD) {
      return target; // Ya llegó
    }

    const direction = {
      x: (target.x - current.x) / distance,
      y: (target.y - current.y) / distance
    };

    const moveDistance = speed * deltaTime;
    
    return {
      x: current.x + direction.x * moveDistance,
      y: current.y + direction.y * moveDistance
    };
  }, [calculateDistance]);

  useEffect(() => {
    const updateMovement = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000; // Convertir a segundos
      lastUpdateRef.current = now;

      gameState.entities.forEach(entity => {
        if (entity.isDead || !entity.targetPosition) return;

        const distance = calculateDistance(entity.position, entity.targetPosition);
        
        // Si ya llegó al objetivo, no mover más
        if (distance <= MOVEMENT_CONFIG.ARRIVAL_THRESHOLD) {
          dispatch({
            type: 'UPDATE_ENTITY_TARGET',
            payload: { entityId: entity.id, target: undefined }
          });
          return;
        }

        // Calcular nueva posición
        const newPosition = moveTowardsTarget(
          entity.position,
          entity.targetPosition,
          MOVEMENT_CONFIG.SPEED,
          deltaTime
        );

        // Actualizar posición en el estado
        dispatch({
          type: 'UPDATE_ENTITY_POSITION',
          payload: { entityId: entity.id, position: newPosition }
        });
      });

      animationRef.current = requestAnimationFrame(updateMovement);
    };

    animationRef.current = requestAnimationFrame(updateMovement);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.entities, dispatch, calculateDistance, moveTowardsTarget]);

  return {
    isMoving: gameState.entities.some(e => !e.isDead && !!e.targetPosition)
  };
};
