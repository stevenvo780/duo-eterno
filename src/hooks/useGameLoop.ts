/**
 * Game loop principal: degradación de stats, efectos por actividad con modificadores día/noche y actualización de resonancia.
 */

import { useEffect, useRef } from 'react';
import { useGame } from './useGame';
import { useDayNightCycle } from './useDayNightCycle';
import type { EntityStats, Entity } from '../types';
import { getGameConfig, getGameIntervals } from '../config/gameConfig';
import { SURVIVAL } from '../constants';
import { robustStateUtils } from '../utils/robustStateManagement';
import { optimizedDynamicsLogger, logGeneral } from '../utils/optimizedDynamicsLogger';
import { applyActivityEffectsWithTimeModifiers } from '../utils/activityDynamics';

export const useGameLoop = () => {
  const { gameState, dispatch } = useGame();
  const { currentTime } = useDayNightCycle();
  const config = getGameConfig();

  const intervalRef = useRef<number | undefined>(undefined);
  const startedRef = useRef<boolean>(false);
  const lastTickMsRef = useRef<number>(Date.now());
  const tickCountRef = useRef<number>(0);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const { main: TICK_INTERVAL } = getGameIntervals();

    if (intervalRef.current != null || startedRef.current) {
      if (config.debugMode) logGeneral.warn('Game Loop ya activo, evitando reinicio');
      return () => {};
    }

    if (config.debugMode) {
      console.log('🚀 Iniciando Game Loop Sintetizado...');
    }

    startedRef.current = true;
    lastTickMsRef.current = Date.now();

    const mainGameTick = () => {
      const now = Date.now();
      const deltaMs = now - lastTickMsRef.current;
      if (deltaMs < TICK_INTERVAL * 0.8) return;
      lastTickMsRef.current = now;
      tickCountRef.current++;

      const deltaSec = deltaMs / 1000;

      dispatch({ type: 'TICK', payload: deltaMs });

      const livingEntities = gameStateRef.current.entities.filter(e => !e.isDead);

      livingEntities.forEach(entity => {
        let newStats = { ...entity.stats };

        // Aplicar degradación base
        (Object.entries(SURVIVAL.DEGRADATION_RATES) as Array<[string, number]>).forEach(
          ([statUpper, baseRate]) => {
            const statKey = statUpper.toLowerCase() as keyof EntityStats;
            const degradationAmount = baseRate * deltaSec;

            newStats = robustStateUtils.applyStatChange(
              newStats,
              statKey,
              -degradationAmount,
              `degradation-${statKey}`
            );
          }
        );

        // Aplicar efectos de actividad con modificadores de tiempo del día
        if (entity.activity) {
          const timeOfDay = {
            isNight: currentTime.isNight,
            phase: currentTime.phase,
            hour: currentTime.hour
          };

          // Aplicar efectos de actividad con bonificaciones de día/noche
          const activityModifiedStats = applyActivityEffectsWithTimeModifiers(
            entity.activity,
            newStats,
            deltaMs,
            timeOfDay
          );

          // Solo usar los efectos modificados para stats específicos que se benefician del día/noche
          if (entity.activity === 'RESTING' && currentTime.isNight) {
            newStats.energy = activityModifiedStats.energy;
            newStats.sleepiness = activityModifiedStats.sleepiness;
            newStats.health = activityModifiedStats.health;
            newStats.boredom = activityModifiedStats.boredom;
          } else if (entity.activity === 'SOCIALIZING' && currentTime.isNight) {
            newStats.happiness = activityModifiedStats.happiness;
          } else if (
            (entity.activity === 'MEDITATING' || entity.activity === 'CONTEMPLATING') &&
            (currentTime.phase === 'night' || currentTime.phase === 'dawn')
          ) {
            // Aplicar efectos mejorados para meditación/contemplación durante la noche/amanecer
            Object.keys(activityModifiedStats).forEach(statKey => {
              const key = statKey as keyof EntityStats;
              if (activityModifiedStats[key] > newStats[key]) {
                newStats[key] = activityModifiedStats[key];
              }
            });
          }
        }

        const changed = (Object.keys(newStats) as Array<keyof EntityStats>).some(k => {
          const a = newStats[k] as number;
          const b = entity.stats[k] as number;
          return Math.abs(a - b) > 0.001;
        });
        if (changed) {
          dispatch({
            type: 'UPDATE_ENTITY_STATS',
            payload: { entityId: entity.id, stats: newStats }
          });
        }
      });

      if (tickCountRef.current % 4 === 0) {
        const crit = config.survival.criticalThresholds;
        livingEntities.forEach(entity => {
          const hungerCritical = entity.stats.hunger < crit.hunger;
          const energyCritical = entity.stats.energy < crit.energy;

          let healthChange = 0;
          if (hungerCritical || energyCritical) {
            const count = (hungerCritical ? 1 : 0) + (energyCritical ? 1 : 0);
            healthChange = -count * 0.5 * deltaSec;
          } else {
            healthChange = 0.2 * deltaSec;
          }

          const newHealth = Math.max(0, Math.min(100, entity.stats.health + healthChange));

          if (Math.abs(newHealth - entity.stats.health) > 0.01) {
            dispatch({
              type: 'UPDATE_ENTITY_STATS',
              payload: { entityId: entity.id, stats: { health: newHealth } }
            });
          }

          if (newHealth <= 0 && !entity.isDead) {
            optimizedDynamicsLogger.logEntityDeath(
              entity.id,
              'estadísticas críticas',
              entity.stats
            );
            dispatch({ type: 'KILL_ENTITY', payload: { entityId: entity.id } });
            logGeneral.warn(`Entidad murió: ${entity.id}`, { stats: entity.stats });
          } else if (hungerCritical || energyCritical) {
            optimizedDynamicsLogger.logStatsCritical(
              entity.id,
              [...(hungerCritical ? ['hunger'] : []), ...(energyCritical ? ['energy'] : [])],
              entity.stats
            );
          }
        });
      }

      // Modelo de resonancia: ganancia por cercanía + sincronía de actividad, con decaimiento
      // Detalles científicos:
      // - closeness: función logística 1/(1+e^{(d-maxD)/k}) con k=distScale que suaviza la contribución por distancia.
      // - activityBonus: factor multiplicativo si comparten actividad.
      // - Dinámica: dR = (gain - decay) * dt, con decay proporcional al nivel actual R.
      // - Normalización: R se mantiene en [0,100].
      if (tickCountRef.current % 2 === 0 && livingEntities.length === 2) {
        const [a, b] = livingEntities as [Entity, Entity];
        const dx = a.position.x - b.position.x;
        const dy = a.position.y - b.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const R = gameStateRef.current.resonance;
        const maxD = Math.max(1, config.resonance.maxDistance);
        const distScale = Math.max(1, maxD / 4);
        // Función logística (sigmoide) para convertir distancia a cercanía [0,1]
        const closeness = 1 / (1 + Math.exp((distance - maxD) / distScale));

        const sameActivity = a.activity === b.activity ? 1 : 0;
        const activityBonus = 1 + (sameActivity ? config.resonance.activitySyncBonus - 1 : 0);

        // Balance de ganancia–decaimiento:
        // - gain decrece conforme R→100 (saturación suave)
        // - decay crece linealmente con R (estabilidad del equilibrio)
        const gain = closeness * config.resonance.harmonyBonus * activityBonus * (1 - R / 100);
        const decay = config.resonance.decayRate * (R / 100);
        const dR = (gain - decay) * (deltaSec * 100);
        const newRes = Math.max(0, Math.min(100, R + dR));

        if (Math.abs(newRes - R) > 0.001) {
          optimizedDynamicsLogger.logResonanceChange(R, newRes, 'modelo sintetizado', [a, b]);
          dispatch({ type: 'UPDATE_RESONANCE', payload: newRes });
        }
      }

      // Telemetría periódica: snapshots de entidades y estado global para análisis
      if (tickCountRef.current % 50 === 0) {
        livingEntities.forEach(e => optimizedDynamicsLogger.takeEntitySnapshot(e));
        optimizedDynamicsLogger.takeSystemSnapshot(
          gameStateRef.current.resonance,
          gameStateRef.current.togetherTime,
          gameStateRef.current.cycles,
          gameStateRef.current.entities
        );
      }
    };

    mainGameTick();
    intervalRef.current = window.setInterval(mainGameTick, TICK_INTERVAL);

    return () => {
      if (config.debugMode) console.log('🛑 Deteniendo Game Loop Sintetizado...');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      startedRef.current = false;
      optimizedDynamicsLogger.forceCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isRunning: true };
};
