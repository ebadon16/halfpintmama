import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Sourdough Starter Guide | Half Pint Mama",
  description: "Get your free sourdough starter guide with day-by-day instructions, troubleshooting tips, and 4 beginner recipes. Start baking today!",
  alternates: { canonical: "https://halfpintmama.com/free-guide" },
  openGraph: {
    title: "Free Sourdough Starter Guide | Half Pint Mama",
    description: "Get your free sourdough starter guide with day-by-day instructions, troubleshooting tips, and 4 beginner recipes.",
    url: "https://halfpintmama.com/free-guide",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Sourdough Starter Guide | Half Pint Mama",
    description: "Get your free sourdough starter guide with day-by-day instructions, troubleshooting tips, and 4 beginner recipes.",
    images: ["/logo.jpg"],
  },
};

export default function FreeGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
