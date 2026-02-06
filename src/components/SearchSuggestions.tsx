"use client";

import { useState, useEffect } from "react";

interface SearchSuggestionsProps {
  popularTags: { tag: string; count: number }[];
  onSuggestionClick: (term: string) => void;
}

const RECENT_SEARCHES_KEY = "hpm_recent_searches";
const MAX_RECENT_SEARCHES = 5;

export function SearchSuggestions({ popularTags, onSuggestionClick }: SearchSuggestionsProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch { /* corrupted data — ignore */ }
    }
  }, []);

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  // Get top 6 popular tags for suggestions
  const topTags = popularTags.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-charcoal/70 font-medium">Recent searches</p>
            <button
              onClick={clearRecentSearches}
              className="text-sm text-terracotta hover:text-deep-sage transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => onSuggestionClick(term)}
                className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-charcoal hover:text-terracotta flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Topics (from tags) */}
      <div>
        <p className="text-charcoal/70 font-medium mb-4">Popular topics</p>
        <div className="flex flex-wrap gap-2">
          {topTags.map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => onSuggestionClick(tag)}
              className="px-4 py-2 bg-light-sage/30 rounded-full hover:bg-sage hover:text-white transition-all text-deep-sage flex items-center gap-2"
            >
              <span className="capitalize">{tag}</span>
              <span className="text-xs opacity-70">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Suggestions */}
      <div>
        <p className="text-charcoal/70 font-medium mb-4">Try searching for</p>
        <div className="flex flex-wrap gap-2">
          {["sourdough starter", "discard recipes", "toddler snacks", "bread", "cookies"].map((term) => (
            <button
              key={term}
              onClick={() => onSuggestionClick(term)}
              className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-charcoal hover:text-terracotta"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Utility function to save a recent search
export function saveRecentSearch(term: string) {
  const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
  let searches: string[] = [];

  if (stored) {
    try {
      searches = JSON.parse(stored);
    } catch { /* corrupted data — start fresh */ }
  }

  // Remove if already exists, add to front, limit to max
  searches = searches.filter((s) => s.toLowerCase() !== term.toLowerCase());
  searches.unshift(term);
  searches = searches.slice(0, MAX_RECENT_SEARCHES);

  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
}
