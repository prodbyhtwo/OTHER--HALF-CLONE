-- Migration: 003_create_admin_actions_table.sql
-- Description: Create admin_actions table for immutable audit logging
-- Created: 2024-01-01

-- Begin transaction
BEGIN;

-- Create admin_actions table
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
        'user_ban', 'user_unban', 'user_approve', 'user_reject',
        'user_promote', 'user_demote', 'subscription_change', 'subscription_comp',
        'content_create', 'content_update', 'content_delete', 'notification_send',
        'bulk_approve_all', 'bulk_approve_verified', 'church_create', 'church_update',
        'church_delete', 'learning_content_create', 'learning_content_update',
        'learning_content_delete', 'system_setting_change'
    )),
    target_id UUID,
    target_type VARCHAR(20) CHECK (target_type IN ('user', 'subscription', 'church', 'learning_content', 'notification', 'system')),
    metadata JSONB DEFAULT '{}'::jsonb,
    correlation_id UUID NOT NULL DEFAULT gen_random_uuid(),
    session_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ip_address INET NOT NULL,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- Create indexes for querying and performance
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_id ON admin_actions(target_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_type ON admin_actions(target_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_correlation_id ON admin_actions(correlation_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_timestamp ON admin_actions(timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_actions_success ON admin_actions(success);

-- Create GIN index for metadata queries
CREATE INDEX IF NOT EXISTS idx_admin_actions_metadata ON admin_actions USING GIN (metadata);

-- Prevent updates/deletes to maintain audit integrity
CREATE OR REPLACE FUNCTION prevent_admin_actions_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Admin actions are immutable and cannot be modified or deleted';
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers to prevent modification
CREATE TRIGGER trigger_prevent_admin_actions_update
    BEFORE UPDATE ON admin_actions
    FOR EACH ROW
    EXECUTE FUNCTION prevent_admin_actions_modification();

CREATE TRIGGER trigger_prevent_admin_actions_delete
    BEFORE DELETE ON admin_actions
    FOR EACH ROW
    EXECUTE FUNCTION prevent_admin_actions_modification();

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    p_admin_id UUID,
    p_action_type VARCHAR,
    p_target_id UUID DEFAULT NULL,
    p_target_type VARCHAR DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_correlation_id UUID DEFAULT NULL,
    p_session_id VARCHAR DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE,
    p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    action_id UUID;
BEGIN
    INSERT INTO admin_actions (
        admin_id, action_type, target_id, target_type, metadata,
        correlation_id, session_id, ip_address, user_agent, success, error_message
    ) VALUES (
        p_admin_id, p_action_type, p_target_id, p_target_type, p_metadata,
        COALESCE(p_correlation_id, gen_random_uuid()), p_session_id, 
        p_ip_address, p_user_agent, p_success, p_error_message
    )
    RETURNING id INTO action_id;
    
    RETURN action_id;
END;
$$ language 'plpgsql';

-- Create view for admin action summary
CREATE OR REPLACE VIEW admin_action_summary AS
SELECT 
    admin_id,
    u.full_name as admin_name,
    u.email as admin_email,
    action_type,
    COUNT(*) as action_count,
    COUNT(*) FILTER (WHERE success = true) as success_count,
    COUNT(*) FILTER (WHERE success = false) as error_count,
    MIN(timestamp) as first_action,
    MAX(timestamp) as last_action
FROM admin_actions aa
LEFT JOIN users u ON aa.admin_id = u.id
GROUP BY admin_id, u.full_name, u.email, action_type
ORDER BY last_action DESC;

-- Commit transaction
COMMIT;
