import { useEffect, useRef, useState } from 'react';

export const usePerformanceMonitor = () => {
  const [fps, setFps] = useState<number>(60);
  const [frameTime, setFrameTime] = useState<number>(16.67);
  const lastTime = useRef<number>(performance.now());
  const frameCount = useRef<number>(0);
  const fpsUpdateTime = useRef<number>(performance.now());

  useEffect(() => {
    let animationId: number;

    const measurePerformance = () => {
      const now = performance.now();
      const delta = now - lastTime.current;
      lastTime.current = now;
      frameCount.current++;

      // Update FPS every second
      if (now - fpsUpdateTime.current >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / (now - fpsUpdateTime.current));
        setFps(currentFps);
        setFrameTime(Math.round((now - fpsUpdateTime.current) / frameCount.current * 100) / 100);
        
        frameCount.current = 0;
        fpsUpdateTime.current = now;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return { fps, frameTime };
};
