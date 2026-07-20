import Link from "next/link";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Tag, BookOpen } from "lucide-react";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const metadata = {
  title: "Cookbook Resources | Half Pint Mama",
  description:
    "Printable freezer labels that go with Rest and Rise, the postpartum sourdough cookbook from Half Pint Mama.",
  alternates: { canonical: "https://halfpintmama.com/cookbook-resources" },
  robots: { index: false, follow: true },
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
};

export default function CookbookResourcesPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-terracotta/10 to-cream py-14 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
            Cookbook Resources
          </h1>
          <p className="text-charcoal/80 text-lg max-w-2xl mx-auto">
            Everything that goes with <em>Rest and Rise</em>, all in one place. Print a sheet,
            fill in the date, and let future you find dinner without doing any mental math.
          </p>
        </div>
      </section>

      {/* Freezer labels */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <ThemedIcon icon={Tag} size="lg" color="terracotta" />
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold">
              Printable Freezer Labels
            </h2>
          </div>
          <div className="bg-cream rounded-2xl p-8 shadow-md text-center">
            <p className="text-charcoal/80 mb-4">
              The label sheets, designed for the exact recipes in the book, live in the shop
              alongside <em>Rest and Rise</em>.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-sm"
            >
              Go to the Shop
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
              sourdough meals for postpartum recovery, from an ER nurse and mom of three.
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
