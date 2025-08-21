// client/lib/navigation.ts
import { 
  Home, 
  Heart, 
  MessageCircle, 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Eye, 
  MapPin, 
  CreditCard,
  HelpCircle,
  LogOut,
  Users,
  BarChart3,
  UserCheck,
  Church,
  BookOpen,
  type LucideIcon
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string | number;
  permissions?: string[];
  children?: NavigationItem[];
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

// Main navigation structure
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/home",
    icon: Home,
    description: "Discover new connections"
  },
  {
    id: "matches", 
    label: "Matches",
    href: "/matches",
    icon: Heart,
    description: "View your matches and likes"
  },
  {
    id: "chats",
    label: "Chats",
    href: "/chats", 
    icon: MessageCircle,
    description: "Your conversations"
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    icon: User,
    description: "Manage your profile"
  }
];

// Settings navigation with proper categorization
export const SETTINGS_NAVIGATION: NavigationItem[] = [
  {
    id: "general",
    label: "General",
    href: "/settings",
    icon: Settings,
    description: "Basic app settings"
  },
  {
    id: "discovery",
    label: "Discovery Preferences", 
    href: "/settings/discovery-preferences",
    icon: MapPin,
    description: "Who you want to meet"
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/settings/notification",
    icon: Bell,
    description: "Push and email preferences"
  },
  {
    id: "privacy",
    label: "Privacy & Safety",
    href: "/settings/profile-privacy",
    icon: Eye,
    description: "Control your visibility"
  },
  {
    id: "security",
    label: "Account Security",
    href: "/settings/account-security", 
    icon: Shield,
    description: "Password and security"
  },
  {
    id: "subscription",
    label: "Subscription",
    href: "/settings/subscription",
    icon: CreditCard,
    description: "Manage your membership"
  },
  {
    id: "blocked",
    label: "Blocked Users",
    href: "/settings/blocked-users",
    icon: UserCheck,
    description: "Manage blocked users"
  }
];

// Admin navigation (only shown to admin users)
export const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    id: "admin-dashboard",
    label: "Dashboard", 
    href: "/admin/dashboard",
    icon: BarChart3,
    description: "Admin overview",
    permissions: ["admin", "editor", "support"]
  },
  {
    id: "admin-users",
    label: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage users", 
    permissions: ["admin", "editor", "support"]
  },
  {
    id: "admin-audit",
    label: "Audit Log",
    href: "/admin/audit",
    icon: Shield,
    description: "Security audit log",
    permissions: ["admin", "editor"]
  },
  {
    id: "admin-invites",
    label: "Invites",
    href: "/admin/invites", 
    icon: UserCheck,
    description: "Manage invitations",
    permissions: ["admin", "editor"]
  }
];

// Support navigation
export const SUPPORT_NAVIGATION: NavigationItem[] = [
  {
    id: "help",
    label: "Help & Support",
    href: "/help-support",
    icon: HelpCircle,
    description: "Get help"
  },
  {
    id: "faq",
    label: "FAQ",
    href: "/faq", 
    icon: BookOpen,
    description: "Frequently asked questions"
  },
  {
    id: "contact",
    label: "Contact Support",
    href: "/contact-support",
    icon: MessageCircle,
    description: "Contact our team"
  }
];

// Route metadata for breadcrumbs and titles
export const ROUTE_METADATA: Record<string, { title: string; breadcrumbs: Breadcrumb[] }> = {
  "/": {
    title: "Welcome",
    breadcrumbs: [{ label: "Welcome" }]
  },
  "/home": {
    title: "Home",
    breadcrumbs: [{ label: "Home" }]
  },
  "/matches": {
    title: "Matches", 
    breadcrumbs: [{ label: "Home", href: "/home" }, { label: "Matches" }]
  },
  "/chats": {
    title: "Chats",
    breadcrumbs: [{ label: "Home", href: "/home" }, { label: "Chats" }]
  },
  "/profile": {
    title: "Profile",
    breadcrumbs: [{ label: "Home", href: "/home" }, { label: "Profile" }]
  },
  "/settings": {
    title: "Settings",
    breadcrumbs: [{ label: "Home", href: "/home" }, { label: "Settings" }]
  },
  "/settings/discovery-preferences": {
    title: "Discovery Preferences",
    breadcrumbs: [
      { label: "Home", href: "/home" },
      { label: "Settings", href: "/settings" },
      { label: "Discovery" }
    ]
  },
  "/settings/notification": {
    title: "Notifications",
    breadcrumbs: [
      { label: "Home", href: "/home" },
      { label: "Settings", href: "/settings" },
      { label: "Notifications" }
    ]
  },
  "/settings/profile-privacy": {
    title: "Privacy & Safety",
    breadcrumbs: [
      { label: "Home", href: "/home" },
      { label: "Settings", href: "/settings" },
      { label: "Privacy" }
    ]
  },
  "/settings/account-security": {
    title: "Account Security",
    breadcrumbs: [
      { label: "Home", href: "/home" },
      { label: "Settings", href: "/settings" },
      { label: "Security" }
    ]
  },
  "/settings/subscription": {
    title: "Subscription",
    breadcrumbs: [
      { label: "Home", href: "/home" },
      { label: "Settings", href: "/settings" },
      { label: "Subscription" }
    ]
  },
  "/settings/blocked-users": {
    title: "Blocked Users",
    breadcrumbs: [
      { label: "Home", href: "/home" },
      { label: "Settings", href: "/settings" },
      { label: "Blocked Users" }
    ]
  },
  "/admin/dashboard": {
    title: "Admin Dashboard",
    breadcrumbs: [{ label: "Home", href: "/home" }, { label: "Admin", href: "/admin/dashboard" }]
  },
  "/admin/users": {
    title: "User Management", 
    breadcrumbs: [
      { label: "Home", href: "/home" },
      { label: "Admin", href: "/admin/dashboard" },
      { label: "Users" }
    ]
  },
  "/admin/audit": {
    title: "Audit Log",
    breadcrumbs: [
      { label: "Home", href: "/home" },
      { label: "Admin", href: "/admin/dashboard" },
      { label: "Audit" }
    ]
  },
  "/admin/invites": {
    title: "Invite Management",
    breadcrumbs: [
      { label: "Home", href: "/home" },
      { label: "Admin", href: "/admin/dashboard" },
      { label: "Invites" }
    ]
  }
};

// Helper functions
export function getRouteMetadata(pathname: string) {
  return ROUTE_METADATA[pathname] || {
    title: "Other Half",
    breadcrumbs: [{ label: "Home", href: "/home" }]
  };
}

export function filterNavigationByPermissions(
  navigation: NavigationItem[],
  userPermissions: string[]
): NavigationItem[] {
  return navigation.filter(item => {
    if (!item.permissions) return true;
    return item.permissions.some(permission => userPermissions.includes(permission));
  });
}

export function getBackRoute(pathname: string): string {
  // Smart back navigation based on breadcrumbs
  const metadata = getRouteMetadata(pathname);
  const breadcrumbs = metadata.breadcrumbs;
  
  if (breadcrumbs.length > 1) {
    const parentBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
    return parentBreadcrumb.href || "/home";
  }
  
  return "/home";
}

export function isActiveRoute(currentPath: string, navHref: string): boolean {
  if (navHref === "/home" || navHref === "/") {
    return currentPath === navHref;
  }
  return currentPath.startsWith(navHref);
}
