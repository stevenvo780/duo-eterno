/**
 * F4: Componente de debug para mostrar métricas SLO y telemetría
 */

import React, { useState, useEffect } from 'react';
import { telemetry } from '../utils/telemetry';
import './TelemetryDebugPanel.css';

interface TelemetryStats {
  totalEvents: number;
  recentFps: number;
  slos: {
    fps: boolean;
    ttfmp: boolean;
    memory: boolean;
  };
}

export const TelemetryDebugPanel: React.FC = () => {
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(telemetry.getStats());
    };

    // Update every second
    const interval = setInterval(updateStats, 1000);
    updateStats(); // Initial update

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button 
        className="telemetry-toggle"
        onClick={() => setIsVisible(true)}
        title="Show telemetry debug panel"
      >
        📊
      </button>
    );
  }

  if (!stats) return null;

  return (
    <div className="telemetry-debug-panel">
      <div className="telemetry-header">
        <h3>🔍 F4 Telemetry & SLOs</h3>
        <button 
          className="telemetry-close"
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      </div>
      
      <div className="telemetry-content">
        <div className="telemetry-section">
          <h4>Performance Metrics</h4>
          <div className="metric">
            <span className="metric-label">FPS:</span>
            <span className={`metric-value ${stats.slos.fps ? 'slo-pass' : 'slo-fail'}`}>
              {stats.recentFps} {stats.slos.fps ? '✅' : '❌'}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">TTFMP SLO:</span>
            <span className={`metric-value ${stats.slos.ttfmp ? 'slo-pass' : 'slo-fail'}`}>
              {stats.slos.ttfmp ? '≤1200ms ✅' : '>1200ms ❌'}
            </span>
          </div>
          <div className="metric">
            <span className="metric-label">Memory SLO:</span>
            <span className={`metric-value ${stats.slos.memory ? 'slo-pass' : 'slo-fail'}`}>
              {stats.slos.memory ? '≤150MB ✅' : '>150MB ❌'}
            </span>
          </div>
        </div>

        <div className="telemetry-section">
          <h4>Event Statistics</h4>
          <div className="metric">
            <span className="metric-label">Total Events:</span>
            <span className="metric-value">{stats.totalEvents}</span>
          </div>
        </div>

        <div className="telemetry-actions">
          <button 
            onClick={() => {
              const events = telemetry.exportEvents();
              console.log('📊 Telemetry export:', events);
              // Could download as JSON file in real implementation
            }}
            className="telemetry-button"
          >
            Export Events
          </button>
        </div>
      </div>
    </div>
  );
};
