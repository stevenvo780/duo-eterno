/**
 * SISTEMA DE MOVIMIENTO ULTRA-SIMPLIFICADO
 * Solo para debug - movimiento puro sin complejidades
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import type { Position } from '../types';

export const useUltraSimpleMovement = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const tickCounterRef = useRef<number>(0);
  const targetsRef = useRef<Map<string, Position>>(new Map());

  const moveEntities = useCallback(() => {
    tickCounterRef.current++;
    
    const livingEntities = gameState.entities.filter(e => !e.isDead && e.stats.health > 0);
    
    // Log cada 20 ticks
    if (tickCounterRef.current % 20 === 0) {
      console.log(`🎮 Ultra Simple Movement - Tick ${tickCounterRef.current}, ${livingEntities.length} entidades`);
    }
    
    livingEntities.forEach(entity => {
      // Obtener o crear objetivo aleatorio
      let target = targetsRef.current.get(entity.id);
      if (!target) {
        target = {
          x: 100 + Math.random() * 700,
          y: 100 + Math.random() * 400
        };
        targetsRef.current.set(entity.id, target);
        console.log(`🎯 ${entity.id} nuevo objetivo: (${target.x.toFixed(0)}, ${target.y.toFixed(0)})`);
      }
      
      // Calcular movimiento hacia objetivo
      const dx = target.x - entity.position.x;
      const dy = target.y - entity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        // Normalizar dirección y aplicar velocidad
        const dirX = dx / distance;
        const dirY = dy / distance;
        const speed = 3; // píxeles por tick
        
        const newPosition = {
          x: entity.position.x + dirX * speed,
          y: entity.position.y + dirY * speed
        };
        
        // Actualizar posición
        dispatch({
          type: 'UPDATE_ENTITY_POSITION',
          payload: { entityId: entity.id, position: newPosition }
        });
        
        console.log(`🏃 ${entity.id} se mueve a (${newPosition.x.toFixed(0)}, ${newPosition.y.toFixed(0)})`);
      } else {
        // Llegó al objetivo, crear uno nuevo
        targetsRef.current.delete(entity.id);
        console.log(`🎯 ${entity.id} llegó al objetivo, generando uno nuevo`);
      }
    });
    
  }, [gameState.entities, dispatch]);

  useEffect(() => {
    console.log('🚀 Ultra Simple Movement iniciado');
    intervalRef.current = window.setInterval(moveEntities, 100); // 10 FPS

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('🛑 Ultra Simple Movement detenido');
      }
    };
  }, [moveEntities]);

  return {
    isActive: !!intervalRef.current,
    tickCount: tickCounterRef.current,
    activeTargets: targetsRef.current.size,
    livingEntities: gameState.entities.filter(e => !e.isDead && e.stats.health > 0).length
  };
};
