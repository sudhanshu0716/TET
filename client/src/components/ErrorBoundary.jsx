import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '20px',
          maxWidth: '400px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'white', marginBottom: '8px' }}>
              Something went wrong
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {this.state.error?.message || 'Unknown error'}
            </p>
            {this.state.errorInfo && (
              <details style={{ marginTop: '16px', textAlign: 'left' }}>
                <summary style={{ fontSize: '11px', color: '#64748b', cursor: 'pointer', fontWeight: 700 }}>
                  Error Details
                </summary>
                <pre style={{ fontSize: '10px', color: '#f87171', whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginTop: '8px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', maxHeight: '200px', overflow: 'auto' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              window.location.href = '/dashboard';
            }}
            style={{
              padding: '16px 32px',
              borderRadius: '16px',
              background: '#0ea5e9',
              color: 'white',
              fontWeight: 900,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(14,165,233,0.3)'
            }}
          >
            Reload Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
