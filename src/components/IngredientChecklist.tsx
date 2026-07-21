"use client";

import { useState, useEffect } from "react";
import { IngredientSection } from "@/lib/posts";

interface IngredientChecklistProps {
  ingredients?: string[];
  ingredientSections?: IngredientSection[];
  scale?: number;
}

// Vulgar fractions pasted from other sites ("½ cup") must scale like ASCII ones
const UNICODE_FRACTIONS: Record<string, string> = {
  "¼": "1/4", "½": "1/2", "¾": "3/4", "⅓": "1/3", "⅔": "2/3",
  "⅕": "1/5", "⅛": "1/8", "⅜": "3/8", "⅝": "5/8", "⅞": "7/8",
};

function normalizeFractions(s: string): string {
  return s.replace(/(\d)?\s?([¼½¾⅓⅔⅕⅛⅜⅝⅞])/g, (_, whole, frac) =>
    whole ? `${whole} ${UNICODE_FRACTIONS[frac]}` : UNICODE_FRACTIONS[frac]
  );
}

// Parse "2", "1.5", "1/2", or "1 1/2" to a number
function parseNumber(str: string): number | null {
  const mixed = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const v = parseInt(mixed[1], 10) + parseInt(mixed[2], 10) / parseInt(mixed[3], 10);
    return isNaN(v) ? null : v;
  }
  if (str.includes("/")) {
    const [num, denom] = str.split("/");
    const v = parseFloat(num) / parseFloat(denom);
    return isNaN(v) ? null : v;
  }
  const v = parseFloat(str);
  return isNaN(v) ? null : v;
}

// Parse ingredient string to extract quantity for scaling
function parseIngredient(ingredient: string): { quantity: number | null; unit: string; rest: string } {
  // Match mixed fractions like "1 1/2 cups flour"
  const mixedMatch = ingredient.match(/^(\d+)\s+(\d+\/\d+)\s*([a-zA-Z]*)\s*(.*)/);
  if (mixedMatch) {
    const [, whole, frac, unit, rest] = mixedMatch;
    if (rest.startsWith("%")) return { quantity: null, unit: "", rest: ingredient };
    const [num, denom] = frac.split('/');
    const quantity = parseFloat(whole) + parseFloat(num) / parseFloat(denom);
    return { quantity: isNaN(quantity) ? null : quantity, unit, rest };
  }

  // Match simple fractions "1/2 tsp" or decimals/whole numbers "2 cups", "1.5 cups"
  const match = ingredient.match(/^([\d./]+)\s*([a-zA-Z]*)\s*(.*)/);
  if (match) {
    const [, numStr, unit, rest] = match;
    // "2% milk": the leading number is part of the name, not a quantity
    if (rest.startsWith("%")) return { quantity: null, unit: "", rest: ingredient };
    let quantity: number | null = null;
    if (numStr.includes('/')) {
      const [num, denom] = numStr.split('/');
      quantity = parseFloat(num) / parseFloat(denom);
    } else {
      quantity = parseFloat(numStr);
    }
    return { quantity: isNaN(quantity) ? null : quantity, unit, rest };
  }

  return { quantity: null, unit: '', rest: ingredient };
}

// Format a number nicely (convert decimals to fractions when possible)
function formatQuantity(num: number): string {
  const fractions: Record<number, string> = {
    0.25: '1/4',
    0.33: '1/3',
    0.5: '1/2',
    0.67: '2/3',
    0.75: '3/4',
  };

  const whole = Math.floor(num);
  const decimal = num - whole;

  // Check if decimal is close to a common fraction
  for (const [value, fraction] of Object.entries(fractions)) {
    if (Math.abs(decimal - parseFloat(value)) < 0.05) {
      return whole > 0 ? `${whole} ${fraction}` : fraction;
    }
  }

  // Otherwise, just round to 2 decimal places
  return whole > 0 && decimal < 0.05 ? whole.toString() : num.toFixed(2).replace(/\.?0+$/, '');
}

function scaleIngredient(ingredient: string, scale: number): string {
  if (scale === 1) return ingredient;

  const normalized = normalizeFractions(ingredient);

  // Ranges ("2-3 tbsp water"): scale both ends. The single-number parser would
  // otherwise match only the "2" and garble the rest into "-3 tbsp water".
  // Fraction/mixed alternatives come FIRST so "1/2" isn't split at the slash;
  // hi < lo means US hyphenated mixed-number notation ("1-1/2 cups" = 1 1/2),
  // which scales as a single quantity.
  const range = normalized.match(
    /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.]\d+)?)\s*[-–]\s*(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.]\d+)?)\s*(.*)$/
  );
  if (range && !range[3].startsWith("%")) {
    const lo = parseNumber(range[1]);
    const hi = parseNumber(range[2]);
    if (lo !== null && hi !== null) {
      if (hi < lo) {
        return `${formatQuantity((lo + hi) * scale)} ${range[3]}`.trim();
      }
      return `${formatQuantity(lo * scale)}-${formatQuantity(hi * scale)} ${range[3]}`.trim();
    }
    return ingredient; // unparseable range: leave the whole line untouched
  }

  const { quantity, unit, rest } = parseIngredient(normalized);
  if (quantity !== null) {
    return `${formatQuantity(quantity * scale)} ${unit} ${rest}`.trim();
  }

  return ingredient;
}

export function IngredientChecklist({ ingredients, ingredientSections, scale = 1 }: IngredientChecklistProps) {
  // Flatten all ingredients for counting
  const allIngredients: { ingredient: string; sectionIndex: number; itemIndex: number }[] = [];

  if (ingredientSections && ingredientSections.length > 0) {
    ingredientSections.forEach((section, sectionIndex) => {
      section.items.forEach((item, itemIndex) => {
        allIngredients.push({ ingredient: item, sectionIndex, itemIndex });
      });
    });
  } else if (ingredients) {
    ingredients.forEach((item, index) => {
      allIngredients.push({ ingredient: item, sectionIndex: 0, itemIndex: index });
    });
  }

  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Restore checked items for this recipe so a mid-bake refresh doesn't lose progress
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`checklist:${window.location.pathname}`) || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Browser-only storage read; no SSR-safe alternative.
      if (Array.isArray(stored) && stored.length) setChecked(new Set(stored.map(String)));
    } catch { /* corrupted data */ }
  }, []);

  const persist = (next: Set<string>) => {
    setChecked(next);
    try { localStorage.setItem(`checklist:${window.location.pathname}`, JSON.stringify([...next])); } catch { /* storage unavailable */ }
  };

  const getKey = (sectionIndex: number, itemIndex: number) => `${sectionIndex}-${itemIndex}`;

  const toggleIngredient = (sectionIndex: number, itemIndex: number) => {
    const key = getKey(sectionIndex, itemIndex);
    const newChecked = new Set(checked);
    if (newChecked.has(key)) {
      newChecked.delete(key);
    } else {
      newChecked.add(key);
    }
    persist(newChecked);
  };

  const clearAll = () => persist(new Set());
  const checkAll = () => {
    const allKeys = allIngredients.map(({ sectionIndex, itemIndex }) => getKey(sectionIndex, itemIndex));
    persist(new Set(allKeys));
  };

  const renderIngredientItem = (ingredient: string, sectionIndex: number, itemIndex: number) => {
    const key = getKey(sectionIndex, itemIndex);
    return (
      <li key={key} className="flex items-start gap-3">
        <label className="flex items-start gap-3 cursor-pointer group w-full">
          <input
            type="checkbox"
            checked={checked.has(key)}
            onChange={() => toggleIngredient(sectionIndex, itemIndex)}
            className="mt-1 w-5 h-5 rounded border-2 border-sage text-sage focus:ring-sage cursor-pointer"
          />
          <span
            className={`transition-all ${
              checked.has(key)
                ? "line-through text-charcoal/40"
                : "text-charcoal/80 group-hover:text-charcoal"
            }`}
          >
            {scaleIngredient(ingredient, scale)}
          </span>
        </label>
      </li>
    );
  };

  return (
    <div className="ingredient-checklist">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-[family-name:var(--font-crimson)] text-lg font-semibold text-charcoal">
          Ingredients
        </h3>
        <div className="flex gap-2 text-sm">
          <button
            onClick={clearAll}
            className="text-charcoal/80 hover:text-terracotta transition-colors"
          >
            Clear
          </button>
          <span className="text-charcoal/30">|</span>
          <button
            onClick={checkAll}
            className="text-charcoal/80 hover:text-terracotta transition-colors"
          >
            Check all
          </button>
        </div>
      </div>

      {ingredientSections && ingredientSections.length > 0 ? (
        <div className="space-y-4">
          {ingredientSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h4 className="font-[family-name:var(--font-crimson)] text-base font-semibold text-deep-sage mb-2">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) =>
                  renderIngredientItem(item, sectionIndex, itemIndex)
                )}
              </ul>
            </div>
          ))}
        </div>
      ) : ingredients ? (
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) =>
            renderIngredientItem(ingredient, 0, index)
          )}
        </ul>
      ) : null}

      <p className="mt-3 text-sm text-charcoal/80">
        {checked.size} of {allIngredients.length} ingredients checked
      </p>
    </div>
  );
}
