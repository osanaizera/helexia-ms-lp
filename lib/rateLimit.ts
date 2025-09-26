const buckets = new Map<string, number[]>();

export async function rateLimit(key: string, limit = 30, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const arr = buckets.get(key) || [];
  // drop old
  const fresh = arr.filter(ts => now - ts < windowMs);
  fresh.push(now);
  buckets.set(key, fresh);
  return fresh.length <= limit;
}

export function clientKeyFromRequest(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') || '';
  const ip = xff.split(',')[0].trim() || '127.0.0.1';
  const ua = req.headers.get('user-agent') || '';
  return `${ip}|${ua}`;
}

