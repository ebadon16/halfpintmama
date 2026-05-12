import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Search | Half Pint Mama",
  description: "Search Half Pint Mama for sourdough recipes, family travel guides, DIY projects, and parenting tips. Find the content you're looking for across all categories.",
  alternates: { canonical: "https://halfpintmama.com/search" },
  robots: { index: false, follow: true },
  openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Search | Half Pint Mama",
    description: "Search Half Pint Mama for sourdough recipes, family travel guides, DIY projects, and parenting tips.",
    type: "website",
    url: "https://halfpintmama.com/search",
  },
  twitter: {
      images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image",
    title: "Search | Half Pint Mama",
    description: "Search Half Pint Mama for sourdough recipes, family travel guides, DIY projects, and parenting tips.",
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
