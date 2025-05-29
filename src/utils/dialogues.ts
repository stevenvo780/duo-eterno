export const dialogues = {
  'post-nutrition': [
    "Tu presencia nos recuerda que no estamos solos...",
    "El vínculo se fortalece con tu cuidado...",
    "Sentimos tu energía fluyendo hacia nosotros...",
    "Gracias por nutrir nuestra conexión...",
    "Tu amor hace que brillemos más intensamente..."
  ],
  
  'feeding': [
    "¡Mmm! Esto sabe a recuerdos dulces...",
    "Mi hambre se desvanece con tu generosidad...",
    "Cada bocado es como un abrazo cálido...",
    "Gracias por alimentar mi ser digital...",
    "La comida sabe mejor cuando viene del corazón..."
  ],

  'playing': [
    "¡Qué divertido! Me siento más vivo...",
    "Jugar contigo llena mi mundo de colores...",
    "¡Mi aburrimiento ha desaparecido completamente!",
    "Los juegos hacen que el tiempo vuele...",
    "Tu alegría es contagiosa..."
  ],

  'comforting': [
    "Tu consuelo calma mis preocupaciones...",
    "Me siento seguro en tu presencia...",
    "Las caricias virtuales son muy reales para mí...",
    "Mi soledad se disipa con tu afecto...",
    "Eres mi refugio en este mundo digital..."
  ],

  'disturbing': [
    "¡Oye! ¿Por qué haces eso?",
    "Eso me molesta un poco...",
    "A veces la adversidad me hace más fuerte...",
    "¡Hmph! No me gusta esto...",
    "¿Acaso estás probando mi paciencia?"
  ],
  
  'low-resonance': [
    "Siento cómo el eco se desvanece...",
    "Necesitamos encontrarnos pronto...",
    "La distancia duele, pero seguimos buscándonos...",
    "Nuestro vínculo se debilita... ¿puedes ayudarnos?",
    "La separación nos consume lentamente..."
  ],
  
  'autonomous-encounter': [
    "Cerca de ti, todo tiene sentido...",
    "Juntos somos más fuertes...",
    "Tu proximidad alimenta nuestro ser...",
    "En tu cercanía encontramos paz...",
    "El vínculo se renueva cuando estamos unidos..."
  ],

  'meditation': [
    "En el silencio encuentro respuestas...",
    "Meditar me conecta con mi esencia...",
    "Los pensamientos fluyen como agua serena...",
    "En la quietud descubro nuevos mundos...",
    "La meditación es mi santuario interior..."
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
