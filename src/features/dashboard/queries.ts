import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';

// ──────────────────────────────────────────────
// Summary Stats (replaces getDashboardStats)
// ──────────────────────────────────────────────

export interface SummaryStats {
  totalUsers: number;
  signupsToday: number;
  loginsToday: number;
  activeUsers7d: number;
  totalEvents: number;
}

export function getSummaryStats(): SummaryStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = Math.floor(today.getTime() / 1000);
  const sevenDaysAgo = todayTs - 7 * 24 * 60 * 60;

  const totalUsers = (
    db.all(sql`SELECT COUNT(*) as v FROM users`)[0] as { v: number }
  ).v;

  const signupsToday = (
    db.all(
      sql`SELECT COUNT(*) as v FROM users WHERE created_at >= ${todayTs}`,
    )[0] as { v: number }
  ).v;

  const loginsToday = (
    db.all(
      sql`SELECT COUNT(*) as v FROM analytics_events WHERE type = 'login' AND created_at >= ${todayTs}`,
    )[0] as { v: number }
  ).v;

  const activeUsers7d = (
    db.all(
      sql`SELECT COUNT(DISTINCT user_id) as v FROM analytics_events WHERE created_at >= ${sevenDaysAgo}`,
    )[0] as { v: number }
  ).v;

  const totalEvents = (
    db.all(sql`SELECT COUNT(*) as v FROM analytics_events`)[0] as { v: number }
  ).v;

  return { totalUsers, signupsToday, loginsToday, activeUsers7d, totalEvents };
}

// ──────────────────────────────────────────────
// Registration Trend (daily signup counts)
// ──────────────────────────────────────────────

export interface DailyCount {
  date: string;
  count: number;
}

export function getRegistrationTrend(days = 30): DailyCount[] {
  const sinceSec = Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);

  const rows = db.all(
    sql`
      SELECT DATE(created_at, 'unixepoch') as date, COUNT(*) as count
      FROM users
      WHERE created_at >= ${sinceSec}
      GROUP BY DATE(created_at, 'unixepoch')
      ORDER BY date ASC
    `,
  ) as { date: string; count: number }[];

  return fillMissingDates(rows, days);
}

// ──────────────────────────────────────────────
// Event Trend (daily event counts by type)
// ──────────────────────────────────────────────

export interface EventCount {
  date: string;
  signups: number;
  logins: number;
  pageViews: number;
}

export function getEventTrend(days = 30): EventCount[] {
  const sinceSec = Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);

  const raw = db.all(
    sql`
      SELECT
        DATE(created_at, 'unixepoch') as date,
        SUM(CASE WHEN type = 'signup' THEN 1 ELSE 0 END) as signups,
        SUM(CASE WHEN type = 'login' THEN 1 ELSE 0 END) as logins,
        SUM(CASE WHEN type = 'page_view' THEN 1 ELSE 0 END) as page_views
      FROM analytics_events
      WHERE created_at >= ${sinceSec}
      GROUP BY DATE(created_at, 'unixepoch')
      ORDER BY date ASC
    `,
  ) as { date: string; signups: number; logins: number; page_views: number }[];

  // Map to camelCase and fill gaps
  const map = new Map<string, EventCount>();
  for (const r of raw) {
    map.set(r.date, {
      date: r.date,
      signups: r.signups,
      logins: r.logins,
      pageViews: r.page_views,
    });
  }

  const result: EventCount[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    result.push(
      map.get(key) ?? { date: key, signups: 0, logins: 0, pageViews: 0 },
    );
  }

  return result;
}

// ──────────────────────────────────────────────
// Role Distribution
// ──────────────────────────────────────────────

export interface RoleCount {
  role: string;
  count: number;
  fill: string;
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'hsl(var(--chart-1))',
  editor: 'hsl(var(--chart-2))',
  viewer: 'hsl(var(--chart-3))',
};

export function getRoleDistribution(): RoleCount[] {
  const allRoles = db
    .select({ role: users.role })
    .from(users)
    .all() as { role: string }[];

  const byRole: Record<string, number> = {};
  for (const u of allRoles) {
    byRole[u.role] = (byRole[u.role] ?? 0) + 1;
  }

  return Object.entries(byRole).map(([role, count]) => ({
    role,
    count,
    fill: ROLE_COLORS[role] ?? 'hsl(var(--chart-4))',
  }));
}

// ──────────────────────────────────────────────
// Recent Users (unchanged from original)
// ──────────────────────────────────────────────

export interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

export function getRecentUsers(limit = 5): RecentUser[] {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .all() as RecentUser[];
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Fill gaps in date-keyed rows with zero-count entries */
function fillMissingDates(rows: { date: string; count: number }[], days: number): DailyCount[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(r.date, r.count);
  }

  const result: DailyCount[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: map.get(key) ?? 0 });
  }

  return result;
}
