// src/services/push-notifications.ts
import type {
  PushNotifications,
  PushNotification,
  NotificationResult,
  PushNotificationsConfig,
} from "./types";
import fs from "fs/promises";
import path from "path";

// Real Push Notifications implementation (placeholder)
export class RealPushNotifications implements PushNotifications {
  private config: PushNotificationsConfig;

  constructor(config: PushNotificationsConfig) {
    this.config = config;
    // Initialize real push notification service (Firebase, etc.)
  }

  async send(notification: PushNotification): Promise<NotificationResult> {
    // Implementation would use real push notification service
    console.log("🔔 Real push notification sent:", notification.title);
    return {
      success: true,
      messageId: `real_${Date.now()}`,
    };
  }

  async sendBatch(
    notifications: PushNotification[],
  ): Promise<NotificationResult[]> {
    return Promise.all(
      notifications.map((notification) => this.send(notification)),
    );
  }
}

// Mock Push Notifications implementation
export class MockPushNotifications implements PushNotifications {
  private notificationsDir: string;
  private notifications: (PushNotification & {
    id: string;
    timestamp: number;
  })[] = [];

  constructor() {
    this.notificationsDir = path.join(process.cwd(), ".notifications");
    this.ensureNotificationsDir();
  }

  private async ensureNotificationsDir() {
    try {
      await fs.access(this.notificationsDir);
    } catch {
      await fs.mkdir(this.notificationsDir, { recursive: true });
    }
  }

  async send(notification: PushNotification): Promise<NotificationResult> {
    try {
      const messageId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = Date.now();

      const storedNotification = {
        ...notification,
        id: messageId,
        timestamp,
      };

      this.notifications.push(storedNotification);
      await this.persistNotification(storedNotification);

      console.log(
        `🔔 Mock push notification sent: ${notification.title} (${messageId})`,
      );

      return {
        success: true,
        messageId,
      };
    } catch (error: any) {
      console.error("Mock push notification error:", error);
      return {
        success: false,
        error: error.message || "Failed to send mock notification",
      };
    }
  }

  async sendBatch(
    notifications: PushNotification[],
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];

    for (const notification of notifications) {
      const result = await this.send(notification);
      results.push(result);
    }

    return results;
  }

  private async persistNotification(notification: any): Promise<void> {
    try {
      await this.ensureNotificationsDir();
      const filename = `${notification.id}.json`;
      const filepath = path.join(this.notificationsDir, filename);
      await fs.writeFile(filepath, JSON.stringify(notification, null, 2));
    } catch (error) {
      console.error("Failed to persist notification:", error);
    }
  }

  // Mock-specific utility methods
  getNotifications(): (PushNotification & { id: string; timestamp: number })[] {
    return [...this.notifications];
  }

  async clearNotifications(): Promise<void> {
    this.notifications = [];
    try {
      const files = await fs.readdir(this.notificationsDir);
      const deletePromises = files.map((file) =>
        fs.unlink(path.join(this.notificationsDir, file)),
      );
      await Promise.all(deletePromises);
      console.log("🗑️  Cleared push notifications");
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  }

  async getNotificationById(
    id: string,
  ): Promise<(PushNotification & { id: string; timestamp: number }) | null> {
    return this.notifications.find((n) => n.id === id) || null;
  }
}
