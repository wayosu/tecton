'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import type { Role } from '@/lib/rbac';

export function Shell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="bg-background min-h-screen">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onCloseMobile={() => setMobileOpen(false)}
        userRole={session?.user?.role as Role | undefined}
      />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-[56px]' : 'lg:pl-60',
        )}
      >
        <Header
          onMenuClick={() => setMobileOpen(true)}
          userName={session?.user?.name ?? undefined}
          userImage={session?.user?.image ?? undefined}
        />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
