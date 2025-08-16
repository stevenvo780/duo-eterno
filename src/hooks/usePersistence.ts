import { useEffect, useRef } from 'react';
import type { GameState } from '../types';
import { safeLoad, safeSave } from '../utils/persistence';
import { logStorage } from '../utils/logger';

// Persistencia mínima: autosave cada 20s y beforeunload
export const usePersistence = (gameState: GameState, dispatch: (action: any) => void) => {
  const lastSaveRef = useRef<number>(0);

  // Load on mount
  useEffect(() => {
    const loaded = safeLoad();
    if (loaded) {
      logStorage.info('Persistencia: cargado estado V1');
      // Transform loaded minimal state to full GameState via dispatch sequence
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

  // Autosave loop every 20s with minimal writes
  useEffect(() => {
    const handler = window.setInterval(() => {
      const now = Date.now();
      if (now - lastSaveRef.current >= 20000) {
        safeSave(gameState);
        lastSaveRef.current = now;
      }
    }, 5000);

    const beforeUnload = () => {
      try { safeSave(gameState); } catch {}
    };
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      clearInterval(handler);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [gameState]);
};
