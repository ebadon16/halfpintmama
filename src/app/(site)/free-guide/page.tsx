import { getSiteStats } from "@/lib/posts";
import { FreeGuideContent } from "./FreeGuideContent";
import { getShopStatus } from "@/lib/shop/status";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const metadata = {
  title: "Free Sourdough + Freezer Prep Guides | Half Pint Mama",
  description: "Two free guides from a Pediatric ER RN: the day-by-day Sourdough Starter Guide with troubleshooting and recipes, plus the Postpartum Freezer Prep Guide.",
  alternates: { canonical: "https://halfpintmama.com/free-guide" },
  openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Free Sourdough + Freezer Prep Guides | Half Pint Mama",
    description: "Two free guides from a Pediatric ER RN: the Sourdough Starter Guide, day-by-day, plus the Postpartum Freezer Prep Guide.",
    type: "website",
    url: "https://halfpintmama.com/free-guide",
  },
  twitter: {
      images: [DEFAULT_OG_IMAGE.url],
    card: "summary_large_image" as const,
    title: "Free Sourdough + Freezer Prep Guides | Half Pint Mama",
    description: "Two free guides from a Pediatric ER RN: the Sourdough Starter Guide, day-by-day, plus the Postpartum Freezer Prep Guide.",
  },
};

export const revalidate = 3600;

export default async function FreeGuidePage() {
  const stats = await getSiteStats();

  return (
    <div className="bg-cream min-h-screen">
      <FreeGuideContent cookingPosts={stats.cookingPosts} shopStatus={getShopStatus()} />
    </div>
  );
}
