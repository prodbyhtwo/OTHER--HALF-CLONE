// server/routes/user-settings.ts
import { Router, Request, Response } from "express";
import { z } from "zod";
import { authenticateToken } from "./auth";
import { logSecurityEvent } from "../../src/middleware/security";
import type { 
  UserSettings, 
  UpdateUserSettingsRequest,
  ProfileVisibility,
  AppTheme,
  ChurchDenomination
} from "../../src/types/database";

const router = Router();

// Validation schemas
const pushPreferencesSchema = z.object({
  marketing: z.boolean().optional(),
  social: z.boolean().optional(),
  security: z.boolean().optional(),
  matches: z.boolean().optional(),
  messages: z.boolean().optional(),
  likes: z.boolean().optional(),
}).strict();

const emailPreferencesSchema = z.object({
  marketing: z.boolean().optional(),
  social: z.boolean().optional(),
  security: z.boolean().optional(),
  matches: z.boolean().optional(),
  messages: z.boolean().optional(),
  weekly_digest: z.boolean().optional(),
}).strict();

const privacyPreferencesSchema = z.object({
  profile_visibility: z.enum(['public', 'matches_only', 'private']).optional(),
  show_age: z.boolean().optional(),
  show_distance: z.boolean().optional(),
  show_last_active: z.boolean().optional(),
  show_online_status: z.boolean().optional(),
  discoverable: z.boolean().optional(),
}).strict();

const discoveryPreferencesSchema = z.object({
  min_age: z.number().int().min(18).max(100).optional(),
  max_age: z.number().int().min(18).max(100).optional(),
  max_distance_km: z.number().int().min(1).max(500).optional(),
  preferred_denominations: z.array(z.enum([
    'catholic', 'protestant', 'orthodox', 'baptist', 'methodist',
    'presbyterian', 'pentecostal', 'lutheran', 'anglican', 
    'evangelical', 'non_denominational'
  ])).optional(),
  required_verification: z.boolean().optional(),
  preferred_church_attendance: z.array(z.enum([
    'weekly', 'monthly', 'occasionally', 'holidays_only', 'never'
  ])).optional(),
}).strict();

const updateSettingsSchema = z.object({
  push_preferences: pushPreferencesSchema.optional(),
  email_preferences: emailPreferencesSchema.optional(),
  privacy_preferences: privacyPreferencesSchema.optional(),
  discovery_preferences: discoveryPreferencesSchema.optional(),
  theme: z.enum(['light', 'dark', 'system', 'faith']).optional(),
  language: z.string().min(2).max(5).optional(),
}).strict();

// Mock settings storage (replace with real database)
let mockUserSettings: UserSettings[] = [
  {
    user_id: "user1",
    push_preferences: {
      marketing: true,
      social: true,
      security: true,
      matches: true,
      messages: true,
      likes: true,
    },
    email_preferences: {
      marketing: false,
      social: false,
      security: true,
      matches: false,
      messages: false,
      weekly_digest: false,
    },
    privacy_preferences: {
      profile_visibility: "public",
      show_age: true,
      show_distance: true,
      show_last_active: true,
      show_online_status: false,
      discoverable: true,
    },
    discovery_preferences: {
      min_age: 18,
      max_age: 35,
      max_distance_km: 50,
      required_verification: false,
    },
    blocked_user_ids: [],
    theme: "system",
    language: "en",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// Helper functions
function findUserSettings(userId: string): UserSettings | undefined {
  return mockUserSettings.find(settings => settings.user_id === userId);
}

function createDefaultSettings(userId: string): UserSettings {
  const defaultSettings: UserSettings = {
    user_id: userId,
    push_preferences: {
      marketing: true,
      social: true,
      security: true,
      matches: true,
      messages: true,
      likes: true,
    },
    email_preferences: {
      marketing: false,
      social: false,
      security: true,
      matches: false,
      messages: false,
      weekly_digest: false,
    },
    privacy_preferences: {
      profile_visibility: "public",
      show_age: true,
      show_distance: true,
      show_last_active: true,
      show_online_status: false,
      discoverable: true,
    },
    discovery_preferences: {
      min_age: 18,
      max_age: 35,
      max_distance_km: 50,
      required_verification: false,
    },
    blocked_user_ids: [],
    theme: "system",
    language: "en",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  mockUserSettings.push(defaultSettings);
  return defaultSettings;
}

function updateUserSettings(userId: string, updates: Partial<UserSettings>): UserSettings {
  const settingsIndex = mockUserSettings.findIndex(settings => settings.user_id === userId);
  
  if (settingsIndex === -1) {
    // Create new settings if none exist
    const newSettings = createDefaultSettings(userId);
    return updateUserSettings(userId, updates);
  }
  
  // Deep merge the updates
  const currentSettings = mockUserSettings[settingsIndex];
  const updatedSettings: UserSettings = {
    ...currentSettings,
    ...updates,
    push_preferences: updates.push_preferences 
      ? { ...currentSettings.push_preferences, ...updates.push_preferences }
      : currentSettings.push_preferences,
    email_preferences: updates.email_preferences
      ? { ...currentSettings.email_preferences, ...updates.email_preferences }
      : currentSettings.email_preferences,
    privacy_preferences: updates.privacy_preferences
      ? { ...currentSettings.privacy_preferences, ...updates.privacy_preferences }
      : currentSettings.privacy_preferences,
    discovery_preferences: updates.discovery_preferences
      ? { ...currentSettings.discovery_preferences, ...updates.discovery_preferences }
      : currentSettings.discovery_preferences,
    updated_at: new Date().toISOString(),
  };
  
  mockUserSettings[settingsIndex] = updatedSettings;
  return updatedSettings;
}

// Custom validation middleware
function validateSettingsConsistency(req: Request, res: Response, next: Function) {
  const updates = req.body;
  
  // Validate age range consistency
  if (updates.discovery_preferences) {
    const { min_age, max_age } = updates.discovery_preferences;
    if (min_age !== undefined && max_age !== undefined && min_age > max_age) {
      return res.status(400).json({
        success: false,
        error: "Minimum age cannot be greater than maximum age",
      });
    }
  }
  
  // Security preference should always be true for email (recommendation)
  if (updates.email_preferences?.security === false) {
    return res.status(400).json({
      success: false,
      error: "Security email notifications are strongly recommended and cannot be disabled",
    });
  }
  
  next();
}

// Routes

// GET /api/me/settings - Get current user's settings
router.get("/me/settings", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    let settings = findUserSettings(user.id);
    
    if (!settings) {
      settings = createDefaultSettings(user.id);
    }
    
    res.json({
      success: true,
      data: { settings }
    });
  } catch (error: any) {
    console.error("Get settings error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// PUT /api/me/settings - Update user settings (full replace or partial update)
router.put("/me/settings", authenticateToken, validateSettingsConsistency, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const validatedUpdates = updateSettingsSchema.parse(req.body);
    
    // Ensure settings exist before updating
    let currentSettings = findUserSettings(user.id);
    if (!currentSettings) {
      currentSettings = createDefaultSettings(user.id);
    }
    
    const updatedSettings = updateUserSettings(user.id, validatedUpdates);
    
    // Log which preferences were changed
    const changedFields: string[] = [];
    if (validatedUpdates.push_preferences) changedFields.push('push_preferences');
    if (validatedUpdates.email_preferences) changedFields.push('email_preferences');
    if (validatedUpdates.privacy_preferences) changedFields.push('privacy_preferences');
    if (validatedUpdates.discovery_preferences) changedFields.push('discovery_preferences');
    if (validatedUpdates.theme) changedFields.push('theme');
    if (validatedUpdates.language) changedFields.push('language');
    
    logSecurityEvent("settings_updated", {
      userId: user.id,
      changedFields,
      hasEmailChanges: !!validatedUpdates.email_preferences,
      hasPushChanges: !!validatedUpdates.push_preferences,
    }, req);
    
    res.json({
      success: true,
      data: { settings: updatedSettings },
      message: "Settings updated successfully"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid settings data",
        details: error.errors
      });
    }
    
    console.error("Update settings error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// PATCH /api/me/settings/push - Update only push preferences
router.patch("/me/settings/push", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const pushUpdates = pushPreferencesSchema.parse(req.body);
    
    const updatedSettings = updateUserSettings(user.id, {
      push_preferences: pushUpdates
    });
    
    logSecurityEvent("push_preferences_updated", {
      userId: user.id,
      preferences: pushUpdates,
    }, req);
    
    res.json({
      success: true,
      data: { push_preferences: updatedSettings.push_preferences },
      message: "Push notification preferences updated successfully"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid push preferences",
        details: error.errors
      });
    }
    
    console.error("Update push preferences error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// PATCH /api/me/settings/email - Update only email preferences  
router.patch("/me/settings/email", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const emailUpdates = emailPreferencesSchema.parse(req.body);
    
    // Prevent disabling security emails
    if (emailUpdates.security === false) {
      return res.status(400).json({
        success: false,
        error: "Security email notifications cannot be disabled",
      });
    }
    
    const updatedSettings = updateUserSettings(user.id, {
      email_preferences: emailUpdates
    });
    
    logSecurityEvent("email_preferences_updated", {
      userId: user.id,
      preferences: emailUpdates,
    }, req);
    
    res.json({
      success: true,
      data: { email_preferences: updatedSettings.email_preferences },
      message: "Email preferences updated successfully"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid email preferences",
        details: error.errors
      });
    }
    
    console.error("Update email preferences error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// PATCH /api/me/settings/privacy - Update only privacy preferences
router.patch("/me/settings/privacy", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const privacyUpdates = privacyPreferencesSchema.parse(req.body);
    
    const updatedSettings = updateUserSettings(user.id, {
      privacy_preferences: privacyUpdates
    });
    
    logSecurityEvent("privacy_preferences_updated", {
      userId: user.id,
      preferences: privacyUpdates,
    }, req);
    
    res.json({
      success: true,
      data: { privacy_preferences: updatedSettings.privacy_preferences },
      message: "Privacy preferences updated successfully"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid privacy preferences",
        details: error.errors
      });
    }
    
    console.error("Update privacy preferences error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// PATCH /api/me/settings/discovery - Update only discovery preferences
router.patch("/me/settings/discovery", authenticateToken, validateSettingsConsistency, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const discoveryUpdates = discoveryPreferencesSchema.parse(req.body);
    
    const updatedSettings = updateUserSettings(user.id, {
      discovery_preferences: discoveryUpdates
    });
    
    logSecurityEvent("discovery_preferences_updated", {
      userId: user.id,
      preferences: discoveryUpdates,
    }, req);
    
    res.json({
      success: true,
      data: { discovery_preferences: updatedSettings.discovery_preferences },
      message: "Discovery preferences updated successfully"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid discovery preferences",
        details: error.errors
      });
    }
    
    console.error("Update discovery preferences error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

export default router;
