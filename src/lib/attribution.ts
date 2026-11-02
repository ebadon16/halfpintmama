// Where a buyer came from, carried from the landing URL to the Stripe order so
// a launch email and a social post can be judged by the orders they produced.
// First touch wins for the browser session: a visitor who lands on a post from
// an email and buys from /shop three pages later still counts for the email.

export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const STORAGE_KEY = "hpm_attribution";
// Lower-case slugs only. Anything else is dropped rather than stored in Stripe.
const VALUE = /^[a-z0-9][a-z0-9._-]{0,39}$/;

export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== "object") return {};
  const out: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const raw = (input as Record<string, unknown>)[key];
    if (typeof raw !== "string") continue;
    const value = raw.trim().toLowerCase();
    if (VALUE.test(value)) out[key] = value;
  }
  return out;
}

export function attributionFromSearch(search: string): Attribution {
  const params = new URLSearchParams(search);
  const found: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const v = params.get(key);
    if (v) found[key] = v;
  }
  // A bare ?ref=instagram is the short form Keegan can type into a bio link.
  const ref = params.get("ref");
  if (ref && !found.utm_source) found.utm_source = ref;
  return sanitizeAttribution(found);
}

// Browser only. Storage can be unavailable (private mode, blocked), so every
// access is guarded and a failure simply means no attribution.
export function rememberAttribution(search: string = typeof window !== "undefined" ? window.location.search : ""): void {
  try {
    if (Object.keys(getAttribution()).length) return;
    const found = attributionFromSearch(search);
    if (Object.keys(found).length) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    /* storage unavailable */
  }
}

export function getAttribution(): Attribution {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeAttribution(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}
