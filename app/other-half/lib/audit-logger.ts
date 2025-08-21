import { AuditLog } from '../types';
import { AUDIT_EVENTS } from './constants';

interface ActionContext {
  correlationId: string;
  sessionId: string;
  userId?: string;
  route: string;
  timestamp: string;
}

interface ActionResult {
  success: boolean;
  error?: Error;
  duration: number;
  data?: any;
}

class AuditLogger {
  private sessionId: string;
  private correlationIdCounter = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCorrelationId(): string {
    return `corr_${this.correlationIdCounter++}_${Date.now()}`;
  }

  private createContext(userId?: string): ActionContext {
    return {
      correlationId: this.generateCorrelationId(),
      sessionId: this.sessionId,
      userId,
      route: window.location.pathname,
      timestamp: new Date().toISOString()
    };
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    // Remove PII and sensitive data
    const sanitized = { ...data };
    const sensitiveFields = ['password', 'email', 'phone', 'ssn', 'credit_card'];
    
    const scrubObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowercaseKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowercaseKey.includes(field))) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          result[key] = scrubObject(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };

    return scrubObject(sanitized);
  }

  private async writeLog(eventType: string, eventData: any, context: ActionContext): Promise<void> {
    const logEntry: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: context.userId,
      session_id: context.sessionId,
      correlation_id: context.correlationId,
      event_type: eventType,
      event_data: this.sanitizeData(eventData),
      timestamp: context.timestamp,
      ip_address: undefined, // Would be set by server
      user_agent: navigator.userAgent
    };

    // In development, log to console with [audit] prefix
    console.log('[audit]', logEntry);

    // TODO: Send to backend audit service
    // await fetch('/api/audit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(logEntry)
    // });
  }

  // UI Event Logging
  logClick(elementId: string, elementType: string, additionalData?: any, userId?: string): void {
    const context = this.createContext(userId);
    this.writeLog(AUDIT_EVENTS.UI_CLICK, {
      element_id: elementId,
      element_type: elementType,
      ...additionalData
    }, context);
  }

  logSubmit(formId: string, formData?: any, userId?: string): void {
    const context = this.createContext(userId);
    this.writeLog(AUDIT_EVENTS.UI_SUBMIT, {
      form_id: formId,
      form_data: formData
    }, context);
  }

  logRouteChange(fromRoute: string, toRoute: string, userId?: string): void {
    const context = this.createContext(userId);
    this.writeLog(AUDIT_EVENTS.UI_ROUTE_CHANGE, {
      from_route: fromRoute,
      to_route: toRoute
    }, context);
  }

  logAnimationStart(animationType: string, elementId?: string, userId?: string): void {
    const context = this.createContext(userId);
    this.writeLog(AUDIT_EVENTS.UI_ANIM_START, {
      animation_type: animationType,
      element_id: elementId
    }, context);
  }

  logAnimationStop(animationType: string, elementId?: string, userId?: string): void {
    const context = this.createContext(userId);
    this.writeLog(AUDIT_EVENTS.UI_ANIM_STOP, {
      animation_type: animationType,
      element_id: elementId
    }, context);
  }

  // Network Event Logging
  logNetworkRequest(url: string, method: string, requestId: string, userId?: string): void {
    const context = this.createContext(userId);
    this.writeLog(AUDIT_EVENTS.NET_REQUEST, {
      url,
      method,
      request_id: requestId
    }, context);
  }

  logNetworkResponse(url: string, status: number, requestId: string, duration: number, userId?: string): void {
    const context = this.createContext(userId);
    this.writeLog(AUDIT_EVENTS.NET_RESPONSE, {
      url,
      status,
      request_id: requestId,
      duration
    }, context);
  }

  // Error Logging
  logErrorBoundary(error: Error, componentStack?: string, userId?: string): void {
    const context = this.createContext(userId);
    this.writeLog(AUDIT_EVENTS.ERROR_BOUNDARY, {
      error_message: error.message,
      error_stack: error.stack,
      component_stack: componentStack
    }, context);
  }

  logDeadButton(elementPath: string, outerHTML: string, userId?: string): void {
    const context = this.createContext(userId);
    this.writeLog(AUDIT_EVENTS.UI_CONTROL_WITHOUT_HANDLER, {
      element_path: elementPath,
      outer_html: outerHTML.substring(0, 200) // Limit size
    }, context);
  }

  // Admin Action Logging
  logAdminAction(actionType: string, targetId: string | null, details: any, adminId: string): void {
    const context = this.createContext(adminId);
    this.writeLog(AUDIT_EVENTS.ADMIN_ACTION, {
      action_type: actionType,
      target_id: targetId,
      details
    }, context);
  }

  // Action Handler Wrapper
  async wrapAction<T>(
    actionName: string,
    handler: () => Promise<T> | T,
    userId?: string
  ): Promise<T> {
    const context = this.createContext(userId);
    const startTime = performance.now();

    try {
      this.writeLog('action.start', { action_name: actionName }, context);
      
      const result = await handler();
      const duration = performance.now() - startTime;
      
      this.writeLog('action.success', {
        action_name: actionName,
        duration,
        has_result: result !== undefined
      }, context);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.writeLog('action.error', {
        action_name: actionName,
        duration,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      }, context);
      
      throw error;
    }
  }
}

// Global singleton instance
export const auditLogger = new AuditLogger();

// React hook for easy access
export const useActionLogger = () => {
  return {
    logClick: auditLogger.logClick.bind(auditLogger),
    logSubmit: auditLogger.logSubmit.bind(auditLogger),
    logRouteChange: auditLogger.logRouteChange.bind(auditLogger),
    wrapAction: auditLogger.wrapAction.bind(auditLogger)
  };
};
