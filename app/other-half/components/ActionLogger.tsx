import React, { createContext, useContext, ReactNode } from 'react';
import { useActionLogger } from '../lib/audit-logger';
import { User } from '../types';

interface ActionLoggerContextType {
  logClick: (elementId: string, elementType: string, additionalData?: any) => void;
  logSubmit: (formId: string, formData?: any) => void;
  logRouteChange: (fromRoute: string, toRoute: string) => void;
  wrapAction: <T>(actionName: string, handler: () => Promise<T> | T) => Promise<T>;
}

const ActionLoggerContext = createContext<ActionLoggerContextType | null>(null);

interface ActionLoggerProviderProps {
  children: ReactNode;
  user?: User | null;
}

export function ActionLoggerProvider({ children, user }: ActionLoggerProviderProps) {
  const baseLogger = useActionLogger();

  const contextValue: ActionLoggerContextType = {
    logClick: (elementId: string, elementType: string, additionalData?: any) => {
      baseLogger.logClick(elementId, elementType, additionalData, user?.id);
    },
    logSubmit: (formId: string, formData?: any) => {
      baseLogger.logSubmit(formId, formData, user?.id);
    },
    logRouteChange: (fromRoute: string, toRoute: string) => {
      baseLogger.logRouteChange(fromRoute, toRoute, user?.id);
    },
    wrapAction: async <T,>(actionName: string, handler: () => Promise<T> | T) => {
      return baseLogger.wrapAction(actionName, handler, user?.id);
    }
  };

  return (
    <ActionLoggerContext.Provider value={contextValue}>
      {children}
    </ActionLoggerContext.Provider>
  );
}

export function useActionLoggerContext(): ActionLoggerContextType {
  const context = useContext(ActionLoggerContext);
  if (!context) {
    throw new Error('useActionLoggerContext must be used within an ActionLoggerProvider');
  }
  return context;
}

// Higher-order component for wrapping handlers with logging
export function withActionLogging<T extends (...args: any[]) => any>(
  handler: T,
  actionName: string
): T {
  return ((...args: any[]) => {
    const { wrapAction } = useActionLoggerContext();
    return wrapAction(actionName, () => handler(...args));
  }) as T;
}

// Hook for creating logged handlers
export function useLoggedHandlers() {
  const { logClick, logSubmit, wrapAction } = useActionLoggerContext();

  const createClickHandler = (
    elementId: string,
    elementType: string,
    handler: () => void | Promise<void>,
    additionalData?: any
  ) => {
    return async () => {
      logClick(elementId, elementType, additionalData);
      await wrapAction(`click_${elementId}`, handler);
    };
  };

  const createSubmitHandler = (
    formId: string,
    handler: (data: any) => void | Promise<void>
  ) => {
    return async (data: any) => {
      logSubmit(formId, data);
      await wrapAction(`submit_${formId}`, () => handler(data));
    };
  };

  const createActionHandler = (
    actionName: string,
    handler: (...args: any[]) => void | Promise<void>
  ) => {
    return async (...args: any[]) => {
      await wrapAction(actionName, () => handler(...args));
    };
  };

  return {
    createClickHandler,
    createSubmitHandler,
    createActionHandler,
    wrapAction
  };
}

// Component for automatically logging clicks on children
interface ClickLoggerProps {
  elementId: string;
  elementType: string;
  additionalData?: any;
  children: ReactNode;
  className?: string;
}

export function ClickLogger({ 
  elementId, 
  elementType, 
  additionalData, 
  children, 
  className 
}: ClickLoggerProps) {
  const { logClick } = useActionLoggerContext();

  const handleClick = (event: React.MouseEvent) => {
    logClick(elementId, elementType, {
      ...additionalData,
      target_element: event.currentTarget.tagName,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
}
