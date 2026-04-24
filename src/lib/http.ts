// Extract the real client IP from a request. Prefers Vercel-set headers
// (which the edge sets and clients can't spoof) over raw X-Forwarded-For
// (which clients CAN prepend to). Falls back gracefully in non-Vercel envs.
export function getClientIp(request: Request): string {
  const vercelIp = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercelIp) return vercelIp.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const xff = request.headers.get("x-forwarded-for")?.trim();
  if (xff) return xff.split(",")[0].trim();

  return "unknown";
}

const ALLOWED_ORIGINS = new Set([
  "https://halfpintmama.com",
  "https://www.halfpintmama.com",
]);

// Reject cross-site POSTs: browsers set Origin on same-site fetches from
// halfpintmama.com but not from attacker-controlled origins without CORS.
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (process.env.NODE_ENV !== "production") {
    if (origin?.startsWith("http://localhost:")) return true;
  }

  if (origin && ALLOWED_ORIGINS.has(origin)) return true;

  if (!origin) {
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        return ALLOWED_ORIGINS.has(new URL(referer).origin);
      } catch {
        return false;
      }
    }
  }

  return false;
}

// Constant-time string comparison to prevent timing attacks on secrets.
export function safeEquals(a: string | null | undefined, b: string): boolean {
  if (!a || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
