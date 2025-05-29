/**
 * Hook centralizado para manejar el loop principal del juego
 * Combina todos los sistemas en un único intervalo optimizado
 */

import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { getGameIntervals } from '../config/gameConfig';
import { applyUnifiedHomeostasis } from '../utils/homeostasisSystem';
import { getEntityZone } from '../utils/mapGeneration';
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
      // Actualizar estado y mood de cada entidad usando homeostasis unificada
      gameState.entities.forEach(entity => {
        const companion = gameState.entities.find(e => e.id !== entity.id);
        const currentZone = getEntityZone(entity.position, gameState.zones);
        
        // Aplicar homeostasis unificada que incluye todos los efectos
        const newStats = applyUnifiedHomeostasis(
          entity,
          companion || null,
          gameState.resonance,
          currentZone,
          1.0 // deltaTime incrementado de 0.5 a 1.0 para más cambio por tick
        );
        
        // Mood
        const newMood = calculateOptimizedMood(newStats, gameState.resonance);
        if (newMood !== entity.mood) {
          dispatch({ type: 'UPDATE_ENTITY_MOOD', payload: { entityId: entity.id, mood: newMood } });
        }
        
        // Actualizar stats solo si han cambiado significativamente
        const hasSignificantChange = Object.keys(newStats).some(key => {
          const statKey = key as keyof EntityStats;
          return Math.abs(newStats[statKey] - entity.stats[statKey]) > 0.2; // Umbral reducido para detectar más cambios
        });
        
        if (hasSignificantChange) {
          dispatch({ type: 'UPDATE_ENTITY_STATS', payload: { entityId: entity.id, stats: newStats } });
        }
      });

      // Sistema Together-Time: Incrementar resonancia cuando los agentes están cerca
      const livingEntities = gameState.entities.filter(e => !e.isDead);
      if (livingEntities.length === 2) {
        const [entity1, entity2] = livingEntities;
        const distance = Math.sqrt(
          Math.pow(entity1.position.x - entity2.position.x, 2) + 
          Math.pow(entity1.position.y - entity2.position.y, 2)
        );

        const CLOSE_DISTANCE = 60; // Aumentar distancia de "cerca" para ser más permisivo
        
        if (distance < CLOSE_DISTANCE) {
          // Cerca uno del otro - acumular tiempo juntos
          const newTogetherTime = gameState.togetherTime + gameClockInterval;
          dispatch({ type: 'UPDATE_TOGETHER_TIME', payload: newTogetherTime });

          // Auto-sustain: +1 resonancia cada 2 segundos cuando están cerca
          if (newTogetherTime > 0 && newTogetherTime % 2000 < gameClockInterval && gameState.resonance < 100) {
            const resonanceBonus = Math.min(1, 100 - gameState.resonance);
            dispatch({ type: 'UPDATE_RESONANCE', payload: gameState.resonance + resonanceBonus });
            
            // Mostrar diálogo ocasional (solo cada 10 segundos para no spamear)
            if (newTogetherTime % 10000 < gameClockInterval && Math.random() < 0.5) {
              const messages = [
                "Siento la calidez de tu presencia...",
                "Juntos somos más fuertes...", 
                "Nuestro vínculo se fortalece...",
                "Esta cercanía me tranquiliza..."
              ];
              const randomMessage = messages[Math.floor(Math.random() * messages.length)];
              dispatch({
                type: 'SHOW_DIALOGUE',
                payload: { 
                  message: randomMessage,
                  speaker: Math.random() < 0.5 ? 'circle' : 'square',
                  duration: 3000
                }
              });
            }
          }
        } else {
          // Están lejos - perder tiempo juntos gradualmente
          if (gameState.togetherTime > 0) {
            const decay = Math.min(gameState.togetherTime, gameClockInterval * 2); // Decay 2x más rápido de lo que acumula
            dispatch({ type: 'UPDATE_TOGETHER_TIME', payload: gameState.togetherTime - decay });
          }
        }
      }

      dispatch({ type: 'TICK' });
      statsRef.current.totalTicks++;
    }, gameClockInterval);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [gameState.entities, gameState.resonance, gameState.zones, gameState.togetherTime, dispatch]);

  return {
    stats: statsRef.current
  };
};
