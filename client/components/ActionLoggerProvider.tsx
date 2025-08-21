import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useActionLogger } from "@/lib/action-logger";
import { useDeadButtonScanner } from "@/lib/dead-button-scanner";
import { useLocation } from "react-router-dom";

interface ActionLoggerContextType {
  logClick: (
    elementId: string,
    elementType: string,
    additionalData?: any,
  ) => void;
  logSubmit: (formId: string, formData?: any) => void;
  logRouteChange: (fromRoute: string, toRoute: string) => void;
  logHandlerStart: (handlerName: string, data?: any) => string;
  logHandlerOk: (
    handlerId: string,
    handlerName: string,
    duration: number,
    data?: any,
  ) => void;
  logHandlerError: (
    handlerId: string,
    handlerName: string,
    error: Error,
    duration: number,
  ) => void;
  timer: () => { end: () => number };
}

const ActionLoggerContext = createContext<ActionLoggerContextType | null>(null);

interface ActionLoggerProviderProps {
  children: ReactNode;
  userId?: string | null;
}

export function ActionLoggerProvider({
  children,
  userId,
}: ActionLoggerProviderProps) {
  const baseLogger = useActionLogger();
  const scanner = useDeadButtonScanner();
  const location = useLocation();
  const prevLocationRef = React.useRef(location.pathname);

  // Set user ID when it changes
  useEffect(() => {
    baseLogger.setUserId(userId || undefined);
  }, [userId, baseLogger]);

  // Track route changes
  useEffect(() => {
    const prevLocation = prevLocationRef.current;
    const currentLocation = location.pathname;

    if (prevLocation !== currentLocation) {
      baseLogger.logRouteChange(prevLocation, currentLocation);

      // Delay scanner to avoid conflicts with React rendering
      const timer = setTimeout(() => {
        scanner.runOnRouteChange();
      }, 200); // Longer delay for route changes as they involve more DOM updates

      prevLocationRef.current = currentLocation;

      return () => clearTimeout(timer);
    }
  }, [location.pathname, baseLogger, scanner]);

  // Run scanner after initial render with delay to avoid React rendering conflicts
  useEffect(() => {
    const timer = setTimeout(() => {
      scanner.runAfterRender();
    }, 100); // Small delay to ensure React rendering is complete

    return () => clearTimeout(timer);
  }, [scanner]);

  const contextValue: ActionLoggerContextType = {
    logClick: (
      elementId: string,
      elementType: string,
      additionalData?: any,
    ) => {
      baseLogger.logClick(
        elementId,
        additionalData
          ? { ...additionalData, element_type: elementType }
          : { element_type: elementType },
      );
    },
    logSubmit: (formId: string, formData?: any) => {
      baseLogger.logSubmit(formId, formData);
    },
    logRouteChange: (fromRoute: string, toRoute: string) => {
      baseLogger.logRouteChange(fromRoute, toRoute);
    },
    logHandlerStart: baseLogger.logHandlerStart,
    logHandlerOk: baseLogger.logHandlerOk,
    logHandlerError: baseLogger.logHandlerError,
    timer: baseLogger.timer,
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
    throw new Error(
      "useActionLoggerContext must be used within an ActionLoggerProvider",
    );
  }
  return context;
}

// Higher-order component for wrapping handlers with logging
export function withActionLogging<T extends (...args: any[]) => any>(
  handler: T,
  actionName: string,
  component?: string,
): T {
  return React.useMemo(() => {
    return ((...args: any[]) => {
      const context = useActionLoggerContext();
      const timer = context.timer();
      const handlerId = context.logHandlerStart(actionName, { component });

      try {
        const result = handler(...args);

        if (result instanceof Promise) {
          return result
            .then((res) => {
              context.logHandlerOk(handlerId, actionName, timer.end());
              return res;
            })
            .catch((error) => {
              context.logHandlerError(
                handlerId,
                actionName,
                error,
                timer.end(),
              );
              throw error;
            });
        }

        context.logHandlerOk(handlerId, actionName, timer.end());
        return result;
      } catch (error) {
        context.logHandlerError(
          handlerId,
          actionName,
          error as Error,
          timer.end(),
        );
        throw error;
      }
    }) as T;
  }, [handler, actionName, component]);
}

// Hook for creating logged handlers
export function useLoggedHandlers() {
  const {
    logClick,
    logSubmit,
    logHandlerStart,
    logHandlerOk,
    logHandlerError,
    timer,
  } = useActionLoggerContext();

  const createClickHandler = React.useCallback(
    (
      elementId: string,
      elementType: string,
      handler: () => void | Promise<void>,
      additionalData?: any,
    ) => {
      return async () => {
        logClick(elementId, elementType, additionalData);
        const timerInstance = timer();
        const handlerId = logHandlerStart(`click_${elementId}`);

        try {
          await handler();
          logHandlerOk(handlerId, `click_${elementId}`, timerInstance.end());
        } catch (error) {
          logHandlerError(
            handlerId,
            `click_${elementId}`,
            error as Error,
            timerInstance.end(),
          );
          throw error;
        }
      };
    },
    [logClick, logHandlerStart, logHandlerOk, logHandlerError, timer],
  );

  const createSubmitHandler = React.useCallback(
    (formId: string, handler: (data: any) => void | Promise<void>) => {
      return async (data: any) => {
        logSubmit(formId, data);
        const timerInstance = timer();
        const handlerId = logHandlerStart(`submit_${formId}`);

        try {
          await handler(data);
          logHandlerOk(handlerId, `submit_${formId}`, timerInstance.end());
        } catch (error) {
          logHandlerError(
            handlerId,
            `submit_${formId}`,
            error as Error,
            timerInstance.end(),
          );
          throw error;
        }
      };
    },
    [logSubmit, logHandlerStart, logHandlerOk, logHandlerError, timer],
  );

  const createActionHandler = React.useCallback(
    (actionName: string, handler: (...args: any[]) => void | Promise<void>) => {
      return async (...args: any[]) => {
        const timerInstance = timer();
        const handlerId = logHandlerStart(actionName);

        try {
          await handler(...args);
          logHandlerOk(handlerId, actionName, timerInstance.end());
        } catch (error) {
          logHandlerError(
            handlerId,
            actionName,
            error as Error,
            timerInstance.end(),
          );
          throw error;
        }
      };
    },
    [logHandlerStart, logHandlerOk, logHandlerError, timer],
  );

  return {
    createClickHandler,
    createSubmitHandler,
    createActionHandler,
  };
}

// Component for automatically logging clicks on children
interface ClickLoggerProps {
  elementId: string;
  elementType: string;
  additionalData?: any;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ClickLogger({
  elementId,
  elementType,
  additionalData,
  children,
  className,
  onClick,
}: ClickLoggerProps) {
  const { logClick } = useActionLoggerContext();

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      logClick(elementId, elementType, {
        ...additionalData,
        target_element: event.currentTarget.tagName,
        timestamp: new Date().toISOString(),
      });

      if (onClick) {
        onClick();
      }
    },
    [logClick, elementId, elementType, additionalData, onClick],
  );

  return (
    <div
      onClick={handleClick}
      className={className}
      data-action={`click_${elementId}`}
    >
      {children}
    </div>
  );
}
