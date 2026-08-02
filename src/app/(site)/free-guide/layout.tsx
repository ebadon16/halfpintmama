import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Sourdough Starter Guide + Freezer Prep Guide | Half Pint Mama",
  description: "Get your free sourdough starter guide with day-by-day instructions, troubleshooting tips, and 4 beginner recipes, plus a free Postpartum Freezer Prep Guide for subscribers.",
  alternates: { canonical: "https://halfpintmama.com/free-guide" },
  openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Free Sourdough Starter Guide + Freezer Prep Guide | Half Pint Mama",
    description: "Two free guides: the sourdough starter guide with day-by-day instructions and 4 beginner recipes, plus the Postpartum Freezer Prep Guide.",
    url: "https://halfpintmama.com/free-guide",
  },
  twitter: {
      images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image",
    title: "Free Sourdough Starter Guide + Freezer Prep Guide | Half Pint Mama",
    description: "Two free guides: the sourdough starter guide with day-by-day instructions and 4 beginner recipes, plus the Postpartum Freezer Prep Guide.",
  },
};

export default function FreeGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
