import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { hasPermission } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.role || !hasPermission(session.user.role, 'users:read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const search = request.nextUrl.searchParams.get('search') || '';

  // Fetch all users
  const allUsers = db.select().from(users).all();

  // Filter by search (same logic as GET /api/users)
  let filtered = allUsers;
  if (search) {
    const s = search.toLowerCase();
    filtered = allUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s),
    );
  }

  // Strip hashedPassword
  const safeUsers = filtered.map(({ hashedPassword: _, ...u }) => u);

  // Build CSV
  const headers = ['ID', 'Name', 'Email', 'Role', 'Created At', 'Updated At'];
  const rows = safeUsers.map((u) => [
    u.id,
    u.name ?? '',
    u.email,
    u.role,
    u.createdAt ? new Date(u.createdAt).toISOString() : '',
    u.updatedAt ? new Date(u.updatedAt).toISOString() : '',
  ]);

  // Escape CSV values (handle commas, quotes, newlines)
  function escapeCsv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  const csv = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.map((v) => escapeCsv(String(v))).join(',')),
  ].join('\n');

  const date = new Date().toISOString().split('T')[0];

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="users-${date}.csv"`,
    },
  });
}