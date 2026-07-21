"use client";

import { useState } from "react";

interface RecipeScalerProps {
  baseServings: number;
  currentServings: number;
  onServingsChange: (servings: number) => void;
}

const SCALE_OPTIONS = [0.5, 1, 1.5, 2, 3];

export function RecipeScaler({ baseServings, currentServings, onServingsChange }: RecipeScalerProps) {
  const scale = currentServings / baseServings;
  // Local draft so the field can be cleared while typing without the DOM
  // desyncing from the committed servings; null mirrors currentServings.
  const [draft, setDraft] = useState<string | null>(null);

  const setServings = (servings: number) => {
    setDraft(null);
    onServingsChange(servings);
  };

  const handleCustomServings = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 100) {
      onServingsChange(value);
    }
  };

  return (
    <div className="recipe-scaler">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-charcoal text-sm">Adjust Servings</h4>
        <span className="text-xs text-charcoal/80">
          {scale !== 1 && `(${parseFloat(scale.toFixed(2))}x recipe)`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setServings(Math.max(1, currentServings - 1))}
          className="w-10 h-10 rounded-full border-2 border-sage text-sage hover:bg-deep-sage hover:text-white transition-all flex items-center justify-center font-bold"
          aria-label="Decrease servings"
        >
          -
        </button>

        <div className="flex-1 flex items-center justify-center gap-2">
          <input
            type="number"
            value={draft ?? String(currentServings)}
            onChange={handleCustomServings}
            onBlur={() => setDraft(null)}
            min="1"
            aria-label="Number of servings"
            className="w-16 text-center px-2 py-1 border-2 border-light-sage rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage text-lg font-semibold text-charcoal"
          />
          <span className="text-charcoal/80">servings</span>
        </div>

        <button
          onClick={() => setServings(currentServings + 1)}
          className="w-10 h-10 rounded-full border-2 border-sage text-sage hover:bg-deep-sage hover:text-white transition-all flex items-center justify-center font-bold"
          aria-label="Increase servings"
        >
          +
        </button>
      </div>

      {/* Quick scale buttons. Dedupe by target: for small baseServings two
          options can round to the same count (e.g. 0.5x and 1x of 1 serving).
          Among duplicates keep the option whose label is truthful (smallest
          rounding error; ties go to the one closest to 1x, so "Original"
          always survives). */}
      <div className="flex justify-center gap-2 mt-3">
        {SCALE_OPTIONS.filter((option) => {
          const target = Math.max(1, Math.round(baseServings * option));
          const err = (o: number) => Math.abs(baseServings * o - target);
          const dupes = SCALE_OPTIONS.filter(
            (o) => Math.max(1, Math.round(baseServings * o)) === target
          );
          const keep = dupes.reduce((a, b) =>
            err(b) < err(a) || (err(b) === err(a) && Math.abs(b - 1) < Math.abs(a - 1)) ? b : a
          );
          return option === keep;
        }).map((option) => {
          const targetServings = Math.max(1, Math.round(baseServings * option));
          const isActive = currentServings === targetServings;
          return (
            <button
              key={option}
              onClick={() => setServings(targetServings)}
              aria-pressed={isActive}
              className={`px-3 py-1 text-xs rounded-full transition-all ${
                isActive
                  ? "bg-deep-sage text-white"
                  : "bg-light-sage/50 text-charcoal/80 hover:bg-light-sage"
              }`}
            >
              {option === 1 ? "Original" : `${option}x`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
