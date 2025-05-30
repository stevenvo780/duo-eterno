import React, { useState, useEffect } from 'react';
import { telemetryCollector } from '../utils/telemetry';

interface TelemetryUIProps {
  className?: string;
}

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const TelemetryUI: React.FC<TelemetryUIProps> = ({ className = '' }) => {
  const [snapshotCount, setSnapshotCount] = useState(0);
  const [recordingStarted, setRecordingStarted] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      const snapshots = telemetryCollector.getSnapshots();
      setSnapshotCount(snapshots.length);
      
      // Verificar si hay telemetría activa basándose en snapshots recientes
      if (snapshots.length > 0) {
        const lastSnapshot = snapshots[snapshots.length - 1];
        const timeSinceLastSnapshot = Date.now() - lastSnapshot.timestamp;
        setRecordingStarted(timeSinceLastSnapshot < 5000); // Activo si último snapshot < 5s
      } else {
        setRecordingStarted(false);
      }
    };

    const interval = setInterval(updateStats, 1000);
    updateStats();

    return () => clearInterval(interval);
  }, []);

  // Verificar si hay reportes guardados en localStorage
  const getLastReport = () => {
    try {
      const reports = localStorage.getItem('telemetry-reports');
      if (reports) {
        const parsed = JSON.parse(reports);
        return parsed.length > 0 ? parsed[parsed.length - 1] : null;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const lastReport = getLastReport();
  const hasData = snapshotCount > 0;

  return (
    <div className={`telemetry-ui ${className}`} style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      minWidth: '280px',
      maxWidth: '350px',
      zIndex: 1000,
      border: '1px solid #333'
    }}>
      {/* Estado de grabación */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '8px' 
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: recordingStarted ? '#00ff00' : '#ff0000',
            animation: recordingStarted ? 'blink 1s infinite' : 'none'
          }}></div>
          <span style={{ fontWeight: 'bold' }}>
            {recordingStarted ? '🔴 Grabando Telemetría' : '⭕ Telemetría Detenida'}
          </span>
        </div>
        
        {hasData && (
          <div style={{ fontSize: '11px', color: '#ccc' }}>
            📊 {snapshotCount} snapshots capturados
          </div>
        )}
      </div>

      {/* Último reporte */}
      {lastReport && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
            📈 Último Análisis Auto-guardado
          </div>
          
          {/* Puntuación del sistema */}
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#ccc' }}>Estabilidad: </span>
            <span style={{
              fontWeight: 'bold',
              color: lastReport.summary.systemScore >= 80 ? '#00ff00' : 
                     lastReport.summary.systemScore >= 60 ? '#ffff00' : '#ff0000'
            }}>
              {lastReport.summary.systemScore}/100
            </span>
          </div>

          {/* Alertas críticas */}
          {lastReport.summary.criticalIssues && lastReport.summary.criticalIssues.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <div style={{ color: '#ff0000', fontWeight: 'bold' }}>
                🚨 Problemas Críticos:
              </div>
              {lastReport.summary.criticalIssues.slice(0, 2).map((issue, i) => (
                <div key={i} style={{ fontSize: '10px', color: '#ffcccc', marginLeft: '10px' }}>
                  • {issue}
                </div>
              ))}
            </div>
          )}

          {/* Métricas principales */}
          <div style={{ fontSize: '11px', color: '#ccc' }}>
            <div>🏃 Supervivencia: {lastReport.summary.avgLifespan?.toFixed(1) || 'N/A'}s</div>
            <div>⚡ Entidades: {lastReport.summary.totalEntities || 0}</div>
            <div>💾 Guardado: {formatDuration(Date.now() - lastReport.timestamp)} atrás</div>
          </div>
        </div>
      )}

      {/* Información de auto-guardado */}
      <div style={{ 
        fontSize: '10px', 
        color: '#888',
        borderTop: '1px solid #333',
        paddingTop: '8px',
        textAlign: 'center'
      }}>
        💾 Los datos se guardan automáticamente cada 30s en localStorage
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
