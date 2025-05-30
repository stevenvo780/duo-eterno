/**
 * Hook simplificado para el loop principal del juego
 * Reemplaza el sistema complejo anterior con lógica clara y efectiva
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import { SimpleGameSystem } from '../utils/simpleGameSystem';
import { telemetryCollector } from '../utils/telemetry';

export const useSimpleGameLoop = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(Date.now());
  const gameSystemRef = useRef(new SimpleGameSystem());
  const telemetryIntervalRef = useRef<number | undefined>(undefined);
  const gameStateRef = useRef(gameState);

  // Mantener gameStateRef actualizado
  gameStateRef.current = gameState;

  const updateGame = useCallback(() => {
    const now = Date.now();
    const deltaTime = (now - lastUpdateRef.current) / 1000; // Convertir a segundos
    lastUpdateRef.current = now;

    const currentGameState = gameStateRef.current;

    // Solo procesar entidades vivas
    const livingEntities = currentGameState.entities.filter(e => e.stats.health > 0);
    if (livingEntities.length === 0) return;

    // Actualizar sistema de juego
    const result = gameSystemRef.current.updateEntities(
      livingEntities,
      currentGameState.zones,
      deltaTime
    );

    // Aplicar cambios al estado - estadísticas
    result.updatedEntities.forEach(entity => {
      const originalEntity = currentGameState.entities.find(e => e.id === entity.id);
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
      console.log(`[GameLoop] Aplicando decisión para ${decision.entityId}:`, {
        targetZone: decision.targetZone?.type,
        targetEntity: decision.targetEntity?.id
      });

      if (decision.targetZone) {
        // Moverse hacia una zona específica (calcular centro de la zona)
        const zoneCenterX = decision.targetZone.bounds.x + decision.targetZone.bounds.width / 2;
        const zoneCenterY = decision.targetZone.bounds.y + decision.targetZone.bounds.height / 2;
        
        console.log(`[GameLoop] ${decision.entityId} objetivo zona -> posición:`, { x: zoneCenterX, y: zoneCenterY });
        
        dispatch({
          type: 'UPDATE_ENTITY_TARGET',
          payload: { 
            entityId: decision.entityId, 
            target: { x: zoneCenterX, y: zoneCenterY }
          }
        });
      } else if (decision.targetEntity) {
        // Buscar a otra entidad
        console.log(`[GameLoop] ${decision.entityId} objetivo entidad -> posición:`, decision.targetEntity.position);
        
        dispatch({
          type: 'UPDATE_ENTITY_TARGET',
          payload: { 
            entityId: decision.entityId, 
            target: decision.targetEntity.position 
          }
        });
      } else {
        console.log(`[GameLoop] ${decision.entityId} sin objetivo específico`);
      }
    });
  }, [dispatch]);

  const captureTelemetry = useCallback(() => {
    telemetryCollector.captureSnapshot(gameStateRef.current);
  }, []);

  useEffect(() => {
    // Iniciar telemetría
    telemetryCollector.startRecording();

    // Intervalo de telemetría - cada 1 segundo para capturar snapshots
    telemetryIntervalRef.current = window.setInterval(captureTelemetry, 1000);

    // Intervalo principal del juego - 100ms para respuesta fluida
    intervalRef.current = window.setInterval(updateGame, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (telemetryIntervalRef.current) {
        clearInterval(telemetryIntervalRef.current);
      }
      telemetryCollector.stopRecording();
    };
  }, [updateGame, captureTelemetry]);

  return {
    isRunning: !!intervalRef.current
  };
};
