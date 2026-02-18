"use client";

interface RecipeScalerProps {
  baseServings: number;
  currentServings: number;
  onServingsChange: (servings: number) => void;
}

const SCALE_OPTIONS = [0.5, 1, 1.5, 2, 3];

export function RecipeScaler({ baseServings, currentServings, onServingsChange }: RecipeScalerProps) {
  const scale = currentServings / baseServings;

  const handleCustomServings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 100) {
      onServingsChange(value);
    }
  };

  return (
    <div className="recipe-scaler">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-charcoal text-sm">Adjust Servings</h4>
        <span className="text-xs text-charcoal/60">
          {scale !== 1 && `(${scale}x recipe)`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onServingsChange(Math.max(1, currentServings - 1))}
          className="w-10 h-10 rounded-full border-2 border-sage text-sage hover:bg-sage hover:text-white transition-all flex items-center justify-center font-bold"
          aria-label="Decrease servings"
        >
          -
        </button>

        <div className="flex-1 flex items-center justify-center gap-2">
          <input
            type="number"
            value={currentServings}
            onChange={handleCustomServings}
            min="1"
            aria-label="Number of servings"
            className="w-16 text-center px-2 py-1 border-2 border-light-sage rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage text-lg font-semibold text-charcoal"
          />
          <span className="text-charcoal/70">servings</span>
        </div>

        <button
          onClick={() => onServingsChange(currentServings + 1)}
          className="w-10 h-10 rounded-full border-2 border-sage text-sage hover:bg-sage hover:text-white transition-all flex items-center justify-center font-bold"
          aria-label="Increase servings"
        >
          +
        </button>
      </div>

      {/* Quick scale buttons */}
      <div className="flex justify-center gap-2 mt-3">
        {SCALE_OPTIONS.map((option) => {
          const targetServings = Math.round(baseServings * option);
          const isActive = currentServings === targetServings;
          return (
            <button
              key={option}
              onClick={() => onServingsChange(targetServings)}
              className={`px-3 py-1 text-xs rounded-full transition-all ${
                isActive
                  ? "bg-sage text-white"
                  : "bg-light-sage/50 text-charcoal/70 hover:bg-light-sage"
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
