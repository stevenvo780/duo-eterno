/**
 * Hook centralizado para manejar el loop principal del juego
 * Combina todos los sistemas en un único intervalo optimizado
 */

import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getGameIntervals, gameConfig } from '../config/gameConfig';
import type { Entity, EntityMood, EntityStats } from '../types';

interface GameLoopStats {
  totalTicks: number;
  autopoiesisTicks: number;
  movementTicks: number;
  clockTicks: number;
  lastTickTime: number;
}

export const useUnifiedGameLoop = () => {
  const { gameState, dispatch } = useGame();
  
  const intervalRef = useRef<number | undefined>(undefined);
  const statsRef = useRef<GameLoopStats>({
    totalTicks: 0,
    autopoiesisTicks: 0,
    movementTicks: 0,
    clockTicks: 0,
    lastTickTime: Date.now()
  });

  // Función para calcular el mood optimizado
  const calculateOptimizedMood = (stats: Entity['stats'], resonance: number): EntityMood => {
    const criticalFactors = [
      stats.hunger > 85,
      stats.sleepiness > 85,
      stats.loneliness > 85,
      stats.energy < 15,
      stats.money < 10
    ].filter(Boolean).length;
    if (criticalFactors >= 2) return 'ANXIOUS';
    const positiveScore = (stats.happiness + stats.energy + Math.min(100, stats.money)) / 3;
    const negativeScore = (stats.hunger + stats.sleepiness + stats.boredom + stats.loneliness) / 4;
    const bondBonus = resonance > 70 ? 15 : resonance < 30 ? -10 : 0;
    const moodScore = positiveScore - negativeScore + bondBonus;
    if (moodScore > 50 && stats.energy > 60) return 'EXCITED';
    if (moodScore > 25) return 'CONTENT';
    if (moodScore > 5) return 'CALM';
    if (moodScore > -15) return 'TIRED';
    return 'SAD';
  };

  useEffect(() => {
    const { gameClockInterval } = getGameIntervals();
    intervalRef.current = window.setInterval(() => {
      // Actualizar estado y mood de cada entidad
      const decay = gameConfig.baseDecayMultiplier;
      gameState.entities.forEach(entity => {
        // Mood
        const newMood = calculateOptimizedMood(entity.stats, gameState.resonance);
        if (newMood !== entity.mood) {
          dispatch({ type: 'UPDATE_ENTITY_MOOD', payload: { entityId: entity.id, mood: newMood } });
        }
        // Decaimiento y regeneración de stats
        const updated: Partial<EntityStats> = {
          hunger: entity.stats.hunger + decay,
          sleepiness: entity.stats.sleepiness + decay,
          loneliness: entity.stats.loneliness + decay,
          boredom: entity.stats.boredom + decay,
          energy: entity.stats.energy - decay,
          happiness: entity.stats.happiness - decay
        };
        dispatch({ type: 'UPDATE_ENTITY_STATS', payload: { entityId: entity.id, stats: updated } });
      });
      dispatch({ type: 'TICK' });
      statsRef.current.totalTicks++;
    }, gameClockInterval);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [gameState.entities, gameState.resonance, dispatch]);

  return {
    stats: statsRef.current
  };
};
