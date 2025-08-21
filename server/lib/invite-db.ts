/**
 * In-memory database for invite-only system
 * TODO: Replace with real database connection (PostgreSQL/Neon)
 */

export interface SystemSettings {
  id: 'SystemSettings';
  invite_only_mode: boolean;
  invite_requirements: {
    email_domain_whitelist: string[];
    must_supply_invite_key: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Invite {
  id: string;
  code: string;
  email?: string | null;
  domain?: string | null;
  max_uses: number;
  uses: number;
  expires_at?: string | null;
  status: 'active' | 'revoked' | 'expired';
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmailOTP {
  id: string;
  email: string;
  code: string;
  sent_at: string;
  expires_at: string;
  consumed: boolean;
  consumed_at?: string | null;
  ip_hash: string;
  attempts: number;
  invite_code?: string | null;
}

// In-memory storage (replace with real database)
class InviteDatabase {
  private settings: SystemSettings;
  private invites: Map<string, Invite> = new Map();
  private emailOTPs: Map<string, EmailOTP> = new Map();

  constructor() {
    // Default system settings
    this.settings = {
      id: 'SystemSettings',
      invite_only_mode: false,
      invite_requirements: {
        email_domain_whitelist: [],
        must_supply_invite_key: true
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // System Settings operations
  async getSystemSettings(): Promise<SystemSettings> {
    return { ...this.settings };
  }

  async updateSystemSettings(updates: Partial<SystemSettings>): Promise<SystemSettings> {
    this.settings = {
      ...this.settings,
      ...updates,
      id: 'SystemSettings', // Always keep the same ID
      updated_at: new Date().toISOString()
    };
    return { ...this.settings };
  }

  // Invite operations
  async createInvite(invite: Omit<Invite, 'id' | 'created_at' | 'updated_at'>): Promise<Invite> {
    const id = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const newInvite: Invite = {
      ...invite,
      id,
      created_at: now,
      updated_at: now
    };
    
    this.invites.set(id, newInvite);
    return { ...newInvite };
  }

  async getInvite(id: string): Promise<Invite | null> {
    const invite = this.invites.get(id);
    return invite ? { ...invite } : null;
  }

  async getInviteByCode(code: string): Promise<Invite | null> {
    for (const invite of this.invites.values()) {
      if (invite.code === code) {
        return { ...invite };
      }
    }
    return null;
  }

  async updateInvite(id: string, updates: Partial<Invite>): Promise<Invite | null> {
    const existing = this.invites.get(id);
    if (!existing) return null;

    const updated: Invite = {
      ...existing,
      ...updates,
      id: existing.id, // Preserve ID
      created_at: existing.created_at, // Preserve creation time
      updated_at: new Date().toISOString()
    };

    this.invites.set(id, updated);
    return { ...updated };
  }

  async deleteInvite(id: string): Promise<boolean> {
    return this.invites.delete(id);
  }

  async getAllInvites(): Promise<Invite[]> {
    return Array.from(this.invites.values()).map(invite => ({ ...invite }));
  }

  async getInvitesByCreator(createdBy: string): Promise<Invite[]> {
    return Array.from(this.invites.values())
      .filter(invite => invite.created_by === createdBy)
      .map(invite => ({ ...invite }));
  }

  // EmailOTP operations
  async createEmailOTP(otp: Omit<EmailOTP, 'id'>): Promise<EmailOTP> {
    const id = `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newOTP: EmailOTP = {
      ...otp,
      id
    };
    
    this.emailOTPs.set(id, newOTP);
    return { ...newOTP };
  }

  async getEmailOTP(id: string): Promise<EmailOTP | null> {
    const otp = this.emailOTPs.get(id);
    return otp ? { ...otp } : null;
  }

  async getLatestEmailOTP(email: string): Promise<EmailOTP | null> {
    const otps = Array.from(this.emailOTPs.values())
      .filter(otp => otp.email === email)
      .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
    
    return otps.length > 0 ? { ...otps[0] } : null;
  }

  async updateEmailOTP(id: string, updates: Partial<EmailOTP>): Promise<EmailOTP | null> {
    const existing = this.emailOTPs.get(id);
    if (!existing) return null;

    const updated: EmailOTP = {
      ...existing,
      ...updates,
      id: existing.id // Preserve ID
    };

    this.emailOTPs.set(id, updated);
    return { ...updated };
  }

  async deleteEmailOTP(id: string): Promise<boolean> {
    return this.emailOTPs.delete(id);
  }

  async cleanupExpiredOTPs(): Promise<number> {
    const now = new Date();
    let cleaned = 0;

    for (const [id, otp] of this.emailOTPs.entries()) {
      if (new Date(otp.expires_at) < now) {
        this.emailOTPs.delete(id);
        cleaned++;
      }
    }

    return cleaned;
  }

  // Rate limiting helpers
  async getOTPAttemptsInWindow(email: string, windowMinutes: number): Promise<number> {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
    
    return Array.from(this.emailOTPs.values())
      .filter(otp => 
        otp.email === email && 
        new Date(otp.sent_at) >= windowStart
      ).length;
  }

  async getOTPAttemptsByIP(ipHash: string, windowMinutes: number): Promise<number> {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
    
    return Array.from(this.emailOTPs.values())
      .filter(otp => 
        otp.ip_hash === ipHash && 
        new Date(otp.sent_at) >= windowStart
      ).length;
  }
}

// Singleton instance
export const inviteDB = new InviteDatabase();

// Utility functions
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generate6DigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashIP(ip: string): string {
  // Simple hash for development - use crypto.createHash('sha256') in production
  return Buffer.from(ip).toString('base64').slice(0, 16);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}
