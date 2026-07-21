import Link from "next/link";
import { ThemedIcon } from "@/components/ThemedIcon";
import { EmailSignup } from "@/components/EmailSignup";
import { BookOpen, CalendarCheck, HeartPulse, Croissant } from "lucide-react";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const metadata = {
  title: "Shop | Half Pint Mama",
  description: "Coming soon from Half Pint Mama: Rest and Rise, a post-partum cookbook with nurse-informed recovery tips, easy freezer meals, and sourdough recipes for new mamas.",
  alternates: { canonical: "https://halfpintmama.com/shop" },
  robots: { index: false, follow: true },
  openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Shop | Half Pint Mama",
    description: "Coming soon from Half Pint Mama: Rest and Rise, a post-partum cookbook with recovery tips, freezer meals, and sourdough recipes.",
    type: "website",
    url: "https://halfpintmama.com/shop",
  },
  twitter: {
      images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image" as const,
    title: "Shop | Half Pint Mama",
    description: "Coming soon from Half Pint Mama: Rest and Rise, a post-partum cookbook with recovery tips, freezer meals, and sourdough recipes.",
  },
};

const whatsInside = [
  {
    icon: BookOpen,
    color: "terracotta" as const,
    title: "35 Make-Ahead Recipes",
    description: "Crockpot, Instant Pot, and sourdough meals designed to be cooked before baby arrives and pulled from the freezer after.",
  },
  {
    icon: CalendarCheck,
    color: "sage" as const,
    title: "A Week-by-Week Freezer Plan",
    description: "Thirteen prep sessions across weeks 30 to 36 of pregnancy, sequenced so everything is ready exactly when you need it.",
  },
  {
    icon: HeartPulse,
    color: "deep-sage" as const,
    title: "Nurse-Informed Recovery",
    description: "Real talk about the fourth trimester: recovery, feeding, and surviving those early days, from a Pediatric ER RN.",
  },
  {
    icon: Croissant,
    color: "pink" as const,
    title: "Sourdough for New Mamas",
    description: "From-scratch sourdough recipes built for postpartum life, including plenty you can eat with a baby on your hip.",
  },
];

export default function ShopPage() {
  return (
    <div className="bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Pre-launch hero */}
        <section className="mb-16">
          <div className="md:flex items-center gap-10 max-w-5xl mx-auto">
            {/* Book mock */}
            <div className="md:w-2/5 mb-8 md:mb-0">
              <div className="bg-white rounded-2xl shadow-xl border-4 border-terracotta/20 p-8 text-center relative">
                <div className="absolute -top-4 -right-4 bg-terracotta text-white px-4 py-2 rounded-full font-semibold text-sm">
                  Coming Soon
                </div>
                <div className="flex justify-center mb-4">
                  <ThemedIcon icon={BookOpen} size="xl" color="terracotta" />
                </div>
                <p className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-bold mb-2">
                  Rest and Rise
                </p>
                <p className="text-charcoal/80 text-sm mb-3">
                  Make-ahead, freezer-friendly sourdough meals for postpartum recovery
                </p>
                <p className="text-charcoal/80 text-xs">
                  From a Pediatric ER RN and mama of three
                </p>
              </div>
            </div>

            {/* Pitch + waitlist */}
            <div className="md:w-3/5">
              <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
                The Postpartum Cookbook
              </h1>
              <p className="text-charcoal/80 text-lg mb-6">
                Stock your freezer before baby arrives, then rest while dinner takes care of
                itself. <em>Rest and Rise</em> pairs 35 make-ahead, freezer-friendly recipes with
                honest, nurse-informed guidance for the fourth trimester.
              </p>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-charcoal font-medium mb-3">
                  Be the first to know when it launches:
                </p>
                <EmailSignup
                  source="shop-waitlist"
                  buttonText="Join Waitlist"
                  placeholder="Your email"
                  buttonClassName="bg-terracotta text-white hover:bg-terracotta/90"
                  inputClassName="!border-terracotta/30 focus:!border-terracotta focus:!ring-terracotta/30"
                />
                <p className="text-charcoal/80 text-xs mt-3">
                  Printable freezer labels for every recipe in the book are coming too.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's inside */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 text-center">
            What&apos;s Inside
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {whatsInside.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="flex justify-center mb-3">
                  <ThemedIcon icon={item.icon} size="lg" color={item.color} />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-charcoal/80 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Browse while you wait */}
        <section className="max-w-md mx-auto text-center">
          <div className="space-y-3">
            <Link
              href="/cooking"
              className="block text-deep-sage hover:text-charcoal font-medium transition-colors"
            >
              Browse recipes while you wait &rarr;
            </Link>
            <Link
              href="/mama-life"
              className="block text-deep-sage hover:text-charcoal font-medium transition-colors"
            >
              Explore mama life posts &rarr;
            </Link>
            <div className="pt-2 border-t border-warm-beige/50">
              <Link
                href="/free-guide"
                className="text-terracotta hover:text-deep-sage text-sm font-medium transition-colors"
              >
                Get the free sourdough guide
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
