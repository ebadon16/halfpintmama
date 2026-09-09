import type { Metadata } from "next";
import Link from "next/link";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Tag, BookOpen, ClipboardCheck } from "lucide-react";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";
import { getShopStatus, isShopPublic } from "@/lib/shop/status";
import { CHECKLIST_PDF } from "@/lib/shop/checklist";

export function generateMetadata(): Metadata {
  return metadataFor(isShopPublic());
}

const metadataFor = (indexable: boolean): Metadata => ({
  title: "Cookbook Resources | Half Pint Mama",
  description:
    "The free freezer prep checklist and the printable freezer labels that go with Rest and Rise, the postpartum sourdough cookbook from Half Pint Mama.",
  alternates: { canonical: "https://halfpintmama.com/cookbook-resources" },
  robots: { index: indexable, follow: true },
  openGraph: {
    images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Cookbook Resources | Half Pint Mama",
    description:
      "Printable freezer labels that go with Rest and Rise.",
    type: "website",
    url: "https://halfpintmama.com/cookbook-resources",
  },
  twitter: {
    images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image" as const,
    title: "Cookbook Resources | Half Pint Mama",
    description:
      "Printable freezer labels that go with Rest and Rise.",
  },
});

const LABELS_COPY = {
  waitlist: {
    text: (
      <>
        The label sheets are designed for the exact recipes in the book. Preorders are coming
        soon: the labels come free as a preorder-only bonus with <em>Rest and Rise</em>, then
        join the shop as their own item after launch. Join the waitlist to hear when
        preorders open.
      </>
    ),
    cta: "Go to the Shop",
  },
  preorder: {
    text: (
      <>
        The label sheets are designed for the exact recipes in the book, and they are a
        preorder-only bonus: preorder <em>Rest and Rise</em> and the printable labels are
        yours free, delivered by email right after checkout. After launch they join the shop
        as their own item.
      </>
    ),
    cta: "Preorder the Book",
  },
  launched: {
    text: (
      <>
        The label sheets are designed for the exact recipes in the book. They are a fillable
        PDF you print yourself onto standard 2&quot; &times; 4&quot; label sheets, and they are
        available in the shop as their own item.
      </>
    ),
    cta: "Get the Labels",
  },
} as const;

export default function CookbookResourcesPage() {
  const labels = LABELS_COPY[getShopStatus()];
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-terracotta/10 to-cream py-14 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
            Cookbook Resources
          </h1>
          <p className="text-charcoal/80 text-lg max-w-2xl mx-auto">
            Everything that goes with <em>Rest and Rise</em>, all in one place. Print the plan,
            print the labels, and let future you find dinner without doing any mental math.
          </p>
        </div>
      </section>

      {/* Freezer prep checklist: free, no gate. The book prints /checklist. */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <ThemedIcon icon={ClipboardCheck} size="lg" color="sage" />
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold">
              The Freezer Prep Checklist
            </h2>
          </div>
          <div className="bg-cream rounded-2xl p-8 shadow-md text-center">
            <p className="text-charcoal/80 mb-4">
              The whole Chapter 11 plan on one page: thirteen prep sessions across weeks 30 to 36,
              with a freezer inventory sheet on the back. Free to download and print.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={CHECKLIST_PDF}
                download="rest-and-rise-freezer-prep-checklist.pdf"
                className="inline-block px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-sm"
              >
                Download the Checklist (PDF)
              </a>
              <Link
                href="/checklist"
                className="inline-block px-6 py-3 border-2 border-deep-sage text-deep-sage font-semibold rounded-full hover:bg-deep-sage hover:text-white transition-all text-sm"
              >
                How to use it
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Freezer labels */}
      <section className="py-12 bg-cream">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <ThemedIcon icon={Tag} size="lg" color="terracotta" />
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold">
              Printable Freezer Labels
            </h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-md text-center">
            <p className="text-charcoal/80 mb-4">{labels.text}</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-sm"
            >
              {labels.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Book cross-link */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-cream rounded-2xl p-6 shadow-md">
            <div className="flex justify-center mb-3">
              <ThemedIcon icon={BookOpen} size="lg" color="deep-sage" />
            </div>
            <h3 className="font-[family-name:var(--font-crimson)] text-lg font-semibold text-charcoal mb-2">
              New here?
            </h3>
            <p className="text-charcoal/80 text-sm mb-4">
              These resources go with <em>Rest and Rise</em>: make-ahead, freezer-friendly
              sourdough meals for postpartum recovery, from a Pediatric ER RN and mama of three.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-sm"
            >
              About the Book
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
