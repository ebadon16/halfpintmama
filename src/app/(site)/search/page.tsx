import { Suspense } from "react";
import { getAllTags } from "@/lib/posts";
import { SearchContent } from "./SearchContent";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Search } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Search | Half Pint Mama",
  description: "Search Half Pint Mama for sourdough recipes, family travel guides, DIY projects, and parenting tips. Find the content you're looking for across all categories.",
  alternates: { canonical: "https://halfpintmama.com/search" },
  openGraph: {
    title: "Search | Half Pint Mama",
    description: "Search Half Pint Mama for sourdough recipes, family travel guides, DIY projects, and parenting tips.",
    url: "https://halfpintmama.com/search",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Search | Half Pint Mama",
    description: "Search Half Pint Mama for sourdough recipes, family travel guides, DIY projects, and parenting tips.",
  },
};

function SearchLoading() {
  return (
    <div className="text-center py-12">
      <ThemedIcon icon={Search} size="md" color="charcoal" animate="animate-pulse" />
      <p className="text-charcoal/70 mt-2">Loading...</p>
    </div>
  );
}

export default async function SearchPage() {
  const popularTags = await getAllTags();

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
            Search
          </h1>
          <p className="text-charcoal/70">
            Find recipes, tips, and more across the blog
          </p>
        </div>

        <Suspense fallback={<SearchLoading />}>
          <SearchContent popularTags={popularTags} />
        </Suspense>
      </div>
    </div>
  );
}
