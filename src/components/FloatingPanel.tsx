import React, { useState } from 'react';
import type { ReactNode } from 'react';

interface FloatingPanelProps {
  title: string;
  icon: string;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minimizable?: boolean;
  closable?: boolean;
  defaultMinimized?: boolean;
  onClose?: () => void;
  className?: string;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  title,
  icon,
  children,
  defaultPosition = { x: 20, y: 20 },
  defaultSize = { width: 300, height: 400 },
  minimizable = true,
  closable = true,
  defaultMinimized = false,
  onClose,
  className = ''
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size] = useState(defaultSize);
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).className.includes('panel-header')) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  }, [isDragging, dragOffset.x, dragOffset.y]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`floating-panel ${className}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: isMinimized ? 'auto' : size.width,
        height: isMinimized ? 'auto' : size.height,
        background: 'rgba(30, 41, 59, 0.95)',
        border: '1px solid #475569',
        borderRadius: '12px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'auto',
        overflow: 'hidden',
        resize: isMinimized ? 'none' : 'both',
        minWidth: '200px',
        minHeight: '100px'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div
        className="panel-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(51, 65, 85, 0.8)',
          borderBottom: isMinimized ? 'none' : '1px solid #475569',
          cursor: 'grab',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{icon}</span>
          <h3 style={{ 
            margin: 0, 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#f1f5f9' 
          }}>
            {title}
          </h3>
        </div>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          {minimizable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '2px 4px',
                borderRadius: '4px',
                transition: 'color 0.2s ease'
              }}
              title={isMinimized ? 'Maximizar' : 'Minimizar'}
            >
              {isMinimized ? '📤' : '📥'}
            </button>
          )}
          
          {closable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '2px 4px',
                borderRadius: '4px',
                transition: 'color 0.2s ease'
              }}
              title="Cerrar"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div style={{ 
          padding: '16px', 
          color: '#f1f5f9',
          height: 'calc(100% - 60px)',
          overflow: 'auto'
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default FloatingPanel;
