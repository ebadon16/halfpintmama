import Link from "next/link";
import { getAllTags } from "@/lib/posts";
import { ThemedIcon } from "@/components/ThemedIcon";
import { HomeEmailSignup } from "@/components/HomeEmailSignup";
import { Tag } from "lucide-react";

export const revalidate = 3600;

export const metadata = {
  title: "Tags | Half Pint Mama",
  description: "Browse all blog posts by topic tags on Half Pint Mama. Find sourdough recipes, family travel tips, DIY crafts, and parenting content organized by keyword.",
  alternates: { canonical: "https://halfpintmama.com/tags" },
  openGraph: {
    title: "Tags | Half Pint Mama",
    description: "Browse all blog posts by topic tags on Half Pint Mama.",
    type: "website",
    url: "https://halfpintmama.com/tags",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Tags | Half Pint Mama",
    description: "Browse all blog posts by topic tags on Half Pint Mama.",
  },
};

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
            Browse by Tag
          </h1>
          <p className="text-charcoal/70">
            Find posts by topic across all categories
          </p>
        </div>

        {/* Tags Cloud */}
        {tags.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3">
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-charcoal hover:text-terracotta group"
              >
                <span className="capitalize">{tag}</span>
                <span className="ml-2 text-sm text-charcoal/50 group-hover:text-terracotta/70">
                  ({count})
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="flex justify-center mb-4"><ThemedIcon icon={Tag} size="xl" color="sage" /></div>
            <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-2">
              No tags yet
            </h2>
            <p className="text-charcoal/70 mb-6">
              Tags will appear here as posts are tagged.
            </p>
            <Link
              href="/posts"
              className="text-terracotta font-medium hover:text-deep-sage transition-colors"
            >
              Browse all posts &rarr;
            </Link>
          </div>
        )}

        <HomeEmailSignup />
      </div>
    </div>
  );
}
