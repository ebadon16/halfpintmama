import { PostCard } from "@/components/PostCard";
import { getAllPosts, formatDate } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const allPosts = getAllPosts();
  const featuredPosts = allPosts.slice(0, 4);

  return (
    <div className="bg-cream">
      {/* Hero Section - Clear Value Proposition */}
      <section className="bg-gradient-to-b from-light-sage/30 to-cream py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 bg-terracotta/10 text-terracotta font-semibold text-sm rounded-full mb-6">
            From the ER to the Kitchen
          </span>
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl lg:text-6xl text-deep-sage font-bold mb-4">
            Real Food. Simple Recipes.
          </h1>
          <h2 className="font-[family-name:var(--font-crimson)] text-xl md:text-2xl text-sage font-medium mb-6">
            From a Sourdough-Obsessed Mama & Pediatric ER RN
          </h2>
          <p className="text-charcoal/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            I&apos;m Keegan - a Pediatric ER RN turned mama of two. Whether you&apos;re here for sourdough, parenting tips, or quick family recipes, I&apos;ve got something for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/free-guide"
              className="px-8 py-4 gradient-cta text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg"
            >
              Get My Free Sourdough Starter Guide
            </Link>
            <Link
              href="/shop"
              className="px-8 py-4 bg-terracotta/10 text-terracotta font-semibold rounded-full shadow-md hover:shadow-lg border-2 border-terracotta hover:bg-terracotta hover:text-white transition-all text-lg"
            >
              Shop My Favorites
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Latest Posts */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-3 border-b-4 border-sage inline-block">
                  Latest from the Blog
                </h2>
                <Link href="/posts" className="text-sage hover:text-deep-sage font-medium transition-colors">
                  View All {allPosts.length} Posts &rarr;
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <PostCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    date={formatDate(post.date)}
                    image={post.image}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            {/* Shop My Favorites Links */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
              <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-4">
                Shop My Favorites
              </h3>
              <div className="space-y-3">
                <a
                  href="https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#FF9900]/10 rounded-xl hover:bg-[#FF9900]/20 transition-all group"
                >
                  <span className="text-2xl">🛒</span>
                  <div>
                    <p className="font-semibold text-charcoal group-hover:text-[#FF9900] transition-colors text-sm">Amazon Storefront</p>
                    <p className="text-charcoal/60 text-xs">Shop all my favorites</p>
                  </div>
                </a>
                <a
                  href="https://tr.ee/-4hpXd9Zfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-all group"
                >
                  <span className="text-2xl">💗</span>
                  <div>
                    <p className="font-semibold text-charcoal group-hover:text-pink-600 transition-colors text-sm">LTK Shop</p>
                    <p className="text-charcoal/60 text-xs">Outfit & home picks</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Postpartum Meal eBook Promo */}
            <div className="bg-gradient-to-br from-terracotta/10 to-soft-pink/20 p-6 rounded-2xl mb-6 border-2 border-terracotta/20">
              <div className="text-4xl mb-3">🍽️</div>
              <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2">
                Postpartum Meal Guide
              </h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Nourishing, easy-to-prep meals for new mamas. Nurse-approved recipes to fuel your recovery and keep you energized.
              </p>
              <div className="text-center p-3 bg-white/80 rounded-full mb-3">
                <span className="text-terracotta font-semibold text-sm">Coming Soon</span>
              </div>
              <Link
                href="/free-guide"
                className="block text-center text-terracotta font-medium text-sm hover:text-deep-sage transition-colors"
              >
                Join waitlist &rarr;
              </Link>
            </div>

          </aside>
        </div>
      </div>

      {/* Email Signup with Lead Magnet */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="gradient-cta rounded-2xl p-8 md:p-10 text-center text-white shadow-lg">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl font-semibold mb-3">
            Get My Free Sourdough Starter Guide
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Plus weekly recipes, mom tips, and exclusive content. Join 1,000+ mamas who are baking and thriving!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-full text-charcoal border-2 border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white"
            />
            <button className="px-6 py-3 bg-deep-sage text-white font-semibold rounded-full hover:bg-charcoal transition-colors whitespace-nowrap">
              Send My Guide
            </button>
          </div>
          <p className="text-white/60 text-xs mt-4">
            No spam, unsubscribe anytime. I respect your inbox.
          </p>
        </div>
      </section>
    </div>
  );
}
