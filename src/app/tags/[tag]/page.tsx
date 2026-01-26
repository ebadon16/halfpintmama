import Link from "next/link";
import { getPostsByTag, getAllTags, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { notFound } from "next/navigation";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `Posts tagged "${decodedTag}" | Half Pint Mama`,
    description: `Browse all posts tagged with "${decodedTag}"`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
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
            {posts.length} post{posts.length !== 1 ? "s" : ""} tagged with &quot;{decodedTag}&quot;
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
