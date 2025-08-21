import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from './ErrorBoundary';
import { ActionLoggerProvider } from './ActionLogger';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileDrawer';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { User } from '../types';
import { AuthGuard, authService } from '../lib/auth';
import { deadButtonScanner } from '../lib/dead-button-scanner';
import { useActionLoggerContext } from './ActionLogger';
import { ROUTES } from '../lib/constants';

interface LayoutProps {
  children?: React.ReactNode;
}

// Settings FAB component
function SettingsFAB({ user }: { user: User | null }) {
  const location = useLocation();
  const { logClick } = useActionLoggerContext();

  // Hide FAB on certain pages
  const hiddenRoutes = [ROUTES.DASHBOARD, ROUTES.ONBOARDING, ROUTES.MESSAGES, ROUTES.GAMES, ROUTES.AGENT];
  const shouldHide = hiddenRoutes.includes(location.pathname as any);

  if (!user || shouldHide) return null;

  const handleSettingsClick = () => {
    logClick('settings-fab', 'button', {
      action: 'open_settings',
      current_route: location.pathname
    });
    window.location.href = ROUTES.SETTINGS;
  };

  return (
    <Button
      onClick={handleSettingsClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg btn-primary md:hidden"
      aria-label="Open settings"
      style={{ zIndex: 'var(--sys-z-index-fixed)' }}
    >
      <Settings className="h-6 w-6" />
    </Button>
  );
}

// Route change logger component
function RouteChangeLogger({ user }: { user: User | null }) {
  const location = useLocation();
  const [previousRoute, setPreviousRoute] = useState<string>('');

  useEffect(() => {
    if (previousRoute && previousRoute !== location.pathname) {
      // This would ideally be done through the ActionLoggerProvider but we need to access it here
      console.log('[audit]', {
        event_type: 'ui.route_change',
        from_route: previousRoute,
        to_route: location.pathname,
        user_id: user?.id,
        timestamp: new Date().toISOString()
      });
    }
    setPreviousRoute(location.pathname);
  }, [location.pathname, previousRoute, user?.id]);

  // Run dead button scanner after route changes
  useEffect(() => {
    deadButtonScanner.runOnRouteChange();
  }, [location.pathname]);

  return null;
}

// Authentication wrapper component
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Get current user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      window.location.href = ROUTES.LANDING;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center faith-background">
        <div className="faith-symbols">
          <div className="faith-symbol cross-1">✝</div>
          <div className="faith-symbol heart-1">💛</div>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication guards
  const unauthRedirect = AuthGuard.checkUnauthenticated(user);
  if (unauthRedirect && location.pathname !== ROUTES.LANDING) {
    window.location.href = unauthRedirect;
    return null;
  }

  const onboardingRedirect = AuthGuard.checkOnboardingComplete(user);
  if (onboardingRedirect && location.pathname !== ROUTES.ONBOARDING && location.pathname !== ROUTES.LANDING) {
    window.location.href = onboardingRedirect;
    return null;
  }

  // Check verification status for dashboard access
  if (location.pathname === ROUTES.DASHBOARD && user && user.verification_status !== 'approved') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4 faith-background">
        <div className="faith-symbols">
          <div className="faith-symbol cross-1">✝</div>
          <div className="faith-symbol heart-1">💛</div>
        </div>
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Settings className="h-8 w-8 text-warning-600" />
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-4">
            Profile Under Review
          </h1>
          <p className="text-neutral-600 mb-6">
            We're reviewing your profile to ensure our community remains safe and welcoming. 
            This usually takes 24-48 hours.
          </p>
          <div className="bible-verse">
            "Wait for the Lord; be strong and take heart and wait for the Lord."
            <div className="text-sm text-neutral-500 mt-2">— Psalm 27:14</div>
          </div>
          <Button 
            onClick={() => window.location.href = ROUTES.PROFILE}
            className="mt-6 btn-primary"
          >
            View Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ActionLoggerProvider user={user}>
      <RouteChangeLogger user={user} />
      <LayoutContent user={user} onLogout={handleLogout}>
        {children}
      </LayoutContent>
    </ActionLoggerProvider>
  );
}

// Main layout content
function LayoutContent({ 
  user, 
  onLogout, 
  children 
}: { 
  user: User | null; 
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const location = useLocation();

  // Check if current route should show sidebar
  const isLandingPage = location.pathname === ROUTES.LANDING;
  const isOnboarding = location.pathname.startsWith('/onboarding');
  const shouldShowSidebar = user && !isLandingPage && !isOnboarding;

  return (
    <div className="min-h-screen bg-surface faith-background">
      {/* Faith-based background elements */}
      <div className="faith-symbols">
        <div className="faith-symbol cross-1">✝</div>
        <div className="faith-symbol cross-2">✝</div>
        <div className="faith-symbol heart-1">💛</div>
        <div className="faith-symbol heart-2">💛</div>
        <div className="faith-symbol dove-1">🕊</div>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        {shouldShowSidebar && (
          <div className="hidden md:flex md:flex-shrink-0">
            <Sidebar user={user} onLogout={onLogout} />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          {shouldShowSidebar && (
            <MobileHeader 
              user={user} 
              onLogout={onLogout}
              title={getPageTitle(location.pathname)}
            />
          )}

          {/* Page Content */}
          <main 
            className={cn(
              'flex-1 overflow-auto',
              shouldShowSidebar ? 'pb-safe-bottom' : ''
            )}
            style={{
              paddingBottom: shouldShowSidebar ? 'var(--sys-safe-area-bottom)' : undefined
            }}
          >
            {children || <Outlet />}
          </main>
        </div>
      </div>

      {/* Settings FAB */}
      <SettingsFAB user={user} />
    </div>
  );
}

// Helper function to get page title
function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    [ROUTES.DASHBOARD]: 'Daily Matches',
    [ROUTES.DISCOVER]: 'Discover',
    [ROUTES.MESSAGES]: 'Messages',
    [ROUTES.PROFILE]: 'Profile',
    [ROUTES.SETTINGS]: 'Settings',
    [ROUTES.CHURCHES]: 'Churches',
    [ROUTES.LEARNING]: 'Learning Hub',
    [ROUTES.GAMES]: 'Games',
    [ROUTES.PLANNER]: 'Planner',
    [ROUTES.AGENT]: 'Community Guide',
    [ROUTES.ADMIN]: 'Admin Panel'
  };
  
  return titles[pathname] || 'Other Half';
}

// Main Layout export with error boundary
export function Layout({ children }: LayoutProps) {
  // Run dead button scanner after each render in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      deadButtonScanner.runAfterRender();
    }
  });

  return (
    <ErrorBoundary>
      <AuthWrapper>
        {children}
      </AuthWrapper>
    </ErrorBoundary>
  );
}

export default Layout;
