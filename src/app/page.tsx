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
            Tested recipes and evidence-based tips from a Pediatric ER RN who brings nurse-level
            precision to sourdough. Because your family deserves food made with love AND knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/free-guide"
              className="px-8 py-4 gradient-cta text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg"
            >
              Get My Free Sourdough Starter Guide
            </Link>
            <Link
              href="/shop"
              className="px-8 py-4 bg-white text-deep-sage font-semibold rounded-full shadow-md hover:shadow-lg border-2 border-sage hover:bg-sage hover:text-white transition-all text-lg"
            >
              Shop My Favorites
            </Link>
          </div>
        </div>
      </section>

      {/* Not Sure Where to Start - Moved up */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-3 text-center">
            Not Sure Where to Start?
          </h2>
          <p className="text-charcoal/70 text-center mb-8 max-w-xl mx-auto">
            I&apos;ve got you covered. Pick your path:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Path 1: Sourdough */}
            <Link href="/start-here#sourdough" className="bg-gradient-to-br from-terracotta/10 to-soft-pink/10 p-6 rounded-2xl border-2 border-transparent hover:border-terracotta transition-all group">
              <div className="text-5xl mb-4">🍞</div>
              <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal group-hover:text-terracotta transition-colors mb-2">
                New to Sourdough?
              </h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Start your sourdough journey with my beginner-friendly guides, from creating your first starter to baking your first loaf.
              </p>
              <span className="text-terracotta font-medium text-sm">Start baking &rarr;</span>
            </Link>

            {/* Path 2: New Parent */}
            <Link href="/start-here#parenting" className="bg-gradient-to-br from-sage/10 to-light-sage/20 p-6 rounded-2xl border-2 border-transparent hover:border-sage transition-all group">
              <div className="text-5xl mb-4">👶</div>
              <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal group-hover:text-sage transition-colors mb-2">
                New Parent?
              </h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Real talk from an ER nurse and mama. Tips for surviving (and thriving) with babies and toddlers.
              </p>
              <span className="text-sage font-medium text-sm">Get support &rarr;</span>
            </Link>

            {/* Path 3: Quick Recipes */}
            <Link href="/start-here#recipes" className="bg-gradient-to-br from-deep-sage/10 to-sage/10 p-6 rounded-2xl border-2 border-transparent hover:border-deep-sage transition-all group">
              <div className="text-5xl mb-4">🥗</div>
              <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal group-hover:text-deep-sage transition-colors mb-2">
                Looking for Recipes?
              </h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Family-tested recipes that even picky toddlers approve. Quick weeknight meals to elaborate weekend bakes.
              </p>
              <span className="text-deep-sage font-medium text-sm">Find recipes &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Shop My Favorites - Amazon Affiliate Grid */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-3 border-b-4 border-terracotta inline-block">
                  Shop My Kitchen Favorites
                </h2>
                <Link href="/products" className="text-terracotta hover:text-deep-sage font-medium transition-colors">
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Product Card 1 */}
                <a href="#" className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <div className="aspect-square bg-warm-beige/50 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">🥣</span>
                  </div>
                  <h3 className="font-medium text-charcoal group-hover:text-terracotta transition-colors text-sm">Sourdough Proofing Basket</h3>
                  <p className="text-sage text-sm mt-1">My go-to for perfect loaves</p>
                </a>

                {/* Product Card 2 */}
                <a href="#" className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <div className="aspect-square bg-warm-beige/50 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">🍳</span>
                  </div>
                  <h3 className="font-medium text-charcoal group-hover:text-terracotta transition-colors text-sm">Dutch Oven</h3>
                  <p className="text-sage text-sm mt-1">Essential for crusty bread</p>
                </a>

                {/* Product Card 3 */}
                <a href="#" className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <div className="aspect-square bg-warm-beige/50 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">📖</span>
                  </div>
                  <h3 className="font-medium text-charcoal group-hover:text-terracotta transition-colors text-sm">Kitchen Scale</h3>
                  <p className="text-sage text-sm mt-1">Precision baking must-have</p>
                </a>

                {/* Product Card 4 */}
                <a href="#" className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <div className="aspect-square bg-warm-beige/50 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">🫙</span>
                  </div>
                  <h3 className="font-medium text-charcoal group-hover:text-terracotta transition-colors text-sm">Starter Jar Set</h3>
                  <p className="text-sage text-sm mt-1">Keep your starter happy</p>
                </a>
              </div>

              <p className="text-center text-charcoal/50 text-xs mt-4">
                As an Amazon Associate, I earn from qualifying purchases.
              </p>
            </section>

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

            {/* Instagram Feed */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-2">
                Follow Along
              </h3>
              <a
                href="https://www.instagram.com/halfpint.mama/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta hover:text-deep-sage font-medium text-sm transition-colors block mb-4"
              >
                @halfpint.mama
              </a>

              {/* Instagram Embed */}
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/halfpint.mama/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square bg-warm-beige/50 rounded flex items-center justify-center hover:opacity-80 transition-opacity">
                        <span className="text-charcoal/20 text-xs">📷</span>
                      </div>
                    ))}
                  </div>
                </a>
                <a
                  href="https://www.instagram.com/halfpint.mama/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 border-2 border-terracotta text-terracotta text-sm font-semibold rounded-full hover:bg-terracotta hover:text-white transition-all"
                >
                  Follow on Instagram
                </a>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-light-sage text-center">
                <p className="text-charcoal/60 text-xs">
                  Join our community of mamas!
                </p>
              </div>
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
