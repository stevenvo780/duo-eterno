/**
 * 🎬 SPRITE ANIMADO
 *
 * Componente para renderizar sprites animados usando JSON de metadatos
 */

import React, { useRef, useEffect, useState } from 'react';
import { useAnimation } from '../hooks/useAnimationSystem';

export interface AnimatedSpriteProps {
  /** Nombre de la animación (ej: 'entidad_circulo_happy_anim') */
  animationName: string;
  /** Categoría de la animación (ej: 'entities') */
  category?: string;
  /** Tamaño del sprite en píxeles */
  size?: number;
  /** Reproducir automáticamente */
  autoPlay?: boolean;
  /** Repetir la animación en bucle */
  loop?: boolean;
  /** Callback cuando la animación termina */
  onComplete?: () => void;
  /** Estilos adicionales para el contenedor */
  style?: React.CSSProperties;
  /** Clase CSS adicional */
  className?: string;
}

export const AnimatedSprite: React.FC<AnimatedSpriteProps> = ({
  animationName,
  category = 'entities',
  size = 32,
  autoPlay = true,
  loop = true,
  onComplete,
  style,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastFrameIndex, setLastFrameIndex] = useState(-1);
  
  const {
    animation,
    state,
    loading,
    error,
    getCurrentFrame,
    play,
    pause
  } = useAnimation(animationName, category, autoPlay);

  // Renderizar el frame actual en el canvas
  useEffect(() => {
    if (!animation || !canvasRef.current || loading || error) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentFrame = getCurrentFrame();
    if (!currentFrame) return;

    // Solo redibujar si ha cambiado el frame
    if (state.currentFrame === lastFrameIndex) return;
    setLastFrameIndex(state.currentFrame);

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el frame actual
    ctx.drawImage(
      animation.image,
      currentFrame.x,
      currentFrame.y,
      currentFrame.width,
      currentFrame.height,
      0,
      0,
      size,
      size
    );
  }, [animation, state.currentFrame, getCurrentFrame, size, loading, error, lastFrameIndex]);

  // Manejar finalización de animación
  useEffect(() => {
    if (
      !state.isPlaying &&
      !loop &&
      state.currentFrame === 0 &&
      lastFrameIndex > 0 &&
      onComplete
    ) {
      onComplete();
    }
  }, [state.isPlaying, loop, state.currentFrame, lastFrameIndex, onComplete]);

  // Métodos públicos para controlar la animación
  const handlePlay = () => play();
  const handlePause = () => pause();

  if (loading) {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          ...style
        }}
        className={className}
      >
        <span style={{ fontSize: '10px', color: '#666' }}>⏳</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: '#ffe6e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          border: '1px solid #ff9999',
          ...style
        }}
        className={className}
        title={`Error: ${error}`}
      >
        <span style={{ fontSize: '10px', color: '#cc0000' }}>❌</span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        ...style
      }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated' // Para sprites pixelados
        }}
      />
      
      {/* Controles de depuración (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            left: 0,
            fontSize: '8px',
            color: '#666',
            display: 'flex',
            gap: '2px'
          }}
        >
          <button
            onClick={handlePlay}
            disabled={state.isPlaying}
            style={{ fontSize: '8px', padding: '1px 2px' }}
          >
            ▶
          </button>
          <button
            onClick={handlePause}
            disabled={!state.isPlaying}
            style={{ fontSize: '8px', padding: '1px 2px' }}
          >
            ⏸
          </button>
          <span>{state.currentFrame}/{animation?.frames.length || 0}</span>
        </div>
      )}
    </div>
  );
};

export default AnimatedSprite;
