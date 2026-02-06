import { getPaginatedPosts, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";

export const revalidate = 3600;

export const metadata = {
  title: "All Posts | Half Pint Mama",
  description: "Browse all blog posts on Half Pint Mama. Find sourdough recipes, family travel guides, creative DIY projects, and honest parenting tips from a Pediatric RN mama.",
  alternates: { canonical: "https://halfpintmama.com/posts" },
  openGraph: {
    title: "All Posts | Half Pint Mama",
    description: "Browse all blog posts on Half Pint Mama. Sourdough recipes, travel guides, DIY projects, and parenting tips.",
    url: "https://halfpintmama.com/posts",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "All Posts | Half Pint Mama",
    description: "Browse all blog posts on Half Pint Mama. Sourdough recipes, travel guides, DIY projects, and parenting tips.",
  },
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
          All Posts
        </h1>
        <p className="text-charcoal/70 text-lg mb-6">
          {totalCount} recipes, guides, and stories
        </p>
        <SearchBar placeholder="Search all posts..." className="max-w-md mb-12" />

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
