import { getPaginatedPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Plane } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Family Travel | Half Pint Mama",
  description: "Family travel guides and tips for adventures with toddlers and babies. Destination reviews, packing lists, and advice to make traveling with kids easier.",
  alternates: { canonical: "https://halfpintmama.com/travel" },
  openGraph: {
    title: "Family Travel | Half Pint Mama",
    description: "Family travel guides and tips for adventures with toddlers and babies.",
    url: "https://halfpintmama.com/travel",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Family Travel | Half Pint Mama",
    description: "Family travel guides and tips for adventures with toddlers and babies.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TravelPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalPages } = await getPaginatedPostsByCategory("travel", currentPage);

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://halfpintmama.com" },
            { "@type": "ListItem", position: 2, name: "Family Travel", item: "https://halfpintmama.com/travel" },
          ],
        }) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <ThemedIcon icon={Plane} size="lg" color="sage" />
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Family Travel
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mb-6">
            Adventures with toddlers and a baby! Tips for keeping little ones happy on the road and guides to family-friendly destinations.
          </p>
          <SearchBar placeholder="Search travel posts..." className="max-w-md" />
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
          basePath="/travel"
        />
      </div>
    </div>
  );
}
