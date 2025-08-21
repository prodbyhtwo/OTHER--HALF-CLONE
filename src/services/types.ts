// src/services/types.ts

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: {
    email: string;
    name: string;
  };
}

export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface Mailer {
  send(message: EmailMessage): Promise<EmailDeliveryResult>;
  sendBatch(messages: EmailMessage[]): Promise<EmailDeliveryResult[]>;
}

export interface CheckoutSessionData {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  id: string;
  url: string;
  status: "pending" | "completed" | "expired";
  metadata?: Record<string, string>;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  created: number;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  metadata?: Record<string, string>;
}

export interface Subscription {
  id: string;
  customerId: string;
  status: string;
  priceId: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  metadata?: Record<string, string>;
}

export interface Payments {
  createCheckoutSession(data: CheckoutSessionData): Promise<CheckoutSession>;
  retrieveCheckoutSession(sessionId: string): Promise<CheckoutSession | null>;
  handleWebhook(payload: string, signature: string): Promise<WebhookEvent>;
  createCustomer(
    email: string,
    metadata?: Record<string, string>,
  ): Promise<{ id: string }>;
  getSubscription(subscriptionId: string): Promise<Subscription | null>;
  cancelSubscription(subscriptionId: string): Promise<{ success: boolean }>;
}

export interface StorageFile {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export interface StorageUploadResult {
  success: boolean;
  file?: StorageFile;
  error?: string;
}

export interface Storage {
  upload(
    file: Buffer,
    key: string,
    contentType: string,
  ): Promise<StorageUploadResult>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  delete(key: string): Promise<{ success: boolean }>;
  list(prefix?: string): Promise<StorageFile[]>;
}

export interface AnalyticsEvent {
  name: string;
  userId?: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface Analytics {
  track(event: AnalyticsEvent): Promise<void>;
  identify(userId: string, traits?: Record<string, any>): Promise<void>;
  page(userId?: string, properties?: Record<string, any>): Promise<void>;
}

export interface PushNotification {
  to: string | string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface PushNotifications {
  send(notification: PushNotification): Promise<NotificationResult>;
  sendBatch(notifications: PushNotification[]): Promise<NotificationResult[]>;
}

// Configuration types for service initialization
export interface MailerConfig {
  apiKey: string;
  from: {
    email: string;
    name: string;
  };
}

export interface PaymentsConfig {
  secretKey: string;
  webhookSecret?: string;
}

export interface StorageConfig {
  bucketName: string;
  region: string;
  accessKey: string;
  secretKey: string;
}

export interface AnalyticsConfig {
  apiKey: string;
  projectId?: string;
}

export interface PushNotificationsConfig {
  serverKey: string;
}

// Service factory interface
export interface ServiceFactory {
  createMailer(): Mailer;
  createPayments(): Payments;
  createStorage(): Storage;
  createAnalytics(): Analytics;
  createPushNotifications(): PushNotifications;
}
