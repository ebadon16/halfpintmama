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
import { FavoriteButton } from "@/components/FavoriteButton";
import { RecipeCard } from "@/components/RecipeCard";

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

      <article className="max-w-2xl mx-auto px-4 py-8">
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
        <header className="mb-6">
          <Link
            href={`/${post.category}`}
            className={`inline-block px-3 py-1 ${badgeColor} text-white text-xs font-semibold rounded-full uppercase tracking-wide mb-3`}
          >
            {categoryLabel}
          </Link>

          <h1 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl text-charcoal font-semibold leading-tight mb-3">
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

          {/* Share, Save & Recipe Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ShareButtons title={post.title} slug={slug} />
            <FavoriteButton slug={slug} title={post.title} showText={true} className="text-charcoal/60 hover:text-terracotta" />

            {/* Recipe Action Buttons - Pill style, aligned left */}
            {post.category === "cooking" && (
              <div className="flex flex-wrap items-center gap-2">
                {post.recipe && (
                  <a
                    href="#recipe-card"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-charcoal bg-cream border-2 border-terracotta rounded-full hover:bg-terracotta hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Jump to Recipe
                  </a>
                )}
                <a
                  href="#comments-section"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-charcoal bg-cream border-2 border-sage rounded-full hover:bg-sage hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Rate & Review
                </a>
                <PrintButton title={post.title} />
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden">
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
          className="prose prose-base max-w-none
            prose-headings:font-[family-name:var(--font-crimson)]
            prose-headings:text-charcoal
            prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:font-semibold
            prose-h3:text-lg prose-h3:mt-5 prose-h3:mb-2 prose-h3:font-semibold
            prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2 prose-h4:font-semibold
            prose-p:text-charcoal/80 prose-p:leading-relaxed prose-p:my-3
            prose-a:text-terracotta prose-a:no-underline hover:prose-a:underline
            prose-strong:text-charcoal prose-strong:font-semibold
            prose-ul:my-3 prose-ul:pl-5
            prose-li:text-charcoal/80 prose-li:my-1
            prose-img:rounded-lg prose-img:shadow-sm"
        >
          {/* Simple markdown rendering - convert basic markdown to HTML */}
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
        </div>

        {/* Recipe Card - for cooking posts with recipe data (at end of content) */}
        {post.category === "cooking" && post.recipe && (
          <RecipeCard recipe={post.recipe} title={post.title} />
        )}

        {/* Rate & Review CTA - Prominent placement after content */}
        <CommentsPreview postSlug={slug} />

        {/* Mid-Post Email Signup CTA */}
        <PostEmailSignup />

        {/* Footer - Navigation */}
        <footer className="mt-8 pt-6 border-t border-light-sage">
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
    // Images: centered, max-width constrained, smaller
    .replace(/!\[\]\(([^)]+)\)/g, '<figure class="my-4 flex justify-center"><img src="$1" alt="" class="max-w-sm md:max-w-md rounded-lg shadow-sm" /></figure>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="my-4 flex justify-center"><img src="$2" alt="$1" class="max-w-sm md:max-w-md rounded-lg shadow-sm" /></figure>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-terracotta font-medium hover:underline">$1</a>')
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
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul class="space-y-1">$&</ul>')
    // Paragraphs - wrap lines that aren't already wrapped
    .replace(/^(?!<[hulo]|<fig|<a)(.+)$/gm, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p>\s*<\/p>/g, '')
    // Fix nested tags
    .replace(/<p>(<h[1-4]>)/g, '$1')
    .replace(/(<\/h[1-4]>)<\/p>/g, '$1')
    .replace(/<p>(<ul)/g, '$1')
    .replace(/(<\/ul>)<\/p>/g, '$1')
    .replace(/<p>(<figure)/g, '$1')
    .replace(/(<\/figure>)<\/p>/g, '$1');
}
