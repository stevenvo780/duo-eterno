import { useEffect } from 'react';
import { useGame } from './useGame';
import { getRandomDialogue } from '../utils/dialogues';

export const useDialogueSystem = () => {
  const { gameState, dispatch } = useGame();

  useEffect(() => {
    // Show post-nutrition dialogue when nourishing
    if (gameState.connectionAnimation.active) {
      const animationAge = Date.now() - gameState.connectionAnimation.startTime;
      if (animationAge < 100) { // Just started
        const isFading = gameState.entities.some(entity => entity.state === 'FADING');
        const dialogueType = isFading ? 'revival' : 'post-nutrition';
        dispatch({
          type: 'SHOW_DIALOGUE',
          payload: { 
            message: getRandomDialogue(dialogueType),
            duration: isFading ? 4000 : 3000
          }
        });
      }
    }
  }, [gameState.connectionAnimation, gameState.entities, dispatch]);
};
