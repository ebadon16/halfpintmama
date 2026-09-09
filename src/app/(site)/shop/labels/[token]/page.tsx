import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Monitor, Printer, Download } from "lucide-react";
import { ThemedIcon } from "@/components/ThemedIcon";
import { verifyDeliveryToken } from "@/lib/shop/entitlement";
import { getOrder, orderEntitlements } from "@/lib/shop/orders";
import { LABEL_SHEET } from "@/lib/shop/labels-pdf";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Freezer Labels | Half Pint Mama",
  robots: { index: false, follow: false },
};

// The delivery page. Perpetual: the product promises unlimited reprints, so
// the link never expires. Access is re-checked against Stripe on every visit,
// which is how a refund revokes it without us storing anything.
export default async function LabelsDeliveryPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const claim = verifyDeliveryToken(token);
  if (!claim) notFound();

  let order;
  try {
    order = await getOrder(claim.session);
  } catch (err) {
    // A Stripe outage must not turn a "yours forever" link into a 404.
    console.error("Labels page: Stripe lookup failed", err);
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="font-[family-name:var(--font-crimson)] text-3xl md:text-4xl text-deep-sage font-bold mb-4">
            One moment
          </h1>
          <p className="text-charcoal/80 text-lg">
            We could not check your order just now. Your link is still good. Please try again in a
            minute.
          </p>
        </div>
      </div>
    );
  }
  if (!order || !order.paid || !order.email) notFound();

  if (order.refunded || !orderEntitlements(order).includes("labels")) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="font-[family-name:var(--font-crimson)] text-3xl md:text-4xl text-deep-sage font-bold mb-4">
            These labels are no longer available
          </h1>
          <p className="text-charcoal/80 text-lg mb-6">
            This order was refunded, so the printable labels that came with it are no longer
            included. If that is a mistake, reply to your order email and Keegan will sort it out.
          </p>
          <Link href="/shop" className="text-terracotta hover:text-deep-sage font-medium">
            Back to the shop &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const downloadHref = `/api/labels/${encodeURIComponent(token)}`;

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-gradient-to-b from-terracotta/10 to-cream py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-3">
            Your Freezer Labels
          </h1>
          <p className="text-charcoal/80 text-lg max-w-2xl mx-auto">
            Made for <span className="font-medium text-charcoal">{order.email}</span>. Keep this
            page: it is yours forever, and you can print as many sheets as you need.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4 md:flex gap-10 items-start">
          <div className="md:w-1/2 mb-8 md:mb-0">
            {/* A real render of a filled-in sheet (scripts/shop/labels-preview.mjs),
                so the phone view, where the PDF's fields render flat, still shows
                what the finished product looks like. */}
            <Image
              src="/images/labels-preview.png"
              alt="A filled-in sheet of ten freezer labels: each shows a recipe name, the date it was made, and a reheating note"
              width={695}
              height={900}
              sizes="(min-width: 768px) 420px, 90vw"
              className="w-full h-auto rounded-lg shadow-xl border border-warm-beige bg-white"
            />
            <p className="text-charcoal/80 text-xs text-center mt-3">
              A filled-in sheet. Yours starts blank: pick a recipe from the list or type your own.
            </p>
          </div>

          <div className="md:w-1/2">
            {/* Deliberately ABOVE the button. Third-trimester buyers open this on
                a phone, and iOS shows the form fields flat, so the phone view has
                to look intentional rather than broken. */}
            <div className="bg-white rounded-2xl shadow-md p-5 mb-5 flex gap-4 items-start">
              <ThemedIcon icon={Monitor} size="lg" color="terracotta" />
              <div>
                <p className="font-semibold text-charcoal mb-1">Open on a computer to fill in</p>
                <p className="text-charcoal/80 text-sm">
                  Phones and tablets show the sheet, but the recipe and date boxes only type on a
                  computer. Save this page and open it there when you are ready to print.
                </p>
              </div>
            </div>

            <a
              href={downloadHref}
              download="rest-and-rise-freezer-labels.pdf"
              className="flex items-center justify-center gap-2 w-full px-6 py-4 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-lg"
            >
              <Download className="w-5 h-5" aria-hidden="true" />
              Download my labels (PDF)
            </a>

            <div className="mt-8">
              <div className="flex items-center gap-3 mb-3">
                <ThemedIcon icon={Printer} size="md" color="sage" />
                <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold">
                  How to print
                </h2>
              </div>
              <ol className="list-decimal list-inside text-charcoal/80 text-sm space-y-2">
                <li>
                  Open the PDF in Adobe Acrobat Reader (free) or Preview on a Mac. Browser viewers
                  may not save what you type.
                </li>
                <li>
                  On each label, pick a recipe from the list or type your own, then add the date
                  and any reheating note. Two pages are fillable; the third is blank for handwriting.
                </li>
                <li>
                  Load Avery {LABEL_SHEET.avery} sheets, or any 2&quot; &times; 4&quot;, 10-per-sheet
                  compatible label. Freezer-safe sheets hold up best.
                </li>
                <li>
                  Print at <strong>100% / actual size</strong>. Turn off &quot;fit to page&quot; or the
                  labels will not line up with the sheet.
                </li>
              </ol>
            </div>

            <p className="text-charcoal/80 text-xs mt-8">
              Your email is printed in the footer of every page. Lost this link?{" "}
              <Link href="/shop/labels" className="text-terracotta hover:text-deep-sage font-medium">
                Get a fresh one
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
