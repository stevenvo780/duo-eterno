/**
 * Panel de debugging para monitorear las dinámicas del tamagochi en tiempo real
 */

import React, { useState, useEffect } from 'react';
import { dynamicsLogger } from '../utils/dynamicsLogger';
import type { LogEntry as DynamicsLogEntry } from '../utils/dynamicsLogger';

interface DynamicsDebugPanelProps {
  visible: boolean;
  onClose: () => void;
}

const DynamicsDebugPanel: React.FC<DynamicsDebugPanelProps> = ({ visible, onClose }) => {
  const [logs, setLogs] = useState<DynamicsLogEntry[]>([]);
  const [category, setCategory] = useState<'ALL' | DynamicsLogEntry['category']>('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!visible || !autoRefresh) return;

    const interval = setInterval(() => {
      const recentLogs = category === 'ALL'
        ? dynamicsLogger.getRecentLogs(undefined, 100)
        : dynamicsLogger.getRecentLogs(category, 100);
      setLogs(recentLogs);
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, category, autoRefresh]);

  const generateReport = () => {
    const report = dynamicsLogger.generateReport();
    navigator.clipboard?.writeText(report);
    alert('Reporte copiado al portapapeles');
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      width: '400px',
      height: '600px',
      background: 'rgba(15, 20, 25, 0.95)',
      border: '1px solid #374151',
      borderRadius: '8px',
      color: '#f1f5f9',
      zIndex: 2000,
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px',
        borderBottom: '1px solid #374151',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          🔍 Dinámicas Debug
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ×
        </button>
      </div>

      {/* Controls */}
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #374151',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as 'ALL' | DynamicsLogEntry['category'])}
          style={{
            background: '#374151',
            border: '1px solid #475569',
            borderRadius: '4px',
            color: '#f1f5f9',
            padding: '4px 8px',
            fontSize: '12px'
          }}
        >
          <option value="ALL">Todos</option>
          <option value="AUTONOMY">🤖 Autonomía</option>
          <option value="LOVE">💖 Amor</option>
          <option value="SURVIVAL">🏠 Supervivencia</option>
          <option value="INTERACTION">🎮 Interacciones</option>
          <option value="SYSTEM">⚙️ Sistema</option>
        </select>

        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Auto-refresh
        </label>

        <button
          onClick={generateReport}
          style={{
            background: '#3b82f6',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          📋 Reporte
        </button>
      </div>

      {/* Logs */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px'
      }}>
        {logs.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px',
            marginTop: '20px'
          }}>
            No hay logs disponibles
          </div>
        ) : (
          logs.slice().reverse().map((log, index) => {
            const iconMap: Record<string, string> = {
              AUTONOMY: '🤖',
              LOVE: '💖',
              SURVIVAL: '🏠',
              INTERACTION: '🎮',
              SYSTEM: '⚙️'
            };
            const icon = iconMap[log.category] || '📝';

            const levelColorMap: Record<string, string> = {
              DEBUG: '#6b7280',
              INFO: '#3b82f6',
              WARNING: '#f59e0b',
              ERROR: '#ef4444'
            };
            const levelColor = levelColorMap[log.level];

            const time = new Date(log.timestamp).toLocaleTimeString();

            return (
              <div
                key={index}
                style={{
                  marginBottom: '8px',
                  padding: '6px',
                  background: 'rgba(55, 65, 81, 0.3)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  borderLeft: `3px solid ${levelColor}`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '2px'
                }}>
                  <span>{icon}</span>
                  <span style={{ color: levelColor, fontWeight: '600' }}>
                    {log.level}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '10px' }}>
                    {time}
                  </span>
                  {log.entityId && (
                    <span style={{
                      background: '#374151',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontSize: '10px',
                      color: '#e5e7eb'
                    }}>
                      {log.entityId}
                    </span>
                  )}
                </div>
                <div style={{ color: '#e5e7eb', lineHeight: '1.3' }}>
                  {log.message}
                </div>
                {log.data ? (
                  <details style={{ marginTop: '4px' }}>
                    <summary style={{
                      cursor: 'pointer',
                      color: '#94a3b8',
                      fontSize: '10px'
                    }}>
                      Ver datos
                    </summary>
                    <pre style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '4px',
                      borderRadius: '2px',
                      marginTop: '2px',
                      fontSize: '10px',
                      color: '#d1d5db',
                      overflow: 'auto',
                      maxHeight: '100px'
                    }}>
                      {JSON.stringify(log.data as object, null, 2)}
                    </pre>
                  </details>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid #374151',
        fontSize: '11px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        {logs.length} logs mostrados • Usa console.log(dynamicsLogger.generateReport()) para más detalles
      </div>
    </div>
  );
};

export default DynamicsDebugPanel;