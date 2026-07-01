'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { EventCount } from '@/features/dashboard/queries';

interface ActivityChartProps {
  data: EventCount[];
}

type Range = 7 | 30;

export function ActivityChart({ data }: ActivityChartProps) {
  const [range, setRange] = useState<Range>(7);

  const sliced = data.slice(data.length - range);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Activity</CardTitle>
        <div className="flex gap-1">
          <Button
            variant={range === 7 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRange(7)}
            className="h-7 px-2 text-[11px]"
          >
            7d
          </Button>
          <Button
            variant={range === 30 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRange(30)}
            className="h-7 px-2 text-[11px]"
          >
            30d
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sliced}
              margin={{ top: 4, right: 4, bottom: 4, left: -12 }}
              barCategoryGap="20%"
            >
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
                  return d.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
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
                      <p className="mb-1 font-medium">
                        {d.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {payload.map((p, idx) => (
                        <p
                          key={idx}
                          className="text-muted-foreground flex items-center gap-2"
                        >
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: p.color }}
                          />
                          {p.name}:{' '}
                          <span className="font-semibold text-foreground">
                            {p.value}
                          </span>
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend
                formatter={(value: string) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
                iconType="circle"
                iconSize={8}
              />
              <Bar
                dataKey="logins"
                name="Logins"
                fill="hsl(var(--chart-1))"
                radius={[3, 3, 0, 0]}
                maxBarSize={16}
              />
              <Bar
                dataKey="signups"
                name="Signups"
                fill="hsl(var(--chart-2))"
                radius={[3, 3, 0, 0]}
                maxBarSize={16}
              />
              <Bar
                dataKey="pageViews"
                name="Page Views"
                fill="hsl(var(--chart-3))"
                radius={[3, 3, 0, 0]}
                maxBarSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
