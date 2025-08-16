import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 2000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  if (!visible) return null;

  const colors: Record<ToastType, { bg: string; border: string }> = {
    success: { bg: 'rgba(34,197,94,0.15)', border: '#22c55e' },
    info: { bg: 'rgba(59,130,246,0.15)', border: '#3b82f6' },
    warning: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b' },
    error: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444' },
  };

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000,
      background: colors[type].bg, border: `2px solid ${colors[type].border}`,
      color: '#e2e8f0', padding: '10px 14px', borderRadius: '8px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)', fontSize: '14px', fontWeight: 500
    }}>
      {message}
    </div>
  );
};

export default Toast;
