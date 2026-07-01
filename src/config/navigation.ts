import { LayoutDashboard, Users, Settings, type LucideIcon } from 'lucide-react';
import type { Permission } from '@/lib/rbac';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: 'Main',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Users',
        href: '/users',
        icon: Users,
        permission: 'users:read',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        permission: 'settings:read',
      },
    ],
  },
];
