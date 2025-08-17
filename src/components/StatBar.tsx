import React from 'react';
import { getStatColor } from '../utils/interactions';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  showLabel?: boolean;
  showValue?: boolean;
  height?: number;
  animated?: boolean;
}

const StatBar: React.FC<StatBarProps> = ({ 
  label, 
  value, 
  maxValue = 100, 
  showLabel = true, 
  showValue = true,
  height = 20,
  animated = true 
}) => {
  // Normalize value to 0-100 range for display
  const normalizedValue = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const displayValue = Math.round(value);
  
  return (
    <div style={{
      width: '100%',
      marginBottom: '8px'
    }}>
      {showLabel && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
          fontSize: '12px',
          fontWeight: '500',
          color: '#e2e8f0'
        }}>
          <span>{label}</span>
          {showValue && (
            <span style={{
              color: getStatColor(normalizedValue),
              fontWeight: '600'
            }}>
              {displayValue}{maxValue === 100 ? '%' : ''}
            </span>
          )}
        </div>
      )}
      
      <div style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: '#1e293b',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid #334155',
        position: 'relative',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
      }}>
        {/* Background gradient for depth */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
          pointerEvents: 'none'
        }} />
        
        {/* Filled portion */}
        <div style={{
          height: '100%',
          width: `${normalizedValue}%`,
          background: `linear-gradient(135deg, ${getStatColor(normalizedValue)}, ${getStatColor(Math.min(100, normalizedValue + 20))})`,
          transition: animated ? 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          borderRadius: '5px',
          position: 'relative',
          boxShadow: normalizedValue > 0 ? `0 0 8px ${getStatColor(normalizedValue)}40` : 'none'
        }}>
          {/* Shine effect */}
          <div style={{
            position: 'absolute',
            top: '2px',
            left: '2px',
            right: '2px',
            height: '30%',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
            borderRadius: '3px',
            animation: animated && normalizedValue > 0 ? 'shine 2s ease-in-out infinite' : 'none'
          }} />
        </div>
        
        {/* Critical warning overlay */}
        {normalizedValue < 20 && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(239, 68, 68, 0.1) 4px, rgba(239, 68, 68, 0.1) 8px)',
            animation: 'pulse 1s ease-in-out infinite'
          }} />
        )}
        
        {/* Value text inside bar for wider bars */}
        {height >= 24 && showValue && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '11px',
            fontWeight: 'bold',
            color: normalizedValue > 30 ? '#fff' : '#94a3b8',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            pointerEvents: 'none'
          }}>
            {displayValue}{maxValue === 100 ? '%' : ''}
          </div>
        )}
      </div>
      
      {/* Status indicator */}
      {normalizedValue < 30 && (
        <div style={{
          fontSize: '10px',
          color: normalizedValue < 10 ? '#ef4444' : '#f59e0b',
          marginTop: '2px',
          fontWeight: '500'
        }}>
          {normalizedValue < 10 ? '⚠️ Critical' : '⚡ Low'}
        </div>
      )}
      
      <style>
        {`
          @keyframes shine {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
    </div>
  );
};

export default StatBar;