import Link from "next/link";
import { EmailSignup } from "@/components/EmailSignup";
import { ThemedIcon } from "@/components/ThemedIcon";
import { ClipboardCheck, Snowflake, CalendarCheck, Check, BookOpen } from "lucide-react";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const metadata = {
  title: "Free Postpartum Freezer Prep Checklist | Half Pint Mama",
  description:
    "Get the free printable freezer prep checklist that goes with Rest and Rise: all 13 prep sessions plus a fill-in freezer inventory, from a Pediatric ER RN and mom of three.",
  alternates: { canonical: "https://halfpintmama.com/checklist" },
  robots: { index: false, follow: true },
  openGraph: {
    images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Free Postpartum Freezer Prep Checklist | Half Pint Mama",
    description:
      "The printable companion to Rest and Rise: 13 prep sessions + a fill-in freezer inventory, free in your inbox.",
    type: "website",
    url: "https://halfpintmama.com/checklist",
  },
  twitter: {
    images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image" as const,
    title: "Free Postpartum Freezer Prep Checklist | Half Pint Mama",
    description:
      "The printable companion to Rest and Rise: 13 prep sessions + a fill-in freezer inventory, free in your inbox.",
  },
};

export default function ChecklistPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-terracotta/10 to-cream py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="md:flex items-center gap-12">
            {/* Left: Checklist preview */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-terracotta/20 relative">
                <div className="absolute -top-4 -right-4 bg-terracotta text-white px-4 py-2 rounded-full font-semibold text-sm">
                  FREE!
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <ThemedIcon icon={ClipboardCheck} size="xl" color="terracotta" />
                  </div>
                  <p className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-bold mb-2">
                    The Postpartum Freezer Prep Checklist
                  </p>
                  <p className="text-charcoal/80 text-sm">
                    The printable companion to <em>Rest and Rise</em>
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-charcoal/80">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    All 13 prep sessions on one page, in order
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/80">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Week-by-week plan for weeks 30&ndash;36
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/80">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Fill-in freezer inventory for every recipe in the book
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/80">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Setup-week shopping and equipment list
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Signup */}
            <div className="md:w-1/2">
              <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
                Grab Your Free Freezer Prep Checklist
              </h1>
              <p className="text-charcoal/80 text-lg mb-6">
                The simplest way to turn everything in <em>Rest and Rise</em> into a plan you can
                actually follow. Print it, stick it on the fridge, and check off your way to a
                stocked freezer before baby arrives.
              </p>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <EmailSignup
                  source="cookbook-checklist"
                  layout="stacked"
                  buttonText="Send Me the Checklist!"
                  placeholder="you@example.com"
                  inputClassName="!rounded-lg !border-warm-beige focus:!border-sage focus:!ring-sage/30"
                  buttonClassName="gradient-cta text-white hover:shadow-lg !rounded-lg"
                />
                <p className="text-charcoal/80 text-xs text-center mt-4">
                  It lands in your inbox, along with the occasional note from me when I have
                  something genuinely useful to share. No noise, just support. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 text-center">
            What&apos;s Inside
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="w-7 h-7 text-terracotta" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">The Whole Plan, One Page</h3>
              <p className="text-charcoal/80 text-sm">
                Thirteen sessions across six weeks, sequenced so every recipe is ready exactly when
                a later one needs it.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Snowflake className="w-7 h-7 text-sage" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Freezer Inventory</h3>
              <p className="text-charcoal/80 text-sm">
                A fill-in tracker for all 35 recipes so you always know what is in the freezer and
                what you have already used.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-soft-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-7 h-7 text-soft-pink" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Setup Week Covered</h3>
              <p className="text-charcoal/80 text-sm">
                The equipment check and stock-up run that make the whole plan work, handled before
                the baking starts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Book cross-link */}
      <section className="py-12 bg-deep-sage/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-md">
            <div className="flex justify-center mb-3">
              <ThemedIcon icon={BookOpen} size="lg" color="deep-sage" />
            </div>
            <h3 className="font-[family-name:var(--font-crimson)] text-lg font-semibold text-charcoal mb-2">
              Rest and Rise
            </h3>
            <p className="text-charcoal/80 text-sm mb-4">
              This checklist is the companion to the book: make-ahead, freezer-friendly sourdough
              meals for postpartum recovery, from an ER nurse and mom of three.
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
