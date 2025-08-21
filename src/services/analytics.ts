// src/services/analytics.ts
import type { Analytics, AnalyticsEvent, AnalyticsConfig } from "./types";
import fs from "fs/promises";
import path from "path";

// Real Analytics implementation (placeholder)
export class RealAnalytics implements Analytics {
  private config: AnalyticsConfig;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    // Initialize real analytics SDK here
  }

  async track(event: AnalyticsEvent): Promise<void> {
    // Implementation would use real analytics service
    console.log("📊 Real analytics track:", event.name);
  }

  async identify(userId: string, traits?: Record<string, any>): Promise<void> {
    // Implementation would use real analytics service
    console.log("📊 Real analytics identify:", userId);
  }

  async page(userId?: string, properties?: Record<string, any>): Promise<void> {
    // Implementation would use real analytics service
    console.log("📊 Real analytics page view:", userId);
  }
}

// Mock Analytics implementation
export class MockAnalytics implements Analytics {
  private analyticsDir: string;
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.analyticsDir = path.join(process.cwd(), ".analytics");
    this.ensureAnalyticsDir();
  }

  private async ensureAnalyticsDir() {
    try {
      await fs.access(this.analyticsDir);
    } catch {
      await fs.mkdir(this.analyticsDir, { recursive: true });
    }
  }

  async track(event: AnalyticsEvent): Promise<void> {
    const timestampedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
    };

    this.events.push(timestampedEvent);
    await this.persistEvent("track", timestampedEvent);

    console.log(`📊 Mock analytics tracked: ${event.name}`);
  }

  async identify(userId: string, traits?: Record<string, any>): Promise<void> {
    const event = {
      type: "identify",
      userId,
      traits,
      timestamp: Date.now(),
    };

    await this.persistEvent("identify", event);
    console.log(`📊 Mock analytics identified: ${userId}`);
  }

  async page(userId?: string, properties?: Record<string, any>): Promise<void> {
    const event = {
      type: "page",
      userId,
      properties,
      timestamp: Date.now(),
    };

    await this.persistEvent("page", event);
    console.log(`📊 Mock analytics page view: ${userId || "anonymous"}`);
  }

  private async persistEvent(type: string, event: any): Promise<void> {
    try {
      await this.ensureAnalyticsDir();
      const filename = `${type}-${Date.now()}.json`;
      const filepath = path.join(this.analyticsDir, filename);
      await fs.writeFile(filepath, JSON.stringify(event, null, 2));
    } catch (error) {
      console.error("Failed to persist analytics event:", error);
    }
  }

  // Mock-specific utility methods
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  async clearEvents(): Promise<void> {
    this.events = [];
    try {
      const files = await fs.readdir(this.analyticsDir);
      const deletePromises = files.map((file) =>
        fs.unlink(path.join(this.analyticsDir, file)),
      );
      await Promise.all(deletePromises);
      console.log("🗑️  Cleared analytics events");
    } catch (error) {
      console.error("Error clearing analytics:", error);
    }
  }
}
