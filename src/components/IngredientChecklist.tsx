"use client";

import { useState } from "react";
import { IngredientSection } from "@/lib/posts";

interface IngredientChecklistProps {
  ingredients?: string[];
  ingredientSections?: IngredientSection[];
  scale?: number;
}

// Parse ingredient string to extract quantity for scaling
function parseIngredient(ingredient: string): { quantity: number | null; unit: string; rest: string } {
  // Match mixed fractions like "1 1/2 cups flour"
  const mixedMatch = ingredient.match(/^(\d+)\s+(\d+\/\d+)\s*([a-zA-Z]*)\s*(.*)/);
  if (mixedMatch) {
    const [, whole, frac, unit, rest] = mixedMatch;
    const [num, denom] = frac.split('/');
    const quantity = parseFloat(whole) + parseFloat(num) / parseFloat(denom);
    return { quantity: isNaN(quantity) ? null : quantity, unit, rest };
  }

  // Match simple fractions "1/2 tsp" or decimals/whole numbers "2 cups", "1.5 cups"
  const match = ingredient.match(/^([\d./]+)\s*([a-zA-Z]*)\s*(.*)/);
  if (match) {
    const [, numStr, unit, rest] = match;
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

  const getKey = (sectionIndex: number, itemIndex: number) => `${sectionIndex}-${itemIndex}`;

  const toggleIngredient = (sectionIndex: number, itemIndex: number) => {
    const key = getKey(sectionIndex, itemIndex);
    const newChecked = new Set(checked);
    if (newChecked.has(key)) {
      newChecked.delete(key);
    } else {
      newChecked.add(key);
    }
    setChecked(newChecked);
  };

  const clearAll = () => setChecked(new Set());
  const checkAll = () => {
    const allKeys = allIngredients.map(({ sectionIndex, itemIndex }) => getKey(sectionIndex, itemIndex));
    setChecked(new Set(allKeys));
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

      <p className="mt-3 text-sm text-charcoal/50">
        {checked.size} of {allIngredients.length} ingredients checked
      </p>
    </div>
  );
}
