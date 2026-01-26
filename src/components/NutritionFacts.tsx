import { NutritionInfo } from "@/lib/posts";

interface NutritionFactsProps {
  nutrition: NutritionInfo;
  scale?: number;
  servings?: number;
}

export function NutritionFacts({ nutrition, scale = 1, servings }: NutritionFactsProps) {
  const scaleValue = (value: number | undefined) => {
    if (value === undefined) return null;
    return Math.round(value * scale);
  };

  const items = [
    { label: "Calories", value: scaleValue(nutrition.calories), unit: "" },
    { label: "Protein", value: scaleValue(nutrition.protein), unit: "g" },
    { label: "Carbs", value: scaleValue(nutrition.carbs), unit: "g" },
    { label: "Fat", value: scaleValue(nutrition.fat), unit: "g" },
    { label: "Fiber", value: scaleValue(nutrition.fiber), unit: "g" },
    { label: "Sugar", value: scaleValue(nutrition.sugar), unit: "g" },
  ].filter((item) => item.value !== null);

  if (items.length === 0) return null;

  return (
    <div className="nutrition-facts bg-warm-beige/50 rounded-lg p-4">
      <h4 className="font-[family-name:var(--font-crimson)] font-semibold text-charcoal mb-3 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Nutrition Facts
      </h4>

      {servings && (
        <p className="text-xs text-charcoal/60 mb-3">
          Per serving ({scale !== 1 ? "adjusted" : "original"} recipe)
        </p>
      )}

      <div className="grid grid-cols-3 gap-3">
        {items.map(({ label, value, unit }) => (
          <div key={label} className="text-center">
            <p className="text-lg font-bold text-deep-sage">
              {value}
              <span className="text-sm font-normal">{unit}</span>
            </p>
            <p className="text-xs text-charcoal/60">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-charcoal/50 mt-3 italic">
        * Nutritional values are estimates and may vary.
      </p>
    </div>
  );
}
