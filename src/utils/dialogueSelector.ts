interface DialogueEntry {
  speaker: 'ISA' | 'STEV';
  text: string;
  emotion: string;
  activity: string;
}

let dialogueData: DialogueEntry[] = [];
let currentIndex = 0;

export const loadDialogueData = async (): Promise<void> => {
  try {
    const response = await fetch('/assets/dialogs/dialogos_chat_isa.lite.censored_plus.json');
    dialogueData = await response.json();
    const seed = Date.now();
    currentIndex = Math.floor((seed * 1664525 + 1013904223) % 2147483647) % dialogueData.length;
  } catch (error) {
    console.warn('No se pudo cargar el archivo de diálogos:', error);
    dialogueData = [];
  }
};

export const getNextDialogue = (
  preferredSpeaker?: 'ISA' | 'STEV',
  preferredEmotion?: string,
  preferredActivity?: string
): DialogueEntry | null => {
  if (dialogueData.length === 0) return null;


  let attempts = 0;
  const maxAttempts = Math.min(100, dialogueData.length);
  
  while (attempts < maxAttempts) {
    const dialogue = dialogueData[currentIndex];
    currentIndex = (currentIndex + 1) % dialogueData.length;
    attempts++;


    if (!preferredSpeaker && !preferredEmotion && !preferredActivity) {
      return dialogue;
    }


    const speakerMatch = !preferredSpeaker || dialogue.speaker === preferredSpeaker;
    const emotionMatch = !preferredEmotion || dialogue.emotion === preferredEmotion;
    const activityMatch = !preferredActivity || dialogue.activity === preferredActivity;

    if (speakerMatch && emotionMatch && activityMatch) {
      return dialogue;
    }
  }

  const fallbackIndex = (Date.now() * 1664525 + 1013904223) % 2147483647;
  return dialogueData[Math.floor(fallbackIndex) % dialogueData.length];
};


export const getEmotionForActivity = (activity: string): string => {
  const emotionMap: Record<string, string[]> = {
    'SOCIALIZING': ['LOVE', 'PLAYFUL', 'NEUTRAL', 'CURIOUS'],
    'RESTING': ['NEUTRAL', 'SADNESS', 'LOVE'], // Añadido LOVE para momentos íntimos
    'PLAYING': ['PLAYFUL', 'LOVE', 'CURIOUS'],
    'FEEDING': ['LOVE', 'NEUTRAL', 'PLAYFUL'],
    'MEDITATION': ['NEUTRAL', 'CURIOUS', 'LOVE'], // Contemplación amorosa
    'WRITING': ['CURIOUS', 'NEUTRAL', 'LOVE'],
    'WORKING': ['NEUTRAL', 'CURIOUS', 'SADNESS'],
    'STUDYING': ['CURIOUS', 'NEUTRAL', 'LOVE']
  };

  const emotions = emotionMap[activity] || ['NEUTRAL', 'LOVE', 'CURIOUS'];
  const activityHash = activity.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff, 0);
  const emotionIndex = Math.abs(activityHash) % emotions.length;
  return emotions[emotionIndex];
};

export const getSpeakerForEntity = (entityId: string): 'ISA' | 'STEV' => {

  return entityId === 'circle' ? 'ISA' : 'STEV';
};
// Mapeo de tipos de interacción a emociones/actividades del chat
export const getDialogueForInteraction = (
  interactionType: string,
  entityId: string
): DialogueEntry | null => {
  if (dialogueData.length === 0) return null;

  const speaker = getSpeakerForEntity(entityId);
  
  // Mapeo expandido de interacciones a emociones y contextos del chat
  const interactionMap: Record<string, { emotions: string[], activities: string[], priority?: string[] }> = {
    'FEED': {
      emotions: ['LOVE', 'PLAYFUL', 'NEUTRAL'],
      activities: ['SOCIALIZING'],
      priority: ['LOVE'] // Priorizar expresiones de amor al alimentar
    },
    'PLAY': {
      emotions: ['PLAYFUL', 'LOVE', 'CURIOUS'],
      activities: ['SOCIALIZING'],
      priority: ['PLAYFUL'] // Priorizar diversión y juego
    },
    'COMFORT': {
      emotions: ['LOVE', 'NEUTRAL', 'SADNESS'],
      activities: ['SOCIALIZING'],
      priority: ['LOVE'] // Priorizar expresiones de amor al consolar
    },
    'DISTURB': {
      emotions: ['SADNESS', 'NEUTRAL', 'CURIOUS'],
      activities: ['SOCIALIZING'],
      priority: ['NEUTRAL'] // Respuestas más neutras a molestias
    },
    'NOURISH': {
      emotions: ['LOVE', 'PLAYFUL', 'CURIOUS'],
      activities: ['SOCIALIZING'],
      priority: ['LOVE'] // Máxima prioridad al amor en nutrición mutua
    },
    'SLEEP': {
      emotions: ['NEUTRAL', 'LOVE'],
      activities: ['SOCIALIZING'],
      priority: ['NEUTRAL']
    },
    'EXERCISE': {
      emotions: ['PLAYFUL', 'CURIOUS', 'NEUTRAL'],
      activities: ['SOCIALIZING'],
      priority: ['PLAYFUL']
    }
  };

  const config = interactionMap[interactionType.toUpperCase()];
  if (!config) return null;

  // Buscar diálogos que coincidan con el contexto de la interacción
  // Priorizar emociones específicas si están definidas
  const emotionsToTry = config.priority ? [...config.priority, ...config.emotions] : config.emotions;
  // CORRIGIDO: Usar selección determinista basada en interactionType en lugar de Math.random()
  const interactionHash = interactionType.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff, 0);
  const activityIndex = Math.abs(interactionHash) % config.activities.length;
  const targetActivity = config.activities[activityIndex];

  // Intentar con emociones prioritarias primero
  for (const emotion of emotionsToTry) {
    const dialogue = getNextDialogue(speaker, emotion, targetActivity);
    if (dialogue) return dialogue;
  }

  // Si no encontramos nada específico, buscar con cualquier emoción válida
  return getNextDialogue(speaker, undefined, targetActivity);
};
