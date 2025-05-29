import { useEffect, useRef, useCallback } from 'react';
import { useGame } from './useGame';
import { gameConfig } from '../config/gameConfig';
import { getRandomDialogue } from '../utils/dialogues';
import type { Entity, EntityActivity, EntityMood, EntityStats } from '../types';

// Sistema de decay estable por agente - UN SOLO PERFIL POR AGENTE
const ENTITY_DECAY_PROFILES = new Map<string, {
  baseRates: {
    hunger: number;
    sleepiness: number;
    energy: number;
    boredom: number;
    loneliness: number;
    happiness: number;
  };
  personality: 'energetic' | 'calm' | 'social' | 'solitary';
  initialized: boolean;
}>();

// Crear perfil único y persistente para cada agente
const getOrCreateDecayProfile = (entityId: string) => {
  if (!ENTITY_DECAY_PROFILES.has(entityId)) {
    // Personalidades diferentes para cada agente
    const personality = entityId === 'circle' ? 'energetic' : 'calm';
    
    ENTITY_DECAY_PROFILES.set(entityId, {
      baseRates: {
        // Tasas base MÁS ALTAS para ver cambios inmediatos
        hunger: 2.5 + Math.random() * 1.5,        // 2.5-4.0 por segundo
        sleepiness: 2.0 + Math.random() * 1.5,    // 2.0-3.5 por segundo
        energy: -(1.5 + Math.random() * 1.0),     // -1.5 a -2.5 por segundo
        boredom: 1.8 + Math.random() * 1.2,       // 1.8-3.0 por segundo
        loneliness: 1.5 + Math.random() * 1.0,    // 1.5-2.5 por segundo
        happiness: -(1.0 + Math.random() * 0.8)   // -1.0 a -1.8 por segundo
      },
      personality,
      initialized: true
    });
    
    console.log(`🧬 Perfil de Autopoiesis creado para ${entityId}:`, ENTITY_DECAY_PROFILES.get(entityId));
  }
  
  return ENTITY_DECAY_PROFILES.get(entityId)!;
};

// Sistema AGRESIVO de decay para ver cambios inmediatos
const applyAggressiveStatDecay = (entity: Entity, deltaTime: number, dispatch: any) => {
  const profile = getOrCreateDecayProfile(entity.id);
  const timeMultiplier = deltaTime / 1000; // Convertir ms a segundos
  
  const statChanges: Partial<EntityStats> = {};
  
  // Aplicar decay con modificadores de actividad MÁS DRÁSTICOS
  const activityModifiers: Record<EntityActivity, Record<string, number>> = {
    'EXPLORING': { hunger: 2.5, energy: 1.8, boredom: -1.5 },
    'DANCING': { hunger: 3.0, energy: 2.0, boredom: -3.0, happiness: -2.0 },
    'RESTING': { sleepiness: -4.0, energy: -3.0, boredom: 1.5 },
    'SOCIALIZING': { loneliness: -3.0, happiness: -1.5, energy: 1.2 },
    'CONTEMPLATING': { happiness: -2.0, boredom: -1.5, sleepiness: 1.0 },
    'MEDITATING': { happiness: -2.5, boredom: -2.0, loneliness: 1.0 },
    'WRITING': { boredom: -2.0, happiness: -1.0, energy: 1.0 },
    'WANDERING': { boredom: -0.5 },
  const maxNeed = Math.max(...Object.values(needLevels));
  const urgentNeed = Object.entries(needLevels).find(([_, value]) => value === maxNeed)?.[0];

  // Mapear necesidades urgentes a actividades específicas
  const needToActivity: Record<string, EntityActivity> = {
    hunger: 'EXPLORING',      // Buscar comida
    sleepiness: 'RESTING',    // Descansar
    energy: 'RESTING',        // También descansar para recuperar energía
    boredom: 'DANCING',       // Actividad divertida
    loneliness: 'SOCIALIZING', // Buscar compañía
    happiness: 'CONTEMPLATING' // Meditar para equilibrar emociones
  };

  // Si la necesidad es crítica (>70%), priorizar esa actividad
  if (maxNeed > 0.7 && urgentNeed) {
    return needToActivity[urgentNeed] || 'WANDERING';
  }

  // Si no hay necesidades críticas, actividad basada en personalidad
  const personalityActivities: EntityActivity[] = [
    'WANDERING', 'MEDITATING', 'WRITING', 'CONTEMPLATING'
  ];
  
  return personalityActivities[Math.floor(Math.random() * personalityActivities.length)];
};

// Sistema de decay dinámico por agente
const applyDynamicStatDecay = (entity: Entity, gameSpeedMultiplier: number, dispatch: any) => {
  const profile = getDecayProfile(entity.id);
  const now = Date.now();
  const deltaTime = now - profile.lastDecayUpdate;
  
  // Aplicar decay cada segundo aproximadamente (ajustable por velocidad)
  if (deltaTime < (1000 / gameSpeedMultiplier)) return;
  
  const statChanges: Partial<EntityStats> = {};
  const timeMultiplier = (deltaTime / 1000) * gameSpeedMultiplier;
  
  // Aplicar decay según el perfil único del agente
  Object.entries(profile.decayRates).forEach(([stat, baseRate]) => {
    let finalRate = baseRate * timeMultiplier;
    
    // Modificadores según actividad actual
    const activityModifiers: Record<EntityActivity, Record<string, number>> = {
      'EXPLORING': { hunger: 1.5, energy: 1.2 }, // Explorar da más hambre y cansa
      'DANCING': { hunger: 1.8, energy: 1.5, boredom: -2.0, happiness: -1.0 }, // Bailar es muy activo
      'RESTING': { sleepiness: -2.5, energy: -1.5, boredom: 1.2 }, // Descansar restaura pero aburre
      'SOCIALIZING': { loneliness: -1.8, happiness: -0.8, energy: 1.1 }, // Socializar cansa un poco
      'CONTEMPLATING': { happiness: -1.2, boredom: -0.8, sleepiness: 0.8 }, // Meditar equilibra
      'MEDITATING': { happiness: -1.5, boredom: -1.0, loneliness: 0.6 }, // Meditar profundo
      'WRITING': { boredom: -1.2, happiness: -0.5, energy: 0.8 }, // Escribir es creativo
      'WANDERING': {}, // Sin modificadores especiales
      'HIDING': { loneliness: 1.3, boredom: 1.2 } // Esconderse es aislante
    };
    
    const modifier = activityModifiers[entity.activity]?.[stat] || 1.0;
    finalRate *= modifier;
    
    // Aplicar límites realistas y variabilidad
    const currentValue = entity.stats[stat as keyof EntityStats];
    let newValue: number;
    
    if (stat === 'happiness' || stat === 'energy') {
      // Para estadísticas que deberían mantenerse altas
      newValue = Math.max(0, Math.min(100, currentValue + finalRate));
    } else {
      // Para estadísticas que deberían mantenerse bajas
      newValue = Math.max(0, Math.min(100, currentValue + finalRate));
    }
    
    // Solo aplicar cambio si es significativo
    if (Math.abs(newValue - currentValue) > 0.1) {
      statChanges[stat as keyof EntityStats] = newValue - currentValue;
    }
  });

  // Actualizar timestamp
  profile.lastDecayUpdate = now;

  // Aplicar cambios si los hay
  if (Object.keys(statChanges).length > 0) {
    dispatch({
      type: 'UPDATE_ENTITY_STATS',
      payload: { entityId: entity.id, stats: statChanges }
    });
  }
};

// Mejorar sistema de estado de ánimo con más granularidad
const calculateMoodFromStats = (stats: EntityStats, resonance: number): EntityMood => {
  const criticalStats = [
    stats.hunger > 80,
    stats.sleepiness > 80,
    stats.loneliness > 80,
    stats.energy < 20,
    stats.happiness < 20
  ].filter(Boolean).length;

  // Estados críticos tienen prioridad
  if (criticalStats >= 2) return 'ANXIOUS';
  if (stats.energy < 20) return 'TIRED';
  if (stats.loneliness > 80 && resonance < 30) return 'SAD';
  
  // Estados positivos
  const positiveScore = (stats.happiness + stats.energy) / 2;
  const negativeScore = (stats.hunger + stats.sleepiness + stats.boredom + stats.loneliness) / 4;
  const bondBonus = resonance > 70 ? 10 : resonance < 30 ? -10 : 0;
  
  const moodScore = positiveScore - negativeScore + bondBonus;
  
  if (moodScore > 40 && stats.energy > 60) return 'EXCITED';
  if (moodScore > 25) return 'HAPPY';
  if (moodScore > 10) return 'CONTENT';
  if (moodScore > -10) return 'CALM';
  return 'SAD';
};

// Sistema de pensamientos más contextual
const generateContextualThought = (entity: Entity, resonance: number): string => {
  const { stats, activity, mood } = entity;
  const symbol = entity.id === 'circle' ? '●' : '■';
  
  // Pensamientos sobre necesidades críticas
  if (stats.hunger > 85) {
    return `${symbol} "Necesito encontrar alimento urgentemente... mi esencia se debilita..."`;
  }
  if (stats.sleepiness > 85) {
    return `${symbol} "El cansancio me vence... debo descansar pronto..."`;
  }
  if (stats.loneliness > 85) {
    return `${symbol} "La soledad me consume... ¿dónde está mi compañero?"`;
  }
  if (stats.boredom > 85) {
    return `${symbol} "Esta monotonía es insoportable... necesito hacer algo..."`;
  }
  
  // Pensamientos sobre el vínculo
  if (resonance < 20) {
    return `${symbol} "Siento cómo nuestro vínculo se desvanece... esto no puede continuar..."`;
  }
  if (resonance < 40) {
    return `${symbol} "Algo no está bien entre nosotros... necesitamos reconectarnos..."`;
  }
  
  // Pensamientos basados en actividad actual
  const activityThoughts = {
    'EXPLORING': [
      `${symbol} "Busco algo que calme mis necesidades..."`,
      `${symbol} "Cada paso me acerca a lo que necesito..."`,
      `${symbol} "La búsqueda es parte de la supervivencia..."`
    ],
    'SOCIALIZING': [
      `${symbol} "Busco a mi compañero... lo necesito cerca..."`,
      `${symbol} "La soledad es mi mayor enemigo..."`,
      `${symbol} "Juntos somos más fuertes..."`
    ],
    'RESTING': [
      `${symbol} "Por fin puedo descansar... mi cuerpo lo necesitaba..."`,
      `${symbol} "En el descanso encuentro renovación..."`,
      `${symbol} "El sueño restaura mi esencia..."`
    ],
    'DANCING': [
      `${symbol} "El movimiento libera mi energía acumulada..."`,
      `${symbol} "Bailar aleja el aburrimiento de mi ser..."`,
      `${symbol} "Cada paso es una celebración de la vida..."`
    ],
    'CONTEMPLATING': [
      `${symbol} "Reflexiono sobre nuestro vínculo..."`,
      `${symbol} "En la quietud encuentro claridad..."`,
      `${symbol} "Meditar equilibra mis emociones..."`
    ],
    'WANDERING': [
      `${symbol} "Camino sin rumbo fijo, explorando posibilidades..."`,
      `${symbol} "Cada dirección puede llevarme a lo que necesito..."`,
      `${symbol} "El movimiento es vida..."`
    ]
  };
  
  const thoughts = activityThoughts[activity] || [
    `${symbol} "Continúo mi existencia, paso a paso..."`,
    `${symbol} "Cada momento es una oportunidad de crecer..."`,
    `${symbol} "La vida continúa, y yo con ella..."`
  ];
  
  return thoughts[Math.floor(Math.random() * thoughts.length)];
};

// Función helper para calcular urgencia de necesidades
const calculateNeedUrgency = (value: number, isPositiveStat: boolean = false): number => {
  if (isPositiveStat) {
    // Para happiness y energy, más bajo = más urgente
    return (100 - value) / 100;
  } else {
    // Para hunger, sleepiness, etc., más alto = más urgente
    return value / 100;
  }
};

// Mostrar diálogos más inteligentes basados en contexto
const showContextualDialogue = (entity: Entity, resonance: number, dispatch: any) => {
  const { stats, mood, activity } = entity;
  
  // Probabilidad basada en urgencia de necesidades
  const avgUrgency = (
    calculateNeedUrgency(stats.hunger) +
    calculateNeedUrgency(stats.sleepiness) +
    calculateNeedUrgency(stats.loneliness) +
    calculateNeedUrgency(stats.boredom) +
    calculateNeedUrgency(stats.happiness, true) +
    calculateNeedUrgency(stats.energy, true)
  ) / 6;
  
  // Más probable mostrar diálogos cuando hay más urgencia
  const dialogueProbability = 0.1 + (avgUrgency * 0.4);
  
  if (Math.random() < dialogueProbability) {
    let dialogueType: keyof typeof import('../utils/dialogues').dialogues;
    
    // Seleccionar tipo de diálogo basado en el contexto
    if (stats.hunger > 70) {
      dialogueType = 'hungry';
    } else if (stats.sleepiness > 70) {
      dialogueType = 'tired';
    } else if (stats.loneliness > 70 || resonance < 40) {
      dialogueType = 'lonely';
    } else if (mood === 'HAPPY' || mood === 'EXCITED') {
      dialogueType = 'happy';
    } else if (activity === 'CONTEMPLATING') {
      dialogueType = 'meditation';
    } else if (activity === 'WRITING') {
      dialogueType = 'writing';
    } else {
      // Generar pensamiento contextual personalizado
      const thought = generateContextualThought(entity, resonance);
      dispatch({
        type: 'SHOW_DIALOGUE',
        payload: {
          message: thought,
          speaker: entity.id as 'circle' | 'square',
          duration: 2500
        }
      });
      return;
    }
    
    dispatch({
      type: 'SHOW_DIALOGUE',
      payload: {
        message: getRandomDialogue(dialogueType),
        speaker: entity.id as 'circle' | 'square',
        duration: 2500
      }
    });
  }
};

export const useAutopoiesis = () => {
  const { gameState, dispatch } = useGame();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0);
  const updateCounter = useRef<number>(0);

  useEffect(() => {
    // Usar la velocidad global simplificada
    const interval = 1000 / gameConfig.gameSpeedMultiplier; // Intervalo base de 1 segundo
    
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      
      // Throttling básico
      if (deltaTime < interval * 0.8) return;
      
      lastUpdateTime.current = now;
      updateCounter.current++;

      const livingEntities = gameState.entities.filter(entity => 
        !entity.isDead && entity.state !== 'DEAD'
      );
      
      for (const entity of livingEntities) {
        // Aplicar decay dinámico por agente
        applyDynamicStatDecay(entity, gameConfig.gameSpeedMultiplier, dispatch);
        
        // Actualizar actividad basada en priorización inteligente
        if (updateCounter.current % 3 === 0) { // Cada 3 segundos
          const newActivity = prioritizeActivity(entity);
          if (newActivity !== entity.activity) {
            dispatch({
              type: 'UPDATE_ENTITY_ACTIVITY',
              payload: { entityId: entity.id, activity: newActivity }
            });
          }
        }
        
        // Actualizar estado de ánimo
        if (updateCounter.current % 2 === 0) { // Cada 2 segundos
          const newMood = calculateMoodFromStats(entity.stats, gameState.resonance);
          if (newMood !== entity.mood) {
            dispatch({
              type: 'UPDATE_ENTITY_MOOD',
              payload: { entityId: entity.id, mood: newMood }
            });
          }
        }
        
        // Generar diálogos contextuales mejorados
        if (updateCounter.current % 8 === 0) {
          showContextualDialogue(entity, gameState.resonance, dispatch);
        }
      }
      
      // Decay del vínculo simplificado
      const livingCount = livingEntities.length;
      let resonanceDecay = 0.5; // Base decay por segundo
      
      if (livingCount === 2) {
        const [entity1, entity2] = livingEntities;
        const distance = Math.sqrt(
          Math.pow(entity1.position.x - entity2.position.x, 2) +
          Math.pow(entity1.position.y - entity2.position.y, 2)
        );
        
        // Decay más rápido cuando están lejos
        if (distance > 150) resonanceDecay = 1.2;
        else if (distance > 100) resonanceDecay = 0.8;
        else resonanceDecay = 0.3; // Decay mínimo cuando están cerca
      } else if (livingCount === 1) {
        resonanceDecay = 2.0; // Decay acelerado cuando solo queda uno
      }
      
      dispatch({
        type: 'UPDATE_RESONANCE',
        payload: Math.max(0, gameState.resonance - (resonanceDecay * gameConfig.gameSpeedMultiplier))
      });
      
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState.entities, gameState.resonance, dispatch]);
};
