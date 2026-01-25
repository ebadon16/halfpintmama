import Link from "next/link";

export const metadata = {
  title: "Shop | Half Pint Mama",
  description: "Digital downloads, printables, and favorite products from Half Pint Mama.",
};

// Placeholder products - will be connected to Gumroad/Payhip
const digitalProducts = [
  {
    id: 1,
    title: "Sourdough Starter Guide",
    description: "Everything you need to know to create and maintain a healthy sourdough starter. Includes troubleshooting tips and a feeding schedule printable.",
    price: "$5.99",
    image: "",
    link: "#", // Will be Gumroad link
  },
  {
    id: 2,
    title: "Family Meal Planner Bundle",
    description: "Weekly meal planning templates, grocery lists, and 20 kid-approved recipes. Digital download, print at home.",
    price: "$9.99",
    image: "",
    link: "#",
  },
  {
    id: 3,
    title: "Travel Packing Checklist",
    description: "Never forget the essentials again! Customizable packing lists for traveling with babies, toddlers, and everything in between.",
    price: "$3.99",
    image: "",
    link: "#",
  },
];

const affiliateCategories = [
  {
    title: "Baby Essentials",
    description: "The must-haves that survived two babies and countless adventures.",
    icon: "🍼",
  },
  {
    title: "Kitchen Favorites",
    description: "From sourdough supplies to organization hacks - our favorite home tools.",
    icon: "🏡",
  },
  {
    title: "Travel Gear",
    description: "What we pack for adventures with toddlers, babies, and a chocolate lab.",
    icon: "✈️",
  },
];

export default function ShopPage() {
  return (
    <div className="bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
          Shop
        </h1>
        <p className="text-charcoal/70 text-lg mb-12 max-w-2xl">
          Digital downloads to make mom life a little easier, plus our favorite products that we actually use and love.
        </p>

        {/* Digital Products */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 pb-3 border-b-4 border-sage inline-block">
            Digital Downloads
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {digitalProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-light-sage to-warm-beige flex items-center justify-center">
                  <span className="text-6xl">📄</span>
                </div>

                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2">
                    {product.title}
                  </h3>
                  <p className="text-charcoal/70 text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-terracotta font-bold text-lg">
                      {product.price}
                    </span>
                    <a
                      href={product.link}
                      className="px-4 py-2 gradient-cta text-white text-sm font-semibold rounded-full hover:shadow-md transition-all"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-charcoal/60 mt-8 text-sm">
            More products coming soon! Have a request?{" "}
            <Link href="/about" className="text-sage hover:text-deep-sage underline">
              Let me know!
            </Link>
          </p>
        </section>

        {/* Products We Love */}
        <section>
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-4 pb-3 border-b-4 border-terracotta inline-block">
            Products We Love
          </h2>
          <p className="text-charcoal/70 mb-8">
            I only recommend products we actually use and love in our home. Real reviews from real life with littles!
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {affiliateCategories.map((category) => (
              <div
                key={category.title}
                className="bg-white p-6 rounded-2xl shadow-md border-2 border-light-sage hover:border-sage transition-all"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2">
                  {category.title}
                </h3>
                <p className="text-charcoal/70 text-sm mb-4">
                  {category.description}
                </p>
                <Link
                  href="#"
                  className="inline-block px-4 py-2 border-2 border-sage text-deep-sage text-sm font-semibold rounded-full hover:bg-sage hover:text-white transition-all"
                >
                  View Picks
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-16 p-6 bg-warm-beige/50 rounded-xl text-center">
          <p className="text-charcoal/60 text-sm">
            Some links on this page are affiliate links. This means I may earn a small commission if you make a purchase,
            at no extra cost to you. I only recommend products I genuinely use and love. Thank you for supporting Half Pint Mama!
          </p>
        </div>
      </div>
    </div>
  );
}
