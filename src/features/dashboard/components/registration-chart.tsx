'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyCount } from '@/features/dashboard/queries';

interface RegistrationChartProps {
  data: DailyCount[];
}

export function RegistrationChart({ data }: RegistrationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          User Registrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -12 }}>
              <defs>
                <linearGradient id="registrationFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/50"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: string) => {
                  const d = new Date(v + 'T00:00:00');
                  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = new Date(label + 'T00:00:00');
                  return (
                    <div className="bg-popover text-popover-foreground rounded-lg border px-3 py-2 text-xs shadow-md">
                      <p className="mb-0.5 font-medium">
                        {d.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-muted-foreground">
                        Signups:{' '}
                        <span className="font-semibold text-foreground">
                          {payload[0].value}
                        </span>
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#registrationFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
