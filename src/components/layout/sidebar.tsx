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

  // Pre-compute visible navigation items for consistent rendering
  const visibleSections = navigation
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.permission || hasPermission(userRole, item.permission),
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-200',
        open ? 'w-60' : 'w-[56px]',
      )}
    >
      {/* Logo + Toggle */}
      <div
        className={cn(
          'flex h-12 items-center border-b px-3',
          open ? 'justify-between' : 'justify-center',
        )}
      >
        {open && (
          <Link
            href="/dashboard"
            className="text-sm font-semibold tracking-tight"
          >
            tecton
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-7 w-7"
        >
          {open ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-1 px-2">
          {visibleSections.map((section, sectionIdx) => {
            const isLastSection = sectionIdx === visibleSections.length - 1;

            return (
              <div key={section.title}>
                {/* Section title (visible only when expanded) */}
                {open && (
                  <p className="mb-1 mt-2 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 first:mt-0">
                    {section.title}
                  </p>
                )}

                {/* Section items */}
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/dashboard' &&
                        pathname.startsWith(item.href + '/'));
                    const Icon = item.icon;

                    // Shared link classes — computed once
                    const linkClasses = cn(
                      'flex items-center rounded-md text-sm font-medium transition-all',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                      open
                        ? 'gap-3 px-3 py-1.5'
                        : 'h-9 w-full justify-center',
                    );

                    const iconClasses = cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive
                        ? 'text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70',
                    );

                    const linkChildren = (
                      <>
                        <Icon className={iconClasses} />
                        {open && <span>{item.title}</span>}
                      </>
                    );

                    // Collapsed: wrap Link in Tooltip (TooltipTrigger merges into Link via render)
                    if (!open) {
                      return (
                        <li key={item.href}>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Link
                                  href={item.href}
                                  className={cn(linkClasses, 'group')}
                                >
                                  {linkChildren}
                                </Link>
                              }
                            />
                            <TooltipContent side="right" sideOffset={12} className="text-xs">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        </li>
                      );
                    }

                    // Expanded: plain link
                    return (
                      <li key={item.href}>
                        <Link href={item.href} className={cn(linkClasses, 'group')}>
                          {linkChildren}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Section separator (collapsed mode only) */}
                {!open && !isLastSection && (
                  <div className="mx-2 my-2 border-t border-sidebar-border" />
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Sign Out */}
      <div className="border-t p-2">
        {open ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 text-sidebar-foreground/50 hover:text-sidebar-foreground"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="text-sm">Sign out</span>
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="mx-auto h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent side="right" sideOffset={12} className="text-xs">
              Sign out
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </aside>
  );
}
