/**
 * 🎬 COMPONENTE DE SPRITE ANIMADO
 * 
 * Componente React que renderiza sprites animados usando el sistema
 * de animaciones generado automáticamente
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { spriteAnimationManager, type LoadedAnimation, type AnimationState } from '../utils/spriteAnimationManager';

interface AnimatedSpriteProps {
  animationId: string;
  folder?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  loop?: boolean;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedSprite: React.FC<AnimatedSpriteProps> = ({
  animationId,
  folder,
  x,
  y,
  width,
  height,
  autoPlay = true,
  loop = true,
  onComplete,
  className,
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<LoadedAnimation | null>(null);
  const stateRef = useRef<AnimationState | null>(null);
  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Cargar la animación
  useEffect(() => {
    let mounted = true;

    spriteAnimationManager.loadAnimation(animationId, folder)
      .then(animation => {
        if (mounted) {
          animationRef.current = animation;
          stateRef.current = {
            currentFrame: 0,
            elapsedTime: 0,
            isPlaying: autoPlay,
            loop,
            onComplete
          };
          
          // Configurar el canvas con el tamaño correcto
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const [frameWidth, frameHeight] = animation.asset.metadata.frame_size;
            canvas.width = width || frameWidth;
            canvas.height = height || frameHeight;
          }
        }
      })
      .catch(error => {
        console.error(`Error cargando animación ${animationId}:`, error);
      });

    return () => {
      mounted = false;
    };
  }, [animationId, folder, autoPlay, loop, onComplete, width, height]);

  // Función de renderizado
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const animation = animationRef.current;
    const state = stateRef.current;

    if (!canvas || !animation || !state) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Obtener el frame actual
    const currentFrame = animation.frames[state.currentFrame];
    if (!currentFrame) return;

    // Renderizar el frame desde el spritesheet
    ctx.drawImage(
      animation.image,
      currentFrame.x,
      currentFrame.y,
      currentFrame.width,
      currentFrame.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }, []);

  // Loop de animación
  useEffect(() => {
    const updateAnimation = (currentTime: number) => {
      const animation = animationRef.current;
      const state = stateRef.current;

      if (!animation || !state || !state.isPlaying) {
        animationFrameRef.current = requestAnimationFrame(updateAnimation);
        return;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Actualizar el estado de la animación
      const newState = spriteAnimationManager.updateAnimationState(state, deltaTime, animation);
      stateRef.current = newState;

      // Renderizar el frame actual
      renderFrame();

      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderFrame]);

  // Controles de animación
  const play = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.isPlaying = true;
    }
  }, []);

  const pause = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.isPlaying = false;
    }
  }, []);

  const reset = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.currentFrame = 0;
      stateRef.current.elapsedTime = 0;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        imageRendering: 'pixelated', // Para mantener el estilo pixel art
        ...style
      }}
      data-animation-id={animationId}
      data-controls={JSON.stringify({ play, pause, reset })}
    />
  );
};

export default AnimatedSprite;
