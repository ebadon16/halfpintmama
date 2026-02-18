import Link from "next/link";
import { ThemedIcon } from "@/components/ThemedIcon";
import { EmailSignup } from "@/components/EmailSignup";
import { BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata = {
  title: "Shop | Half Pint Mama",
  description: "Coming soon from Half Pint Mama: The Post-Partum Cook Book with evidence-based recovery tips, easy freezer meals, and sourdough recipes for new mamas.",
  alternates: { canonical: "https://halfpintmama.com/shop" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Shop | Half Pint Mama",
    description: "Coming soon from Half Pint Mama: The Post-Partum Cook Book with recovery tips, freezer meals, and sourdough recipes.",
    url: "https://halfpintmama.com/shop",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Shop | Half Pint Mama",
    description: "Coming soon from Half Pint Mama: The Post-Partum Cook Book with recovery tips, freezer meals, and sourdough recipes.",
  },
};

// Coming soon products
const comingSoonProducts: { id: number; title: string; description: string; icon: LucideIcon }[] = [
  {
    id: 1,
    title: "The Post-Partum Cook Book",
    description: "Real talk about the fourth trimester from a Pediatric ER RN and mama of two. Evidence-based tips for recovery, feeding, and surviving those early days—plus easy freezer meals, sourdough recipes perfect for one-handed eating, and nourishing postpartum nutrition.",
    icon: BookOpen,
  },
];

export default function ShopPage() {
  return (
    <div className="bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Shop Half Pint Mama
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mx-auto">
            Something exciting is in the works! Sign up below to be the first to know when it drops.
          </p>
        </div>

        {/* Coming Soon */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-3 border-b-4 border-terracotta inline-block">
              Coming Soon
            </h2>
          </div>

          <div className="max-w-lg mx-auto">
            {comingSoonProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border-2 border-terracotta/20"
              >
                <div className="h-32 bg-gradient-to-br from-terracotta/20 to-soft-pink/20 flex items-center justify-center">
                  <ThemedIcon icon={product.icon} size="xl" color="terracotta" />
                </div>

                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold text-charcoal mb-2">
                    {product.title}
                  </h3>
                  <p className="text-charcoal/70 mb-6">
                    {product.description}
                  </p>
                  <div className="text-center p-3 bg-light-sage/30 rounded-full">
                    <span className="text-deep-sage font-semibold">Coming Soon</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-md mx-auto mt-8 text-center">
            <p className="text-charcoal/70 mb-4 font-medium">
              Be the first to know when it drops:
            </p>
            <EmailSignup
              source="shop-waitlist"
              buttonText="Join Waitlist"
              placeholder="Your email"
              className="mb-4"
              buttonClassName="bg-terracotta text-white hover:bg-terracotta/90"
              inputClassName="border-terracotta/30"
            />
            <div className="space-y-3">
              <Link
                href="/cooking"
                className="block text-sage hover:text-deep-sage font-medium transition-colors"
              >
                Browse recipes while you wait &rarr;
              </Link>
              <Link
                href="/mama-life"
                className="block text-sage hover:text-deep-sage font-medium transition-colors"
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
          </div>
        </section>
      </div>
    </div>
  );
}
