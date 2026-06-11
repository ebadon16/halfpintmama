import { notFound } from "next/navigation";
import { getPaginatedPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { ThemedIcon } from "@/components/ThemedIcon";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";
import { Heart } from "lucide-react";
import Link from "next/link";
import { jsonLdHtml, paginatedCanonical, paginatedTitle, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const title = paginatedTitle("Mama Life | Half Pint Mama", currentPage);
  const canonical = paginatedCanonical("/mama-life", currentPage);
  const description = "Honest parenting tips, family adventures, and real talk about motherhood from a Pediatric ER RN and mama of three. Navigate the beautiful chaos together.";
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

export default async function MamaLifePage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalPages } = await getPaginatedPostsByCategory("mama-life", currentPage);

  // Out-of-range pages render empty; 404 them so they aren't indexed as thin content.
  if (currentPage > 1 && posts.length === 0) notFound();

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdHtml({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://halfpintmama.com" },
            { "@type": "ListItem", position: 2, name: "Mama Life", item: "https://halfpintmama.com/mama-life" },
          ],
        }) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Subcategory Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link href="/mama-life" className="px-4 py-2 rounded-full bg-sage text-white font-semibold text-sm">
            All Posts
          </Link>
          <Link href="/mama-life/parenting" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Parenting
          </Link>
          <Link href="/mama-life/travel" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Travel
          </Link>
          <Link href="/mama-life/diy" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            DIY
          </Link>
          <Link href="/mama-life/homesteading" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Homesteading
          </Link>
        </div>

        <div className="mb-12">
          <ThemedIcon icon={Heart} size="lg" color="deep-sage" className="mb-4" />
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Mama Life
          </h1>
          <p className="text-charcoal/80 text-lg max-w-2xl mb-4">
            Real talk about motherhood: the beautiful chaos, family adventures, the hard days, and everything in between. Parenting tips, honest reflections, and the stories that connect us.
          </p>
          {(() => {
            const rated = posts.filter((p) => p.ratingCount && p.ratingCount > 0);
            if (rated.length === 0) return null;
            const avg = rated.reduce((sum, p) => sum + (p.ratingAverage || 0), 0) / rated.length;
            return (
              <p className="text-charcoal/80 text-sm mb-6">
                <span className="text-yellow-500">★</span> {rated.length} post{rated.length !== 1 ? "s" : ""} rated {avg.toFixed(1)} average
              </p>
            );
          })()}
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
              headingLevel="h2"
            />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-charcoal/80 py-12">
            No posts yet. Check back soon!
          </p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/mama-life"
        />

        <HomeEmailSignup segment="mama-life" />
      </div>
    </div>
  );
}
