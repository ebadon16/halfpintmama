import { getPaginatedPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Heart } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Mama Life | Half Pint Mama",
  description: "Honest parenting tips and real talk about motherhood from a Pediatric ER RN and mama of two. Navigate the beautiful chaos of life with toddlers and babies.",
  alternates: { canonical: "https://halfpintmama.com/mama-life" },
  openGraph: {
    title: "Mama Life | Half Pint Mama",
    description: "Honest parenting tips and real talk about motherhood from a Pediatric ER RN and mama of two.",
    url: "https://halfpintmama.com/mama-life",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Mama Life | Half Pint Mama",
    description: "Honest parenting tips and real talk about motherhood from a Pediatric ER RN and mama of two.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function MamaLifePage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalPages } = await getPaginatedPostsByCategory("mama-life", currentPage);

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://halfpintmama.com" },
            { "@type": "ListItem", position: 2, name: "Mama Life", item: "https://halfpintmama.com/mama-life" },
          ],
        }) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <ThemedIcon icon={Heart} size="lg" color="deep-sage" className="mb-4" />
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Mama Life
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mb-6">
            Real talk about motherhood - the beautiful chaos, the hard days, and everything in between. Tips, thoughts, and honest reflections.
          </p>
          <SearchBar placeholder="Search mama life posts..." className="max-w-md" />
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
          basePath="/mama-life"
        />
      </div>
    </div>
  );
}
