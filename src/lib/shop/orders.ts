// Reading orders back out of Stripe. Stripe IS the order database: nothing
// about a purchase is stored on our side, so every access check (delivery page,
// PDF download, link recovery) re-reads the real order from Stripe.

import type Stripe from "stripe";
import { PRODUCTS, entitlementsFor, type Entitlement, type ProductId, type ShopPhase } from "./catalog";
import { getStripe } from "./stripe";

// The metadata our checkout route stamps onto every session, and onto its
// PaymentIntent so it's visible in the Stripe dashboard.
export const META_PHASE = "shop_phase";
export const META_PRODUCTS = "product_ids";
// The ship date promised at purchase (preorders only), for the buyer's email.
export const META_SHIP_ESTIMATE = "ship_estimate";
// Set on the PaymentIntent (or, for a zero-total order with no PaymentIntent,
// on the session) once fulfilment has run. This is the idempotency marker: a
// webhook retry sees it and does nothing.
export const META_FULFILLED_AT = "fulfilled_at";
// Stamped alongside it: the buyer's email, lowercased. Stripe's own email
// filters match the address exactly as typed, so "lost your link" searches
// this normalised copy instead.
export const META_BUYER_EMAIL = "buyer_email";
// Set on the PaymentIntent when Keegan sends the "it's on its way" email.
export const META_SHIPPED_AT = "shipped_at";

export interface ShippingAddress {
  name: string | null;
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface Order {
  sessionId: string;
  email: string | null;
  // The phase the order was PLACED in, from metadata. Never the current phase.
  phase: ShopPhase;
  productIds: ProductId[];
  // How many of the (single) line item; books can be bought up to 5 at a time.
  quantity: number;
  shipEstimate: string | null;
  paid: boolean;
  // Stripe's session status: "complete", "open", or "expired".
  status: string | null;
  refunded: boolean;
  amountTotal: number | null;
  currency: string | null;
  shipping: ShippingAddress | null;
  paymentIntentId: string | null;
  fulfilledAt: string | null;
  shippedAt: string | null;
}

export function orderEntitlements(order: Order): Entitlement[] {
  return entitlementsFor(order.productIds, order.phase);
}

// The buyer keeps their labels only while the payment stands. A full refund
// revokes; a partial refund (say, shipping refunded on a damaged box) does not.
// A dispute counts too: on a chargeback Stripe pulls the funds back without
// touching the refund fields, so without this a buyer could keep both the money
// and a perpetual download link.
function isRefunded(charge: Stripe.Charge | null): boolean {
  if (!charge) return false;
  if (charge.refunded || charge.disputed) return true;
  const captured = charge.amount_captured ?? charge.amount;
  return captured > 0 && charge.amount_refunded >= captured;
}

// Which product a Stripe Price belongs to, by the env the shop is configured
// with. Unknown or missing prices map to nothing.
export function productForPrice(priceId: string | undefined | null): ProductId | null {
  if (!priceId) return null;
  for (const id of Object.keys(PRODUCTS) as ProductId[]) {
    if (process.env[PRODUCTS[id].priceEnv] === priceId) return id;
  }
  return null;
}

// Pure: builds an Order from a session that was retrieved with
// `payment_intent.latest_charge` expanded. Fails closed — a session without our
// metadata (not created by our checkout route) has no products and so grants
// nothing.
export function orderFromSession(session: Stripe.Checkout.Session): Order {
  const meta = session.metadata ?? {};
  const phase: ShopPhase = meta[META_PHASE] === "launched" ? "launched" : "preorder";
  const stamped = (meta[META_PRODUCTS] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is ProductId => s in PRODUCTS);
  // After launch the pay page offers the labels as an add-on, which only ever
  // appears in the line items. Map each paid line back to a product by its
  // Price ID. The $0 preorder bonus line uses a different Price and so maps to
  // nothing here; that entitlement comes from the phase, not the cart.
  const lines = session.line_items?.data ?? [];
  const fromCart = lines
    .map((li) => productForPrice(li.price?.id))
    .filter((id): id is ProductId => id !== null);
  const productIds = [...new Set([...stamped, ...fromCart])];

  const pi = typeof session.payment_intent === "object" ? session.payment_intent : null;
  const charge = pi && typeof pi.latest_charge === "object" ? pi.latest_charge : null;
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : (pi?.id ?? null);

  const ship = session.collected_information?.shipping_details ?? null;
  const shipping: ShippingAddress | null = ship
    ? {
        name: ship.name ?? null,
        line1: ship.address?.line1 ?? null,
        line2: ship.address?.line2 ?? null,
        city: ship.address?.city ?? null,
        state: ship.address?.state ?? null,
        postalCode: ship.address?.postal_code ?? null,
        country: ship.address?.country ?? null,
      }
    : null;

  const bookLine = lines.find((li) => productForPrice(li.price?.id) === "book") ?? lines[0];
  const quantity = bookLine?.quantity ?? 1;

  return {
    sessionId: session.id,
    email: session.customer_details?.email?.trim().toLowerCase() ?? null,
    phase,
    productIds,
    quantity: quantity > 0 ? quantity : 1,
    shipEstimate: meta[META_SHIP_ESTIMATE]?.trim() || null,
    // A 100%-off promotion code completes the session with no payment at all;
    // the buyer is still owed their goods.
    paid: session.payment_status === "paid" || session.payment_status === "no_payment_required",
    status: session.status ?? null,
    refunded: isRefunded(charge),
    amountTotal: session.amount_total,
    currency: session.currency,
    shipping,
    paymentIntentId,
    fulfilledAt: pi?.metadata?.[META_FULFILLED_AT] ?? meta[META_FULFILLED_AT] ?? null,
    shippedAt: pi?.metadata?.[META_SHIPPED_AT] ?? meta[META_SHIPPED_AT] ?? null,
  };
}

const EXPAND = ["payment_intent.latest_charge", "line_items"];

export async function getOrder(sessionId: string): Promise<Order | null> {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, { expand: EXPAND });
    return orderFromSession(session);
  } catch (err) {
    // Stripe throws on unknown IDs; treat as "no such order".
    if ((err as { code?: string })?.code === "resource_missing") return null;
    if ((err as { statusCode?: number })?.statusCode === 404) return null;
    throw err;
  }
}

// Every paid book order that has not been marked shipped. Drives the
// "it's on its way" email Keegan sends once the print run lands. Found through
// the PaymentIntent metadata stamped at checkout, so a comped book order taken
// with a 100%-off code has no PaymentIntent to find and will not appear here;
// send those by hand, there will be a handful at most.
export async function findUnshippedBookOrders(): Promise<Order[]> {
  const stripe = getStripe();
  const orders: Order[] = [];
  for await (const pi of stripe.paymentIntents.search({
    // In Stripe's search syntax `:null` means "not set".
    query: `metadata["${META_PRODUCTS}"]:"book" AND metadata["${META_SHIPPED_AT}"]:null`,
    limit: 100,
  })) {
    if (pi.metadata?.[META_SHIPPED_AT]) continue;
    const sessions = await stripe.checkout.sessions.list({ payment_intent: pi.id, limit: 1, expand: EXPAND.map((e) => `data.${e}`) });
    const session = sessions.data[0];
    if (!session) continue;
    const order = orderFromSession(session);
    if (order.paid && !order.refunded && order.productIds.includes("book") && !order.shippedAt) orders.push(order);
  }
  return orders;
}

// Every paid, unrefunded order for this email that carries the labels
// entitlement. Used by "lost your link": the entitlement comes from the
// purchase-time metadata, not from "a book order exists" — after launch a book
// order alone does not include labels.
//
// Takes the address AS THE BUYER TYPED IT. Two lookups, because Stripe matches
// emails byte-for-byte:
//  1. PaymentIntent search on the lowercased copy fulfilment stamped (case-proof,
//     covers every paid order; the search index can lag a minute behind).
//  2. The session list filtered by the address as typed and lowercased, which
//     also catches zero-total orders that have no PaymentIntent to search.
export async function findLabelOrdersByEmail(email: string): Promise<Order[]> {
  const stripe = getStripe();
  const typed = email.trim();
  const lower = typed.toLowerCase();
  // If the caller already lowercased, the second lookup is a duplicate and the
  // Set collapses it; passing the raw address is what makes it do real work.
  const seen = new Set<string>();
  const orders: Order[] = [];
  const consider = (session: Stripe.Checkout.Session) => {
    if (seen.has(session.id)) return;
    seen.add(session.id);
    const order = orderFromSession(session);
    if (order.email !== lower) return;
    if (order.paid && !order.refunded && orderEntitlements(order).includes("labels")) orders.push(order);
  };

  const escaped = lower.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const found = await stripe.paymentIntents.search({
    query: `metadata["${META_BUYER_EMAIL}"]:"${escaped}"`,
    limit: 100,
  });
  for (const pi of found.data) {
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: pi.id,
      limit: 1,
      expand: EXPAND.map((e) => `data.${e}`),
    });
    sessions.data.forEach(consider);
  }

  for (const form of new Set([typed, lower])) {
    const sessions = await stripe.checkout.sessions.list({
      customer_details: { email: form },
      status: "complete",
      limit: 100,
      expand: EXPAND.map((e) => `data.${e}`),
    });
    sessions.data.forEach(consider);
  }
  return orders;
}

export async function markShipped(order: Order, when = new Date()): Promise<void> {
  await writeMarker(order, { [META_SHIPPED_AT]: when.toISOString() });
}

export async function markFulfilled(order: Order, when = new Date()): Promise<void> {
  const metadata: Record<string, string> = { [META_FULFILLED_AT]: when.toISOString() };
  if (order.email) metadata[META_BUYER_EMAIL] = order.email;
  await writeMarker(order, metadata);
}

async function writeMarker(order: Order, metadata: Record<string, string>): Promise<void> {
  if (order.paymentIntentId) {
    await getStripe().paymentIntents.update(order.paymentIntentId, { metadata });
  } else {
    // Zero-total order (promotion code): no PaymentIntent exists, so the
    // marker lives on the session instead.
    await getStripe().checkout.sessions.update(order.sessionId, { metadata });
  }
}
