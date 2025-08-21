import { Router } from 'express';
import { z } from 'zod';
import { UserRole } from '../../src/types/database';
import { 
  authenticate, 
  requirePermission, 
  adminMiddleware,
  supportMiddleware,
  editorMiddleware,
  AuthenticatedRequest,
  hasPermission
} from '../lib/rbac';

const router = Router();

// Validation schemas
const userActionSchema = z.object({
  reason: z.string().optional(),
  duration: z.number().optional(), // Duration in days for temporary bans
  metadata: z.record(z.any()).optional()
});

const roleChangeSchema = z.object({
  newRole: z.enum(['user', 'support', 'editor', 'admin']),
  reason: z.string()
});

const bulkActionSchema = z.object({
  userIds: z.array(z.string()),
  reason: z.string(),
  metadata: z.record(z.any()).optional()
});

const userQuerySchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '20')),
  search: z.string().optional(),
  role: z.enum(['user', 'support', 'editor', 'admin']).optional(),
  status: z.enum(['active', 'banned', 'unverified']).optional(),
  subscription: z.enum(['free', 'plus', 'pro', 'premium']).optional(),
  sortBy: z.enum(['created_at', 'last_active', 'email']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

// Mock user database (in production, use actual database)
interface MockUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_banned: boolean;
  is_verified: boolean;
  subscription_tier: string;
  created_at: string;
  last_active: string;
  profile_data?: any;
}

let mockUsers: MockUser[] = [
  {
    id: 'user_1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user',
    is_banned: false,
    is_verified: true,
    subscription_tier: 'free',
    created_at: '2024-01-15T10:00:00Z',
    last_active: '2024-01-20T15:30:00Z'
  },
  {
    id: 'user_2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'user',
    is_banned: false,
    is_verified: false,
    subscription_tier: 'pro',
    created_at: '2024-01-10T08:00:00Z',
    last_active: '2024-01-21T12:00:00Z'
  },
  {
    id: 'user_3',
    email: 'support@example.com',
    name: 'Support User',
    role: 'support',
    is_banned: false,
    is_verified: true,
    subscription_tier: 'free',
    created_at: '2024-01-01T09:00:00Z',
    last_active: '2024-01-21T16:00:00Z'
  }
];

/**
 * GET /api/admin/users
 * List users with filtering and pagination
 */
router.get('/users', supportMiddleware, (req, res) => {
  try {
    const query = userQuerySchema.parse(req.query);
    let filteredUsers = [...mockUsers];

    // Apply filters
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(searchLower) ||
        user.name.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower)
      );
    }

    if (query.role) {
      filteredUsers = filteredUsers.filter(user => user.role === query.role);
    }

    if (query.status) {
      filteredUsers = filteredUsers.filter(user => {
        switch (query.status) {
          case 'banned': return user.is_banned;
          case 'unverified': return !user.is_verified;
          case 'active': return !user.is_banned && user.is_verified;
          default: return true;
        }
      });
    }

    if (query.subscription) {
      filteredUsers = filteredUsers.filter(user => user.subscription_tier === query.subscription);
    }

    // Apply sorting
    if (query.sortBy) {
      filteredUsers.sort((a, b) => {
        let aVal: any, bVal: any;
        
        switch (query.sortBy) {
          case 'created_at':
            aVal = new Date(a.created_at);
            bVal = new Date(b.created_at);
            break;
          case 'last_active':
            aVal = new Date(a.last_active);
            bVal = new Date(b.last_active);
            break;
          case 'email':
            aVal = a.email;
            bVal = b.email;
            break;
          default:
            return 0;
        }

        if (query.sortOrder === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        } else {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        }
      });
    }

    // Apply pagination
    const startIndex = (query.page - 1) * query.limit;
    const endIndex = startIndex + query.limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json({
      users: paginatedUsers,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / query.limit),
        hasNext: endIndex < filteredUsers.length,
        hasPrev: query.page > 1
      },
      filters: {
        search: query.search,
        role: query.role,
        status: query.status,
        subscription: query.subscription,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid query parameters', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /api/admin/users/:id
 * Get detailed user information
 */
router.get('/users/:id', supportMiddleware, (req, res) => {
  try {
    const userId = req.params.id;
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * POST /api/admin/users/:id/ban
 * Ban a user
 */
router.post('/users/:id/ban', editorMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.params.id;
    const body = userActionSchema.parse(req.body);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const targetUser = mockUsers[userIndex];
    
    // Prevent banning users with equal or higher permissions
    if (hasPermission(targetUser, hasPermission(req.user, 0) ? 999 : 0)) {
      return res.status(403).json({ 
        error: 'Cannot ban user with equal or higher permissions' 
      });
    }

    mockUsers[userIndex] = {
      ...targetUser,
      is_banned: true
    };

    // TODO: Log admin action to audit trail
    console.log(`Admin ${req.user.id} banned user ${userId}`, {
      reason: body.reason,
      duration: body.duration,
      adminId: req.user.id,
      targetUserId: userId
    });

    res.json({ 
      message: 'User banned successfully',
      user: mockUsers[userIndex]
    });
  } catch (error) {
    console.error('Error banning user:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

/**
 * POST /api/admin/users/:id/unban
 * Unban a user
 */
router.post('/users/:id/unban', editorMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.params.id;
    const body = userActionSchema.parse(req.body);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      is_banned: false
    };

    // TODO: Log admin action to audit trail
    console.log(`Admin ${req.user.id} unbanned user ${userId}`, {
      reason: body.reason,
      adminId: req.user.id,
      targetUserId: userId
    });

    res.json({ 
      message: 'User unbanned successfully',
      user: mockUsers[userIndex]
    });
  } catch (error) {
    console.error('Error unbanning user:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to unban user' });
  }
});

/**
 * POST /api/admin/users/:id/promote
 * Promote user to higher role
 */
router.post('/users/:id/promote', adminMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.params.id;
    const body = roleChangeSchema.parse(req.body);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const targetUser = mockUsers[userIndex];
    const oldRole = targetUser.role;

    mockUsers[userIndex] = {
      ...targetUser,
      role: body.newRole
    };

    // TODO: Log admin action to audit trail
    console.log(`Admin ${req.user.id} changed user ${userId} role from ${oldRole} to ${body.newRole}`, {
      reason: body.reason,
      adminId: req.user.id,
      targetUserId: userId,
      oldRole,
      newRole: body.newRole
    });

    res.json({ 
      message: 'User role updated successfully',
      user: mockUsers[userIndex],
      changes: {
        oldRole,
        newRole: body.newRole
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

/**
 * POST /api/admin/users/bulk-ban
 * Ban multiple users
 */
router.post('/users/bulk-ban', adminMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    const body = bulkActionSchema.parse(req.body);
    const results: { userId: string; success: boolean; error?: string }[] = [];

    for (const userId of body.userIds) {
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        results.push({ userId, success: false, error: 'User not found' });
        continue;
      }

      const targetUser = mockUsers[userIndex];
      
      // Check permissions
      if (hasPermission(targetUser, hasPermission(req.user, 0) ? 999 : 0)) {
        results.push({ 
          userId, 
          success: false, 
          error: 'Cannot ban user with equal or higher permissions' 
        });
        continue;
      }

      mockUsers[userIndex] = {
        ...targetUser,
        is_banned: true
      };

      results.push({ userId, success: true });
    }

    // TODO: Log bulk admin action to audit trail
    console.log(`Admin ${req.user.id} performed bulk ban`, {
      reason: body.reason,
      adminId: req.user.id,
      userIds: body.userIds,
      results
    });

    res.json({ 
      message: 'Bulk ban operation completed',
      results,
      summary: {
        total: body.userIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    });
  } catch (error) {
    console.error('Error performing bulk ban:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to perform bulk ban' });
  }
});

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
router.get('/stats', supportMiddleware, (req, res) => {
  try {
    const stats = {
      users: {
        total: mockUsers.length,
        active: mockUsers.filter(u => !u.is_banned && u.is_verified).length,
        banned: mockUsers.filter(u => u.is_banned).length,
        unverified: mockUsers.filter(u => !u.is_verified).length
      },
      roles: {
        user: mockUsers.filter(u => u.role === 'user').length,
        support: mockUsers.filter(u => u.role === 'support').length,
        editor: mockUsers.filter(u => u.role === 'editor').length,
        admin: mockUsers.filter(u => u.role === 'admin').length
      },
      subscriptions: {
        free: mockUsers.filter(u => u.subscription_tier === 'free').length,
        plus: mockUsers.filter(u => u.subscription_tier === 'plus').length,
        pro: mockUsers.filter(u => u.subscription_tier === 'pro').length,
        premium: mockUsers.filter(u => u.subscription_tier === 'premium').length
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

export default router;
