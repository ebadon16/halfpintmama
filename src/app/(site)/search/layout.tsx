import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | Half Pint Mama",
  description: "Search recipes, travel guides, DIY projects, and more on Half Pint Mama.",
  alternates: { canonical: "https://halfpintmama.com/search" },
  openGraph: { images: ["/logo.jpg"] },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
