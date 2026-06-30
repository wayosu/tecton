import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { hasPermission } from '@/lib/rbac';
import { count } from 'drizzle-orm';
import type { Role, User, UsersResponse } from '@/features/users/types';

export async function GET(request: NextRequest) {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role as Role;

  if (!hasPermission(role, 'users:read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 10));
  const sort = (searchParams.get('sort') as keyof User) || 'createdAt';
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
  const search = searchParams.get('search') || '';

  const offset = (page - 1) * limit;

  // Fetch all users (SQLite doesn't support ILIKE easily, filter in JS)
  const allUsers = db.select().from(users).all();

  // Safe users (remove hashedPassword)
  const safeUsers: User[] = allUsers.map(({ hashedPassword: _, ...user }) => user);

  // Filter by search
  let filtered = safeUsers;
  if (search) {
    const s = search.toLowerCase();
    filtered = safeUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s),
    );
  }

  // Sort
  const sortKey = sort as keyof User;
  filtered.sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  } satisfies UsersResponse);
}
