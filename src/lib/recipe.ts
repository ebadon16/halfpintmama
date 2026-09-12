import type { RecipeInfo } from "@/lib/posts";

// Whether RecipeCard will actually render anything for this recipe.
//
// It lives here rather than in the component because the post page needs it
// too, to decide whether to show the "Jump to Recipe" button, and that page
// loads RecipeCard dynamically. Sharing one predicate is what stops the button
// pointing at a card that quietly returned null: a recipe carrying only
// instructions used to satisfy the button's check but not the card's.
export function hasRenderableRecipe(recipe: RecipeInfo | null | undefined): boolean {
  if (!recipe) return false;
  const hasTimeInfo = !!(recipe.prepTime || recipe.cookTime || recipe.totalTime || recipe.servings);
  const hasIngredients = !!(recipe.ingredients?.length || recipe.ingredientSections?.length);
  const hasNutrition = !!(recipe.nutrition && Object.keys(recipe.nutrition).length > 0);
  return hasTimeInfo || hasIngredients || hasNutrition;
}
