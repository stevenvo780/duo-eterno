import React, { useEffect, useState } from 'react';
import { useGame } from '../hooks/useGame';

const DialogOverlay: React.FC = () => {
  const { dialogueState, dispatch } = useGame();
  const [dialogSprite, setDialogSprite] = useState<HTMLImageElement | null>(null);

  // Load dialog overlay sprite
  useEffect(() => {
    const img = new Image();
    img.onload = () => setDialogSprite(img);
    img.onerror = () => console.error('Failed to load dialog sprite');
    img.src = '/assets/sprites/dialogo_overlay.png';
  }, []);

  useEffect(() => {
    if (dialogueState.visible) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_DIALOGUE' });
      }, dialogueState.duration);

      return () => clearTimeout(timer);
    }
  }, [dialogueState.visible, dialogueState.duration, dispatch]);

  if (!dialogueState.visible) return null;

  const elapsed = Date.now() - dialogueState.startTime;
  const progress = elapsed / dialogueState.duration;
  const opacity = progress < 0.9 ? 1 : 1 - ((progress - 0.9) / 0.1);

  if (dialogSprite && dialogSprite.complete) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: opacity,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <div style={{
          position: 'relative',
          width: '320px',
          height: '120px',
          backgroundImage: `url(/assets/sprites/dialogo_overlay.png)`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          imageRendering: 'pixelated'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '14px',
            lineHeight: '1.5',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
            maxWidth: '280px',
            textShadow: '2px 2px 0px #000',
            fontWeight: '500'
          }}>
            {dialogueState.message}
          </div>
        </div>
      </div>
    );
  }

  // Fallback to original style
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '20px 30px',
        borderRadius: '12px',
        maxWidth: '320px',
        textAlign: 'center',
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: 'system-ui, sans-serif',
        opacity: opacity,
        transition: 'opacity 0.3s ease',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        pointerEvents: 'none',
        zIndex: 10
      }}
    >
      {dialogueState.message}
    </div>
  );
};

export default DialogOverlay;
