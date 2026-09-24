import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Tag, BookOpen, ClipboardCheck } from "lucide-react";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";
import { getShopStatus, isShopPublic } from "@/lib/shop/status";
import { PrintablesGrid } from "@/components/shop/PrintablesGrid";

export function generateMetadata(): Metadata {
  return metadataFor(isShopPublic());
}

const metadataFor = (indexable: boolean): Metadata => ({
  title: "Cookbook Resources | Half Pint Mama",
  description:
    "Free printables from Rest & Rise: the prep day planner, both stock-up lists, and the freezer inventory checklist, plus the printable freezer labels.",
  alternates: { canonical: "https://halfpintmama.com/cookbook-resources" },
  robots: { index: indexable, follow: true },
  openGraph: {
    images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Cookbook Resources | Half Pint Mama",
    description:
      "Free printables from Rest & Rise: the prep day planner, both stock-up lists, and the freezer inventory checklist.",
    type: "website",
    url: "https://halfpintmama.com/cookbook-resources",
  },
  twitter: {
    images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image" as const,
    title: "Cookbook Resources | Half Pint Mama",
    description:
      "Free printables from Rest & Rise: the prep day planner, both stock-up lists, and the freezer inventory checklist.",
  },
});

const LABELS_COPY = {
  waitlist: {
    text: (
      <>
        The label sheets are designed for the exact recipes in the book. Preorders are coming
        soon: the labels come free as a preorder-only bonus with <em>Rest & Rise</em>, then
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
        preorder-only bonus: preorder <em>Rest & Rise</em> and the printable labels are
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
        PDF you print yourself onto standard 4&quot; &times; 3⅓&quot; label sheets, and they are
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
            Everything that goes with <em>Rest & Rise</em>, all in one place. Print the plan,
            print the labels, and let future you find dinner without doing any mental math.
          </p>
        </div>
      </section>

      {/* The fill-in pages the book promises at halfpintmama.com/shop, free and
          ungated. This page is where /checklist lands, so they live here too. */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <ThemedIcon icon={ClipboardCheck} size="lg" color="sage" />
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold">
              Free Printables
            </h2>
          </div>
          <p className="text-charcoal/80 mb-6">
            Every fill-in page from Chapter 11, free to download and print as many times as you need.
          </p>
          <PrintablesGrid compact />
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
          <div className="bg-white rounded-2xl p-8 shadow-md md:flex gap-8 items-center text-center md:text-left">
            {/* A real render of a filled sheet (scripts/shop/labels-preview.mjs),
                so a reader sent here by the book sees what the labels are. */}
            <a
              href="/images/labels-preview.png"
              target="_blank"
              rel="noopener"
              className="block flex-shrink-0 w-36 md:w-44 mx-auto md:mx-0 mb-5 md:mb-0 rounded-lg overflow-hidden border border-warm-beige shadow-sm hover:shadow-md transition-shadow"
              aria-label="Open a full-size preview of a filled-in label sheet"
            >
              <Image
                src="/images/labels-preview.png"
                alt="A sheet of ten Rest & Rise freezer labels, each filled in with a recipe, a made-on date, and reheating notes"
                width={695}
                height={900}
                sizes="(min-width: 768px) 176px, 144px"
                className="w-full h-auto"
              />
            </a>
            <div className="flex-1">
            <p className="text-charcoal/80 mb-4">{labels.text}</p>
            <Link
              href="/shop#labels"
              className="inline-block px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-sm"
            >
              {labels.cta}
            </Link>
            </div>
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
              These resources go with <em>Rest & Rise</em>: make-ahead, freezer-friendly
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
