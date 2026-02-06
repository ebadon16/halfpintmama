const requests = new Map<string, { count: number; resetAt: number }>();

let lastCleanup = Date.now();

function cleanupIfNeeded() {
  const now = Date.now();
  // Clean up at most once per minute
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, value] of requests) {
    if (now > value.resetAt) requests.delete(key);
  }
}

export function rateLimit(ip: string, limit = 10, windowMs = 60_000): boolean {
  cleanupIfNeeded();

  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}
