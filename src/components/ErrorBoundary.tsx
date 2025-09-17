import React, { Component, ErrorInfo, ReactNode } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle errors in React components
 * Provides a graceful fallback UI when components fail to render
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // In a production app, you would send this to a logging service
    // logErrorToService(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <GlassCard variant="default" size="md" className="p-4 max-w-md mx-auto my-8">
          <div className="flex items-center mb-4">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <h3 className="text-lg font-medium text-alpine-mist">Something went wrong</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">
            We encountered an error while rendering this component. Please try refreshing the page.
          </p>
          <div className="bg-glass-background bg-opacity-30 p-3 rounded-lg">
            <p className="text-xs text-alpine-mist font-mono overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown error'}
            </p>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-cyan-primary text-white rounded-lg hover:bg-cyan-secondary transition-colors"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </GlassCard>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
