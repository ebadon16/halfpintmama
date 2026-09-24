import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/http";
import { SITE_URL } from "@/lib/seo";
import { PRODUCTS, getShopPhase, isPurchasable, requiresShipping, type ProductId } from "@/lib/shop/catalog";
import { META_PHASE, META_PRODUCTS, META_SHIP_ESTIMATE } from "@/lib/shop/orders";
import { getLabelsBonusPriceId } from "@/lib/shop/prices";
import {
  collectsTax,
  getMaxBooksPerOrder,
  getPriceId,
  getShipCountries,
  getShipEstimate,
  getStripe,
  shopConfigProblems,
} from "@/lib/shop/stripe";

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

    let body: { product?: unknown };
    try {
      body = (await request.json()) as { product?: unknown };
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
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
    const maxBooks = getMaxBooksPerOrder();
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

    // The labels ride along with the book: during preorder as a $0.00 line the
    // buyer can see in the cart, after launch as an optional add-on on the pay
    // page. Neither changes what the metadata promises; fulfilment reads the
    // paid lines back from Stripe.
    const bonusPriceId = phase === "preorder" && product === "book" ? await getLabelsBonusPriceId() : null;
    const labelsAddOn =
      phase === "launched" && product === "book" && process.env.STRIPE_PRICE_LABELS
        ? { optional_items: [{ price: process.env.STRIPE_PRICE_LABELS, quantity: 1 }] }
        : {};

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      // Opt out of Managed Payments, Stripe's merchant-of-record product, which
      // is on by default for this account. It rejects both the shipping address
      // collection a physical book needs and the custom_text that states the
      // preorder ship date, so with it enabled this call fails outright. Set per
      // request rather than trusting the dashboard toggle, which Stripe changed
      // under us once already.
      managed_payments: { enabled: false },
      line_items: [
        {
          price: getPriceId(product),
          quantity: 1,
          // Only offered when more than one copy can ship on the configured
          // rate; see getMaxBooksPerOrder. Digital labels stay at one.
          ...(physical && maxBooks > 1
            ? { adjustable_quantity: { enabled: true, minimum: 1, maximum: maxBooks } }
            : {}),
        },
        ...(bonusPriceId ? [{ price: bonusPriceId, quantity: 1 }] : []),
      ],
      ...labelsAddOn,
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata,
      payment_intent_data: {
        metadata,
        description: `${PRODUCTS[product].name}${phase === "preorder" && physical ? " (preorder)" : ""}`,
      },
      allow_promotion_codes: true,
      // Stripe calculates from the shipping address on a physical order. A
      // digital-only order has no shipping address, so the billing address has
      // to be collected or there is nothing to calculate against.
      ...(collectsTax()
        ? {
            automatic_tax: { enabled: true },
            ...(physical ? {} : { billing_address_collection: "required" as const }),
          }
        : {}),
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
              submit: {
                message: `This is a preorder. Your book ships ${shipEstimate}. Your printable freezer labels are included free and arrive by email as soon as payment clears.`,
              },
            },
          }
        : {}),
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Loud and specific: a failure here drops the buyer straight out of the
    // funnel, and the storefront gives no sign anything is wrong.
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `Shop checkout FAILED: product=${(await request.clone().json().catch(() => ({}))).product ?? "?"} ` +
        `phase=${getShopPhase()} :: ${message}`
    );
    // "No such price" means the Price ID is missing, archived, or belongs to the
    // other mode. Retrying will never work, so do not ask the buyer to.
    if (/No such price|similar object exists in (test|live) mode/i.test(message)) {
      return NextResponse.json(
        { error: "This item is not available right now. Please let Keegan know." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
