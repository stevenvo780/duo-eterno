import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import { shouldUpdateMovement, measureExecutionTime } from '../utils/performanceOptimizer';
import { makeIntelligentDecision } from '../utils/aiDecisionEngine';
import {
  getAttractionTarget,
  getEntityZone,
  checkCollisionWithObstacles
} from '../utils/mapGeneration';
import { MOVEMENT_CONFIG, NEED_TO_ZONE_MAPPING, RESONANCE_THRESHOLDS } from '../constants';
import { MAP_CONFIG } from '../utils/organicMapGeneration'; // NUEVO: Import para boundaries
import type { Entity, Zone, Position } from '../types';
import { getGameIntervals } from '../config/gameConfig';

export const useEntityMovementOptimized = () => {
  const { gameState, dispatch } = useGame();
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0);
  const entityTargets = useRef<Map<string, Position>>(new Map());

  const getCriticalStats = useCallback((entity: Entity): (keyof typeof entity.stats)[] => {
    const critical: (keyof typeof entity.stats)[] = [];

    if (entity.stats.hunger < 40) critical.push('hunger');
    if (entity.stats.sleepiness < 40) critical.push('sleepiness');
    if (entity.stats.loneliness < 40) critical.push('loneliness');
    if (entity.stats.boredom < 40) critical.push('boredom');
    if (entity.stats.energy < 40) critical.push('energy');
    if (entity.stats.happiness < 40) critical.push('happiness');
    if (entity.stats.money < 30) critical.push('money');

    return critical;
  }, []);

  const isZoneBeneficialForEntity = useCallback(
    (entity: Entity, zone: Zone): boolean => {
      const criticalStats = getCriticalStats(entity);

      for (const stat of criticalStats) {
        if (zone.effects?.[stat] && zone.effects[stat]! > 0) {
          return true;
        }
      }

      if (entity.stats.money < 30 && zone.effects?.money && zone.effects.money > 0) {
        return true;
      }

      return false;
    },
    [getCriticalStats]
  );

  const findMostNeededZone = useCallback(
    (entity: Entity, zones: Zone[]): Zone | null => {
      const criticalStats = getCriticalStats(entity);

      if (entity.stats.money < 20) {
        const moneyZone = zones.find(z => z.effects?.money && z.effects.money > 0);
        if (moneyZone) return moneyZone;
      }

      for (const stat of criticalStats) {
        const zoneType = NEED_TO_ZONE_MAPPING[stat];
        if (zoneType) {
          const suitableZone = zones.find(z => z.type === zoneType);
          if (suitableZone) return suitableZone;
        }
      }

      if (entity.stats.happiness < 50) {
        const comfortZone = zones.find(z => z.type === 'comfort');
        if (comfortZone) return comfortZone;
      }

      return null;
    },
    [getCriticalStats]
  );

  const getEntityTarget = useCallback(
    (entity: Entity, zones: Zone[], companion: Entity | null): Position | undefined => {
      if (companion && !companion.isDead) {
        const distance = Math.hypot(
          entity.position.x - companion.position.x,
          entity.position.y - companion.position.y
        );
        if (
          gameState.resonance < RESONANCE_THRESHOLDS.LOW ||
          distance > MOVEMENT_CONFIG.COMPANION_SEEK_DISTANCE
        ) {
          return companion.position;
        }
      }

      const currentZone = getEntityZone(entity.position, zones);
      if (currentZone && isZoneBeneficialForEntity(entity, currentZone)) {
        return {
          x: currentZone.bounds.x + currentZone.bounds.width / 2,
          y: currentZone.bounds.y + currentZone.bounds.height / 2
        };
      }

      const targetZone = findMostNeededZone(entity, zones);
      if (targetZone) {
        return {
          x: targetZone.bounds.x + targetZone.bounds.width / 2,
          y: targetZone.bounds.y + targetZone.bounds.height / 2
        };
      }

      const attractionTarget = getAttractionTarget(entity.stats, zones, entity.position);
      return attractionTarget || undefined;
    },
    [findMostNeededZone, isZoneBeneficialForEntity, gameState.resonance]
  );

  const calculateMovementStep = useCallback(
    (entity: Entity, target: Position, companion: Entity | null): Position => {
      const dx = target.x - entity.position.x;
      const dy = target.y - entity.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 1e-10) {
        // Usar epsilon pequeño en lugar de comparación exacta
        return entity.position;
      }

      const safeDistance = Math.max(1e-10, distance);
      const dirX = dx / safeDistance;
      const dirY = dy / safeDistance;

      const { entityMovementSpeed } = getGameIntervals();
      let newX = entity.position.x + dirX * entityMovementSpeed;
      let newY = entity.position.y + dirY * entityMovementSpeed;

      if (companion) {
        const companionDx = entity.position.x - companion.position.x;
        const companionDy = entity.position.y - companion.position.y;
        const companionDistance = Math.sqrt(companionDx * companionDx + companionDy * companionDy);
        if (companionDistance > 1e-10) {
          // Evitar división por cero
          if (companionDistance < MOVEMENT_CONFIG.MIN_DISTANCE_BETWEEN_ENTITIES) {
            const repulsionForce = MOVEMENT_CONFIG.REPULSION_FORCE;
            newX += (companionDx / companionDistance) * repulsionForce;
            newY += (companionDy / companionDistance) * repulsionForce;
          } else {
            const preferred = 80;
            const diff = companionDistance - preferred;
            const k = 0.02;
            newX -= (companionDx / companionDistance) * (k * diff);
            newY -= (companionDy / companionDistance) * (k * diff);
          }
        }
      }

      const maxX = MAP_CONFIG.width - MOVEMENT_CONFIG.ENTITY_SIZE;
      const maxY = MAP_CONFIG.height - MOVEMENT_CONFIG.ENTITY_SIZE;
      newX = Math.max(MOVEMENT_CONFIG.ENTITY_SIZE, Math.min(maxX, newX));
      newY = Math.max(MOVEMENT_CONFIG.ENTITY_SIZE, Math.min(maxY, newY));

      const newPosition = { x: newX, y: newY };
      if (
        checkCollisionWithObstacles(newPosition, MOVEMENT_CONFIG.ENTITY_SIZE, gameState.mapElements)
      ) {
        const alternativeX = entity.position.x + dirY * entityMovementSpeed;
        const alternativeY = entity.position.y - dirX * entityMovementSpeed;

        const alternativePosition = { x: alternativeX, y: alternativeY };
        if (
          !checkCollisionWithObstacles(
            alternativePosition,
            MOVEMENT_CONFIG.ENTITY_SIZE,
            gameState.mapElements
          )
        ) {
          return alternativePosition;
        }

        return entity.position;
      }

      return newPosition;
    },
    [gameState.mapElements]
  );

  useEffect(() => {
    function updateMovement() {
      const now = performance.now();

      if (!shouldUpdateMovement()) {
        animationRef.current = requestAnimationFrame(updateMovement);
        return;
      }

      lastUpdateTime.current = now;

      measureExecutionTime('entity-movement-optimized', () => {
        const livingEntities = gameState.entities.filter(
          e => !e.isDead && e.state !== 'dead' && e.state !== 'fading'
        );

        for (const entity of livingEntities) {
          // Skip movement if entity is under manual control or being dragged
          if (entity.controlMode === 'manual' || entity.isBeingDragged) {
            continue;
          }
          const companion = livingEntities.find(e2 => e2.id !== entity.id) || null;

          if (now % 5000 < 100) {
            const newActivity = makeIntelligentDecision(entity, companion, now);

            if (newActivity !== entity.activity) {
              dispatch({
                type: 'UPDATE_ENTITY_ACTIVITY',
                payload: { entityId: entity.id, activity: newActivity }
              });

              entityTargets.current.delete(entity.id);
            }
          }

          let target = entityTargets.current.get(entity.id);
          const targetRefreshCheck = (now + entity.id.charCodeAt(0) * 100) % 10000 < 100; // ~1% chance determinísticamente
          if (!target || targetRefreshCheck) {
            target = getEntityTarget(entity, gameState.zones, companion);
            if (target) {
              entityTargets.current.set(entity.id, target);
            }
          }

          const fallbackCheck = (now + entity.id.charCodeAt(1) * 200) % 20000 < 100; // ~0.5% chance determinísticamente
          if (!target || fallbackCheck) {
            const seed = entity.id.charCodeAt(0) + (now % 10000);
            const normalizedSeedX = ((seed * 9301) % 233280) / 233280; // LCG determinístico
            const normalizedSeedY = (((seed + 1000) * 9301) % 233280) / 233280;

            target = {
              x: normalizedSeedX * (MAP_CONFIG.width - 200) + 100,
              y: normalizedSeedY * (MAP_CONFIG.height - 200) + 100
            };
            entityTargets.current.set(entity.id, target);
          }

          if (target) {
            const newPosition = calculateMovementStep(entity, target, companion);

            const moved =
              Math.abs(newPosition.x - entity.position.x) > 0.5 ||
              Math.abs(newPosition.y - entity.position.y) > 0.5;

            if (moved) {
              dispatch({
                type: 'UPDATE_ENTITY_POSITION',
                payload: { entityId: entity.id, position: newPosition }
              });
            }
          }

          const currentZone = getEntityZone(entity.position, gameState.zones);
          if (currentZone) {
            if (entity.state === 'seeking') {
              dispatch({
                type: 'UPDATE_ENTITY_STATE',
                payload: { entityId: entity.id, state: 'idle' }
              });
            }
          } else {
            if (entity.state === 'idle') {
              dispatch({
                type: 'UPDATE_ENTITY_STATE',
                payload: { entityId: entity.id, state: 'seeking' }
              });
            }
          }
        }
      });

      animationRef.current = requestAnimationFrame(updateMovement);
    }

    animationRef.current = requestAnimationFrame(updateMovement);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    gameState.entities,
    gameState.zones,
    gameState.resonance,
    gameState.mapElements,
    dispatch,
    calculateMovementStep,
    getEntityTarget
  ]);
};
