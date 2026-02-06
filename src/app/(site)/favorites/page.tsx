"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";

interface FavoriteItem {
  slug: string;
  title: string;
  savedAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let stored: FavoriteItem[] = [];
    try { stored = JSON.parse(localStorage.getItem("favorites") || "[]"); } catch { /* corrupted data */ }
    setFavorites(stored);
    setIsLoaded(true);
  }, []);

  const handleRemove = (slug: string) => {
    const newFavorites = favorites.filter((f) => f.slug !== slug);
    try { localStorage.setItem("favorites", JSON.stringify(newFavorites)); } catch { /* storage unavailable */ }
    setFavorites(newFavorites);
  };

  if (!isLoaded) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="text-4xl animate-pulse">💚</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
            My Saved Recipes
          </h1>
          <p className="text-charcoal/70">
            {favorites.length === 0
              ? "You haven't saved any recipes yet."
              : `${favorites.length} saved recipe${favorites.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <div className="text-6xl mb-4">💚</div>
            <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-2">
              No saved recipes yet
            </h2>
            <p className="text-charcoal/70 mb-6">
              Click the heart icon on any recipe to save it here for easy access later.
            </p>
            <Link
              href="/cooking"
              className="inline-block px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Browse Recipes
            </Link>
          </div>
        )}

        {/* Favorites List */}
        {favorites.length > 0 && (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <div
                key={favorite.slug}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex items-center justify-between gap-4"
              >
                <Link
                  href={`/posts/${favorite.slug}`}
                  className="flex-1 min-w-0"
                >
                  <h3 className="font-[family-name:var(--font-crimson)] text-lg font-semibold text-charcoal hover:text-terracotta transition-colors truncate">
                    {favorite.title}
                  </h3>
                  <p className="text-charcoal/70 text-sm">
                    Saved {new Date(favorite.savedAt).toLocaleDateString()}
                  </p>
                </Link>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/posts/${favorite.slug}`}
                    className="px-4 py-2 text-sm font-medium text-sage hover:text-deep-sage transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleRemove(favorite.slug)}
                    className="p-2 text-charcoal/40 hover:text-red-500 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Note */}
        {favorites.length > 0 && (
          <p className="text-charcoal/50 text-sm text-center mt-8">
            Favorites are saved in your browser. They won&apos;t sync across devices.
          </p>
        )}
      </div>
    </div>
  );
}
