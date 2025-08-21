import { Router } from 'express';
import { stripeService, SubscriptionPlan } from '../lib/stripe';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createCheckoutSessionSchema = z.object({
  planId: z.string(),
  userId: z.string(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  trialDays: z.number().optional()
});

const createBillingPortalSchema = z.object({
  customerId: z.string(),
  returnUrl: z.string().url()
});

const updateSubscriptionSchema = z.object({
  subscriptionId: z.string(),
  planId: z.string()
});

/**
 * GET /api/stripe/plans
 * Get all subscription plans
 */
router.get('/plans', (req, res) => {
  try {
    const plans = stripeService.getAllPlans();
    res.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

/**
 * GET /api/stripe/plans/:tier
 * Get plans by tier (plus, pro, premium)
 */
router.get('/plans/:tier', (req, res) => {
  try {
    const tier = req.params.tier as 'plus' | 'pro' | 'premium';
    
    if (!['plus', 'pro', 'premium'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    const plans = stripeService.getPlansByTier(tier);
    res.json({ plans });
  } catch (error) {
    console.error('Error fetching plans by tier:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

/**
 * POST /api/stripe/create-checkout-session
 * Create a Stripe checkout session
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const body = createCheckoutSessionSchema.parse(req.body);
    const plan = stripeService.getPlanById(body.planId);

    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // TODO: Get user from database
    const user = {
      id: body.userId,
      email: 'user@example.com', // This should come from your user system
      name: 'User Name'
    };

    // Create or get existing Stripe customer
    let customerId: string;
    try {
      // TODO: Check if customer already exists in your database
      const customer = await stripeService.createCustomer({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id
        }
      });
      customerId = customer.id;
    } catch (error) {
      console.error('Error creating customer:', error);
      return res.status(500).json({ error: 'Failed to create customer' });
    }

    // Create checkout session
    const session = await stripeService.createCheckoutSession({
      customerId,
      priceId: plan.stripePriceId,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
      trialPeriodDays: body.trialDays,
      metadata: {
        userId: body.userId,
        planId: body.planId
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * POST /api/stripe/create-billing-portal
 * Create a Stripe billing portal session
 */
router.post('/create-billing-portal', async (req, res) => {
  try {
    const body = createBillingPortalSchema.parse(req.body);

    const session = await stripeService.createBillingPortalSession({
      customerId: body.customerId,
      returnUrl: body.returnUrl
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create billing portal session' });
  }
});

/**
 * POST /api/stripe/update-subscription
 * Update an existing subscription to a new plan
 */
router.post('/update-subscription', async (req, res) => {
  try {
    const body = updateSubscriptionSchema.parse(req.body);
    const plan = stripeService.getPlanById(body.planId);

    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    const subscription = await stripeService.updateSubscription({
      subscriptionId: body.subscriptionId,
      priceId: plan.stripePriceId
    });

    res.json({ subscription: subscription.id });
  } catch (error) {
    console.error('Error updating subscription:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

/**
 * POST /api/stripe/cancel-subscription
 * Cancel a subscription at period end
 */
router.post('/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    const subscription = await stripeService.cancelSubscription(subscriptionId);
    res.json({ subscription: subscription.id, cancelAtPeriodEnd: subscription.cancel_at_period_end });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

/**
 * POST /api/stripe/resume-subscription
 * Resume a canceled subscription
 */
router.post('/resume-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    const subscription = await stripeService.resumeSubscription(subscriptionId);
    res.json({ subscription: subscription.id, cancelAtPeriodEnd: subscription.cancel_at_period_end });
  } catch (error) {
    console.error('Error resuming subscription:', error);
    res.status(500).json({ error: 'Failed to resume subscription' });
  }
});

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhooks
 */
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    // Construct the event
    const event = stripeService.constructWebhookEvent(
      req.body,
      signature,
      webhookSecret
    );

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await handleSubscriptionEvent(subscription, event.type);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        await handlePaymentSucceeded(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        await handlePaymentFailed(invoice);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook handler failed' });
  }
});

// Helper functions for webhook handling
async function handleSubscriptionEvent(subscription: any, eventType: string) {
  try {
    const userId = subscription.metadata?.userId;
    const plan = stripeService.getPlanByPriceId(subscription.items.data[0].price.id);

    if (!userId || !plan) {
      console.error('Missing userId or plan in subscription event');
      return;
    }

    // TODO: Update subscription in database
    const subscriptionData = {
      user_id: userId,
      provider: 'stripe',
      customer_id: subscription.customer,
      subscription_id: subscription.id,
      status: mapStripeStatus(subscription.status),
      price_id: subscription.items.data[0].price.id,
      current_tier: plan.tier,
      billing_cycle: plan.interval === 'month' ? 'monthly' : 'annual',
      amount: subscription.items.data[0].price.unit_amount,
      currency: subscription.items.data[0].price.currency,
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      started_at: new Date(subscription.start_date * 1000),
      renews_at: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
      ends_at: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      metadata: subscription.metadata
    };

    console.log(`Subscription ${eventType}:`, subscriptionData);
    
    // TODO: Implement database update logic
    // await updateSubscriptionInDatabase(subscriptionData);
  } catch (error) {
    console.error('Error handling subscription event:', error);
  }
}

async function handlePaymentSucceeded(invoice: any) {
  try {
    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;
    
    console.log(`Payment succeeded for subscription ${subscriptionId}`);
    
    // TODO: Log successful payment in database
    // await logPaymentEvent(subscriptionId, 'success', invoice);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: any) {
  try {
    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;
    
    console.log(`Payment failed for subscription ${subscriptionId}`);
    
    // TODO: Log failed payment and handle dunning
    // await logPaymentEvent(subscriptionId, 'failed', invoice);
    // await handleFailedPayment(subscriptionId);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

function mapStripeStatus(stripeStatus: string): string {
  const statusMap: Record<string, string> = {
    'active': 'active',
    'canceled': 'canceled',
    'incomplete': 'incomplete',
    'incomplete_expired': 'canceled',
    'past_due': 'past_due',
    'trialing': 'trialing',
    'unpaid': 'past_due'
  };
  
  return statusMap[stripeStatus] || 'incomplete';
}

export default router;
