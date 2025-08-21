import React, { Component, ErrorInfo, ReactNode } from 'react';
import { auditLogger } from '../lib/audit-logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error to audit system
    auditLogger.logErrorBoundary(error, errorInfo.componentStack);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console for development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    auditLogger.logClick('error-boundary-reload', 'button', {
      error_id: this.state.errorId,
      action: 'reload'
    });
    
    window.location.reload();
  };

  handleGoHome = () => {
    auditLogger.logClick('error-boundary-home', 'button', {
      error_id: this.state.errorId,
      action: 'go_home'
    });
    
    window.location.href = '/';
  };

  handleReset = () => {
    auditLogger.logClick('error-boundary-reset', 'button', {
      error_id: this.state.errorId,
      action: 'reset'
    });
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI with faith-based styling
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4 faith-background">
          <div className="faith-symbols">
            <div className="faith-symbol cross-1">✝</div>
            <div className="faith-symbol heart-1">💛</div>
          </div>
          
          <Card className="max-w-lg w-full faith-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-error-50 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-error-500" />
              </div>
              <CardTitle className="text-2xl font-semibold text-neutral-900">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-neutral-600">
                We encountered an unexpected error. Don't worry - your data is safe, 
                and our team has been notified.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bible-verse text-center">
                "And we know that in all things God works for the good of those who love him."
                <div className="text-sm text-neutral-500 mt-2">— Romans 8:28</div>
              </div>

              {/* Development error details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-neutral-50 p-4 rounded-lg">
                  <summary className="cursor-pointer font-medium text-neutral-700 mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="text-sm text-neutral-600 space-y-2">
                    <div>
                      <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                    <div>
                      <strong>Message:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 text-xs bg-neutral-100 p-2 rounded overflow-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 text-xs bg-neutral-100 p-2 rounded overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  className="flex-1 btn-primary"
                  aria-label="Try again"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1 btn-secondary"
                  aria-label="Reload page"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 btn-secondary"
                  aria-label="Go to homepage"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <div className="text-center text-sm text-neutral-500">
                <p>
                  If this problem persists, please contact our support team.
                  <br />
                  Reference ID: <code className="bg-neutral-100 px-1 rounded text-xs">
                    {this.state.errorId}
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={errorFallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error handling in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    auditLogger.logErrorBoundary(error, errorInfo?.componentStack);
    throw error; // Re-throw to be caught by ErrorBoundary
  };
}
