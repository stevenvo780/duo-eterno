import { useEffect, useRef } from 'react';
import type { GameState, EntityStateType, ActivityType, EntityStats, MoodType } from '../types';
import { safeLoad, safeSave } from '../utils/persistence';
import { logStorage } from '../utils/logger';

type GameAction = 
  | { type: 'UPDATE_RESONANCE'; payload: number }
  | { type: 'UPDATE_ENTITY_POSITION'; payload: { entityId: string; position: { x: number; y: number } } }
  | { type: 'UPDATE_ENTITY_STATE'; payload: { entityId: string; state: EntityStateType } }
  | { type: 'UPDATE_ENTITY_ACTIVITY'; payload: { entityId: string; activity: ActivityType } }
  | { type: 'UPDATE_ENTITY_STATS'; payload: { entityId: string; stats: Partial<EntityStats> } }
  | { type: 'UPDATE_ENTITY_MOOD'; payload: { entityId: string; mood: MoodType } }
  | { type: 'KILL_ENTITY'; payload: { entityId: string } }
  | { type: 'UPDATE_TOGETHER_TIME'; payload: number };


export const usePersistence = (gameState: GameState, dispatch: (action: GameAction) => void) => {
  const lastSaveRef = useRef<number>(0);


  useEffect(() => {
    const loaded = safeLoad();
    if (loaded) {
      logStorage.info('Persistencia: cargado estado V1');

      dispatch({ type: 'UPDATE_RESONANCE', payload: loaded.resonance });
      loaded.entities.forEach(e => {
        dispatch({ type: 'UPDATE_ENTITY_POSITION', payload: { entityId: e.id, position: e.position } });
        dispatch({ type: 'UPDATE_ENTITY_STATS', payload: { entityId: e.id, stats: e.stats } });
        dispatch({ type: 'UPDATE_ENTITY_MOOD', payload: { entityId: e.id, mood: e.mood } });
        dispatch({ type: 'UPDATE_ENTITY_STATE', payload: { entityId: e.id, state: e.state } });
        dispatch({ type: 'UPDATE_ENTITY_ACTIVITY', payload: { entityId: e.id, activity: e.activity } });
        if (e.isDead) dispatch({ type: 'KILL_ENTITY', payload: { entityId: e.id } });
      });
      dispatch({ type: 'UPDATE_TOGETHER_TIME', payload: loaded.togetherTime });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    const handler = window.setInterval(() => {
      const now = Date.now();
      if (now - lastSaveRef.current >= 20000) {
        safeSave(gameState);
        lastSaveRef.current = now;
      }
    }, 5000);

    const beforeUnload = () => {
      try { 
        safeSave(gameState); 
      } catch (error) {

        logStorage.warn('Failed to save on unload', error);
      }
    };
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      clearInterval(handler);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [gameState]);
};
