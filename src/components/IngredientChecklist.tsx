"use client";

import { useState } from "react";

interface IngredientChecklistProps {
  ingredients: string[];
  scale?: number;
}

// Parse ingredient string to extract quantity for scaling
function parseIngredient(ingredient: string): { quantity: number | null; unit: string; rest: string } {
  // Match patterns like "2 cups", "1/2 tsp", "1.5 cups", etc.
  const match = ingredient.match(/^([\d./]+)\s*([a-zA-Z]*)\s*(.*)/);

  if (match) {
    const [, numStr, unit, rest] = match;
    // Handle fractions like "1/2"
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
  const { quantity, unit, rest } = parseIngredient(ingredient);

  if (quantity !== null && scale !== 1) {
    const scaled = quantity * scale;
    return `${formatQuantity(scaled)} ${unit} ${rest}`.trim();
  }

  return ingredient;
}

export function IngredientChecklist({ ingredients, scale = 1 }: IngredientChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checked);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setChecked(newChecked);
  };

  const clearAll = () => setChecked(new Set());
  const checkAll = () => setChecked(new Set(ingredients.map((_, i) => i)));

  return (
    <div className="ingredient-checklist">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-[family-name:var(--font-crimson)] text-lg font-semibold text-charcoal">
          Ingredients
        </h3>
        <div className="flex gap-2 text-sm">
          <button
            onClick={clearAll}
            className="text-charcoal/60 hover:text-terracotta transition-colors"
          >
            Clear
          </button>
          <span className="text-charcoal/30">|</span>
          <button
            onClick={checkAll}
            className="text-charcoal/60 hover:text-terracotta transition-colors"
          >
            Check all
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-start gap-3">
            <label className="flex items-start gap-3 cursor-pointer group w-full">
              <input
                type="checkbox"
                checked={checked.has(index)}
                onChange={() => toggleIngredient(index)}
                className="mt-1 w-5 h-5 rounded border-2 border-sage text-sage focus:ring-sage cursor-pointer"
              />
              <span
                className={`transition-all ${
                  checked.has(index)
                    ? "line-through text-charcoal/40"
                    : "text-charcoal/80 group-hover:text-charcoal"
                }`}
              >
                {scaleIngredient(ingredient, scale)}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-sm text-charcoal/50">
        {checked.size} of {ingredients.length} ingredients checked
      </p>
    </div>
  );
}
