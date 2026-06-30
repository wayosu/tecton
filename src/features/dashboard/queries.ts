import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export interface DashboardStats {
  totalUsers: number;
  usersByRole: { role: string; count: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const rows = db.all(sql`SELECT COUNT(*) as value FROM users`) as { value: number }[];
  const totalUsers = rows[0]?.value ?? 0;

  const allRoles = db.select({ role: users.role }).from(users).all();
  const byRole: Record<string, number> = {};
  for (const u of allRoles) {
    byRole[u.role] = (byRole[u.role] ?? 0) + 1;
  }

  return {
    totalUsers,
    usersByRole: Object.entries(byRole).map(([role, c]) => ({ role, count: c })),
  };
}

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
