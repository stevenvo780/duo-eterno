import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import { shouldUpdateMovement, measureExecutionTime } from '../utils/performanceOptimizer';
import { makeIntelligentDecision } from '../utils/aiDecisionEngine';
import { getAttractionTarget, getEntityZone, checkCollisionWithObstacles } from '../utils/mapGeneration';
import { MOVEMENT_CONFIG, NEED_TO_ZONE_MAPPING, RESONANCE_THRESHOLDS } from '../constants/gameConstants';
import type { Entity, Zone, Position } from '../types';
import { getGameIntervals } from '../config/gameConfig';

// Sistema de movimiento optimizado con búsqueda de zonas
export const useEntityMovementOptimized = () => {
  const { gameState, dispatch } = useGame();
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0);
  const entityTargets = useRef<Map<string, Position>>(new Map());

  // Obtener estadísticas críticas basadas en valores bajos (recursos agotados)
  const getCriticalStats = useCallback((entity: Entity): (keyof typeof entity.stats)[] => {
    const critical: (keyof typeof entity.stats)[] = [];

    if (entity.stats.hunger < 40) critical.push('hunger');        // Falta comida
    if (entity.stats.sleepiness < 40) critical.push('sleepiness'); // Falta descanso
    if (entity.stats.loneliness < 40) critical.push('loneliness'); // Falta compañía
    if (entity.stats.boredom < 40) critical.push('boredom');       // Falta diversión
    if (entity.stats.energy < 40) critical.push('energy');        // Necesita energía
    if (entity.stats.happiness < 40) critical.push('happiness');  // Necesita felicidad
    if (entity.stats.money < 30) critical.push('money');          // Necesita dinero
    
    return critical;
  }, []);

  // Verificar si una zona es beneficiosa para la entidad
  const isZoneBeneficialForEntity = useCallback((entity: Entity, zone: Zone): boolean => {
    // Verificar si la zona ayuda con las estadísticas críticas
    const criticalStats = getCriticalStats(entity);
    
    for (const stat of criticalStats) {
      // Las zonas son útiles si incrementan la estadística deficiente
      if (zone.effects?.[stat] && zone.effects[stat]! > 0) {
        return true;
      }
    }

    // Verificar si la zona genera dinero cuando se necesita
    if (entity.stats.money < 30 && zone.effects?.money && zone.effects.money > 0) {
      return true;
    }

    return false;
  }, [getCriticalStats]);

  // Encontrar la zona más necesaria para la entidad
  const findMostNeededZone = useCallback((entity: Entity, zones: Zone[]): Zone | null => {
    const criticalStats = getCriticalStats(entity);
    
    // Si necesita dinero urgentemente
    if (entity.stats.money < 20) {
      // Buscar una zona que genere dinero
      const moneyZone = zones.find(z => z.effects?.money && z.effects.money > 0);
      if (moneyZone) return moneyZone;
    }

    // Buscar zona que atienda la necesidad más crítica
    for (const stat of criticalStats) {
      const zoneType = NEED_TO_ZONE_MAPPING[stat];
      if (zoneType) {
        const suitableZone = zones.find(z => z.type === zoneType);
        if (suitableZone) return suitableZone;
      }
    }

    // Si no hay críticos, buscar zonas que mejoren el bienestar general
    if (entity.stats.happiness < 50) {
      const comfortZone = zones.find(z => z.type === 'comfort');
      if (comfortZone) return comfortZone;
    }

    return null;
  }, [getCriticalStats]);

  // Función para calcular el objetivo de una entidad basado en sus necesidades
  const getEntityTarget = useCallback(
    (
      entity: Entity,
      zones: Zone[],
      companion: Entity | null
    ): Position | undefined => {
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
    // Priorizar zona actual si está en una zona beneficiosa
    const currentZone = getEntityZone(entity.position, zones);
    if (currentZone && isZoneBeneficialForEntity(entity, currentZone)) {
      // Quedarse en el centro de la zona actual
      return {
        x: currentZone.bounds.x + currentZone.bounds.width / 2,
        y: currentZone.bounds.y + currentZone.bounds.height / 2
      };
    }

    // Encontrar la zona más necesaria para la entidad
    const targetZone = findMostNeededZone(entity, zones);
    if (targetZone) {
      // Moverse al centro de la zona objetivo
      return {
        x: targetZone.bounds.x + targetZone.bounds.width / 2,
        y: targetZone.bounds.y + targetZone.bounds.height / 2
      };
    }

    // Si no hay zona específica, usar el sistema de atracción general
    const attractionTarget = getAttractionTarget(entity.stats, zones, entity.position);
    return attractionTarget || undefined;
  }, [findMostNeededZone, isZoneBeneficialForEntity, gameState.resonance]);

  // Calcular el siguiente paso en el movimiento hacia un objetivo
  const calculateMovementStep = useCallback((
    entity: Entity, 
    target: Position, 
    companion: Entity | null
  ): Position => {
    const dx = target.x - entity.position.x;
    const dy = target.y - entity.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Si ya está cerca del objetivo, no moverse
    if (distance < 20) {
      return entity.position;
    }

    // Normalizar la dirección
    const dirX = dx / distance;
    const dirY = dy / distance;
    
    // Calcular nueva posición con velocidad base (parametrizada)
    const { entityMovementSpeed } = getGameIntervals();
    let newX = entity.position.x + dirX * entityMovementSpeed;
    let newY = entity.position.y + dirY * entityMovementSpeed;

    // Aplicar repulsión si hay un compañero cerca
    if (companion) {
      const companionDx = entity.position.x - companion.position.x;
      const companionDy = entity.position.y - companion.position.y;
      const companionDistance = Math.sqrt(companionDx * companionDx + companionDy * companionDy);
      
      if (companionDistance < MOVEMENT_CONFIG.MIN_DISTANCE_BETWEEN_ENTITIES) {
        const repulsionForce = MOVEMENT_CONFIG.REPULSION_FORCE;
        newX += (companionDx / companionDistance) * repulsionForce;
        newY += (companionDy / companionDistance) * repulsionForce;
      } else {
        // Suave atracción hacia una distancia preferida (anillo)
        const preferred = 80;
        const diff = companionDistance - preferred;
        const k = 0.02; // fuerza suave
        newX -= (companionDx / companionDistance) * (k * diff);
        newY -= (companionDy / companionDistance) * (k * diff);
      }
    }

    // Verificar límites del canvas
    newX = Math.max(MOVEMENT_CONFIG.ENTITY_SIZE, Math.min(1000 - MOVEMENT_CONFIG.ENTITY_SIZE, newX));
    newY = Math.max(MOVEMENT_CONFIG.ENTITY_SIZE, Math.min(600 - MOVEMENT_CONFIG.ENTITY_SIZE, newY));

    // Verificar colisiones con obstáculos
    const newPosition = { x: newX, y: newY };
    if (checkCollisionWithObstacles(newPosition, MOVEMENT_CONFIG.ENTITY_SIZE, gameState.mapElements)) {
      // Si hay colisión, intentar moverse lateralmente
      const alternativeX = entity.position.x + dirY * entityMovementSpeed;
      const alternativeY = entity.position.y - dirX * entityMovementSpeed;
      
      const alternativePosition = { x: alternativeX, y: alternativeY };
      if (!checkCollisionWithObstacles(alternativePosition, MOVEMENT_CONFIG.ENTITY_SIZE, gameState.mapElements)) {
        return alternativePosition;
      }
      
      // Si tampoco funciona la alternativa, quedarse en posición actual
      return entity.position;
    }

    return newPosition;
  }, [gameState.mapElements]);

  useEffect(() => {
    function updateMovement() {
      const now = performance.now();
      
      // Throttling para optimización
      if (!shouldUpdateMovement()) {
        animationRef.current = requestAnimationFrame(updateMovement);
        return;
      }

      lastUpdateTime.current = now;

      measureExecutionTime('entity-movement-optimized', () => {
        const livingEntities = gameState.entities.filter(
          e => !e.isDead && e.state !== 'DEAD' && e.state !== 'FADING'
        );
        
        for (const entity of livingEntities) {
          const companion = livingEntities.find(e2 => e2.id !== entity.id) || null;
          
          // Decisión de IA para actividad (menos frecuente)
          if (now % 5000 < 100) { // Cada 5 segundos aproximadamente
            const newActivity = makeIntelligentDecision(
              entity,
              companion,
              now
            );
            
            if (newActivity !== entity.activity) {
              dispatch({
                type: 'UPDATE_ENTITY_ACTIVITY',
                payload: { entityId: entity.id, activity: newActivity }
              });
              
              // Limpiar objetivo anterior cuando cambia de actividad
              entityTargets.current.delete(entity.id);
            }
          }

          // Calcular objetivo de movimiento
          let target = entityTargets.current.get(entity.id);
          if (!target || Math.random() < 0.01) { // Recalcular objetivo ocasionalmente
            target = getEntityTarget(entity, gameState.zones, companion);
            if (target) {
              entityTargets.current.set(entity.id, target);
            }
          }
          
          // FIX EMERGENCIA: Movimiento aleatorio si no hay objetivo
          if (!target || Math.random() < 0.005) { // 0.5% chance de movimiento aleatorio
            target = {
              x: Math.random() * 800 + 100, // Área central del canvas
              y: Math.random() * 400 + 100
            };
            entityTargets.current.set(entity.id, target);
          }

          // Mover hacia el objetivo si existe
          if (target) {
            const newPosition = calculateMovementStep(entity, target, companion);
            
            // Solo actualizar si la posición cambió significativamente
            const moved = Math.abs(newPosition.x - entity.position.x) > 0.5 || 
                         Math.abs(newPosition.y - entity.position.y) > 0.5;
            
            if (moved) {
              dispatch({
                type: 'UPDATE_ENTITY_POSITION',
                payload: { entityId: entity.id, position: newPosition }
              });
            }
          }

          // Actualizar estado basado en zona actual
          const currentZone = getEntityZone(entity.position, gameState.zones);
          if (currentZone) {
            // La entidad está en una zona, puede cambiar estado a activo
            if (entity.state === 'SEEKING') {
              dispatch({
                type: 'UPDATE_ENTITY_STATE',
                payload: { entityId: entity.id, state: 'IDLE' }
              });
            }
          } else {
            // La entidad no está en ninguna zona, está buscando
            if (entity.state === 'IDLE') {
              dispatch({
                type: 'UPDATE_ENTITY_STATE',
                payload: { entityId: entity.id, state: 'SEEKING' }
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
  }, [gameState.entities, gameState.zones, gameState.resonance, gameState.mapElements, dispatch, calculateMovementStep, getEntityTarget]);
};
