import Link from "next/link";
import { getPaginatedPostsByTag, getAllTags, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const description = `Explore all Half Pint Mama posts tagged with "${decodedTag}". Find recipes, parenting tips, DIY projects, and travel guides related to ${decodedTag}.`;
  return {
    title: `Posts tagged "${decodedTag}" | Half Pint Mama`,
    description,
    alternates: {
      canonical: `/tags/${tag}`,
    },
    openGraph: {
      title: `Posts tagged "${decodedTag}" | Half Pint Mama`,
      description,
      images: ["/logo.jpg"],
    },
    twitter: {
      card: "summary" as const,
      title: `Posts tagged "${decodedTag}" | Half Pint Mama`,
      description,
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params;
  const { page } = await searchParams;
  const decodedTag = decodeURIComponent(tag);
  const currentPage = parseInt(page || "1", 10);

  const { items: posts, totalCount, totalPages } = await getPaginatedPostsByTag(decodedTag, currentPage);

  if (totalCount === 0) {
    notFound();
  }

  return (
    <div className="bg-cream min-h-screen">
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
            <span className="text-charcoal/50">#</span>
            <span className="capitalize">{decodedTag}</span>
          </h1>
          <p className="text-charcoal/70">
            {totalCount} post{totalCount !== 1 ? "s" : ""} tagged with &quot;{decodedTag}&quot;
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
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/tags/${tag}`}
        />
      </div>
    </div>
  );
}
