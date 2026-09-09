// What happens after Stripe says "paid": grant what the order entitles, tell
// Keegan, and mark the PaymentIntent so a webhook retry does nothing twice.

import { SITE_URL } from "@/lib/seo";
import { signDeliveryToken } from "./entitlement";
import { sendLabelsDelivery, sendOrderNotification } from "./email";
import { markFulfilled, orderEntitlements, type Order } from "./orders";

export function deliveryPath(token: string): string {
  return `/shop/labels/${token}`;
}

// The buyer's perpetual labels link, or null when the order carries none.
// Signed from the order as Stripe recorded it, so the token can never claim
// more than was bought.
export function deliveryLinkFor(order: Order, origin = SITE_URL): string | null {
  if (!order.email || !orderEntitlements(order).includes("labels")) return null;
  const token = signDeliveryToken({
    email: order.email,
    session: order.sessionId,
    phase: order.phase,
    iat: Math.floor(Date.now() / 1000),
  });
  return `${origin}${deliveryPath(token)}`;
}

export type FulfilResult = "unpaid" | "already-fulfilled" | "fulfilled";

export async function fulfilOrder(order: Order): Promise<FulfilResult> {
  if (!order.paid) return "unpaid";
  if (order.fulfilledAt) return "already-fulfilled";

  const link = deliveryLinkFor(order);
  if (link && order.email) {
    await sendLabelsDelivery({
      to: order.email,
      deliveryUrl: link,
      reason: order.productIds.includes("book") ? "preorder-bonus" : "purchase",
      shipEstimate: order.shipEstimate,
    });
  }

  // Best-effort: the buyer already has their goods, so Keegan's copy failing
  // must not make the webhook fail and re-send the buyer's email on retry.
  try {
    await sendOrderNotification(order, link ? order.email : null);
  } catch (err) {
    console.error("Shop: owner notification failed", err);
  }

  await markFulfilled(order);
  return "fulfilled";
}
