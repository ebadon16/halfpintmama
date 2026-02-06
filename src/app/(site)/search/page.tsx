import { Suspense } from "react";
import { getAllTags } from "@/lib/posts";
import { SearchContent } from "./SearchContent";

export const revalidate = 60;

export const metadata = {
  title: "Search | Half Pint Mama",
  description: "Search for recipes, tips, and more across the blog.",
  alternates: { canonical: "https://halfpintmama.com/search" },
  openGraph: { images: ["/logo.jpg"] },
};

function SearchLoading() {
  return (
    <div className="text-center py-12">
      <div className="text-4xl animate-pulse">🔍</div>
      <p className="text-charcoal/70 mt-2">Loading...</p>
    </div>
  );
}

export default async function SearchPage() {
  const popularTags = await getAllTags();

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
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
