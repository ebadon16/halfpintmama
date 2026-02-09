import { getSiteStats } from "@/lib/posts";
import { MamaGuideContent } from "./MamaGuideContent";

export const revalidate = 3600;

export const metadata = {
  title: "Free Mama Life Guide | Half Pint Mama",
  description: "Get the free Mama Life Guide from a Pediatric ER RN and mama of two. Honest tips for navigating motherhood, from newborn stage to toddlerhood.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Free Mama Life Guide | Half Pint Mama",
    description: "Get the free Mama Life Guide — honest tips for navigating motherhood from a Pediatric ER RN.",
    url: "https://halfpintmama.com/mama-guide",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary" as const,
    title: "Free Mama Life Guide | Half Pint Mama",
    description: "Get the free Mama Life Guide — honest tips for navigating motherhood from a Pediatric ER RN.",
  },
};

// FAQ Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Mama Life Guide about?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Mama Life Guide covers real-world tips for navigating motherhood, from the newborn stage through toddlerhood. It includes practical advice from a Pediatric ER RN and mama of two.",
      },
    },
    {
      "@type": "Question",
      name: "Is this guide free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! The Mama Life Guide is completely free. Simply enter your email and it will be delivered to your inbox.",
      },
    },
    {
      "@type": "Question",
      name: "Who is this guide for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This guide is for new moms, expecting moms, or any mama looking for honest, practical advice about motherhood from someone who gets it.",
      },
    },
  ],
};

export default async function MamaGuidePage() {
  const stats = await getSiteStats();

  return (
    <div className="bg-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <MamaGuideContent totalPosts={stats.totalPosts} />
    </div>
  );
}
