import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getGameIntervals, gameConfig } from '../config/gameConfig';
import type { Entity, EntityMood, EntityStats } from '../types';
import type { GameAction } from '../state/GameContext';
import { 
  shouldUpdateAutopoiesis, 
  measureExecutionTime,
  getPooledStatsUpdate,
  releasePooledStatsUpdate
} from '../utils/performanceOptimizer';
import { useUpgrades } from './useUpgrades';
import { logAutopoiesis } from '../utils/logger';
import { 
  makeIntelligentDecision, 
  updateActivityEffectiveness 
} from '../utils/aiDecisionEngine';
// Importar el nuevo sistema homeostático
import {
  mapOldStatsToNew,
  mapNewStatsToOld,
  applyHomeostasis,
  applyNormalizedActivityEffects
} from '../utils/homeostasisSystem';

// Aplicar efectos del nuevo sistema homeostático normalizado
const applyComplexActivityEffects = (
  entity: Entity, 
  deltaTime: number, 
  dispatch: React.Dispatch<GameAction>
) => {
  return measureExecutionTime(`applyComplexActivityEffects-${entity.id}`, () => {
    try {
      // Convertir stats actuales al sistema normalizado
      const normalizedStats = mapOldStatsToNew(entity.stats);
      
      // Aplicar homeostasis natural (tendencia hacia equilibrio)
      const afterHomeostasis = applyHomeostasis(normalizedStats, deltaTime);
      
      // Aplicar efectos de la actividad actual
      const afterActivity = applyNormalizedActivityEffects(
        afterHomeostasis,
        entity.activity,
        deltaTime
      );
      
      // Convertir de vuelta al formato original
      const newStats = mapNewStatsToOld(afterActivity);
      
      // Obtener objeto del pool para los cambios
      const statsChanges = getPooledStatsUpdate();
      
      // Calcular diferencias y aplicar solo cambios significativos
      let hasSignificantChanges = false;
      for (const [key, newValue] of Object.entries(newStats)) {
        const currentValue = entity.stats[key as keyof EntityStats] || 0;
        const change = newValue - currentValue;
        
        if (Math.abs(change) > 0.1) {
          statsChanges[key as keyof EntityStats] = newValue;
          hasSignificantChanges = true;
        }
      }

      if (hasSignificantChanges) {
        dispatch({
          type: 'UPDATE_ENTITY_STATS',
          payload: { entityId: entity.id, stats: { ...statsChanges } }
        });
      }
      
      // Devolver objeto al pool
      releasePooledStatsUpdate(statsChanges);
    } catch (error) {
      console.error('Error in applyComplexActivityEffects:', error);
    }
  });
};

// Cálculo de estado de ánimo optimizado para sistema normalizado
const calculateOptimizedMood = (stats: EntityStats, resonance: number): EntityMood => {
  // En el sistema normalizado, 50 es óptimo, valores extremos (0-20 o 80-100) son problemáticos
  const criticalFactors = [
    stats.hunger > 80 || stats.hunger < 20,
    stats.sleepiness > 80 || stats.sleepiness < 20,
    stats.loneliness > 80 || stats.loneliness < 20,
    stats.energy < 20 || stats.energy > 80,
    stats.boredom > 80 || stats.boredom < 20
  ].filter(Boolean).length;

  // Situaciones críticas
  if (criticalFactors >= 3) return 'ANXIOUS';
  if (stats.energy < 25) return 'TIRED';
  if (stats.loneliness > 75 && resonance < 30) return 'SAD';
  
  // Calcular distancia del equilibrio homeostático (50 es óptimo)
  const statKeys = ['hunger', 'sleepiness', 'loneliness', 'energy', 'boredom'] as const;
  const balanceScore = statKeys.reduce((sum, key) => {
    const value = stats[key] || 50;
    const distanceFromOptimal = Math.abs(value - 50);
    return sum + (50 - distanceFromOptimal); // Mejor puntuación si está cerca de 50
  }, 0) / statKeys.length;
  
  // Bonus por happiness y dinero
  const happinessBonus = (stats.happiness - 50) * 0.5;
  const moneyBonus = Math.min((stats.money - 50) * 0.2, 10);
  const bondBonus = resonance > 70 ? 15 : resonance < 30 ? -10 : 0;
  
  const totalMoodScore = balanceScore + happinessBonus + moneyBonus + bondBonus;
  
  if (totalMoodScore > 60 && stats.energy > 40 && stats.energy < 70) return 'EXCITED';
  if (totalMoodScore > 45) return 'HAPPY';
  if (totalMoodScore > 35) return 'CONTENT';
  if (totalMoodScore > 25) return 'CALM';
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
    
    logAutopoiesis.info('Sistema Híbrido Autopoiesis Mejorado iniciado', { interval: autopoiesisInterval });
    
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
          applyComplexActivityEffects(entity, deltaTime, dispatch);
          
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
                logAutopoiesis.debug(`${entity.id}: ${entity.activity} → ${newActivity}`);
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
        logAutopoiesis.info('Sistema Híbrido Autopoiesis Mejorado detenido');
      }
    };
  }, [gameState.entities, gameState.zones, gameState.resonance, dispatch, getUpgradeEffect]);
};
