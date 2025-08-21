// server/routes/user-profile.ts
import { Router, Request, Response } from "express";
import { z } from "zod";
import { authenticateToken } from "./auth";
import { logSecurityEvent } from "../../src/middleware/security";
import type {
  User,
  UpdateUserProfileRequest,
  ChurchDenomination,
  ApiResponse,
} from "../../src/types/database";

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(255).optional(),
  age: z.number().int().min(18).max(100).optional(),
  bio: z.string().max(1000).optional(),
  denomination: z
    .enum([
      "catholic",
      "protestant",
      "orthodox",
      "baptist",
      "methodist",
      "presbyterian",
      "pentecostal",
      "lutheran",
      "anglican",
      "evangelical",
      "non_denominational",
      "other",
    ])
    .optional(),
  church_attendance: z
    .enum(["weekly", "monthly", "occasionally", "holidays_only", "never"])
    .optional(),
  interests: z.array(z.string()).max(20).optional(),
  looking_for: z.string().max(100).optional(),
  location: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});

const updateLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  timestamp: z.string().optional(),
  sharing: z.boolean().optional(),
});

// Mock user storage (replace with real database)
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
  },
];

// Helper functions
function sanitizeUserForPublic(user: User): Partial<User> {
  const {
    id,
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
  } = user;

  return {
    id,
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
  };
}

function sanitizeUserForOwner(user: User): User {
  // Owner sees everything except sensitive internal fields
  const { ...sanitized } = user;
  return sanitized;
}

function findUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

function updateUser(id: string, updates: Partial<User>): User | null {
  const userIndex = mockUsers.findIndex((user) => user.id === id);
  if (userIndex === -1) return null;

  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  return mockUsers[userIndex];
}

// Routes

// GET /api/users/:id - Public profile view
router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = findUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.is_banned) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check privacy settings (would check user settings in real implementation)
    const publicProfile = sanitizeUserForPublic(user);

    res.json({
      success: true,
      data: { user: publicProfile },
    });
  } catch (error: any) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// GET /api/me - Get current user's full profile
router.get("/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const fullUser = findUserById(user.id);

    if (!fullUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const sanitizedUser = sanitizeUserForOwner(fullUser);

    res.json({
      success: true,
      data: { user: sanitizedUser },
    });
  } catch (error: any) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// PUT /api/me - Update current user's profile
router.put("/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const validatedData = updateProfileSchema.parse(req.body);

    // Process location with reverse geocoding (mock implementation)
    let locationData = undefined;
    if (validatedData.location) {
      locationData = {
        lat: validatedData.location.lat,
        lng: validatedData.location.lng,
        geohash: `mock_${validatedData.location.lat}_${validatedData.location.lng}`,
        locality: "Mock City", // Would use reverse geocoding service
        country: "Mock Country",
      };
    }

    const updateData: Partial<User> = {
      ...validatedData,
      location: locationData,
    };

    const updatedUser = updateUser(user.id, updateData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    logSecurityEvent(
      "profile_updated",
      {
        userId: user.id,
        fields: Object.keys(validatedData),
      },
      req,
    );

    const sanitizedUser = sanitizeUserForOwner(updatedUser);

    res.json({
      success: true,
      data: { user: sanitizedUser },
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid input data",
        details: error.errors,
      });
    }

    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// PUT /api/me/location - Update user's location
router.put(
  "/me/location",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const validatedData = updateLocationSchema.parse(req.body);

      // Mock reverse geocoding
      const locationData = {
        lat: validatedData.lat,
        lng: validatedData.lng,
        geohash: `mock_${validatedData.lat}_${validatedData.lng}`,
        locality: "Mock City",
        country: "Mock Country",
      };

      const updatedUser = updateUser(user.id, {
        location: locationData,
        last_active_at: new Date().toISOString(),
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      logSecurityEvent(
        "location_updated",
        {
          userId: user.id,
          lat: validatedData.lat,
          lng: validatedData.lng,
        },
        req,
      );

      res.json({
        success: true,
        data: {
          location: locationData,
          updated_at: updatedUser.updated_at,
        },
        message: "Location updated successfully",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: "Invalid location data",
          details: error.errors,
        });
      }

      console.error("Update location error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
);

// POST /api/users/:id/block - Block a user
router.post(
  "/users/:id/block",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user;
      const { id: targetUserId } = req.params;
      const { reason } = req.body;

      if (currentUser.id === targetUserId) {
        return res.status(400).json({
          success: false,
          error: "Cannot block yourself",
        });
      }

      const targetUser = findUserById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const user = findUserById(currentUser.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Current user not found",
        });
      }

      // Add to blocked users list
      const blockedUsers = user.blocked_users || [];
      if (!blockedUsers.includes(targetUserId)) {
        blockedUsers.push(targetUserId);

        updateUser(currentUser.id, {
          blocked_users: blockedUsers,
        });
      }

      logSecurityEvent(
        "user_blocked",
        {
          blockerId: currentUser.id,
          blockedId: targetUserId,
          reason,
        },
        req,
      );

      res.json({
        success: true,
        data: { blockedUserId: targetUserId },
        message: "User blocked successfully",
      });
    } catch (error: any) {
      console.error("Block user error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
);

// DELETE /api/users/:id/block - Unblock a user
router.delete(
  "/users/:id/block",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user;
      const { id: targetUserId } = req.params;

      const user = findUserById(currentUser.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Current user not found",
        });
      }

      // Remove from blocked users list
      const blockedUsers = user.blocked_users || [];
      const updatedBlockedUsers = blockedUsers.filter(
        (id) => id !== targetUserId,
      );

      updateUser(currentUser.id, {
        blocked_users: updatedBlockedUsers,
      });

      logSecurityEvent(
        "user_unblocked",
        {
          blockerId: currentUser.id,
          unblockedId: targetUserId,
        },
        req,
      );

      res.json({
        success: true,
        message: "User unblocked successfully",
      });
    } catch (error: any) {
      console.error("Unblock user error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
);

// GET /api/me/blocks - Get blocked users list
router.get(
  "/me/blocks",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const currentUser = (req as any).user;
      const user = findUserById(currentUser.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.json({
        success: true,
        data: { blockedUserIds: user.blocked_users || [] },
      });
    } catch (error: any) {
      console.error("Get blocked users error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
);

export default router;
