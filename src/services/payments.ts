// src/services/payments.ts
import type {
  Payments,
  CheckoutSessionData,
  CheckoutSession,
  WebhookEvent,
  PaymentIntent,
  Subscription,
  PaymentsConfig,
} from "./types";
import { env } from "../env/server";

// Real Stripe implementation
export class RealPayments implements Payments {
  private stripe: any;
  private webhookSecret?: string;

  constructor(config: PaymentsConfig) {
    try {
      const Stripe = require("stripe");
      this.stripe = new Stripe(config.secretKey, {
        apiVersion: "2023-10-16",
      });
      this.webhookSecret = config.webhookSecret;
    } catch (error) {
      console.warn("⚠️  Stripe not installed, falling back to mock");
      throw new Error("Stripe package not available");
    }
  }

  async createCheckoutSession(
    data: CheckoutSessionData,
  ): Promise<CheckoutSession> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: data.priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        customer_email: data.userEmail,
        metadata: {
          userId: data.userId,
          ...data.metadata,
        },
      });

      return {
        id: session.id,
        url: session.url!,
        status: "pending",
        metadata: session.metadata,
      };
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      throw new Error(`Failed to create checkout session: ${error.message}`);
    }
  }

  async retrieveCheckoutSession(
    sessionId: string,
  ): Promise<CheckoutSession | null> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      return {
        id: session.id,
        url: session.url || "",
        status: session.payment_status === "paid" ? "completed" : "pending",
        metadata: session.metadata,
      };
    } catch (error) {
      console.error("Failed to retrieve checkout session:", error);
      return null;
    }
  }

  async handleWebhook(
    payload: string,
    signature: string,
  ): Promise<WebhookEvent> {
    if (!this.webhookSecret) {
      throw new Error("Webhook secret not configured");
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret,
      );

      return {
        id: event.id,
        type: event.type,
        data: event.data,
        created: event.created,
      };
    } catch (error: any) {
      console.error("Webhook signature verification failed:", error);
      throw new Error(`Webhook verification failed: ${error.message}`);
    }
  }

  async createCustomer(
    email: string,
    metadata?: Record<string, string>,
  ): Promise<{ id: string }> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        metadata,
      });

      return { id: customer.id };
    } catch (error: any) {
      console.error("Failed to create customer:", error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    try {
      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);

      return {
        id: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        priceId: subscription.items.data[0]?.price?.id || "",
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        metadata: subscription.metadata,
      };
    } catch (error) {
      console.error("Failed to retrieve subscription:", error);
      return null;
    }
  }

  async cancelSubscription(
    subscriptionId: string,
  ): Promise<{ success: boolean }> {
    try {
      await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      return { success: false };
    }
  }
}

// Mock implementation with local state simulation
export class MockPayments implements Payments {
  private sessions: Map<string, CheckoutSession> = new Map();
  private customers: Map<
    string,
    { id: string; email: string; metadata?: Record<string, string> }
  > = new Map();
  private subscriptions: Map<string, Subscription> = new Map();

  async createCheckoutSession(
    data: CheckoutSessionData,
  ): Promise<CheckoutSession> {
    const sessionId = `cs_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockUrl = `${env.FRONTEND_URL}/checkout/mock?session=${sessionId}`;

    const session: CheckoutSession = {
      id: sessionId,
      url: mockUrl,
      status: "pending",
      metadata: {
        userId: data.userId,
        userEmail: data.userEmail,
        priceId: data.priceId,
        ...data.metadata,
      },
    };

    this.sessions.set(sessionId, session);

    console.log(`💳 Mock checkout session created: ${sessionId}`);
    console.log(`💳 Mock checkout URL: ${mockUrl}`);

    return session;
  }

  async retrieveCheckoutSession(
    sessionId: string,
  ): Promise<CheckoutSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  async handleWebhook(
    payload: string,
    signature: string,
  ): Promise<WebhookEvent> {
    // Mock webhook handling - parse JSON payload
    let data;
    try {
      data = JSON.parse(payload);
    } catch {
      throw new Error("Invalid webhook payload");
    }

    // In SAFE_MODE, we accept any signature
    const event: WebhookEvent = {
      id: `evt_mock_${Date.now()}`,
      type: data.type || "checkout.session.completed",
      data: data.data || data,
      created: Math.floor(Date.now() / 1000),
    };

    console.log(`🔗 Mock webhook received: ${event.type}`);

    // Simulate some common webhook processing
    if (event.type === "checkout.session.completed" && event.data.id) {
      const session = this.sessions.get(event.data.id);
      if (session) {
        session.status = "completed";
        this.sessions.set(event.data.id, session);
      }
    }

    return event;
  }

  async createCustomer(
    email: string,
    metadata?: Record<string, string>,
  ): Promise<{ id: string }> {
    const customerId = `cus_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.customers.set(customerId, {
      id: customerId,
      email,
      metadata,
    });

    console.log(`👤 Mock customer created: ${customerId} (${email})`);

    return { id: customerId };
  }

  async getSubscription(subscriptionId: string): Promise<Subscription | null> {
    return this.subscriptions.get(subscriptionId) || null;
  }

  async cancelSubscription(
    subscriptionId: string,
  ): Promise<{ success: boolean }> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.status = "canceled";
      this.subscriptions.set(subscriptionId, subscription);
      console.log(`❌ Mock subscription canceled: ${subscriptionId}`);
      return { success: true };
    }
    return { success: false };
  }

  // Mock-specific helper methods
  mockCompleteCheckout(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = "completed";
      this.sessions.set(sessionId, session);

      // Create a mock subscription
      const subscriptionId = `sub_mock_${Date.now()}`;
      const subscription: Subscription = {
        id: subscriptionId,
        customerId: session.metadata?.userId || "unknown",
        status: "active",
        priceId: session.metadata?.priceId || "price_mock",
        currentPeriodStart: Math.floor(Date.now() / 1000),
        currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
        metadata: session.metadata,
      };

      this.subscriptions.set(subscriptionId, subscription);
      console.log(
        `✅ Mock checkout completed: ${sessionId} -> ${subscriptionId}`,
      );
      return true;
    }
    return false;
  }

  // Get current state for debugging
  getState() {
    return {
      sessions: Array.from(this.sessions.entries()),
      customers: Array.from(this.customers.entries()),
      subscriptions: Array.from(this.subscriptions.entries()),
    };
  }

  // Clear state for testing
  clearState() {
    this.sessions.clear();
    this.customers.clear();
    this.subscriptions.clear();
    console.log("🗑️  Mock payments state cleared");
  }
}

// Export both for convenience
export { RealPayments as Payments };
