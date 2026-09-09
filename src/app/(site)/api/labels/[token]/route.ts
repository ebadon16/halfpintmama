import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/http";
import { verifyDeliveryToken } from "@/lib/shop/entitlement";
import { buildLabelsPdf } from "@/lib/shop/labels-pdf";
import { getOrder, orderEntitlements } from "@/lib/shop/orders";

const NOT_FOUND = { status: 404, headers: { "Cache-Control": "no-store" } };

// The download itself. The token proves the link was issued by us; Stripe is
// asked whether the payment still stands. Nothing about the buyer is stored
// here, so this is the whole access check.
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const ip = getClientIp(_request);
  if (!rateLimit(`labels-pdf:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many downloads. Please try again in a minute." }, { status: 429 });
  }

  const { token } = await params;
  const claim = verifyDeliveryToken(token);
  if (!claim) return new NextResponse("Not found", NOT_FOUND);

  let order;
  try {
    order = await getOrder(claim.session);
  } catch (err) {
    console.error("Labels PDF: Stripe lookup failed", err);
    return new NextResponse("Could not check your order just now. Please try again in a minute.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    });
  }
  if (!order || !order.paid || !order.email) {
    return new NextResponse("Not found", NOT_FOUND);
  }
  if (order.refunded || !orderEntitlements(order).includes("labels")) {
    return new NextResponse("This order was refunded, so the labels are no longer available.", {
      status: 410,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const pdf = await buildLabelsPdf({ email: order.email });
  return new NextResponse(Buffer.from(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="rest-and-rise-freezer-labels.pdf"',
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
