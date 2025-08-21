import { Request, Response, NextFunction } from 'express';
import { UserRole, PERMISSION_LEVELS } from '../../src/types/database';

// Extend Express Request to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        is_banned?: boolean;
        is_verified?: boolean;
      };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
    is_banned?: boolean;
    is_verified?: boolean;
  };
}

/**
 * Middleware to extract and validate user from request
 * In a real app, this would verify JWT tokens or session data
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  // TODO: In production, implement actual authentication
  // For now, we'll use a mock user from headers for development
  
  const userId = req.headers['x-user-id'] as string;
  const userRole = (req.headers['x-user-role'] as UserRole) || 'user';
  const userEmail = req.headers['x-user-email'] as string || 'user@example.com';
  
  if (!userId) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'User ID not found in request headers'
    });
  }

  // Mock user object - in production, fetch from database
  req.user = {
    id: userId,
    email: userEmail,
    role: userRole,
    is_banned: false,
    is_verified: true
  };

  next();
}

/**
 * Middleware to require minimum permission level
 */
export function requirePermission(minLevel: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated'
      });
    }

    const userLevel = PERMISSION_LEVELS[req.user.role];
    
    if (userLevel < minLevel) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Required permission level: ${minLevel}, user level: ${userLevel}`,
        userRole: req.user.role,
        requiredRoles: Object.keys(PERMISSION_LEVELS).filter(
          role => PERMISSION_LEVELS[role as UserRole] >= minLevel
        )
      });
    }

    next();
  };
}

/**
 * Middleware to require specific role
 */
export function requireRole(role: UserRole) {
  return requirePermission(PERMISSION_LEVELS[role]);
}

/**
 * Middleware to require support level access (support, editor, or admin)
 */
export const requireSupport = requireRole('support');

/**
 * Middleware to require editor level access (editor or admin)
 */
export const requireEditor = requireRole('editor');

/**
 * Middleware to require admin access
 */
export const requireAdmin = requireRole('admin');

/**
 * Check if user has permission for specific action
 */
export function hasPermission(user: { role: UserRole }, minLevel: number): boolean {
  return PERMISSION_LEVELS[user.role] >= minLevel;
}

/**
 * Check if user has specific role or higher
 */
export function hasRole(user: { role: UserRole }, role: UserRole): boolean {
  return hasPermission(user, PERMISSION_LEVELS[role]);
}

/**
 * Get all roles that have at least the specified permission level
 */
export function getRolesWithPermission(minLevel: number): UserRole[] {
  return Object.keys(PERMISSION_LEVELS).filter(
    role => PERMISSION_LEVELS[role as UserRole] >= minLevel
  ) as UserRole[];
}

/**
 * Middleware to check if user is not banned
 */
export function requireNotBanned(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  if (req.user.is_banned) {
    return res.status(403).json({
      error: 'Account banned',
      message: 'Your account has been banned and cannot perform this action'
    });
  }

  next();
}

/**
 * Middleware to check if user is verified
 */
export function requireVerified(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  if (!req.user.is_verified) {
    return res.status(403).json({
      error: 'Account not verified',
      message: 'Your account must be verified to perform this action'
    });
  }

  next();
}

/**
 * Combine multiple middleware functions
 */
export function combineMiddleware(...middlewares: Function[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    let index = 0;

    function executeNext(): void {
      if (index >= middlewares.length) {
        return next();
      }

      const middleware = middlewares[index++];
      middleware(req, res, executeNext);
    }

    executeNext();
  };
}

/**
 * Common admin middleware stack
 */
export const adminMiddleware = combineMiddleware(
  authenticate,
  requireNotBanned,
  requireVerified,
  requireAdmin
);

/**
 * Common support middleware stack
 */
export const supportMiddleware = combineMiddleware(
  authenticate,
  requireNotBanned,
  requireVerified,
  requireSupport
);

/**
 * Common editor middleware stack
 */
export const editorMiddleware = combineMiddleware(
  authenticate,
  requireNotBanned,
  requireVerified,
  requireEditor
);
