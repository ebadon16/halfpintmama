import { getSiteStats } from "@/lib/posts";
import { FreeGuideContent } from "./FreeGuideContent";

export const metadata = {
  title: "Free Sourdough Starter Guide | Half Pint Mama",
  description: "Get your free sourdough starter guide from a Pediatric ER RN. Day-by-day instructions, troubleshooting tips, and beginner recipes to bake your first loaf.",
  alternates: { canonical: "https://halfpintmama.com/free-guide" },
  openGraph: {
    title: "Free Sourdough Starter Guide | Half Pint Mama",
    description: "Get your free sourdough starter guide — day-by-day instructions from a Pediatric ER RN.",
    url: "https://halfpintmama.com/free-guide",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Free Sourdough Starter Guide | Half Pint Mama",
    description: "Get your free sourdough starter guide — day-by-day instructions from a Pediatric ER RN.",
  },
};

export const revalidate = 3600;

// FAQ Schema for SEO - common sourdough starter questions
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does it take to make a sourdough starter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It typically takes 7-10 days to create an active sourdough starter from scratch. The guide provides day-by-day instructions to help you through the process.",
      },
    },
    {
      "@type": "Question",
      name: "Why isn't my sourdough starter rising?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common reasons include using water that's too hot or too cold, not feeding often enough, or environmental temperature issues. The troubleshooting section covers all common problems and solutions.",
      },
    },
    {
      "@type": "Question",
      name: "What flour should I use for sourdough starter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All-purpose flour or bread flour work well for beginners. Whole wheat or rye flour can help establish a starter faster due to higher wild yeast content.",
      },
    },
    {
      "@type": "Question",
      name: "How often do I need to feed my sourdough starter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "During the initial creation phase, feed once or twice daily. Once established, a refrigerated starter only needs weekly feedings, or daily if kept at room temperature.",
      },
    },
  ],
};

export default async function FreeGuidePage() {
  const stats = await getSiteStats();

  return (
    <div className="bg-cream min-h-screen">
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FreeGuideContent cookingPosts={stats.cookingPosts} />
    </div>
  );
}
