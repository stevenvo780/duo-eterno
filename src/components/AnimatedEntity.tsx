/**
 * 🎭 SISTEMA DE ENTIDADES ANIMADAS
 * 
 * Sistema que gestiona automáticamente las animaciones de entidades
 * basándose en su estado y tipo
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AnimatedSprite } from './AnimatedSprite';
import { spriteAnimationManager } from '../utils/spriteAnimationManager';
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
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0); // Para forzar re-render

  // Mapear tipo de entidad a prefijo de animación
  const entityPrefix = useMemo(() => {
    switch (entity.id) {
      case 'circle':
        return 'entidad_circulo';
      case 'square':
        return 'entidad_square';
      default:
        return 'entidad_circulo'; // fallback
    }
  }, [entity.id]);

  // Determinar la animación basada en el estado de la entidad
  const determineAnimation = useMemo(() => {
    // Prioridad: dying > mood states > default happy
    if (entity.stats?.health !== undefined && entity.stats.health <= 10) {
      return `${entityPrefix}_dying`;
    }
    
    if (entity.mood) {
      switch (entity.mood.toLowerCase()) {
        case 'happy':
        case 'excited':
        case 'content':
          return `${entityPrefix}_happy`;
        case 'sad':
        case 'lonely':
        case 'bored':
          return `${entityPrefix}_sad`;
        default:
          return `${entityPrefix}_happy`; // default feliz
      }
    }
    
    return `${entityPrefix}_happy`; // default
  }, [entity.mood, entity.stats?.health, entityPrefix]);

  // Actualizar animación cuando cambie el estado
  useEffect(() => {
    if (determineAnimation !== currentAnimation) {
      setCurrentAnimation(determineAnimation);
      setAnimationKey(prev => prev + 1); // Forzar recreación del componente AnimatedSprite
    }
  }, [determineAnimation, currentAnimation]);

  // Verificar que la animación esté disponible
  useEffect(() => {
    if (currentAnimation) {
      // Verificar que la animación existe y precargarla
      spriteAnimationManager.loadAnimation(currentAnimation, 'animations')
        .catch(() => {
          console.warn(`Animación no disponible: ${currentAnimation}, usando fallback`);
          setCurrentAnimation(`${entityPrefix}_happy`);
        });
    }
  }, [currentAnimation, entityPrefix]);

  const handleComplete = () => {
    // Si es una animación de dying, podríamos emitir un evento
    if (currentAnimation?.includes('dying')) {
      console.log(`Entidad ${entity.id} completó animación de muerte`);
    }
  };

  if (!entity.position || !currentAnimation) {
    // Renderizar sprite estático como fallback
    return (
      <div
        style={{
          position: 'absolute',
          left: entity.position?.x || 0,
          top: entity.position?.y || 0,
          width: size,
          height: size,
          backgroundColor: entity.id === 'circle' ? '#FF6B6B' : '#4ECDC4',
          borderRadius: entity.id === 'circle' ? '50%' : '4px',
          cursor: onClick ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px'
        }}
        onClick={onClick}
      >
        {getMoodEmoji(entity.mood)}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: entity.position.x - size / 2,
        top: entity.position.y - size / 2,
        width: size,
        height: size,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      {/* Sprite animado principal */}
      <AnimatedSprite
        key={`${currentAnimation}-${animationKey}`}
        animationId={currentAnimation}
        folder="animations"
        x={0}
        y={0}
        width={size}
        height={size}
        autoPlay={true}
        loop={!currentAnimation.includes('dying')} // No hacer loop en animaciones de muerte
        onComplete={handleComplete}
      />

      {/* Sombra */}
      <div
        style={{
          position: 'absolute',
          bottom: -2,
          left: '25%',
          width: '50%',
          height: '15%',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '50%',
          transform: 'scaleY(0.5)'
        }}
      />

      {/* Indicador de actividad */}
      {showActivityIndicator && entity.activity && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 12,
            height: 12,
            backgroundColor: getActivityColor(entity.activity),
            borderRadius: '50%',
            border: '1px solid white',
            fontSize: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {getActivityIcon(entity.activity)}
        </div>
      )}

      {/* Indicador de estado de ánimo (solo si no hay animación de mood) */}
      {showMoodIndicator && entity.mood && !currentAnimation.includes(entity.mood.toLowerCase()) && (
        <div
          style={{
            position: 'absolute',
            top: -4,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
          }}
        >
          {getMoodEmoji(entity.mood)}
        </div>
      )}

      {/* Barra de salud (solo si está baja) */}
      {entity.stats?.health !== undefined && entity.stats.health < 50 && (
        <div
          style={{
            position: 'absolute',
            bottom: -12,
            left: 0,
            width: '100%',
            height: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${entity.stats.health}%`,
              height: '100%',
              backgroundColor: entity.stats.health > 25 ? '#FFA500' : '#FF4444',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      )}
    </div>
  );
};

// Funciones auxiliares
function getMoodEmoji(mood: string): string {
  const emojis: Record<string, string> = {
    happy: '😊',
    excited: '🤩',
    content: '😌',
    calm: '😇',
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    bored: '😑',
    lonely: '😔',
    tired: '😴'
  };
  return emojis[mood.toLowerCase()] || '😐';
}

function getActivityColor(activity: string): string {
  const colors: Record<string, string> = {
    WANDERING: '#FFD93D',
    RESTING: '#6BCF7F',
    SOCIALIZING: '#FF6B9D',
    MEDITATING: '#9B59B6',
    WRITING: '#3498DB',
    EXPLORING: '#E67E22',
    CONTEMPLATING: '#8E44AD',
    DANCING: '#E91E63',
    HIDING: '#95A5A6',
    WORKING: '#F39C12',
    SHOPPING: '#27AE60',
    EXERCISING: '#E74C3C',
    COOKING: '#FF9F43'
  };
  return colors[activity] || '#BDC3C7';
}

function getActivityIcon(activity: string): string {
  const icons: Record<string, string> = {
    WANDERING: '🚶',
    RESTING: '😴',
    SOCIALIZING: '👥',
    MEDITATING: '🧘',
    WRITING: '✍️',
    EXPLORING: '🔍',
    CONTEMPLATING: '🤔',
    DANCING: '💃',
    HIDING: '👻',
    WORKING: '💼',
    SHOPPING: '🛒',
    EXERCISING: '💪',
    COOKING: '👨‍🍳'
  };
  return icons[activity] || '❓';
}

export default AnimatedEntity;
