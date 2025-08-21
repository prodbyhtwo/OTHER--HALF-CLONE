import { RequestHandler } from 'express';
import { inviteDB } from '../lib/invite-db';
import { z } from 'zod';

// Validation schemas
const SetInviteOnlyModeSchema = z.object({
  enabled: z.boolean()
});

const UpdateInviteRequirementsSchema = z.object({
  email_domain_whitelist: z.array(z.string()).optional(),
  must_supply_invite_key: z.boolean().optional()
});

// Get system settings (accessible to all authenticated users)
export const getSystemSettings: RequestHandler = async (req, res) => {
  try {
    const settings = await inviteDB.getSystemSettings();
    
    // Only return public settings to non-admin users
    if (req.user?.role !== 'admin') {
      return res.json({
        invite_only_mode: settings.invite_only_mode,
        invite_requirements: settings.invite_requirements
      });
    }
    
    // Admin gets full settings
    res.json(settings);
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ error: 'Failed to fetch system settings' });
  }
};

// Set invite-only mode (admin only)
export const setInviteOnlyMode: RequestHandler = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Validate request body
    const result = SetInviteOnlyModeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request body', details: result.error.errors });
    }

    const { enabled } = result.data;

    // Update settings
    const updatedSettings = await inviteDB.updateSystemSettings({
      invite_only_mode: enabled
    });

    // TODO: Log admin action to audit trail
    console.log(`Admin ${req.user.id} ${enabled ? 'enabled' : 'disabled'} invite-only mode`, {
      admin_id: req.user.id,
      action: 'SET_INVITE_ONLY_MODE',
      metadata: { enabled },
      timestamp: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      invite_only_mode: updatedSettings.invite_only_mode 
    });
  } catch (error) {
    console.error('Error setting invite-only mode:', error);
    res.status(500).json({ error: 'Failed to update invite-only mode' });
  }
};

// Update invite requirements (admin only)
export const updateInviteRequirements: RequestHandler = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Validate request body
    const result = UpdateInviteRequirementsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request body', details: result.error.errors });
    }

    const updates = result.data;

    // Get current settings
    const currentSettings = await inviteDB.getSystemSettings();
    
    // Update invite requirements
    const updatedSettings = await inviteDB.updateSystemSettings({
      invite_requirements: {
        ...currentSettings.invite_requirements,
        ...updates
      }
    });

    // TODO: Log admin action to audit trail
    console.log(`Admin ${req.user.id} updated invite requirements`, {
      admin_id: req.user.id,
      action: 'UPDATE_INVITE_REQUIREMENTS',
      metadata: updates,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      success: true, 
      invite_requirements: updatedSettings.invite_requirements 
    });
  } catch (error) {
    console.error('Error updating invite requirements:', error);
    res.status(500).json({ error: 'Failed to update invite requirements' });
  }
};

// Check if invite-only mode is enabled (public endpoint)
export const checkInviteOnlyMode: RequestHandler = async (req, res) => {
  try {
    const settings = await inviteDB.getSystemSettings();
    res.json({ 
      invite_only_mode: settings.invite_only_mode,
      invite_requirements: settings.invite_requirements
    });
  } catch (error) {
    console.error('Error checking invite-only mode:', error);
    res.status(500).json({ error: 'Failed to check invite-only mode' });
  }
};
