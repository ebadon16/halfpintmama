// What happens after Stripe says "paid": grant what the order entitles, tell
// Keegan, and mark the PaymentIntent so a webhook retry does nothing twice.

import { SITE_URL } from "@/lib/seo";
import { signDeliveryToken } from "./entitlement";
import { sendOrderConfirmation, sendOrderNotification } from "./email";
import { markFulfilled, orderEntitlements, type Order } from "./orders";

export function deliveryPath(token: string): string {
  return `/shop/labels/${token}`;
}

// The buyer's perpetual labels link, or null when the order carries none.
// Signed from the order as Stripe recorded it, so the token can never claim
// more than was bought.
export function deliveryLinkFor(order: Order, origin = SITE_URL): string | null {
  if (!orderEntitlements(order).includes("labels")) return null;
  const token = signDeliveryToken({
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
  // Every paid order gets one confirmation; the labels link rides inside it.
  if (order.email) {
    await sendOrderConfirmation(order, order.email, link);
  } else {
    // Checkout always collects an email, so this is a Stripe anomaly worth a
    // loud log rather than a silent skip; the owner copy below still goes out.
    console.error("Shop: paid session has no customer email", order.sessionId);
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
