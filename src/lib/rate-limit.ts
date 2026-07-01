import { RateLimiterMemory } from 'rate-limiter-flexible';

// Login: 10 attempts per 15 minutes per IP
export const loginLimiter = new RateLimiterMemory({
  points: 10,
  duration: 900,
});

// Register: 5 attempts per hour per IP
export const registerLimiter = new RateLimiterMemory({
  points: 5,
  duration: 3600,
});

// General API: 100 requests per minute per IP
export const apiLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

interface RateLimitResult {
  ok: boolean;
  retryAfter?: number;
}

export async function checkRateLimit(
  limiter: RateLimiterMemory,
  key: string,
): Promise<RateLimitResult> {
  try {
    await limiter.consume(key);
    return { ok: true };
  } catch (rejected) {
    const msBeforeNext = (rejected as { msBeforeNext?: number }).msBeforeNext ?? 0;
    return {
      ok: false,
      retryAfter: Math.ceil(msBeforeNext / 1000),
    };
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  return '127.0.0.1';
}
