import { getPaginatedPostsBySubcategory, formatDate } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { ThemedIcon } from "@/components/ThemedIcon";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";
import { Baby } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "Parenting | Half Pint Mama",
  description: "Honest parenting tips from a Pediatric ER RN and mama of two. Real talk about toddlers, babies, breastfeeding, and navigating the beautiful chaos of motherhood.",
  alternates: { canonical: "https://halfpintmama.com/mama-life/parenting" },
  openGraph: {
    title: "Parenting | Half Pint Mama",
    description: "Honest parenting tips from a Pediatric ER RN and mama of two.",
    url: "https://halfpintmama.com/mama-life/parenting",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Parenting | Half Pint Mama",
    description: "Honest parenting tips from a Pediatric ER RN and mama of two.",
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ParentingPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const { items: posts, totalPages } = await getPaginatedPostsBySubcategory(
    "mama-life",
    ["kids", "toddler", "baby", "breast", "transition"],
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
            { "@type": "ListItem", position: 3, name: "Parenting", item: "https://halfpintmama.com/mama-life/parenting" },
          ],
        }) }}
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Subcategory Navigation */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link href="/mama-life" className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all">
            All Posts
          </Link>
          <Link href="/mama-life/parenting" className="px-4 py-2 rounded-full bg-sage text-white font-semibold text-sm">
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
          <ThemedIcon icon={Baby} size="lg" color="deep-sage" className="mb-4" />
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            Parenting
          </h1>
          <p className="text-charcoal/70 text-lg max-w-2xl mb-6">
            Real talk about raising littles — from a Pediatric ER RN who gets it. Toddler tips, baby milestones, breastfeeding, and the honest moments that connect us.
          </p>
          <SearchBar placeholder="Search parenting posts..." className="max-w-md" />
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
            />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-charcoal/60 py-12">
            No parenting posts yet. Check back soon!
          </p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/mama-life/parenting"
        />

        <HomeEmailSignup segment="mama-life" />
      </div>
    </div>
  );
}
