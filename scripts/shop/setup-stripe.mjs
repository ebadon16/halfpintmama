// One-shot, idempotent setup of everything the shop needs inside Stripe.
// Safe to re-run: every object is found by a stable key before it is created.
//
//   STRIPE_SECRET_KEY=sk_test_... npm run shop:setup -- --book=3400 --labels=900 --shipping=500
//
// Amounts are in cents and only used when the Price does not exist yet (a
// Stripe Price is immutable; to reprice, create a new Price in the dashboard
// and point the env var at it). Prints the env block to paste into Vercel.
// Run once with the test key, once with the live key.

import Stripe from "stripe";
import { randomBytes } from "node:crypto";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  })
);
const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is not set (put it in .env.local or the environment)");
  process.exit(1);
}
const mode = key.startsWith("sk_live_") ? "live" : "test";
const stripe = new Stripe(key);
const site = args.site || "https://halfpintmama.com";

const PRODUCTS = {
  book: {
    name: "Rest and Rise",
    description:
      "Make-Ahead, Freezer-Friendly Sourdough Meals for Postpartum Recovery. Hardcover, packed and shipped by Keegan.",
    lookup: "hpm_book",
    amount: Number(args.book || 0),
    shippable: true,
  },
  labels: {
    name: "Printable Freezer Labels",
    description:
      "Fillable PDF freezer labels for every recipe in Rest and Rise. Digital download, unlimited reprints.",
    lookup: "hpm_labels",
    amount: Number(args.labels || 0),
    shippable: false,
  },
};

async function ensurePrice(id) {
  const spec = PRODUCTS[id];
  const existing = await stripe.prices.list({ lookup_keys: [spec.lookup], active: true, limit: 1 });
  if (existing.data[0]) {
    const p = existing.data[0];
    console.log(`  ${id}: price ${p.id} exists (${p.unit_amount} ${p.currency}), product ${p.product}`);
    return p;
  }
  if (!spec.amount) {
    console.error(`  ${id}: no price exists and no --${id}=<cents> given; skipping`);
    return null;
  }
  // Product: reuse one we made before (by metadata) even if its price was archived.
  const found = await stripe.products.search({ query: `metadata["hpm_product"]:"${id}" AND active:"true"`, limit: 1 });
  const product =
    found.data[0] ??
    (await stripe.products.create({
      name: spec.name,
      description: spec.description,
      shippable: spec.shippable,
      url: `${site}/shop`,
      metadata: { hpm_product: id },
    }));
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: spec.amount,
    currency: "usd",
    lookup_key: spec.lookup,
    metadata: { hpm_product: id },
  });
  console.log(`  ${id}: created product ${product.id} + price ${price.id} (${spec.amount} usd)`);
  return price;
}

async function ensureShippingRate() {
  const rates = await stripe.shippingRates.list({ active: true, limit: 100 });
  const mine = rates.data.find((r) => r.metadata?.hpm === "standard");
  if (mine) {
    console.log(`  shipping: ${mine.id} exists (${mine.fixed_amount?.amount} ${mine.fixed_amount?.currency})`);
    return mine;
  }
  const amount = Number(args.shipping || 0);
  if (!amount && args.shipping !== "0") {
    console.log("  shipping: none exists and no --shipping=<cents> given; skipping (shipping will be free)");
    return null;
  }
  const rate = await stripe.shippingRates.create({
    display_name: "Standard shipping (US)",
    type: "fixed_amount",
    fixed_amount: { amount, currency: "usd" },
    delivery_estimate: {
      minimum: { unit: "business_day", value: 3 },
      maximum: { unit: "business_day", value: 7 },
    },
    metadata: { hpm: "standard" },
  });
  console.log(`  shipping: created ${rate.id} (${amount} usd)`);
  return rate;
}

async function ensureWebhook() {
  const url = `${site}/api/stripe/webhook`;
  const events = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];
  const all = await stripe.webhookEndpoints.list({ limit: 100 });
  const mine = all.data.find((w) => w.url === url);
  if (mine) {
    const missing = events.filter((e) => !mine.enabled_events.includes(e) && !mine.enabled_events.includes("*"));
    if (missing.length) {
      await stripe.webhookEndpoints.update(mine.id, { enabled_events: [...new Set([...mine.enabled_events, ...events])] });
      console.log(`  webhook: ${mine.id} exists, added events ${missing.join(", ")}`);
    } else {
      console.log(`  webhook: ${mine.id} exists`);
    }
    console.log("  webhook: signing secret is only shown at creation; find it in Stripe → Developers → Webhooks");
    return { endpoint: mine, secret: null };
  }
  const endpoint = await stripe.webhookEndpoints.create({
    url,
    enabled_events: events,
    description: "Half Pint Mama shop fulfilment",
  });
  console.log(`  webhook: created ${endpoint.id}`);
  return { endpoint, secret: endpoint.secret };
}

console.log(`\nStripe (${mode} mode) setup for ${site}\n`);
const book = await ensurePrice("book");
const labels = await ensurePrice("labels");
const shipping = await ensureShippingRate();
const { secret } = await ensureWebhook();

console.log(`
# ---- paste into Vercel (${mode}) / .env.local ----
STRIPE_SECRET_KEY=${key.slice(0, 12)}…            # already have it
${book ? `STRIPE_PRICE_BOOK=${book.id}` : "# STRIPE_PRICE_BOOK=   (run again with --book=<cents>)"}
${labels ? `STRIPE_PRICE_LABELS=${labels.id}` : "# STRIPE_PRICE_LABELS=   (needed only when SHOP_PHASE=launched)"}
${shipping ? `STRIPE_SHIPPING_RATE=${shipping.id}` : "# STRIPE_SHIPPING_RATE=   (optional)"}
${secret ? `STRIPE_WEBHOOK_SECRET=${secret}` : "STRIPE_WEBHOOK_SECRET=   # copy from Stripe → Developers → Webhooks"}
SHOP_TOKEN_SECRET=${process.env.SHOP_TOKEN_SECRET || randomBytes(36).toString("base64url")}
SHOP_PHASE=preorder
SHOP_SHIP_ESTIMATE=${process.env.SHOP_SHIP_ESTIMATE || "<month year, e.g. November 2026>"}
SHOP_SHIP_COUNTRIES=US
`);
