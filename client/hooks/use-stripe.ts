import { useState, useCallback } from 'react';
import { stripeClientService, SubscriptionPlan, CreateCheckoutSessionParams } from '@/lib/stripe-client';
import { useActionLogger } from '@/lib/action-logger';

export interface UseStripeReturn {
  plans: SubscriptionPlan[];
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  fetchPlansByTier: (tier: 'plus' | 'pro' | 'premium') => Promise<void>;
  createCheckoutSession: (params: CreateCheckoutSessionParams) => Promise<void>;
  openBillingPortal: (customerId: string, returnUrl?: string) => Promise<void>;
  updateSubscription: (subscriptionId: string, planId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  resumeSubscription: (subscriptionId: string) => Promise<void>;
  formatPrice: (amount: number, currency?: string) => string;
  getPlanDisplayName: (plan: SubscriptionPlan) => string;
}

export function useStripe(): UseStripeReturn {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logHandlerStart, logHandlerOk, logHandlerError, timer } = useActionLogger();

  const handleAsync = useCallback(async (
    operation: string,
    asyncFunction: () => Promise<void>
  ) => {
    const timerInstance = timer();
    const handlerId = logHandlerStart(`stripe_${operation}`);
    setLoading(true);
    setError(null);

    try {
      await asyncFunction();
      logHandlerOk(handlerId, `stripe_${operation}`, timerInstance.end());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logHandlerError(handlerId, `stripe_${operation}`, err as Error, timerInstance.end());
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logHandlerStart, logHandlerOk, logHandlerError, timer]);

  const fetchPlans = useCallback(async () => {
    await handleAsync('fetch_plans', async () => {
      const fetchedPlans = await stripeClientService.getPlans();
      setPlans(fetchedPlans);
    });
  }, [handleAsync]);

  const fetchPlansByTier = useCallback(async (tier: 'plus' | 'pro' | 'premium') => {
    await handleAsync(`fetch_plans_${tier}`, async () => {
      const fetchedPlans = await stripeClientService.getPlansByTier(tier);
      setPlans(fetchedPlans);
    });
  }, [handleAsync]);

  const createCheckoutSession = useCallback(async (params: CreateCheckoutSessionParams) => {
    await handleAsync('create_checkout_session', async () => {
      await stripeClientService.createCheckoutSession(params);
    });
  }, [handleAsync]);

  const openBillingPortal = useCallback(async (customerId: string, returnUrl?: string) => {
    await handleAsync('open_billing_portal', async () => {
      await stripeClientService.openBillingPortal({ customerId, returnUrl });
    });
  }, [handleAsync]);

  const updateSubscription = useCallback(async (subscriptionId: string, planId: string) => {
    await handleAsync('update_subscription', async () => {
      await stripeClientService.updateSubscription(subscriptionId, planId);
    });
  }, [handleAsync]);

  const cancelSubscription = useCallback(async (subscriptionId: string) => {
    await handleAsync('cancel_subscription', async () => {
      await stripeClientService.cancelSubscription(subscriptionId);
    });
  }, [handleAsync]);

  const resumeSubscription = useCallback(async (subscriptionId: string) => {
    await handleAsync('resume_subscription', async () => {
      await stripeClientService.resumeSubscription(subscriptionId);
    });
  }, [handleAsync]);

  const formatPrice = useCallback((amount: number, currency?: string) => {
    return stripeClientService.formatPrice(amount, currency);
  }, []);

  const getPlanDisplayName = useCallback((plan: SubscriptionPlan) => {
    return stripeClientService.getPlanDisplayName(plan);
  }, []);

  return {
    plans,
    loading,
    error,
    fetchPlans,
    fetchPlansByTier,
    createCheckoutSession,
    openBillingPortal,
    updateSubscription,
    cancelSubscription,
    resumeSubscription,
    formatPrice,
    getPlanDisplayName
  };
}

export interface UseSubscriptionManagementProps {
  userId?: string;
  customerId?: string;
  subscriptionId?: string;
}

export function useSubscriptionManagement({
  userId,
  customerId,
  subscriptionId
}: UseSubscriptionManagementProps = {}) {
  const stripe = useStripe();
  const { logClick } = useActionLogger();

  const handleUpgrade = useCallback(async (planId: string, trialDays?: number) => {
    if (!userId) {
      throw new Error('User ID is required for upgrade');
    }

    logClick('upgrade_button', { plan_id: planId, trial_days: trialDays });
    
    await stripe.createCheckoutSession({
      planId,
      userId,
      trialDays,
      successUrl: `${window.location.origin}/subscription/success?plan=${planId}`,
      cancelUrl: `${window.location.origin}/subscription/cancel`
    });
  }, [userId, stripe, logClick]);

  const handleManageBilling = useCallback(async () => {
    if (!customerId) {
      throw new Error('Customer ID is required for billing management');
    }

    logClick('manage_billing_button', { customer_id: customerId });
    
    await stripe.openBillingPortal(customerId);
  }, [customerId, stripe, logClick]);

  const handleCancelSubscription = useCallback(async () => {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required for cancellation');
    }

    logClick('cancel_subscription_button', { subscription_id: subscriptionId });
    
    await stripe.cancelSubscription(subscriptionId);
  }, [subscriptionId, stripe, logClick]);

  const handleResumeSubscription = useCallback(async () => {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required for resuming');
    }

    logClick('resume_subscription_button', { subscription_id: subscriptionId });
    
    await stripe.resumeSubscription(subscriptionId);
  }, [subscriptionId, stripe, logClick]);

  const handleChangePlan = useCallback(async (newPlanId: string) => {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required for plan change');
    }

    logClick('change_plan_button', { 
      subscription_id: subscriptionId, 
      new_plan_id: newPlanId 
    });
    
    await stripe.updateSubscription(subscriptionId, newPlanId);
  }, [subscriptionId, stripe, logClick]);

  return {
    ...stripe,
    handleUpgrade,
    handleManageBilling,
    handleCancelSubscription,
    handleResumeSubscription,
    handleChangePlan,
    canUpgrade: Boolean(userId),
    canManageBilling: Boolean(customerId),
    canCancelResume: Boolean(subscriptionId)
  };
}
