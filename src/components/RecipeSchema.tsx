import type { RecipeInfo } from "@/lib/posts";

interface RecipeSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  slug: string;
  recipe?: RecipeInfo;
}

export function RecipeSchema({ title, description, image, datePublished, slug, recipe }: RecipeSchemaProps) {
  const baseUrl = "https://halfpintmama.com";

  // Flatten ingredient sections into a single array if needed
  const ingredients = recipe?.ingredients?.length
    ? recipe.ingredients
    : recipe?.ingredientSections?.flatMap((s) => s.items) ?? [];

  // Build HowToStep objects from instructions
  const instructions = recipe?.instructions?.length
    ? recipe.instructions.map((step) => ({ "@type": "HowToStep" as const, text: step }))
    : recipe?.instructionSections?.flatMap((s) =>
        s.steps.map((step) => ({ "@type": "HowToStep" as const, text: step }))
      ) ?? [];

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: title,
    description: description,
    image: image ? [image] : [],
    author: {
      "@type": "Person",
      name: "Keegan",
      url: `${baseUrl}/about`,
    },
    datePublished: datePublished,
    publisher: {
      "@type": "Organization",
      name: "Half Pint Mama",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.jpg`,
      },
    },
    url: `${baseUrl}/posts/${slug}`,
    recipeCategory: "Sourdough",
    recipeCuisine: "American",
    keywords: `${title}, sourdough, recipe, homemade`,
  };

  if (ingredients.length > 0) schema.recipeIngredient = ingredients;
  if (instructions.length > 0) schema.recipeInstructions = instructions;
  if (recipe?.prepTime) schema.prepTime = recipe.prepTime;
  if (recipe?.cookTime) schema.cookTime = recipe.cookTime;
  if (recipe?.totalTime) schema.totalTime = recipe.totalTime;
  if (recipe?.servings) schema.recipeYield = `${recipe.servings} servings`;

  if (recipe?.nutrition) {
    const n = recipe.nutrition;
    const nutrition: Record<string, string> = { "@type": "NutritionInformation" };
    if (n.calories) nutrition.calories = `${n.calories} calories`;
    if (n.protein) nutrition.proteinContent = `${n.protein} g`;
    if (n.carbs) nutrition.carbohydrateContent = `${n.carbs} g`;
    if (n.fat) nutrition.fatContent = `${n.fat} g`;
    if (n.fiber) nutrition.fiberContent = `${n.fiber} g`;
    if (n.sugar) nutrition.sugarContent = `${n.sugar} g`;
    schema.nutrition = nutrition;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BlogPostSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  slug: string;
  category: string;
}

export function BlogPostSchema({ title, description, image, datePublished, slug, category }: BlogPostSchemaProps) {
  const baseUrl = "https://halfpintmama.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: image ? [image] : [],
    author: {
      "@type": "Person",
      name: "Keegan",
      url: `${baseUrl}/about`,
    },
    datePublished: datePublished,
    dateModified: datePublished,
    publisher: {
      "@type": "Organization",
      name: "Half Pint Mama",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/posts/${slug}`,
    },
    articleSection: category,
    keywords: `${title}, ${category}, half pint mama`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface HowToSchemaProps {
  title: string;
  description: string;
  image?: string;
  slug: string;
  estimatedTime?: string;
  steps?: string[];
}

export function HowToSchema({ title, description, image, slug, estimatedTime, steps }: HowToSchemaProps) {
  const baseUrl = "https://halfpintmama.com";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description: description,
    image: image ? { "@type": "ImageObject", url: image } : undefined,
    url: `${baseUrl}/posts/${slug}`,
    author: {
      "@type": "Person",
      name: "Keegan",
      url: `${baseUrl}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Half Pint Mama",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.jpg`,
      },
    },
  };

  if (estimatedTime) {
    schema.totalTime = estimatedTime;
  }

  if (steps && steps.length > 0) {
    schema.step = steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
