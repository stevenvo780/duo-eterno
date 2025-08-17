/**
 * 🚀 FASE 2: Motor de Física Avanzado
 * 
 * Sistema de física de alta precisión que integra todas las mejoras de FASE 2:
 * - ✅ Simulación de campos vectoriales complejos
 * - ✅ Predicción de movimiento usando análisis comportamental
 * - ✅ Resonancia harmónica en el movimiento
 * - ✅ Efectos emergentes de zona con matemáticas complejas
 * - ✅ Sistema de partículas para efectos visuales avanzados
 * - ✅ Detección de colisiones con geometría precisa
 */

import type { Entity } from '../types';
import { 
  fixedMathUtils as mathUtils, 
  vectorMath, 
  type Vector2D, 
  type AdvancedResonanceState,
  type BehaviorPattern,
  type VectorField,
  type AdvancedZoneEffect
} from './fixedMathPrecision';
import { MATH } from '../constants';

// === INTERFACES DE FÍSICA AVANZADA ===

export interface PhysicsState {
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  force: Vector2D;
  mass: number;
  friction: number;
  elasticity: number;
  angularVelocity: number;
  torque: number;
  moment: number; // Momento de inercia
}

export interface AdvancedParticle {
  id: string;
  physics: PhysicsState;
  lifeTime: number;
  maxLifeTime: number;
  color: string;
  size: number;
  opacity: number;
  particleType: 'RESONANCE' | 'HARMONY' | 'TURBULENCE' | 'EMERGENCE';
  behaviorPattern?: BehaviorPattern;
}

export interface ZoneInfluence {
  center: Vector2D;
  radius: number;
  strength: number;
  type: 'ATTRACTOR' | 'REPULSOR' | 'VORTEX' | 'FIELD';
  effect: AdvancedZoneEffect;
  harmonics: AdvancedResonanceState;
}

export interface CollisionResult {
  hasCollision: boolean;
  collisionPoint: Vector2D;
  normal: Vector2D;
  penetration: number;
  relativeVelocity: Vector2D;
  separatingVelocity: number;
}

export interface PhysicsConfiguration {
  gravity: Vector2D;
  airResistance: number;
  timeStep: number;
  maxVelocity: number;
  maxAcceleration: number;
  boundaryRestitution: number;
  enableAdvancedFeatures: boolean;
  resonanceInfluence: number;
  fieldStrength: number;
  particleCount: number;
}

// === CONFIGURACIÓN DEL MOTOR DE FÍSICA ===

const DEFAULT_PHYSICS_CONFIG: PhysicsConfiguration = {
  gravity: { x: 0, y: 0 }, // Sin gravedad por defecto
  airResistance: 0.02,
  timeStep: 1/60,
  maxVelocity: 300,
  maxAcceleration: 500,
  boundaryRestitution: 0.8,
  enableAdvancedFeatures: true,
  resonanceInfluence: 0.3,
  fieldStrength: 1.0,
  particleCount: 50
};

// === MOTOR DE FÍSICA PRINCIPAL ===

export class AdvancedPhysicsEngine {
  private config: PhysicsConfiguration;
  private entities: Map<string, PhysicsState> = new Map();
  private particles: AdvancedParticle[] = [];
  private zones: ZoneInfluence[] = [];
  private fieldCache: Map<string, VectorField> = new Map();
  private behaviorHistory: Map<string, Array<{ action: string; timestamp: number; context: unknown }>> = new Map();
  private lastUpdateTime = performance.now();
  
  constructor(config: Partial<PhysicsConfiguration> = {}) {
    this.config = { ...DEFAULT_PHYSICS_CONFIG, ...config };
    console.log('🚀 AdvancedPhysicsEngine iniciado:', {
      advancedFeatures: this.config.enableAdvancedFeatures,
      timeStep: this.config.timeStep,
      maxVelocity: this.config.maxVelocity,
      particleCount: this.config.particleCount
    });
  }

  // === GESTIÓN DE ENTIDADES ===

  registerEntity(entityId: string, entity: Entity): void {
    const physicsState: PhysicsState = {
      position: { ...entity.position },
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      force: { x: 0, y: 0 },
      mass: 1.0,
      friction: 0.1,
      elasticity: 0.6,
      angularVelocity: 0,
      torque: 0,
      moment: 1.0
    };

    this.entities.set(entityId, physicsState);
    this.behaviorHistory.set(entityId, []);
  }

  unregisterEntity(entityId: string): void {
    this.entities.delete(entityId);
    this.behaviorHistory.delete(entityId);
    this.fieldCache.clear(); // Limpiar cache cuando cambia la configuración
  }

  getEntityPhysics(entityId: string): PhysicsState | null {
    return this.entities.get(entityId) || null;
  }

  // === GESTIÓN DE ZONAS ===

  addZone(zone: ZoneInfluence): void {
    this.zones.push(zone);
    this.fieldCache.clear(); // Invalidar cache
  }

  clearZones(): void {
    this.zones = [];
    this.fieldCache.clear();
  }

  // === ACTUALIZACIÓN PRINCIPAL ===

  update(entities: Entity[], deltaTime: number): { entities: Entity[]; particles: AdvancedParticle[] } {
    const currentTime = performance.now();
    const actualDeltaTime = mathUtils.safeClamp(deltaTime / 1000, 0, 0.05); // Máximo 50ms

    // Registrar nuevas entidades
    entities.forEach(entity => {
      if (!this.entities.has(entity.id)) {
        this.registerEntity(entity.id, entity);
      }
    });

    // Actualizar física de entidades
    const updatedEntities = entities.map(entity => {
      const physics = this.entities.get(entity.id);
      if (!physics) return entity;

      // Calcular fuerzas
      this.calculateForces(entity.id, physics, entities);
      
      // Integrar movimiento
      this.integrateMotion(physics, actualDeltaTime);
      
      // Aplicar restricciones de límites
      this.applyBoundaryConstraints(physics);
      
      // Registrar comportamiento para predicción
      this.recordBehavior(entity.id, physics);

      // Actualizar entidad con nueva posición
      return {
        ...entity,
        position: { ...physics.position }
      };
    });

    // Actualizar partículas
    this.updateParticles(actualDeltaTime);
    
    // Generar nuevas partículas basadas en resonancia
    if (this.config.enableAdvancedFeatures) {
      this.generateResonanceParticles(updatedEntities);
    }

    this.lastUpdateTime = currentTime;

    return {
      entities: updatedEntities,
      particles: [...this.particles]
    };
  }

  // === CÁLCULO DE FUERZAS ===

  private calculateForces(entityId: string, physics: PhysicsState, allEntities: Entity[]): void {
    // Resetear fuerzas
    physics.force = { x: 0, y: 0 };

    // Gravedad
    physics.force.x += this.config.gravity.x * physics.mass;
    physics.force.y += this.config.gravity.y * physics.mass;

    // Resistencia del aire
    const speed = vectorMath.magnitude(physics.velocity);
    if (speed > MATH.ULTRA_PRECISION_EPSILON) {
      const dragDirection = vectorMath.normalize({
        x: -physics.velocity.x,
        y: -physics.velocity.y
      });
      const dragMagnitude = this.config.airResistance * speed * speed;
      
      physics.force.x += dragDirection.x * dragMagnitude;
      physics.force.y += dragDirection.y * dragMagnitude;
    }

    // Fuerzas de campo vectorial avanzado
    if (this.config.enableAdvancedFeatures) {
      const fieldForce = this.calculateFieldForces(physics.position, allEntities);
      physics.force.x += fieldForce.x * this.config.fieldStrength;
      physics.force.y += fieldForce.y * this.config.fieldStrength;
    }

    // Fuerzas de zona
    this.zones.forEach(zone => {
      const zoneForce = this.calculateZoneForce(physics.position, zone);
      physics.force.x += zoneForce.x;
      physics.force.y += zoneForce.y;
    });

    // Fuerzas de resonancia entre entidades
    if (this.config.enableAdvancedFeatures) {
      const resonanceForce = this.calculateResonanceForces(entityId, physics, allEntities);
      physics.force.x += resonanceForce.x * this.config.resonanceInfluence;
      physics.force.y += resonanceForce.y * this.config.resonanceInfluence;
    }
  }

  private calculateFieldForces(position: Vector2D, entities: Entity[]): Vector2D {
    const cacheKey = `${Math.floor(position.x / 10)}_${Math.floor(position.y / 10)}`;
    
    if (this.fieldCache.has(cacheKey)) {
      const field = this.fieldCache.get(cacheKey)!;
      return {
        x: field.direction.x * field.strength,
        y: field.direction.y * field.strength
      };
    }

    // Calcular campo vectorial
    const attractors = entities.filter(e => !e.isDead).map(e => e.position);
    const repulsors: Vector2D[] = []; // Se pueden agregar obstáculos
    const flowField: Vector2D[][] = []; // Campo de flujo futuro
    
    const field = mathUtils.calculateAdvancedVectorField(
      position,
      attractors,
      repulsors,
      flowField,
      performance.now()
    );

    this.fieldCache.set(cacheKey, field);

    return {
      x: field.direction.x * field.strength,
      y: field.direction.y * field.strength
    };
  }

  private calculateZoneForce(position: Vector2D, zone: ZoneInfluence): Vector2D {
    const distance = vectorMath.distance(position, zone.center);
    
    if (distance > zone.radius) return { x: 0, y: 0 };

    const direction = vectorMath.normalize({
      x: zone.center.x - position.x,
      y: zone.center.y - position.y
    });

    let forceMagnitude = 0;

    switch (zone.type) {
      case 'ATTRACTOR':
        forceMagnitude = zone.strength * zone.effect.totalEffect * (1 - distance / zone.radius);
        break;
      case 'REPULSOR':
        forceMagnitude = -zone.strength * zone.effect.totalEffect * (1 - distance / zone.radius);
        break;
      case 'VORTEX': {
        // Fuerza tangencial para crear rotación
        const tangent = { x: -direction.y, y: direction.x };
        return {
          x: tangent.x * zone.strength * zone.effect.totalEffect * (1 - distance / zone.radius),
          y: tangent.y * zone.strength * zone.effect.totalEffect * (1 - distance / zone.radius)
        };
      }
      case 'FIELD': {
        // Campo complejo basado en harmónicos
        const fieldEffect = Math.sin(distance / zone.radius * Math.PI * 2) * zone.effect.harmonicResonance;
        forceMagnitude = zone.strength * fieldEffect;
        break;
      }
    }

    return {
      x: direction.x * forceMagnitude,
      y: direction.y * forceMagnitude
    };
  }

  private calculateResonanceForces(entityId: string, physics: PhysicsState, entities: Entity[]): Vector2D {
    const resonanceForce = { x: 0, y: 0 };

    entities.forEach(other => {
      if (other.id === entityId || other.isDead) return;

      const otherPhysics = this.entities.get(other.id);
      if (!otherPhysics) return;

      const distance = vectorMath.distance(physics.position, otherPhysics.position);
      if (distance < MATH.ULTRA_PRECISION_EPSILON) return;

      const direction = vectorMath.normalize({
        x: otherPhysics.position.x - physics.position.x,
        y: otherPhysics.position.y - physics.position.y
      });

      // Calcular resonancia avanzada
      const history = this.behaviorHistory.get(entityId) || [];
      const resonanceState = mathUtils.calculateAdvancedResonance(
        distance,
        history.slice(-10).map(h => h.timestamp),
        (other.stats.happiness + other.stats.energy) / 2,
        performance.now() - this.lastUpdateTime
      );

      // Fuerza de resonancia
      const resonanceMagnitude = resonanceState.resonanceLevel / 100 * 
                                resonanceState.emergentProperties.synchronization *
                                Math.exp(-distance / 200);

      resonanceForce.x += direction.x * resonanceMagnitude;
      resonanceForce.y += direction.y * resonanceMagnitude;
    });

    return resonanceForce;
  }

  // === INTEGRACIÓN DE MOVIMIENTO ===

  private integrateMotion(physics: PhysicsState, deltaTime: number): void {
    // Cálcular aceleración: F = ma, por lo tanto a = F/m
    physics.acceleration.x = physics.force.x / physics.mass;
    physics.acceleration.y = physics.force.y / physics.mass;

    // Limitar aceleración
    const acceleration = vectorMath.magnitude(physics.acceleration);
    if (acceleration > this.config.maxAcceleration) {
      const normalized = vectorMath.normalize(physics.acceleration);
      physics.acceleration.x = normalized.x * this.config.maxAcceleration;
      physics.acceleration.y = normalized.y * this.config.maxAcceleration;
    }

    // Integración de Verlet para mayor estabilidad
    const newVelocity = {
      x: physics.velocity.x + physics.acceleration.x * deltaTime,
      y: physics.velocity.y + physics.acceleration.y * deltaTime
    };

    // Aplicar fricción
    newVelocity.x *= (1 - physics.friction * deltaTime);
    newVelocity.y *= (1 - physics.friction * deltaTime);

    // Limitar velocidad
    const speed = vectorMath.magnitude(newVelocity);
    if (speed > this.config.maxVelocity) {
      const normalized = vectorMath.normalize(newVelocity);
      newVelocity.x = normalized.x * this.config.maxVelocity;
      newVelocity.y = normalized.y * this.config.maxVelocity;
    }

    physics.velocity = newVelocity;

    // Actualizar posición
    physics.position.x += physics.velocity.x * deltaTime;
    physics.position.y += physics.velocity.y * deltaTime;

    // Integrar rotación
    physics.angularVelocity += (physics.torque / physics.moment) * deltaTime;
    physics.angularVelocity *= (1 - physics.friction * deltaTime); // Fricción angular
  }

  private applyBoundaryConstraints(physics: PhysicsState): void {
    const margin = 20;
    const canvasWidth = 1000;
    const canvasHeight = 600;

    // Rebote en los límites con restitución
    if (physics.position.x < margin) {
      physics.position.x = margin;
      physics.velocity.x *= -this.config.boundaryRestitution;
    } else if (physics.position.x > canvasWidth - margin) {
      physics.position.x = canvasWidth - margin;
      physics.velocity.x *= -this.config.boundaryRestitution;
    }

    if (physics.position.y < margin) {
      physics.position.y = margin;
      physics.velocity.y *= -this.config.boundaryRestitution;
    } else if (physics.position.y > canvasHeight - margin) {
      physics.position.y = canvasHeight - margin;
      physics.velocity.y *= -this.config.boundaryRestitution;
    }
  }

  // === SISTEMA DE PARTÍCULAS ===

  private updateParticles(deltaTime: number): void {
    // Actualizar partículas existentes
    this.particles = this.particles.filter(particle => {
      // Actualizar física de la partícula
      this.integrateMotion(particle.physics, deltaTime);
      
      // Actualizar propiedades visuales
      particle.lifeTime += deltaTime * 1000;
      const lifeRatio = particle.lifeTime / particle.maxLifeTime;
      
      particle.opacity = mathUtils.lerp(1, 0, lifeRatio);
      particle.size *= 0.99; // Encogimiento gradual

      // Eliminar partículas muertas
      return particle.lifeTime < particle.maxLifeTime && particle.size > 0.1;
    });
  }

  private generateResonanceParticles(entities: Entity[]): void {
    if (this.particles.length >= this.config.particleCount) return;

    entities.forEach(entity => {
      if (entity.isDead) return;

      const physics = this.entities.get(entity.id);
      if (!physics) return;

      // Generar partículas basadas en velocidad y resonancia
      const speed = vectorMath.magnitude(physics.velocity);
      const shouldGenerate = Math.random() < (speed / this.config.maxVelocity) * 0.1;

      if (shouldGenerate) {
        const particle: AdvancedParticle = {
          id: `particle_${entity.id}_${Date.now()}_${Math.random()}`,
          physics: {
            position: {
              x: physics.position.x + (Math.random() - 0.5) * 10,
              y: physics.position.y + (Math.random() - 0.5) * 10
            },
            velocity: {
              x: physics.velocity.x * 0.3 + (Math.random() - 0.5) * 20,
              y: physics.velocity.y * 0.3 + (Math.random() - 0.5) * 20
            },
            acceleration: { x: 0, y: 0 },
            force: { x: 0, y: 0 },
            mass: 0.1,
            friction: 0.05,
            elasticity: 0.3,
            angularVelocity: (Math.random() - 0.5) * 5,
            torque: 0,
            moment: 0.1
          },
          lifeTime: 0,
          maxLifeTime: 1000 + Math.random() * 2000,
          color: `hsl(${(entity.stats.happiness + entity.stats.energy) * 1.8}, 70%, 60%)`,
          size: 2 + Math.random() * 3,
          opacity: 1,
          particleType: speed > 100 ? 'TURBULENCE' : 'RESONANCE'
        };

        this.particles.push(particle);
      }
    });
  }

  // === REGISTRO DE COMPORTAMIENTO ===

  private recordBehavior(entityId: string, physics: PhysicsState): void {
    const history = this.behaviorHistory.get(entityId) || [];
    const speed = vectorMath.magnitude(physics.velocity);
    
    let action = 'idle';
    if (speed > 50) action = 'moving_fast';
    else if (speed > 10) action = 'moving';
    
    const lastAction = history[history.length - 1];
    if (!lastAction || lastAction.action !== action) {
      history.push({
        action,
        timestamp: performance.now(),
        context: {
          position: { ...physics.position },
          velocity: { ...physics.velocity },
          speed
        }
      });

      // Mantener solo los últimos N registros
      if (history.length > 50) { // Valor fijo ya que PATTERN_MEMORY_DEPTH puede no existir
        history.splice(0, history.length - 50);
      }

      this.behaviorHistory.set(entityId, history);
    }
  }

  // === DETECCIÓN DE COLISIONES ===

  detectCollision(entity1: Entity, entity2: Entity): CollisionResult {
    const physics1 = this.entities.get(entity1.id);
    const physics2 = this.entities.get(entity2.id);

    if (!physics1 || !physics2) {
      return {
        hasCollision: false,
        collisionPoint: { x: 0, y: 0 },
        normal: { x: 0, y: 0 },
        penetration: 0,
        relativeVelocity: { x: 0, y: 0 },
        separatingVelocity: 0
      };
    }

    const distance = vectorMath.distance(physics1.position, physics2.position);
    const minDistance = 30; // Radio combinado de las entidades

    if (distance >= minDistance) {
      return {
        hasCollision: false,
        collisionPoint: { x: 0, y: 0 },
        normal: { x: 0, y: 0 },
        penetration: 0,
        relativeVelocity: { x: 0, y: 0 },
        separatingVelocity: 0
      };
    }

    // Calcular detalles de la colisión
    const normal = vectorMath.normalize({
      x: physics2.position.x - physics1.position.x,
      y: physics2.position.y - physics1.position.y
    });

    const collisionPoint = {
      x: physics1.position.x + normal.x * 15,
      y: physics1.position.y + normal.y * 15
    };

    const relativeVelocity = {
      x: physics2.velocity.x - physics1.velocity.x,
      y: physics2.velocity.y - physics1.velocity.y
    };

    const separatingVelocity = relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;
    const penetration = minDistance - distance;

    return {
      hasCollision: true,
      collisionPoint,
      normal,
      penetration,
      relativeVelocity,
      separatingVelocity
    };
  }

  resolveCollision(entity1: Entity, entity2: Entity, collision: CollisionResult): void {
    if (!collision.hasCollision) return;

    const physics1 = this.entities.get(entity1.id);
    const physics2 = this.entities.get(entity2.id);

    if (!physics1 || !physics2) return;

    // Separar entidades
    const separationForce = collision.penetration / 2;
    physics1.position.x -= collision.normal.x * separationForce;
    physics1.position.y -= collision.normal.y * separationForce;
    physics2.position.x += collision.normal.x * separationForce;
    physics2.position.y += collision.normal.y * separationForce;

    // Resolver velocidades con restitución
    if (collision.separatingVelocity < 0) {
      const restitution = Math.min(physics1.elasticity, physics2.elasticity);
      const impulse = -(1 + restitution) * collision.separatingVelocity / (1/physics1.mass + 1/physics2.mass);

      physics1.velocity.x -= impulse * collision.normal.x / physics1.mass;
      physics1.velocity.y -= impulse * collision.normal.y / physics1.mass;
      physics2.velocity.x += impulse * collision.normal.x / physics2.mass;
      physics2.velocity.y += impulse * collision.normal.y / physics2.mass;
    }
  }

  // === API PÚBLICA ===

  getParticles(): AdvancedParticle[] {
    return [...this.particles];
  }

  getPredictions(entityId: string): import('./fixedMathPrecision').PredictionState | null {
    const history = this.behaviorHistory.get(entityId);
    if (!history || history.length < 5) return null;

    return mathUtils.predictBehaviorPatterns(history, {});
  }

  updateConfiguration(newConfig: Partial<PhysicsConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    this.fieldCache.clear(); // Invalidar cache
  }

  reset(): void {
    this.entities.clear();
    this.particles = [];
    this.zones = [];
    this.fieldCache.clear();
    this.behaviorHistory.clear();
  }
}

// === INSTANCIA GLOBAL ===

export const advancedPhysicsEngine = new AdvancedPhysicsEngine();

// Hacer disponible globalmente para debugging
if (typeof window !== 'undefined') {
  (window as typeof window & { 
    advancedPhysicsEngine: AdvancedPhysicsEngine;
    physicsCommands: {
      getEntityPhysics: (id: string) => PhysicsState | null;
      getPredictions: (id: string) => import('./fixedMathPrecision').PredictionState | null;
      getParticles: () => AdvancedParticle[];
      updateConfig: (config: Partial<PhysicsConfiguration>) => void;
      reset: () => void;
    };
  }).advancedPhysicsEngine = advancedPhysicsEngine;
  
  // Comandos de consola útiles
  (window as typeof window & { 
    physicsCommands: {
      getEntityPhysics: (id: string) => PhysicsState | null;
      getPredictions: (id: string) => import('./fixedMathPrecision').PredictionState | null;
      getParticles: () => AdvancedParticle[];
      updateConfig: (config: Partial<PhysicsConfiguration>) => void;
      reset: () => void;
    };
  }).physicsCommands = {
    getEntityPhysics: (id: string) => advancedPhysicsEngine.getEntityPhysics(id),
    getPredictions: (id: string) => advancedPhysicsEngine.getPredictions(id),
    getParticles: () => advancedPhysicsEngine.getParticles(),
    updateConfig: (config: Partial<PhysicsConfiguration>) => advancedPhysicsEngine.updateConfiguration(config),
    reset: () => advancedPhysicsEngine.reset()
  };
}
