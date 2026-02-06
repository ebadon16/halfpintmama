import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Saved Recipes | Half Pint Mama",
  description: "Access your saved recipes from Half Pint Mama. Bookmark sourdough recipes, family meals, and healthy snacks to easily find them whenever you need them.",
  alternates: { canonical: "https://halfpintmama.com/favorites" },
  openGraph: {
    title: "My Saved Recipes | Half Pint Mama",
    description: "Access your saved recipes from Half Pint Mama. Bookmark sourdough recipes, family meals, and healthy snacks to easily find them whenever you need them.",
    url: "https://halfpintmama.com/favorites",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary",
    title: "My Saved Recipes | Half Pint Mama",
    description: "Access your saved recipes from Half Pint Mama. Bookmark favorites to find them easily.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
