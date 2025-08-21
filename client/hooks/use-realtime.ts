// client/hooks/use-realtime.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "./use-auth";

export interface RealtimeUpdate {
  type:
    | "profile_update"
    | "settings_update"
    | "location_update"
    | "block_update";
  userId: string;
  data: any;
  timestamp: string;
}

export interface RealtimeHookOptions {
  types?: string[];
  autoConnect?: boolean;
  reconnectDelay?: number;
}

// Mock WebSocket implementation for development
class MockWebSocket {
  url: string;
  readyState: number = 1; // OPEN
  onopen?: (event: Event) => void;
  onmessage?: (event: MessageEvent) => void;
  onclose?: (event: CloseEvent) => void;
  onerror?: (event: Event) => void;

  private updateInterval?: NodeJS.Timeout;
  private subscriptions = new Set<string>();

  constructor(url: string) {
    this.url = url;

    // Simulate connection after a short delay
    setTimeout(() => {
      if (this.onopen) {
        this.onopen(new Event("open"));
      }

      // Start sending mock updates
      this.startMockUpdates();
    }, 100);
  }

  send(data: string): void {
    try {
      const message = JSON.parse(data);

      if (message.type === "subscribe") {
        this.subscriptions.add(message.userId);
        console.log(
          `🔔 [MOCK] Subscribed to updates for user ${message.userId}`,
        );

        // Send initial connection confirmation
        setTimeout(() => {
          if (this.onmessage) {
            this.onmessage(
              new MessageEvent("message", {
                data: JSON.stringify({
                  type: "profile_update",
                  userId: message.userId,
                  data: { status: "connected", mock: true },
                  timestamp: new Date().toISOString(),
                }),
              }),
            );
          }
        }, 50);
      } else if (message.type === "unsubscribe") {
        this.subscriptions.delete(message.userId);
        console.log(
          `🔕 [MOCK] Unsubscribed from updates for user ${message.userId}`,
        );
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  close(): void {
    this.readyState = 3; // CLOSED
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.onclose) {
      this.onclose(new CloseEvent("close"));
    }
  }

  private startMockUpdates(): void {
    // Send periodic mock updates for subscribed users
    this.updateInterval = setInterval(() => {
      this.subscriptions.forEach((userId) => {
        if (this.onmessage && Math.random() > 0.8) {
          // 20% chance of update
          const updateTypes = [
            "profile_update",
            "settings_update",
            "location_update",
          ];
          const randomType =
            updateTypes[Math.floor(Math.random() * updateTypes.length)];

          this.onmessage(
            new MessageEvent("message", {
              data: JSON.stringify({
                type: randomType,
                userId,
                data: {
                  mock: true,
                  random: Math.random(),
                  timestamp: new Date().toISOString(),
                },
                timestamp: new Date().toISOString(),
              }),
            }),
          );
        }
      });
    }, 5000); // Every 5 seconds
  }
}

export function useRealtime(
  userId: string | null,
  options: RealtimeHookOptions = {},
) {
  const { types, autoConnect = true, reconnectDelay = 5000 } = options;

  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<RealtimeUpdate | null>(null);
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const wsRef = useRef<WebSocket | MockWebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isReconnecting = useRef(false);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!userId || !user || isReconnecting.current) {
      return;
    }

    isReconnecting.current = true;
    clearReconnectTimer();

    try {
      // Use mock WebSocket in development/safe mode
      const isDevelopment =
        import.meta.env.DEV || import.meta.env.VITE_SAFE_MODE === "true";

      if (isDevelopment) {
        wsRef.current = new MockWebSocket("ws://localhost:mock/realtime");
      } else {
        const wsUrl =
          import.meta.env.VITE_REALTIME_WS_URL ||
          "wss://api.yourapp.com/realtime";
        wsRef.current = new WebSocket(wsUrl);
      }

      const ws = wsRef.current;

      ws.onopen = () => {
        console.log("🔗 Connected to realtime service");
        setIsConnected(true);
        isReconnecting.current = false;

        // Subscribe to updates for this user
        ws.send(
          JSON.stringify({
            type: "subscribe",
            userId,
            types,
          }),
        );
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const update: RealtimeUpdate = JSON.parse(event.data);

          // Filter by types if specified
          if (types && !types.includes(update.type)) {
            return;
          }

          console.log("📡 Received realtime update:", update);

          setLastUpdate(update);
          setUpdates((prev) => {
            const newUpdates = [update, ...prev.slice(0, 49)]; // Keep last 50 updates
            return newUpdates;
          });
        } catch (error) {
          console.error("Error parsing realtime message:", error);
        }
      };

      ws.onclose = () => {
        console.log("🔗 Disconnected from realtime service");
        setIsConnected(false);
        isReconnecting.current = false;

        // Schedule reconnection
        if (autoConnect) {
          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        isReconnecting.current = false;
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setIsConnected(false);
      isReconnecting.current = false;

      if (autoConnect) {
        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, reconnectDelay);
      }
    }
  }, [userId, user, types, autoConnect, reconnectDelay, clearReconnectTimer]);

  const disconnect = useCallback(() => {
    clearReconnectTimer();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    isReconnecting.current = false;
  }, [clearReconnectTimer]);

  const manualReconnect = useCallback(() => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 100);
  }, [disconnect, connect]);

  // Auto-connect when userId is available
  useEffect(() => {
    if (autoConnect && userId && user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, user, autoConnect, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearReconnectTimer();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [clearReconnectTimer]);

  return {
    isConnected,
    lastUpdate,
    updates,
    connect: manualReconnect,
    disconnect,
  };
}

// Hook for specific update types
export function useRealtimeUpdates(
  userId: string | null,
  updateTypes: string[],
) {
  const { lastUpdate, isConnected } = useRealtime(userId, {
    types: updateTypes,
    autoConnect: true,
  });

  const [updatesByType, setUpdatesByType] = useState<
    Record<string, RealtimeUpdate[]>
  >({});

  useEffect(() => {
    if (lastUpdate && updateTypes.includes(lastUpdate.type)) {
      setUpdatesByType((prev) => ({
        ...prev,
        [lastUpdate.type]: [
          lastUpdate,
          ...(prev[lastUpdate.type] || []).slice(0, 9),
        ],
      }));
    }
  }, [lastUpdate, updateTypes]);

  return {
    updatesByType,
    lastUpdate,
    isConnected,
  };
}

// Hook specifically for profile updates
export function useProfileUpdates(userId: string | null) {
  return useRealtimeUpdates(userId, ["profile_update"]);
}

// Hook specifically for settings updates
export function useSettingsUpdates(userId: string | null) {
  return useRealtimeUpdates(userId, ["settings_update"]);
}

// Hook for location updates
export function useLocationUpdates(userId: string | null) {
  return useRealtimeUpdates(userId, ["location_update"]);
}

// Hook for block/unblock updates
export function useBlockUpdates(userId: string | null) {
  return useRealtimeUpdates(userId, ["block_update"]);
}
