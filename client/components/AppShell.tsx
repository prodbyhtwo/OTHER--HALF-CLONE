// client/components/AppShell.tsx
import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SafeModeIndicator } from "./SafeModeIndicator";
import {
  MAIN_NAVIGATION,
  SETTINGS_NAVIGATION,
  ADMIN_NAVIGATION,
  SUPPORT_NAVIGATION,
  getRouteMetadata,
  getBackRoute,
  isActiveRoute,
  filterNavigationByPermissions,
  type NavigationItem,
} from "../lib/navigation";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  showBack?: boolean;
  showHome?: boolean;
  title?: string;
  className?: string;
  userRole?: string;
  hideNavigation?: boolean;
}

interface NavigationMenuProps {
  items: NavigationItem[];
  title: string;
  currentPath: string;
  onNavigate?: () => void;
}

function NavigationMenu({
  items,
  title,
  currentPath,
  onNavigate,
}: NavigationMenuProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-900 px-2">{title}</h4>
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = isActiveRoute(currentPath, item.href);

          return (
            <Link
              key={item.id}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                isActive
                  ? "bg-primary-50 text-primary-700 font-medium border-l-2 border-primary-500"
                  : "text-gray-700",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary-600" : "text-gray-500",
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function BreadcrumbNavigation({ pathname }: { pathname: string }) {
  const metadata = getRouteMetadata(pathname);
  const breadcrumbs = metadata.breadcrumbs;

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm text-gray-600"
    >
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">/</span>}
          {crumb.href ? (
            <Link
              to={crumb.href}
              className="hover:text-primary-600 transition-colors"
              aria-label={`Go to ${crumb.label}`}
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function AppShell({
  children,
  showBack = true,
  showHome = true,
  title,
  className,
  userRole = "user",
  hideNavigation = false,
}: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentPath = location.pathname;
  const metadata = getRouteMetadata(currentPath);
  const pageTitle = title || metadata.title;
  const backRoute = getBackRoute(currentPath);

  // Filter navigation based on user permissions
  const userPermissions = [userRole]; // In real app, this would come from user context
  const adminNav = filterNavigationByPermissions(
    ADMIN_NAVIGATION,
    userPermissions,
  );

  const handleBack = () => {
    if (backRoute !== currentPath) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  const handleHome = () => {
    navigate("/home");
  };

  const closeMenu = () => setIsMenuOpen(false);

  if (hideNavigation) {
    return (
      <div className={cn("min-h-screen bg-background", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            {showBack && backRoute !== currentPath && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-2"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            {/* Home Button */}
            {showHome && currentPath !== "/home" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHome}
                className="p-2"
                aria-label="Go to home"
              >
                <Home className="h-4 w-4" />
              </Button>
            )}

            {/* Title and Breadcrumbs */}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {pageTitle}
              </h1>
              <BreadcrumbNavigation pathname={currentPath} />
            </div>
          </div>

          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMenu}
                  className="p-2"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <SafeModeIndicator variant="compact" className="mb-4" />

              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-6">
                  {/* Main Navigation */}
                  <NavigationMenu
                    items={MAIN_NAVIGATION}
                    title="Main"
                    currentPath={currentPath}
                    onNavigate={closeMenu}
                  />

                  <Separator />

                  {/* Settings Navigation */}
                  <NavigationMenu
                    items={SETTINGS_NAVIGATION}
                    title="Settings"
                    currentPath={currentPath}
                    onNavigate={closeMenu}
                  />

                  <Separator />

                  {/* Admin Navigation (if user has permissions) */}
                  {adminNav.length > 0 && (
                    <>
                      <NavigationMenu
                        items={adminNav}
                        title="Admin"
                        currentPath={currentPath}
                        onNavigate={closeMenu}
                      />
                      <Separator />
                    </>
                  )}

                  {/* Support Navigation */}
                  <NavigationMenu
                    items={SUPPORT_NAVIGATION}
                    title="Support"
                    currentPath={currentPath}
                    onNavigate={closeMenu}
                  />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

// HOC for pages that need the AppShell
export function withAppShell<P extends object>(
  Component: React.ComponentType<P>,
  shellProps: Partial<AppShellProps> = {},
) {
  return function WrappedComponent(props: P) {
    return (
      <AppShell {...shellProps}>
        <Component {...props} />
      </AppShell>
    );
  };
}

export default AppShell;
