import { getSiteStats } from "@/lib/posts";
import { MamaGuideContent } from "./MamaGuideContent";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = {
  title: "Free Mama Life Guide | Half Pint Mama",
  description: "Get the free Mama Life Guide from a Pediatric ER RN and mama of three. Honest tips for navigating motherhood, from the newborn stage through toddlerhood.",
  alternates: { canonical: "https://halfpintmama.com/mama-guide" },
  robots: { index: false, follow: true },
  openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
    title: "Free Mama Life Guide | Half Pint Mama",
    description: "Get the free Mama Life Guide: honest tips for navigating motherhood from a Pediatric ER RN.",
    type: "website",
    url: "https://halfpintmama.com/mama-guide",
  },
  twitter: {
      images: [DEFAULT_OG_IMAGE.url],
    card: "summary" as const,
    title: "Free Mama Life Guide | Half Pint Mama",
    description: "Get the free Mama Life Guide: honest tips for navigating motherhood from a Pediatric ER RN.",
  },
};

export default async function MamaGuidePage() {
  const stats = await getSiteStats();

  return (
    <div className="bg-cream min-h-screen">
      <MamaGuideContent totalPosts={stats.totalPosts} />
    </div>
  );
}
