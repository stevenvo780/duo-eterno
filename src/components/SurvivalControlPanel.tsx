/**
 * 🎛️ PANEL DE CONTROL DEL SISTEMA DE SUPERVIVENCIA
 * 
 * Interfaz para configurar y monitorear las mejoras de supervivencia
 */

import React, { useState } from 'react';
import { useSurvivalEnhancements } from '../hooks/useSurvivalEnhancements';
import { SurvivalAlertDisplay } from './SurvivalAlertDisplay';
import { useGame } from '../hooks/useGame';

export const SurvivalControlPanel: React.FC = () => {
  const { gameState } = useGame();
  const {
    config,
    alerts,
    systemStats,
    toggleSystem,
    setDifficulty,
    toggleAlerts,
    toggleGracePeriod,
    difficultyConfigs
  } = useSurvivalEnhancements();

  const [isExpanded, setIsExpanded] = useState(false);

  const firstAlert = alerts.size > 0 ? Array.from(alerts.entries())[0] : null;

  return (
    <>
      {/* Mostrar primera alerta si existe */}
      {firstAlert && config.showAlerts && (
        <SurvivalAlertDisplay
          alert={firstAlert[1]}
          entityName={gameState.entities.find(e => e.id === firstAlert[0])?.id || 'Entidad'}
        />
      )}

      {/* Panel de control colapsible */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className={`
          bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-80 h-96' : 'w-16 h-16'}
        `}>
          {/* Botón de toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              absolute top-2 right-2 w-12 h-12 rounded-full
              bg-blue-500 hover:bg-blue-600 text-white
              flex items-center justify-center transition-colors
              ${systemStats.criticalEntities > 0 ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}
            `}
            title={isExpanded ? 'Cerrar panel' : 'Abrir panel de supervivencia'}
          >
            {isExpanded ? '✕' : systemStats.criticalEntities > 0 ? '🆘' : '🛡️'}
          </button>

          {/* Contenido expandido */}
          {isExpanded && (
            <div className="p-4 h-full flex flex-col">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                🛡️ Sistema de Supervivencia
              </h3>

              {/* Estadísticas rápidas */}
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Entidades vivas:</span>
                    <span className="ml-2 font-semibold">{systemStats.livingEntities}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">En peligro:</span>
                    <span className={`ml-2 font-semibold ${systemStats.entitiesInDanger > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                      {systemStats.entitiesInDanger}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Críticas:</span>
                    <span className={`ml-2 font-semibold ${systemStats.criticalEntities > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {systemStats.criticalEntities}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Salud prom:</span>
                    <span className="ml-2 font-semibold">{Math.round(systemStats.averageHealth)}%</span>
                  </div>
                </div>
              </div>

              {/* Controles */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {/* Toggle sistema */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sistema mejorado
                  </label>
                  <button
                    onClick={toggleSystem}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${config.enabled ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${config.enabled ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Selector de dificultad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dificultad
                  </label>
                  <select
                    value={config.difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'EASY' | 'NORMAL' | 'HARD')}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 dark:border-gray-600"
                    disabled={!config.enabled}
                  >
                    <option value="EASY">Fácil - Más tolerante</option>
                    <option value="NORMAL">Normal - Balanceado</option>
                    <option value="HARD">Difícil - Más desafiante</option>
                  </select>
                </div>

                {/* Toggle alertas */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mostrar alertas
                  </label>
                  <button
                    onClick={toggleAlerts}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${config.showAlerts ? 'bg-blue-500' : 'bg-gray-300'}
                    `}
                    disabled={!config.enabled}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${config.showAlerts ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Toggle período de gracia */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Período de gracia
                  </label>
                  <button
                    onClick={toggleGracePeriod}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${config.gracePeriodEnabled ? 'bg-purple-500' : 'bg-gray-300'}
                    `}
                    disabled={!config.enabled}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${config.gracePeriodEnabled ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Información de dificultad */}
                {config.enabled && (
                  <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Configuración actual:
                    </p>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Decay: {Math.round(difficultyConfigs[config.difficulty].decayMultiplier * 100)}%</li>
                      <li>• Salud decay: {difficultyConfigs[config.difficulty].healthDecayRate}</li>
                      <li>• Recuperación: {difficultyConfigs[config.difficulty].recoveryRate}</li>
                      <li>• Costo vida: {difficultyConfigs[config.difficulty].livingCost}/min</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Lista de alertas activas */}
              {alerts.size > 0 && config.showAlerts && (
                <div className="mt-2 max-h-20 overflow-y-auto">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Alertas activas ({alerts.size}):
                  </p>
                  {Array.from(alerts.entries()).map(([entityId, alert]) => {
                    const entity = gameState.entities.find(e => e.id === entityId);
                    return (
                      <div key={entityId} className="flex items-center gap-2 text-xs p-1">
                        <span>{alert.type === 'EMERGENCY' ? '🆘' : '⚠️'}</span>
                        <span className="truncate">{entity?.id || entityId}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
