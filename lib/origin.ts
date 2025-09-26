export function parseOrigin(url: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`.toLowerCase();
  } catch {
    return null;
  }
}

export function getAllowedOrigins(req: Request): Set<string> {
  const set = new Set<string>();
  const env = process.env.ALLOWED_ORIGINS || '';
  env.split(',').map(s=>s.trim()).filter(Boolean).forEach(o=> set.add(o.toLowerCase()));
  // Always allow localhost for dev
  set.add('http://localhost:3000');
  set.add('http://127.0.0.1:3000');
  // Also allow current host (useful when env not set)
  try { const host = (req.headers.get('host')||'').toLowerCase(); if (host) { set.add(`https://${host}`); set.add(`http://${host}`) } } catch {}
  return set;
}

export function isAllowedRequest(req: Request): boolean {
  const allowed = getAllowedOrigins(req);
  const origin = (req.headers.get('origin')||'').toLowerCase();
  const referer = parseOrigin(req.headers.get('referer'));
  if (!origin && !referer) return true; // allow when unknown (e.g., server-to-server)
  if (origin && allowed.has(origin)) return true;
  if (referer && allowed.has(referer)) return true;
  return false;
}

