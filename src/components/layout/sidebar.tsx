'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { navigation } from '@/config/navigation';
import { signOut } from '@/lib/auth-client';
import type { Role } from '@/lib/rbac';
import { hasPermission } from '@/lib/rbac';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  userRole?: Role;
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
  userRole = 'viewer',
}: SidebarProps) {
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
        'bg-sidebar fixed top-0 left-0 z-40 flex h-screen flex-col border-r transition-all duration-200',
        collapsed ? 'lg:w-[56px]' : 'lg:w-60',
        'max-lg:w-60 max-lg:transition-transform',
        mobileOpen ? 'max-lg:translate-x-0' : 'max-lg:pointer-events-none max-lg:-translate-x-full',
      )}
    >
      {/* Desktop logo + toggle */}
      <div
        className={cn(
          'hidden h-12 items-center border-b px-3 lg:flex',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed && (
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
            tecton
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-7 w-7"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Mobile logo + close */}
      <div className="flex h-12 items-center justify-between border-b px-3 lg:hidden">
        <Link
          href="/dashboard"
          className="text-sm font-semibold tracking-tight"
          onClick={onCloseMobile}
        >
          tecton
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCloseMobile}
          className="h-7 w-7"
          aria-label="Close sidebar"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
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
                <p
                  className={cn(
                    'text-muted-foreground/60 mt-2 mb-1 px-3 text-[11px] font-medium tracking-wider uppercase first:mt-0',
                    collapsed && 'lg:hidden',
                  )}
                >
                  {section.title}
                </p>

                {/* Section items */}
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
                    const Icon = item.icon;

                    // Shared link classes — computed once
                    const linkClasses = cn(
                      'flex items-center rounded-md text-sm font-medium transition-all',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
                      collapsed
                        ? 'lg:h-9 lg:w-full lg:justify-center max-lg:gap-3 max-lg:px-3 max-lg:py-1.5'
                        : 'gap-3 px-3 py-1.5',
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
                        <span className={cn(collapsed && 'lg:hidden')}>{item.title}</span>
                      </>
                    );

                    // Collapsed: wrap Link in Tooltip (TooltipTrigger merges into Link via render)
                    if (collapsed) {
                      return (
                        <li key={item.href}>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Link
                                  href={item.href}
                                  className={cn(linkClasses, 'group')}
                                  onClick={onCloseMobile}
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
                        <Link
                          href={item.href}
                          className={cn(linkClasses, 'group')}
                          onClick={onCloseMobile}
                        >
                          {linkChildren}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Section separator (collapsed mode only) */}
                {collapsed && !isLastSection && (
                  <div className="border-sidebar-border mx-2 my-2 border-t max-lg:hidden" />
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Sign Out */}
      <div className="border-t p-2">
        {!collapsed ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground w-full justify-start gap-3"
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
                  className="text-sidebar-foreground/50 hover:text-sidebar-foreground mx-auto h-8 w-8"
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
