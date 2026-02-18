"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Comments = dynamic(() => import("@/components/Comments").then((m) => m.Comments));

interface LazyCommentsProps {
  postSlug: string;
  postTitle: string;
  category?: string;
  initialRatingAverage?: number;
  initialRatingCount?: number;
}

export function LazyComments(props: LazyCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Check if user navigated to #comments-section directly
  useEffect(() => {
    if (window.location.hash === "#comments-section") {
      setIsVisible(true);
    }
  }, []);

  if (isVisible) {
    return <Comments {...props} />;
  }

  return (
    <div ref={containerRef} id="comments-section" className="bg-cream py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-light-sage/50 animate-pulse">
          <div className="h-7 bg-light-sage/30 rounded w-48 mb-4" />
          <div className="h-4 bg-light-sage/20 rounded w-64 mb-6" />
          <div className="space-y-4">
            <div className="h-24 bg-light-sage/10 rounded-xl" />
            <div className="h-24 bg-light-sage/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
