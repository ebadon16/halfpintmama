import { getPaginatedPosts, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";

export const revalidate = 60;

export const metadata = {
  title: "All Posts | Half Pint Mama",
  description: "Browse all recipes, travel guides, DIY projects, and mama life posts.",
  alternates: { canonical: "https://halfpintmama.com/posts" },
  openGraph: { images: ["/logo.jpg"] },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PostsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalCount, totalPages } = await getPaginatedPosts(currentPage);

  return (
    <div className="bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
          All Posts
        </h1>
        <p className="text-charcoal/70 text-lg mb-6">
          {totalCount} recipes, guides, and stories
        </p>
        <SearchBar placeholder="Search all posts..." className="max-w-md mb-12" />

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
              ratingAverage={post.ratingAverage}
              ratingCount={post.ratingCount}
            />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/posts"
        />
      </div>
    </div>
  );
}
