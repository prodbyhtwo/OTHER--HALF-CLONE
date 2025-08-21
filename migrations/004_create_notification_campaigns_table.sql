-- Migration: 004_create_notification_campaigns_table.sql
-- Description: Create notification_campaigns table for push/email campaigns
-- Created: 2024-01-01

-- Begin transaction
BEGIN;

-- Create notification_campaigns table
CREATE TABLE IF NOT EXISTS notification_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('push', 'email', 'popup', 'sms')),
    audience_query JSONB NOT NULL,
    schedule JSONB DEFAULT '{}'::jsonb,
    payload JSONB NOT NULL,
    frequency_cap JSONB DEFAULT '{"max_per_user_per_day": 3, "min_hours_between": 4}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed', 'paused')),
    metrics JSONB DEFAULT '{"sent_count": 0, "delivered_count": 0, "opened_count": 0, "clicked_count": 0, "failed_count": 0}'::jsonb,
    created_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_channel ON notification_campaigns(channel);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_status ON notification_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_created_by ON notification_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_approved_by ON notification_campaigns(approved_by);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_sent_at ON notification_campaigns(sent_at);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_created_at ON notification_campaigns(created_at);

-- Create GIN indexes for JSONB fields
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_audience_query ON notification_campaigns USING GIN (audience_query);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_payload ON notification_campaigns USING GIN (payload);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_notification_campaigns_updated_at
    BEFORE UPDATE ON notification_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_campaigns_updated_at();

-- Create notification_deliveries table to track individual deliveries
CREATE TABLE IF NOT EXISTS notification_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES notification_campaigns(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'opened', 'clicked')),
    external_id VARCHAR(255), -- Provider's message ID
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notification_deliveries
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_campaign_id ON notification_deliveries(campaign_id);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_user_id ON notification_deliveries(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_status ON notification_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_sent_at ON notification_deliveries(sent_at);

-- Create unique constraint to prevent duplicate deliveries
CREATE UNIQUE INDEX IF NOT EXISTS idx_notification_deliveries_unique 
ON notification_deliveries(campaign_id, user_id);

-- Create trigger to update campaign metrics when delivery status changes
CREATE OR REPLACE FUNCTION update_campaign_metrics()
RETURNS TRIGGER AS $$
DECLARE
    campaign_metrics JSONB;
BEGIN
    -- Recalculate metrics for the campaign
    SELECT jsonb_build_object(
        'sent_count', COUNT(*) FILTER (WHERE status IN ('sent', 'delivered', 'opened', 'clicked')),
        'delivered_count', COUNT(*) FILTER (WHERE status IN ('delivered', 'opened', 'clicked')),
        'opened_count', COUNT(*) FILTER (WHERE status IN ('opened', 'clicked')),
        'clicked_count', COUNT(*) FILTER (WHERE status = 'clicked'),
        'failed_count', COUNT(*) FILTER (WHERE status = 'failed')
    )
    INTO campaign_metrics
    FROM notification_deliveries
    WHERE campaign_id = COALESCE(NEW.campaign_id, OLD.campaign_id);
    
    -- Update campaign with new metrics
    UPDATE notification_campaigns 
    SET metrics = campaign_metrics,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.campaign_id, OLD.campaign_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_campaign_metrics
    AFTER INSERT OR UPDATE OR DELETE ON notification_deliveries
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_metrics();

-- Create function to check frequency cap before sending
CREATE OR REPLACE FUNCTION check_notification_frequency_cap(
    p_user_id UUID,
    p_channel VARCHAR,
    p_frequency_cap JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    max_per_day INTEGER := COALESCE((p_frequency_cap->>'max_per_user_per_day')::INTEGER, 3);
    min_hours_between INTEGER := COALESCE((p_frequency_cap->>'min_hours_between')::INTEGER, 4);
    recent_count INTEGER;
    last_delivery TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Check daily limit
    SELECT COUNT(*)
    INTO recent_count
    FROM notification_deliveries nd
    JOIN notification_campaigns nc ON nd.campaign_id = nc.id
    WHERE nd.user_id = p_user_id
      AND nc.channel = p_channel
      AND nd.sent_at >= NOW() - INTERVAL '24 hours'
      AND nd.status IN ('sent', 'delivered', 'opened', 'clicked');
    
    IF recent_count >= max_per_day THEN
        RETURN FALSE;
    END IF;
    
    -- Check minimum time between notifications
    SELECT MAX(nd.sent_at)
    INTO last_delivery
    FROM notification_deliveries nd
    JOIN notification_campaigns nc ON nd.campaign_id = nc.id
    WHERE nd.user_id = p_user_id
      AND nc.channel = p_channel
      AND nd.status IN ('sent', 'delivered', 'opened', 'clicked');
    
    IF last_delivery IS NOT NULL AND last_delivery > NOW() - (min_hours_between || ' hours')::INTERVAL THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ language 'plpgsql';

-- Commit transaction
COMMIT;
