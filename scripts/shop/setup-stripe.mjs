// One-shot, idempotent setup of everything the shop needs inside Stripe.
// Safe to re-run: every object is found by a stable key before it is created.
//
//   STRIPE_SECRET_KEY=sk_test_... npm run shop:setup -- --book=3999 --labels=999 --shipping=500 [--tax-from=YYYY-MM-DD] [--no-tax]
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

const money = (amount, currency = "usd") =>
  amount == null ? "no fixed amount" : `$${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
const site = args.site || "https://halfpintmama.com";

const PRODUCTS = {
  book: {
    name: "Rest & Rise",
    description:
      "Make-Ahead, Freezer-Friendly Sourdough Meals for Postpartum Recovery. Hardcover, packed and shipped by Keegan.",
    lookup: "hpm_book",
    amount: Number(args.book || 0),
    shippable: true,
    taxCode: "txcd_35010000", // Books
  },
  labels: {
    name: "Printable Freezer Labels",
    description:
      "Fillable PDF freezer labels for every recipe in Rest & Rise. Digital download, unlimited reprints.",
    lookup: "hpm_labels",
    amount: Number(args.labels || 0),
    shippable: false,
    taxCode: "txcd_10505001", // Digital Finished Artwork, downloaded, permanent rights
  },
};

// Stripe Prices are immutable: a new amount means a new Price. The lookup key
// is moved onto the new one so there is a single stable name per product, and
// the old Price is archived so it can never be charged again. Re-running with
// the same amount is a no-op.
async function ensurePrice(id) {
  const spec = PRODUCTS[id];
  const existing = await stripe.prices.list({ lookup_keys: [spec.lookup], active: true, limit: 1 });
  const current = existing.data[0];

  if (current && (!spec.amount || current.unit_amount === spec.amount)) {
    console.log(`  ${id}: price ${current.id} unchanged (${money(current.unit_amount, current.currency)})`);
    return current;
  }

  if (!spec.amount) {
    console.error(`  ${id}: no price exists and no --${id}=<cents> given; skipping`);
    return null;
  }

  const product = current
    ? current.product
    : (
        await stripe.products.search({ query: `metadata["hpm_product"]:"${id}" AND active:"true"`, limit: 1 })
      ).data[0] ??
      (await stripe.products.create({
        name: spec.name,
        description: spec.description,
        shippable: spec.shippable,
        tax_code: spec.taxCode,
        url: `${site}/shop`,
        metadata: { hpm_product: id },
      }));

  const price = await stripe.prices.create({
    product: typeof product === "string" ? product : product.id,
    unit_amount: spec.amount,
    currency: "usd",
    lookup_key: spec.lookup,
    transfer_lookup_key: true,
    metadata: { hpm_product: id },
  });

  if (current) {
    await stripe.prices.update(current.id, { active: false });
    console.log(
      `  ${id}: REPRICED ${money(current.unit_amount, current.currency)} -> ${money(price.unit_amount, price.currency)}`
    );
    console.log(`         new price ${price.id} (old ${current.id} archived) — update the env var and redeploy`);
  } else {
    console.log(`  ${id}: created price ${price.id} (${money(price.unit_amount, price.currency)})`);
  }
  return price;
}

// The preorder bonus shows up on the Stripe pay page as its own $0.00 line,
// so the buyer sees the labels in the cart. One zero-amount Price on the labels
// product, found by lookup key at checkout; nothing to paste into env.
async function ensureBonusPrice(labelsPrice) {
  if (!labelsPrice) {
    console.log("  bonus: skipped (no labels price yet)");
    return null;
  }
  const existing = await stripe.prices.list({ lookup_keys: ["hpm_labels_bonus"], active: true, limit: 1 });
  if (existing.data[0]) {
    console.log(`  bonus: ${existing.data[0].id} unchanged ($0.00, free with preorder)`);
    return existing.data[0];
  }
  const price = await stripe.prices.create({
    product: typeof labelsPrice.product === "string" ? labelsPrice.product : labelsPrice.product.id,
    unit_amount: 0,
    currency: "usd",
    nickname: "Free with preorder",
    lookup_key: "hpm_labels_bonus",
    metadata: { hpm_product: "labels_bonus" },
  });
  console.log(`  bonus: created ${price.id} ($0.00, free with preorder)`);
  return price;
}

// Shipping rates are immutable too. A changed amount archives the old rate and
// creates a new one carrying the same marker.
async function ensureShippingRate() {
  const rates = await stripe.shippingRates.list({ active: true, limit: 100 });
  const mine = rates.data.find((r) => r.metadata?.hpm === "standard");
  const wanted = args.shipping === undefined ? null : Number(args.shipping);

  if (mine && (wanted === null || mine.fixed_amount?.amount === wanted)) {
    console.log(`  shipping: ${mine.id} unchanged (${money(mine.fixed_amount?.amount, mine.fixed_amount?.currency)})`);
    return mine;
  }
  if (wanted === null) {
    console.log("  shipping: none exists and no --shipping=<cents> given; skipping (shipping will be free)");
    return null;
  }

  const rate = await stripe.shippingRates.create({
    display_name: "Standard shipping (US)",
    type: "fixed_amount",
    fixed_amount: { amount: wanted, currency: "usd" },
    delivery_estimate: {
      minimum: { unit: "business_day", value: 3 },
      maximum: { unit: "business_day", value: 7 },
    },
    metadata: { hpm: "standard" },
  });

  if (mine) {
    await stripe.shippingRates.update(mine.id, { active: false });
    console.log(
      `  shipping: REPRICED ${money(mine.fixed_amount?.amount, mine.fixed_amount?.currency)} -> ${money(rate.fixed_amount?.amount, rate.fixed_amount?.currency)}`
    );
    console.log(`            new rate ${rate.id} (old ${mine.id} archived) — update the env var and redeploy`);
  } else {
    console.log(`  shipping: created ${rate.id} (${money(rate.fixed_amount?.amount, rate.fixed_amount?.currency)})`);
  }
  return rate;
}

async function ensureWebhook() {
  if (mode !== "live") {
    console.log("  webhook: skipped in test mode. For local testing run:");
    console.log("    stripe listen --api-key $STRIPE_SECRET_KEY --forward-to localhost:3000/api/stripe/webhook");
    console.log("    then put the whsec_... it prints into STRIPE_WEBHOOK_SECRET for that dev server only.");
    return { endpoint: null, secret: null };
  }

  const url = `${site}/api/stripe/webhook`;
  // Registering before the route is deployed guarantees failed deliveries.
  try {
    const probe = await fetch(url, { method: "POST", headers: { "stripe-signature": "probe" }, body: "{}" });
    if (probe.status === 404) {
      console.error(`  webhook: ${url} returns 404 — deploy the site first, then re-run. Skipping.`);
      return { endpoint: null, secret: null };
    }
  } catch (err) {
    console.error(`  webhook: could not reach ${url} (${err instanceof Error ? err.message : err}). Deploy first, then re-run. Skipping.`);
    return { endpoint: null, secret: null };
  }

  const events = [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    // Money leaving after the sale: Keegan needs to know before she ships.
    "charge.refunded",
    "charge.dispute.created",
  ];
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

// Sales tax. Texas requires a seller inside the state to collect on Texas
// orders from the first sale, and Stripe Tax only calculates where a
// registration exists, so the account needs (1) a head office and (2) a Texas
// state registration before SHOP_COLLECT_TAX can be switched on. Both are
// idempotent here. Run only once Keegan holds the Texas Sales and Use Tax
// Permit: --tax-from=YYYY-MM-DD is the permit's effective date (default today).
// Pass --no-tax to leave the account's tax setup alone.
const HEAD_OFFICE = {
  line1: "2800 Joe DiMaggio Blvd Unit 79",
  city: "Round Rock",
  state: "TX",
  postal_code: "78665",
  country: "US",
};

async function ensureTax() {
  if (args["no-tax"]) {
    console.log("  tax: skipped (--no-tax)");
    return false;
  }
  const settings = await stripe.tax.settings.retrieve();
  const office = settings.head_office?.address;
  if (!office || office.postal_code !== HEAD_OFFICE.postal_code) {
    await stripe.tax.settings.update({
      head_office: { address: HEAD_OFFICE },
      // Prices are tax-exclusive: the buyer sees the book price, then tax on top,
      // which is how the storefront and the announcement email describe it.
      defaults: { tax_behavior: "exclusive", tax_code: PRODUCTS.book.taxCode },
    });
    console.log(`  tax: head office set to ${HEAD_OFFICE.city}, ${HEAD_OFFICE.state}`);
  } else if (settings.defaults?.tax_behavior !== "exclusive") {
    await stripe.tax.settings.update({ defaults: { tax_behavior: "exclusive", tax_code: PRODUCTS.book.taxCode } });
    console.log("  tax: default tax behaviour set to exclusive");
  } else {
    console.log(`  tax: head office already ${office.city}, ${office.state}`);
  }

  const regs = await stripe.tax.registrations.list({ status: "all", limit: 100 });
  const tx = regs.data.find(
    (r) => r.country === "US" && r.country_options?.us?.state === "TX" && r.status !== "expired"
  );
  if (tx) {
    console.log(`  tax: Texas registration ${tx.id} exists (${tx.status})`);
  } else {
    const from = args["tax-from"];
    if (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) throw new Error("--tax-from must be YYYY-MM-DD");
    const reg = await stripe.tax.registrations.create({
      country: "US",
      country_options: { us: { type: "state_sales_tax", state: "TX" } },
      active_from: from ? Math.floor(Date.parse(`${from}T00:00:00-05:00`) / 1000) : "now",
    });
    console.log(`  tax: created Texas registration ${reg.id} (active from ${from || "now"})`);
  }
  const after = await stripe.tax.settings.retrieve();
  if (after.status !== "active") {
    console.error(`  tax: Stripe Tax status is "${after.status}" — finish activation in Dashboard → Settings → Tax before switching collection on`);
    return false;
  }
  return true;
}

console.log(`\nStripe (${mode} mode) setup for ${site}\n`);
const book = await ensurePrice("book");
const labels = await ensurePrice("labels");
await ensureBonusPrice(labels);
const shipping = await ensureShippingRate();
const { secret } = await ensureWebhook();
const taxReady = await ensureTax();

console.log(`
# ---- paste into Vercel (${mode}) / .env.local ----
STRIPE_SECRET_KEY=${key.slice(0, 12)}…            # already have it
${book ? `STRIPE_PRICE_BOOK=${book.id}` : "# STRIPE_PRICE_BOOK=   (run again with --book=<cents>)"}
${labels ? `STRIPE_PRICE_LABELS=${labels.id}` : "# STRIPE_PRICE_LABELS=   (needed only when SHOP_PHASE=launched)"}
${shipping ? `STRIPE_SHIPPING_RATE=${shipping.id}` : "# STRIPE_SHIPPING_RATE=   (optional)"}
${secret ? `STRIPE_WEBHOOK_SECRET=${secret}` : mode === "live" ? "STRIPE_WEBHOOK_SECRET=   # register the endpoint after deploying, then copy its secret" : "# STRIPE_WEBHOOK_SECRET=   # test mode: use the secret `stripe listen` prints, locally only"}
${
  process.env.SHOP_TOKEN_SECRET
    ? `SHOP_TOKEN_SECRET=${process.env.SHOP_TOKEN_SECRET}   # unchanged`
    : `SHOP_TOKEN_SECRET=${randomBytes(36).toString("base64url")}
#   ^ NEW secret, generated because none was set. Use it ONLY for a first launch.
#   Replacing an existing one invalidates every delivery link already emailed,
#   against a product that promises the link works forever.`
}
SHOP_PHASE=preorder
SHOP_SHIP_ESTIMATE=${process.env.SHOP_SHIP_ESTIMATE || "<month year, e.g. November 2026>"}
SHOP_SHIP_COUNTRIES=US
${taxReady ? "SHOP_COLLECT_TAX=on" : "# SHOP_COLLECT_TAX=on   # only once Stripe Tax is active with a Texas registration"}
`);
