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
    
    // Inicializar en un punto aleatorio para variar
    currentIndex = Math.floor(Math.random() * dialogueData.length);
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

  // Buscar el siguiente diálogo que coincida con los filtros
  let attempts = 0;
  const maxAttempts = Math.min(100, dialogueData.length);
  
  while (attempts < maxAttempts) {
    const dialogue = dialogueData[currentIndex];
    currentIndex = (currentIndex + 1) % dialogueData.length;
    attempts++;

    // Si no hay filtros específicos, devolver el diálogo actual
    if (!preferredSpeaker && !preferredEmotion && !preferredActivity) {
      return dialogue;
    }

    // Verificar si coincide con los filtros
    const speakerMatch = !preferredSpeaker || dialogue.speaker === preferredSpeaker;
    const emotionMatch = !preferredEmotion || dialogue.emotion === preferredEmotion;
    const activityMatch = !preferredActivity || dialogue.activity === preferredActivity;

    if (speakerMatch && emotionMatch && activityMatch) {
      return dialogue;
    }
  }

  // Si no encontramos nada específico, devolver un diálogo aleatorio
  return dialogueData[Math.floor(Math.random() * dialogueData.length)];
};

export const getDialogueFromPoint = (startIndex: number): DialogueEntry | null => {
  if (dialogueData.length === 0 || startIndex < 0 || startIndex >= dialogueData.length) {
    return null;
  }
  
  currentIndex = startIndex;
  return dialogueData[currentIndex];
};

export const getEmotionForActivity = (activity: string): string => {
  const emotionMap: Record<string, string[]> = {
    'SOCIALIZING': ['LOVE', 'PLAYFUL', 'NEUTRAL'],
    'RESTING': ['NEUTRAL', 'SADNESS'],
    'PLAYING': ['PLAYFUL', 'LOVE'],
    'FEEDING': ['LOVE', 'NEUTRAL'],
    'MEDITATION': ['NEUTRAL', 'CURIOUS']
  };

  const emotions = emotionMap[activity] || ['NEUTRAL'];
  return emotions[Math.floor(Math.random() * emotions.length)];
};

export const getSpeakerForEntity = (entityId: string): 'ISA' | 'STEV' => {
  // Mapear entidades del juego a speakers del chat
  return entityId === 'circle' ? 'ISA' : 'STEV';
};

export const getDialogueCount = (): number => {
  return dialogueData.length;
};