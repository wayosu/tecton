'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { profileSchema, passwordSchema } from './schemas';

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  const parsed = profileSchema.safeParse({ name, email });
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0];
    return { error: firstError || 'Invalid input' };
  }

  // Check email uniqueness
  const existing = db.select().from(users).where(eq(users.email, parsed.data.email)).get();

  if (existing && existing.id !== session.user.id) {
    return { error: 'Email already in use by another account' };
  }

  db.update(users)
    .set({
      name: parsed.data.name,
      email: parsed.data.email,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))
    .run();

  revalidatePath('/settings');
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Not authenticated' };
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const parsed = passwordSchema.safeParse({
    currentPassword,
    newPassword,
    confirmPassword,
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0];
    return { error: firstError || 'Invalid input' };
  }

  // Verify current password
  const user = db.select().from(users).where(eq(users.id, session.user.id)).get();

  if (!user || !user.hashedPassword) {
    return { error: 'Account not found' };
  }

  const isValid = await compare(parsed.data.currentPassword, user.hashedPassword);
  if (!isValid) {
    return { error: 'Current password is incorrect' };
  }

  const hashedPassword = await hash(parsed.data.newPassword, 10);

  db.update(users)
    .set({
      hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))
    .run();

  revalidatePath('/settings');
  return { success: true };
}
