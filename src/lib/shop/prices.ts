// Live prices from Stripe. The shop page shows what Stripe will charge, read
// from the same Price object Checkout uses, so the two can never disagree.

import { PRODUCTS, type ProductId } from "./catalog";
import { getPriceId, getStripe } from "./stripe";

export interface DisplayPrice {
  amount: number; // minor units, as Stripe stores it
  currency: string;
  formatted: string;
  // False once a Price has been archived, which is what happens to the old one
  // when a product is repriced. An archived Price still reads back fine but
  // Checkout refuses it, so the shop must not offer a buy button for it.
  active: boolean;
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

// Small TTL cache per serverless instance. The shop page also revalidates on
// its own schedule, so a reprice in Stripe shows up within minutes, no deploy.
const TTL_MS = 5 * 60_000;
const cache = new Map<string, { value: DisplayPrice; expires: number }>();

export async function getDisplayPrice(id: ProductId): Promise<DisplayPrice> {
  const priceId = getPriceId(id);
  const hit = cache.get(priceId);
  if (hit && hit.expires > Date.now()) return hit.value;

  const price = await getStripe().prices.retrieve(priceId);
  if (price.unit_amount == null) {
    throw new Error(`${PRODUCTS[id].priceEnv} points at a Price with no fixed amount`);
  }
  const value: DisplayPrice = {
    amount: price.unit_amount,
    currency: price.currency,
    formatted: formatMoney(price.unit_amount, price.currency),
    active: price.active,
  };
  cache.set(priceId, { value, expires: Date.now() + TTL_MS });
  return value;
}

// The $0 "free with preorder" Price on the labels product, created by
// scripts/shop/setup-stripe.mjs and found by its lookup key so there is no env
// var to forget. Null when it does not exist; checkout then simply omits the
// line rather than failing.
export const LABELS_BONUS_LOOKUP_KEY = "hpm_labels_bonus";
let bonusCache: { id: string | null; expires: number } | null = null;

export async function getLabelsBonusPriceId(): Promise<string | null> {
  if (bonusCache && bonusCache.expires > Date.now()) return bonusCache.id;
  const found = await getStripe().prices.list({ lookup_keys: [LABELS_BONUS_LOOKUP_KEY], active: true, limit: 1 });
  const price = found.data[0];
  const id = price && price.unit_amount === 0 ? price.id : null;
  bonusCache = { id, expires: Date.now() + TTL_MS };
  return id;
}
