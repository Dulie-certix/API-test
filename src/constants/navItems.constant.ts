import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

export interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "dashboard",
  },
  {
    title: "Products",
    icon: Package,
    path: "products",
  },
  {
    title: "Users",
    icon: Users,
    path: "users",
  },
  {
    title: "Complaints",
    icon: MessageSquare,
    path: "complaints",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "settings",
  },
  {
    title: "Help",
    icon: HelpCircle,
    path: "help",
  },
];

export const mainNavItems = navItems.slice(0, 4);
export const bottomNavItems = navItems.slice(4);
