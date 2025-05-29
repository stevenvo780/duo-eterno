import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getGameIntervals, gameConfig } from '../config/gameConfig';
import type { Entity, EntityActivity, EntityMood, EntityStats } from '../types';
import type { GameAction } from '../state/GameContext';
import { 
  ACTIVITY_DYNAMICS, 
  applyActivityEffects,
  applySurvivalCosts
} from '../utils/activityDynamics';
import { 
  makeIntelligentDecision, 
  updateActivityEffectiveness 
} from '../utils/aiDecisionEngine';
import { 
  shouldUpdateAutopoiesis, 
  measureExecutionTime,
  getPooledStatsUpdate,
  releasePooledStatsUpdate
} from '../utils/performanceOptimizer';
import { useUpgrades } from './useUpgrades';
import { 
  createUpgradeEffectsContext,
  applyUpgradeToStatDecay,
  type UpgradeEffectsContext
} from '../utils/upgradeEffects';

// Sistema híbrido optimizado que combina lo mejor de ambos enfoques
const HYBRID_DECAY_RATES = {
  // Decay base más agresivo para cambios visibles inmediatos
  base: {
    hunger: 3.0,        // Más agresivo que antes
    sleepiness: 2.5,    
    energy: -2.0,       // Pérdida de energía más notable
    boredom: 2.2,       
    loneliness: 1.8,    
    happiness: -1.5     
  },
  // Multiplicadores por actividad (corregir tipos)
  activityModifiers: {
    'WORKING': { hunger: 1.5, energy: 2.0, boredom: 1.5 },
    'SHOPPING': { happiness: -1.8, hunger: -0.8 },
    'COOKING': { hunger: -2.5, happiness: -0.5 },
    'EXERCISING': { energy: 1.5, hunger: 2.0, happiness: -1.0 },
    'RESTING': { sleepiness: -3.0, energy: -2.5 },
    'SOCIALIZING': { loneliness: -2.5, happiness: -1.0 },
    'DANCING': { boredom: -2.8, happiness: -1.5, energy: 1.3 },
    'EXPLORING': { hunger: 1.2, boredom: -1.0 },
    'MEDITATING': { happiness: -1.8, boredom: -1.5, loneliness: 0.8 },
    'CONTEMPLATING': { happiness: -1.5, boredom: -1.2 },
    'WRITING': { boredom: -1.8, loneliness: 0.5 },
    'WANDERING': { boredom: -0.5 },
    'HIDING': { loneliness: 1.5, happiness: 1.0 }
  } as Record<EntityActivity, Record<string, number>>
};

// Aplicar efectos complejos de actividades (fusión de ambos sistemas) - REFACTORIZADO
const applyComplexActivityEffects = (
  entity: Entity, 
  deltaTime: number, 
  dispatch: React.Dispatch<GameAction>,
  upgradeEffectsContext: UpgradeEffectsContext
) => {
  return measureExecutionTime(`applyComplexActivityEffects-${entity.id}`, () => {
    const timeMultiplier = deltaTime / 1000;
    const activity = entity.activity;
    
    // Usar pool para cambios de stats
    const baseChanges = getPooledStatsUpdate();
    
    try {
      // 1. Aplicar decay base con nuevos multiplicadores de config Y efectos de upgrades
      Object.entries(HYBRID_DECAY_RATES.base).forEach(([stat, rate]) => {
        const modifier = HYBRID_DECAY_RATES.activityModifiers[activity]?.[stat] || 1.0;
        const configMultiplier = gameConfig.baseDecayMultiplier;
        
        // Aplicar efectos de upgrades al decay rate
        const upgradeModifiedRate = applyUpgradeToStatDecay(rate, upgradeEffectsContext);
        
        const finalRate = upgradeModifiedRate * modifier * timeMultiplier * configMultiplier;
        
        const change = finalRate;
        
        if (Math.abs(change) > 0.1) {
          baseChanges[stat as keyof EntityStats] = change;
        }
      });

      // 2. Aplicar efectos específicos de actividad (de activityDynamics)
      if (ACTIVITY_DYNAMICS[activity]) {
        const activityResult = applyActivityEffects(
          entity.stats,
          activity,
          deltaTime,
          false
        );
        
        // Combinar cambios base con efectos específicos
        Object.entries(activityResult.newStats).forEach(([stat, value]) => {
          const currentChange = baseChanges[stat as keyof EntityStats] || 0;
          const activityChange = value - entity.stats[stat as keyof EntityStats];
          baseChanges[stat as keyof EntityStats] = currentChange + activityChange;
        });

        // 3. Aplicar costos y ganancias (dinero, etc.)
        if (activityResult.cost > 0 && entity.stats.money >= activityResult.cost) {
          baseChanges.money = (baseChanges.money || 0) - activityResult.cost;
        }
        
        if (activityResult.gain > 0) {
          baseChanges.money = (baseChanges.money || 0) + activityResult.gain;
        }
      }

      // 4. Aplicar costos pasivos de supervivencia
      const survivalChanges = applySurvivalCosts(entity.stats, deltaTime);
      Object.entries(survivalChanges).forEach(([stat, value]) => {
        const change = value - entity.stats[stat as keyof EntityStats];
        if (Math.abs(change) > 0.05) {
          baseChanges[stat as keyof EntityStats] = (baseChanges[stat as keyof EntityStats] || 0) + change;
        }
      });

      // 5. Aplicar todos los cambios de una vez
      if (Object.keys(baseChanges).length > 0) {
        dispatch({
          type: 'UPDATE_ENTITY_STATS',
          payload: { entityId: entity.id, stats: { ...baseChanges } }
        });
      }
    } finally {
      // Devolver objeto al pool
      releasePooledStatsUpdate(baseChanges);
    }
  });
};

// Cálculo de estado de ánimo optimizado
const calculateOptimizedMood = (stats: EntityStats, resonance: number): EntityMood => {
  // Factores críticos (muerte inminente)
  const criticalFactors = [
    stats.hunger > 85,
    stats.sleepiness > 85,
    stats.loneliness > 85,
    stats.energy < 15,
    stats.money < 10
  ].filter(Boolean).length;

  if (criticalFactors >= 2) return 'ANXIOUS';
  if (stats.energy < 20) return 'TIRED';
  if (stats.loneliness > 80 && resonance < 30) return 'SAD';
  
  // Cálculo de bienestar general
  const positiveScore = (stats.happiness + stats.energy + Math.min(100, stats.money)) / 3;
  const negativeScore = (stats.hunger + stats.sleepiness + stats.boredom + stats.loneliness) / 4;
  const bondBonus = resonance > 70 ? 15 : resonance < 30 ? -10 : 0;
  
  const moodScore = positiveScore - negativeScore + bondBonus;
  
  if (moodScore > 50 && stats.energy > 60) return 'EXCITED';
  if (moodScore > 25) return 'HAPPY';
  if (moodScore > 5) return 'CONTENT';
  if (moodScore > -15) return 'CALM';
  return 'SAD';
};

// Sistema híbrido principal - REFACTORIZADO CON IA MEJORADA
export const useAutopoiesis = () => {
  const { gameState, dispatch } = useGame();
  const { getUpgradeEffect } = useUpgrades();
  const intervalRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(Date.now());
  const updateCounter = useRef<number>(0);

  useEffect(() => {
    const { autopoiesisInterval } = getGameIntervals();
    
    // Crear contexto de efectos de upgrades
    const upgradeEffects = createUpgradeEffectsContext(getUpgradeEffect);
    
    console.log(`🧬 Sistema Híbrido Autopoiesis Mejorado iniciado - Intervalo: ${autopoiesisInterval}ms`);
    
    intervalRef.current = window.setInterval(() => {
      // Usar throttling inteligente para optimización
      if (!shouldUpdateAutopoiesis()) {
        return;
      }
      
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      
      lastUpdateTime.current = now;
      updateCounter.current++;

      const livingEntities = gameState.entities.filter(entity => 
        !entity.isDead && entity.state !== 'DEAD'
      );

      measureExecutionTime('autopoiesis-full-cycle', () => {
        for (const entity of livingEntities) {
          // Inicializar dinero si no existe
          if (entity.stats.money === undefined) {
            dispatch({
              type: 'UPDATE_ENTITY_STATS',
              payload: { 
                entityId: entity.id, 
                stats: { money: 50 }
              }
            });
            continue;
          }

          // Aplicar efectos complejos híbridos
          applyComplexActivityEffects(entity, deltaTime, dispatch, upgradeEffects);
          
          // Decisión inteligente de actividad usando nueva IA (menos frecuente)
          if (updateCounter.current % 3 === 0) {
            const companion = livingEntities.find(e => e.id !== entity.id) || null;
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
              
              if (gameConfig.debugMode) {
                console.log(`🤖 ${entity.id}: ${entity.activity} → ${newActivity}`);
              }
            }
          }
          
          // Actualizar estado de ánimo
          const newMood = calculateOptimizedMood(entity.stats, gameState.resonance);
          if (newMood !== entity.mood) {
            dispatch({
              type: 'UPDATE_ENTITY_MOOD',
              payload: { entityId: entity.id, mood: newMood }
            });
          }
          
          // Actualizar efectividad de actividad (para IA)
          if (updateCounter.current % 5 === 0) {
            // Calcular efectividad basada en progreso hacia objetivos
            const statKeys = Object.keys(entity.stats) as (keyof EntityStats)[];
            const criticalStats = statKeys.filter(key => {
              if (key === 'money') return false;
              const value = entity.stats[key];
              return value > 70 || (key === 'energy' && value < 30);
            });
            
            const effectiveness = criticalStats.length === 0 ? 0.8 : 0.4;
            const satisfaction = entity.stats.happiness / 100;
            
            updateActivityEffectiveness(entity.id, effectiveness, satisfaction);
          }
        }
      });
      
    }, autopoiesisInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('🧬 Sistema Híbrido Autopoiesis Mejorado detenido');
      }
    };
  }, [gameState.entities, gameState.zones, gameState.resonance, dispatch, getUpgradeEffect]);
};
