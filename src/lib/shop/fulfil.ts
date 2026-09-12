// What happens after Stripe says "paid": grant what the order entitles, tell
// Keegan, and mark the PaymentIntent so a webhook retry does nothing twice.

import { SITE_URL } from "@/lib/seo";
import { signDeliveryToken } from "./entitlement";
import { sendOrderConfirmation, sendOrderNotification } from "./email";
import { getOrder, markFulfilled, orderEntitlements, type Order } from "./orders";

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

export type FulfilResult = "not-ours" | "unpaid" | "already-fulfilled" | "fulfilled";

export async function fulfilOrder(order: Order): Promise<FulfilResult> {
  // The webhook fires for every Checkout Session on the account, not just ours.
  // A Payment Link made in the dashboard, or anything else sold from this
  // Stripe account, arrives here too. Without this guard such a session would
  // be marked fulfilled and its buyer emailed about a cookbook they never
  // ordered. No products stamped by our checkout route means not our sale.
  if (!order.productIds.length) return "not-ours";
  if (!order.paid) return "unpaid";
  if (order.fulfilledAt) return "already-fulfilled";

  const link = deliveryLinkFor(order);

  // Re-read the marker immediately before claiming. Stripe can deliver the same
  // event twice, and this collapses the common case where the second delivery
  // arrives after the first has already claimed the order.
  const fresh = await getOrder(order.sessionId);
  if (fresh?.fulfilledAt) return "already-fulfilled";

  // Claim the order FIRST. If this write fails the webhook returns 500, Stripe
  // retries, and nothing has been sent yet, so a retry is clean. Sending first
  // would mean a failed marker re-sends the buyer's confirmation on every retry
  // for as long as Stripe keeps trying.
  await markFulfilled(order);

  // The buyer's confirmation carries the labels link. A failure here must not
  // throw: the order is already claimed, so a retry would skip it and the
  // buyer would get nothing with nobody the wiser. Instead it is recorded and
  // handed to Keegan in the notification below, which she can act on.
  let buyerEmailed = false;
  if (order.email) {
    try {
      await sendOrderConfirmation(order, order.email, link);
      buyerEmailed = true;
    } catch (err) {
      console.error("Shop: BUYER CONFIRMATION FAILED for", order.sessionId, err);
    }
  } else {
    // Checkout always collects an email, so this is a Stripe anomaly.
    console.error("Shop: paid session has no customer email", order.sessionId);
  }

  // Keegan's copy is the packing slip and, when the buyer's email failed, the
  // only signal that a paid order needs attention. Best-effort so a mail
  // problem cannot fail an order that is already paid for and claimed.
  try {
    await sendOrderNotification(order, link && buyerEmailed ? order.email : null, {
      buyerEmailFailed: !!order.email && !buyerEmailed,
    });
  } catch (err) {
    console.error("Shop: owner notification failed", err);
  }

  return "fulfilled";
}
