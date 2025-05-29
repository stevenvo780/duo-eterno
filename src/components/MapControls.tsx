import React, { useState, useCallback } from 'react';

interface MapControlsProps {
  onZoomChange?: (zoom: number) => void;
  onPanChange?: (pan: { x: number; y: number }) => void;
  onClose?: () => void;
  initialZoom?: number;
  initialPan?: { x: number; y: number };
}

const MapControls: React.FC<MapControlsProps> = ({
  onZoomChange,
  onPanChange,
  onClose,
  initialZoom = 1,
  initialPan = { x: 0, y: 0 }
}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState(initialPan);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.2, 3);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [zoom, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.2, 0.5);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [zoom, onZoomChange]);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    onZoomChange?.(1);
    onPanChange?.({ x: 0, y: 0 });
  }, [onZoomChange, onPanChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      
      const newPan = {
        x: pan.x + deltaX,
        y: pan.y + deltaY
      };
      
      setPan(newPan);
      onPanChange?.(newPan);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastMousePos, pan, onPanChange]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom * delta));
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [zoom, onZoomChange]);

  React.useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  return (
    <>
      {/* Map Navigation Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 100
        }}
      >
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.9)',
            border: '1px solid #475569',
            borderRadius: '8px',
            padding: '8px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {/* Header con título y botón cerrar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px'
          }}>
            <span style={{
              color: '#f1f5f9',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              🗺️ Navegación
            </span>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(239, 68, 68, 0.8)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '10px'
                }}
              >
                ✕
              </button>
            )}
          </div>
          
          <button
            onClick={handleZoomIn}
            style={{
              background: 'rgba(59, 130, 246, 0.8)',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
            title="Acercar"
          >
            +
          </button>
          
          <div
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            {Math.round(zoom * 100)}%
          </div>
          
          <button
            onClick={handleZoomOut}
            style={{
              background: 'rgba(59, 130, 246, 0.8)',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
            title="Alejar"
          >
            -
          </button>
          
          <hr style={{ 
            margin: '4px 0', 
            border: 'none', 
            borderTop: '1px solid #475569' 
          }} />
          
          <button
            onClick={handleResetView}
            style={{
              background: 'rgba(156, 163, 175, 0.8)',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '500'
            }}
            title="Centrar vista"
          >
            🎯
          </button>
        </div>
      </div>

      {/* Map interaction overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          cursor: isPanning ? 'grabbing' : 'grab',
          zIndex: 1
        }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      />

      {/* Mini-map indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '120px',
          height: '80px',
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '6px',
          padding: '8px',
          backdropFilter: 'blur(8px)',
          zIndex: 100
        }}
      >
        <div style={{ 
          fontSize: '10px', 
          color: '#94a3b8', 
          marginBottom: '4px',
          textAlign: 'center'
        }}>
          Vista: {Math.round(pan.x)}, {Math.round(pan.y)}
        </div>
        <div
          style={{
            width: '100%',
            height: '50px',
            border: '1px solid #475569',
            borderRadius: '4px',
            background: 'rgba(51, 65, 85, 0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Viewport indicator */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: `${Math.max(10, 60 / zoom)}px`,
              height: `${Math.max(6, 40 / zoom)}px`,
              border: '1px solid #60a5fa',
              background: 'rgba(96, 165, 250, 0.2)',
              transform: 'translate(-50%, -50%)',
              borderRadius: '2px'
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MapControls;
