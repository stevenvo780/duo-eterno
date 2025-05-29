import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import { checkCollisionWithObstacles } from '../utils/mapGeneration';
import { gameConfig, getGameIntervals } from '../config/gameConfig';
import type { EntityStats, EntityActivity, Zone, Entity } from '../types';
import type { GameAction } from '../state/GameContext';

// Sistema de prioridades para supervivencia
interface SurvivalPriority {
  type: 'CRITICAL_STAT' | 'LOW_RESONANCE' | 'COMPANION_SEEK' | 'ZONE_NEED' | 'EXPLORE';
  urgency: number; // 0-1, donde 1 es máxima urgencia
  target?: { x: number; y: number };
  statType?: keyof EntityStats;
  zone?: Zone;
}

// Umbrales críticos para supervivencia
const CRITICAL_THRESHOLD = 85;
const URGENT_THRESHOLD = 70;
const COMPANION_SEEK_DISTANCE = 200;
const RESONANCE_CRITICAL = 30;
const RESONANCE_LOW = 50;

// Constantes para anti-colisión
const ENTITY_SIZE = 16;
const MIN_DISTANCE_BETWEEN_ENTITIES = 25; // Distancia mínima entre agentes
const REPULSION_FORCE = 2; // Fuerza de repulsión cuando están muy cerca

// Mapeo de necesidades a tipos de zona (agregar money)
const NEED_TO_ZONE_TYPE: Record<keyof EntityStats, string> = {
  hunger: 'food',
  sleepiness: 'rest', 
  boredom: 'play',
  loneliness: 'social',
  happiness: 'comfort',
  energy: 'rest',
  money: 'social' // Agregar mapeo para money
};

// Función para encontrar la zona más cercana de un tipo específico
const findNearestZoneOfType = (
  position: { x: number; y: number },
  zones: Zone[],
  zoneType: string
): Zone | null => {
  let nearestZone: Zone | null = null;
  let minDistance = Infinity;

  for (const zone of zones) {
    if (zone.type === zoneType) {
      const zoneCenterX = zone.bounds.x + zone.bounds.width / 2;
      const zoneCenterY = zone.bounds.y + zone.bounds.height / 2;
      const distance = Math.sqrt(
        Math.pow(position.x - zoneCenterX, 2) + 
        Math.pow(position.y - zoneCenterY, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestZone = zone;
      }
    }
  }

  return nearestZone;
};

// Función para evaluar prioridades de supervivencia con persistencia
const evaluateSurvivalPriorities = (
  entity: Entity,
  companion: Entity | null,
  zones: Zone[],
  resonance: number
): SurvivalPriority[] => {
  const priorities: SurvivalPriority[] = [];
  const { stats, position } = entity;

  // 1. PRIORIDAD CRÍTICA: Estadísticas en nivel crítico (>85) - PESO ALTO
  Object.entries(stats).forEach(([statKey, value]) => {
    if (value > CRITICAL_THRESHOLD) {
      const zoneType = NEED_TO_ZONE_TYPE[statKey as keyof EntityStats];
      const targetZone = findNearestZoneOfType(position, zones, zoneType);
      
      if (targetZone) {
        // Peso extra alto para necesidades críticas
        const urgencyBonus = (value - CRITICAL_THRESHOLD) / (100 - CRITICAL_THRESHOLD);
        priorities.push({
          type: 'CRITICAL_STAT',
          urgency: 0.9 + (urgencyBonus * 0.1), // Entre 0.9 y 1.0
          target: {
            x: targetZone.bounds.x + targetZone.bounds.width / 2,
            y: targetZone.bounds.y + targetZone.bounds.height / 2
          },
          statType: statKey as keyof EntityStats,
          zone: targetZone
        });
      }
    }
  });

  // 2. PRIORIDAD ALTA: Vínculo crítico - pero solo si no hay necesidades vitales
  const hasVitalNeeds = Object.entries(stats).some(([, value]) => value > 90);
  if (resonance < RESONANCE_CRITICAL && companion && !companion.isDead && !hasVitalNeeds) {
    priorities.push({
      type: 'LOW_RESONANCE',
      urgency: 0.8 - (resonance / RESONANCE_CRITICAL) * 0.2, // Entre 0.6 y 0.8
      target: { x: companion.position.x, y: companion.position.y }
    });
  }

  // 3. PRIORIDAD MEDIA: Buscar compañero cuando está lejos (pero menos urgente)
  if (companion && !companion.isDead && !hasVitalNeeds) {
    const companionDistance = Math.sqrt(
      Math.pow(position.x - companion.position.x, 2) +
      Math.pow(position.y - companion.position.y, 2)
    );

    if (companionDistance > COMPANION_SEEK_DISTANCE && 
        (resonance < RESONANCE_LOW || stats.loneliness > URGENT_THRESHOLD)) {
      priorities.push({
        type: 'COMPANION_SEEK',
        urgency: 0.5 + Math.min(0.3, (companionDistance / (COMPANION_SEEK_DISTANCE * 3)) + (stats.loneliness / 200)),
        target: { x: companion.position.x, y: companion.position.y }
      });
    }
  }

  // 4. PRIORIDAD MEDIA: Estadísticas urgentes (>70) - pero peso menor que críticas
  Object.entries(stats).forEach(([statKey, value]) => {
    if (value > URGENT_THRESHOLD && value <= CRITICAL_THRESHOLD) {
      const zoneType = NEED_TO_ZONE_TYPE[statKey as keyof EntityStats];
      const targetZone = findNearestZoneOfType(position, zones, zoneType);
      
      if (targetZone) {
        // Urgencia escalada pero menor que crítica
        const urgencyLevel = ((value - URGENT_THRESHOLD) / (CRITICAL_THRESHOLD - URGENT_THRESHOLD)) * 0.4 + 0.3;
        priorities.push({
          type: 'ZONE_NEED',
          urgency: urgencyLevel, // Entre 0.3 y 0.7
          target: {
            x: targetZone.bounds.x + targetZone.bounds.width / 2,
            y: targetZone.bounds.y + targetZone.bounds.height / 2
          },
          statType: statKey as keyof EntityStats,
          zone: targetZone
        });
      }
    }
  });

  // 5. PRIORIDAD BAJA: Exploración solo cuando todo está relativamente bien
  if (priorities.length === 0 || priorities.every(p => p.urgency < 0.4)) {
    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    if (randomZone) {
      priorities.push({
        type: 'EXPLORE',
        urgency: 0.1 + Math.random() * 0.2, // Entre 0.1 y 0.3
        target: {
          x: randomZone.bounds.x + randomZone.bounds.width / 2,
          y: randomZone.bounds.y + randomZone.bounds.height / 2
        },
        zone: randomZone
      });
    }
  }

  // Ordenar por urgencia y tomar solo las más importantes para evitar indecisión
  return priorities
    .sort((a, b) => b.urgency - a.urgency)
    .slice(0, 3); // Máximo 3 prioridades para evitar conflictos
};

// Función para actualizar actividad basada en prioridad actual
const updateActivityBasedOnPriority = (
  entity: Entity,
  priority: SurvivalPriority,
  dispatch: React.Dispatch<GameAction>
) => {
  let newActivity: EntityActivity = entity.activity;

  switch (priority.type) {
    case 'CRITICAL_STAT':
    case 'ZONE_NEED':
      if (priority.statType === 'hunger') newActivity = 'EXPLORING';
      else if (priority.statType === 'sleepiness') newActivity = 'RESTING';
      else if (priority.statType === 'boredom') newActivity = 'DANCING';
      else if (priority.statType === 'loneliness') newActivity = 'SOCIALIZING';
      else if (priority.statType === 'happiness') newActivity = 'CONTEMPLATING';
      break;
      
    case 'LOW_RESONANCE':
    case 'COMPANION_SEEK':
      newActivity = 'SOCIALIZING';
      break;
      
    case 'EXPLORE':
      newActivity = 'WANDERING';
      break;
  }

  if (newActivity !== entity.activity) {
    dispatch({
      type: 'UPDATE_ENTITY_ACTIVITY',
      payload: { entityId: entity.id, activity: newActivity }
    });
  }
};

// Función para aplicar repulsión entre agentes
const applyEntityRepulsion = (
  entity: Entity,
  otherEntities: Entity[]
): { x: number; y: number } => {
  let repulsionX = 0;
  let repulsionY = 0;
  
  for (const other of otherEntities) {
    if (other.id === entity.id || other.isDead) continue;
    
    const dx = entity.position.x - other.position.x;
    const dy = entity.position.y - other.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Si están demasiado cerca, aplicar repulsión
    if (distance < MIN_DISTANCE_BETWEEN_ENTITIES && distance > 0) {
      const repulsionStrength = (MIN_DISTANCE_BETWEEN_ENTITIES - distance) / MIN_DISTANCE_BETWEEN_ENTITIES;
      const normalizedX = dx / distance;
      const normalizedY = dy / distance;
      
      repulsionX += normalizedX * repulsionStrength * REPULSION_FORCE;
      repulsionY += normalizedY * repulsionStrength * REPULSION_FORCE;
    }
  }
  
  return { x: repulsionX, y: repulsionY };
};

// Función para verificar si una posición está libre de colisiones con otros agentes
const isPositionFreeFromEntities = (
  position: { x: number; y: number },
  entityId: string,
  entities: Entity[]
): boolean => {
  for (const entity of entities) {
    if (entity.id === entityId || entity.isDead) continue;
    
    const dx = position.x - entity.position.x;
    const dy = position.y - entity.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < MIN_DISTANCE_BETWEEN_ENTITIES) {
      return false;
    }
  }
  return true;
};

// Función para encontrar posición alternativa libre
const findAlternativePosition = (
  currentPos: { x: number; y: number },
  targetPos: { x: number; y: number },
  entityId: string,
  entities: Entity[],
  canvasWidth: number,
  canvasHeight: number,
  margin: number
): { x: number; y: number } => {
  // Intentar posiciones alrededor del objetivo
  const attempts = 8;
  const radius = MIN_DISTANCE_BETWEEN_ENTITIES + 5;
  
  for (let i = 0; i < attempts; i++) {
    const angle = (i / attempts) * Math.PI * 2;
    const testPos = {
      x: Math.max(margin, Math.min(canvasWidth - margin, 
          targetPos.x + Math.cos(angle) * radius)),
      y: Math.max(margin, Math.min(canvasHeight - margin, 
          targetPos.y + Math.sin(angle) * radius))
    };
    
    if (isPositionFreeFromEntities(testPos, entityId, entities)) {
      return testPos;
    }
  }
  
  // Si no encuentra posición libre, mantener distancia del objetivo original
  const dx = currentPos.x - targetPos.x;
  const dy = currentPos.y - targetPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > 0) {
    const moveDistance = Math.min(2, MIN_DISTANCE_BETWEEN_ENTITIES - distance + 5);
    return {
      x: Math.max(margin, Math.min(canvasWidth - margin,
          currentPos.x + (dx / distance) * moveDistance)),
      y: Math.max(margin, Math.min(canvasHeight - margin,
          currentPos.y + (dy / distance) * moveDistance))
    };
  }
  
  return currentPos;
};

// Pathfinding mejorado hacia un objetivo con anti-colisión
const moveTowardsTarget = (
  currentPos: { x: number; y: number },
  target: { x: number; y: number },
  speed: number,
  urgency: number,
  entityId: string,
  allEntities: Entity[]
): { x: number; y: number } => {
  const dx = target.x - currentPos.x;
  const dy = target.y - currentPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < speed) {
    // Verificar si la posición objetivo está libre
    if (isPositionFreeFromEntities(target, entityId, allEntities)) {
      return { x: target.x, y: target.y };
    } else {
      // Buscar posición alternativa cerca del objetivo
      return findAlternativePosition(
        currentPos, target, entityId, allEntities,
        800, 600, 20 // canvasWidth, canvasHeight, margin
      );
    }
  }

  // Aplicar urgencia al speed (más urgente = más rápido)
  const urgentSpeed = speed * (1 + urgency * 2);
  
  let newPos = {
    x: currentPos.x + (dx / distance) * urgentSpeed,
    y: currentPos.y + (dy / distance) * urgentSpeed
  };
  
  // Verificar si la nueva posición causa colisión con otros agentes
  if (!isPositionFreeFromEntities(newPos, entityId, allEntities)) {
    // Aplicar repulsión para evitar colisión
    const repulsion = applyEntityRepulsion(
      { ...allEntities.find(e => e.id === entityId)!, position: currentPos },
      allEntities
    );
    
    // Combinar movimiento hacia objetivo con repulsión
    newPos = {
      x: currentPos.x + (dx / distance) * urgentSpeed * 0.5 + repulsion.x,
      y: currentPos.y + (dy / distance) * urgentSpeed * 0.5 + repulsion.y
    };
    
    // Verificar nuevamente y ajustar si es necesario
    if (!isPositionFreeFromEntities(newPos, entityId, allEntities)) {
      // Moverse perpendicular al objetivo para evitar bloqueo
      const perpAngle = Math.atan2(dy, dx) + Math.PI / 2;
      newPos = {
        x: currentPos.x + Math.cos(perpAngle) * urgentSpeed,
        y: currentPos.y + Math.sin(perpAngle) * urgentSpeed
      };
    }
  }
  
  return newPos;
};

export const useEntityMovement = () => {
  const { gameState, dispatch } = useGame();
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0);
  const entityPriorities = useRef<Map<string, SurvivalPriority[]>>(new Map());
  const priorityUpdateCounter = useRef<number>(0);

  const updateMovement = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastUpdateTime.current;
    
    // Usar FPS objetivo de configuración
    const targetFrameTime = 1000 / gameConfig.movementUpdateFPS;
    if (deltaTime < targetFrameTime) {
      animationRef.current = requestAnimationFrame(updateMovement);
      return;
    }

    lastUpdateTime.current = now;
    priorityUpdateCounter.current++;

    // Actualizar prioridades menos frecuentemente para mayor estabilidad
    const shouldUpdatePriorities = priorityUpdateCounter.current % 8 === 0; // Cada 8 frames

    const livingEntities = gameState.entities.filter(entity => 
      !entity.isDead && entity.state !== 'DEAD'
    );

    if (livingEntities.length === 0) {
      animationRef.current = requestAnimationFrame(updateMovement);
      return;
    }

    const canvasWidth = 800;
    const canvasHeight = 600;
    const margin = 20;

    // Procesar cada entidad
    for (const entity of livingEntities) {
      // Encontrar compañero
      const companion = livingEntities.find(e => e.id !== entity.id) || null;

      // Actualizar prioridades con menor frecuencia para mayor persistencia
      if (shouldUpdatePriorities || !entityPriorities.current.has(entity.id)) {
        const priorities = evaluateSurvivalPriorities(
          entity,
          companion,
          gameState.zones || [],
          gameState.resonance
        );
        entityPriorities.current.set(entity.id, priorities);
        
        if (gameConfig.debugMode && priorities.length > 0) {
          console.log(`🎯 ${entity.id} prioridades:`, priorities.map(p => `${p.type}(${p.urgency.toFixed(2)})`).join(', '));
        }
      }

      const priorities = entityPriorities.current.get(entity.id) || [];
      
      // Calcular nuevo movimiento con persistencia mejorada
      let newPosition = { ...entity.position };
      
      // Calcular velocidad basada en la velocidad global y urgencia
      const { entityMovementSpeed } = getGameIntervals();
      let speed = entityMovementSpeed;

      // Aplicar repulsión básica entre agentes cuando están muy cerca
      const repulsion = applyEntityRepulsion(entity, livingEntities);
      
      if (priorities.length > 0) {
        // Tomar la prioridad más urgente pero con inercia
        const currentPriority = priorities[0];
        
        // Actualizar actividad basada en la prioridad (menos frecuente)
        if (shouldUpdatePriorities) {
          updateActivityBasedOnPriority(entity, currentPriority, dispatch);
        }

        // Aplicar multiplicador de velocidad más suave basado en urgencia
        const urgencyMultiplier = 1 + (currentPriority.urgency * 1.5); // Reducido de 2 a 1.5
        speed *= urgencyMultiplier;

        // Mover hacia el objetivo con mejor persistencia
        if (currentPriority.target) {
          const targetDistance = Math.sqrt(
            Math.pow(entity.position.x - currentPriority.target.x, 2) +
            Math.pow(entity.position.y - currentPriority.target.y, 2)
          );

          // Distancia mínima ajustada por tipo de prioridad
          let minDistance = 25;
          if (currentPriority.type === 'COMPANION_SEEK' || currentPriority.type === 'LOW_RESONANCE') {
            minDistance = MIN_DISTANCE_BETWEEN_ENTITIES + 15; // Más espacio personal
          } else if (currentPriority.type === 'CRITICAL_STAT') {
            minDistance = 15; // Más cerca para necesidades críticas
          }

          // Solo moverse si no está muy cerca del objetivo
          if (targetDistance > minDistance) {
            newPosition = moveTowardsTarget(
              entity.position,
              currentPriority.target,
              speed,
              currentPriority.urgency,
              entity.id,
              livingEntities
            );

            // Actualizar estado con menos frecuencia para más estabilidad
            if (shouldUpdatePriorities) {
              let newState = entity.state;
              if (currentPriority.type === 'LOW_RESONANCE') {
                newState = 'LOW_RESONANCE';
              } else if (currentPriority.type === 'COMPANION_SEEK') {
                newState = 'SEEKING';
              } else if (currentPriority.type === 'CRITICAL_STAT') {
                newState = 'SEEKING';
              } else {
                newState = 'IDLE';
              }

              if (newState !== entity.state) {
                dispatch({
                  type: 'UPDATE_ENTITY_STATE',
                  payload: { entityId: entity.id, state: newState }
                });
              }
            }
          } else {
            // Ha llegado al objetivo, aplicar solo repulsión suave
            if (repulsion.x !== 0 || repulsion.y !== 0) {
              newPosition = {
                x: entity.position.x + repulsion.x * 0.5, // Repulsión más suave
                y: entity.position.y + repulsion.y * 0.5
              };
            }
          }
        } else {
          // Sin objetivo específico, aplicar solo repulsión mínima
          newPosition = {
            x: entity.position.x + repulsion.x * 0.3,
            y: entity.position.y + repulsion.y * 0.3
          };
        }
      } else {
        // Sin prioridades, movimiento muy sutil
        newPosition = {
          x: entity.position.x + repulsion.x * 0.2,
          y: entity.position.y + repulsion.y * 0.2
        };
        
        // Movimiento aleatorio mucho más ocasional
        if (Math.random() < 0.005) { // Reducido de 0.01 a 0.005
          const randomAngle = Math.random() * Math.PI * 2;
          const randomSpeed = Math.random() * 0.3; // Reducido
          newPosition.x += Math.cos(randomAngle) * randomSpeed;
          newPosition.y += Math.sin(randomAngle) * randomSpeed;
        }
      }

      // Verificar colisiones con obstáculos
      const positionChanged = Math.abs(newPosition.x - entity.position.x) > 0.1 || 
                             Math.abs(newPosition.y - entity.position.y) > 0.1;

      if (positionChanged && gameState.mapElements && 
          checkCollisionWithObstacles(newPosition, ENTITY_SIZE, gameState.mapElements)) {
        // Buscar ruta alternativa que no cause colisión con obstáculos ni otros agentes
        const angles = [Math.PI/4, -Math.PI/4, Math.PI/2, -Math.PI/2, 3*Math.PI/4, -3*Math.PI/4];
        let foundAlternative = false;
        
        for (const angle of angles) {
          const testPosition = {
            x: entity.position.x + Math.cos(angle) * speed * 2,
            y: entity.position.y + Math.sin(angle) * speed * 2
          };
          
          // Verificar que no colisione con obstáculos ni otros agentes
          if (!checkCollisionWithObstacles(testPosition, ENTITY_SIZE, gameState.mapElements) &&
              isPositionFreeFromEntities(testPosition, entity.id, livingEntities)) {
            newPosition = testPosition;
            foundAlternative = true;
            break;
          }
        }
        
        if (!foundAlternative) {
          // Si no puede moverse sin colisionar, aplicar solo repulsión mínima
          newPosition = {
            x: entity.position.x + repulsion.x * 0.5,
            y: entity.position.y + repulsion.y * 0.5
          };
        }
      } else if (positionChanged) {
        // Verificar colisión final con otros agentes antes de confirmar movimiento
        if (!isPositionFreeFromEntities(newPosition, entity.id, livingEntities)) {
          // Reducir el movimiento para evitar colisión
          const factor = 0.5;
          newPosition = {
            x: entity.position.x + (newPosition.x - entity.position.x) * factor,
            y: entity.position.y + (newPosition.y - entity.position.y) * factor
          };
        }
      }

      // Restricciones de límites
      newPosition.x = Math.max(margin, Math.min(canvasWidth - margin, newPosition.x));
      newPosition.y = Math.max(margin, Math.min(canvasHeight - margin, newPosition.y));

      // Actualizar posición solo si cambió significativamente
      if (Math.abs(newPosition.x - entity.position.x) > 0.1 || 
          Math.abs(newPosition.y - entity.position.y) > 0.1) {
        dispatch({
          type: 'UPDATE_ENTITY_POSITION',
          payload: { entityId: entity.id, position: newPosition }
        });
      }
    }

    animationRef.current = requestAnimationFrame(updateMovement);
  }, [gameState.entities, gameState.resonance, gameState.zones, gameState.mapElements, dispatch]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(updateMovement);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateMovement]);
};
