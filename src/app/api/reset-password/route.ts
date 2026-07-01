import { NextResponse, type NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { resetTokens, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 },
      );
    }

    // Look up the reset token
    const resetToken = db.select().from(resetTokens).where(eq(resetTokens.token, token)).get();

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }

    if (resetToken.used) {
      return NextResponse.json({ error: 'This reset link has already been used' }, { status: 400 });
    }

    if (new Date() > resetToken.expires) {
      return NextResponse.json({ error: 'This reset link has expired' }, { status: 400 });
    }

    // Update the user's password
    const hashedPassword = await hash(password, 12);

    db.update(users)
      .set({ hashedPassword, updatedAt: new Date() })
      .where(eq(users.email, resetToken.email))
      .run();

    // Mark token as used
    db.update(resetTokens).set({ used: true }).where(eq(resetTokens.token, token)).run();

    return NextResponse.json({ message: 'Password has been reset successfully' });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
