export const metadata = {
  title: "Products We Love | Half Pint Mama",
  description: "Curated product recommendations for sourdough baking, baby gear, and family travel. Real reviews from real life with littles.",
  alternates: { canonical: "https://halfpintmama.com/products" },
  openGraph: {
    title: "Products We Love | Half Pint Mama",
    description: "Curated product recommendations for sourdough baking, baby gear, and family travel.",
    url: "https://halfpintmama.com/products",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Products We Love | Half Pint Mama",
    description: "Curated product recommendations for sourdough baking, baby gear, and family travel.",
  },
};

const affiliateCategories = [
  {
    title: "Sourdough Essentials",
    description: "Everything you need to start and maintain your sourdough journey. These are the exact tools in my kitchen.",
    icon: "🥖",
    link: "https://www.amazon.com/shop/influencer-f4dc3b3f/list/34LAO012O5RIR?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
  },
  {
    title: "Baby-Led Weaning",
    description: "Everything you need to start your baby on solids the BLW way. Safe, practical, and parent-tested.",
    icon: "👶",
    link: "https://www.amazon.com/shop/influencer-f4dc3b3f/list/3K7AEMTLYQWAA?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
  },
  {
    title: "Travel Gear",
    description: "What we pack for every adventure. Road trips, flights, and everything in between with two littles.",
    icon: "🧳",
    link: "https://www.amazon.com/shop/influencer-f4dc3b3f/list/2SYTGUP5EUSC?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
  },
  {
    title: "Preschool at Home",
    description: "Our favorite learning tools, books, and activities for teaching littles at home.",
    icon: "📚",
    link: "https://www.amazon.com/shop/influencer-f4dc3b3f/list/3C6A7CTB9S2CX?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
  },
];

export default function ProductsPage() {
  return (
    <div className="bg-cream">
      {/* Header */}
      <section className="bg-gradient-to-b from-light-sage/30 to-cream py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
            Products We Actually Use & Love
          </h1>
          <p className="text-charcoal/80 text-lg max-w-2xl mx-auto">
            Real recommendations from real life with two littles. I only share products we genuinely use in our home - no sponsored posts, just honest favorites.
          </p>
        </div>
      </section>

      {/* Shop Links */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#FF9900]/10 rounded-2xl hover:bg-[#FF9900]/20 transition-all group border-2 border-[#FF9900]/20"
          >
            <span className="text-3xl">🛒</span>
            <div className="text-left">
              <p className="font-semibold text-charcoal group-hover:text-[#FF9900] transition-colors">Amazon Storefront</p>
              <p className="text-charcoal/60 text-sm">Shop all my favorites</p>
            </div>
          </a>
          <a
            href="https://tr.ee/-4hpXd9Zfr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-4 bg-pink-50 rounded-2xl hover:bg-pink-100 transition-all group border-2 border-pink-200"
          >
            <span className="text-3xl">💗</span>
            <div className="text-left">
              <p className="font-semibold text-charcoal group-hover:text-pink-600 transition-colors">LTK Shop</p>
              <p className="text-charcoal/60 text-sm">Outfit & home picks</p>
            </div>
          </a>
        </div>
      </section>

      {/* Products I Actually Use */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {affiliateCategories.map((category) => (
            <a
              key={category.title}
              href={category.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all group"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal group-hover:text-terracotta transition-colors mb-2">
                {category.title}
              </h3>
              <p className="text-charcoal/70 text-sm mb-4">
                {category.description}
              </p>
              <span className="inline-block w-full text-center px-4 py-2 border-2 border-terracotta text-terracotta text-sm font-semibold rounded-full group-hover:bg-terracotta group-hover:text-white transition-all">
                Shop Collection
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="p-6 bg-warm-beige/50 rounded-xl text-center">
          <p className="text-charcoal/60 text-sm">
            <strong>Affiliate Disclosure:</strong> Links on this page are Amazon affiliate links. This means I earn a small commission if you purchase through them, at no extra cost to you. I only recommend products I personally use and love. Your support helps keep this blog running - thank you!
          </p>
        </div>
      </section>
    </div>
  );
}
