import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users, resetTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Don't reveal whether the email exists — return success regardless
    const user = db.select({ id: users.id }).from(users).where(eq(users.email, email)).get();

    if (!user) {
      // Return success to prevent email enumeration
      return NextResponse.json({
        message: 'If an account with that email exists, a reset link has been sent.',
      });
    }

    // Invalidate any existing unused tokens for this email
    db.delete(resetTokens).where(eq(resetTokens.email, email)).run();

    const token = uuid();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    db.insert(resetTokens)
      .values({
        id: uuid(),
        email,
        token,
        expires,
        used: false,
      })
      .run();

    // In development, return the reset link for easy testing
    const isDev = process.env.NODE_ENV === 'development';
    const resetLink = `${request.nextUrl.origin}/reset-password?token=${token}`;

    if (isDev) {
      console.log(`\n🔐 Password reset link: ${resetLink}\n`);
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a reset link has been sent.',
      ...(isDev ? { resetLink } : {}),
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
