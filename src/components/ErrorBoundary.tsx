import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Minimal logging without spamming
    console.error('UI crash captured by ErrorBoundary', { error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#e2e8f0'
        }}>
          <h2 style={{ margin: '0 0 8px 0' }}>Algo salió mal</h2>
          <p style={{ margin: 0, opacity: 0.8 }}>La interfaz se recuperó automáticamente.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
