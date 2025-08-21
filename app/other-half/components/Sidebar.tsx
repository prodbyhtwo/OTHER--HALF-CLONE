import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Heart, 
  Search, 
  BookOpen, 
  Bot, 
  Gamepad2, 
  Calendar, 
  Church, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Shield,
  User
} from 'lucide-react';
import { ROUTES } from '../lib/constants';
import { User as UserType } from '../types';
import { useActionLoggerContext } from './ActionLogger';

interface SidebarProps {
  user: UserType | null;
  onLogout: () => void;
  className?: string;
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

export function Sidebar({ user, onLogout, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { logClick } = useActionLoggerContext();

  const handleNavigation = (href: string, title: string) => {
    logClick(`nav-${href.replace('/', '')}`, 'navigation', {
      destination: href,
      title,
      from: location.pathname
    });
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    logClick('sidebar-toggle', 'button', {
      action: isCollapsed ? 'expand' : 'collapse'
    });
  };

  const handleLogout = () => {
    logClick('sidebar-logout', 'button', { action: 'logout' });
    onLogout();
  };

  const filteredItems = navigationItems.filter(item => {
    if (item.requiresAuth && !user) return false;
    if (item.requiresAdmin && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <div className={cn(
      'sidebar bg-surface border-r border-neutral-200 flex flex-col h-full transition-all duration-300',
      isCollapsed ? 'collapsed' : '',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Heart className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-neutral-900">Other Half</h1>
              <p className="text-xs text-neutral-500">Faith • Love • Community</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          className="p-2 h-8 w-8"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1" role="navigation" aria-label="Main navigation">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => handleNavigation(item.href, item.title)}
                className={cn(
                  'nav-item',
                  isActive && 'active'
                )}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive ? 'text-primary-600' : 'text-neutral-500'
                )} />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}

          {/* Admin Panel Link */}
          {user?.role === 'admin' && (
            <Link
              to={ROUTES.ADMIN}
              onClick={() => handleNavigation(ROUTES.ADMIN, 'Admin Panel')}
              className={cn(
                'nav-item border-t border-neutral-200 mt-4 pt-4',
                location.pathname === ROUTES.ADMIN && 'active'
              )}
              title={isCollapsed ? 'Admin Panel' : undefined}
            >
              <Shield className={cn(
                'h-5 w-5 flex-shrink-0',
                location.pathname === ROUTES.ADMIN ? 'text-primary-600' : 'text-neutral-500'
              )} />
              {!isCollapsed && (
                <span className="ml-3 font-medium">Admin Panel</span>
              )}
            </Link>
          )}
        </nav>
      </ScrollArea>

      {/* User section */}
      {user && (
        <div className="p-4 border-t border-neutral-200 space-y-3">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <Link
              to={ROUTES.SETTINGS}
              onClick={() => handleNavigation(ROUTES.SETTINGS, 'Settings')}
              className={cn(
                'nav-item',
                location.pathname === ROUTES.SETTINGS && 'active'
              )}
              title={isCollapsed ? 'Settings' : undefined}
            >
              <Settings className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3">Settings</span>}
            </Link>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                'nav-item text-error-600 hover:text-error-700 hover:bg-error-50',
                isCollapsed ? 'px-2' : 'justify-start px-4'
              )}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      )}

      {/* Biblical verse footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-neutral-200">
          <div className="text-xs text-neutral-500 italic text-center">
            "Two are better than one"
            <br />
            <span className="text-neutral-400">— Ecclesiastes 4:9</span>
          </div>
        </div>
      )}
    </div>
  );
}
