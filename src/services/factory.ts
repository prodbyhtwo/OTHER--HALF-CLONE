// src/services/factory.ts
import { env } from "../env/server";
import type { 
  Mailer, 
  Payments, 
  Storage, 
  Analytics, 
  PushNotifications 
} from "./types";
import { RealMailer, MockMailer } from "./mailer";
import { RealPayments, MockPayments } from "./payments";
import { RealStorage, MockStorage } from "./storage";
import { RealAnalytics, MockAnalytics } from "./analytics";
import { RealPushNotifications, MockPushNotifications } from "./push-notifications";

// Singleton instances to avoid recreating services
let mailerInstance: Mailer | null = null;
let paymentsInstance: Payments | null = null;
let storageInstance: Storage | null = null;
let analyticsInstance: Analytics | null = null;
let pushNotificationsInstance: PushNotifications | null = null;

export function createMailer(): Mailer {
  if (mailerInstance) return mailerInstance;

  if (env.SAFE_MODE || !env.SENDGRID_API_KEY || !env.FROM_EMAIL) {
    console.log("📧 Using MockMailer (SAFE_MODE or missing SENDGRID_API_KEY/FROM_EMAIL)");
    mailerInstance = new MockMailer();
  } else {
    console.log("📧 Using RealMailer with SendGrid");
    mailerInstance = new RealMailer({
      apiKey: env.SENDGRID_API_KEY,
      from: {
        email: env.FROM_EMAIL,
        name: env.FROM_NAME || "OTHER HALF"
      }
    });
  }

  return mailerInstance;
}

export function createPayments(): Payments {
  if (paymentsInstance) return paymentsInstance;

  if (env.SAFE_MODE || !env.STRIPE_SECRET_KEY) {
    console.log("💳 Using MockPayments (SAFE_MODE or missing STRIPE_SECRET_KEY)");
    paymentsInstance = new MockPayments();
  } else {
    console.log("💳 Using RealPayments with Stripe");
    paymentsInstance = new RealPayments({
      secretKey: env.STRIPE_SECRET_KEY,
      webhookSecret: env.STRIPE_WEBHOOK_SECRET
    });
  }

  return paymentsInstance;
}

export function createStorage(): Storage {
  if (storageInstance) return storageInstance;

  if (env.SAFE_MODE || !env.STORAGE_BUCKET_NAME || !env.STORAGE_ACCESS_KEY) {
    console.log("🗄️  Using MockStorage (SAFE_MODE or missing storage credentials)");
    storageInstance = new MockStorage();
  } else {
    console.log("🗄️  Using RealStorage with S3");
    storageInstance = new RealStorage({
      bucketName: env.STORAGE_BUCKET_NAME,
      region: env.STORAGE_BUCKET_REGION || "us-east-1",
      accessKey: env.STORAGE_ACCESS_KEY,
      secretKey: env.STORAGE_SECRET_KEY!
    });
  }

  return storageInstance;
}

export function createAnalytics(): Analytics {
  if (analyticsInstance) return analyticsInstance;

  if (env.SAFE_MODE || !env.ANALYTICS_API_KEY) {
    console.log("📊 Using MockAnalytics (SAFE_MODE or missing ANALYTICS_API_KEY)");
    analyticsInstance = new MockAnalytics();
  } else {
    console.log("📊 Using RealAnalytics");
    analyticsInstance = new RealAnalytics({
      apiKey: env.ANALYTICS_API_KEY
    });
  }

  return analyticsInstance;
}

export function createPushNotifications(): PushNotifications {
  if (pushNotificationsInstance) return pushNotificationsInstance;

  if (env.SAFE_MODE || !env.PUSH_NOTIFICATION_SERVER_KEY) {
    console.log("🔔 Using MockPushNotifications (SAFE_MODE or missing PUSH_NOTIFICATION_SERVER_KEY)");
    pushNotificationsInstance = new MockPushNotifications();
  } else {
    console.log("🔔 Using RealPushNotifications");
    pushNotificationsInstance = new RealPushNotifications({
      serverKey: env.PUSH_NOTIFICATION_SERVER_KEY
    });
  }

  return pushNotificationsInstance;
}

// Convenience function to get all services
export function createServices() {
  return {
    mailer: createMailer(),
    payments: createPayments(),
    storage: createStorage(),
    analytics: createAnalytics(),
    pushNotifications: createPushNotifications(),
  };
}

// Reset function for testing
export function resetServices() {
  mailerInstance = null;
  paymentsInstance = null;
  storageInstance = null;
  analyticsInstance = null;
  pushNotificationsInstance = null;
}

// Service status check
export function getServiceStatus() {
  return {
    mailer: env.SAFE_MODE || !env.SENDGRID_API_KEY ? 'mock' : 'real',
    payments: env.SAFE_MODE || !env.STRIPE_SECRET_KEY ? 'mock' : 'real',
    storage: env.SAFE_MODE || !env.STORAGE_BUCKET_NAME ? 'mock' : 'real',
    analytics: env.SAFE_MODE || !env.ANALYTICS_API_KEY ? 'mock' : 'real',
    pushNotifications: env.SAFE_MODE || !env.PUSH_NOTIFICATION_SERVER_KEY ? 'mock' : 'real',
    safeMode: env.SAFE_MODE,
  };
}
