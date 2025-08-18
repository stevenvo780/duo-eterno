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


  useEffect(() => {
    loadDialogueData().then(() => {
      setDialoguesLoaded(true);
    });
  }, []);


  useEffect(() => {
    if (!dialoguesLoaded) return;


    if (gameState.connectionAnimation.active) {
      const animationAge = Date.now() - gameState.connectionAnimation.startTime;
      if (animationAge < 100) {
        const isFading = gameState.entities.some(entity => entity.state === 'FADING');
        
        if (isFading) {

          dispatch({
            type: 'SHOW_DIALOGUE',
            payload: { 
              message: getRandomDialogue('revival'),
              duration: 4000
            }
          });
        } else {

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


  useEffect(() => {
    if (!dialoguesLoaded) return;

    const interval = setInterval(() => {

      if (!gameState.connectionAnimation.active) {
        gameState.entities.forEach(entity => {

          const shouldSpeak = Math.random() < 0.05;
          
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
