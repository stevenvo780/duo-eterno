import React, { useState, useEffect } from 'react';
import { unifiedTelemetry, getCurrentTelemetryData, exportTelemetryData } from '../utils/unifiedTelemetry';

interface TelemetryUIProps {
  className?: string;
}

interface QuickAnalysisData {
  recordingTime: number;
  totalSnapshots: number;
  avgSurvivalTime: number;
  currentResonance: number;
  totalMovementDistance: number;
  zoneUsageStats: Record<string, number>;
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
  const [quickAnalysis, setQuickAnalysis] = useState<QuickAnalysisData | null>(null);

  useEffect(() => {
    const updateStats = () => {
      const snapshots = getCurrentTelemetryData();
      setSnapshotCount(snapshots.length);
      
      // Verificar si hay telemetría activa basándose en snapshots recientes
      if (snapshots.length > 0) {
        const lastSnapshot = snapshots[snapshots.length - 1];
        const timeSinceLastSnapshot = Date.now() - lastSnapshot.timestamp;
        setRecordingStarted(timeSinceLastSnapshot < 5000); // Activo si último snapshot < 5s
      } else {
        setRecordingStarted(false);
      }

      // Obtener análisis rápido
      const analysis = unifiedTelemetry.getQuickAnalysis();
      setQuickAnalysis(analysis);
    };

    const interval = setInterval(updateStats, 1000);
    updateStats();

    return () => clearInterval(interval);
  }, []);

  const hasData = snapshotCount > 0;

  const handleExportData = () => {
    try {
      const data = exportTelemetryData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `telemetry-${new Date().toISOString().slice(0, 19)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando telemetría:', error);
    }
  };

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
            {recordingStarted ? '🔴 Telemetría Unificada' : '⭕ Telemetría Detenida'}
          </span>
        </div>
        
        {hasData && (
          <div style={{ fontSize: '11px', color: '#ccc' }}>
            📊 {snapshotCount} snapshots (cada 4s)
          </div>
        )}
      </div>

      {/* Análisis rápido en tiempo real */}
      {quickAnalysis && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
            📈 Análisis en Tiempo Real
          </div>
          
          {/* Métricas principales */}
          <div style={{ fontSize: '11px', color: '#ccc' }}>
            <div>⏱️ Tiempo: {formatDuration(quickAnalysis.recordingTime * 1000)}</div>
            <div>💖 Resonancia: {quickAnalysis.currentResonance.toFixed(1)}</div>
            <div>🏃 Movimiento total: {quickAnalysis.totalMovementDistance.toFixed(1)}px</div>
          </div>

          {/* Uso de zonas */}
          {Object.keys(quickAnalysis.zoneUsageStats).length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>
                🌍 Uso de Zonas:
              </div>
              {Object.entries(quickAnalysis.zoneUsageStats)
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 3)
                .map(([zone, count]) => (
                <div key={zone} style={{ fontSize: '10px', color: '#ccc', marginLeft: '10px' }}>
                  • {zone}: {count} visitas
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Controles */}
      {hasData && (
        <div style={{ 
          borderTop: '1px solid #333',
          paddingTop: '8px',
          marginTop: '8px'
        }}>
          <button 
            onClick={handleExportData}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '10px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            💾 Exportar Datos JSON
          </button>
        </div>
      )}

      {/* Información del sistema */}
      <div style={{ 
        fontSize: '10px', 
        color: '#888',
        borderTop: '1px solid #333',
        paddingTop: '8px',
        textAlign: 'center',
        marginTop: '8px'
      }}>
        🚀 Sistema unificado optimizado - Sin duplicación de logs
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
