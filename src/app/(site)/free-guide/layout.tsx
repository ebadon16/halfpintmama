import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Sourdough Starter Guide | Half Pint Mama",
  description: "Get your free sourdough starter guide with day-by-day instructions, troubleshooting tips, and 4 beginner recipes. Start baking today!",
  alternates: { canonical: "https://halfpintmama.com/free-guide" },
  openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Free Sourdough Starter Guide | Half Pint Mama",
    description: "Get your free sourdough starter guide with day-by-day instructions, troubleshooting tips, and 4 beginner recipes.",
    url: "https://halfpintmama.com/free-guide",
  },
  twitter: {
      images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image",
    title: "Free Sourdough Starter Guide | Half Pint Mama",
    description: "Get your free sourdough starter guide with day-by-day instructions, troubleshooting tips, and 4 beginner recipes.",
  },
};

export default function FreeGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
