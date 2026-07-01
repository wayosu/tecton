import { auth } from '@/auth';
import { PageShell } from '@/components/layout/page-shell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { H3 } from '@/components/ui/typography';
import { AnalyticsCard } from '@/features/dashboard/components/analytics-card';
import { RegistrationChart } from '@/features/dashboard/components/registration-chart';
import { RoleDistributionChart } from '@/features/dashboard/components/role-distribution-chart';
import { ActivityChart } from '@/features/dashboard/components/activity-chart';
import {
  getSummaryStats,
  getRegistrationTrend,
  getEventTrend,
  getRoleDistribution,
  getRecentUsers,
} from '@/features/dashboard/queries';
import { formatDistanceToNow } from 'date-fns';

export default async function DashboardPage() {
  const session = await auth();

  const summary = getSummaryStats();
  const registrationTrend = getRegistrationTrend(30);
  const eventTrend = getEventTrend(30);
  const roleDistribution = getRoleDistribution();
  const recentUsers = getRecentUsers(5);

  // Sparkline data from last 14 days of registrations
  const sparklineData = registrationTrend
    .slice(-14)
    .map((d) => ({ value: d.count }));

  const statCards = [
    {
      title: 'Total Users',
      value: summary.totalUsers.toLocaleString(),
      iconName: 'Users',
      change: `+${summary.signupsToday} today`,
      trend: summary.signupsToday > 0 ? ('up' as const) : ('neutral' as const),
      sparklineData,
    },
    {
      title: 'Signups Today',
      value: summary.signupsToday.toLocaleString(),
      iconName: 'UserPlus',
      change:
        summary.signupsToday > 0
          ? `+${summary.signupsToday} new`
          : 'No signups',
      trend: summary.signupsToday > 0 ? ('up' as const) : ('neutral' as const),
    },
    {
      title: 'Logins Today',
      value: summary.loginsToday.toLocaleString(),
      iconName: 'LogIn',
      change:
        summary.loginsToday > 0
          ? `${summary.loginsToday} sessions`
          : 'No activity',
      trend: summary.loginsToday > 0 ? ('up' as const) : ('neutral' as const),
    },
    {
      title: 'Active (7d)',
      value: summary.activeUsers7d.toLocaleString(),
      iconName: 'Activity',
      change:
        summary.totalUsers > 0
          ? `${Math.round((summary.activeUsers7d / summary.totalUsers) * 100)}% active rate`
          : '—',
      trend:
        summary.activeUsers7d / summary.totalUsers > 0.5
          ? ('up' as const)
          : ('down' as const),
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
        {statCards.map((stat) => (
          <AnalyticsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ─────────────────────── */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <RegistrationChart data={registrationTrend} />
            <RoleDistributionChart
              data={roleDistribution}
              totalUsers={summary.totalUsers}
            />
          </div>

          <ActivityChart data={eventTrend} />
        </TabsContent>

        {/* ── Analytics Tab ────────────────────── */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <RegistrationChart data={registrationTrend} />
            <RoleDistributionChart
              data={roleDistribution}
              totalUsers={summary.totalUsers}
            />
          </div>

          {/* Detail stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-xs font-medium">
                Total Events
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {summary.totalEvents.toLocaleString()}
              </p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-xs font-medium">
                Avg. Daily Logins
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {eventTrend.length > 0
                  ? (
                      eventTrend.reduce((a, b) => a + b.logins, 0) /
                      eventTrend.length
                    ).toFixed(1)
                  : '0'}
              </p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-xs font-medium">
                Avg. Daily Signups
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {registrationTrend.length > 0
                  ? (
                      registrationTrend.reduce((a, b) => a + b.count, 0) /
                      registrationTrend.length
                    ).toFixed(1)
                  : '0'}
              </p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <p className="text-muted-foreground text-xs font-medium">
                Roles
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {roleDistribution.length}
              </p>
            </div>
          </div>
        </TabsContent>

        {/* ── Activity Tab ──────────────────────── */}
        <TabsContent value="activity" className="space-y-4">
          <ActivityChart data={eventTrend} />

          {/* Recent Users */}
          <div className="bg-card rounded-lg border">
            <div className="border-b px-4 py-3">
              <H3>Recent Users</H3>
            </div>
            <div className="divide-y">
              {recentActivity.length > 0 ? (
                recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <div className="bg-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium uppercase">
                      {item.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs">
                        <span className="font-medium">{item.name}</span>{' '}
                        <span className="text-muted-foreground">
                          {item.action}
                        </span>
                      </p>
                    </div>
                    <span className="text-muted-foreground shrink-0 text-[11px]">
                      {item.time}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground px-4 py-6 text-center text-xs">
                  No users yet. Seed the database to see activity.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
