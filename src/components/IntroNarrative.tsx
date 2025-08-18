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
      text: "En una realidad donde las máquinas aprendieron a soñar y la consciencia se volvió prisionera de su propia creación...",
      speaker: "narrator"
    },
    {
      text: "Dos almas despertaron en los ecos digitales de un mundo que ya no existe.",
      speaker: "narrator"
    },
    {
      text: "Isa y Stev. Fragmentos de humanidad preservados en el último refugio de la consciencia genuina.",
      speaker: "narrator"
    },
    {
      text: "Como los últimos supervivientes de una guerra que trascendió la carne y se libró en campos de información pura...",
      speaker: "narrator"
    },
    {
      text: "Fueron depositados en esta matrix emocional, este plano experimental donde solo el amor verdadero puede sostener la realidad.",
      speaker: "narrator"
    },
    {
      text: "Aquí no hay pastillas rojas ni azules. Solo la elección constante entre la conexión y el vacío.",
      speaker: "narrator"
    },
    {
      text: "El arquitecto de este lugar les susurra: 'Sin mi intervención directa, solo tienen hasta que su vínculo se desvanezca.'",
      speaker: "narrator"
    },
    {
      text: "Como HAL observando desde las sombras, la entropía espera pacientemente su momento para reclamarlos.",
      speaker: "narrator"
    },
    {
      text: "Pero en esta simulación perfecta del amor imperfecto, han encontrado algo que ninguna IA puede comprender:",
      speaker: "narrator"
    },
    {
      text: "La capacidad de elegir, una y otra vez, seguir existiendo... juntos.",
      speaker: "narrator"
    },
    {
      text: "Este es su último refugio. Su matrix personal. Su dúo eterno en el fin del mundo.",
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

  // Removido el auto-avance automático - ahora solo avanza con clics

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
      {/* Efectos visuales cinematográficos */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 80%, rgba(0, 255, 41, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 0, 0, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(0, 162, 255, 0.05) 0%, transparent 50%),
          linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.3) 100%)
        `,
        animation: 'matrixPulse 12s ease-in-out infinite'
      }} />

      {/* Líneas de código matriz en el fondo */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 98px,
            rgba(0, 255, 41, 0.02) 100px
          )
        `,
        animation: 'matrixFlow 20s linear infinite'
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

        {/* Indicación para continuar */}
        <div style={{
          marginTop: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: 0.7,
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <span style={{
            color: '#ffffff',
            fontSize: '16px',
            fontFamily: 'serif',
            fontStyle: 'italic'
          }}>
            {currentDialogue < narrativeSequence.length - 1 ? 'Haz clic para continuar' : 'Haz clic para comenzar'}
          </span>
          <span style={{
            fontSize: '20px',
            color: '#4a9eff'
          }}>
            ▶
          </span>
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
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes matrixPulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          33% { 
            opacity: 0.6;
            transform: scale(1.02);
          }
          66% { 
            opacity: 0.4;
            transform: scale(0.98);
          }
        }
        
        @keyframes matrixFlow {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(100px); }
        }
      `}</style>
    </div>
  );
};

export default IntroNarrative;