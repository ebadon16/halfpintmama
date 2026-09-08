import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { fulfilOrder } from "@/lib/shop/fulfil";
import { getOrder } from "@/lib/shop/orders";
import { getStripe } from "@/lib/shop/stripe";

// Stripe calls this after checkout. Signature-verified against the raw body,
// so no same-origin or rate-limit checks: a forged call cannot pass the
// signature, and Stripe's own retries must not be throttled.
//
// Register in Stripe as POST https://halfpintmama.com/api/stripe/webhook with
// the events checkout.session.completed and
// checkout.session.async_payment_succeeded, then set STRIPE_WEBHOOK_SECRET.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const raw = await request.text();
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error("Stripe webhook signature failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  try {
    // Re-read the session with the expansions fulfilment needs, rather than
    // trusting the shape of the event payload.
    const order = await getOrder(event.data.object.id);
    if (!order) {
      console.error("Stripe webhook: session not found", event.data.object.id);
      return NextResponse.json({ received: true, result: "missing" });
    }
    const result = await fulfilOrder(order);
    return NextResponse.json({ received: true, result });
  } catch (err) {
    // A 5xx makes Stripe retry, which is what we want for a transient email
    // or API failure. The fulfilled_at marker keeps a retry from double-sending.
    console.error("Stripe webhook fulfilment error:", err);
    return NextResponse.json({ error: "Fulfilment failed" }, { status: 500 });
  }
}
