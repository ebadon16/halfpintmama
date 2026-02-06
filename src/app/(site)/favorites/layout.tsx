import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Saved Recipes | Half Pint Mama",
  description: "Your saved recipes from Half Pint Mama. Bookmark your favorites and come back to them anytime.",
  alternates: { canonical: "https://halfpintmama.com/favorites" },
  openGraph: {
    title: "My Saved Recipes | Half Pint Mama",
    description: "Your saved recipes from Half Pint Mama. Bookmark your favorites and come back to them anytime.",
    url: "https://halfpintmama.com/favorites",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary",
    title: "My Saved Recipes | Half Pint Mama",
    description: "Your saved recipes from Half Pint Mama.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
