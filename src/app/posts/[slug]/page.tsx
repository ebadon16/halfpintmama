import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getPostBySlug, getPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Half Pint Mama`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

const categoryLabels: Record<string, string> = {
  cooking: "Cooking & Baking",
  travel: "Travel",
  diy: "DIY",
  "mama-life": "Mama Life",
};

const categoryColors: Record<string, string> = {
  cooking: "bg-terracotta",
  travel: "bg-sage",
  diy: "bg-soft-pink",
  "mama-life": "bg-deep-sage",
};

// Product recommendations based on category
const categoryProducts: Record<string, Array<{ name: string; note: string; link: string }>> = {
  cooking: [
    { name: "Kitchen Scale", note: "Essential for baking", link: "#" },
    { name: "Dutch Oven", note: "Perfect crust every time", link: "#" },
    { name: "Proofing Basket", note: "Beautiful loaves", link: "#" },
  ],
  travel: [
    { name: "Travel Stroller", note: "One-hand fold", link: "#" },
    { name: "Packing Cubes", note: "Stay organized", link: "#" },
    { name: "Portable Sound Machine", note: "Sleep anywhere", link: "#" },
  ],
  diy: [
    { name: "Craft Scissors", note: "Quality matters", link: "#" },
    { name: "Hot Glue Gun", note: "Craft essential", link: "#" },
    { name: "Cardboard Cutter", note: "Clean cuts", link: "#" },
  ],
  "mama-life": [
    { name: "Baby Monitor", note: "Peace of mind", link: "#" },
    { name: "Sound Machine", note: "Better sleep", link: "#" },
    { name: "Toddler Plates", note: "No-spill meals", link: "#" },
  ],
};

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const badgeColor = categoryColors[post.category] || "bg-sage";
  const categoryLabel = categoryLabels[post.category] || post.category;
  const products = categoryProducts[post.category] || categoryProducts.cooking;

  // Get related posts from same category, excluding current post
  const relatedPosts = getPostsByCategory(post.category)
    .filter(p => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="bg-cream">
      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8">
          <Link
            href={`/${post.category}`}
            className={`inline-block px-3 py-1 ${badgeColor} text-white text-xs font-semibold rounded-full uppercase tracking-wide mb-4`}
          >
            {categoryLabel}
          </Link>

          <h1 className="font-[family-name:var(--font-crimson)] text-3xl md:text-4xl lg:text-5xl text-charcoal font-semibold leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-sage font-medium">
            {formatDate(post.date)}
          </p>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-[family-name:var(--font-crimson)]
            prose-headings:text-charcoal
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-charcoal/80 prose-p:leading-relaxed
            prose-a:text-terracotta prose-a:no-underline hover:prose-a:underline
            prose-strong:text-charcoal
            prose-ul:my-4 prose-li:text-charcoal/80
            prose-img:rounded-xl prose-img:shadow-md"
        >
          {/* Simple markdown rendering - convert basic markdown to HTML */}
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
        </div>

        {/* Mid-Post Email Signup CTA */}
        <div className="my-10 p-6 bg-gradient-to-br from-light-sage/30 to-warm-beige/30 rounded-2xl">
          <div className="flex items-start gap-4">
            <span className="text-4xl">📬</span>
            <div className="flex-1">
              <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2">
                Enjoying this post?
              </h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Get more recipes, tips, and real mom moments delivered to your inbox weekly. Plus a free sourdough starter guide!
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-full border-2 border-sage focus:outline-none focus:border-deep-sage text-sm"
                />
                <button className="px-4 py-2 gradient-cta text-white font-semibold rounded-full text-sm hover:shadow-md transition-all whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Mentioned / Related Products */}
        <div className="my-10 p-6 bg-white rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal">
              Products I Recommend
            </h3>
            <Link href="/products" className="text-terracotta text-sm hover:text-deep-sage transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {products.map((product, i) => (
              <a
                key={i}
                href={product.link}
                className="text-center p-3 bg-cream rounded-xl hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-warm-beige/50 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-2xl">🛒</span>
                </div>
                <h4 className="text-xs font-medium text-charcoal group-hover:text-terracotta transition-colors line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-xs text-sage mt-1">{product.note}</p>
              </a>
            ))}
          </div>
          <p className="text-xs text-charcoal/50 mt-4 text-center">
            As an Amazon Associate, I earn from qualifying purchases.
          </p>
        </div>

        {/* Footer - Navigation */}
        <footer className="mt-12 pt-8 border-t border-light-sage">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link
              href="/posts"
              className="text-sage hover:text-deep-sage font-medium transition-colors"
            >
              ← All Posts
            </Link>
            <Link
              href={`/${post.category}`}
              className="px-4 py-2 border-2 border-sage text-deep-sage font-semibold rounded-full hover:bg-sage hover:text-white transition-all"
            >
              More {categoryLabel}
            </Link>
          </div>
        </footer>
      </article>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-6 text-center">
              You Might Also Like
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <PostCard
                  key={relatedPost.slug}
                  slug={relatedPost.slug}
                  title={relatedPost.title}
                  excerpt={relatedPost.excerpt}
                  category={relatedPost.category}
                  date={formatDate(relatedPost.date)}
                  image={relatedPost.image}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Want More? Join My List - Bottom CTA */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="gradient-cta rounded-2xl p-8 text-center text-white shadow-lg">
            <span className="text-5xl block mb-4">💌</span>
            <h2 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold mb-2">
              Want More? Join My List!
            </h2>
            <p className="text-white/90 mb-6 max-w-md mx-auto">
              Weekly recipes, honest mom moments, and exclusive content. Plus get my free sourdough starter guide when you subscribe!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 rounded-full text-charcoal border-2 border-white/80 focus:outline-none focus:border-white"
              />
              <button className="px-6 py-3 bg-deep-sage text-white font-semibold rounded-full hover:bg-charcoal transition-colors whitespace-nowrap">
                Join Free
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Simple markdown to HTML converter
function renderMarkdown(content: string): string {
  return content
    // Escape HTML entities first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Then restore markdown image/link syntax that got escaped
    .replace(/!\[\]\(([^)]+)\)/g, '<img src="$1" alt="" class="w-full rounded-xl my-4" />')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-xl my-4" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Headers
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive li tags in ul
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Paragraphs - wrap lines that aren't already wrapped
    .replace(/^(?!<[hulo]|<img|<a)(.+)$/gm, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p>\s*<\/p>/g, '')
    // Fix nested tags
    .replace(/<p>(<h[1-4]>)/g, '$1')
    .replace(/(<\/h[1-4]>)<\/p>/g, '$1')
    .replace(/<p>(<ul>)/g, '$1')
    .replace(/(<\/ul>)<\/p>/g, '$1')
    .replace(/<p>(<img)/g, '$1')
    .replace(/(\/?>)<\/p>/g, '$1');
}
