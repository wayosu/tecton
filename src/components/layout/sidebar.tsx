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
        'fixed left-0 top-0 z-40 h-screen border-r bg-sidebar transition-all duration-300',
        open ? 'w-64' : 'w-16',
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        {open && (
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            tecton
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
        >
          {open ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        {navigation.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.permission || hasPermission(userRole, item.permission),
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-4">
              {open && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                  {section.title}
                </h3>
              )}
              <nav className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;

                  const linkContent = (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        !open && 'justify-center',
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {open && <span>{item.title}</span>}
                    </Link>
                  );

                  if (!open) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger>
                          <span>{linkContent}</span>
                        </TooltipTrigger>
                        <TooltipContent side="right">
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
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className={cn(
            'w-full text-muted-foreground hover:text-foreground',
            !open && 'justify-center px-0',
          )}
          onClick={() => signOut()}
        >
            <LogOut className="h-5 w-5" />
            {open && <span className="ml-3">Sign out</span>}
          </Button>
      </div>
    </aside>
  );
}
