// Stripe client and the "is the shop actually configured" check.
//
// Every Stripe-touching module goes through here. The client is created lazily
// so importing shop code on pages that never sell anything (or in the self-test)
// doesn't demand a key.

import Stripe from "stripe";

// Pinned deliberately. An unpinned client takes whatever version the installed
// SDK defaults to, so a routine dependency bump can silently move a field —
// which is how a sibling project lost a subscription end date and granted
// permanent access. Every field this shop reads is read against this version.
const API_VERSION = "2026-08-26.dahlia";
import { PRODUCTS, getShopPhase, purchasableProducts, type ProductId, type ShopPhase } from "./catalog";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    client = new Stripe(key, { apiVersion: API_VERSION });
  }
  return client;
}

export function getPriceId(id: ProductId): string {
  const value = process.env[PRODUCTS[id].priceEnv];
  if (!value) throw new Error(`${PRODUCTS[id].priceEnv} is not configured`);
  return value;
}

// Preorders take money for a later ship date, and the FTC Mail Order Rule
// requires that date to be stated at purchase. So the shop refuses to open in
// preorder phase without one — a copy string like "November 2026".
export function getShipEstimate(): string | null {
  const value = process.env.SHOP_SHIP_ESTIMATE?.trim();
  return value ? value : null;
}

// Everything the current phase needs before a single card can be charged.
// Returns the list of missing pieces; an empty list means the shop is live.
// The shop page uses this to fall back to the waitlist, and the checkout
// route uses it to refuse rather than half-work.
//
// This deliberately covers fulfilment, not just payment. Without the webhook
// secret the webhook 503s and no order is ever fulfilled or even reported to
// Keegan; without the Resend key no email can be sent. Taking money in either
// state is worse than not opening, so both belong in the gate.
export function shopConfigProblems(phase: ShopPhase = getShopPhase()): string[] {
  const missing: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
  if (!process.env.STRIPE_WEBHOOK_SECRET) missing.push("STRIPE_WEBHOOK_SECRET (fulfilment cannot run without it)");
  if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY (no order email can be sent without it)");
  if (!process.env.SHOP_TOKEN_SECRET || process.env.SHOP_TOKEN_SECRET.length < 32) {
    missing.push("SHOP_TOKEN_SECRET (32+ chars)");
  }
  for (const product of purchasableProducts(phase)) {
    if (!process.env[product.priceEnv]) missing.push(product.priceEnv);
  }
  // Stripe objects never cross modes. A live key with Price IDs created in test
  // (or the reverse) fails only when a buyer clicks buy, with an error nobody
  // watching the storefront would see. Catch it while the page is rendering.
  const live = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_");
  if (live && process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.startsWith("whsec_")) {
    missing.push("STRIPE_WEBHOOK_SECRET (malformed)");
  }
  if (phase === "preorder" && !getShipEstimate()) missing.push("SHOP_SHIP_ESTIMATE");
  return missing;
}

export function isShopEnabled(phase: ShopPhase = getShopPhase()): boolean {
  return shopConfigProblems(phase).length === 0;
}

// Sales tax. Off until Keegan holds a Texas Sales and Use Tax Permit and the
// matching registration exists in Stripe, because collecting tax you are not
// registered to collect is worse than not collecting it. Once both are true this
// flips on and Stripe works out the rate from the buyer's address, including the
// local portion and the tax on shipping, which Texas also charges.
export function collectsTax(): boolean {
  return process.env.SHOP_COLLECT_TAX === "on";
}

// How many books one checkout may take. Stripe's shipping rate is charged once
// per order, not per item, so every extra copy ships on Keegan's margin. The
// default is 1 for that reason; raise it only alongside a shipping rate priced
// for the larger box.
export function getMaxBooksPerOrder(): number {
  const raw = Number(process.env.SHOP_MAX_BOOKS_PER_ORDER);
  if (!Number.isFinite(raw)) return 1;
  return Math.min(Math.max(Math.trunc(raw), 1), 10);
}

// Where physical orders can ship. Stripe Checkout collects the address itself;
// we only tell it which countries to offer. Defaults to US-only.
export function getShipCountries(): Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] {
  const raw = process.env.SHOP_SHIP_COUNTRIES || "US";
  return raw
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter((c) => /^[A-Z]{2}$/.test(c)) as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[];
}
