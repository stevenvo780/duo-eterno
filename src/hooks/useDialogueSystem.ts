import { useEffect, useState, useCallback } from 'react';
import { useGame } from './useGame';
import {
  loadDialogueData,
  getNextDialogue,
  getSpeakerForEntity,
  getEmotionForActivity,
  getDialogueForInteraction
} from '../utils/dialogueSelector';

export const useDialogueSystem = () => {
  const { gameState, dispatch } = useGame();
  const [dialoguesLoaded, setDialoguesLoaded] = useState(false);
  const { currentConversation } = gameState;

  useEffect(() => {
    loadDialogueData().then(() => {
      setDialoguesLoaded(true);
    });
  }, []);

  const initiateConversation = useCallback(() => {
    if (Math.random() > 0.1) return; // 10% chance to start a conversation each tick

    const initiator = gameState.entities[Math.floor(Math.random() * gameState.entities.length)];
    if (initiator.isDead) return;

    const speaker = getSpeakerForEntity(initiator.id);
    const emotion = getEmotionForActivity(initiator.activity);
    const dialogue = getNextDialogue(speaker, emotion, initiator.activity);

    if (dialogue) {
      dispatch({
        type: 'START_CONVERSATION',
        payload: { participants: gameState.entities.map(e => e.id) }
      });
      dispatch({ type: 'ADVANCE_CONVERSATION', payload: { speaker: initiator.id, dialogue } });
      dispatch({
        type: 'SHOW_DIALOGUE',
        payload: {
          message: dialogue.text,
          duration: 3000,
          speaker: initiator.id,
          entityId: initiator.id,
          emotion: dialogue.emotion,
          position: { x: initiator.position.x, y: initiator.position.y }
        }
      });
    }
  }, [gameState.entities, dispatch]);

  const advanceConversation = useCallback(() => {
    const { lastSpeaker, lastDialogue } = currentConversation;
    if (!lastSpeaker || !lastDialogue) return;

    const responderId = gameState.entities.find(e => e.id !== lastSpeaker)?.id;
    if (!responderId) {
      dispatch({ type: 'END_CONVERSATION' });
      return;
    }

    const responder = gameState.entities.find(e => e.id === responderId);
    if (!responder || responder.isDead) {
      dispatch({ type: 'END_CONVERSATION' });
      return;
    }

    // Simple response logic: find a dialogue with a matching activity and emotion
    const speaker = getSpeakerForEntity(responderId);
    const responseDialogue = getNextDialogue(speaker, lastDialogue.emotion, lastDialogue.activity);

    if (responseDialogue) {
      dispatch({
        type: 'ADVANCE_CONVERSATION',
        payload: { speaker: responderId, dialogue: responseDialogue }
      });
      dispatch({
        type: 'SHOW_DIALOGUE',
        payload: {
          message: responseDialogue.text,
          duration: 3000,
          speaker: responderId,
          entityId: responderId,
          emotion: responseDialogue.emotion,
          position: { x: responder.position.x, y: responder.position.y }
        }
      });
    } else {
      // End conversation if no response is found
      dispatch({ type: 'END_CONVERSATION' });
    }
  }, [currentConversation, gameState.entities, dispatch]);

  useEffect(() => {
    if (!dialoguesLoaded) return;

    const interval = setInterval(() => {
      if (gameState.connectionAnimation.active) return;

      if (!currentConversation.isActive) {
        initiateConversation();
      } else {
        // Check for conversation timeout
        if (Date.now() - currentConversation.startTime > 20000) {
          // 20 second timeout
          dispatch({ type: 'END_CONVERSATION' });
          return;
        }
        // Only advance conversation if it's the other entity's turn
        if (currentConversation.lastSpeaker) {
          const lastSpeakerIndex = currentConversation.participants.indexOf(
            currentConversation.lastSpeaker
          );
          const _nextSpeakerIndex =
            (lastSpeakerIndex + 1) % currentConversation.participants.length;

          // A simple delay before responding
          if (Date.now() - currentConversation.startTime > 3000) {
            advanceConversation();
          }
        }
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [
    dialoguesLoaded,
    gameState.connectionAnimation.active,
    currentConversation,
    initiateConversation,
    advanceConversation,
    dispatch
  ]);

  // Handle dialogues from interactions
  useEffect(() => {
    if (!dialoguesLoaded || !gameState.connectionAnimation.active) return;

    const interaction = gameState.connectionAnimation.type;
    const entityId = 'circle'; // For now, assume circle is the target of interaction
    const dialogue = getDialogueForInteraction(interaction, entityId);

    if (dialogue) {
      dispatch({
        type: 'SHOW_DIALOGUE',
        payload: {
          message: dialogue.text,
          duration: 3000,
          speaker: entityId,
          entityId: entityId,
          emotion: dialogue.emotion,
          position: {
            x: gameState.entities.find(e => e.id === entityId)!.position.x,
            y: gameState.entities.find(e => e.id === entityId)!.position.y
          }
        }
      });
    }
  }, [gameState.connectionAnimation, dialoguesLoaded, dispatch, gameState.entities]);
};
