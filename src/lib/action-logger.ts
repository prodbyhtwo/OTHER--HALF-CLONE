/**
 * Action Logger for UI Observability
 * Emits structured logs for all user interactions and system events
 */

import { getRequiredEnvVar } from './env-guard';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type EventType = 
  | 'ui.click'
  | 'ui.submit' 
  | 'ui.route_change'
  | 'ui.form_validation'
  | 'net.request'
  | 'net.response'
  | 'error.boundary'
  | 'admin.action'
  | 'auth.login'
  | 'auth.logout'
  | 'subscription.change'
  | 'handler.start'
  | 'handler.ok'
  | 'handler.err';

export interface LogEvent {
  correlation_id: string;
  session_id: string;
  user_id?: string;
  event_type: EventType;
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  performance?: {
    duration_ms: number;
    memory_usage?: number;
  };
  context: {
    url: string;
    user_agent: string;
    component?: string;
    handler_name?: string;
    ip_address?: string;
  };
}

class ActionLogger {
  private correlationId: string;
  private sessionId: string;
  private userId?: string;
  private logLevel: LogLevel;
  private isProduction: boolean;
  private buffer: LogEvent[] = [];
  private flushInterval: number = 5000; // 5 seconds
  private maxBufferSize: number = 100;

  constructor() {
    this.correlationId = this.generateId();
    this.sessionId = this.getOrCreateSessionId();
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // Start buffer flush interval
    if (typeof window !== 'undefined') {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  private generateId(): string {
    return crypto.randomUUID ? crypto.randomUUID() : 
           `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return this.generateId();
    
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  setUserId(userId: string | undefined): void {
    this.userId = userId;
  }

  setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
  }

  /**
   * Log a UI click event
   */
  logClick(element: string, data?: Record<string, any>): void {
    this.log('ui.click', 'info', `User clicked ${element}`, {
      element,
      ...data
    });
  }

  /**
   * Log a form submission
   */
  logSubmit(form: string, data?: Record<string, any>): void {
    this.log('ui.submit', 'info', `Form submitted: ${form}`, {
      form,
      ...data
    });
  }

  /**
   * Log a route change
   */
  logRouteChange(from: string, to: string): void {
    this.log('ui.route_change', 'info', `Route changed from ${from} to ${to}`, {
      from,
      to
    });
  }

  /**
   * Log network request
   */
  logRequest(method: string, url: string, data?: Record<string, any>): string {
    const requestId = this.generateId();
    this.log('net.request', 'info', `${method} ${url}`, {
      method,
      url,
      request_id: requestId,
      ...data
    });
    return requestId;
  }

  /**
   * Log network response
   */
  logResponse(requestId: string, status: number, duration: number, data?: Record<string, any>): void {
    const level: LogLevel = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
    this.log('net.response', level, `Response ${status}`, {
      request_id: requestId,
      status,
      ...data
    }, undefined, { duration_ms: duration });
  }

  /**
   * Log handler start
   */
  logHandlerStart(handlerName: string, data?: Record<string, any>): string {
    const handlerId = this.generateId();
    this.log('handler.start', 'info', `Handler started: ${handlerName}`, {
      handler_name: handlerName,
      handler_id: handlerId,
      ...data
    });
    return handlerId;
  }

  /**
   * Log handler success
   */
  logHandlerOk(handlerId: string, handlerName: string, duration: number, data?: Record<string, any>): void {
    this.log('handler.ok', 'info', `Handler completed: ${handlerName}`, {
      handler_name: handlerName,
      handler_id: handlerId,
      ...data
    }, undefined, { duration_ms: duration });
  }

  /**
   * Log handler error
   */
  logHandlerError(handlerId: string, handlerName: string, error: Error, duration: number): void {
    this.log('handler.err', 'error', `Handler failed: ${handlerName}`, {
      handler_name: handlerName,
      handler_id: handlerId
    }, error, { duration_ms: duration });
  }

  /**
   * Log error boundary
   */
  logErrorBoundary(error: Error, componentStack?: string): void {
    this.log('error.boundary', 'error', 'Error boundary caught error', {
      component_stack: componentStack
    }, error);
  }

  /**
   * Log admin action
   */
  logAdminAction(action: string, target?: string, data?: Record<string, any>): void {
    this.log('admin.action', 'info', `Admin action: ${action}`, {
      action,
      target,
      ...data
    });
  }

  /**
   * Core logging method
   */
  private log(
    eventType: EventType,
    level: LogLevel,
    message: string,
    data?: Record<string, any>,
    error?: Error,
    performance?: { duration_ms: number; memory_usage?: number }
  ): void {
    // Check log level
    const levelPriority = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levelPriority[level] < levelPriority[this.logLevel]) {
      return;
    }

    const logEvent: LogEvent = {
      correlation_id: this.correlationId,
      session_id: this.sessionId,
      user_id: this.userId,
      event_type: eventType,
      timestamp: new Date().toISOString(),
      level,
      message,
      data: this.scrubPII(data),
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined,
      performance,
      context: {
        url: typeof window !== 'undefined' ? window.location.href : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        component: data?.component,
        handler_name: data?.handler_name
      }
    };

    // Add to buffer
    this.buffer.push(logEvent);

    // Console output in development
    if (!this.isProduction) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${eventType}] ${message}`, logEvent);
    }

    // Flush if buffer is full
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }

    // Immediately flush errors
    if (level === 'error') {
      this.flush();
    }
  }

  /**
   * Remove PII from log data
   */
  private scrubPII(data?: Record<string, any>): Record<string, any> | undefined {
    if (!data) return undefined;

    const scrubbed = { ...data };
    const piiFields = ['password', 'email', 'phone', 'ssn', 'credit_card', 'token', 'secret'];
    
    for (const field of piiFields) {
      if (scrubbed[field]) {
        scrubbed[field] = '[REDACTED]';
      }
    }

    return scrubbed;
  }

  /**
   * Flush buffered logs to server
   */
  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const logsToSend = [...this.buffer];
    this.buffer = [];

    try {
      // Send logs to analytics endpoint
      if (typeof fetch !== 'undefined') {
        await fetch('/api/analytics/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ logs: logsToSend })
        });
      }
    } catch (error) {
      // If sending fails, put logs back in buffer (up to a limit)
      this.buffer.unshift(...logsToSend.slice(0, this.maxBufferSize - this.buffer.length));
      
      if (!this.isProduction) {
        console.error('Failed to send logs:', error);
      }
    }
  }

  /**
   * Create a timer for measuring durations
   */
  timer(): { end: () => number } {
    const start = performance.now();
    return {
      end: () => performance.now() - start
    };
  }
}

// Global logger instance
export const actionLogger = new ActionLogger();

/**
 * React hook for action logging
 */
export function useActionLogger() {
  return {
    logClick: actionLogger.logClick.bind(actionLogger),
    logSubmit: actionLogger.logSubmit.bind(actionLogger),
    logRouteChange: actionLogger.logRouteChange.bind(actionLogger),
    logRequest: actionLogger.logRequest.bind(actionLogger),
    logResponse: actionLogger.logResponse.bind(actionLogger),
    logHandlerStart: actionLogger.logHandlerStart.bind(actionLogger),
    logHandlerOk: actionLogger.logHandlerOk.bind(actionLogger),
    logHandlerError: actionLogger.logHandlerError.bind(actionLogger),
    logErrorBoundary: actionLogger.logErrorBoundary.bind(actionLogger),
    logAdminAction: actionLogger.logAdminAction.bind(actionLogger),
    timer: actionLogger.timer.bind(actionLogger),
    setUserId: actionLogger.setUserId.bind(actionLogger)
  };
}

/**
 * Higher-order component for automatic handler logging
 */
export function withActionLogging<T extends (...args: any[]) => any>(
  handlerName: string,
  handler: T,
  component?: string
): T {
  return ((...args: any[]) => {
    const timer = actionLogger.timer();
    const handlerId = actionLogger.logHandlerStart(handlerName, { component });

    try {
      const result = handler(...args);
      
      // Handle async handlers
      if (result instanceof Promise) {
        return result
          .then((res) => {
            actionLogger.logHandlerOk(handlerId, handlerName, timer.end());
            return res;
          })
          .catch((error) => {
            actionLogger.logHandlerError(handlerId, handlerName, error, timer.end());
            throw error;
          });
      }
      
      actionLogger.logHandlerOk(handlerId, handlerName, timer.end());
      return result;
    } catch (error) {
      actionLogger.logHandlerError(handlerId, handlerName, error as Error, timer.end());
      throw error;
    }
  }) as T;
}
