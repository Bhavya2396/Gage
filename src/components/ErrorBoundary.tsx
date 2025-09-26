import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle errors in the React component tree
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="error-boundary p-4 bg-red-900/20 border border-red-500 rounded-lg m-4 text-white">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <details className="text-sm opacity-80">
            <summary>Error details</summary>
            <p className="mt-2">{this.state.error && this.state.error.toString()}</p>
            <div className="mt-2 overflow-auto max-h-40 text-xs bg-black/30 p-2 rounded">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
          </details>
          <button
            className="mt-4 px-3 py-1 bg-cyan-primary text-white rounded"
            onClick={() => window.location.reload()}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;