/**
 * Hook simplificado para el loop principal del juego
 * Reemplaza el sistema complejo anterior con lógica clara y efectiva
 */

import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { SimpleGameSystem } from '../utils/simpleGameSystem';

export const useSimpleGameLoop = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(Date.now());
  const gameSystemRef = useRef(new SimpleGameSystem());

  useEffect(() => {
    // Intervalo principal del juego - 100ms para respuesta fluida
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000; // Convertir a segundos
      lastUpdateRef.current = now;

      // Solo procesar entidades vivas
      const livingEntities = gameState.entities.filter(e => e.stats.health > 0);
      if (livingEntities.length === 0) return;

      // Actualizar sistema de juego
      const result = gameSystemRef.current.updateEntities(
        livingEntities,
        gameState.zones,
        deltaTime
      );

      // Aplicar cambios al estado - estadísticas
      result.updatedEntities.forEach(entity => {
        const originalEntity = gameState.entities.find(e => e.id === entity.id);
        if (!originalEntity) return;

        // Actualizar stats si han cambiado significativamente
        const statsChanged = Object.keys(entity.stats).some(key => {
          const statKey = key as keyof typeof entity.stats;
          return Math.abs(entity.stats[statKey] - originalEntity.stats[statKey]) > 0.5;
        });

        if (statsChanged) {
          dispatch({
            type: 'UPDATE_ENTITY_STATS',
            payload: { entityId: entity.id, stats: entity.stats }
          });
        }
      });

      // Aplicar decisiones de movimiento
      result.decisions.forEach(decision => {
        if (decision.targetZone) {
          // Moverse hacia una zona específica
          dispatch({
            type: 'UPDATE_ENTITY_TARGET',
            payload: { 
              entityId: decision.entityId, 
              targetPosition: decision.targetZone.position 
            }
          });
        } else if (decision.targetEntity) {
          // Buscar a otra entidad
          dispatch({
            type: 'UPDATE_ENTITY_TARGET',
            payload: { 
              entityId: decision.entityId, 
              targetPosition: decision.targetEntity.position 
            }
          });
        }
      });

    }, 100); // 100ms = 10 FPS para el juego

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState.entities, gameState.zones, dispatch]);

  return {
    isRunning: !!intervalRef.current
  };
};
