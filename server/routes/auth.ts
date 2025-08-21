import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
});

// Mock user database (replace with real DB)
interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'user' | 'support' | 'editor' | 'admin';
  subscription_tier: 'free' | 'plus' | 'pro' | 'premium';
  is_verified: boolean;
  created_at: string;
  profile?: {
    photos?: string[];
    bio?: string;
    age?: number;
    interests?: string[];
  };
}

let mockUsers: User[] = [
  {
    id: 'user_1',
    email: 'user@example.com',
    name: 'Demo User',
    password_hash: '$2b$10$rBcF.J0mLKF6vULq3i.6POwyF7JfJl4F4y0WxPwBf2LMy7f1k2Uqm', // "password123"
    role: 'user',
    subscription_tier: 'free',
    is_verified: true,
    created_at: new Date().toISOString(),
    profile: {
      photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
      bio: 'Demo user for testing',
      age: 28,
      interests: ['music', 'travel', 'food']
    }
  },
  {
    id: 'admin_1',
    email: 'admin@example.com',
    name: 'Admin User',
    password_hash: '$2b$10$rBcF.J0mLKF6vULq3i.6POwyF7JfJl4F4y0WxPwBf2LMy7f1k2Uqm', // "password123"
    role: 'admin',
    subscription_tier: 'premium',
    is_verified: true,
    created_at: new Date().toISOString()
  }
];

function generateToken(user: User): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function verifyToken(token: string): { userId: string; email: string; role: string } {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
}

function sanitizeUser(user: User) {
  const { password_hash, ...sanitized } = user;
  return sanitized;
}

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const body = registerSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === body.email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Hash password (simple hash for development - use bcrypt in production)
    const password_hash = crypto.createHash('sha256').update(body.password).digest('hex');
    
    // Create user
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: body.email,
      name: body.name,
      password_hash,
      role: 'user',
      subscription_tier: 'free',
      is_verified: false,
      created_at: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    // Generate token
    const token = generateToken(newUser);
    
    res.status(201).json({
      user: sanitizeUser(newUser),
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);
    
    // Find user
    const user = mockUsers.find(u => u.email === body.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Verify password (simple comparison for development - use bcrypt in production)
    const hashedPassword = crypto.createHash('sha256').update(body.password).digest('hex');
    const isValidPassword = hashedPassword === user.password_hash;
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', (req, res) => {
  // In a real implementation, you might blacklist the token
  res.json({ message: 'Logged out successfully' });
});

/**
 * Middleware to authenticate requests
 */
export function authenticateToken(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = sanitizeUser(user);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export default router;
