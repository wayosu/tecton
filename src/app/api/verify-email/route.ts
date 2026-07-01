import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verificationTokens, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing verification token' }, { status: 400 });
  }

  // Look up token
  const vt = db.select().from(verificationTokens).where(eq(verificationTokens.token, token)).get();

  if (!vt) {
    return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 });
  }

  if (new Date() > vt.expires) {
    return NextResponse.json({ error: 'Verification token has expired' }, { status: 400 });
  }

  // Mark user as verified
  db.update(users)
    .set({ emailVerified: new Date(), updatedAt: new Date() })
    .where(eq(users.email, vt.identifier))
    .run();

  // Delete used token
  db.delete(verificationTokens).where(eq(verificationTokens.token, token)).run();

  return NextResponse.json({ message: 'Email verified successfully' });
}
