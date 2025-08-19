/**
 * Hook de renderizado con scheduler y calidad adaptativa.
 * Gestiona throttling por FPS, métricas básicas y ajuste de calidad.
 */

import { useRef, useCallback, useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameDuration: number;
  droppedFrames: number;
  memoryUsage: number;
  lastUpdate: number;
}

interface QualitySettings {
  targetFps: number;
  particleCount: number;
  effectsEnabled: boolean;
  antiAliasing: boolean;
  shadowsEnabled: boolean;
}

type QualityLevel = 'low' | 'medium' | 'high';

const QUALITY_SETTINGS: Record<QualityLevel, QualitySettings> = {
  low: {
    targetFps: 30,
    particleCount: 2,
    effectsEnabled: false,
    antiAliasing: false,
    shadowsEnabled: false
  },
  medium: {
    targetFps: 45,
    particleCount: 4,
    effectsEnabled: true,
    antiAliasing: false,
    shadowsEnabled: false
  },
  high: {
    targetFps: 60,
    particleCount: 6,
    effectsEnabled: true,
    antiAliasing: true,
    shadowsEnabled: true
  }
};

export const useRenderer = () => {
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('high');
  const [isThrottling, setIsThrottling] = useState(false);

  const frameCount = useRef<number>(0);
  const lastFrameTime = useRef<number>(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const droppedFrames = useRef<number>(0);
  const lastRenderTime = useRef<number>(0);

  const currentMetrics = useRef<PerformanceMetrics>({
    fps: 60,
    frameDuration: 16.67,
    droppedFrames: 0,
    memoryUsage: 0,
    lastUpdate: performance.now()
  });

  const adjustQuality = useCallback(() => {
    const avgFps =
      fpsHistory.current.length > 0
        ? fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
        : 60;

    const targetFps = QUALITY_SETTINGS[qualityLevel].targetFps;

    if (avgFps < targetFps * 0.6 && qualityLevel !== 'low') {
      const newLevel = qualityLevel === 'high' ? 'medium' : 'low';
      setQualityLevel(newLevel);
      console.warn(`🔽 Calidad reducida a ${newLevel} (FPS promedio: ${avgFps.toFixed(1)})`);
      return;
    }

    if (avgFps > targetFps * 1.3 && qualityLevel !== 'high') {
      const newLevel = qualityLevel === 'low' ? 'medium' : 'high';
      setQualityLevel(newLevel);
      console.info(`🔼 Calidad aumentada a ${newLevel} (FPS promedio: ${avgFps.toFixed(1)})`);
    }
  }, [qualityLevel]);

  const getMemoryUsage = useCallback((): number => {
    try {
      if ('memory' in performance) {
        const memInfo = (
          performance as typeof performance & {
            memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number };
          }
        ).memory;
        return memInfo.usedJSHeapSize / (1024 * 1024);
      }
    } catch {
      return 0;
    }
    return 0;
  }, []);

  const updateFPS = useCallback(
    (currentTime: number) => {
      frameCount.current++;
      const deltaTime = currentTime - lastFrameTime.current;

      if (deltaTime >= 1000) {
        const fps = (frameCount.current * 1000) / deltaTime;

        fpsHistory.current.push(fps);
        if (fpsHistory.current.length > 10) {
          fpsHistory.current.shift();
        }

        currentMetrics.current = {
          fps,
          frameDuration: deltaTime / frameCount.current,
          droppedFrames: droppedFrames.current,
          memoryUsage: getMemoryUsage(),
          lastUpdate: currentTime
        };

        frameCount.current = 0;
        lastFrameTime.current = currentTime;
        droppedFrames.current = 0;

        adjustQuality();
      }
    },
    [adjustQuality, getMemoryUsage]
  );

  const shouldRender = useCallback(
    (currentTime: number = performance.now()): boolean => {
      const targetFps = QUALITY_SETTINGS[qualityLevel].targetFps;
      const minFrameDuration = 1000 / targetFps;
      const timeSinceLastRender = currentTime - lastRenderTime.current;

      if (timeSinceLastRender >= minFrameDuration) {
        lastRenderTime.current = currentTime;
        updateFPS(currentTime);
        setIsThrottling(false);
        return true;
      }

      setIsThrottling(true);
      droppedFrames.current++;
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Temporalmente sin dependencias para detener el bucle infinito
  );

  const getFPS = useCallback((): number => {
    return currentMetrics.current.fps;
  }, []);

  const getQualityLevel = useCallback((): QualityLevel => {
    return qualityLevel;
  }, [qualityLevel]);

  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...currentMetrics.current };
  }, []);

  const getQualitySettings = useCallback((): QualitySettings => {
    return QUALITY_SETTINGS[qualityLevel];
  }, [qualityLevel]);

  const setQuality = useCallback((level: QualityLevel) => {
    setQualityLevel(level);
    console.info(`🎚️ Calidad manual establecida: ${level}`);
  }, []);

  useEffect(() => {
    const checkPerformance = () => {
      const metrics = currentMetrics.current;
      const memoryLimit = 200;

      if (metrics.memoryUsage > memoryLimit) {
        console.warn(
          `⚠️ Uso de memoria alto: ${metrics.memoryUsage.toFixed(1)}MB (límite: ${memoryLimit}MB)`
        );
      }

      // if (metrics.fps < 20) {
      //   console.error(`🚨 FPS crítico: ${metrics.fps.toFixed(1)} FPS`);
      // }
    };

    const interval = setInterval(checkPerformance, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startTime = performance.now();
    lastFrameTime.current = startTime;
    lastRenderTime.current = startTime;

    console.info('🎮 Sistema de renderizado optimizado iniciado', {
      initialQuality: qualityLevel,
      targetFPS: QUALITY_SETTINGS[qualityLevel].targetFps
    });

    return () => {
      console.info('🏁 Sistema de renderizado finalizado', {
        totalFrames: frameCount.current,
        finalQuality: qualityLevel,
        finalFPS: currentMetrics.current.fps.toFixed(1)
      });
    };
  }, [qualityLevel]);

  return {
    shouldRender,

    getFPS,
    getMetrics,

    getQualityLevel,
    getQualitySettings,
    setQuality,

    isThrottling,
    qualityLevel
  };
};

export type { QualityLevel, PerformanceMetrics, QualitySettings };
