import React, { useEffect, useState } from 'react';

interface DialogBubbleProps {
  x: number;
  y: number;
  message: string;
  speaker: 'ISA' | 'STEV';
  emotion: string;
  visible: boolean;
  duration: number;
  onComplete: () => void;
}

const DialogBubble: React.FC<DialogBubbleProps> = ({
  x,
  y,
  message,
  speaker,
  emotion,
  visible,
  duration,
  onComplete
}) => {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    if (visible) {
      setOpacity(1);
      setScale(1);
      
      const timer = setTimeout(() => {
        setOpacity(0);
        setScale(0.8);
        setTimeout(onComplete, 300);
      }, duration - 300);

      return () => clearTimeout(timer);
    } else {
      setOpacity(0);
      setScale(0.8);
    }
  }, [visible, duration, onComplete]);

  if (!visible && opacity === 0) return null;

  const getEmotionColor = (emotion: string, speaker: string) => {
    const baseColors = {
      ISA: '#ff69b4',    // Rosa para ISA
      STEV: '#4169e1'    // Azul para STEV
    };

    const emotionModifiers = {
      'LOVE': { saturation: 1.2, brightness: 1.1 },
      'PLAYFUL': { saturation: 1.3, brightness: 1.2 },
      'SADNESS': { saturation: 0.7, brightness: 0.8 },
      'NEUTRAL': { saturation: 0.9, brightness: 0.9 },
      'CURIOUS': { saturation: 1.1, brightness: 1.0 },
      'APOLOGY': { saturation: 0.8, brightness: 0.9 }
    };

    const base = baseColors[speaker as keyof typeof baseColors] || baseColors.STEV;
    const modifier = emotionModifiers[emotion as keyof typeof emotionModifiers] || emotionModifiers.NEUTRAL;
    
    return {
      background: `${base}dd`,
      border: `${base}ff`
    };
  };

  const colors = getEmotionColor(emotion, speaker);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y - 60,
        opacity,
        transform: `scale(${scale}) translate(-50%, -100%)`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
        zIndex: 1000,
        maxWidth: '200px',
        minWidth: '80px'
      }}
    >
      <div
        style={{
          background: colors.background,
          border: `2px solid ${colors.border}`,
          borderRadius: '16px',
          padding: '8px 12px',
          fontSize: '12px',
          fontFamily: 'system-ui, sans-serif',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          backdropFilter: 'blur(4px)',
          wordWrap: 'break-word',
          lineHeight: '1.3'
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 'bold',
            marginBottom: '2px',
            opacity: 0.9
          }}
        >
          {speaker}
        </div>
        {message}
        
        {/* Flecha del bocadillo */}
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `8px solid ${colors.border}`
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${colors.background}`
          }}
        />
      </div>
    </div>
  );
};

export default DialogBubble;