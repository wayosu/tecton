import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { hasPermission } from '@/lib/rbac';
import type { Role } from '@/lib/rbac';

export async function GET() {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role as Role;

  if (!hasPermission(role, 'users:read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const allUsers = db.select().from(users).all();

  // Remove hashedPassword from response
  const safeUsers = allUsers.map(({ hashedPassword: _, ...user }) => user);

  return NextResponse.json({ data: safeUsers });
}

export async function POST(request: Request) {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role as Role;

  if (!hasPermission(role, 'users:create')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  // TODO: Validate with zod
  const newUser = db.insert(users).values(body).returning().get();

  return NextResponse.json({ data: newUser }, { status: 201 });
}
