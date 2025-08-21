// server/routes/builder-api.ts
import { Router, Request, Response } from "express";
import { z } from "zod";
import { authenticateToken } from "./auth";
import { logSecurityEvent } from "../../src/middleware/security";
import { realtimeService } from "../../src/services/realtime";
import type { 
  User, 
  UserSettings,
  UpdateUserProfileRequest,
  ProfileVisibility,
  AppTheme,
  ChurchDenomination
} from "../../src/types/database";

const router = Router();

// Import existing data from other route files
// In real implementation, this would be a database service
let mockUsers: User[] = [
  {
    id: "user1",
    email: "test@example.com",
    full_name: "Test User",
    age: 25,
    bio: "Faith-centered person looking for meaningful connections",
    denomination: "catholic",
    church_attendance: "weekly",
    interests: ["hiking", "reading", "worship"],
    role: "user",
    is_banned: false,
    verification_status: "verified",
    subscription_tier: "free",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

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

// Schema validations
const settingsUpdateSchema = z.object({
  push_preferences: z.object({
    marketing: z.boolean().optional(),
    social: z.boolean().optional(),
    security: z.boolean().optional(),
    matches: z.boolean().optional(),
    messages: z.boolean().optional(),
    likes: z.boolean().optional(),
  }).optional(),
  email_preferences: z.object({
    marketing: z.boolean().optional(),
    social: z.boolean().optional(),
    security: z.boolean().optional(),
    matches: z.boolean().optional(),
    messages: z.boolean().optional(),
    weekly_digest: z.boolean().optional(),
  }).optional(),
  privacy_preferences: z.object({
    profile_visibility: z.enum(['public', 'matches_only', 'private']).optional(),
    show_age: z.boolean().optional(),
    show_distance: z.boolean().optional(),
    show_last_active: z.boolean().optional(),
    show_online_status: z.boolean().optional(),
    discoverable: z.boolean().optional(),
  }).optional(),
  discovery_preferences: z.object({
    min_age: z.number().int().min(18).max(100).optional(),
    max_age: z.number().int().min(18).max(100).optional(),
    max_distance_km: z.number().int().min(1).max(500).optional(),
    preferred_denominations: z.array(z.enum([
      'catholic', 'protestant', 'orthodox', 'baptist', 'methodist',
      'presbyterian', 'pentecostal', 'lutheran', 'anglican', 
      'evangelical', 'non_denominational'
    ])).optional(),
    required_verification: z.boolean().optional(),
  }).optional(),
  theme: z.enum(['light', 'dark', 'system', 'faith']).optional(),
  language: z.string().min(2).max(5).optional(),
}).strict();

const userUpdateSchema = z.object({
  full_name: z.string().min(1).max(255).optional(),
  age: z.number().int().min(18).max(100).optional(),
  bio: z.string().max(1000).optional(),
  denomination: z.enum([
    'catholic', 'protestant', 'orthodox', 'baptist', 'methodist',
    'presbyterian', 'pentecostal', 'lutheran', 'anglican', 
    'evangelical', 'non_denominational', 'other'
  ]).optional(),
  church_attendance: z.enum(['weekly', 'monthly', 'occasionally', 'holidays_only', 'never']).optional(),
  interests: z.array(z.string()).max(20).optional(),
  looking_for: z.string().max(100).optional(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
}).strict();

const blockUserSchema = z.object({
  reason: z.string().max(500).optional(),
}).strict();

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
    const newSettings = createDefaultSettings(userId);
    return updateUserSettings(userId, updates);
  }
  
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

function findUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}

function updateUser(id: string, updates: Partial<User>): User | null {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) return null;
  
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  return mockUsers[userIndex];
}

// Validation middleware
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
  
  // Security email notifications cannot be disabled
  if (updates.email_preferences?.security === false) {
    return res.status(400).json({
      success: false,
      error: "Security email notifications are required and cannot be disabled",
    });
  }
  
  next();
}

// API Routes

// GET /api/settings/me - Get current user's settings
router.get("/settings/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    let settings = findUserSettings(user.id);
    
    if (!settings) {
      settings = createDefaultSettings(user.id);
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    console.error("Get settings error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// PUT /api/settings/me - Update current user's settings 
router.put("/settings/me", authenticateToken, validateSettingsConsistency, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const validatedUpdates = settingsUpdateSchema.parse(req.body);
    
    let currentSettings = findUserSettings(user.id);
    if (!currentSettings) {
      currentSettings = createDefaultSettings(user.id);
    }
    
    const updatedSettings = updateUserSettings(user.id, validatedUpdates);
    
    // Log settings changes
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

    // Publish real-time update
    await realtimeService.publishSettingsUpdate(user.id, updatedSettings);

    res.json({
      success: true,
      data: updatedSettings,
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

// PATCH /api/users/:id - Update user profile
router.patch("/users/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const { id } = req.params;
    
    // Users can only update their own profile
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: "Forbidden: Can only update your own profile" 
      });
    }
    
    const validatedData = userUpdateSchema.parse(req.body);
    
    // Process location with geocoding
    let locationData = undefined;
    if (validatedData.location) {
      locationData = {
        lat: validatedData.location.lat,
        lng: validatedData.location.lng,
        geohash: `mock_${validatedData.location.lat}_${validatedData.location.lng}`,
        locality: "Mock City",
        country: "Mock Country"
      };
    }
    
    const updateData: Partial<User> = {
      ...validatedData,
      location: locationData,
    };
    
    const updatedUser = updateUser(id, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }
    
    logSecurityEvent("profile_updated", {
      userId: id,
      fields: Object.keys(validatedData),
      updatedBy: currentUser.id,
    }, req);
    
    // Remove sensitive fields for response
    const { ...safeUser } = updatedUser;
    
    res.json({
      success: true,
      data: safeUser,
      message: "Profile updated successfully"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid profile data",
        details: error.errors
      });
    }
    
    console.error("Update user profile error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// POST /api/blocks - Block a user
router.post("/blocks", authenticateToken, async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const { userId: targetUserId } = req.body;
    const validatedData = blockUserSchema.parse(req.body);
    
    if (!targetUserId) {
      return res.status(400).json({ 
        success: false, 
        error: "userId is required" 
      });
    }
    
    if (currentUser.id === targetUserId) {
      return res.status(400).json({ 
        success: false, 
        error: "Cannot block yourself" 
      });
    }
    
    const targetUser = findUserById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }
    
    let settings = findUserSettings(currentUser.id);
    if (!settings) {
      settings = createDefaultSettings(currentUser.id);
    }
    
    // Add to blocked users list
    const blockedUserIds = settings.blocked_user_ids || [];
    if (!blockedUserIds.includes(targetUserId)) {
      blockedUserIds.push(targetUserId);
      
      updateUserSettings(currentUser.id, {
        blocked_user_ids: blockedUserIds,
      });
    }
    
    logSecurityEvent("user_blocked", {
      blockerId: currentUser.id,
      blockedId: targetUserId,
      reason: validatedData.reason,
    }, req);
    
    res.json({
      success: true,
      data: { 
        blockedUserId: targetUserId,
        blockedAt: new Date().toISOString()
      },
      message: "User blocked successfully"
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid block data",
        details: error.errors
      });
    }
    
    console.error("Block user error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// DELETE /api/blocks/:blockedId - Unblock a user
router.delete("/blocks/:blockedId", authenticateToken, async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const { blockedId } = req.params;
    
    let settings = findUserSettings(currentUser.id);
    if (!settings) {
      return res.status(404).json({ 
        success: false, 
        error: "User settings not found" 
      });
    }
    
    // Remove from blocked users list
    const blockedUserIds = settings.blocked_user_ids || [];
    const updatedBlockedUserIds = blockedUserIds.filter(id => id !== blockedId);
    
    if (blockedUserIds.length === updatedBlockedUserIds.length) {
      return res.status(404).json({ 
        success: false, 
        error: "User was not blocked" 
      });
    }
    
    updateUserSettings(currentUser.id, {
      blocked_user_ids: updatedBlockedUserIds,
    });
    
    logSecurityEvent("user_unblocked", {
      blockerId: currentUser.id,
      unblockedId: blockedId,
    }, req);
    
    res.json({
      success: true,
      data: {
        unblockedUserId: blockedId,
        unblockedAt: new Date().toISOString()
      },
      message: "User unblocked successfully"
    });
  } catch (error: any) {
    console.error("Unblock user error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// GET /api/users/:id - Get user profile with real-time updates support
router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = findUserById(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }
    
    if (user.is_banned) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }
    
    // Sanitize user data for public view
    const { 
      id: userId, full_name, age, bio, denomination, church_attendance, 
      interests, face_photo_url, additional_photos, verification_status,
      created_at, updated_at, last_active_at 
    } = user;
    
    const publicProfile = {
      id: userId, 
      full_name, 
      age, 
      bio, 
      denomination, 
      church_attendance,
      interests, 
      face_photo_url, 
      additional_photos, 
      verification_status,
      created_at,
      updated_at,
      last_active_at
    };
    
    res.json({
      success: true,
      data: publicProfile
    });
  } catch (error: any) {
    console.error("Get user profile error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

// GET /api/blocks - Get current user's blocked users list
router.get("/blocks", authenticateToken, async (req: Request, res: Response) => {
  try {
    const currentUser = (req as any).user;
    const settings = findUserSettings(currentUser.id);
    
    if (!settings) {
      return res.json({
        success: true,
        data: { blockedUserIds: [] }
      });
    }
    
    res.json({
      success: true,
      data: { 
        blockedUserIds: settings.blocked_user_ids || [],
        total: (settings.blocked_user_ids || []).length
      }
    });
  } catch (error: any) {
    console.error("Get blocked users error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

export default router;
