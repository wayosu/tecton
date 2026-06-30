'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { navigation } from '@/config/navigation';
import { signOut } from '@/lib/auth-client';
import type { Role } from '@/lib/rbac';
import { hasPermission } from '@/lib/rbac';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  userRole?: Role;
}

export function Sidebar({ open, onToggle, userRole = 'viewer' }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-200',
        open ? 'w-60' : 'w-[56px]',
      )}
    >
      {/* Logo */}
      <div className="flex h-12 items-center justify-between border-b px-3">
        {open && (
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
            tecton
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn('h-7 w-7', !open && 'mx-auto')}
        >
          {open ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-3">
        {navigation.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.permission || hasPermission(userRole, item.permission),
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-4 last:mb-0">
              {open && (
                <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                  {section.title}
                </p>
              )}
              <nav className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' &&
                      pathname.startsWith(item.href + '/'));
                  const Icon = item.icon;

                  const linkContent = (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                        !open && 'justify-center px-0',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70',
                        )}
                      />
                      {open && <span>{item.title}</span>}
                    </Link>
                  );

                  if (!open) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger>
                          <span>{linkContent}</span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkContent;
                })}
              </nav>
            </div>
          );
        })}
      </ScrollArea>

      {/* Sign Out */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground/50 hover:text-sidebar-foreground',
            !open && 'justify-center px-0',
          )}
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {open && <span className="text-sm">Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}
