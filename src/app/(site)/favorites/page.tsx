import { FavoritesContent } from "./FavoritesContent";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ARRAY } from "@/lib/seo";

export const metadata = {
  title: "My Saved Recipes | Half Pint Mama",
  description: "Your saved recipes from Half Pint Mama, all in one place. Click the heart icon on any recipe to save it here for easy access later.",
  alternates: { canonical: "https://halfpintmama.com/favorites" },
  robots: { index: false, follow: true },
  openGraph: {
      images: DEFAULT_OG_IMAGE_ARRAY,
    title: "My Saved Recipes | Half Pint Mama",
    description: "Your saved recipes from Half Pint Mama, all in one place.",
    type: "website",
    url: "https://halfpintmama.com/favorites",
  },
  twitter: {
      images: [DEFAULT_OG_IMAGE.url],
    card: "summary" as const,
    title: "My Saved Recipes | Half Pint Mama",
    description: "Your saved recipes from Half Pint Mama, all in one place.",
  },
};

export default function FavoritesPage() {
  return <FavoritesContent />;
}
