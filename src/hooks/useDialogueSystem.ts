import { useEffect, useState, useCallback } from 'react';
import { useGame } from './useGame';
import {
  loadDialogueData,
  getNextDialogue,
  getSpeakerForEntity,
  getEmotionForActivity,
  getDialogueForInteraction,
  getResponseWriter,
} from '../utils/dialogueSelector';
import { gameConfig } from '../config/gameConfig';
import type { DialogueEntry } from '../types';

const {
  dialogueInitiationChance,
  dialogueConversationTimeout,
  dialogueResponseDelay,
} = gameConfig.ui;

export const useDialogueSystem = () => {
  const { gameState, dispatch } = useGame();
  const [dialoguesLoaded, setDialoguesLoaded] = useState(false);
  const { currentConversation, entities } = gameState;

  useEffect(() => {
    loadDialogueData().then(() => {
      setDialoguesLoaded(true);
    });
  }, []);

  const canConverse = (entityId: string): boolean => {
    const entity = entities.find(e => e.id === entityId);
    if (!entity) return false;
    return !entity.isDead && entity.activity !== 'SLEEPING' && entity.activity !== 'WORKING';
  };

  const initiateConversation = useCallback(() => {
    if (Math.random() > dialogueInitiationChance) return;

    const initiator = entities[Math.floor(Math.random() * entities.length)];
    if (!canConverse(initiator.id)) return;

    const speaker = getSpeakerForEntity(initiator.id);
    const emotion = getEmotionForActivity(initiator.activity);
    const dialogue = getNextDialogue(speaker, emotion, initiator.activity);

    if (dialogue) {
      dispatch({ type: 'START_CONVERSATION', payload: { participants: entities.map(e => e.id) } });
      dispatch({ type: 'ADVANCE_CONVERSATION', payload: { speaker: initiator.id, dialogue } });
      dispatch({
        type: 'SHOW_DIALOGUE',
        payload: {
          message: dialogue.text,
          duration: 3000,
          speaker: initiator.id,
          entityId: initiator.id,
          emotion: dialogue.emotion,
          position: { x: initiator.position.x, y: initiator.position.y },
        },
      });
    }
  }, [entities, dispatch]);

  const advanceConversation = useCallback(() => {
    const { lastSpeaker, lastDialogue } = currentConversation;
    if (!lastSpeaker || !lastDialogue) return;

    const responderId = entities.find(e => e.id !== lastSpeaker)?.id;
    if (!responderId || !canConverse(responderId)) {
      dispatch({ type: 'END_CONVERSATION' });
      return;
    }
    
    const responder = entities.find(e => e.id === responderId);
    if (!responder) {
        dispatch({ type: 'END_CONVERSATION' });
        return;
    }

    const responderSpeaker = getSpeakerForEntity(responderId);
    const responseDialogue = getResponseWriter(responderSpeaker, lastDialogue);

    if (responseDialogue) {
      dispatch({ type: 'ADVANCE_CONVERSATION', payload: { speaker: responderId, dialogue: responseDialogue } });
      dispatch({
        type: 'SHOW_DIALOGUE',
        payload: {
          message: responseDialogue.text,
          duration: 3000,
          speaker: responderId,
          entityId: responderId,
          emotion: responseDialogue.emotion,
          position: { x: responder.position.x, y: responder.position.y },
        },
      });
    } else {
      dispatch({ type: 'END_CONVERSATION' });
    }
  }, [currentConversation, entities, dispatch]);


  useEffect(() => {
    if (!dialoguesLoaded) return;

    const interval = setInterval(() => {
      if (gameState.connectionAnimation.active) return;

      if (!currentConversation.isActive) {
        initiateConversation();
      } else {
        if (Date.now() - currentConversation.startTime > dialogueConversationTimeout) {
          dispatch({ type: 'END_CONVERSATION' });
          return;
        }
        
        if (currentConversation.lastSpeaker) {
            const responseTimer = setTimeout(() => {
                advanceConversation();
            }, dialogueResponseDelay + Math.random() * 1000); // Add some randomness
            
            return () => clearTimeout(responseTimer);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [dialoguesLoaded, gameState.connectionAnimation.active, currentConversation, initiateConversation, advanceConversation, dispatch]);

  // Handle dialogues from interactions
  useEffect(() => {
    if (!dialoguesLoaded || !gameState.connectionAnimation.active) return;

    const { type: interactionType, entityId } = gameState.connectionAnimation;
    
    // The INTERACT action should have the entityId in its payload
    const targetEntityId = entityId || 'circle'; // Fallback for safety

    const dialogue = getDialogueForInteraction(interactionType, targetEntityId);

    if (dialogue) {
      const entity = entities.find(e => e.id === targetEntityId);
      if (entity) {
        dispatch({
          type: 'SHOW_DIALOGUE',
          payload: {
            message: dialogue.text,
            duration: 3000,
            speaker: targetEntityId,
            entityId: targetEntityId,
            emotion: dialogue.emotion,
            position: { x: entity.position.x, y: entity.position.y },
          },
        });
      }
    }
  }, [gameState.connectionAnimation, dialoguesLoaded, dispatch, entities]);
};