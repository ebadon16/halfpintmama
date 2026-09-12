import { NextResponse, after } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/http";
import { sendLabelsDelivery } from "@/lib/shop/email";
import { deliveryLinkFor } from "@/lib/shop/fulfil";
import { findLabelOrdersByEmail } from "@/lib/shop/orders";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "Lost your link." Looks the email up in Stripe and re-sends the delivery
// link if a paid, unrefunded order with labels exists. The response is the
// same whether or not it does, and the lookup runs after the response is
// flushed, so this cannot be used to learn who bought.
const REPLY = { message: "If that address bought the labels, a fresh link is on its way. Check spam or promotions if it does not arrive in a few minutes." };

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const ip = getClientIp(request);
    if (!rateLimit(`labels-recover:${ip}`, 3, 10 * 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
    }

    const body = (await request.json()) as { email?: unknown };
    // Kept as typed. Stripe's email filter is byte-exact, so lowercasing here
    // would silently disable the case-exact half of the lookup in orders.ts.
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }
    const emailKey = email.toLowerCase();
    // Per-address cap as well. Best-effort only: the limiter is in-process
    // memory, so each serverless instance counts separately.
    if (!rateLimit(`labels-recover:${emailKey}`, 3, 24 * 60 * 60_000)) {
      return NextResponse.json(REPLY);
    }

    after(async () => {
      try {
        const orders = await findLabelOrdersByEmail(email);
        // One link is enough; they all open the same product. Prefer the most
        // recent order so the token points at a live one.
        const link = orders.map((o) => deliveryLinkFor(o)).find((l): l is string => !!l);
        if (link) await sendLabelsDelivery({ to: email, deliveryUrl: link });
      } catch (err) {
        console.error("Labels recovery failed:", err);
      }
    });

    return NextResponse.json(REPLY);
  } catch (err) {
    console.error("Labels recovery error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
