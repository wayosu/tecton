'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import type { Role } from '@/lib/rbac';

export function Shell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={(session?.user as { role?: Role })?.role}
      />
      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:pl-60' : 'lg:pl-[56px]',
        )}
      >
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          userName={session?.user?.name ?? undefined}
          userImage={session?.user?.image ?? undefined}
        />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
