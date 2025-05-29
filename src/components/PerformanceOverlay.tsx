import React from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

interface PerformanceOverlayProps {
  enabled?: boolean;
}

const PerformanceOverlay: React.FC<PerformanceOverlayProps> = ({ enabled = false }) => {
  const { fps, frameTime } = usePerformanceMonitor();

  if (!enabled) return null;

  const getFpsColor = (fps: number): string => {
    if (fps >= 55) return '#10b981'; // green
    if (fps >= 30) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 1000,
      minWidth: '120px'
    }}>
      <div style={{ 
        color: getFpsColor(fps),
        fontWeight: 'bold',
        marginBottom: '2px'
      }}>
        FPS: {fps}
      </div>
      <div style={{ 
        color: '#94a3b8',
        fontSize: '10px'
      }}>
        Frame: {frameTime}ms
      </div>
      <div style={{ 
        color: '#94a3b8',
        fontSize: '10px',
        marginTop: '2px'
      }}>
        Target: 60 FPS
      </div>
    </div>
  );
};

export default React.memo(PerformanceOverlay);
