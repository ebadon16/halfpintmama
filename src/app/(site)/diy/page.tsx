import { getPaginatedPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";

export const revalidate = 60;

export const metadata = {
  title: "DIY Projects | Half Pint Mama",
  description: "Step-by-step DIY tutorials for creative projects, Halloween costumes, party decorations, and family crafts. Budget-friendly ideas you can make at home.",
  alternates: { canonical: "https://halfpintmama.com/diy" },
  openGraph: {
    title: "DIY Projects | Half Pint Mama",
    description: "Step-by-step DIY tutorials for creative projects, Halloween costumes, and family crafts.",
    url: "https://halfpintmama.com/diy",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "DIY Projects | Half Pint Mama",
    description: "Step-by-step DIY tutorials for creative projects, Halloween costumes, and family crafts.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function DIYPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalPages } = await getPaginatedPostsByCategory("diy", currentPage);

  return (
    <div className="bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <span className="text-5xl mb-4 block">🎨</span>
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            DIY Projects
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mb-6">
            Crafts, costumes, and creative projects. From cardboard costumes to party decorations - making memories with our hands.
          </p>
          <SearchBar placeholder="Search DIY projects..." className="max-w-md" />
        </div>

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

        {posts.length === 0 && (
          <p className="text-center text-charcoal/60 py-12">
            No posts yet. Check back soon!
          </p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/diy"
        />
      </div>
    </div>
  );
}
