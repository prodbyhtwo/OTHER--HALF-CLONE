import Stripe from 'stripe';

// Lazy-initialize Stripe to avoid config issues during module loading
let stripe: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripe = new Stripe(apiKey, {
      apiVersion: '2024-11-20.acacia',
    });
  }
  return stripe;
}

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

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plus_monthly',
    name: 'Plus Monthly',
    description: 'Enhanced dating experience',
    price: 999, // $9.99 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'Enhanced filters',
      'See who liked you',
      'Unlimited super likes',
      'Read receipts'
    ],
    stripePriceId: process.env.STRIPE_PLUS_MONTHLY_PRICE_ID || 'price_plus_monthly',
    tier: 'plus'
  },
  {
    id: 'plus_yearly',
    name: 'Plus Yearly',
    description: 'Enhanced dating experience (Save 20%)',
    price: 9599, // $95.99 in cents (2 months free)
    currency: 'usd',
    interval: 'year',
    features: [
      'Enhanced filters',
      'See who liked you',
      'Unlimited super likes',
      'Read receipts',
      '2 months free'
    ],
    stripePriceId: process.env.STRIPE_PLUS_YEARLY_PRICE_ID || 'price_plus_yearly',
    tier: 'plus'
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    description: 'Professional dating tools',
    price: 1999, // $19.99 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'All Plus features',
      'Priority placement',
      'Advanced analytics',
      'Incognito mode',
      'Message before matching'
    ],
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
    tier: 'pro'
  },
  {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    description: 'Professional dating tools (Save 25%)',
    price: 17999, // $179.99 in cents (3 months free)
    currency: 'usd',
    interval: 'year',
    features: [
      'All Plus features',
      'Priority placement',
      'Advanced analytics',
      'Incognito mode',
      'Message before matching',
      '3 months free'
    ],
    stripePriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
    tier: 'pro'
  },
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    description: 'Ultimate dating experience',
    price: 2999, // $29.99 in cents
    currency: 'usd',
    interval: 'month',
    features: [
      'All Pro features',
      'Exclusive events access',
      'Personal dating coach',
      'VIP customer support',
      'Profile boost weekly'
    ],
    stripePriceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_premium_monthly',
    tier: 'premium'
  },
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    description: 'Ultimate dating experience (Save 30%)',
    price: 25199, // $251.99 in cents (4 months free)
    currency: 'usd',
    interval: 'year',
    features: [
      'All Pro features',
      'Exclusive events access',
      'Personal dating coach',
      'VIP customer support',
      'Profile boost weekly',
      '4 months free'
    ],
    stripePriceId: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || 'price_premium_yearly',
    tier: 'premium'
  }
];

export class StripeService {
  private get stripe(): Stripe {
    return getStripeInstance();
  }

  /**
   * Create a new customer in Stripe
   */
  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata
    });
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(params: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
    trialPeriodDays?: number;
  }): Promise<Stripe.Checkout.Session> {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: params.customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
      subscription_data: {
        metadata: params.metadata,
      },
    };

    if (params.trialPeriodDays) {
      sessionParams.subscription_data!.trial_period_days = params.trialPeriodDays;
    }

    return await this.stripe.checkout.sessions.create(sessionParams);
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<Stripe.BillingPortal.Session> {
    return await this.stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
  }

  /**
   * Retrieve a subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Cancel a subscription at period end
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }

  /**
   * Resume a canceled subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
  }

  /**
   * Update subscription to new price
   */
  async updateSubscription(params: {
    subscriptionId: string;
    priceId: string;
    prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
  }): Promise<Stripe.Subscription> {
    const subscription = await this.getSubscription(params.subscriptionId);
    
    return await this.stripe.subscriptions.update(params.subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: params.priceId,
        },
      ],
      proration_behavior: params.prorationBehavior || 'create_prorations',
    });
  }

  /**
   * Construct webhook event from raw body and signature
   */
  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  /**
   * Get plan by price ID
   */
  getPlanByPriceId(priceId: string): SubscriptionPlan | undefined {
    return subscriptionPlans.find(plan => plan.stripePriceId === priceId);
  }

  /**
   * Get plan by plan ID
   */
  getPlanById(planId: string): SubscriptionPlan | undefined {
    return subscriptionPlans.find(plan => plan.id === planId);
  }

  /**
   * Get all plans
   */
  getAllPlans(): SubscriptionPlan[] {
    return subscriptionPlans;
  }

  /**
   * Get plans by tier
   */
  getPlansByTier(tier: 'plus' | 'pro' | 'premium'): SubscriptionPlan[] {
    return subscriptionPlans.filter(plan => plan.tier === tier);
  }
}

export const stripeService = new StripeService();
