import React, { useEffect, useState } from 'react';
import { useGame } from '../hooks/useGame';
import DialogBubble from './DialogBubble';
import { getSpeakerForEntity } from '../utils/dialogueSelector';

interface ActiveDialogue {
  id: string;
  entityId: string;
  message: string;
  speaker: 'ISA' | 'STEV';
  emotion: string;
  position: { x: number; y: number };
  startTime: number;
  duration: number;
}

const EntityDialogueSystem: React.FC = () => {
  const { gameState, dialogueState } = useGame();
  const [activeDialogues, setActiveDialogues] = useState<ActiveDialogue[]>([]);

  useEffect(() => {
    if (dialogueState.visible && dialogueState.entityId) {
      // Encontrar la entidad que está hablando
      const entity = gameState.entities.find(e => e.id === dialogueState.entityId);
      
      if (entity) {
        const speaker = getSpeakerForEntity(entity.id);
        
        // Convertir coordenadas del canvas (0-800) a CSS relativo al contenedor
        // El canvas está centrado en un contenedor de 1000x600
        const canvasWidth = 1000;
        const canvasHeight = 600;
        const gameWidth = 800;
        const gameHeight = 600;
        
        // Calcular offset del canvas centrado
        const offsetX = (canvasWidth - gameWidth) / 2;
        const offsetY = (canvasHeight - gameHeight) / 2;
        
        const cssX = offsetX + entity.position.x + 20; // +20px para centrar el canvas
        const cssY = offsetY + entity.position.y + 20;
        
        const newDialogue: ActiveDialogue = {
          id: `${entity.id}-${Date.now()}`,
          entityId: entity.id,
          message: dialogueState.message,
          speaker,
          emotion: dialogueState.emotion || 'NEUTRAL',
          position: {
            x: cssX,
            y: cssY
          },
          startTime: dialogueState.startTime,
          duration: dialogueState.duration
        };

        setActiveDialogues(prev => [...prev.slice(-2), newDialogue]); // Mantener máximo 3 diálogos
      }
    }
  }, [dialogueState, gameState.entities]);

  const handleDialogueComplete = (dialogueId: string) => {
    setActiveDialogues(prev => prev.filter(d => d.id !== dialogueId));
  };

  return (
    <>
      {activeDialogues.map(dialogue => (
        <DialogBubble
          key={dialogue.id}
          x={dialogue.position.x}
          y={dialogue.position.y}
          message={dialogue.message}
          speaker={dialogue.speaker}
          emotion={dialogue.emotion}
          visible={true}
          duration={dialogue.duration}
          onComplete={() => handleDialogueComplete(dialogue.id)}
        />
      ))}
    </>
  );
};

export default EntityDialogueSystem;