import { getPaginatedPostsBySubcategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { ThemedIcon } from "@/components/ThemedIcon";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";
import { Sandwich } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "Snacks & Finger Foods | Half Pint Mama",
  description: "Healthy homemade snacks perfect for kids and the whole family. Easy recipes for crackers, granola, popsicles, and finger foods for lunchboxes and on-the-go.",
  alternates: { canonical: "https://halfpintmama.com/cooking/snacks" },
  openGraph: {
    title: "Snacks & Finger Foods | Half Pint Mama",
    description: "Healthy homemade snacks perfect for kids and the whole family.",
    type: "website",
    url: "https://halfpintmama.com/cooking/snacks",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Snacks & Finger Foods | Half Pint Mama",
    description: "Healthy homemade snacks perfect for kids and the whole family.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function SnacksPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalPages } = await getPaginatedPostsBySubcategory(
    "cooking",
    ["cracker", "snack", "roll-up", "roll up", "granola", "popsicle", "bite", "pinwheel"],
    [],
    currentPage
  );

  return (
    <div className="bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://halfpintmama.com" },
            { "@type": "ListItem", position: 2, name: "Cooking & Baking", item: "https://halfpintmama.com/cooking" },
            { "@type": "ListItem", position: 3, name: "Snacks & Finger Foods", item: "https://halfpintmama.com/cooking/snacks" },
          ],
        }) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Subcategory Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link href="/cooking" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
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
          <Link href="/cooking/snacks" className="px-4 py-2 rounded-full bg-sage text-white font-semibold text-sm">
            Snacks
          </Link>
        </div>

        <div className="mb-12">
          <ThemedIcon icon={Sandwich} size="lg" color="terracotta" className="mb-4" />
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Snacks & Finger Foods
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mb-6">
            Healthy, homemade snacks that even the pickiest eaters will love. Perfect for lunchboxes, road trips,
            or afternoon munchies.
          </p>
          <SearchBar placeholder="Search snack recipes..." className="max-w-md" />
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
          <p className="text-center text-charcoal/60 py-12">
            No snack recipes yet. Check back soon!
          </p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/cooking/snacks"
        />

        <HomeEmailSignup />
      </div>
    </div>
  );
}
