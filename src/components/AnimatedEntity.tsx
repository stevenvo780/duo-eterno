/**
 * 🎭 ENTIDAD SIMPLE
 *
 * Representa entidades del juego con sprites estáticos
 */

import React from 'react';
import type { Entity } from '../types';

interface AnimatedEntityProps {
  entity: Entity;
  size?: number;
  showMoodIndicator?: boolean;
  showActivityIndicator?: boolean;
  onClick?: () => void;
}

export const AnimatedEntity: React.FC<AnimatedEntityProps> = ({
  entity,
  size = 32,
  showMoodIndicator = true,
  showActivityIndicator = true,
  onClick
}) => {
  const getEntityColor = () => {
    if (entity.stats?.health !== undefined && entity.stats.health <= 10) {
      return '#666'; // gris para dying
    }

    if (entity.mood) {
      switch (entity.mood.toLowerCase()) {
        case 'happy':
        case 'excited':
        case 'content':
          return '#4ade80'; // verde
        case 'sad':
        case 'lonely':
        case 'bored':
          return '#f87171'; // rojo
        default:
          return '#60a5fa'; // azul
      }
    }

    return '#60a5fa'; // azul por defecto
  };

  const getEntityShape = () => {
    if (entity.id === 'square') {
      return 'square';
    }
    return 'circle';
  };

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: size,
        height: size,
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {/* Sprite de la entidad */}
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: getEntityColor(),
          borderRadius: getEntityShape() === 'circle' ? '50%' : '10%',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      />

      {/* Indicador de humor */}
      {showMoodIndicator && entity.mood && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            fontSize: '12px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '2px 4px',
            borderRadius: '4px',
            pointerEvents: 'none'
          }}
        >
          {entity.mood?.toLowerCase() === 'happy' ? '😊' : entity.mood?.toLowerCase() === 'sad' ? '😢' : '😐'}
        </div>
      )}

      {/* Indicador de actividad */}
      {showActivityIndicator && entity.activity && (
        <div
          style={{
            position: 'absolute',
            bottom: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '1px 3px',
            borderRadius: '3px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {entity.activity}
        </div>
      )}
    </div>
  );
};