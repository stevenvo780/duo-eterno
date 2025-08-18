/**
 * 🚀 FASE 1: Hook de Renderizado Optimizado para Performance 60 FPS
 * 
 * Características principales:
 * - ✅ Control dinámico de FPS con throttling inteligente
 * - ✅ Niveles de calidad adaptativos según rendimiento
 * - ✅ Monitoreo continuo de performance 
 * - ✅ Detección automática de memoria disponible
 * - ✅ Rendimiento escalable según capacidad del dispositivo
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

// Hook para optimizar el rendering del canvas
export const useRenderer = () => {
  // Performance state
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('high');
  const [isThrottling, setIsThrottling] = useState(false);
  
  // Performance tracking refs
  const frameCount = useRef<number>(0);
  const lastFrameTime = useRef<number>(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const droppedFrames = useRef<number>(0);
  const lastRenderTime = useRef<number>(0);
  
  // Current metrics ref
  const currentMetrics = useRef<PerformanceMetrics>({
    fps: 60,
    frameDuration: 16.67,
    droppedFrames: 0,
    memoryUsage: 0,
    lastUpdate: performance.now()
  });

  // Adaptive quality adjustment based on performance (menos agresivo)
  const adjustQuality = useCallback(() => {
    const avgFps = fpsHistory.current.length > 0 
      ? fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length 
      : 60;
    
    const targetFps = QUALITY_SETTINGS[qualityLevel].targetFps;
    
    // Downgrade quality solo si el rendimiento es crítico (más conservador)
    if (avgFps < targetFps * 0.6 && qualityLevel !== 'low') {
      const newLevel = qualityLevel === 'high' ? 'medium' : 'low';
      setQualityLevel(newLevel);
      console.warn(`🔽 Calidad reducida a ${newLevel} (FPS promedio: ${avgFps.toFixed(1)})`);
      return;
    }
    
    // Upgrade quality si el rendimiento es consistentemente bueno
    if (avgFps > targetFps * 1.3 && qualityLevel !== 'high') {
      const newLevel = qualityLevel === 'low' ? 'medium' : 'high';
      setQualityLevel(newLevel);
      console.info(`🔼 Calidad aumentada a ${newLevel} (FPS promedio: ${avgFps.toFixed(1)})`);
    }
  }, [qualityLevel]);

  // Get memory usage (rough estimate)
  const getMemoryUsage = useCallback((): number => {
    try {
      if ('memory' in performance) {
        const memInfo = (performance as typeof performance & { 
          memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } 
        }).memory;
        return memInfo.usedJSHeapSize / (1024 * 1024); // MB
      }
    } catch {
      // Ignore memory API errors
    }
    return 0; // Fallback if not available
  }, []);

  // Calculate current FPS
  const updateFPS = useCallback((currentTime: number) => {
    frameCount.current++;
    const deltaTime = currentTime - lastFrameTime.current;
    
    if (deltaTime >= 1000) { // Update FPS every second
      const fps = (frameCount.current * 1000) / deltaTime;
      
      // Update FPS history
      fpsHistory.current.push(fps);
      if (fpsHistory.current.length > 10) {
        fpsHistory.current.shift(); // Keep only last 10 measurements
      }
      
      // Update metrics
      currentMetrics.current = {
        fps,
        frameDuration: deltaTime / frameCount.current,
        droppedFrames: droppedFrames.current,
        memoryUsage: getMemoryUsage(),
        lastUpdate: currentTime
      };
      
      // Reset counters
      frameCount.current = 0;
      lastFrameTime.current = currentTime;
      droppedFrames.current = 0;
      
      // Adjust quality if needed
      adjustQuality();
    }
  }, [adjustQuality, getMemoryUsage]);

  // Throttle rendering to target FPS
  const shouldRender = useCallback((currentTime: number = performance.now()): boolean => {
    const targetFps = QUALITY_SETTINGS[qualityLevel].targetFps;
    const minFrameDuration = 1000 / targetFps; // ms per frame
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
  }, [qualityLevel, updateFPS]);

  // Simple FPS counter for debugging
  const getFPS = useCallback((): number => {
    return currentMetrics.current.fps;
  }, []);

  // Adaptive quality based on performance
  const getQualityLevel = useCallback((): QualityLevel => {
    return qualityLevel;
  }, [qualityLevel]);

  // Get performance metrics
  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...currentMetrics.current };
  }, []);

  // Get quality settings for current level
  const getQualitySettings = useCallback((): QualitySettings => {
    return QUALITY_SETTINGS[qualityLevel];
  }, [qualityLevel]);

  // Manual quality override
  const setQuality = useCallback((level: QualityLevel) => {
    setQualityLevel(level);
    console.info(`🎚️ Calidad manual establecida: ${level}`);
  }, []);

  // Performance warning system
  useEffect(() => {
    const checkPerformance = () => {
      const metrics = currentMetrics.current;
      const memoryLimit = 200; // MB
      
      if (metrics.memoryUsage > memoryLimit) {
        console.warn(`⚠️ Uso de memoria alto: ${metrics.memoryUsage.toFixed(1)}MB (límite: ${memoryLimit}MB)`);
      }
      
      if (metrics.fps < 20) {
        console.error(`🚨 FPS crítico: ${metrics.fps.toFixed(1)} FPS`);
      }
    };

    const interval = setInterval(checkPerformance, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Initialize performance monitoring
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
    // Core rendering control
    shouldRender,
    
    // Performance metrics
    getFPS,
    getMetrics,
    
    // Quality management
    getQualityLevel,
    getQualitySettings,
    setQuality,
    
    // Status information
    isThrottling,
    qualityLevel
  };
};

export type { QualityLevel, PerformanceMetrics, QualitySettings };
