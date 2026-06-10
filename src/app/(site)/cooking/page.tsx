import { notFound } from "next/navigation";
import { getPaginatedPostsByCategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { ThemedIcon } from "@/components/ThemedIcon";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";
import { Wheat } from "lucide-react";
import Link from "next/link";
import { jsonLdHtml, paginatedCanonical, paginatedTitle, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const title = paginatedTitle("From Scratch Kitchen | Half Pint Mama", currentPage);
  const canonical = paginatedCanonical("/cooking", currentPage);
  const description = "Sourdough recipes, discard ideas, healthy snacks, and from-scratch baking from a bread-obsessed mama. Easy homemade recipes your whole family will love.";
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

export default async function CookingPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalPages } = await getPaginatedPostsByCategory("cooking", currentPage);

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
            { "@type": "ListItem", position: 2, name: "From Scratch Kitchen", item: "https://halfpintmama.com/cooking" },
          ],
        }) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* My Saved Recipes Button */}
        <div className="flex justify-center mb-6">
          <Link
            href="/favorites"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta text-white font-semibold rounded-full hover:bg-terracotta/90 transition-all shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            My Saved Recipes
          </Link>
        </div>

        {/* Subcategory Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link href="/cooking" className="px-4 py-2 rounded-full bg-sage text-white font-semibold text-sm">
            All Recipes
          </Link>
          <Link href="/cooking/sourdough" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Sourdough
          </Link>
          <Link href="/cooking/discard" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Discard Recipes
          </Link>
          <Link href="/cooking/desserts" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Desserts
          </Link>
          <Link href="/cooking/snacks" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Snacks
          </Link>
        </div>

        <div className="mb-12">
          <ThemedIcon icon={Wheat} size="lg" color="terracotta" className="mb-4" />
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            From Scratch Kitchen
          </h1>
          <p className="text-charcoal/80 text-lg max-w-2xl mb-4">
            Every recipe here is nurse-tested and family-approved, made from real ingredients with the same thoughtfulness I bring to patient care. From sourdough starters to healthy snacks, these are the meals I actually feed my family.
          </p>
          {(() => {
            const rated = posts.filter((p) => p.ratingCount && p.ratingCount > 0);
            if (rated.length === 0) return null;
            const avg = rated.reduce((sum, p) => sum + (p.ratingAverage || 0), 0) / rated.length;
            return (
              <p className="text-charcoal/80 text-sm mb-6">
                <span className="text-yellow-500">★</span> {rated.length} recipe{rated.length !== 1 ? "s" : ""} rated {avg.toFixed(1)} average
              </p>
            );
          })()}
          <SearchBar placeholder="Search recipes..." className="max-w-md" />
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
          basePath="/cooking"
        />

        <HomeEmailSignup />
      </div>
    </div>
  );
}
