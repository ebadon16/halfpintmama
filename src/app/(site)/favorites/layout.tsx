import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Saved Recipes | Half Pint Mama",
  description: "Your saved recipes from Half Pint Mama. Bookmark your favorites and come back to them anytime.",
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
