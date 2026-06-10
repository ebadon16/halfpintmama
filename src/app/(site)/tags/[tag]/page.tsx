import Link from "next/link";
import { getPaginatedPostsByTag, getTagPostCount, getAllTags, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";
import { notFound } from "next/navigation";
import { paginatedCanonical, paginatedTitle, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY, jsonLdHtml } from "@/lib/seo";

export const revalidate = 3600;

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params, searchParams }: TagPageProps) {
  const { tag } = await params;
  const { page } = await searchParams;
  const normalizedTag = decodeURIComponent(tag).toLowerCase();
  const currentPage = Math.max(1, parseInt(page || "1", 10));

  // If no posts match this tag, tell crawlers to skip (can't set 404 from page).
  const tagHasPosts = (await getTagPostCount(normalizedTag)) > 0;
  if (!tagHasPosts) {
    return {
      title: `Tag Not Found | Half Pint Mama`,
      robots: { index: false, follow: false },
    };
  }

  const baseTitle = `Posts tagged "${normalizedTag}" | Half Pint Mama`;
  const title = paginatedTitle(baseTitle, currentPage);
  const canonical = paginatedCanonical(`/tags/${encodeURIComponent(normalizedTag)}`, currentPage);
  const description = `Explore all Half Pint Mama posts tagged with "${normalizedTag}". Find recipes, parenting tips, DIY projects, and travel guides related to ${normalizedTag}.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
      title,
      description,
      type: "website" as const,
      url: canonical,
    },
    twitter: { images: [DEFAULT_OG_IMAGE.url], card: "summary" as const, title, description },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params;
  const { page } = await searchParams;
  const normalizedTag = decodeURIComponent(tag).toLowerCase();
  const encodedTag = encodeURIComponent(normalizedTag);
  const currentPage = parseInt(page || "1", 10);

  const { items: posts, totalCount, totalPages } = await getPaginatedPostsByTag(normalizedTag, currentPage);

  if (totalCount === 0) {
    notFound();
  }

  // Out-of-range pages render empty; 404 them so they aren't indexed as thin content.
  if (currentPage > 1 && posts.length === 0) notFound();

  return (
    <div className="bg-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://halfpintmama.com" },
            { "@type": "ListItem", position: 2, name: "Tags", item: "https://halfpintmama.com/tags" },
            { "@type": "ListItem", position: 3, name: normalizedTag, item: `https://halfpintmama.com/tags/${encodedTag}` },
          ],
        }) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/tags"
            className="text-terracotta hover:text-deep-sage transition-colors mb-4 inline-block"
          >
            &larr; All Tags
          </Link>
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
            <span className="text-charcoal/80">#</span>
            <span className="capitalize">{normalizedTag}</span>
          </h1>
          <p className="text-charcoal/80">
            {totalCount} post{totalCount !== 1 ? "s" : ""} tagged with &quot;{normalizedTag}&quot;
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              date={formatDate(post.date)}
              image={post.image}
              tags={post.tags}
              ratingAverage={post.ratingAverage}
              ratingCount={post.ratingCount}
              headingLevel="h2"
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/tags/${encodedTag}`}
        />

        <HomeEmailSignup />
      </div>
    </div>
  );
}
