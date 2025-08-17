/**
 * 🧠 SISTEMA DE MOVIMIENTO INTELIGENTE
 * 
 * Reemplaza useEntityMovementOptimized.ts eliminando problemas críticos:
 * - Elimina movimiento aleatorio de emergencia
 * - Implementa pathfinding inteligente
 * - Mejora lógica de navegación
 * - Usa constantes matemáticamente justificadas
 */

import { useState, useRef, useCallback } from 'react';
import type { Entity } from '../types';
import { MOVEMENT_DYNAMICS, PATHFINDING_CONFIG, ENTITY_PHYSICS } from '../constants/physicsAndMovement';
import { fixedMathUtils, vectorMath, type Vector2D } from '../utils/fixedMathPrecision';
import { personalityVariation } from '../utils/naturalVariability';
import { getGameConfig } from '../config/unifiedGameConfig';

// === INTERFACES ===

interface MovementTarget {
  position: Vector2D;
  type: 'zone' | 'companion' | 'wander' | 'flee';
  priority: number;
  arrivalRadius: number;
}

interface NavigationState {
  target: MovementTarget | null;
  path: Vector2D[];
  currentPathIndex: number;
  lastPathfindingTime: number;
  stuckCounter: number;
  lastPosition: Vector2D;
  velocityHistory: Vector2D[];
}

interface ObstacleInfo {
  position: Vector2D;
  radius: number;
  isStatic: boolean;
}

// === CONSTANTES DE NAVEGACIÓN ===

const NAVIGATION_CONSTANTS = {
  /** Tiempo mínimo entre cálculos de pathfinding (ms) */
  PATHFINDING_COOLDOWN: 500,
  
  /** Distancia mínima para considerar movimiento (evita oscilaciones) */
  MIN_MOVEMENT_THRESHOLD: 0.5,
  
  /** Número de frames para detectar estar "atascado" */
  STUCK_DETECTION_FRAMES: 30,
  
  /** Umbral de velocidad para considerar "atascado" */
  STUCK_VELOCITY_THRESHOLD: 1.0,
  
  /** Historia de velocidad para suavizado */
  VELOCITY_HISTORY_SIZE: 5,
  
  /** Peso del steering behavior vs pathfinding */
  STEERING_WEIGHT: 0.3,
  PATHFINDING_WEIGHT: 0.7,
  
  /** Radio de búsqueda para targets de vagabundeo */
  WANDER_SEARCH_RADIUS: 150,
  
  /** Distancia mínima a obstáculos */
  OBSTACLE_AVOIDANCE_DISTANCE: ENTITY_PHYSICS.SIZE * 2,
  
  /** Fuerza de evasión de obstáculos */
  OBSTACLE_AVOIDANCE_FORCE: 3.0,
  
  /** Fuerza de separación entre entidades */
  SEPARATION_FORCE: 2.0
} as const;

// === HOOK PRINCIPAL ===

export const useIntelligentMovement = (
  entities: Entity[],
  zones: Array<{ bounds: { x: number; y: number; width: number; height: number }; type: string }>,
  obstacles: Array<{ position: Vector2D; size: { width: number; height: number } }>
) => {
  const [navigationStates, setNavigationStates] = useState<Map<string, NavigationState>>(new Map());
  const frameCountRef = useRef(0);
  const config = getGameConfig();
  
  // === UTILIDADES DE PATHFINDING ===
  
  /**
   * Implementa A* simplificado para navegación
   * CORRIGIDO: Reemplaza el movimiento aleatorio con navegación inteligente
   */
  const findPath = useCallback((start: Vector2D, goal: Vector2D, obstacles: ObstacleInfo[]): Vector2D[] => {
    // Para distancias cortas, usar línea directa si no hay obstáculos
    const distance = vectorMath.distance(start, goal);
    if (distance < PATHFINDING_CONFIG.DIRECT_PATH_MAX_DISTANCE) {
      if (!hasObstacleInPath(start, goal, obstacles)) {
        return [goal];
      }
    }
    
    // Para esta versión simplificada, usar navegación por waypoints
    const waypoints = generateWaypoints(start, goal, obstacles);
    return waypoints.length > 0 ? waypoints : [goal];
  }, []);
  
  /**
   * Detecta si hay obstáculos en el camino directo
   */
  const hasObstacleInPath = useCallback((start: Vector2D, end: Vector2D, obstacles: ObstacleInfo[]): boolean => {
    return obstacles.some(obstacle => {
      return lineIntersectsCircle(start, end, obstacle.position, obstacle.radius);
    });
  }, []);
  
  /**
   * Genera waypoints para evitar obstáculos
   */
  const generateWaypoints = useCallback((start: Vector2D, goal: Vector2D, obstacles: ObstacleInfo[]): Vector2D[] => {
    const waypoints: Vector2D[] = [];
    let current = start;
    
    // Buscar obstáculos en el camino y generar waypoints para evitarlos
    for (const obstacle of obstacles) {
      if (lineIntersectsCircle(current, goal, obstacle.position, obstacle.radius + NAVIGATION_CONSTANTS.OBSTACLE_AVOIDANCE_DISTANCE)) {
        // Generar waypoint alrededor del obstáculo
        const avoidancePoint = generateAvoidanceWaypoint(current, goal, obstacle);
        if (avoidancePoint) {
          waypoints.push(avoidancePoint);
          current = avoidancePoint;
        }
      }
    }
    
    waypoints.push(goal);
    return waypoints;
  }, []);
  
  /**
   * Genera punto de evasión alrededor de obstáculo
   */
  const generateAvoidanceWaypoint = useCallback((
    start: Vector2D, 
    goal: Vector2D, 
    obstacle: ObstacleInfo
  ): Vector2D | null => {
    const toObstacle = vectorMath.normalize({
      x: obstacle.position.x - start.x,
      y: obstacle.position.y - start.y
    });
    
    // Generar punto perpendicular al obstáculo
    const perpendicular = { x: -toObstacle.y, y: toObstacle.x };
    const avoidanceRadius = obstacle.radius + NAVIGATION_CONSTANTS.OBSTACLE_AVOIDANCE_DISTANCE;
    
    // Probar ambos lados del obstáculo
    const side1 = {
      x: obstacle.position.x + perpendicular.x * avoidanceRadius,
      y: obstacle.position.y + perpendicular.y * avoidanceRadius
    };
    
    const side2 = {
      x: obstacle.position.x - perpendicular.x * avoidanceRadius,
      y: obstacle.position.y - perpendicular.y * avoidanceRadius
    };
    
    // Elegir el lado más cercano al objetivo
    const dist1 = vectorMath.distance(side1, goal);
    const dist2 = vectorMath.distance(side2, goal);
    
    return dist1 < dist2 ? side1 : side2;
  }, []);
  
  // === STEERING BEHAVIORS ===
  
  /**
   * Comportamiento de búsqueda hacia un objetivo
   */
  const seek = useCallback((entity: Entity, target: Vector2D): Vector2D => {
    const desired = vectorMath.normalize({
      x: target.x - entity.position.x,
      y: target.y - entity.position.y
    });
    
    return {
      x: desired.x * MOVEMENT_DYNAMICS.BASE_MOVEMENT_SPEED,
      y: desired.y * MOVEMENT_DYNAMICS.BASE_MOVEMENT_SPEED
    };
  }, []);
  
  /**
   * Comportamiento de evasión de obstáculos
   * CORRIGIDO: Lógica determinista sin aleatoriedad
   */
  const avoidObstacles = useCallback((entity: Entity, obstacles: ObstacleInfo[]): Vector2D => {
    let avoidanceForce = { x: 0, y: 0 };
    
    for (const obstacle of obstacles) {
      const distance = vectorMath.distance(entity.position, obstacle.position);
      const minDistance = obstacle.radius + NAVIGATION_CONSTANTS.OBSTACLE_AVOIDANCE_DISTANCE;
      
      if (distance < minDistance && distance > 0) {
        // Vector de escape (lejos del obstáculo)
        const escape = vectorMath.normalize({
          x: entity.position.x - obstacle.position.x,
          y: entity.position.y - obstacle.position.y
        });
        
        // Fuerza inversamente proporcional a la distancia
        const force = (minDistance - distance) / minDistance * NAVIGATION_CONSTANTS.OBSTACLE_AVOIDANCE_FORCE;
        
        avoidanceForce.x += escape.x * force;
        avoidanceForce.y += escape.y * force;
      }
    }
    
    return avoidanceForce;
  }, []);
  
  /**
   * Comportamiento de separación entre entidades
   * CORRIGIDO: Usa distancia mínima de las constantes físicas
   */
  const separate = useCallback((entity: Entity, neighbors: Entity[]): Vector2D => {
    let separationForce = { x: 0, y: 0 };
    let count = 0;
    
    for (const neighbor of neighbors) {
      if (neighbor.id === entity.id || neighbor.isDead) continue;
      
      const distance = vectorMath.distance(entity.position, neighbor.position);
      const minDistance = MOVEMENT_DYNAMICS.MIN_DISTANCE_BETWEEN_ENTITIES;
      
      if (distance < minDistance && distance > 0) {
        // Vector de separación
        const separation = vectorMath.normalize({
          x: entity.position.x - neighbor.position.x,
          y: entity.position.y - neighbor.position.y
        });
        
        // Fuerza inversamente proporcional a la distancia
        const force = (minDistance - distance) / minDistance * NAVIGATION_CONSTANTS.SEPARATION_FORCE;
        
        separationForce.x += separation.x * force;
        separationForce.y += separation.y * force;
        count++;
      }
    }
    
    if (count > 0) {
      separationForce.x /= count;
      separationForce.y /= count;
    }
    
    return separationForce;
  }, []);
  
  /**
   * Comportamiento de vagabundeo con personalidad natural
   * BALANCEADO: Combina exploración sistemática con variaciones de personalidad
   */
  const intelligentWander = useCallback((entity: Entity): Vector2D => {
    const time = performance.now() / 1000;
    const entitySeed = entity.id === 'circle' ? 1 : 2;
    
    // Base determinista para exploración sistemática
    const baseNoiseX = fixedMathUtils.deterministicNoise(
      entity.position.x * 0.01 + time * 0.05, 
      entitySeed
    );
    const baseNoiseY = fixedMathUtils.deterministicNoise(
      entity.position.y * 0.01 + time * 0.05, 
      entitySeed + 10
    );
    
    // Agregar variación de personalidad para comportamiento único por entidad
    const personalityX = personalityVariation(time * 100, entity.id) * 0.3;
    const personalityY = personalityVariation(time * 100 + 50, entity.id) * 0.3;
    
    // Combinar base determinista con personalidad
    const exploreDirection = vectorMath.normalize({
      x: baseNoiseX + (personalityX - 0.15),
      y: baseNoiseY + (personalityY - 0.15)
    });
    
    // Radio de búsqueda con variación personal
    const personalRadius = NAVIGATION_CONSTANTS.WANDER_SEARCH_RADIUS * (0.7 + personalityVariation(entity.position.x, entity.id) * 0.6);
    
    const wanderTarget = {
      x: entity.position.x + exploreDirection.x * personalRadius,
      y: entity.position.y + exploreDirection.y * personalRadius
    };
    
    return seek(entity, wanderTarget);
  }, [seek]);
  
  // === FUNCIÓN PRINCIPAL DE MOVIMIENTO ===
  
  /**
   * Calcula la nueva posición de una entidad
   * CORRIGIDO: Elimina movimiento aleatorio, usa navegación inteligente
   */
  const calculateNewPosition = useCallback((entity: Entity, deltaTime: number): Vector2D => {
    if (entity.isDead) return entity.position;
    
    frameCountRef.current++;
    const currentTime = performance.now();
    
    // Obtener o crear estado de navegación
    let navState = navigationStates.get(entity.id);
    if (!navState) {
      navState = {
        target: null,
        path: [],
        currentPathIndex: 0,
        lastPathfindingTime: 0,
        stuckCounter: 0,
        lastPosition: { ...entity.position },
        velocityHistory: []
      };
      setNavigationStates(prev => new Map(prev.set(entity.id, navState!)));
    }
    
    // Detectar si está atascado
    const movement = vectorMath.distance(entity.position, navState.lastPosition);
    if (movement < NAVIGATION_CONSTANTS.MIN_MOVEMENT_THRESHOLD) {
      navState.stuckCounter++;
    } else {
      navState.stuckCounter = 0;
    }
    
    const isStuck = navState.stuckCounter > NAVIGATION_CONSTANTS.STUCK_DETECTION_FRAMES;
    
    // Determinar objetivo según actividad
    let targetPosition: Vector2D | null = null;
    
    if (entity.activity === 'SOCIALIZING') {
      // Buscar compañero
      const companion = entities.find(e => e.id !== entity.id && !e.isDead);
      if (companion) {
        targetPosition = companion.position;
      }
    } else if (entity.activity !== 'WANDERING') {
      // Buscar zona apropiada
      const targetZone = zones.find(zone => {
        // Mapeo simplificado de actividad a zona
        const zoneMap: Record<string, string> = {
          'RESTING': 'rest',
          'WORKING': 'work',
          'SOCIALIZING': 'social',
          'MEDITATING': 'comfort'
        };
        return zone.type === zoneMap[entity.activity];
      });
      
      if (targetZone) {
        targetPosition = {
          x: targetZone.bounds.x + targetZone.bounds.width / 2,
          y: targetZone.bounds.y + targetZone.bounds.height / 2
        };
      }
    }
    
    // Convertir obstáculos al formato esperado
    const obstacleInfo: ObstacleInfo[] = obstacles.map(obs => ({
      position: obs.position,
      radius: Math.max(obs.size.width, obs.size.height) / 2,
      isStatic: true
    }));
    
    // Agregar otras entidades como obstáculos dinámicos
    entities.forEach(other => {
      if (other.id !== entity.id && !other.isDead) {
        obstacleInfo.push({
          position: other.position,
          radius: ENTITY_PHYSICS.SIZE,
          isStatic: false
        });
      }
    });
    
    // Calcular fuerzas de steering
    let steeringForce = { x: 0, y: 0 };
    
    if (targetPosition) {
      // Seguir objetivo con pathfinding si es necesario
      const distance = vectorMath.distance(entity.position, targetPosition);
      
      if (distance > PATHFINDING_CONFIG.ARRIVAL_THRESHOLD) {
        // Recalcular path si es necesario
        if (!navState.target || 
            vectorMath.distance(navState.target.position, targetPosition) > 50 ||
            currentTime - navState.lastPathfindingTime > NAVIGATION_CONSTANTS.PATHFINDING_COOLDOWN ||
            isStuck) {
          
          navState.path = findPath(entity.position, targetPosition, obstacleInfo);
          navState.currentPathIndex = 0;
          navState.lastPathfindingTime = currentTime;
          navState.target = {
            position: targetPosition,
            type: entity.activity === 'SOCIALIZING' ? 'companion' : 'zone',
            priority: 1,
            arrivalRadius: PATHFINDING_CONFIG.ARRIVAL_THRESHOLD
          };
        }
        
        // Seguir el path
        if (navState.path.length > 0) {
          const currentWaypoint = navState.path[navState.currentPathIndex];
          const waypointDistance = vectorMath.distance(entity.position, currentWaypoint);
          
          if (waypointDistance < PATHFINDING_CONFIG.ARRIVAL_THRESHOLD && 
              navState.currentPathIndex < navState.path.length - 1) {
            navState.currentPathIndex++;
          }
          
          const seekForce = seek(entity, navState.path[navState.currentPathIndex]);
          steeringForce.x += seekForce.x * NAVIGATION_CONSTANTS.PATHFINDING_WEIGHT;
          steeringForce.y += seekForce.y * NAVIGATION_CONSTANTS.PATHFINDING_WEIGHT;
        }
      }
    } else {
      // Sin objetivo específico, explorar inteligentemente
      const wanderForce = intelligentWander(entity);
      steeringForce.x += wanderForce.x * 0.5;
      steeringForce.y += wanderForce.y * 0.5;
    }
    
    // Aplicar fuerzas de evasión
    const avoidance = avoidObstacles(entity, obstacleInfo);
    steeringForce.x += avoidance.x * NAVIGATION_CONSTANTS.STEERING_WEIGHT;
    steeringForce.y += avoidance.y * NAVIGATION_CONSTANTS.STEERING_WEIGHT;
    
    // Aplicar separación de entidades
    const separation = separate(entity, entities);
    steeringForce.x += separation.x * NAVIGATION_CONSTANTS.STEERING_WEIGHT;
    steeringForce.y += separation.y * NAVIGATION_CONSTANTS.STEERING_WEIGHT;
    
    // Normalizar y aplicar velocidad máxima
    const steeringMagnitude = vectorMath.magnitude(steeringForce);
    if (steeringMagnitude > MOVEMENT_DYNAMICS.BASE_MOVEMENT_SPEED) {
      const normalized = vectorMath.normalize(steeringForce);
      steeringForce.x = normalized.x * MOVEMENT_DYNAMICS.BASE_MOVEMENT_SPEED;
      steeringForce.y = normalized.y * MOVEMENT_DYNAMICS.BASE_MOVEMENT_SPEED;
    }
    
    // Aplicar movimiento con suavizado temporal
    const speedMultiplier = config.timing.gameSpeedMultiplier;
    const normalizedDelta = deltaTime / 1000; // Convertir a segundos
    
    const newPosition = {
      x: entity.position.x + steeringForce.x * normalizedDelta * speedMultiplier,
      y: entity.position.y + steeringForce.y * normalizedDelta * speedMultiplier
    };
    
    // Aplicar límites del mundo
    const margin = 20;
    newPosition.x = fixedMathUtils.safeClamp(newPosition.x, margin, 1000 - margin);
    newPosition.y = fixedMathUtils.safeClamp(newPosition.y, margin, 600 - margin);
    
    // Actualizar estado de navegación
    navState.lastPosition = { ...entity.position };
    
    return newPosition;
  }, [
    navigationStates, 
    entities, 
    zones, 
    obstacles, 
    findPath, 
    seek, 
    avoidObstacles, 
    separate, 
    intelligentWander,
    config.timing.gameSpeedMultiplier
  ]);
  
  // === UTILIDADES AUXILIARES ===
  
  const lineIntersectsCircle = (start: Vector2D, end: Vector2D, center: Vector2D, radius: number): boolean => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const fx = start.x - center.x;
    const fy = start.y - center.y;
    
    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - radius * radius;
    
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return false;
    
    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    
    return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
  };
  
  return {
    calculateNewPosition,
    navigationStates: Array.from(navigationStates.entries())
  };
};

export default useIntelligentMovement;