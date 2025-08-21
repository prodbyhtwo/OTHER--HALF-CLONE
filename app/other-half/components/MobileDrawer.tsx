import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu,
  Heart, 
  Search, 
  BookOpen, 
  Bot, 
  Gamepad2, 
  Calendar, 
  Church, 
  MessageCircle,
  Settings,
  LogOut,
  Shield,
  User,
  X
} from 'lucide-react';
import { ROUTES } from '../lib/constants';
import { User as UserType } from '../types';
import { useActionLoggerContext } from './ActionLogger';

interface MobileDrawerProps {
  user: UserType | null;
  onLogout: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

const navigationItems: NavItem[] = [
  {
    title: 'Daily Matches',
    href: ROUTES.DASHBOARD,
    icon: Heart,
    requiresAuth: true
  },
  {
    title: 'Discover',
    href: ROUTES.DISCOVER,
    icon: Search,
    requiresAuth: true
  },
  {
    title: 'Learning Hub',
    href: ROUTES.LEARNING,
    icon: BookOpen,
    requiresAuth: true
  },
  {
    title: 'Community Guide',
    href: ROUTES.AGENT,
    icon: Bot,
    requiresAuth: true
  },
  {
    title: 'Games',
    href: ROUTES.GAMES,
    icon: Gamepad2,
    requiresAuth: true
  },
  {
    title: 'Planner',
    href: ROUTES.PLANNER,
    icon: Calendar,
    requiresAuth: true
  },
  {
    title: 'Churches',
    href: ROUTES.CHURCHES,
    icon: Church,
    requiresAuth: true
  },
  {
    title: 'Messages',
    href: ROUTES.MESSAGES,
    icon: MessageCircle,
    requiresAuth: true
  }
];

export function MobileDrawer({ user, onLogout, isOpen, onOpenChange }: MobileDrawerProps) {
  const location = useLocation();
  const { logClick } = useActionLoggerContext();

  const handleNavigation = (href: string, title: string) => {
    logClick(`mobile-nav-${href.replace('/', '')}`, 'navigation', {
      destination: href,
      title,
      from: location.pathname,
      platform: 'mobile'
    });
    onOpenChange(false); // Close drawer after navigation
  };

  const handleLogout = () => {
    logClick('mobile-drawer-logout', 'button', { action: 'logout' });
    onLogout();
    onOpenChange(false);
  };

  const handleToggleDrawer = () => {
    logClick('mobile-drawer-toggle', 'button', {
      action: isOpen ? 'close' : 'open'
    });
    onOpenChange(!isOpen);
  };

  const filteredItems = navigationItems.filter(item => {
    if (item.requiresAuth && !user) return false;
    if (item.requiresAdmin && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleDrawer}
          className="p-2 h-10 w-10 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="w-80 p-0 faith-background"
        aria-describedby="mobile-navigation-description"
      >
        <div className="faith-symbols">
          <div className="faith-symbol cross-1">✝</div>
          <div className="faith-symbol heart-1">💛</div>
        </div>

        <SheetHeader className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold text-neutral-900">
                  Other Half
                </SheetTitle>
                <p className="text-sm text-neutral-500">Faith • Love • Community</p>
              </div>
            </div>
          </div>
          <p id="mobile-navigation-description" className="sr-only">
            Navigate through the Other Half app sections
          </p>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* User info */}
          {user && (
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className={cn(
                      'w-2 h-2 rounded-full mr-1',
                      user.verification_status === 'approved' 
                        ? 'bg-success-500' 
                        : 'bg-warning-500'
                    )} />
                    <span className="text-xs text-neutral-500 capitalize">
                      {user.verification_status === 'approved' ? 'Verified' : 'Pending Review'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3">
            <nav className="py-4 space-y-1" role="navigation" aria-label="Mobile navigation">
              {filteredItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => handleNavigation(item.href, item.title)}
                    className={cn(
                      'flex items-center px-3 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors',
                      isActive && 'bg-primary-100 text-primary-800 font-medium'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className={cn(
                      'h-5 w-5 flex-shrink-0 mr-3',
                      isActive ? 'text-primary-600' : 'text-neutral-500'
                    )} />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}

              {/* Admin Panel Link */}
              {user?.role === 'admin' && (
                <Link
                  to={ROUTES.ADMIN}
                  onClick={() => handleNavigation(ROUTES.ADMIN, 'Admin Panel')}
                  className={cn(
                    'flex items-center px-3 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors border-t border-neutral-200 mt-4 pt-4',
                    location.pathname === ROUTES.ADMIN && 'bg-primary-100 text-primary-800 font-medium'
                  )}
                >
                  <Shield className={cn(
                    'h-5 w-5 flex-shrink-0 mr-3',
                    location.pathname === ROUTES.ADMIN ? 'text-primary-600' : 'text-neutral-500'
                  )} />
                  <span className="font-medium">Admin Panel</span>
                </Link>
              )}
            </nav>
          </ScrollArea>

          {/* Footer actions */}
          {user && (
            <div className="p-6 border-t border-neutral-200 space-y-3">
              <Link
                to={ROUTES.SETTINGS}
                onClick={() => handleNavigation(ROUTES.SETTINGS, 'Settings')}
                className={cn(
                  'flex items-center px-3 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors w-full',
                  location.pathname === ROUTES.SETTINGS && 'bg-primary-100 text-primary-800 font-medium'
                )}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span className="font-medium">Settings</span>
              </Link>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center px-3 py-3 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors w-full justify-start"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span className="font-medium">Logout</span>
              </Button>
            </div>
          )}

          {/* Biblical verse footer */}
          <div className="p-6 border-t border-neutral-200">
            <div className="text-xs text-neutral-500 italic text-center bible-verse">
              "Two are better than one, because they have a good return for their labor."
              <div className="text-neutral-400 mt-1">— Ecclesiastes 4:9</div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Mobile header component for better UX
interface MobileHeaderProps {
  user: UserType | null;
  onLogout: () => void;
  title?: string;
}

export function MobileHeader({ user, onLogout, title }: MobileHeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <header className="md:hidden bg-surface border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <MobileDrawer
          user={user}
          onLogout={onLogout}
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
        
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-primary-100 rounded-lg">
            <Heart className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-neutral-900">
              {title || 'Other Half'}
            </h1>
          </div>
        </div>
      </div>

      {user && (
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-primary-600" />
        </div>
      )}
    </header>
  );
}
