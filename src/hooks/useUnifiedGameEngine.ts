/**
 * SISTEMA UNIFICADO DEL JUEGO - Dúo Eterno
 * Consolidación de todos los sistemas en un hook principal
 * Reemplaza la fragmentación anterior
 */

import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import { SimpleGameSystem } from '../utils/gameSystem';
import { makeIntelligentDecision } from '../utils/simpleAI';
import { getEntityZone, checkCollisionWithObstacles } from '../utils/mapGeneration';
import { telemetry } from '../utils/telemetry';
import { logGeneral, logMovement } from '../utils/logger';
import type { Entity, Zone, Position } from '../types';

// Configuración unificada simplificada
const UNIFIED_CONFIG = {
  UPDATE_INTERVAL: 100,       // ms entre actualizaciones (más lento para debug)
  MOVEMENT_SPEED: 120,        // píxeles por segundo (más rápido)
  ARRIVAL_THRESHOLD: 30,      // distancia para considerar "llegado"
  AI_UPDATE_FREQUENCY: 10,    // cada cuántos ticks actualizar IA (menos frecuente)
  STATS_UPDATE_FREQUENCY: 5,  // cada cuántos ticks actualizar stats (menos frecuente)
  MIN_DISTANCE_BETWEEN: 50,   // distancia mínima entre entidades
  REPULSION_FORCE: 10,        // fuerza de repulsión
};

export const useUnifiedGameEngine = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const gameSystemRef = useRef(new SimpleGameSystem());
  const lastUpdateRef = useRef<number>(Date.now());
  const tickCounterRef = useRef<number>(0);
  const entityTargetsRef = useRef<Map<string, Position>>(new Map());

  // ==================== UTILIDADES ====================

  const calculateDistance = useCallback((pos1: Position, pos2: Position): number => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const findTargetForEntity = useCallback((_entity: Entity, zones: Zone[]): Position => {
    // Simplificado: siempre ir a una zona aleatoria
    if (zones.length > 0) {
      const randomZone = zones[Math.floor(Math.random() * zones.length)];
      return {
        x: randomZone.bounds.x + randomZone.bounds.width / 2,
        y: randomZone.bounds.y + randomZone.bounds.height / 2
      };
    }

    // Posición aleatoria como respaldo
    return {
      x: 100 + Math.random() * 700,
      y: 100 + Math.random() * 400
    };
  }, []);

  const calculateMovementStep = useCallback((
    entity: Entity,
    target: Position,
    companion: Entity | null,
    deltaTime: number
  ): Position => {
    const dx = target.x - entity.position.x;
    const dy = target.y - entity.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Si ya llegó, quedarse ahí
    if (distance <= UNIFIED_CONFIG.ARRIVAL_THRESHOLD) {
      return entity.position;
    }

    // Normalizar dirección
    const dirX = dx / distance;
    const dirY = dy / distance;

    // Calcular nueva posición base
    const moveDistance = UNIFIED_CONFIG.MOVEMENT_SPEED * deltaTime;
    let newX = entity.position.x + dirX * moveDistance;
    let newY = entity.position.y + dirY * moveDistance;

    // Aplicar repulsión con compañero
    if (companion) {
      const companionDx = entity.position.x - companion.position.x;
      const companionDy = entity.position.y - companion.position.y;
      const companionDistance = Math.sqrt(companionDx * companionDx + companionDy * companionDy);
      
      if (companionDistance < UNIFIED_CONFIG.MIN_DISTANCE_BETWEEN) {
        const repulsionForce = UNIFIED_CONFIG.REPULSION_FORCE;
        newX += (companionDx / companionDistance) * repulsionForce;
        newY += (companionDy / companionDistance) * repulsionForce;
      }
    }

    // Aplicar límites del canvas
    newX = Math.max(30, Math.min(970, newX));
    newY = Math.max(30, Math.min(570, newY));

    // Verificar colisiones con obstáculos
    const newPosition = { x: newX, y: newY };
    if (checkCollisionWithObstacles(newPosition, 25, gameState.mapElements)) {
      return entity.position; // No mover si hay colisión
    }

    return newPosition;
  }, [gameState.mapElements]);

  // ==================== LOOP PRINCIPAL ====================

  const updateGame = useCallback(() => {
    const now = Date.now();
    const deltaTime = (now - lastUpdateRef.current) / 1000;
    lastUpdateRef.current = now;
    tickCounterRef.current++;

    const livingEntities = gameState.entities.filter(e => !e.isDead && e.stats.health > 0);
    
    // Debug logging cada 50 ticks
    if (tickCounterRef.current % 50 === 0) {
      logGeneral.debug('Sistema activo', { 
        tick: tickCounterRef.current,
        entities: livingEntities.length,
        zones: gameState.zones.length,
        targets: entityTargetsRef.current.size
      });
    }
    
    if (livingEntities.length === 0) return;

    // ============ ESTADÍSTICAS (cada STATS_UPDATE_FREQUENCY ticks) ============
    if (tickCounterRef.current % UNIFIED_CONFIG.STATS_UPDATE_FREQUENCY === 0) {
      const result = gameSystemRef.current.updateEntities(
        livingEntities,
        gameState.zones,
        deltaTime * UNIFIED_CONFIG.STATS_UPDATE_FREQUENCY
      );

      // Aplicar cambios de estadísticas
      result.updatedEntities.forEach(updatedEntity => {
        const originalEntity = gameState.entities.find(e => e.id === updatedEntity.id);
        if (!originalEntity) return;

        // Verificar cambios significativos en stats
        const statsChanged = Object.keys(updatedEntity.stats).some(key => {
          const statKey = key as keyof typeof updatedEntity.stats;
          return Math.abs(updatedEntity.stats[statKey] - originalEntity.stats[statKey]) > 0.5;
        });

        if (statsChanged) {
          dispatch({
            type: 'UPDATE_ENTITY_STATS',
            payload: { entityId: updatedEntity.id, stats: updatedEntity.stats }
          });
        }
      });
    }

    // ============ INTELIGENCIA ARTIFICIAL (cada AI_UPDATE_FREQUENCY ticks) ============
    if (tickCounterRef.current % UNIFIED_CONFIG.AI_UPDATE_FREQUENCY === 0) {
      livingEntities.forEach(entity => {
        const companion = livingEntities.find(e => e.id !== entity.id) || null;
        const newActivity = makeIntelligentDecision(entity, companion, now);

        if (newActivity !== entity.activity) {
          dispatch({
            type: 'UPDATE_ENTITY_ACTIVITY',
            payload: { entityId: entity.id, activity: newActivity }
          });
          
          // Limpiar objetivo cuando cambia actividad
          entityTargetsRef.current.delete(entity.id);
          
          logGeneral.debug(`IA: ${entity.id} cambia actividad`, { 
            from: entity.activity, 
            to: newActivity 
          });
        }
      });
    }

    // ============ MOVIMIENTO (cada tick) ============
    livingEntities.forEach(entity => {
      const companion = livingEntities.find(e => e.id !== entity.id) || null;

      // Obtener o calcular objetivo (más frecuente para más dinamismo)
      let target = entityTargetsRef.current.get(entity.id);
      if (!target || Math.random() < 0.05) { // 5% chance de recalcular cada tick
        target = findTargetForEntity(entity, gameState.zones);
        entityTargetsRef.current.set(entity.id, target);
        logMovement.debug(`${entity.id} nuevo objetivo`, { target });
      }

      // Mover hacia objetivo
      const newPosition = calculateMovementStep(entity, target, companion, deltaTime);
      
      // Actualizar posición si se movió
      const moved = calculateDistance(entity.position, newPosition) > 0.5;
      if (moved) {
        dispatch({
          type: 'UPDATE_ENTITY_POSITION',
          payload: { entityId: entity.id, position: newPosition }
        });

        // Verificar si llegó al objetivo
        if (calculateDistance(newPosition, target) <= UNIFIED_CONFIG.ARRIVAL_THRESHOLD) {
          entityTargetsRef.current.delete(entity.id);
          logMovement.debug(`${entity.id} llegó a objetivo`, { target });
        }
      }

      // Actualizar estado basado en zona actual
      const currentZone = getEntityZone(entity.position, gameState.zones);
      const newState = currentZone ? 'IDLE' : 'SEEKING';
      if (newState !== entity.state) {
        dispatch({
          type: 'UPDATE_ENTITY_STATE',
          payload: { entityId: entity.id, state: newState }
        });
      }
    });

    // ============ TELEMETRÍA (cada 20 ticks) ============
    if (tickCounterRef.current % 20 === 0) {
      telemetry.captureSnapshot(gameState);
    }

  }, [gameState, dispatch, findTargetForEntity, calculateMovementStep, calculateDistance]);

  // ==================== INICIALIZACIÓN ====================

  useEffect(() => {
    logGeneral.info('Sistema Unificado del Juego iniciado');
    
    intervalRef.current = window.setInterval(updateGame, UNIFIED_CONFIG.UPDATE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        logGeneral.info('Sistema Unificado del Juego detenido');
      }
    };
  }, [updateGame]);

  // ==================== API PÚBLICA ====================

  return {
    isActive: !!intervalRef.current,
    tickCount: tickCounterRef.current,
    activeTargets: entityTargetsRef.current.size,
    livingEntities: gameState.entities.filter(e => !e.isDead && e.stats.health > 0).length
  };
};
