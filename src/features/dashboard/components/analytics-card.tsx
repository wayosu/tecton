'use client';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Users, UserPlus, LogIn, Activity, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  UserPlus,
  LogIn,
  Activity,
};

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof ICON_MAP;
  trend: 'up' | 'down' | 'neutral';
  change?: string;
  sparklineData?: { value: number }[];
}

export function AnalyticsCard({
  title,
  value,
  iconName,
  trend,
  change,
  sparklineData,
}: AnalyticsCardProps) {
  const Icon = ICON_MAP[iconName] ?? Activity;

  return (
    <div className="group bg-card hover:border-primary/20 relative overflow-hidden rounded-lg border p-4 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-medium">
          {title}
        </span>
        <div className="bg-muted group-hover:bg-primary/10 rounded-md p-1.5 transition-colors">
          <Icon className="text-muted-foreground group-hover:text-primary h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        {change && (
          <span className="flex items-center gap-0.5 text-xs font-medium">
            {trend === 'up' && (
              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                {change}
              </span>
            )}
            {trend === 'down' && (
              <span className="flex items-center gap-0.5 text-red-600 dark:text-red-400">
                <TrendingDown className="h-3 w-3" />
                {change}
              </span>
            )}
            {trend === 'neutral' && (
              <span className="flex items-center gap-0.5 text-muted-foreground">
                <Minus className="h-3 w-3" />
                {change}
              </span>
            )}
          </span>
        )}
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-10 opacity-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`sparkline-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={
                      trend === 'up'
                        ? 'hsl(var(--chart-2))'
                        : trend === 'down'
                          ? 'hsl(var(--chart-4))'
                          : 'hsl(var(--chart-1))'
                    }
                    stopOpacity={0.3}
                  />
                  <stop offset="100%" stopColor="transparent" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={
                  trend === 'up'
                    ? 'hsl(var(--chart-2))'
                    : trend === 'down'
                      ? 'hsl(var(--chart-4))'
                      : 'hsl(var(--chart-1))'
                }
                strokeWidth={1.5}
                fill={`url(#sparkline-${title})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
