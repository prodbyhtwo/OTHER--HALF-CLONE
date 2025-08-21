import { User } from '../types';
import { ROUTES, VERIFICATION_STATUS } from './constants';

export class AuthGuard {
  static checkUnauthenticated(user: User | null): string | null {
    if (!user) {
      return ROUTES.LANDING;
    }
    return null;
  }

  static checkOnboardingComplete(user: User | null): string | null {
    if (!user) return ROUTES.LANDING;
    
    if (!user.onboarding_complete) {
      return ROUTES.ONBOARDING;
    }
    return null;
  }

  static checkVerificationStatus(user: User | null): string | null {
    if (!user) return ROUTES.LANDING;
    
    if (!user.onboarding_complete) {
      return ROUTES.ONBOARDING;
    }
    
    if (user.verification_status !== VERIFICATION_STATUS.APPROVED) {
      // Block dashboard access for non-approved users
      return null; // Will show "Profile under review" message
    }
    
    return null;
  }

  static checkAdminAccess(user: User | null): boolean {
    return user?.role === 'admin';
  }

  static canAccessDashboard(user: User | null): boolean {
    if (!user) return false;
    if (!user.onboarding_complete) return false;
    if (user.verification_status !== VERIFICATION_STATUS.APPROVED) return false;
    return true;
  }

  static canAccessRoute(route: string, user: User | null): boolean {
    // Public routes
    if (route === ROUTES.LANDING) return true;
    
    // Authenticated routes
    if (!user) return false;
    
    // Onboarding route - accessible if not complete
    if (route === ROUTES.ONBOARDING) {
      return !user.onboarding_complete;
    }
    
    // Routes requiring completed onboarding
    const protectedRoutes = [
      ROUTES.DASHBOARD,
      ROUTES.DISCOVER, 
      ROUTES.MESSAGES,
      ROUTES.PROFILE,
      ROUTES.SETTINGS,
      ROUTES.CHURCHES,
      ROUTES.LEARNING,
      ROUTES.GAMES,
      ROUTES.PLANNER,
      ROUTES.AGENT
    ];
    
    if (protectedRoutes.includes(route as any)) {
      if (!user.onboarding_complete) return false;
    }
    
    // Dashboard requires verification
    if (route === ROUTES.DASHBOARD) {
      return user.verification_status === VERIFICATION_STATUS.APPROVED;
    }
    
    // Admin routes
    if (route === ROUTES.ADMIN) {
      return user.role === 'admin';
    }
    
    return true;
  }
}

// Mock auth functions - replace with real implementation
export const authService = {
  getCurrentUser: (): User | null => {
    // Mock user data - replace with real API call
    const mockUser: User = {
      id: '1',
      email: 'user@example.com',
      full_name: 'John Doe',
      age: 28,
      location: 'Austin, TX',
      bio: 'Christ-follower seeking meaningful connection',
      denomination: 'Baptist',
      church_attendance: 'weekly',
      love_language: 'words_of_affirmation',
      personality_type: 'ENFJ',
      looking_for: 'marriage',
      interests: ['hiking', 'worship', 'serving'],
      availability: ['weekend_mornings', 'weekday_evenings'],
      preferred_age_min: 25,
      preferred_age_max: 35,
      max_distance: 50,
      onboarding_complete: true,
      verification_status: 'approved',
      profile_visible: true,
      show_location: true,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return mockUser;
  },

  login: async (email: string, password: string): Promise<User> => {
    // Mock login - replace with real implementation
    throw new Error('Login not implemented');
  },

  logout: async (): Promise<void> => {
    // Mock logout - replace with real implementation
    console.log('User logged out');
  },

  updateUser: async (userData: Partial<User>): Promise<User> => {
    // Mock update - replace with real implementation
    throw new Error('Update user not implemented');
  }
};
