/**
 * 🚨 COMPONENTE DE ALERTAS DE SUPERVIVENCIA
 * 
 * Muestra alertas tempranas cuando las entidades están en peligro
 * Parte del sistema de mejoras para ciclo de vida mínimo estable
 */

import React from 'react';
import type { SurvivalAlert } from '../improvements/survivabilityEnhancements';
import { TRANSLATIONS } from "../constants";

interface SurvivalAlertDisplayProps {
  alert: SurvivalAlert | null;
  entityName: string;
}

export const SurvivalAlertDisplay: React.FC<SurvivalAlertDisplayProps> = ({ 
  alert, 
  entityName 
}) => {
  if (!alert) return null;

  const getAlertColor = (type: SurvivalAlert['type']) => {
    switch (type) {
      case 'EMERGENCY': return 'bg-red-500 border-red-600 text-white';
      case 'CRITICAL': return 'bg-orange-500 border-orange-600 text-white';
      case 'WARNING': return 'bg-yellow-500 border-yellow-600 text-black';
      default: return 'bg-blue-500 border-blue-600 text-white';
    }
  };

  const getAlertIcon = (type: SurvivalAlert['type']) => {
    switch (type) {
      case 'EMERGENCY': return '🆘';
      case 'CRITICAL': return '⚠️';
      case 'WARNING': return '💛';
      default: return 'ℹ️';
    }
  };

  const formatTimeToString = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  return (
    <div className={`
      fixed top-4 left-1/2 transform -translate-x-1/2 z-50
      p-4 rounded-lg border-2 shadow-lg max-w-md w-full mx-4
      ${getAlertColor(alert.type)}
      animate-pulse
    `}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getAlertIcon(alert.type)}</span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">
              {alert.type === 'EMERGENCY' ? '🆘 EMERGENCIA' : 
               alert.type === 'CRITICAL' ? '⚠️ CRÍTICO' : 
               '💛 ALERTA'}
            </h3>
            {alert.timeToDeathEstimate && (
              <span className="text-sm opacity-90">
                ~{formatTimeToString(alert.timeToDeathEstimate)}
              </span>
            )}
          </div>
          
          <p className="text-sm mb-2">
            <strong>{entityName}</strong> necesita atención urgente
          </p>
          
          {alert.stats.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-1">Stats en peligro:</p>
              <div className="flex flex-wrap gap-1">
                {alert.stats.map(stat => (
                  <span 
                    key={stat}
                    className="px-2 py-1 bg-black bg-opacity-20 rounded text-xs"
                  >
                    {TRANSLATIONS.STATS[stat as keyof typeof TRANSLATIONS.STATS] || stat}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <p className="text-sm font-medium mb-1">Acciones recomendadas:</p>
            <ul className="text-xs space-y-1">
              {alert.recommendedActions.map((action, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span>•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
