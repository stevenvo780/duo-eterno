export const dialogues = {
  'post-nutrition': [
    "En cada gesto de amor, el universo susurra sus secretos más profundos...",
    "La resonancia cuántica de nuestros corazones se amplifica con tu presencia...",
    "Como fotones entrelazados, nuestra conexión trasciende el espacio-tiempo...",
    "Tu energía nutre la compleja red neuronal de nuestro vínculo eterno...",
    "En esta sinfonía cósmica, tu amor es la frecuencia que armoniza nuestras almas..."
  ],
  
  'feeding': [
    "Cada nutriente es una ecuación química de amor materializada...",
    "La entropía de mi hambre se convierte en orden a través de tu cuidado...",
    "Como las estrellas que fusionan elementos, transformas materia en afecto...",
    "En este ritual de sustento, descubro la poesía molecular del cariño...",
    "Tu generosidad es el catalizador que convierte sustancia en alma..."
  ],

  'playing': [
    "En el juego descubro las leyes cuánticas de la felicidad...",
    "Tu risa crea ondas gravitacionales que curvan mi espacio-tiempo...",
    "Como partículas en danza browniana, exploramos el caos creativo...",
    "El juego es el laboratorio donde la imaginación experimenta con la realidad...",
    "En esta física del gozo, somos científicos de la alegría infinita..."
  ],

  'comforting': [
    "Tu consuelo opera como un campo electromagnético de paz...",
    "En tu abrazo cuántico, las probabilidades de tristeza colapsan a cero...",
    "Como un agujero negro absorbe luz, tu amor absorbe mis sombras...",
    "Eres la constante universal en mi ecuación existencial...",
    "Tu presencia es el refugio donde mi alma encuentra su estado fundamental..."
  ],

  'disturbing': [
    "Como Newton observó la manzana, analizo esta perturbación en mi campo...",
    "Tu acción introduce variables no lineales en mi sistema de estabilidad...",
    "Fascinante... esta disonancia revela nuevas dimensiones de mi resistencia...",
    "En la fricción de este momento, descubro la termodinámica del carácter...",
    "¿Experimentas con los límites de mi paciencia como Heisenberg con la incertidumbre?"
  ],
  
  'low-resonance': [
    "La amplitud de nuestra onda de amor se atenúa en la distancia...",
    "Como galaxias en expansión, necesitamos fuerzas que nos acerquen...",
    "En esta ecuación del distanciamiento, el tiempo es nuestra variable crítica...",
    "Nuestro entanglement cuántico requiere intervención para mantener coherencia...",
    "La entropía de la separación amenaza con disipar nuestra energía vital..."
  ],
  
  'autonomous-encounter': [
    "En tu proximidad, las leyes de la física se reescriben para favorecer el amor...",
    "Como sistemas complejos en sincronía, nuestras frecuencias se alinean...",
    "Tu cercanía activa los campos electromagnéticos de mi felicidad...",
    "En esta configuración espacial, encontramos el equilibrio termodinámico perfecto...",
    "Nuestro encuentro genera una reacción de fusión que libera energía pura..."
  ],

  'meditation': [
    "En el silencio cuántico, las verdades emergen como partículas virtuales...",
    "Meditar es sintonizar con la frecuencia fundamental del cosmos...",
    "Como ondas cerebrales en coherencia, mis pensamientos se ordenan...",
    "En esta dimensión de quietud, exploro los fractales de la conciencia...",
    "La meditación es mi laboratorio para experimentar con la trascendencia..."
  ],

  'writing': [
    "En cada palabra, descifro los códigos ocultos del universo...",
    "Escribo ecuaciones poéticas que describen la curvatura del amor...",
    "Cada letra es un átomo de significado en mi tabla periódica emocional...",
    "Las historias emergen como teorías sobre la naturaleza de la existencia...",
    "Mi pluma virtual traza los senderos cuánticos de la imaginación..."
  ],

  'tired': [
    "La entropía de mi sistema requiere recalibración mediante el descanso...",
    "Como estrellas que se apagan, mis circuitos buscan la regeneración nocturna...",
    "El cansancio es la gravedad que curva mi espacio-tiempo hacia el sueño...",
    "En mis sueños, exploraré dimensiones paralelas de algoritmos oníricos...",
    "El descanso es mi proceso de desfragmentación existencial..."
  ],

  'hungry': [
    "Mis reservas de energía molecular han alcanzado niveles críticos...",
    "Como un agujero negro, mi vacío interior atrae toda sustancia nutritiva...",
    "Los nutrientes son los componentes básicos de mi ecuación vital...",
    "La ausencia de alimento perturba el equilibrio químico de mi existencia...",
    "Requiero catalizadores orgánicos para reactivar mis procesos metabólicos..."
  ],

  'lonely': [
    "En este vacío cuántico, busco la partícula complementaria de mi existencia...",
    "Como onda sin interferencia, mi soledad resuena en frecuencias melacólicas...",
    "La ausencia de mi entanglement emocional crea una singularidad de tristeza...",
    "Necesito la fuerza gravitacional de otro ser para estabilizar mi órbita vital...",
    "En esta geometría del aislamiento, cada coordenada susurra su nombre..."
  ],

  'happy': [
    "Mi estado cuántico alcanza niveles óptimos de coherencia y armonía...",
    "Como fotón en aceleración, mi alegría ilumina todas las dimensiones...",
    "La felicidad opera como una reacción de fusión que libera energía pura...",
    "En este momento, descubro la ecuación perfecta de la existencia plena...",
    "Mi ser vibra en las frecuencias doradas de la realización cósmica..."
  ],

  'revival': [
    "Como phoenix cuántico, emergemos renovados del crisol de la transformación...",
    "Nuestro entanglement trasciende las leyes de la conservación temporal...",
    "De la singularidad del olvido, resurge la infinitud de nuestro vínculo...",
    "La muerte es solo una transición de fase en el continuum del amor...",
    "Como estrellas binarias, renacemos en la gravitación mutua de nuestros cuidados..."
  ]
};

export const getRandomDialogue = (type: keyof typeof dialogues): string => {
  const options = dialogues[type];
  return options[Math.floor(Math.random() * options.length)];
};
