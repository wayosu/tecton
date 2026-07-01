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
import { getDashboardStats, getRecentUsers } from '@/features/dashboard/queries';
import { formatDistanceToNow } from 'date-fns';

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats();
  const recentUsers = getRecentUsers(5);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: `+${stats.totalUsers > 0 ? Math.round((stats.usersByRole.length / stats.totalUsers) * 100) : 0}%`,
      trend: stats.totalUsers > 0 ? ('up' as const) : ('down' as const),
    },
    {
      title: 'Revenue',
      value: '$0',
      icon: DollarSign,
      change: '—',
      trend: 'up' as const,
    },
    {
      title: 'Active Sessions',
      value: '—',
      icon: Activity,
      change: '—',
      trend: 'up' as const,
    },
    {
      title: 'Users by Role',
      value: String(
        stats.usersByRole.length > 0
          ? stats.usersByRole.map((r) => r.count).reduce((a, b) => a + b)
          : 0,
      ),
      icon: ShoppingCart,
      change: `${stats.usersByRole.length} roles`,
      trend: 'up' as const,
    },
  ];

  const recentActivity = recentUsers.map((user) => ({
    initials: (user.name?.[0] || user.email[0]).toUpperCase(),
    name: user.name || 'Unknown',
    action: user.email,
    time: formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }),
    role: user.role,
  }));

  return (
    <PageShell
      title="Dashboard"
      description={`Welcome back, ${session?.user?.name || 'User'}. Here's what's happening.`}
    >
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="group bg-card hover:border-primary/20 rounded-lg border p-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">{stat.title}</span>
                <div className="bg-muted group-hover:bg-primary/10 rounded-md p-1.5 transition-colors">
                  <Icon className="text-muted-foreground group-hover:text-primary h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <Stat>{stat.value}</Stat>
                <span className="flex items-center gap-0.5 text-xs font-medium">
                  {stat.trend === 'up' ? (
                    <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                      <ArrowUpRight className="h-3 w-3" />
                      {stat.change}
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-red-600 dark:text-red-400">
                      <ArrowDownRight className="h-3 w-3" />
                      {stat.change}
                    </span>
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
        <div className="bg-card rounded-lg border">
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
                className="bg-muted/30 hover:border-primary/30 hover:bg-muted flex items-center gap-2 rounded-md border px-3 py-2.5 text-xs font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Recent User Activity */}
        <div className="bg-card rounded-lg border">
          <div className="border-b px-4 py-3">
            <H3>Recent Users</H3>
          </div>
          <div className="divide-y">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="bg-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium uppercase">
                    {item.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs">
                      <span className="font-medium">{item.name}</span>{' '}
                      <span className="text-muted-foreground">{item.action}</span>
                    </p>
                  </div>
                  <StatusBadge variant="secondary">{item.time}</StatusBadge>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground px-4 py-6 text-center text-xs">
                No users yet. Seed the database to see activity.
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
