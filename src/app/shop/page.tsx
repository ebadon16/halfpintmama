import Link from "next/link";

export const metadata = {
  title: "Shop | Half Pint Mama",
  description: "Digital downloads, printables, and favorite products from Half Pint Mama.",
};

// Coming soon products
const comingSoonProducts = [
  {
    id: 1,
    title: "Sourdough Starter Guide",
    description: "Step-by-step guide to creating and maintaining a healthy sourdough starter. Includes feeding schedule, troubleshooting guide, and 5 beginner recipes.",
    benefits: ["20+ page PDF", "Printable feeding chart", "Video tutorials included"],
    icon: "🍞",
  },
  {
    id: 2,
    title: "The Postpartum Mama Book",
    description: "Real talk about the fourth trimester from a Pediatric ER RN and mama of two. Evidence-based tips for recovery, feeding, and surviving those early days.",
    benefits: ["Nurse-approved tips", "Recovery guidance", "Mental health resources"],
    icon: "📖",
  },
];

const affiliateCategories = [
  {
    title: "Sourdough Essentials",
    description: "Everything you need to start and maintain your sourdough journey. These are the exact tools in my kitchen.",
    icon: "🥖",
    products: [
      { name: "Proofing Basket Set", note: "Best for beginners" },
      { name: "Kitchen Scale", note: "Precision matters" },
      { name: "Dutch Oven", note: "For that perfect crust" },
      { name: "Bread Lame", note: "Beautiful scoring" },
    ],
    link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
  },
  {
    title: "Baby & Toddler Must-Haves",
    description: "The gear that survived two babies and countless adventures. Only the stuff that actually works.",
    icon: "👶",
    products: [
      { name: "Travel High Chair", note: "Lifesaver for trips" },
      { name: "Snack Containers", note: "No-spill favorites" },
      { name: "Sound Machine", note: "Sleep essential" },
      { name: "Toddler Plates", note: "Suction bottoms" },
    ],
    link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
  },
  {
    title: "Travel Gear",
    description: "What we pack for every adventure. Road trips, flights, and everything in between with two littles.",
    icon: "🧳",
    products: [
      { name: "Travel Stroller", note: "One-hand fold" },
      { name: "Packing Cubes", note: "Organization key" },
      { name: "Portable White Noise", note: "Sleep anywhere" },
      { name: "Snack Bag", note: "Insulated pick" },
    ],
    link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
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

          <div className="grid md:grid-cols-2 gap-8">
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
                  <p className="text-charcoal/70 mb-4">
                    {product.description}
                  </p>
                  <ul className="space-y-1 mb-6">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-charcoal/70 flex items-center gap-2">
                        <span className="text-sage">✓</span> {benefit}
                      </li>
                    ))}
                  </ul>
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

        {/* Amazon Affiliate Products */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-3 border-b-4 border-terracotta inline-block">
              Products I Actually Use
            </h2>
            <Link href="/products" className="text-terracotta hover:text-deep-sage font-medium transition-colors">
              View All &rarr;
            </Link>
          </div>

          <p className="text-charcoal/70 mb-8 max-w-2xl">
            Real recommendations from real life with littles. I only share products we genuinely use and love in our home.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {affiliateCategories.map((category) => (
              <div
                key={category.title}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2">
                  {category.title}
                </h3>
                <p className="text-charcoal/70 text-sm mb-4">
                  {category.description}
                </p>

                <ul className="space-y-2 mb-4">
                  {category.products.map((product, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-charcoal">{product.name}</span>
                      <span className="text-sage text-xs">{product.note}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={category.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-4 py-2 border-2 border-terracotta text-terracotta text-sm font-semibold rounded-full hover:bg-terracotta hover:text-white transition-all"
                >
                  Shop This Collection
                </a>
              </div>
            ))}
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
