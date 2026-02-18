"use client";

import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  slug: string;
  title: string;
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({ slug, title, className = "", showText = false }: FavoriteButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let favorites: { slug: string }[] = [];
    try { favorites = JSON.parse(localStorage.getItem("favorites") || "[]"); } catch { /* corrupted data */ }
    setIsFavorite(favorites.some((f) => f.slug === slug));
    setMounted(true);
  }, [slug]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let favorites: { slug: string; title?: string; savedAt?: string }[] = [];
    try { favorites = JSON.parse(localStorage.getItem("favorites") || "[]"); } catch { /* corrupted data */ }

    try {
      if (isFavorite) {
        const newFavorites = favorites.filter((f: { slug: string }) => f.slug !== slug);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        setIsFavorite(false);
      } else {
        favorites.push({ slug, title, savedAt: new Date().toISOString() });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        setIsFavorite(true);
      }
    } catch { /* storage unavailable or full */ }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`flex items-center gap-1.5 transition-all ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Save recipe"}
    >
      <svg
        className={`w-5 h-5 transition-colors ${mounted && isFavorite ? "text-terracotta fill-terracotta" : "text-charcoal/40 hover:text-terracotta"}`}
        fill={mounted && isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {showText && (
        <span className={`text-sm ${mounted && isFavorite ? "text-terracotta" : "text-charcoal/60"}`}>
          {mounted && isFavorite ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
