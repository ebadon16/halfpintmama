import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getPostBySlug, getPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { ShareButtons } from "@/components/ShareButtons";
import { Comments, CommentsPreview } from "@/components/Comments";
import { PrintButton } from "@/components/PrintButton";
import { RecipeSchema, BlogPostSchema } from "@/components/RecipeSchema";
import { PostEmailSignup, BottomEmailCTA } from "@/components/PostEmailSignup";

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

// Calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}


export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const badgeColor = categoryColors[post.category] || "bg-sage";
  const categoryLabel = categoryLabels[post.category] || post.category;

  // Get related posts from same category, excluding current post
  const relatedPosts = getPostsByCategory(post.category)
    .filter(p => p.slug !== slug)
    .slice(0, 3);

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="bg-cream">
      {/* Structured Data for SEO */}
      {post.category === "cooking" ? (
        <RecipeSchema
          title={post.title}
          description={post.excerpt}
          image={post.image}
          datePublished={post.date}
          slug={slug}
        />
      ) : (
        <BlogPostSchema
          title={post.title}
          description={post.excerpt}
          image={post.image}
          datePublished={post.date}
          slug={slug}
          category={categoryLabel}
        />
      )}

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-charcoal/60">
            <li>
              <Link href="/" className="hover:text-terracotta transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${post.category}`} className="hover:text-terracotta transition-colors">
                {categoryLabel}
              </Link>
            </li>
            <li>/</li>
            <li className="text-charcoal/80 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

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

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <p className="text-sage font-medium">
              {formatDate(post.date)}
            </p>
            <span className="hidden sm:block text-charcoal/30">|</span>
            <p className="text-charcoal/60 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min read
            </p>
          </div>

          {/* Share & Print Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <ShareButtons title={post.title} slug={slug} />
            {post.category === "cooking" && (
              <PrintButton title={post.title} />
            )}
          </div>
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

        {/* Rate & Review CTA - Prominent placement after content */}
        <CommentsPreview postSlug={slug} />

        {/* Mid-Post Email Signup CTA */}
        <PostEmailSignup />

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

      {/* Comments Section */}
      <Comments postSlug={slug} />

      {/* Want More? Join My List - Bottom CTA */}
      <BottomEmailCTA />
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
