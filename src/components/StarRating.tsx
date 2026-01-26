"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ rating, onRate, readonly = false, size = "md" }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (index: number) => {
    if (!readonly && onRate) {
      onRate(index);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = readonly
          ? index <= rating
          : index <= (hoverRating || rating);

        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(index)}
            onMouseEnter={() => !readonly && setHoverRating(index)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-transform ${!readonly && "hover:scale-110"}`}
            aria-label={`Rate ${index} stars`}
          >
            <svg
              className={`${sizeClasses[size]} ${isFilled ? "text-yellow-400" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

interface RatingSummaryProps {
  averageRating: number;
  totalRatings: number;
}

export function RatingSummary({ averageRating, totalRatings }: RatingSummaryProps) {
  return (
    <div className="flex items-center gap-2">
      <StarRating rating={Math.round(averageRating)} readonly size="sm" />
      <span className="text-sm text-charcoal/70">
        {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
      </span>
    </div>
  );
}
