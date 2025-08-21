-- Migration: 001_enhance_user_table.sql
-- Description: Add new required fields to users table for production readiness
-- Created: 2024-01-01

-- Begin transaction
BEGIN;

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'support', 'editor', 'admin')),
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'plus', 'pro', 'premium')),
ADD COLUMN IF NOT EXISTS entitlements JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS blocked_users JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE;

-- Ensure verification_status exists and has correct values
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='verification_status'
    ) THEN
        ALTER TABLE users ADD COLUMN verification_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (verification_status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_banned ON users(is_banned);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_last_active_at ON users(last_active_at);

-- Backfill entitlements based on subscription tier
UPDATE users SET entitlements = 
CASE subscription_tier
    WHEN 'free' THEN '["basic_matches", "basic_messaging"]'::jsonb
    WHEN 'plus' THEN '["basic_matches", "basic_messaging", "enhanced_filters", "see_who_liked"]'::jsonb
    WHEN 'pro' THEN '["basic_matches", "basic_messaging", "enhanced_filters", "see_who_liked", "unlimited_likes", "read_receipts"]'::jsonb
    WHEN 'premium' THEN '["basic_matches", "basic_messaging", "enhanced_filters", "see_who_liked", "unlimited_likes", "read_receipts", "priority_support", "exclusive_events"]'::jsonb
    ELSE '["basic_matches", "basic_messaging"]'::jsonb
END
WHERE entitlements = '[]'::jsonb;

-- Set last_active_at to updated_at for existing users
UPDATE users SET last_active_at = updated_at WHERE last_active_at IS NULL;

-- Commit transaction
COMMIT;
