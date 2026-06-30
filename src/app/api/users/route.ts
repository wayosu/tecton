import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { hasPermission } from '@/lib/rbac';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createUserSchema } from '@/features/users/types';
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

export async function POST(request: NextRequest) {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role as Role;

  if (!hasPermission(role, 'users:create')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, password, role: newRole } = parsed.data;

  // Editor can only create viewer/editor, not admin
  if (role === 'editor' && newRole === 'admin') {
    return NextResponse.json(
      { error: 'Editors cannot create admin users' },
      { status: 403 },
    );
  }

  // Check email uniqueness
  const existing = db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (existing) {
    return NextResponse.json(
      { error: 'Email already exists' },
      { status: 409 },
    );
  }

  const id = uuidv4();
  const now = new Date();
  const hashedPassword = await hash(password, 10);

  db.insert(users)
    .values({
      id,
      name,
      email,
      hashedPassword,
      role: newRole,
      createdAt: now,
      updatedAt: now,
    })
    .run();

  const created = db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .get();

  const { hashedPassword: _, ...safeUser } = created!;

  return NextResponse.json({ data: safeUser }, { status: 201 });
}
