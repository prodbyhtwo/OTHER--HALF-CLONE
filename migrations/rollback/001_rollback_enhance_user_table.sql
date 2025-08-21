-- Rollback Migration: 001_rollback_enhance_user_table.sql
-- Description: Rollback changes from 001_enhance_user_table.sql
-- Created: 2024-01-01

-- Begin transaction
BEGIN;

-- Drop indexes
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_is_banned;
DROP INDEX IF EXISTS idx_users_subscription_tier;
DROP INDEX IF EXISTS idx_users_verification_status;
DROP INDEX IF EXISTS idx_users_last_active_at;

-- Remove new columns (keeping verification_status as it might have existed before)
ALTER TABLE users 
DROP COLUMN IF EXISTS role,
DROP COLUMN IF EXISTS is_banned,
DROP COLUMN IF EXISTS subscription_tier,
DROP COLUMN IF EXISTS entitlements,
DROP COLUMN IF EXISTS badges,
DROP COLUMN IF EXISTS blocked_users,
DROP COLUMN IF EXISTS streak_count,
DROP COLUMN IF EXISTS total_points,
DROP COLUMN IF EXISTS level,
DROP COLUMN IF EXISTS last_active_at;

-- Note: We're not dropping verification_status as it might have existed before our migration

-- Commit transaction
COMMIT;
