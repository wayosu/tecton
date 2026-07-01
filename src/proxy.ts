import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Public routes
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path));

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protect all other routes (except API and static)
  if (!isLoggedIn && !isPublicPath) {
    // Allow unauthenticated API requests (they handle auth internally)
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
