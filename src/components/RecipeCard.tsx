"use client";

import { useState } from "react";
import Image from "next/image";
import { RecipeInfo } from "@/lib/posts";
import { IngredientChecklist } from "./IngredientChecklist";
import { RecipeScaler } from "./RecipeScaler";
import { NutritionFacts } from "./NutritionFacts";

interface RecipeCardProps {
  recipe: RecipeInfo;
  title: string;
}

export function RecipeCard({ recipe, title }: RecipeCardProps) {
  const baseServings = recipe.servings || 1;
  const [servings, setServings] = useState(baseServings);
  const scale = servings / baseServings;

  const hasTimeInfo = recipe.prepTime || recipe.cookTime || recipe.totalTime;
  const hasIngredients = recipe.ingredients && recipe.ingredients.length > 0;
  const hasInstructions = recipe.instructions && recipe.instructions.length > 0;
  const hasNutrition = recipe.nutrition && Object.keys(recipe.nutrition).length > 0;

  if (!hasTimeInfo && !hasIngredients && !hasNutrition) {
    return null;
  }

  return (
    <div id="recipe-card" className="recipe-card bg-white rounded-2xl shadow-md p-6 mb-8 print:shadow-none print:border print:border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h2 className="font-[family-name:var(--font-crimson)] text-xl font-bold text-deep-sage flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Recipe: {title}
        </h2>
        <Image
          src="/logo.png"
          alt="Half Pint Mama"
          width={48}
          height={48}
          className="rounded-full flex-shrink-0"
        />
      </div>

      {/* Time Info Bar */}
      {hasTimeInfo && (
        <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-light-sage">
          {recipe.prepTime && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs text-charcoal/60 uppercase tracking-wide">Prep</p>
                <p className="font-semibold text-charcoal">{recipe.prepTime}</p>
              </div>
            </div>
          )}

          {recipe.cookTime && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              <div>
                <p className="text-xs text-charcoal/60 uppercase tracking-wide">Cook</p>
                <p className="font-semibold text-charcoal">{recipe.cookTime}</p>
              </div>
            </div>
          )}

          {recipe.totalTime && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-deep-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs text-charcoal/60 uppercase tracking-wide">Total</p>
                <p className="font-semibold text-charcoal">{recipe.totalTime}</p>
              </div>
            </div>
          )}

          {recipe.servings && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-soft-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="text-xs text-charcoal/60 uppercase tracking-wide">Servings</p>
                <p className="font-semibold text-charcoal">{baseServings}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scaler + Ingredients */}
      {hasIngredients && (
        <div id="ingredient-checklist" className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            {recipe.servings && (
              <div className="mb-4" data-print-hide>
                <RecipeScaler
                  baseServings={baseServings}
                  currentServings={servings}
                  onServingsChange={setServings}
                />
              </div>
            )}
            <IngredientChecklist
              ingredients={recipe.ingredients!}
              scale={scale}
            />
          </div>

          {/* Nutrition */}
          {hasNutrition && (
            <div>
              <NutritionFacts
                nutrition={recipe.nutrition!}
                scale={1}
                servings={servings}
              />
            </div>
          )}
        </div>
      )}

      {/* Nutrition only (if no ingredients) */}
      {!hasIngredients && hasNutrition && (
        <NutritionFacts
          nutrition={recipe.nutrition!}
          scale={1}
          servings={servings}
        />
      )}

      {/* Instructions */}
      {hasInstructions && (
        <div className="mt-6 pt-6 border-t border-light-sage">
          <h3 className="font-[family-name:var(--font-crimson)] text-lg font-bold text-deep-sage mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Instructions
          </h3>
          <ol className="space-y-3">
            {recipe.instructions!.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sage text-white text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-charcoal/80 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Print note */}
      <p className="text-xs text-charcoal/50 text-center mt-4 hidden" data-print-show>
        Recipe from halfpintmama.com
      </p>
    </div>
  );
}
