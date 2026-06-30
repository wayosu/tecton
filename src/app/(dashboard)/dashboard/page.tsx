import { auth } from '@/auth';
import {
  Users,
  Activity,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';
import { StatusBadge } from '@/components/shared/status-badge';
import { Stat, H3 } from '@/components/ui/typography';

const stats = [
  {
    title: 'Total Users',
    value: '2,847',
    icon: Users,
    change: '+12.5%',
    trend: 'up' as const,
  },
  {
    title: 'Revenue',
    value: '$48.2k',
    icon: DollarSign,
    change: '+8.2%',
    trend: 'up' as const,
  },
  {
    title: 'Active Sessions',
    value: '342',
    icon: Activity,
    change: '+18.7%',
    trend: 'up' as const,
  },
  {
    title: 'Pending Orders',
    value: '14',
    icon: ShoppingCart,
    change: '-3.1%',
    trend: 'down' as const,
  },
];

const recentActivity = [
  { user: 'Admin', action: 'created a new user', time: '2 min ago' },
  { user: 'Editor', action: 'updated settings', time: '15 min ago' },
  { user: 'Admin', action: 'deployed v0.2.0', time: '1 hour ago' },
  { user: 'Viewer', action: 'viewed dashboard', time: '2 hours ago' },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <PageShell
      title="Dashboard"
      description={`Welcome back, ${session?.user?.name || 'User'}. Here's what's happening.`}
    >
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="group rounded-lg border bg-card p-4 transition-colors hover:border-primary/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <div className="rounded-md bg-muted p-1.5 transition-colors group-hover:bg-primary/10">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <Stat>{stat.value}</Stat>
                <span className="flex items-center gap-0.5 text-xs font-medium">
                  {stat.trend === 'up' ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {stat.change}
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">
                        {stat.change}
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <H3>Quick Actions</H3>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4">
            {[
              { label: 'Add User', href: '/users' },
              { label: 'View Reports', href: '/dashboard' },
              { label: 'Settings', href: '/settings' },
              { label: 'API Docs', href: '#' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2.5 text-xs font-medium transition-colors hover:border-primary/30 hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 py-3">
            <H3>Recent Activity</H3>
          </div>
          <div className="divide-y">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium">
                  {item.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs">
                    <span className="font-medium">{item.user}</span>{' '}
                    <span className="text-muted-foreground">{item.action}</span>
                  </p>
                </div>
                <StatusBadge variant="secondary">{item.time}</StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
