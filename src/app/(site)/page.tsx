import { PostCard } from "@/components/PostCard";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";
import { getAllPosts, formatDate } from "@/lib/posts";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  const allPosts = await getAllPosts();
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
            Real Food. From Scratch.
          </h1>
          <h2 className="font-[family-name:var(--font-crimson)] text-xl md:text-2xl text-sage font-medium mb-6">
            From a Pediatric ER RN & Sourdough-Obsessed Mama
          </h2>
          <p className="text-charcoal/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            Bringing an intentional, practical approach to nourishing a home. Here you&apos;ll find tried and true from scratch recipes, tested in real life between shifts, changing seasons, and motherhood.
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

            {/* Popular Tags */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
              <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-4">
                Browse by Topic
              </h3>
              <div className="flex flex-wrap gap-2">
                {["sourdough", "kid-friendly", "snacks", "cookies", "healthy", "no-bake", "dessert", "crackers"].map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="px-3 py-1.5 bg-light-sage/30 text-deep-sage text-sm rounded-full hover:bg-sage hover:text-white transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Email Signup with Lead Magnet */}
      <HomeEmailSignup />
    </div>
  );
}
