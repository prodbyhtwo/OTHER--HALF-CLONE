// src/services/index.ts
export * from "./types";
export * from "./factory";
export * from "./mailer";
export * from "./payments";
export * from "./storage";
export * from "./analytics";
export * from "./push-notifications";

// Convenience re-exports for the most commonly used items
export {
  createMailer,
  createPayments,
  createStorage,
  createAnalytics,
  createPushNotifications,
  createServices,
  getServiceStatus,
} from "./factory";

export type {
  Mailer,
  Payments,
  Storage,
  Analytics,
  PushNotifications,
  EmailMessage,
  CheckoutSessionData,
  StorageFile,
  AnalyticsEvent,
  PushNotification,
} from "./types";
