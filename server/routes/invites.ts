import { RequestHandler } from 'express';
import { inviteDB, generateInviteCode, Invite } from '../lib/invite-db';
import { z } from 'zod';

// Validation schemas
const CreateInviteSchema = z.object({
  email: z.string().email().optional(),
  domain: z.string().regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).optional(),
  max_uses: z.number().int().min(1).max(1000).default(1),
  expires_at: z.string().datetime().optional(),
  notes: z.string().max(500).optional()
});

const ValidateInviteSchema = z.object({
  code: z.string().min(10).max(16),
  email: z.string().email().optional()
});

const UpdateInviteSchema = z.object({
  status: z.enum(['active', 'revoked', 'expired']).optional(),
  expires_at: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  max_uses: z.number().int().min(1).max(1000).optional()
});

// Create invite (admin only)
export const createInvite: RequestHandler = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Validate request body
    const result = CreateInviteSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request body', details: result.error.errors });
    }

    const { email, domain, max_uses, expires_at, notes } = result.data;

    // Validate that email and domain are not both specified
    if (email && domain) {
      return res.status(400).json({ error: 'Cannot specify both email and domain' });
    }

    // Generate unique invite code
    let code: string;
    let attempts = 0;
    do {
      code = generateInviteCode();
      attempts++;
      if (attempts > 10) {
        throw new Error('Failed to generate unique invite code');
      }
    } while (await inviteDB.getInviteByCode(code));

    // Create the invite
    const invite = await inviteDB.createInvite({
      code,
      email: email || null,
      domain: domain || null,
      max_uses: max_uses || 1,
      uses: 0,
      expires_at: expires_at || null,
      status: 'active',
      notes: notes || '',
      created_by: req.user.id
    });

    // TODO: Log admin action to audit trail
    console.log(`Admin ${req.user.id} created invite ${invite.code}`, {
      admin_id: req.user.id,
      action: 'CREATE_INVITE',
      metadata: { invite_id: invite.id, code: invite.code, email, domain, max_uses },
      timestamp: new Date().toISOString()
    });

    res.status(201).json(invite);
  } catch (error) {
    console.error('Error creating invite:', error);
    res.status(500).json({ error: 'Failed to create invite' });
  }
};

// Validate invite
export const validateInvite: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const result = ValidateInviteSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request body', details: result.error.errors });
    }

    const { code, email } = result.data;

    // Find invite by code
    const invite = await inviteDB.getInviteByCode(code);
    if (!invite) {
      return res.json({ valid: false, reason: 'Invalid invite code' });
    }

    // Check invite status
    if (invite.status !== 'active') {
      return res.json({ valid: false, reason: 'Invite is no longer active' });
    }

    // Check expiration
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      // Auto-expire the invite
      await inviteDB.updateInvite(invite.id, { status: 'expired' });
      return res.json({ valid: false, reason: 'Invite has expired' });
    }

    // Check usage limit
    if (invite.uses >= invite.max_uses) {
      // Auto-expire the invite
      await inviteDB.updateInvite(invite.id, { status: 'expired' });
      return res.json({ valid: false, reason: 'Invite has reached maximum uses' });
    }

    // Check email restriction
    if (invite.email && invite.email !== email) {
      return res.json({ valid: false, reason: 'Invite is not valid for this email address' });
    }

    // Check domain restriction
    if (invite.domain && email) {
      if (!email.endsWith(`@${invite.domain}`)) {
        return res.json({ valid: false, reason: 'Invite is not valid for this email domain' });
      }
    }

    res.json({ valid: true, invite: { code: invite.code, email: invite.email, domain: invite.domain } });
  } catch (error) {
    console.error('Error validating invite:', error);
    res.status(500).json({ error: 'Failed to validate invite' });
  }
};

// Consume invite (internal use - marks as used)
export const consumeInvite = async (code: string, email?: string): Promise<{ success: boolean; reason?: string }> => {
  try {
    const invite = await inviteDB.getInviteByCode(code);
    if (!invite) {
      return { success: false, reason: 'Invalid invite code' };
    }

    if (invite.status !== 'active') {
      return { success: false, reason: 'Invite is no longer active' };
    }

    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      await inviteDB.updateInvite(invite.id, { status: 'expired' });
      return { success: false, reason: 'Invite has expired' };
    }

    if (invite.uses >= invite.max_uses) {
      await inviteDB.updateInvite(invite.id, { status: 'expired' });
      return { success: false, reason: 'Invite has reached maximum uses' };
    }

    if (invite.email && invite.email !== email) {
      return { success: false, reason: 'Invite is not valid for this email address' };
    }

    if (invite.domain && email && !email.endsWith(`@${invite.domain}`)) {
      return { success: false, reason: 'Invite is not valid for this email domain' };
    }

    // Increment usage
    const newUses = invite.uses + 1;
    const updates: Partial<Invite> = { uses: newUses };
    
    // Auto-expire if at max uses
    if (newUses >= invite.max_uses) {
      updates.status = 'expired';
    }

    await inviteDB.updateInvite(invite.id, updates);
    return { success: true };
  } catch (error) {
    console.error('Error consuming invite:', error);
    return { success: false, reason: 'Failed to process invite' };
  }
};

// Get all invites (admin only)
export const getAllInvites: RequestHandler = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const invites = await inviteDB.getAllInvites();
    
    // Sort by creation date (newest first)
    invites.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json(invites);
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ error: 'Failed to fetch invites' });
  }
};

// Get invite by ID (admin only)
export const getInvite: RequestHandler = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const invite = await inviteDB.getInvite(id);

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    res.json(invite);
  } catch (error) {
    console.error('Error fetching invite:', error);
    res.status(500).json({ error: 'Failed to fetch invite' });
  }
};

// Update invite (admin only)
export const updateInvite: RequestHandler = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    
    // Validate request body
    const result = UpdateInviteSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request body', details: result.error.errors });
    }

    const updates = result.data;
    const updatedInvite = await inviteDB.updateInvite(id, updates);

    if (!updatedInvite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    // TODO: Log admin action to audit trail
    console.log(`Admin ${req.user.id} updated invite ${updatedInvite.code}`, {
      admin_id: req.user.id,
      action: 'UPDATE_INVITE',
      metadata: { invite_id: id, updates },
      timestamp: new Date().toISOString()
    });

    res.json(updatedInvite);
  } catch (error) {
    console.error('Error updating invite:', error);
    res.status(500).json({ error: 'Failed to update invite' });
  }
};

// Delete invite (admin only)
export const deleteInvite: RequestHandler = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    
    // Get invite details for logging before deletion
    const invite = await inviteDB.getInvite(id);
    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    const deleted = await inviteDB.deleteInvite(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    // TODO: Log admin action to audit trail
    console.log(`Admin ${req.user.id} deleted invite ${invite.code}`, {
      admin_id: req.user.id,
      action: 'DELETE_INVITE',
      metadata: { invite_id: id, code: invite.code },
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting invite:', error);
    res.status(500).json({ error: 'Failed to delete invite' });
  }
};

// Generate invite link for sharing (admin only)
export const generateInviteLink: RequestHandler = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const invite = await inviteDB.getInvite(id);

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    // Generate the invite link
    const baseUrl = process.env.FRONTEND_URL || 'https://yourapp.com';
    const inviteLink = `${baseUrl}/signup?invite=${invite.code}`;

    res.json({ 
      invite_link: inviteLink,
      code: invite.code,
      expires_at: invite.expires_at,
      uses: invite.uses,
      max_uses: invite.max_uses
    });
  } catch (error) {
    console.error('Error generating invite link:', error);
    res.status(500).json({ error: 'Failed to generate invite link' });
  }
};
