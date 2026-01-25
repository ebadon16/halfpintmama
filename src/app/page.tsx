import { PostCard } from "@/components/PostCard";
import { getAllPosts, formatDate } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const allPosts = getAllPosts();
  const featuredPosts = allPosts.slice(0, 4);

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-md border-l-4 border-sage">
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl text-deep-sage font-semibold mb-4">
            Hey, I&apos;m Keegan!
          </h2>
          <p className="text-charcoal/80 leading-relaxed max-w-2xl mx-auto">
            I&apos;m a Pediatric ER RN turned stay-at-home mama, sharing the beautiful chaos of life
            with my toddler Porter, baby Reese, and our chocolate lab Stout. Here you&apos;ll find
            sourdough recipes, family travel adventures, DIY projects, and real talk about motherhood.
          </p>
          <Link
            href="/about"
            className="inline-block mt-6 px-6 py-3 gradient-cta text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            More About Me
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 pb-3 border-b-4 border-sage inline-block">
          Latest from the Blog
        </h2>

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

        <div className="text-center mt-10">
          <Link
            href="/posts"
            className="inline-block px-8 py-3 border-2 border-sage text-deep-sage font-semibold rounded-full hover:bg-sage hover:text-white transition-all"
          >
            View All {allPosts.length} Posts
          </Link>
        </div>
      </section>

      {/* Categories Quick Links */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 pb-3 border-b-4 border-sage inline-block">
          Explore
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/cooking"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg border-2 border-transparent hover:border-terracotta transition-all group"
          >
            <div className="text-4xl mb-3">🍞</div>
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal group-hover:text-terracotta transition-colors">
              Cooking & Baking
            </h3>
            <p className="text-charcoal/60 text-sm mt-2">
              Sourdough, recipes, and kitchen adventures
            </p>
          </Link>

          <Link
            href="/travel"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg border-2 border-transparent hover:border-sage transition-all group"
          >
            <div className="text-4xl mb-3">✈️</div>
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal group-hover:text-sage transition-colors">
              Family Travel
            </h3>
            <p className="text-charcoal/60 text-sm mt-2">
              Adventures with toddlers and a baby
            </p>
          </Link>

          <Link
            href="/diy"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg border-2 border-transparent hover:border-soft-pink transition-all group"
          >
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal group-hover:text-terracotta transition-colors">
              DIY Projects
            </h3>
            <p className="text-charcoal/60 text-sm mt-2">
              Crafts, costumes, and creative ideas
            </p>
          </Link>

          <Link
            href="/shop"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg border-2 border-transparent hover:border-deep-sage transition-all group"
          >
            <div className="text-4xl mb-3">🛒</div>
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal group-hover:text-deep-sage transition-colors">
              Shop
            </h3>
            <p className="text-charcoal/60 text-sm mt-2">
              Ebooks, printables, and favorites
            </p>
          </Link>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="gradient-cta rounded-2xl p-8 text-center text-white shadow-lg">
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl font-semibold mb-3">
            Join the Community!
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Get new recipes, travel tips, and real mom moments delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-full text-charcoal focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-6 py-3 bg-deep-sage text-white font-semibold rounded-full hover:bg-charcoal transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
