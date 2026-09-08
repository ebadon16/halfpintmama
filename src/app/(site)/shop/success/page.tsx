import type { Metadata } from "next";
import Link from "next/link";
import { PackageCheck, Tag } from "lucide-react";
import { ThemedIcon } from "@/components/ThemedIcon";
import { PRODUCTS } from "@/lib/shop/catalog";
import { deliveryLinkFor } from "@/lib/shop/fulfil";
import { getOrder, orderEntitlements } from "@/lib/shop/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank You | Half Pint Mama",
  robots: { index: false, follow: false },
};

// Stripe sends the buyer here after paying. The labels link is shown directly
// (verified against the real session), so "paid but got nothing" cannot happen
// even if the email lands in spam. The email is the durable copy.
export default async function ShopSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const valid = typeof sessionId === "string" && /^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId);
  const order = valid ? await getOrder(sessionId).catch(() => null) : null;

  if (!order) {
    return (
      <Shell title="We could not find that order">
        <p className="text-charcoal/80 text-lg mb-6">
          If you just paid, your confirmation email is the safest copy of everything. If it
          does not arrive within a few minutes, check spam, or{" "}
          <Link href="/contact" className="text-terracotta hover:text-deep-sage font-medium">
            get in touch
          </Link>{" "}
          and Keegan will sort it out.
        </p>
      </Shell>
    );
  }

  if (!order.paid) {
    return (
      <Shell title="Your payment is processing">
        <p className="text-charcoal/80 text-lg mb-6">
          Some payment methods take a little while to clear. As soon as it does, your
          confirmation (and your labels link, if your order includes them) will arrive by email
          at <span className="font-medium text-charcoal">{order.email}</span>.
        </p>
      </Shell>
    );
  }

  const hasBook = order.productIds.includes("book");
  // A refunded order (rare on the success page, but a bookmark can bring
  // someone back) gets no labels link; the delivery page would refuse it anyway.
  const labelsLink =
    !order.refunded && orderEntitlements(order).includes("labels") ? deliveryLinkFor(order, "") : null;
  const ship = order.shipping;
  const shipTo = ship ? [ship.city, ship.state].filter(Boolean).join(", ") : null;

  return (
    <Shell title="Thank you!">
      {hasBook && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-5 flex gap-4 items-start text-left">
          <ThemedIcon icon={PackageCheck} size="lg" color="sage" />
          <div>
            <p className="font-semibold text-charcoal mb-1">{PRODUCTS.book.name}</p>
            <p className="text-charcoal/80 text-sm">
              Keegan will pack your copy herself
              {shipTo ? ` and ship it to ${shipTo}` : ""}.
              {order.shipEstimate ? ` It ships ${order.shipEstimate}.` : ""} A receipt is on its
              way to {order.email}.
            </p>
          </div>
        </div>
      )}

      {labelsLink && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-5 text-left">
          <div className="flex gap-4 items-start mb-4">
            <ThemedIcon icon={Tag} size="lg" color="terracotta" />
            <div>
              <p className="font-semibold text-charcoal mb-1">
                {hasBook ? "Your preorder bonus: printable freezer labels" : PRODUCTS.labels.name}
              </p>
              <p className="text-charcoal/80 text-sm">
                Ready now. The same link is in your email, and it never expires.
              </p>
            </div>
          </div>
          <Link
            href={labelsLink}
            className="block text-center px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Open my labels
          </Link>
        </div>
      )}

      <p className="text-charcoal/80 text-sm">
        Questions about your order? Reply to the confirmation email or{" "}
        <Link href="/contact" className="text-terracotta hover:text-deep-sage font-medium">
          contact Keegan
        </Link>
        .
      </p>
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-6">
          {title}
        </h1>
        {children}
        <p className="mt-8">
          <Link href="/cooking" className="text-deep-sage hover:text-charcoal font-medium">
            Browse recipes &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
