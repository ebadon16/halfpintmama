import { getPaginatedPostsBySubcategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { ThemedIcon } from "@/components/ThemedIcon";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";
import { Cookie } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "Desserts & Sweet Treats | Half Pint Mama",
  description: "Homemade dessert recipes including cookies, brownies, cakes, and chocolate treats. Family-tested sweet treats that are perfect for any occasion or holiday.",
  alternates: { canonical: "https://halfpintmama.com/cooking/desserts" },
  openGraph: {
    title: "Desserts & Sweet Treats | Half Pint Mama",
    description: "Homemade dessert recipes including cookies, brownies, cakes, and chocolate treats.",
    type: "website",
    url: "https://halfpintmama.com/cooking/desserts",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Desserts & Sweet Treats | Half Pint Mama",
    description: "Homemade dessert recipes including cookies, brownies, cakes, and chocolate treats.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function DessertsPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalPages } = await getPaginatedPostsBySubcategory(
    "cooking",
    ["cookie", "cake", "truffle", "chocolate", "cobbler", "macaroon", "dessert", "sweet", "twix", "cups", "egg"],
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
            { "@type": "ListItem", position: 3, name: "Desserts & Sweet Treats", item: "https://halfpintmama.com/cooking/desserts" },
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
          <Link href="/cooking/desserts" className="px-4 py-2 rounded-full bg-sage text-white font-semibold text-sm">
            Desserts
          </Link>
          <Link href="/cooking/snacks" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Snacks
          </Link>
        </div>

        <div className="mb-12">
          <ThemedIcon icon={Cookie} size="lg" color="terracotta" className="mb-4" />
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Desserts & Sweet Treats
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mb-6">
            Life is sweeter with homemade treats! Cookies, cakes, truffles, and more - all tested and approved
            by my little taste testers at home.
          </p>
          <SearchBar placeholder="Search dessert recipes..." className="max-w-md" />
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
              readingTime={post.readingTime}
              headingLevel="h2"
            />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-charcoal/60 py-12">
            No dessert recipes yet. Check back soon!
          </p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/cooking/desserts"
        />

        <HomeEmailSignup />
      </div>
    </div>
  );
}
