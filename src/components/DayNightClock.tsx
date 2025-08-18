import React from 'react';
import { useDayNightCycle } from '../hooks/useDayNightCycle';

interface DayNightClockProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
  showPhase?: boolean;
}

export const DayNightClock: React.FC<DayNightClockProps> = ({
  position = 'top-right',
  size = 'medium',
  showPhase = true
}) => {
  const { currentTime, getTimeString, getSkyColor, getLightIntensity, phase } = useDayNightCycle();

  const sizeStyles = {
    small: { width: '80px', height: '80px', fontSize: '10px' },
    medium: { width: '120px', height: '120px', fontSize: '12px' },
    large: { width: '160px', height: '160px', fontSize: '14px' }
  };

  const positionStyles = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' }
  };

  const getCurrentIcon = () => {
    switch (phase) {
      case 'dawn':
        return '🌅';
      case 'day':
        return '☀️';
      case 'dusk':
        return '🌇';
      case 'night':
        return '🌙';
      default:
        return '🌙';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'dawn':
        return 'Amanecer';
      case 'day':
        return 'Día';
      case 'dusk':
        return 'Atardecer';
      case 'night':
        return 'Noche';
      default:
        return 'Noche';
    }
  };

  const clockSize = sizeStyles[size];
  const clockRadius = parseInt(clockSize.width) / 2 - 10;

  // Calcular posición de las manecillas
  const hourAngle = (currentTime.hour % 12) * 30 + currentTime.minute * 0.5 - 90;
  const minuteAngle = currentTime.minute * 6 - 90;

  const hourHandLength = clockRadius * 0.5;
  const minuteHandLength = clockRadius * 0.7;

  const hourX = Math.cos((hourAngle * Math.PI) / 180) * hourHandLength;
  const hourY = Math.sin((hourAngle * Math.PI) / 180) * hourHandLength;

  const minuteX = Math.cos((minuteAngle * Math.PI) / 180) * minuteHandLength;
  const minuteY = Math.sin((minuteAngle * Math.PI) / 180) * minuteHandLength;

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles[position],
        ...clockSize,
        background: `linear-gradient(135deg, ${getSkyColor()}, rgba(0,0,0,0.2))`,
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.3)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        color: 'white',
        textShadow: '0 1px 3px rgba(0,0,0,0.7)',
        zIndex: 1000,
        opacity: 0.9,
        transition: 'all 0.3s ease'
      }}
    >
      {/* SVG del reloj analógico */}
      <svg
        width={clockRadius * 2}
        height={clockRadius * 2}
        style={{ position: 'absolute', top: '10px' }}
      >
        {/* Círculo del reloj */}
        <circle
          cx={clockRadius}
          cy={clockRadius}
          r={clockRadius - 2}
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />

        {/* Marcas de las horas */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const startRadius = clockRadius - 10;
          const endRadius = clockRadius - 5;
          const startX = clockRadius + Math.cos(angle) * startRadius;
          const startY = clockRadius + Math.sin(angle) * startRadius;
          const endX = clockRadius + Math.cos(angle) * endRadius;
          const endY = clockRadius + Math.sin(angle) * endRadius;

          return (
            <line
              key={i}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
            />
          );
        })}

        {/* Manecilla de las horas */}
        <line
          x1={clockRadius}
          y1={clockRadius}
          x2={clockRadius + hourX}
          y2={clockRadius + hourY}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Manecilla de los minutos */}
        <line
          x1={clockRadius}
          y1={clockRadius}
          x2={clockRadius + minuteX}
          y2={clockRadius + minuteY}
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Centro del reloj */}
        <circle cx={clockRadius} cy={clockRadius} r="3" fill="rgba(255,255,255,0.9)" />
      </svg>

      {/* Información digital */}
      <div
        style={{
          position: 'absolute',
          bottom: '5px',
          textAlign: 'center',
          fontSize: clockSize.fontSize,
          lineHeight: '1.2'
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{getTimeString()}</div>
        {showPhase && (
          <div
            style={{
              fontSize: `${parseInt(clockSize.fontSize) - 2}px`,
              opacity: 0.8
            }}
          >
            {getCurrentIcon()} {getPhaseText()}
          </div>
        )}
      </div>

      {/* Indicador de intensidad de luz */}
      <div
        style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: `rgba(255,255,0,${getLightIntensity()})`,
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: getLightIntensity() > 0.5 ? '0 0 6px rgba(255,255,0,0.6)' : 'none'
        }}
        title={`Intensidad de luz: ${Math.round(getLightIntensity() * 100)}%`}
      />
    </div>
  );
};
