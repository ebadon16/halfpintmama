import { getPaginatedPostsBySubcategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { ThemedIcon } from "@/components/ThemedIcon";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";
import { Scissors } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "DIY & Crafts | Half Pint Mama",
  description: "Fun DIY projects, kid costumes, seasonal garlands, and creative crafts for families. Simple ideas that make your home feel special.",
  alternates: { canonical: "https://halfpintmama.com/mama-life/diy" },
  openGraph: {
    title: "DIY & Crafts | Half Pint Mama",
    description: "Fun DIY projects, kid costumes, and creative crafts for families.",
    url: "https://halfpintmama.com/mama-life/diy",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "DIY & Crafts | Half Pint Mama",
    description: "Fun DIY projects, kid costumes, and creative crafts for families.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function DiyPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalPages } = await getPaginatedPostsBySubcategory(
    "mama-life",
    ["costume", "garland", "diy", "craft", "mirror"],
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
            { "@type": "ListItem", position: 2, name: "Mama Life", item: "https://halfpintmama.com/mama-life" },
            { "@type": "ListItem", position: 3, name: "DIY & Crafts", item: "https://halfpintmama.com/mama-life/diy" },
          ],
        }) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Subcategory Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link href="/mama-life" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            All Posts
          </Link>
          <Link href="/mama-life/parenting" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Parenting
          </Link>
          <Link href="/mama-life/travel" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Travel
          </Link>
          <Link href="/mama-life/diy" className="px-4 py-2 rounded-full bg-sage text-white font-semibold text-sm">
            DIY
          </Link>
          <Link href="/mama-life/homesteading" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            Homesteading
          </Link>
        </div>

        <div className="mb-12">
          <ThemedIcon icon={Scissors} size="lg" color="terracotta" className="mb-4" />
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            DIY & Crafts
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mb-6">
            Creative projects that make your home feel special. Kid costumes, seasonal decorations, and simple crafts you can actually pull off with littles underfoot.
          </p>
          <SearchBar placeholder="Search DIY posts..." className="max-w-md" />
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
            No DIY posts yet. Check back soon!
          </p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/mama-life/diy"
        />

        <HomeEmailSignup segment="mama-life" />
      </div>
    </div>
  );
}
