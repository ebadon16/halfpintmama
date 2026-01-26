import Link from "next/link";

export const metadata = {
  title: "Products We Love | Half Pint Mama",
  description: "Curated product recommendations for sourdough baking, baby gear, and family travel. Real reviews from real life with littles.",
};

const productCategories = [
  {
    id: "sourdough",
    title: "Sourdough Essentials",
    description: "Everything in my kitchen that makes sourdough baking easier. These are the exact tools I use every week.",
    icon: "🥖",
    color: "terracotta",
    products: [
      {
        name: "9-Inch Proofing Basket Set",
        description: "Includes 2 bannetons, liners, bread lame, and dough scraper. This is the exact set I started with.",
        note: "Best starter kit",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "OXO Kitchen Scale",
        description: "Accurate to 1 gram, essential for consistent sourdough. The pull-out display is genius for large bowls.",
        note: "Most used tool",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Lodge 5-Quart Dutch Oven",
        description: "Creates the steam needed for that crispy crust. Pre-seasoned and lasts forever.",
        note: "Best value",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Weck Glass Jars (1L)",
        description: "Perfect for starter storage. The wide mouth makes feeding easy and you can see the rise clearly.",
        note: "Aesthetic & functional",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Silicone Bread Lame",
        description: "Makes beautiful scoring patterns. The curved blade creates better ears than straight razors.",
        note: "Game changer",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Bench Scraper Set",
        description: "Metal for dividing dough, plastic for scraping bowls. Use these literally every bake.",
        note: "Essential duo",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
    ],
  },
  {
    id: "baby",
    title: "Baby & Toddler Must-Haves",
    description: "The gear that survived two babies and countless adventures. Only the stuff that actually made our lives easier.",
    icon: "👶",
    color: "sage",
    products: [
      {
        name: "Inglesina Fast Table Chair",
        description: "Clamps to any table, folds flat for travel. We've used this at restaurants, grandparents' houses, everywhere.",
        note: "Travel essential",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Munchkin Snack Catcher",
        description: "The soft flaps let toddlers grab snacks but prevent dumping. Every car trip, every day.",
        note: "No mess snacking",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Hatch Rest Sound Machine",
        description: "White noise, night light, and time-to-rise light in one. Controls from your phone. Worth every penny.",
        note: "Sleep saver",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "ezpz Happy Mat",
        description: "Suction sticks to the table so toddlers can't throw it. Divided sections for picky eaters.",
        note: "Meal time hero",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Boon Grass Drying Rack",
        description: "Cute design that actually dries bottles well. The lawn accessories are adorable.",
        note: "Kitchen counter staple",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Baby Bjorn Bouncer",
        description: "Our most used baby item. Natural bouncing from baby's movement, folds flat, machine washable cover.",
        note: "Most recommended",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
    ],
  },
  {
    id: "travel",
    title: "Travel Gear",
    description: "Everything we pack for adventures with two littles. Road trips, flights, and everything in between.",
    icon: "🧳",
    color: "deep-sage",
    products: [
      {
        name: "Babyzen YOYO2 Stroller",
        description: "Folds to fit in overhead bin. One-hand fold, lightweight, and smooth ride. Our best baby purchase.",
        note: "Worth the splurge",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Packing Cubes (6-Pack)",
        description: "Color-coded for each family member. Keeps suitcases organized and packing/unpacking so much faster.",
        note: "Organization essential",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Yogasleep Travel Sound Machine",
        description: "Rechargeable, clips to stroller or crib. Consistent sleep sounds wherever we go.",
        note: "Compact & loud",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "PackIt Freezable Snack Bag",
        description: "Built-in ice pack keeps snacks cold for hours. Yogurt tubes, cheese sticks - all survive road trips.",
        note: "No ice packs needed",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Lotus Travel Crib",
        description: "Sets up in 15 seconds, backpack carry case. The side zipper is genius for toddlers.",
        note: "Best travel crib",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Skip Hop Activity Center",
        description: "Folds flat for travel, converts to a table later. Entertains babies at grandparents' houses.",
        note: "Grows with baby",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
    ],
  },
  {
    id: "kitchen",
    title: "Kitchen Favorites",
    description: "Beyond sourdough - the tools and gadgets that make cooking with kids around actually manageable.",
    icon: "🍳",
    color: "soft-pink",
    products: [
      {
        name: "Instant Pot Duo 6-Quart",
        description: "Dump ingredients in, walk away, dinner is ready. Saved us during the newborn phase.",
        note: "Dinner saver",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "OXO Tot Food Masher",
        description: "Mash baby food right in the serving bowl. Dishwasher safe, minimal parts.",
        note: "BLW essential",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Rubbermaid Meal Prep Containers",
        description: "Meal prep Sundays changed our week. These stack neatly and don't leak.",
        note: "Meal prep must",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "KitchenAid Mixer",
        description: "Yes, it's pricey. Yes, it's worth it. Bread dough, cookie dough, everything.",
        note: "Investment piece",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Learning Tower",
        description: "Lets toddlers safely help in the kitchen. Porter helps with everything now.",
        note: "Toddler approved",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
      {
        name: "Stasher Silicone Bags",
        description: "Replaced our plastic bags for snacks and freezer storage. Dishwasher and microwave safe.",
        note: "Eco-friendly swap",
        link: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB",
      },
    ],
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

      {/* Quick Nav */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          {productCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-charcoal hover:text-deep-sage"
            >
              {cat.icon} {cat.title}
            </a>
          ))}
        </div>
      </section>

      {/* Product Categories */}
      {productCategories.map((category, index) => (
        <section
          key={category.id}
          id={category.id}
          className={`py-12 scroll-mt-24 ${index % 2 === 1 ? 'bg-white' : ''}`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8">
              <span className="text-5xl mb-4 block">{category.icon}</span>
              <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-3">
                {category.title}
              </h2>
              <p className="text-charcoal/70 max-w-2xl">
                {category.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.products.map((product, i) => (
                <a
                  key={i}
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-sage group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-charcoal group-hover:text-deep-sage transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-xs bg-light-sage/50 text-deep-sage px-2 py-1 rounded-full whitespace-nowrap">
                      {product.note}
                    </span>
                  </div>
                  <p className="text-charcoal/70 text-sm mb-4">
                    {product.description}
                  </p>
                  <span className="text-terracotta font-medium text-sm group-hover:text-deep-sage transition-colors">
                    View on Amazon &rarr;
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Newsletter CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="gradient-cta rounded-2xl p-8 text-center text-white shadow-lg">
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold mb-3">
            Want More Recommendations?
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            I share new favorites and honest reviews in my weekly newsletter. Join the community!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-full text-charcoal focus:outline-none"
            />
            <button className="px-6 py-3 bg-deep-sage text-white font-semibold rounded-full hover:bg-charcoal transition-colors">
              Subscribe
            </button>
          </div>
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
