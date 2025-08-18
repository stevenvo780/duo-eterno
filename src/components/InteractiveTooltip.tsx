import React, { useState, useEffect, useRef } from 'react';
import './InteractiveTooltip.css';

interface TooltipData {
  id: string;
  name: string;
  description: string;
  effects: string[];
  type: 'zone' | 'entity' | 'furniture';
  color: string;
}

interface InteractiveTooltipProps {
  x: number;
  y: number;
  data: TooltipData | null;
  visible: boolean;
  onClose: () => void;
}

const InteractiveTooltip: React.FC<InteractiveTooltipProps> = ({
  x,
  y,
  data,
  visible,
  onClose
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const rect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Ajustar posición para evitar que se salga del viewport
      let adjustedX = x;
      let adjustedY = y;

      if (x + rect.width > viewportWidth) {
        adjustedX = x - rect.width - 10;
      }

      if (y + rect.height > viewportHeight) {
        adjustedY = y - rect.height - 10;
      }

      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [x, y, visible]);

  if (!visible || !data) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'zone': return '🏠';
      case 'entity': return '👤';
      case 'furniture': return '🪑';
      default: return '❓';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'zone': return 'var(--color-zone)';
      case 'entity': return 'var(--color-entity)';
      case 'furniture': return 'var(--color-furniture)';
      default: return 'var(--color-default)';
    }
  };

  return (
    <div
      ref={tooltipRef}
      className="interactive-tooltip"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        borderColor: data.color || getTypeColor(data.type)
      }}
    >
      <div className="tooltip-header">
        <div className="tooltip-title">
          <span className="tooltip-icon">{getTypeIcon(data.type)}</span>
          <h3>{data.name}</h3>
        </div>
        <button className="tooltip-close" onClick={onClose}>×</button>
      </div>

      <div className="tooltip-content">
        <p className="tooltip-description">{data.description}</p>
        
        {data.effects && data.effects.length > 0 && (
          <div className="tooltip-effects">
            <h4>Efectos:</h4>
            <ul>
              {data.effects.map((effect, index) => (
                <li key={index} className="effect-item">
                  <span className="effect-bullet">✨</span>
                  {effect}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="tooltip-meta">
          <span className="tooltip-type" style={{ color: getTypeColor(data.type) }}>
            {data.type.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTooltip;
