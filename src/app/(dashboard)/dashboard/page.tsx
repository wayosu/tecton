import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Activity,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Users',
    value: '1,234',
    icon: Users,
    change: '+12%',
    changeType: 'positive' as const,
  },
  {
    title: 'Revenue',
    value: '$45,231',
    icon: DollarSign,
    change: '+8.2%',
    changeType: 'positive' as const,
  },
  {
    title: 'Orders',
    value: '356',
    icon: ShoppingCart,
    change: '-3.1%',
    changeType: 'negative' as const,
  },
  {
    title: 'Active Now',
    value: '42',
    icon: Activity,
    change: '+18%',
    changeType: 'positive' as const,
  },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || 'User'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p
                  className={
                    stat.changeType === 'positive'
                      ? 'text-xs text-green-600 dark:text-green-400'
                      : 'text-xs text-red-600 dark:text-red-400'
                  }
                >
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity feed coming soon. Connect your data sources to see
              real-time events.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Shortcuts and common tasks will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
