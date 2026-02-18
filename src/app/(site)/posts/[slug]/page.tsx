import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getPostBySlug, getRelatedPostsByTags, getAdjacentPosts, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { ShareButtons } from "@/components/ShareButtons";
import dynamic from "next/dynamic";
import { PrintButton } from "@/components/PrintButton";
import { RecipeSchema, BlogPostSchema } from "@/components/RecipeSchema";
import { PostEmailSignup, BottomEmailCTA } from "@/components/PostEmailSignup";
import { FavoriteButton } from "@/components/FavoriteButton";

import { LazyComments } from "@/components/LazyComments";
const CommentsPreview = dynamic(() => import("@/components/Comments").then(m => m.CommentsPreview));
const RecipeCard = dynamic(() => import("@/components/RecipeCard").then(m => m.RecipeCard));
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import type { PortableTextBlock } from "@portabletext/react";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const categoryLabel = post.category === "cooking" ? "From Scratch Kitchen" : post.category === "mama-life" ? "Mama Life" : post.category;
  const description = post.excerpt || `${post.title} — a ${categoryLabel.toLowerCase()} post from Half Pint Mama.`;

  return {
    title: `${post.title} | Half Pint Mama`,
    description,
    alternates: {
      canonical: `https://halfpintmama.com/posts/${slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      url: `https://halfpintmama.com/posts/${slug}`,
      type: "article",
      images: post.image ? [post.image] : ["/logo.jpg"],
      siteName: "Half Pint Mama",
      authors: ["Keegan"],
      section: categoryLabel,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.image ? [post.image] : ["/logo.jpg"],
    },
    other: {
      "pinterest-rich-pin": "true",
    },
  };
}

const categoryLabels: Record<string, string> = {
  cooking: "From Scratch Kitchen",
  "mama-life": "Mama Life",
};

const categoryColors: Record<string, string> = {
  cooking: "bg-[#A56350]",
  "mama-life": "bg-deep-sage",
};

// Calculate reading time from Portable Text blocks
function calculateReadingTime(content: PortableTextBlock[]): number {
  const wordsPerMinute = 200;
  let wordCount = 0;

  for (const block of content) {
    if (block._type === "block" && Array.isArray(block.children)) {
      for (const child of block.children as { text?: string }[]) {
        if (child.text) {
          wordCount += child.text.trim().split(/\s+/).length;
        }
      }
    }
  }

  return Math.ceil(wordCount / wordsPerMinute);
}


export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const badgeColor = categoryColors[post.category] || "bg-sage";
  const categoryLabel = categoryLabels[post.category] || post.category;

  // Get related posts and adjacent posts in parallel
  const [relatedPosts, { prev: prevPost, next: nextPost }] = await Promise.all([
    getRelatedPostsByTags(slug, post.tags, post.category, 3),
    getAdjacentPosts(slug, post.category),
  ]);

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="bg-cream">
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://halfpintmama.com" },
              { "@type": "ListItem", position: 2, name: categoryLabel, item: `https://halfpintmama.com/${post.category}` },
              { "@type": "ListItem", position: 3, name: post.title, item: `https://halfpintmama.com/posts/${slug}` },
            ],
          }),
        }}
      />

      {/* Structured Data for SEO */}
      {post.category === "cooking" ? (
        <RecipeSchema
          title={post.title}
          description={post.excerpt}
          image={post.image}
          datePublished={post.date}
          slug={slug}
          recipe={post.recipe}
          ratingAverage={post.ratingAverage}
          ratingCount={post.ratingCount}
        />
      ) : (
        <BlogPostSchema
          title={post.title}
          description={post.excerpt}
          image={post.image}
          datePublished={post.date}
          slug={slug}
          category={categoryLabel}
          ratingAverage={post.ratingAverage}
          ratingCount={post.ratingCount}
        />
      )}

      <article className="max-w-2xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-charcoal/70">
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
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link
              href={`/${post.category}`}
              className={`inline-block px-3 py-1 ${badgeColor} text-white text-xs font-semibold rounded-full uppercase tracking-wide`}
            >
              {categoryLabel}
            </Link>
            {post.category === "cooking" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-light-sage/50 text-deep-sage text-xs font-semibold rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Nurse-Tested, Family-Approved
              </span>
            )}
          </div>

          <h1 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl text-charcoal font-semibold leading-tight mb-3">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
            <p className="text-deep-sage font-medium">
              {formatDate(post.date)}
            </p>
            <span className="text-charcoal/30">|</span>
            <p className="text-charcoal/70 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min read
            </p>
            {post.recipe?.totalTime && (
              <>
                <span className="text-charcoal/30">|</span>
                <p className="text-charcoal/70 flex items-center gap-1">
                  <svg className="w-4 h-4 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  {post.recipe.totalTime}
                </p>
              </>
            )}
          </div>

          {/* Share, Save & Recipe Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ShareButtons title={post.title} slug={slug} />
            <FavoriteButton slug={slug} title={post.title} showText={true} className="text-charcoal/70 hover:text-terracotta" />

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

        {/* Featured Image with Pin It overlay */}
        {post.image && (
          <div className="relative w-full h-48 md:h-64 mb-6 rounded-xl overflow-hidden group/pin">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 672px) 100vw, 672px"
            />
            {/* Pinterest Pin It hover overlay */}
            <a
              href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(`https://halfpintmama.com/posts/${slug}`)}&media=${encodeURIComponent(post.image)}&description=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pin this image on Pinterest"
              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover/pin:bg-black/30 opacity-0 group-hover/pin:opacity-100 transition-all duration-300"
            >
              <span className="flex items-center gap-2 px-4 py-2 bg-[#E60023] text-white text-sm font-semibold rounded-full shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
                Pin It
              </span>
            </a>
          </div>
        )}

        {/* Content */}
        <div
          className="prose max-w-none
            prose-headings:font-[family-name:var(--font-crimson)]
            prose-headings:font-bold
            prose-h1:text-[36px] prose-h1:text-[#4A3728] prose-h1:mb-[40px] prose-h1:mt-0
            prose-h2:text-[28px] prose-h2:text-charcoal prose-h2:mt-[48px] prose-h2:mb-[16px]
            prose-h3:text-[22px] prose-h3:text-charcoal prose-h3:mt-[32px] prose-h3:mb-[12px]
            prose-h4:text-[18px] prose-h4:text-charcoal prose-h4:mt-[24px] prose-h4:mb-[8px]
            prose-p:text-[16px] prose-p:text-charcoal/80 prose-p:leading-[1.6] prose-p:mb-[16px]
            prose-a:text-terracotta prose-a:no-underline hover:prose-a:underline
            prose-strong:text-charcoal prose-strong:font-semibold
            prose-ul:my-[16px] prose-ul:pl-5
            prose-li:text-[16px] prose-li:text-charcoal/80 prose-li:my-1 prose-li:leading-[1.6]
            prose-img:rounded-lg prose-img:shadow-sm"
        >
          <PortableTextRenderer value={post.content} />
        </div>

        {/* Recipe Card - for cooking posts with recipe data (at end of content) */}
        {post.category === "cooking" && post.recipe && (
          <>
            <RecipeCard recipe={post.recipe} title={post.title} image={post.image} />

            {/* "Made This?" CTA */}
            <div className="bg-gradient-to-r from-light-sage/30 to-warm-beige/30 rounded-xl p-5 mb-8 text-center border border-light-sage/50">
              <p className="font-[family-name:var(--font-crimson)] text-lg text-deep-sage font-semibold mb-1">
                Made this recipe?
              </p>
              <p className="text-charcoal/70 text-sm mb-3">
                I&apos;d love to know how it turned out! Your rating helps other mamas find the best recipes.
              </p>
              <a
                href="#comments-section"
                className="inline-flex items-center gap-2 px-5 py-2.5 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Rate & Review
              </a>
            </div>
          </>
        )}

        {/* Rate & Review CTA - Prominent placement after content */}
        <CommentsPreview
          postSlug={slug}
          category={post.category}
          initialRatingAverage={post.ratingAverage}
          initialRatingCount={post.ratingCount}
        />

        {/* Mid-Post Email Signup CTA */}
        <PostEmailSignup category={post.category} />

        {/* Post Navigation - Previous/Next */}
        {(prevPost || nextPost) && (
          <nav aria-label="Post navigation" className="mt-8 pt-6 border-t border-light-sage">
            <div className="grid grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  href={`/posts/${prevPost.slug}`}
                  className="group p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-light-sage/50"
                >
                  <span className="text-xs text-charcoal/70 uppercase tracking-wide">&larr; Previous</span>
                  <p className="font-[family-name:var(--font-crimson)] text-charcoal group-hover:text-terracotta transition-colors font-medium mt-1 line-clamp-2">
                    {prevPost.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  href={`/posts/${nextPost.slug}`}
                  className="group p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-light-sage/50 text-right"
                >
                  <span className="text-xs text-charcoal/70 uppercase tracking-wide">Next &rarr;</span>
                  <p className="font-[family-name:var(--font-crimson)] text-charcoal group-hover:text-terracotta transition-colors font-medium mt-1 line-clamp-2">
                    {nextPost.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        )}

        {/* Footer - Navigation */}
        <footer className="mt-6 pt-6 border-t border-light-sage">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link
              href="/posts"
              className="text-deep-sage hover:text-charcoal font-medium transition-colors"
            >
              &larr; All Posts
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
                  ratingAverage={relatedPost.ratingAverage}
                  ratingCount={relatedPost.ratingCount}
                  readingTime={relatedPost.readingTime}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comments Section — lazy-loaded on scroll */}
      <LazyComments
        postSlug={slug}
        postTitle={post.title}
        category={post.category}
        initialRatingAverage={post.ratingAverage}
        initialRatingCount={post.ratingCount}
      />

      {/* Want More? Join My List - Bottom CTA */}
      <BottomEmailCTA category={post.category} />
    </div>
  );
}
