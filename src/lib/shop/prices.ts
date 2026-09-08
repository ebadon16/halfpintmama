// Live prices from Stripe. The shop page shows what Stripe will charge, read
// from the same Price object Checkout uses, so the two can never disagree.

import { PRODUCTS, type ProductId } from "./catalog";
import { getPriceId, getStripe } from "./stripe";

export interface DisplayPrice {
  amount: number; // minor units, as Stripe stores it
  currency: string;
  formatted: string;
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
  };
  cache.set(priceId, { value, expires: Date.now() + TTL_MS });
  return value;
}
