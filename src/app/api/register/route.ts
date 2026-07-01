import { NextResponse, type NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { registerLimiter, checkRateLimit, getClientIP } from '@/lib/rate-limit';

const registerSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 registrations per hour per IP
    const ip = getClientIP(request);
    const { ok, retryAfter } = await checkRateLimit(registerLimiter, ip);
    if (!ok) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfter) },
        },
      );
    }

    const body = await request.json();

    // Zod validation
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
      return NextResponse.json({ error: firstError || 'Validation failed' }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // Check existing user
    const existing = db.select({ id: users.id }).from(users).where(eq(users.email, email)).get();

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);
    db.insert(users)
      .values({
        id: uuid(),
        name: name || null,
        email,
        hashedPassword,
        emailVerified: new Date(),
        role: 'viewer',
      })
      .run();

    // Generate email verification token
    const verifyToken = uuid();
    db.insert(verificationTokens)
      .values({
        identifier: email,
        token: verifyToken,
        expires: new Date(Date.now() + 86400 * 1000), // 24h
      })
      .run();
    return NextResponse.json(
      {
        message: 'Account created successfully',
        ...(process.env.NODE_ENV === 'development'
          ? { verificationLink: `${request.nextUrl.origin}/verify-email?token=${verifyToken}` }
          : {}),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
