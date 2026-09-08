import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/http";
import { SITE_URL } from "@/lib/seo";
import { PRODUCTS, getShopPhase, isPurchasable, requiresShipping, type ProductId } from "@/lib/shop/catalog";
import { META_PHASE, META_PRODUCTS, META_SHIP_ESTIMATE } from "@/lib/shop/orders";
import { getPriceId, getShipCountries, getShipEstimate, getStripe, shopConfigProblems } from "@/lib/shop/stripe";

// Starts a Stripe Checkout session for one product and returns its URL. The
// browser redirects there; no card data ever touches this server.
export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const ip = getClientIp(request);
    if (!rateLimit(`checkout:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
    }

    const phase = getShopPhase();
    const problems = shopConfigProblems(phase);
    if (problems.length) {
      console.error("Shop checkout refused, missing config:", problems.join(", "));
      return NextResponse.json({ error: "The shop is not open yet." }, { status: 503 });
    }

    const body = (await request.json()) as { product?: unknown };
    const product = typeof body.product === "string" && body.product in PRODUCTS ? (body.product as ProductId) : null;
    if (!product) {
      return NextResponse.json({ error: "Unknown product" }, { status: 400 });
    }
    // The preorder bonus rule, enforced server-side: labels alone are not for
    // sale until launch no matter what the client asks for.
    if (!isPurchasable(product, phase)) {
      return NextResponse.json({ error: "That item is not available yet." }, { status: 400 });
    }

    const shipEstimate = getShipEstimate();
    // Stamped at purchase time. Fulfilment and every later access check read
    // these back, never the live env, so a phase flip mid-payment cannot change
    // what this buyer was promised.
    const metadata: Record<string, string> = {
      [META_PHASE]: phase,
      [META_PRODUCTS]: product,
      ...(phase === "preorder" && shipEstimate ? { [META_SHIP_ESTIMATE]: shipEstimate } : {}),
    };

    // In production every link must be the canonical host. Locally, follow the
    // dev server so the redirect back lands on the same origin.
    const origin = process.env.NODE_ENV === "production" ? SITE_URL : new URL(request.url).origin;
    const physical = requiresShipping([product]);
    const shippingRate = process.env.STRIPE_SHIPPING_RATE;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: getPriceId(product), quantity: 1 }],
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata,
      payment_intent_data: {
        metadata,
        description: `${PRODUCTS[product].name}${phase === "preorder" && physical ? " (preorder)" : ""}`,
      },
      allow_promotion_codes: true,
      ...(physical
        ? {
            shipping_address_collection: { allowed_countries: getShipCountries() },
            ...(shippingRate ? { shipping_options: [{ shipping_rate: shippingRate }] } : {}),
          }
        : {}),
      ...(physical && phase === "preorder" && shipEstimate
        ? {
            // The stated ship date, on the payment page itself (FTC Mail Order
            // Rule: a preorder must say when it ships before taking money).
            custom_text: {
              submit: { message: `This is a preorder. Your book ships ${shipEstimate}.` },
            },
          }
        : {}),
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Shop checkout error:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
