import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { hasPermission } from '@/lib/rbac';
import { updateUserSchema } from '@/features/users/types';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { Role } from '@/lib/rbac';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role as Role;
  const sessionUserId = session?.user?.id as string;
  const { id } = await params;

  if (!hasPermission(role, 'users:update')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const target = db.select().from(users).where(eq(users.id, id)).get();

  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { name, email, password, role: newRole } = parsed.data;

  // Prevent self-demotion
  if (id === sessionUserId && target.role === 'admin' && newRole !== 'admin') {
    return NextResponse.json(
      { error: 'Cannot change your own admin role' },
      { status: 400 },
    );
  }

  // Editor can only set viewer/editor roles
  if (role === 'editor' && newRole === 'admin') {
    return NextResponse.json(
      { error: 'Editors cannot assign admin role' },
      { status: 403 },
    );
  }

  // Check email uniqueness (exclude self)
  if (email !== target.email) {
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
  }

  const now = new Date();
  const updateData: Record<string, unknown> = {
    name,
    email,
    role: newRole,
    updatedAt: now,
  };

  if (password) {
    updateData.hashedPassword = await hash(password, 10);
  }

  db.update(users).set(updateData).where(eq(users.id, id)).run();

  const updated = db.select().from(users).where(eq(users.id, id)).get();
  const { hashedPassword: _, ...safeUser } = updated!;

  return NextResponse.json({ data: safeUser });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role as Role;
  const sessionUserId = session?.user?.id as string;
  const { id } = await params;

  if (!hasPermission(role, 'users:delete')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Cannot delete self
  if (id === sessionUserId) {
    return NextResponse.json(
      { error: 'Cannot delete your own account' },
      { status: 400 },
    );
  }

  const target = db.select().from(users).where(eq(users.id, id)).get();

  if (!target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  db.delete(users).where(eq(users.id, id)).run();

  return NextResponse.json({ success: true });
}
