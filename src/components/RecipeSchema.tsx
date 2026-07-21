import type { RecipeInfo } from "@/lib/posts";
import { jsonLdHtml, DEFAULT_OG_IMAGE } from "@/lib/seo";

// Schema.org requires ISO 8601 durations (PT5M), but Sanity stores free-text
// display strings ("5 min", "1 hour 30 min"). Convert at emit time; return
// null for unparseable values so they are omitted rather than emitted invalid.
export function toIsoDuration(text: string): string | null {
  const trimmed = text.trim();
  // Already ISO 8601: pass through untouched (re-parsing "PT1H30M" with the
  // word-boundary regexes below would silently drop the hours).
  if (/^pt(?=\d)(\d+(?:\.\d+)?h)?(\d+m)?(\d+s)?$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  // Ranges ("30-40 min"): deliberately take the UPPER bound, the worst-case
  // time a cook should plan for.
  const t = trimmed.toLowerCase().replace(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/g, "$2");
  // (?![a-z]) instead of \b: "1h30m" has no word boundary between "h" and "3",
  // so \b silently dropped the hours from compact durations.
  const days = t.match(/(\d+(?:\.\d+)?)\s*(?:days?|d)(?![a-z])/);
  const hours = t.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)(?![a-z])/);
  const mins = t.match(/(\d+)\s*(?:minutes?|mins?|m)(?![a-z])/);
  let h = (days ? parseFloat(days[1]) * 24 : 0) + (hours ? parseFloat(hours[1]) : 0);
  let m = mins ? parseInt(mins[1], 10) : 0;
  if (!days && !hours && !mins) {
    const bare = t.match(/^\s*(\d+)\s*$/); // bare number = minutes
    if (!bare) return null;
    m = parseInt(bare[1], 10);
  }
  if (h % 1) {
    m += Math.round((h % 1) * 60);
    h = Math.floor(h);
  }
  if (m >= 60) {
    h += Math.floor(m / 60);
    m = m % 60;
  }
  if (h === 0 && m === 0) return null;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}`;
}

// Whether a post's recipe data is enough to emit Recipe schema; posts without
// it should fall back to BlogPosting instead of emitting no article schema.
export function hasRecipeSchemaData(recipe: RecipeInfo | undefined): boolean {
  return !!(
    recipe &&
    ((recipe.ingredients?.length ?? 0) > 0 ||
      (recipe.instructions?.length ?? 0) > 0 ||
      (recipe.ingredientSections?.length ?? 0) > 0 ||
      (recipe.instructionSections?.length ?? 0) > 0)
  );
}

interface RecipeSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  recipe?: RecipeInfo;
  ratingAverage?: number;
  ratingCount?: number;
}

export function RecipeSchema({ title, description, image, datePublished, dateModified, slug, recipe, ratingAverage, ratingCount }: RecipeSchemaProps) {
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

  // Don't render Recipe schema without required fields (ingredients or instructions)
  if (ingredients.length === 0 && instructions.length === 0) {
    return null;
  }

  // Determine recipeCategory from title keywords
  const titleLower = title.toLowerCase();
  const recipeCategory = titleLower.includes("sourdough") || titleLower.includes("bread") || titleLower.includes("loaf")
    ? "Bread"
    : titleLower.includes("cookie") || titleLower.includes("cake") || titleLower.includes("brownie") || titleLower.includes("dessert")
    ? "Dessert"
    : titleLower.includes("snack") || titleLower.includes("cracker")
    ? "Snack"
    : "Recipe";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: title,
    description: description,
    image: [image || DEFAULT_OG_IMAGE.url],
    author: {
      "@type": "Person",
      "@id": `${baseUrl}/about#person`,
      name: "Keegan",
      url: `${baseUrl}/about`,
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    publisher: {
      "@type": "Organization",
      name: "Half Pint Mama",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.jpg`,
      },
    },
    url: `${baseUrl}/posts/${slug}`,
    recipeCategory,
    keywords: `${title}, recipe, homemade`,
  };

  if (ingredients.length > 0) schema.recipeIngredient = ingredients;
  if (instructions.length > 0) schema.recipeInstructions = instructions;
  const prepIso = recipe?.prepTime ? toIsoDuration(recipe.prepTime) : null;
  const cookIso = recipe?.cookTime ? toIsoDuration(recipe.cookTime) : null;
  const totalIso = recipe?.totalTime ? toIsoDuration(recipe.totalTime) : null;
  if (prepIso) schema.prepTime = prepIso;
  if (cookIso) schema.cookTime = cookIso;
  if (totalIso) schema.totalTime = totalIso;
  if (recipe?.servings) schema.recipeYield = `${recipe.servings} servings`;

  if (ratingCount && ratingCount > 0 && ratingAverage) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingAverage,
      reviewCount: ratingCount,
    };
  }

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
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(schema) }}
    />
  );
}

interface BlogPostSchemaProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  category: string;
  ratingAverage?: number;
  ratingCount?: number;
}

export function BlogPostSchema({ title, description, image, datePublished, dateModified, slug, category, ratingAverage, ratingCount }: BlogPostSchemaProps) {
  const baseUrl = "https://halfpintmama.com";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    ...(image ? { image: [image] } : {}),
    author: {
      "@type": "Person",
      "@id": `${baseUrl}/about#person`,
      name: "Keegan",
      url: `${baseUrl}/about`,
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
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

  if (ratingCount && ratingCount > 0 && ratingAverage) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingAverage,
      reviewCount: ratingCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(schema) }}
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
  // Don't render HowTo schema without steps — Google requires at least one step
  if (!steps || steps.length === 0) {
    return null;
  }

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
      "@id": `${baseUrl}/about#person`,
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

  const estimatedIso = estimatedTime ? toIsoDuration(estimatedTime) : null;
  if (estimatedIso) {
    schema.totalTime = estimatedIso;
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
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(schema) }}
    />
  );
}
