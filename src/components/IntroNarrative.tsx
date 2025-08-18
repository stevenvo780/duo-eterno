import React, { useState, useEffect } from 'react';

interface IntroNarrativeProps {
  onComplete: () => void;
}

const IntroNarrative: React.FC<IntroNarrativeProps> = ({ onComplete }) => {
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  const narrativeSequence = [
    {
      text: "En los albores del cosmos, cuando las primeras estrellas susurraban secretos al vacío...",
      duration: 4000,
      speaker: "narrator"
    },
    {
      text: "Dos almas fueron tejidas en el telar cuántico de la existencia.",
      duration: 3500,
      speaker: "narrator"
    },
    {
      text: "Isa y Stev, partículas de conciencia entrelazadas por fuerzas que trascienden la comprensión mortal.",
      duration: 4500,
      speaker: "narrator"
    },
    {
      text: "Fueron arrojados a una realidad única, una dimensión donde el amor es tanto combustible como destino.",
      duration: 4000,
      speaker: "narrator"
    },
    {
      text: "Aquí, en este plano experimental de la eternidad, deben aprender las leyes de la supervivencia emocional.",
      duration: 4500,
      speaker: "narrator"
    },
    {
      text: "Sin la gracia divina que los sostenga, solo su resonancia mutua puede mantener coherente su existencia.",
      duration: 4500,
      speaker: "narrator"
    },
    {
      text: "El tiempo fluye diferente aquí. Los ciclos se miden en latidos de corazones sincronizados.",
      duration: 4000,
      speaker: "narrator"
    },
    {
      text: "Si su vínculo se desvanece, si la entropía supera a su amor... la singularidad los reclamará.",
      duration: 4500,
      speaker: "narrator"
    },
    {
      text: "Pero mientras permanezcan unidos, mientras se nutran mutuamente, pueden tocar la eternidad.",
      duration: 4000,
      speaker: "narrator"
    },
    {
      text: "Esta es su historia. Este es su experimento. Este es... su dúo eterno.",
      duration: 3500,
      speaker: "narrator"
    }
  ];

  useEffect(() => {
    // Mostrar botón de skip después de 3 segundos
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 3000);

    return () => clearTimeout(skipTimer);
  }, []);

  useEffect(() => {
    if (currentDialogue >= narrativeSequence.length) {
      handleComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentDialogue(prev => prev + 1);
    }, narrativeSequence[currentDialogue].duration);

    return () => clearTimeout(timer);
  }, [currentDialogue]);

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleClick = () => {
    if (currentDialogue < narrativeSequence.length - 1) {
      setCurrentDialogue(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  if (!isVisible) return null;

  const currentText = currentDialogue < narrativeSequence.length 
    ? narrativeSequence[currentDialogue].text 
    : "";

  return (
    <div 
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(45deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
        cursor: 'pointer'
      }}>
      {/* Partículas de fondo */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.05) 0%, transparent 50%)
        `,
        animation: 'pulse 8s ease-in-out infinite'
      }} />

      <div style={{
        maxWidth: '800px',
        padding: '40px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Texto principal */}
        <div style={{
          fontSize: '28px',
          lineHeight: '1.6',
          color: '#ffffff',
          fontFamily: 'serif',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          marginBottom: '30px',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: currentText ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out'
        }}>
          {currentText}
        </div>

        {/* Indicador de progreso */}
        <div style={{
          width: '400px',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          margin: '20px auto',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentDialogue + 1) / narrativeSequence.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #4a9eff 0%, #ff6b9d 100%)',
            borderRadius: '2px',
            transition: 'width 0.3s ease-out'
          }} />
        </div>

        {/* Nombres de las entidades */}
        <div style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'center',
          gap: '60px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            opacity: 0.8
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#e91e63',
              boxShadow: '0 0 15px rgba(233, 30, 99, 0.5)'
            }} />
            <span style={{
              color: '#ffffff',
              fontSize: '18px',
              fontFamily: 'serif',
              fontStyle: 'italic'
            }}>
              Isa
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            opacity: 0.8
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              background: '#3f51b5',
              boxShadow: '0 0 15px rgba(63, 81, 181, 0.5)'
            }} />
            <span style={{
              color: '#ffffff',
              fontSize: '18px',
              fontFamily: 'serif',
              fontStyle: 'italic'
            }}>
              Stev
            </span>
          </div>
        </div>

        {/* Botón de skip */}
        {showSkip && (
          <button
            onClick={handleSkip}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: '8px 16px',
              color: '#ffffff',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Omitir ⏭
          </button>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default IntroNarrative;