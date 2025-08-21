// src/services/realtime.ts
import { isSafeMode } from "../env/server";

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

export interface RealtimeSubscription {
  userId: string;
  callback: (update: RealtimeUpdate) => void;
  types?: string[];
}

// Mock implementation for SAFE_MODE
class MockRealtimeService {
  private subscriptions: Map<string, RealtimeSubscription[]> = new Map();
  private updateQueue: RealtimeUpdate[] = [];

  subscribe(subscription: RealtimeSubscription): () => void {
    const userId = subscription.userId;
    const subs = this.subscriptions.get(userId) || [];
    subs.push(subscription);
    this.subscriptions.set(userId, subs);

    console.log(`🔔 [MOCK] Subscribed to realtime updates for user ${userId}`);

    // Simulate immediate update with current data
    setTimeout(() => {
      this.publishUpdate({
        type: "profile_update",
        userId,
        data: { status: "connected", mock: true },
        timestamp: new Date().toISOString(),
      });
    }, 100);

    // Return unsubscribe function
    return () => {
      const currentSubs = this.subscriptions.get(userId) || [];
      const filteredSubs = currentSubs.filter((s) => s !== subscription);
      this.subscriptions.set(userId, filteredSubs);
      console.log(
        `🔕 [MOCK] Unsubscribed from realtime updates for user ${userId}`,
      );
    };
  }

  publishUpdate(update: RealtimeUpdate): void {
    const subscribers = this.subscriptions.get(update.userId) || [];

    console.log(`📡 [MOCK] Publishing update:`, {
      type: update.type,
      userId: update.userId,
      subscribers: subscribers.length,
    });

    subscribers.forEach((subscription) => {
      // Filter by update types if specified
      if (subscription.types && !subscription.types.includes(update.type)) {
        return;
      }

      try {
        subscription.callback(update);
      } catch (error) {
        console.error(
          `Error in realtime callback for user ${update.userId}:`,
          error,
        );
      }
    });

    // Store in queue for debugging
    this.updateQueue.push(update);
    if (this.updateQueue.length > 100) {
      this.updateQueue.shift();
    }
  }

  getUpdateHistory(userId: string): RealtimeUpdate[] {
    return this.updateQueue.filter((update) => update.userId === userId);
  }

  async publishProfileUpdate(userId: string, profileData: any): Promise<void> {
    this.publishUpdate({
      type: "profile_update",
      userId,
      data: profileData,
      timestamp: new Date().toISOString(),
    });
  }

  async publishSettingsUpdate(
    userId: string,
    settingsData: any,
  ): Promise<void> {
    this.publishUpdate({
      type: "settings_update",
      userId,
      data: settingsData,
      timestamp: new Date().toISOString(),
    });
  }

  async publishLocationUpdate(
    userId: string,
    locationData: any,
  ): Promise<void> {
    this.publishUpdate({
      type: "location_update",
      userId,
      data: locationData,
      timestamp: new Date().toISOString(),
    });
  }

  async publishBlockUpdate(
    blockerId: string,
    blockedId: string,
    action: "blocked" | "unblocked",
  ): Promise<void> {
    // Notify the blocker
    this.publishUpdate({
      type: "block_update",
      userId: blockerId,
      data: { targetUserId: blockedId, action },
      timestamp: new Date().toISOString(),
    });

    // Notify the blocked user (they should be removed from feeds, etc.)
    this.publishUpdate({
      type: "block_update",
      userId: blockedId,
      data: { blockedBy: blockerId, action },
      timestamp: new Date().toISOString(),
    });
  }

  getStatus(): { status: string; subscribers: number; updateHistory: number } {
    const totalSubscribers = Array.from(this.subscriptions.values()).reduce(
      (total, subs) => total + subs.length,
      0,
    );

    return {
      status: "mock",
      subscribers: totalSubscribers,
      updateHistory: this.updateQueue.length,
    };
  }
}

// Real WebSocket implementation for production
class WebSocketRealtimeService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, RealtimeSubscription[]> = new Map();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;

  constructor(
    private wsUrl: string,
    private authToken: string,
  ) {
    this.connect();
  }

  private connect(): void {
    if (
      this.isConnecting ||
      (this.ws && this.ws.readyState === WebSocket.OPEN)
    ) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.wsUrl, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      this.ws.onopen = () => {
        console.log("🔗 Connected to realtime service");
        this.isConnecting = false;

        // Resubscribe to all existing subscriptions
        for (const [userId, subs] of this.subscriptions.entries()) {
          if (subs.length > 0) {
            this.sendSubscribeMessage(userId);
          }
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const update: RealtimeUpdate = JSON.parse(event.data);
          this.handleUpdate(update);
        } catch (error) {
          console.error("Error parsing realtime message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("🔗 Disconnected from realtime service");
        this.isConnecting = false;
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 5000); // Retry every 5 seconds
  }

  private sendSubscribeMessage(userId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "subscribe",
          userId,
        }),
      );
    }
  }

  private sendUnsubscribeMessage(userId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "unsubscribe",
          userId,
        }),
      );
    }
  }

  private handleUpdate(update: RealtimeUpdate): void {
    const subscribers = this.subscriptions.get(update.userId) || [];

    subscribers.forEach((subscription) => {
      if (subscription.types && !subscription.types.includes(update.type)) {
        return;
      }

      try {
        subscription.callback(update);
      } catch (error) {
        console.error(
          `Error in realtime callback for user ${update.userId}:`,
          error,
        );
      }
    });
  }

  subscribe(subscription: RealtimeSubscription): () => void {
    const userId = subscription.userId;
    const subs = this.subscriptions.get(userId) || [];
    subs.push(subscription);
    this.subscriptions.set(userId, subs);

    // If this is the first subscription for this user, send subscribe message
    if (subs.length === 1) {
      this.sendSubscribeMessage(userId);
    }

    // Return unsubscribe function
    return () => {
      const currentSubs = this.subscriptions.get(userId) || [];
      const filteredSubs = currentSubs.filter((s) => s !== subscription);

      if (filteredSubs.length === 0) {
        this.subscriptions.delete(userId);
        this.sendUnsubscribeMessage(userId);
      } else {
        this.subscriptions.set(userId, filteredSubs);
      }
    };
  }

  async publishProfileUpdate(userId: string, profileData: any): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "publish",
          update: {
            type: "profile_update",
            userId,
            data: profileData,
            timestamp: new Date().toISOString(),
          },
        }),
      );
    }
  }

  async publishSettingsUpdate(
    userId: string,
    settingsData: any,
  ): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "publish",
          update: {
            type: "settings_update",
            userId,
            data: settingsData,
            timestamp: new Date().toISOString(),
          },
        }),
      );
    }
  }

  async publishLocationUpdate(
    userId: string,
    locationData: any,
  ): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "publish",
          update: {
            type: "location_update",
            userId,
            data: locationData,
            timestamp: new Date().toISOString(),
          },
        }),
      );
    }
  }

  async publishBlockUpdate(
    blockerId: string,
    blockedId: string,
    action: "blocked" | "unblocked",
  ): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "publish",
          update: {
            type: "block_update",
            userId: blockerId,
            data: { targetUserId: blockedId, action },
            timestamp: new Date().toISOString(),
          },
        }),
      );
    }
  }

  getStatus(): { status: string; connected: boolean; subscribers: number } {
    const totalSubscribers = Array.from(this.subscriptions.values()).reduce(
      (total, subs) => total + subs.length,
      0,
    );

    return {
      status: "websocket",
      connected: this.ws?.readyState === WebSocket.OPEN,
      subscribers: totalSubscribers,
    };
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.subscriptions.clear();
  }
}

// Factory function
export function createRealtimeService():
  | MockRealtimeService
  | WebSocketRealtimeService {
  if (isSafeMode) {
    return new MockRealtimeService();
  } else {
    // In production, these would come from environment variables
    const wsUrl =
      process.env.REALTIME_WS_URL || "wss://api.yourapp.com/realtime";
    const authToken = process.env.REALTIME_AUTH_TOKEN || "";
    return new WebSocketRealtimeService(wsUrl, authToken);
  }
}

// Export singleton instance
export const realtimeService = createRealtimeService();
