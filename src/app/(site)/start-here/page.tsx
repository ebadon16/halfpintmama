import Link from "next/link";
import { getPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { EmailSignup } from "@/components/EmailSignup";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Users, Wheat, Heart } from "lucide-react";
import { jsonLdHtml, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const revalidate = 3600;

// Answers restate Keegan's published post content; don't add claims her
// posts don't make. Schema below must mirror this visible text.
const FAQ_ITEMS: { q: string; a: string; link?: { href: string; label: string }; external?: boolean }[] = [
  {
    q: "Do I need a kitchen scale to start sourdough?",
    a: "Nope! My starter method uses regular measuring cups, so you can start with what's already in your kitchen.",
    link: { href: "/posts/how-to-make-a-sourdough-starter-simple-no-scale", label: "The no-scale starter guide" },
  },
  {
    q: "How do I know when my starter is ready to bake with?",
    a: "Towards the end of the first week it should look bubbly and airy, smell pleasantly tangy, and pass the float test: drop a little in some water and see if it floats. If it checks those boxes, it's time to bake!",
    link: { href: "/posts/how-to-make-a-sourdough-starter-simple-no-scale", label: "Full day-by-day walkthrough" },
  },
  {
    q: "What is sourdough discard, and do I have to throw it away?",
    a: "Discard is the part you remove when you feed your starter, and you don't have to toss it! There's a whole recipe section for it, from crackers to banana bread.",
    link: { href: "/cooking/discard", label: "Browse discard recipes" },
  },
  {
    q: "What tools do I actually need?",
    a: "For the starter: a jar or two, a small spatula, measuring cups, and something to loosely cover the jar. For your first artisan loaf you'll also want a Dutch oven. My favorite kitchen tools are in my Amazon storefront (affiliate link).",
    link: { href: "https://www.amazon.com/shop/influencer-f4dc3b3f?ref_=cm_sw_r_cp_ud_aipsfshop_0CZRPB69SH4835DATPEB", label: "Shop my favorites" },
    external: true,
  },
  {
    q: "My starter looks quiet or has liquid on top. Is it ruined?",
    a: "Usually no! Starters often look quiet the first couple of days, that's normal. And liquid on top is just your starter's way of saying it's hungry: feed it and keep going. The Sourdough Starter Guide covers all the common problems and fixes.",
    link: { href: "/free-guide", label: "Get the free guides" },
  },
  {
    q: "What should I bake first?",
    a: "The no-stress artisan loaf. It's written for first-time bakers and pairs perfectly with the starter you just made.",
    link: { href: "/posts/the-simple-no-stress-guide-to-your-first-artisan-sourdough-loaf", label: "The first-loaf guide" },
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export const metadata = {
  title: "Start Here | Half Pint Mama",
  description: "New to Half Pint Mama? Find your path, from your first sourdough starter to navigating motherhood with real food and real talk.",
  alternates: { canonical: "https://halfpintmama.com/start-here" },
  openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Start Here | Half Pint Mama",
    description: "New to Half Pint Mama? Start your sourdough journey or navigate motherhood with real food and real talk.",
    type: "website",
    url: "https://halfpintmama.com/start-here",
  },
  twitter: {
      images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image" as const,
    title: "Start Here | Half Pint Mama",
    description: "New to Half Pint Mama? Start your sourdough journey or navigate motherhood with real food and real talk.",
  },
};

export default async function StartHerePage() {
  const cookingPosts = (await getPostsByCategory("cooking")).slice(0, 3);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://halfpintmama.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Start Here",
        item: "https://halfpintmama.com/start-here",
      },
    ],
  };

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqSchema) }}
      />
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
          <div className="mb-6 md:mb-0"><ThemedIcon icon={Users} size="xl" color="deep-sage" /></div>
          <div>
            <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-3">
              A Little About Me
            </h2>
            <p className="text-charcoal/80 mb-4">
              I&apos;m a Pediatric ER RN and mama of three, sharing life&apos;s beautiful chaos with my kids and our chocolate lab Stout. I started this blog to get back to the basics: real food, simple recipes, and intentional living. Sourdough, family adventures, or honest motherhood, you&apos;ll find it all here.
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* From Scratch Kitchen Path */}
          <div id="kitchen" className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-terracotta">
              <div className="bg-gradient-to-br from-terracotta/10 to-soft-pink/10 p-8 text-center">
                <ThemedIcon icon={Wheat} size="xl" color="terracotta" />
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold text-charcoal mb-3">
                  From Scratch Kitchen
                </h3>
                <p className="text-charcoal/80 mb-6">
                  Ready to start your sourdough journey or looking for family-tested recipes? From creating your first starter to weeknight meals, all made from scratch.
                </p>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-charcoal text-sm uppercase tracking-wide">Start With:</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/posts/how-to-make-a-sourdough-starter-simple-no-scale" className="flex items-center gap-2 text-terracotta hover:text-deep-sage transition-colors">
                        <span>→</span> How to Create a Sourdough Starter
                      </Link>
                    </li>
                    <li>
                      <Link href="/cooking/sourdough" className="flex items-center gap-2 text-terracotta hover:text-deep-sage transition-colors">
                        <span>→</span> All Sourdough Recipes
                      </Link>
                    </li>
                    <li>
                      <Link href="/cooking" className="flex items-center gap-2 text-terracotta hover:text-deep-sage transition-colors">
                        <span>→</span> Browse All Recipes
                      </Link>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/free-guide"
                  className="block w-full text-center px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
                >
                  Get My Free Guides
                </Link>
              </div>
            </div>
          </div>

          {/* Mama Life Path */}
          <div id="mama-life" className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-sage">
              <div className="bg-gradient-to-br from-sage/10 to-light-sage/20 p-8 text-center">
                <ThemedIcon icon={Heart} size="xl" color="sage" />
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold text-charcoal mb-3">
                  Mama Life
                </h3>
                <p className="text-charcoal/80 mb-6">
                  Real talk about motherhood: the beautiful chaos, family adventures, the hard days, and everything in between. Parenting tips, honest reflections, DIY projects, and the stories that connect us.
                </p>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-charcoal text-sm uppercase tracking-wide">Start With:</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/posts/transitioning-from-one-to-two-kids-what-to-expect-and-how-to-prepare" className="flex items-center gap-2 text-deep-sage hover:text-charcoal transition-colors">
                        <span>→</span> Transitioning from One to Two Kids
                      </Link>
                    </li>
                    <li>
                      <Link href="/posts/a-winter-guide-to-banff-with-kids" className="flex items-center gap-2 text-deep-sage hover:text-charcoal transition-colors">
                        <span>→</span> A Winter Guide to Banff with Kids
                      </Link>
                    </li>
                    <li>
                      <Link href="/posts/homesteading-in-the-suburbs" className="flex items-center gap-2 text-deep-sage hover:text-charcoal transition-colors">
                        <span>→</span> Homesteading in the Suburbs
                      </Link>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/mama-life"
                  className="block w-full text-center px-6 py-2 text-deep-sage hover:text-charcoal font-medium transition-colors mt-3 text-sm"
                >
                  Browse Mama Life Posts &rarr;
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
                  ratingAverage={post.ratingAverage}
                  ratingCount={post.ratingCount}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ: every answer restates Keegan's published post content (the
          contact page points here for FAQs; FAQPage schema below matches this
          visible text, per Google's requirement). */}
      <section id="faq" className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 text-center">
          Sourdough Questions, Answered
        </h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group bg-white rounded-xl shadow-sm border border-warm-beige/60 overflow-hidden">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 font-semibold text-charcoal hover:text-terracotta transition-colors">
                {item.q}
                <span className="text-terracotta transition-transform group-open:rotate-45 text-xl leading-none" aria-hidden="true">+</span>
              </summary>
              <div className="px-5 pb-5 text-charcoal/80 text-sm leading-relaxed">
                {item.a}{" "}
                {item.link && (
                  item.external ? (
                    <a href={item.link.href} target="_blank" rel="sponsored nofollow noopener noreferrer" className="text-terracotta font-medium hover:underline">
                      {item.link.label} &rarr;
                    </a>
                  ) : (
                    <Link href={item.link.href} className="text-terracotta font-medium hover:underline">
                      {item.link.label} &rarr;
                    </Link>
                  )
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="gradient-cta rounded-2xl p-8 text-center text-white shadow-lg">
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl font-semibold mb-3">
            Join the Half Pint Community
          </h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Get my free Sourdough Starter Guide and Postpartum Freezer Prep Guide when you subscribe, plus first word on new recipes and honest mama moments!
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
