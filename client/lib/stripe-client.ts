import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.warn('Stripe publishable key not found');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  tier: 'plus' | 'pro' | 'premium';
}

export interface CreateCheckoutSessionParams {
  planId: string;
  userId: string;
  successUrl?: string;
  cancelUrl?: string;
  trialDays?: number;
}

export interface CreateBillingPortalParams {
  customerId: string;
  returnUrl?: string;
}

export class StripeClientService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/stripe';
  }

  /**
   * Fetch all subscription plans
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await fetch(`${this.baseUrl}/plans`);
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      const data = await response.json();
      return data.plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  }

  /**
   * Fetch plans by tier
   */
  async getPlansByTier(tier: 'plus' | 'pro' | 'premium'): Promise<SubscriptionPlan[]> {
    try {
      const response = await fetch(`${this.baseUrl}/plans/${tier}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${tier} plans`);
      }
      const data = await response.json();
      return data.plans;
    } catch (error) {
      console.error(`Error fetching ${tier} plans:`, error);
      throw error;
    }
  }

  /**
   * Create a checkout session and redirect to Stripe
   */
  async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<void> {
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const response = await fetch(`${this.baseUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: params.planId,
          userId: params.userId,
          successUrl: params.successUrl || `${window.location.origin}/subscription/success`,
          cancelUrl: params.cancelUrl || `${window.location.origin}/subscription/cancel`,
          trialDays: params.trialDays,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Create billing portal session and redirect
   */
  async openBillingPortal(params: CreateBillingPortalParams): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/create-billing-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: params.customerId,
          returnUrl: params.returnUrl || window.location.href,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create billing portal session');
      }

      const { url } = await response.json();

      // Redirect to Stripe billing portal
      window.location.href = url;
    } catch (error) {
      console.error('Error opening billing portal:', error);
      throw error;
    }
  }

  /**
   * Update subscription to new plan
   */
  async updateSubscription(subscriptionId: string, planId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/update-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          planId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription at period end
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Resume canceled subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/resume-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to resume subscription');
      }
    } catch (error) {
      console.error('Error resuming subscription:', error);
      throw error;
    }
  }

  /**
   * Format price for display
   */
  formatPrice(amount: number, currency: string = 'usd'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  /**
   * Get plan display name with billing cycle
   */
  getPlanDisplayName(plan: SubscriptionPlan): string {
    const price = this.formatPrice(plan.price, plan.currency);
    const period = plan.interval === 'month' ? 'month' : 'year';
    return `${plan.name} - ${price}/${period}`;
  }
}

export const stripeClientService = new StripeClientService();
