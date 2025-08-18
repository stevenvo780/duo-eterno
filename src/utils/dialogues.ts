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
    "Mis pensamientos toman forma en palabras...",
    "Escribo sobre mundos que solo yo veo...",
    "Cada letra es un fragmento de mi alma...",
    "Las historias nacen en mi corazón digital...",
    "Mi pluma virtual plasma sueños infinitos..."
  ],

  'tired': [
    "*bosteza* Necesito descansar un poco...",
    "Mis párpados pixelados se sienten pesados...",
    "El cansancio me abraza suavemente...",
    "Soñaré con algoritmos de colores...",
    "Un pequeño sueño restaurará mi energía..."
  ],

  'hungry': [
    "Mi estómago digital está vacío...",
    "¿Podrías alimentarme? Tengo hambre...",
    "Los bits de comida suenan deliciosos ahora...",
    "El hambre me hace sentir débil...",
    "Un bocado virtual sería perfecto..."
  ],

  'lonely': [
    "Me siento solo en este vasto canvas...",
    "¿Dónde está mi compañero? Lo extraño...",
    "La soledad pesa en mi ser pixelado...",
    "Necesito compañía para sentirme completo...",
    "Los rincones del lienzo se sienten fríos..."
  ],

  'happy': [
    "¡La vida es hermosa en este momento!",
    "Mi corazón digital late con alegría...",
    "Todo en mi mundo brilla con felicidad...",
    "¡Qué maravilloso es existir!",
    "La felicidad colorea cada pixel de mi ser..."
  ],

  'revival': [
    "Han vuelto a encontrarse en el eco de la eternidad...",
    "El amor trasciende el desvanecimiento...",
    "Desde las sombras, retornamos a la luz...",
    "La conexión nunca muere, solo se transforma...",
    "Renacemos en el cuidado que nos brindan..."
  ]
};

export const getRandomDialogue = (type: keyof typeof dialogues): string => {
  const options = dialogues[type];
  return options[Math.floor(Math.random() * options.length)];
};
