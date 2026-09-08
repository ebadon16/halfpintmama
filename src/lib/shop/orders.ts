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
// Set on the PaymentIntent once fulfilment has run. This is the idempotency
// marker: a webhook retry sees it and does nothing.
export const META_FULFILLED_AT = "fulfilled_at";

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
  shipEstimate: string | null;
  paid: boolean;
  refunded: boolean;
  amountTotal: number | null;
  currency: string | null;
  shipping: ShippingAddress | null;
  paymentIntentId: string | null;
  fulfilledAt: string | null;
}

export function orderEntitlements(order: Order): Entitlement[] {
  return entitlementsFor(order.productIds, order.phase);
}

// The buyer keeps their labels only while the payment stands. A full refund
// revokes; a partial refund (say, shipping refunded on a damaged box) does not.
function isRefunded(charge: Stripe.Charge | null): boolean {
  if (!charge) return false;
  if (charge.refunded) return true;
  const captured = charge.amount_captured ?? charge.amount;
  return captured > 0 && charge.amount_refunded >= captured;
}

// Pure: builds an Order from a session that was retrieved with
// `payment_intent.latest_charge` expanded. Fails closed — a session without our
// metadata (not created by our checkout route) has no products and so grants
// nothing.
export function orderFromSession(session: Stripe.Checkout.Session): Order {
  const meta = session.metadata ?? {};
  const phase: ShopPhase = meta[META_PHASE] === "launched" ? "launched" : "preorder";
  const productIds = (meta[META_PRODUCTS] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is ProductId => s in PRODUCTS);

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

  return {
    sessionId: session.id,
    email: session.customer_details?.email?.trim().toLowerCase() ?? null,
    phase,
    productIds,
    shipEstimate: meta[META_SHIP_ESTIMATE]?.trim() || null,
    paid: session.payment_status === "paid",
    refunded: isRefunded(charge),
    amountTotal: session.amount_total,
    currency: session.currency,
    shipping,
    paymentIntentId,
    fulfilledAt: pi?.metadata?.[META_FULFILLED_AT] ?? null,
  };
}

const EXPAND = ["payment_intent.latest_charge"];

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

// Every paid, unrefunded order for this email that carries the labels
// entitlement. Used by "lost your link": the entitlement comes from the
// purchase-time metadata, not from "a book order exists" — after launch a book
// order alone does not include labels.
export async function findLabelOrdersByEmail(email: string): Promise<Order[]> {
  const sessions = await getStripe().checkout.sessions.list({
    customer_details: { email: email.trim().toLowerCase() },
    status: "complete",
    limit: 100,
    expand: EXPAND.map((e) => `data.${e}`),
  });
  return sessions.data
    .map(orderFromSession)
    .filter((o) => o.paid && !o.refunded && orderEntitlements(o).includes("labels"));
}

export async function markFulfilled(order: Order, when = new Date()): Promise<void> {
  if (!order.paymentIntentId) return;
  await getStripe().paymentIntents.update(order.paymentIntentId, {
    metadata: { [META_FULFILLED_AT]: when.toISOString() },
  });
}
