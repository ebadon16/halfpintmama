import Link from "next/link";
import { getPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { EmailSignup } from "@/components/EmailSignup";

export const revalidate = 60;

export const metadata = {
  title: "Start Here | Half Pint Mama",
  description: "New to Half Pint Mama? Find your path - whether you're starting your sourdough journey, navigating new parenthood, or looking for family recipes.",
  alternates: { canonical: "https://halfpintmama.com/start-here" },
  openGraph: {
    title: "Start Here | Half Pint Mama",
    description: "New to Half Pint Mama? Start your sourdough journey, navigate parenthood, or find family recipes.",
    url: "https://halfpintmama.com/start-here",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Start Here | Half Pint Mama",
    description: "New to Half Pint Mama? Start your sourdough journey, navigate parenthood, or find family recipes.",
  },
};

export default async function StartHerePage() {
  const cookingPosts = (await getPostsByCategory("cooking")).slice(0, 3);
  const mamaLifePosts = (await getPostsByCategory("mama-life")).slice(0, 3);

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="bg-gradient-to-b from-light-sage/30 to-cream py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-6">
            Welcome! Let Me Help You Get Started
          </h1>
        </div>
      </section>

      {/* About Me - Moved to Top */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-light-sage/30 to-warm-beige/30 rounded-2xl p-8 md:flex items-center gap-8">
          <div className="text-8xl mb-6 md:mb-0">👩‍👧‍👦</div>
          <div>
            <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-3">
              A Little About Me
            </h2>
            <p className="text-charcoal/70 mb-4">
              I&apos;m a former Pediatric ER nurse who traded scrubs for sweatpants when I became a mama to Porter (toddler) and Reese (baby). Our chocolate lab Stout completes our crew. I started this blog to share what I&apos;ve learned about sourdough, family life, and finding joy in the chaos.
            </p>
            <Link
              href="/about"
              className="inline-block text-terracotta font-medium hover:text-deep-sage transition-colors"
            >
              Read my full story &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Path Selection */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 text-center">
          What Brings You Here Today?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sourdough Path */}
          <div id="sourdough" className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-terracotta">
              <div className="bg-gradient-to-br from-terracotta/10 to-soft-pink/10 p-8 text-center">
                <span className="text-6xl">🍞</span>
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold text-charcoal mb-3">
                  New to Sourdough
                </h3>
                <p className="text-charcoal/70 mb-6">
                  Ready to start your sourdough journey? I&apos;ll walk you through everything from creating your first starter to baking beautiful loaves.
                </p>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-charcoal text-sm uppercase tracking-wide">Start With:</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/posts" className="flex items-center gap-2 text-terracotta hover:text-deep-sage transition-colors">
                        <span>→</span> How to Create a Sourdough Starter
                      </Link>
                    </li>
                    <li>
                      <Link href="/posts" className="flex items-center gap-2 text-terracotta hover:text-deep-sage transition-colors">
                        <span>→</span> Your First Sourdough Loaf
                      </Link>
                    </li>
                    <li>
                      <Link href="/posts" className="flex items-center gap-2 text-terracotta hover:text-deep-sage transition-colors">
                        <span>→</span> Sourdough Troubleshooting Guide
                      </Link>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/free-guide"
                  className="block w-full text-center px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
                >
                  Get My Free Starter Guide
                </Link>
              </div>
            </div>
          </div>

          {/* New Parent Path */}
          <div id="parenting" className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-sage">
              <div className="bg-gradient-to-br from-sage/10 to-light-sage/20 p-8 text-center">
                <span className="text-6xl">👶</span>
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold text-charcoal mb-3">
                  New Parent
                </h3>
                <p className="text-charcoal/70 mb-6">
                  Navigating life with a new baby? As an ER nurse turned mama, I share real talk about the beautiful chaos of parenthood.
                </p>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-charcoal text-sm uppercase tracking-wide">Start With:</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/mama-life" className="flex items-center gap-2 text-sage hover:text-deep-sage transition-colors">
                        <span>→</span> Surviving the Newborn Stage
                      </Link>
                    </li>
                    <li>
                      <Link href="/mama-life" className="flex items-center gap-2 text-sage hover:text-deep-sage transition-colors">
                        <span>→</span> Products That Actually Help
                      </Link>
                    </li>
                    <li>
                      <Link href="/mama-life" className="flex items-center gap-2 text-sage hover:text-deep-sage transition-colors">
                        <span>→</span> Honest Motherhood Moments
                      </Link>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/mama-life"
                  className="block w-full text-center px-6 py-3 border-2 border-sage text-deep-sage font-semibold rounded-full hover:bg-sage hover:text-white transition-all"
                >
                  Browse Mama Life Posts
                </Link>
              </div>
            </div>
          </div>

          {/* Recipes Path */}
          <div id="recipes" className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-deep-sage">
              <div className="bg-gradient-to-br from-deep-sage/10 to-sage/10 p-8 text-center">
                <span className="text-6xl">🥗</span>
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold text-charcoal mb-3">
                  Looking for Recipes
                </h3>
                <p className="text-charcoal/70 mb-6">
                  Need dinner ideas? From quick weeknight meals to weekend baking projects, all recipes are family-tested and toddler-approved.
                </p>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-charcoal text-sm uppercase tracking-wide">Popular Recipes:</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/cooking" className="flex items-center gap-2 text-deep-sage hover:text-charcoal transition-colors">
                        <span>→</span> Easy Sourdough Discard Recipes
                      </Link>
                    </li>
                    <li>
                      <Link href="/cooking" className="flex items-center gap-2 text-deep-sage hover:text-charcoal transition-colors">
                        <span>→</span> 15-Minute Family Dinners
                      </Link>
                    </li>
                    <li>
                      <Link href="/cooking" className="flex items-center gap-2 text-deep-sage hover:text-charcoal transition-colors">
                        <span>→</span> Healthy Toddler Snacks
                      </Link>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/cooking"
                  className="block w-full text-center px-6 py-3 border-2 border-deep-sage text-deep-sage font-semibold rounded-full hover:bg-deep-sage hover:text-white transition-all"
                >
                  Browse All Recipes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      {cookingPosts.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold pb-3 border-b-4 border-terracotta inline-block">
                Popular Recipes
              </h2>
              <Link href="/cooking" className="text-terracotta hover:text-deep-sage font-medium transition-colors">
                View All &rarr;
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {cookingPosts.map((post) => (
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
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="gradient-cta rounded-2xl p-8 text-center text-white shadow-lg">
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl font-semibold mb-3">
            Join the Half Pint Community
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Get weekly recipes, parenting tips, and exclusive content delivered to your inbox. Plus a free sourdough starter guide when you subscribe!
          </p>
          <EmailSignup
            source="website"
            buttonText="Subscribe"
            placeholder="Your email"
            className="max-w-md mx-auto"
            buttonClassName="bg-deep-sage text-white hover:bg-charcoal"
          />
        </div>
      </section>
    </div>
  );
}
