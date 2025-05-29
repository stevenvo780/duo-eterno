import { useRef, useCallback } from 'react';

// Hook para optimizar el rendering del canvas
export const useOptimizedRenderer = () => {
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const fpsTarget = useRef<number>(60);

  // Throttle rendering to target FPS
  const shouldRender = useCallback((currentTime: number = performance.now()): boolean => {
    const deltaTime = currentTime - lastFrameTime.current;
    const targetFrameTime = 1000 / fpsTarget.current;
    
    if (deltaTime >= targetFrameTime) {
      lastFrameTime.current = currentTime;
      return true;
    }
    
    return false;
  }, []);

  // Simple FPS counter for debugging
  const getFPS = useCallback((): number => {
    frameCount.current++;
    const now = performance.now();
    
    if (frameCount.current % 60 === 0) {
      const fps = 1000 / (now - lastFrameTime.current);
      return Math.round(fps);
    }
    
    return 60; // Default assumption
  }, []);

  // Adaptive quality based on performance
  const getQualityLevel = useCallback((): 'low' | 'medium' | 'high' => {
    const fps = getFPS();
    
    if (fps < 30) return 'low';
    if (fps < 50) return 'medium';
    return 'high';
  }, [getFPS]);

  return {
    shouldRender,
    getFPS,
    getQualityLevel
  };
};
