-- Migration: 002_create_subscriptions_table.sql
-- Description: Create subscriptions table for managing user subscriptions
-- Created: 2024-01-01

-- Begin transaction
BEGIN;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('stripe', 'apple', 'google', 'admin_comp')),
    customer_id VARCHAR(255),
    subscription_id VARCHAR(255),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing', 'paused')),
    price_id VARCHAR(255),
    current_tier VARCHAR(20) NOT NULL CHECK (current_tier IN ('free', 'plus', 'pro', 'premium')),
    billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly', 'annual', 'lifetime')),
    amount INTEGER, -- Amount in cents
    currency VARCHAR(3) DEFAULT 'usd',
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    renews_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON subscriptions(provider);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscription_id ON subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_tier ON subscriptions(current_tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_renews_at ON subscriptions(renews_at);

-- Create unique constraint to prevent duplicate active subscriptions per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user_active 
ON subscriptions(user_id) 
WHERE status IN ('active', 'trialing');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscriptions_updated_at();

-- Create function to sync user subscription tier
CREATE OR REPLACE FUNCTION sync_user_subscription_tier()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user's subscription tier when subscription changes
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.status IN ('active', 'trialing') THEN
            UPDATE users 
            SET subscription_tier = NEW.current_tier,
                entitlements = CASE NEW.current_tier
                    WHEN 'free' THEN '["basic_matches", "basic_messaging"]'::jsonb
                    WHEN 'plus' THEN '["basic_matches", "basic_messaging", "enhanced_filters", "see_who_liked"]'::jsonb
                    WHEN 'pro' THEN '["basic_matches", "basic_messaging", "enhanced_filters", "see_who_liked", "unlimited_likes", "read_receipts"]'::jsonb
                    WHEN 'premium' THEN '["basic_matches", "basic_messaging", "enhanced_filters", "see_who_liked", "unlimited_likes", "read_receipts", "priority_support", "exclusive_events"]'::jsonb
                END,
                updated_at = NOW()
            WHERE id = NEW.user_id;
        ELSIF NEW.status IN ('canceled', 'past_due') AND OLD.status IN ('active', 'trialing') THEN
            -- Downgrade to free when subscription becomes inactive
            UPDATE users 
            SET subscription_tier = 'free',
                entitlements = '["basic_matches", "basic_messaging"]'::jsonb,
                updated_at = NOW()
            WHERE id = NEW.user_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Downgrade to free when subscription is deleted
        UPDATE users 
        SET subscription_tier = 'free',
            entitlements = '["basic_matches", "basic_messaging"]'::jsonb,
            updated_at = NOW()
        WHERE id = OLD.user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_sync_user_subscription_tier
    AFTER INSERT OR UPDATE OR DELETE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_subscription_tier();

-- Commit transaction
COMMIT;
