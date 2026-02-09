import type { Metadata } from "next";
import { PostCard } from "@/components/PostCard";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";
import { getLatestPost, getPopularPosts, getSiteStats, formatDate } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Users } from "lucide-react";
import { ThemedIcon } from "@/components/ThemedIcon";

export const metadata: Metadata = {
  title: "Half Pint Mama | Nourishing Motherhood From Scratch",
  description: "From-scratch recipes, sourdough baking, and honest motherhood from a Pediatric ER RN and mama of two in Central Texas. Real food, real life.",
  openGraph: {
    title: "Half Pint Mama | Nourishing Motherhood From Scratch",
    description: "From-scratch recipes, sourdough baking, and honest motherhood from a Pediatric ER RN and mama of two.",
    images: ["/logo.jpg"],
    url: "https://halfpintmama.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Half Pint Mama | Nourishing Motherhood From Scratch",
    description: "From-scratch recipes, sourdough baking, and honest motherhood from a Pediatric ER RN and mama of two.",
    images: ["/logo.jpg"],
  },
  alternates: { canonical: "https://halfpintmama.com" },
};

export const revalidate = 3600;

export default async function Home() {
  const [latestPost, popularPosts, siteStats] = await Promise.all([
    getLatestPost(),
    getPopularPosts(4),
    getSiteStats(),
  ]);

  // Structured data for SEO
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Half Pint Mama",
    url: "https://halfpintmama.com",
    description: "From-scratch recipes, sourdough baking, and honest motherhood from a Pediatric ER RN and mama of two in Central Texas.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://halfpintmama.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Half Pint Mama",
    url: "https://halfpintmama.com",
    logo: "https://halfpintmama.com/logo.jpg",
    description: "From-scratch recipes, sourdough baking, and honest motherhood from a Pediatric ER RN and mama of two.",
    founder: {
      "@type": "Person",
      name: "Keegan",
      jobTitle: "Pediatric ER RN & Blogger",
    },
    sameAs: [
      "https://www.instagram.com/halfpint.mama",
      "https://www.amazon.com/shop/influencer-f4dc3b3f",
    ],
  };

  return (
    <div className="bg-cream">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Hero Section - Clear Value Proposition */}
      <section className="bg-gradient-to-b from-light-sage/30 to-cream py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 bg-terracotta/10 text-terracotta font-semibold text-sm rounded-full mb-6">
            From the ER to the Kitchen
          </span>
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl lg:text-6xl text-deep-sage font-bold mb-4">
            Nourishing Motherhood From Scratch
          </h1>
          <h2 className="font-[family-name:var(--font-crimson)] text-xl md:text-2xl text-sage font-medium mb-6">
            From a Pediatric ER RN & Mama of Two
          </h2>
          <p className="text-charcoal/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            I bring the same precision I use in the ER to my kitchen — nurse-tested recipes, real ingredients, and nothing I wouldn&apos;t feed my own kids. From sourdough on the counter to babies on the hip.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/free-guide"
              className="px-8 py-4 gradient-cta text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg"
            >
              Get My Free Sourdough Guide
            </Link>
            <Link
              href="/mama-guide"
              className="px-8 py-4 bg-sage text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-deep-sage transition-all text-lg"
            >
              Get My Free Mama Life Guide
            </Link>
            <Link
              href="/start-here"
              className="px-8 py-4 bg-terracotta/10 text-terracotta font-semibold rounded-full shadow-md hover:shadow-lg border-2 border-terracotta hover:bg-terracotta hover:text-white transition-all text-lg"
            >
              Start Here
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <div className="bg-white/60 border-y border-warm-beige/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-charcoal/60">
          {siteStats.averageRating > 0 && (
            <>
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">&#9733;</span>
                {siteStats.averageRating.toFixed(1)} average rating
              </span>
              <span className="hidden sm:inline text-charcoal/30">|</span>
            </>
          )}
          <span>{siteStats.cookingPosts}+ from-scratch recipes</span>
          <span className="hidden sm:inline text-charcoal/30">|</span>
          <span>Pediatric ER RN approved</span>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Latest Post - Featured Large Card */}
            {latestPost && (
              <section className="mb-12">
                <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-3 border-b-4 border-terracotta inline-block mb-8">
                  Latest Post
                </h2>
                <Link href={`/posts/${latestPost.slug}`} className="block group">
                  <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="md:flex">
                      {/* Image */}
                      <div className="relative md:w-1/2 h-64 md:h-80 bg-gradient-to-br from-light-sage to-warm-beige">
                        {latestPost.image && (
                          <Image
                            src={latestPost.image}
                            alt={latestPost.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                          />
                        )}
                      </div>
                      {/* Content */}
                      <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                        <span className="inline-block px-3 py-1 bg-terracotta text-white text-xs font-semibold rounded-full uppercase tracking-wide mb-4 w-fit">
                          {latestPost.category.replace("-", " ")}
                        </span>
                        <h3 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl font-semibold text-charcoal mb-3 leading-tight group-hover:text-deep-sage transition-colors">
                          {latestPost.title}
                        </h3>
                        <p className="text-charcoal/70 text-base leading-relaxed mb-4 line-clamp-3">
                          {latestPost.excerpt}
                        </p>
                        <div className="flex items-center gap-4">
                          <p className="text-sage font-medium">
                            {formatDate(latestPost.date)}
                          </p>
                          {latestPost.ratingCount && latestPost.ratingCount > 0 && (
                            <>
                              <span className="text-charcoal/30">|</span>
                              <div className="flex items-center gap-1 text-sm text-charcoal/70">
                                <span className="text-yellow-500">★</span>
                                <span>{latestPost.ratingAverage?.toFixed(1)}</span>
                                <span className="text-charcoal/50">({latestPost.ratingCount})</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </section>
            )}

            {/* Popular Posts */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-3 border-b-4 border-sage inline-block">
                  Popular Posts
                </h2>
                <Link href="/posts" className="text-sage hover:text-deep-sage font-medium transition-colors">
                  View All Posts &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {popularPosts.map((post) => (
                  <PostCard
                    key={post.slug}
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    date={formatDate(post.date)}
                    image={post.image}
                    ratingAverage={post.ratingAverage}
                    ratingCount={post.ratingCount}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            {/* About the Author */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-6 text-center">
              <ThemedIcon icon={Users} size="lg" color="sage" className="mx-auto mb-3" />
              <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-2">
                Hey, I&apos;m Keegan
              </h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Pediatric ER RN and mama of two. I apply the same care to feeding my family as I do to my patients — real ingredients, tested recipes, no shortcuts.
              </p>
              <Link
                href="/about"
                className="inline-block px-4 py-2 border-2 border-sage text-deep-sage text-sm font-semibold rounded-full hover:bg-sage hover:text-white transition-all"
              >
                More About Me
              </Link>
            </div>

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
                  <ShoppingCart className="w-6 h-6 text-[#FF9900]" />
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
                  <Heart className="w-6 h-6 text-pink-500" />
                  <div>
                    <p className="font-semibold text-charcoal group-hover:text-pink-600 transition-colors text-sm">LTK Shop</p>
                    <p className="text-charcoal/60 text-xs">Outfit & home picks</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Reader Favorites */}
            {popularPosts.filter(p => p.ratingCount && p.ratingCount > 0).length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
                <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-4">
                  Reader Favorites
                </h3>
                <div className="space-y-3">
                  {popularPosts.filter(p => p.ratingCount && p.ratingCount > 0).slice(0, 3).map((post) => (
                    <Link key={post.slug} href={`/posts/${post.slug}`} className="block group">
                      <p className="text-charcoal group-hover:text-terracotta transition-colors text-sm font-medium line-clamp-2">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= Math.round(post.ratingAverage || 0) ? "text-yellow-500" : "text-charcoal/20"}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                        <span className="text-charcoal/50 text-xs ml-1">({post.ratingCount})</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Explore */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
              <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-4">
                Explore
              </h3>
              <div className="space-y-4">
                <div>
                  <Link href="/cooking" className="font-semibold text-charcoal hover:text-terracotta transition-colors">
                    From Scratch Kitchen
                  </Link>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      { label: "Sourdough", href: "/cooking/sourdough" },
                      { label: "Discard", href: "/cooking/discard" },
                      { label: "Desserts", href: "/cooking/desserts" },
                      { label: "Snacks", href: "/cooking/snacks" },
                    ].map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="px-3 py-1 bg-light-sage/30 text-deep-sage text-xs rounded-full hover:bg-sage hover:text-white transition-all"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <Link href="/mama-life" className="font-semibold text-charcoal hover:text-terracotta transition-colors">
                    Mama Life
                  </Link>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      { label: "Parenting", href: "/mama-life/parenting" },
                      { label: "Travel", href: "/mama-life/travel" },
                      { label: "DIY", href: "/mama-life/diy" },
                      { label: "Homesteading", href: "/mama-life/homesteading" },
                    ].map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="px-3 py-1 bg-light-sage/30 text-deep-sage text-xs rounded-full hover:bg-sage hover:text-white transition-all"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
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
