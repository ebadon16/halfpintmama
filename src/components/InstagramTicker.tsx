"use client";

import { useEffect, useRef } from "react";

// Placeholder Instagram posts - in production, these would come from Instagram API
const instagramPosts = [
  { id: 1, image: "🍞", caption: "Fresh sourdough morning!" },
  { id: 2, image: "👶", caption: "Toddler taste tester approved" },
  { id: 3, image: "🥣", caption: "Discard pancakes for the win" },
  { id: 4, image: "🏠", caption: "Cozy kitchen vibes" },
  { id: 5, image: "🍪", caption: "Cookie Sunday tradition" },
  { id: 6, image: "👨‍👩‍👧‍👦", caption: "Family chaos, best chaos" },
  { id: 7, image: "🫙", caption: "Starter bubbling nicely" },
  { id: 8, image: "🥖", caption: "Baguette practice day" },
];

export function InstagramTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPos = 0;

    const scroll = () => {
      scrollPos += 0.5;
      if (scrollPos >= scrollContainer.scrollWidth / 2) {
        scrollPos = 0;
      }
      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    // Start animation after a short delay
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(scroll);
    }, 1000);

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(scroll);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Duplicate posts for seamless loop
  const duplicatedPosts = [...instagramPosts, ...instagramPosts];

  return (
    <div className="bg-white py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📸</span>
            <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold">
              Follow Along on Instagram
            </h3>
          </div>
          <a
            href="https://www.instagram.com/halfpint.mama/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-terracotta hover:text-deep-sage font-medium text-sm transition-colors"
          >
            @halfpint.mama &rarr;
          </a>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden px-4"
        style={{ scrollBehavior: "auto" }}
      >
        {duplicatedPosts.map((post, index) => (
          <a
            key={`${post.id}-${index}`}
            href="https://www.instagram.com/halfpint.mama/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-40 h-40 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 rounded-xl overflow-hidden group relative"
          >
            <div className="w-full h-full bg-warm-beige/90 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
              {post.image}
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs text-center px-2">
                {post.caption}
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-4 text-center">
        <a
          href="https://www.instagram.com/halfpint.mama/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2 border-2 border-terracotta text-terracotta font-semibold rounded-full hover:bg-terracotta hover:text-white transition-all text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Follow on Instagram
        </a>
      </div>
    </div>
  );
}
