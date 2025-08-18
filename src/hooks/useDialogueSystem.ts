import { useEffect, useState } from 'react';
import { useGame } from './useGame';
import { getRandomDialogue } from '../utils/dialogues';
import { 
  loadDialogueData, 
  getNextDialogue, 
  getSpeakerForEntity, 
  getEmotionForActivity 
} from '../utils/dialogueSelector';

export const useDialogueSystem = () => {
  const { gameState, dispatch } = useGame();
  const [dialoguesLoaded, setDialoguesLoaded] = useState(false);

  // Cargar datos de diálogos al inicializar
  useEffect(() => {
    loadDialogueData().then(() => {
      setDialoguesLoaded(true);
    });
  }, []);

  // Sistema de diálogos automáticos
  useEffect(() => {
    if (!dialoguesLoaded) return;

    // Mostrar diálogos durante animaciones de conexión
    if (gameState.connectionAnimation.active) {
      const animationAge = Date.now() - gameState.connectionAnimation.startTime;
      if (animationAge < 100) { // Recién iniciado
        const isFading = gameState.entities.some(entity => entity.state === 'FADING');
        
        if (isFading) {
          // Usar diálogos originales para revivals
          dispatch({
            type: 'SHOW_DIALOGUE',
            payload: { 
              message: getRandomDialogue('revival'),
              duration: 4000
            }
          });
        } else {
          // Usar diálogos del chat para nutrición
          const dialogue = getNextDialogue(undefined, 'LOVE', 'SOCIALIZING');
          if (dialogue) {
            dispatch({
              type: 'SHOW_DIALOGUE',
              payload: { 
                message: dialogue.text,
                duration: 3000,
                speaker: dialogue.speaker === 'ISA' ? 'circle' : 'square'
              }
            });
          }
        }
      }
    }
  }, [gameState.connectionAnimation, gameState.entities, dispatch, dialoguesLoaded]);

  // Diálogos automáticos según actividad de las entidades
  useEffect(() => {
    if (!dialoguesLoaded) return;

    const interval = setInterval(() => {
      // Solo mostrar diálogos si no hay animaciones activas
      if (!gameState.connectionAnimation.active) {
        gameState.entities.forEach(entity => {
          // Probabilidad de hablar basada en el estado y actividad
          const shouldSpeak = Math.random() < 0.05; // 5% de probabilidad cada segundo (aumentado para testing)
          
          if (shouldSpeak && !entity.isDead) {
            const speaker = getSpeakerForEntity(entity.id);
            const emotion = getEmotionForActivity(entity.activity);
            const dialogue = getNextDialogue(speaker, emotion, entity.activity);
            
            if (dialogue) {
              dispatch({
                type: 'SHOW_DIALOGUE',
                payload: { 
                  message: dialogue.text,
                  duration: 2500,
                  speaker: entity.id,
                  entityId: entity.id,
                  emotion: dialogue.emotion,
                  position: { x: entity.position.x, y: entity.position.y }
                }
              });
            }
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.entities, gameState.connectionAnimation.active, dispatch, dialoguesLoaded]);
};
