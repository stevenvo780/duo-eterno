import { useState, useEffect, useCallback } from 'react';

export interface TimeState {
  hour: number;
  minute: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayProgress: number; // 0-1
  isNight: boolean;
  phase: 'dawn' | 'day' | 'dusk' | 'night';
}

interface DayNightConfig {
  cycleSpeedMultiplier?: number; // 1 = tiempo real, 60 = 1 minuto real = 1 hora juego
  startHour?: number;
  startMinute?: number;
}

export const useDayNightCycle = (config: DayNightConfig = {}) => {
  const {
    cycleSpeedMultiplier = 120, // Por defecto 2 minutos reales = 1 día completo
    startHour = 6,
    startMinute = 0
  } = config;

  const [currentTime, setCurrentTime] = useState<TimeState>(() => {
    const hour = startHour;
    const minute = startMinute;
    const dayProgress = (hour * 60 + minute) / (24 * 60);
    
    return {
      hour,
      minute,
      timeOfDay: getTimeOfDay(hour),
      dayProgress,
      isNight: hour >= 22 || hour < 6,
      phase: getPhase(hour)
    };
  });

  const updateTime = useCallback(() => {
    setCurrentTime(prev => {
      // Calcular nuevos minutos basado en velocidad del ciclo
      const totalMinutes = prev.hour * 60 + prev.minute + (cycleSpeedMultiplier / 60);
      const newHour = Math.floor((totalMinutes / 60) % 24);
      const newMinute = Math.floor(totalMinutes % 60);
      const dayProgress = (newHour * 60 + newMinute) / (24 * 60);

      return {
        hour: newHour,
        minute: newMinute,
        timeOfDay: getTimeOfDay(newHour),
        dayProgress,
        isNight: newHour >= 22 || newHour < 6,
        phase: getPhase(newHour)
      };
    });
  }, [cycleSpeedMultiplier]);

  useEffect(() => {
    const interval = setInterval(updateTime, 1000); // Actualizar cada segundo
    return () => clearInterval(interval);
  }, [updateTime]);

  const getTimeString = useCallback((format: '12h' | '24h' = '24h') => {
    const { hour, minute } = currentTime;
    
    if (format === '12h') {
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour < 12 ? 'AM' : 'PM';
      return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }, [currentTime]);

  const getSkyColor = useCallback(() => {
    const { hour, minute } = currentTime;
    const totalMinutes = hour * 60 + minute;
    
    // Colores del cielo según la hora
    if (totalMinutes >= 5 * 60 && totalMinutes < 7 * 60) {
      // Amanecer (5:00-7:00)
      const progress = (totalMinutes - 5 * 60) / (2 * 60);
      return interpolateColor('#1a1a2e', '#ff6b6b', progress);
    } else if (totalMinutes >= 7 * 60 && totalMinutes < 18 * 60) {
      // Día (7:00-18:00)
      return '#87CEEB'; // Azul cielo
    } else if (totalMinutes >= 18 * 60 && totalMinutes < 20 * 60) {
      // Atardecer (18:00-20:00)
      const progress = (totalMinutes - 18 * 60) / (2 * 60);
      return interpolateColor('#87CEEB', '#ff4757', progress);
    } else {
      // Noche
      return '#1a1a2e'; // Azul muy oscuro
    }
  }, [currentTime]);

  const getLightIntensity = useCallback(() => {
    const { hour } = currentTime;
    
    if (hour >= 6 && hour < 8) {
      // Amanecer: 0.3 -> 1.0
      return 0.3 + ((hour - 6) + currentTime.minute / 60) * 0.35;
    } else if (hour >= 8 && hour < 18) {
      // Día completo
      return 1.0;
    } else if (hour >= 18 && hour < 22) {
      // Atardecer: 1.0 -> 0.2
      return 1.0 - ((hour - 18) + currentTime.minute / 60) * 0.2;
    } else {
      // Noche
      return 0.2;
    }
  }, [currentTime]);

  return {
    currentTime,
    getTimeString,
    getSkyColor,
    getLightIntensity,
    isNight: currentTime.isNight,
    phase: currentTime.phase,
    timeOfDay: currentTime.timeOfDay
  };
};

// Funciones auxiliares
function getTimeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

function getPhase(hour: number): 'dawn' | 'day' | 'dusk' | 'night' {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 18) return 'day';
  if (hour >= 18 && hour < 22) return 'dusk';
  return 'night';
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}