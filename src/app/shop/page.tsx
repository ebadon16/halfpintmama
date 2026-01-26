import Link from "next/link";

export const metadata = {
  title: "Shop | Half Pint Mama",
  description: "Digital downloads, printables, and favorite products from Half Pint Mama.",
};

// Coming soon products
const comingSoonProducts = [
  {
    id: 1,
    title: "The Postpartum Mama Book",
    description: "Real talk about the fourth trimester from a Pediatric ER RN and mama of two. Evidence-based tips for recovery, feeding, and surviving those early days—plus easy freezer meals, sourdough recipes perfect for one-handed eating, and nourishing postpartum nutrition.",
    icon: "📖",
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
            Digital downloads to simplify your life, plus my honest favorite products that we actually use daily.
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
                  <span className="text-7xl">{product.icon}</span>
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

          <div className="text-center mt-8">
            <Link
              href="/free-guide"
              className="inline-block px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Join Waitlist for Updates
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="p-6 bg-warm-beige/50 rounded-xl text-center">
          <p className="text-charcoal/60 text-sm">
            <strong>Affiliate Disclosure:</strong> Some links on this page are affiliate links. This means I may earn a small commission if you make a purchase,
            at no extra cost to you. I only recommend products I genuinely use and love. Thank you for supporting Half Pint Mama!
          </p>
        </div>
      </div>
    </div>
  );
}
