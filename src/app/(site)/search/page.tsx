"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string, category = selectedCategory, start = startDate, end = endDate) => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (category) params.set("category", category);
      if (start) params.set("startDate", start);
      if (end) params.set("endDate", end);

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    // Update URL without refresh
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(query)}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    performSearch(query, category, startDate, endDate);
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    performSearch(query, selectedCategory, start, end);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
    if (query) {
      performSearch(query, "", "", "");
    }
  };

  return (
    <>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for sourdough, recipes, tips..."
            aria-label="Search the blog"
            className="flex-1 px-6 py-4 border-2 border-sage rounded-full focus:outline-none focus:border-deep-sage text-lg"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-8 py-4 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isSearching ? "..." : "Search"}
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="mb-8 p-4 bg-white rounded-xl shadow-sm">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["", "cooking", "travel", "diy", "mama-life"].map((cat) => (
            <button
              key={cat || "all"}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                selectedCategory === cat
                  ? "bg-sage text-white"
                  : "border-2 border-light-sage text-deep-sage hover:bg-light-sage"
              }`}
            >
              {cat ? cat.replace("-", " ") : "All Categories"}
            </button>
          ))}
        </div>

        {/* Date Range */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label htmlFor="search-start-date" className="block text-sm text-charcoal/70 mb-1">From:</label>
            <input
              id="search-start-date"
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e.target.value, endDate)}
              className="px-3 py-2 border-2 border-light-sage rounded-lg focus:outline-none focus:border-sage"
            />
          </div>
          <div>
            <label htmlFor="search-end-date" className="block text-sm text-charcoal/70 mb-1">To:</label>
            <input
              id="search-end-date"
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange(startDate, e.target.value)}
              className="px-3 py-2 border-2 border-light-sage rounded-lg focus:outline-none focus:border-sage"
            />
          </div>
          {(selectedCategory || startDate || endDate) && (
            <button
              onClick={clearFilters}
              className="self-end px-3 py-2 text-sm text-terracotta hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {isSearching && (
        <div className="text-center py-12">
          <div className="text-4xl animate-pulse">🔍</div>
          <p className="text-charcoal/70 mt-2">Searching...</p>
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-md">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-2">
            No results found
          </h2>
          <p className="text-charcoal/70 mb-6">
            {query
              ? <>We couldn&apos;t find anything matching &quot;{query}&quot;</>
              : <>No posts match your selected filters</>
            }
          </p>
          <div className="space-y-2 text-sm text-charcoal/60">
            <p>Try:</p>
            <ul className="list-disc list-inside">
              <li>Using different keywords</li>
              <li>Adjusting your filters</li>
              <li>Using more general terms</li>
            </ul>
          </div>
          <div className="mt-6">
            <Link
              href="/cooking"
              className="text-terracotta font-medium hover:text-deep-sage transition-colors"
            >
              Browse all recipes &rarr;
            </Link>
          </div>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div>
          <p className="text-charcoal/70 mb-6">
            Found {results.length} result{results.length !== 1 ? "s" : ""}
            {query && <> for &quot;{query}&quot;</>}
            {selectedCategory && <> in {selectedCategory.replace("-", " ")}</>}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((result) => (
              <PostCard
                key={result.slug}
                slug={result.slug}
                title={result.title}
                excerpt={result.excerpt}
                category={result.category}
                date={result.date}
                image={result.image}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches */}
      {!hasSearched && (
        <div className="text-center">
          <p className="text-charcoal/70 mb-4">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["sourdough starter", "discard recipes", "toddler snacks", "bread", "cookies"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  performSearch(term);
                  window.history.pushState({}, "", `/search?q=${encodeURIComponent(term)}`);
                }}
                className="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-charcoal hover:text-terracotta"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function SearchLoading() {
  return (
    <div className="text-center py-12">
      <div className="text-4xl animate-pulse">🔍</div>
      <p className="text-charcoal/70 mt-2">Loading...</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
            Search
          </h1>
          <p className="text-charcoal/70">
            Find recipes, tips, and more across the blog
          </p>
        </div>

        <Suspense fallback={<SearchLoading />}>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
