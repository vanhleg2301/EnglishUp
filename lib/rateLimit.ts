const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

export function checkRateLimit(ip: string): { limited: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfterMs: 0 };
  }

  entry.count++;
  if (entry.count > MAX_ATTEMPTS) {
    return { limited: true, retryAfterMs: entry.resetAt - now };
  }

  return { limited: false, retryAfterMs: 0 };
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
