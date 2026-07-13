import Link from "next/link";
import { EmailSignup } from "@/components/EmailSignup";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Tag, ClipboardCheck, BookOpen, Printer } from "lucide-react";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

// Flip to true (and fill in LABEL_FILES) when Keegan's printable labels are finished.
const LABELS_READY = false;
const LABEL_FILES: { title: string; description: string; href: string }[] = [
  // { title: "Freezer Meal Labels", description: "...", href: "/downloads/..." },
];

export const metadata = {
  title: "Cookbook Resources | Half Pint Mama",
  description:
    "Printable freezer labels and the freezer prep checklist designed for the recipes in Rest and Rise, the postpartum sourdough cookbook from Half Pint Mama.",
  alternates: { canonical: "https://halfpintmama.com/cookbook-resources" },
  robots: { index: false, follow: true },
  openGraph: {
    images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Cookbook Resources | Half Pint Mama",
    description:
      "Printable freezer labels and the prep checklist designed for the recipes in Rest and Rise.",
    type: "website",
    url: "https://halfpintmama.com/cookbook-resources",
  },
  twitter: {
    images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image" as const,
    title: "Cookbook Resources | Half Pint Mama",
    description:
      "Printable freezer labels and the prep checklist designed for the recipes in Rest and Rise.",
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
            Everything printable that goes with <em>Rest and Rise</em>, all in one place. Print a
            sheet, fill in the date, and let future you find dinner without doing any mental math.
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

          {LABELS_READY && LABEL_FILES.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {LABEL_FILES.map((file) => (
                <div key={file.href} className="bg-cream rounded-2xl p-6 shadow-md">
                  <h3 className="font-semibold text-charcoal mb-2">{file.title}</h3>
                  <p className="text-charcoal/80 text-sm mb-4">{file.description}</p>
                  <a
                    href={file.href}
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-sm"
                  >
                    <Printer className="w-4 h-4" />
                    Download &amp; Print
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-cream rounded-2xl p-8 shadow-md text-center">
              <p className="text-charcoal/80 mb-2">
                The label sheets, designed for the exact recipes in the book, are getting their
                finishing touches right now.
              </p>
              <p className="text-charcoal/80 text-sm mb-6">
                Drop your email below and they will land in your inbox the moment they are ready,
                along with the free freezer prep checklist.
              </p>
              <div className="max-w-md mx-auto">
                <EmailSignup
                  source="cookbook-resources"
                  layout="stacked"
                  buttonText="Send Them When Ready"
                  placeholder="you@example.com"
                  inputClassName="!rounded-lg !border-warm-beige focus:!border-sage focus:!ring-sage/30"
                  buttonClassName="gradient-cta text-white hover:shadow-lg !rounded-lg"
                />
                <p className="text-charcoal/80 text-xs text-center mt-3">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Checklist cross-promo */}
      <section className="py-12 bg-deep-sage/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="md:flex items-center gap-8 bg-white rounded-2xl p-8 shadow-md">
            <div className="flex justify-center md:block mb-4 md:mb-0">
              <ThemedIcon icon={ClipboardCheck} size="xl" color="sage" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-2">
                The Freezer Prep Checklist
              </h2>
              <p className="text-charcoal/80 text-sm mb-4">
                All 13 prep sessions plus a fill-in freezer inventory for every recipe in the book,
                free in your inbox. The simplest way to turn the book into a plan.
              </p>
              <Link
                href="/checklist"
                className="inline-block px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-sm"
              >
                Get the Free Checklist
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
