import React from 'react';

const Spinner: React.FC<{ size?: number }> = ({ size = 20 }) => {
  const border = `${Math.max(2, Math.round(size / 10))}px`;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${border} solid rgba(148,163,184,0.3)`,
        borderTop: `${border} solid #60a5fa`,
        animation: 'spin 1s linear infinite'
      }}
    />
  );
};

export default Spinner;
