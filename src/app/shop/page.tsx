import Link from "next/link";

export const metadata = {
  title: "Shop | Half Pint Mama",
  description: "Digital downloads, printables, and favorite products from Half Pint Mama.",
};

// Digital products - will be connected to Gumroad/Payhip
const digitalProducts = [
  {
    id: 1,
    title: "Sourdough Starter Guide",
    description: "Step-by-step guide to creating and maintaining a healthy sourdough starter. Includes feeding schedule, troubleshooting guide, and 5 beginner recipes.",
    price: "$5.99",
    benefits: ["20+ page PDF", "Printable feeding chart", "Video tutorials included"],
    icon: "🍞",
    link: "#",
    featured: true,
  },
  {
    id: 2,
    title: "Weekly Meal Planner Bundle",
    description: "Take the stress out of dinner time. 4-week rotating menu with grocery lists, prep guides, and kid-approved recipes the whole family will love.",
    price: "$12.99",
    benefits: ["28 family recipes", "Printable grocery lists", "Prep-ahead tips"],
    icon: "📋",
    link: "#",
    featured: true,
  },
  {
    id: 3,
    title: "Travel Packing Checklist Bundle",
    description: "Never forget the essentials! Age-specific packing lists for babies, toddlers, and preschoolers. Plus car trip and flight-specific versions.",
    price: "$4.99",
    benefits: ["6 printable checklists", "Customizable fields", "Carry-on packing guide"],
    icon: "✈️",
    link: "#",
    featured: false,
  },
  {
    id: 4,
    title: "Toddler Activity Cards",
    description: "50 screen-free activity ideas for toddlers using items you already have at home. Perfect for rainy days, quiet time, or independent play.",
    price: "$7.99",
    benefits: ["50 activity cards", "Supply list included", "Age 1-4 appropriate"],
    icon: "🎨",
    link: "#",
    featured: false,
  },
  {
    id: 5,
    title: "Baby's First Foods Tracker",
    description: "Track your baby's food journey with this allergen tracker, reaction log, and meal planning guide. Includes puree recipes and BLW tips.",
    price: "$6.99",
    benefits: ["Allergen tracker", "50+ first food ideas", "Reaction log pages"],
    icon: "🥑",
    link: "#",
    featured: false,
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
    link: "/products#sourdough",
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
    link: "/products#baby",
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
    link: "/products#travel",
  },
];

export default function ShopPage() {
  const featuredProducts = digitalProducts.filter(p => p.featured);
  const otherProducts = digitalProducts.filter(p => !p.featured);

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

        {/* Featured Digital Products */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-3 border-b-4 border-terracotta inline-block">
              Best Sellers
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border-2 border-terracotta/20"
              >
                <div className="h-32 bg-gradient-to-br from-terracotta/20 to-soft-pink/20 flex items-center justify-center">
                  <span className="text-7xl">{product.icon}</span>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold text-charcoal">
                      {product.title}
                    </h3>
                    <span className="text-terracotta font-bold text-2xl">
                      {product.price}
                    </span>
                  </div>
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
                  <a
                    href={product.link}
                    className="block w-full text-center px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
                  >
                    Get Instant Access
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* More Digital Products */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 pb-3 border-b-4 border-sage inline-block">
            More Digital Downloads
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {otherProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
              >
                <div className="h-24 bg-gradient-to-br from-light-sage/50 to-warm-beige/50 flex items-center justify-center">
                  <span className="text-5xl">{product.icon}</span>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-[family-name:var(--font-crimson)] text-lg font-semibold text-charcoal">
                      {product.title}
                    </h3>
                    <span className="text-terracotta font-bold">
                      {product.price}
                    </span>
                  </div>
                  <p className="text-charcoal/70 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <a
                    href={product.link}
                    className="block w-full text-center px-4 py-2 border-2 border-sage text-deep-sage text-sm font-semibold rounded-full hover:bg-sage hover:text-white transition-all"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 pb-3 border-b-4 border-soft-pink inline-block">
            Coming Soon
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Premium Membership */}
            <div className="bg-gradient-to-br from-terracotta/10 to-soft-pink/10 p-6 rounded-2xl border-2 border-dashed border-terracotta/30">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2">
                Half Pint Membership
              </h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Monthly meal plans, exclusive recipes, community access, and member-only discounts. Everything you need in one place.
              </p>
              <div className="text-charcoal/50 text-sm font-medium mb-4">Starting at $9.99/month</div>
              <Link
                href="/free-guide"
                className="inline-block text-terracotta font-medium text-sm hover:text-deep-sage transition-colors"
              >
                Join waitlist &rarr;
              </Link>
            </div>

            {/* Online Courses */}
            <div className="bg-gradient-to-br from-sage/10 to-light-sage/20 p-6 rounded-2xl border-2 border-dashed border-sage/30">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2">
                Sourdough Masterclass
              </h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Video course taking you from zero to confident sourdough baker. Live Q&A sessions, technique videos, and recipe library.
              </p>
              <div className="text-charcoal/50 text-sm font-medium mb-4">Course launching Spring 2026</div>
              <Link
                href="/free-guide"
                className="inline-block text-sage font-medium text-sm hover:text-deep-sage transition-colors"
              >
                Get notified &rarr;
              </Link>
            </div>

            {/* Recipe Vault */}
            <div className="bg-gradient-to-br from-deep-sage/10 to-sage/10 p-6 rounded-2xl border-2 border-dashed border-deep-sage/30">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2">
                Digital Recipe Vault
              </h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Searchable database of all my recipes. Save favorites, create meal plans, generate shopping lists automatically.
              </p>
              <div className="text-charcoal/50 text-sm font-medium mb-4">In development</div>
              <Link
                href="/free-guide"
                className="inline-block text-deep-sage font-medium text-sm hover:text-charcoal transition-colors"
              >
                Get notified &rarr;
              </Link>
            </div>
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

                <Link
                  href={category.link}
                  className="inline-block w-full text-center px-4 py-2 border-2 border-terracotta text-terracotta text-sm font-semibold rounded-full hover:bg-terracotta hover:text-white transition-all"
                >
                  Shop This Collection
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Bundle Offer */}
        <section className="mb-16">
          <div className="gradient-cta rounded-2xl p-8 md:p-10 text-white shadow-lg">
            <div className="md:flex items-center justify-between gap-8">
              <div className="mb-6 md:mb-0">
                <h2 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl font-semibold mb-2">
                  Bundle & Save 25%
                </h2>
                <p className="text-white/90 max-w-md">
                  Get the Sourdough Starter Guide + Weekly Meal Planner together for one special price.
                </p>
              </div>
              <div className="text-center">
                <div className="text-white/60 line-through text-lg">$18.98</div>
                <div className="text-3xl font-bold mb-3">$14.24</div>
                <a
                  href="#"
                  className="inline-block px-8 py-3 bg-white text-deep-sage font-semibold rounded-full hover:shadow-lg transition-all"
                >
                  Get the Bundle
                </a>
              </div>
            </div>
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
