'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RoleCount } from '@/features/dashboard/queries';

interface RoleDistributionChartProps {
  data: RoleCount[];
  totalUsers: number;
}

export function RoleDistributionChart({
  data,
  totalUsers,
}: RoleDistributionChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Users by Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[280px] items-center justify-center text-xs text-muted-foreground">
            No user data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Users by Role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="count"
                nameKey="role"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.role} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as RoleCount;
                  const pct = ((item.count / totalUsers) * 100).toFixed(1);
                  return (
                    <div className="bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-xs shadow-md">
                      <p className="mb-0.5 font-medium capitalize">{item.role}</p>
                      <p className="text-muted-foreground">
                        {item.count} users ({pct}%)
                      </p>
                    </div>
                  );
                }}
              />
              <Legend
                formatter={(value: string) => (
                  <span className="text-xs text-muted-foreground capitalize">
                    {value}
                  </span>
                )}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
