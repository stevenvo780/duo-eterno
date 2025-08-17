/**
 * 🎮 GAME LOOP SIMPLIFICADO - VERSIÓN FUNCIONAL
 * 
 * Versión ultra-simplificada que realmente funciona
 */

import { useEffect } from 'react';
import { useGame } from './useGame';
import type { EntityStats } from '../types';
import { getGameConfig } from '../config/gameConfig';
import { SURVIVAL } from '../constants';
import { robustStateUtils } from '../utils/robustStateManagement';

export const useGameLoop = () => {
  const { gameState, dispatch } = useGame();
  const config = getGameConfig();
  
  useEffect(() => {
    const TICK_INTERVAL = 2000; // 2 segundos para degradación visible
    let isRunning = true;
    
    const mainGameTick = () => {
      if (!isRunning || !gameState.entities.length) return;
      
      const deltaTime = TICK_INTERVAL / 1000; // 2 segundos
      
      if (config.debugMode) {
        console.log(`🎮 GameLoop tick, deltaTime: ${deltaTime}s`);
        console.log('📊 Estado actual:', gameState.entities.map(e => ({
          id: e.id,
          health: e.stats.health.toFixed(1),
          hunger: e.stats.hunger.toFixed(1),
          energy: e.stats.energy.toFixed(1)
        })));
      }

      // Aplicar degradación a cada entidad
      gameState.entities.forEach(entity => {
        let newStats = { ...entity.stats };
        
        // Aplicar degradación de cada stat
        Object.entries(SURVIVAL.DEGRADATION_RATES).forEach(([statUpper, baseRate]) => {
          const statKey = statUpper.toLowerCase() as keyof EntityStats;
          const degradationAmount = baseRate * deltaTime;
          
          if (config.debugMode) {
            console.log(`⬇️ Aplicando degradación a entidad ${entity.id} - ${statKey}: -${degradationAmount.toFixed(3)}`);
          }
          
          // Usar robustStateUtils correctamente
          newStats = robustStateUtils.applyStatChange(
            newStats,
            statKey, 
            -degradationAmount, 
            `degradation-${statKey}`
          );
        });
        
        // Dispatch de los nuevos stats
        dispatch({
          type: 'UPDATE_ENTITY_STATS',
          payload: { 
            entityId: entity.id, 
            stats: newStats
          }
        });
      });

      // Calcular resonancia simple
      if (gameState.entities.length >= 2) {
        const avgHealth = gameState.entities.reduce((sum, e) => sum + e.stats.health, 0) / gameState.entities.length;
        const newResonance = Math.max(0, Math.min(100, avgHealth));
        
        dispatch({
          type: 'UPDATE_RESONANCE',
          payload: newResonance
        });
      }
    };

    if (config.debugMode) {
      console.log('🚀 Iniciando Game Loop Simplificado (1 tick cada 2 segundos)...');
    }
    
    // Ejecutar inmediatamente y luego cada 2 segundos
    mainGameTick();
    const intervalId = setInterval(mainGameTick, TICK_INTERVAL);

    return () => {
      if (config.debugMode) {
        console.log('🛑 Deteniendo Game Loop Simplificado...');
      }
      isRunning = false;
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sin dependencias para evitar reinicios
  
  return {
    isRunning: true
  };
};