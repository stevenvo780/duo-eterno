import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { shouldUpdateMovement, measureExecutionTime } from '../utils/performanceOptimizer';
import { makeIntelligentDecision } from '../utils/aiDecisionEngine';

export const useEntityMovement = () => {
  const { gameState, dispatch } = useGame();
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0);

  useEffect(() => {
    function updateMovement() {
      const now = performance.now();
      if (!shouldUpdateMovement()) {
        animationRef.current = requestAnimationFrame(updateMovement);
        return;
      }
      lastUpdateTime.current = now;
      measureExecutionTime('entity-movement', () => {
        const livingEntities = gameState.entities.filter(e => !e.isDead && e.state !== 'DEAD');
        for (const entity of livingEntities) {
          const companion = livingEntities.find(e2 => e2.id !== entity.id) || null;
          // Decisión de IA
          const newActivity = makeIntelligentDecision(
            entity,
            companion,
            gameState.zones,
            gameState.resonance,
            now
          );
          if (newActivity !== entity.activity) {
            dispatch({
              type: 'UPDATE_ENTITY_ACTIVITY',
              payload: { entityId: entity.id, activity: newActivity }
            });
          }
          // Movimiento simple (puedes expandir con repulsión, colisiones, etc.)
        }
      });
      animationRef.current = requestAnimationFrame(updateMovement);
    }
    animationRef.current = requestAnimationFrame(updateMovement);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState.entities, gameState.zones, gameState.resonance, dispatch]);
};
