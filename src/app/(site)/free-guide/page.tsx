import { getSiteStats } from "@/lib/posts";
import { FreeGuideContent } from "./FreeGuideContent";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const metadata = {
  title: "Free Sourdough Starter Guide + Freezer Prep Guide | Half Pint Mama",
  description: "Get your free sourdough starter guide from a Pediatric ER RN. Day-by-day instructions, troubleshooting tips, and beginner recipes to bake your first loaf. Subscribers also get a free Postpartum Freezer Prep Guide.",
  alternates: { canonical: "https://halfpintmama.com/free-guide" },
  openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Free Sourdough Starter Guide + Freezer Prep Guide | Half Pint Mama",
    description: "Two free guides from a Pediatric ER RN: the sourdough starter guide, day-by-day, plus the Postpartum Freezer Prep Guide.",
    type: "website",
    url: "https://halfpintmama.com/free-guide",
  },
  twitter: {
      images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image" as const,
    title: "Free Sourdough Starter Guide + Freezer Prep Guide | Half Pint Mama",
    description: "Two free guides from a Pediatric ER RN: the sourdough starter guide, day-by-day, plus the Postpartum Freezer Prep Guide.",
  },
};

export const revalidate = 3600;

export default async function FreeGuidePage() {
  const stats = await getSiteStats();

  return (
    <div className="bg-cream min-h-screen">
      <FreeGuideContent cookingPosts={stats.cookingPosts} />
    </div>
  );
}
