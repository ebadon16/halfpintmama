import { client } from "@/sanity/client";
import type { PortableTextBlock } from "@portabletext/react";

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export interface IngredientSection {
  title: string;
  items: string[];
}

export interface InstructionSection {
  title: string;
  steps: string[];
}

export interface RecipeInfo {
  servings?: number;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients?: string[];
  ingredientSections?: IngredientSection[];
  instructions?: string[];
  instructionSections?: InstructionSection[];
  nutrition?: NutritionInfo;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  content: PortableTextBlock[];
  tags: string[];
  recipe?: RecipeInfo;
  ratingAverage?: number;
  ratingCount?: number;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  tags: string[];
  ratingAverage?: number;
  ratingCount?: number;
}

export const POSTS_PER_PAGE = 12;

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// GROQ projections
const postMetaProjection = `{
  "slug": slug.current,
  title,
  date,
  category,
  excerpt,
  "image": coalesce(image.asset->url, ""),
  "tags": coalesce(tags, []),
  "ratingAverage": coalesce(ratingAverage, 0),
  "ratingCount": coalesce(ratingCount, 0)
}`;

const postFullProjection = `{
  "slug": slug.current,
  title,
  date,
  category,
  excerpt,
  "image": coalesce(image.asset->url, ""),
  "tags": coalesce(tags, []),
  "content": coalesce(body, []),
  recipe,
  "ratingAverage": coalesce(ratingAverage, 0),
  "ratingCount": coalesce(ratingCount, 0)
}`;

export async function getAllPosts(): Promise<PostMeta[]> {
  return client.fetch(
    `*[_type == "post"] | order(date desc) ${postMetaProjection}`
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0] ${postFullProjection}`,
    { slug }
  );
  return post || null;
}

export async function getPostsByCategory(category: string): Promise<PostMeta[]> {
  return client.fetch(
    `*[_type == "post" && category == $category] | order(date desc) ${postMetaProjection}`,
    { category }
  );
}

export async function getPostsBySubcategory(
  category: string,
  keywords: string[],
  excludeKeywords: string[] = []
): Promise<PostMeta[]> {
  const includeConditions = keywords.map((_, i) => `title match $kw${i}`).join(" || ");
  const excludeConditions = excludeKeywords.length > 0
    ? ` && !(${excludeKeywords.map((_, i) => `title match $ex${i}`).join(" || ")})`
    : "";

  const params: Record<string, string> = { category };
  keywords.forEach((kw, i) => { params[`kw${i}`] = `*${kw}*`; });
  excludeKeywords.forEach((kw, i) => { params[`ex${i}`] = `*${kw}*`; });

  return client.fetch(
    `*[_type == "post" && category == $category && (${includeConditions})${excludeConditions}] | order(date desc) ${postMetaProjection}`,
    params
  );
}

export async function getAllCategories(): Promise<string[]> {
  return client.fetch(
    `array::unique(*[_type == "post"].category)`
  );
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  return client.fetch<PostMeta[]>(
    `*[_type == "post" && $tag in tags[]{ "v": lower(@) }.v] | order(date desc) ${postMetaProjection}`,
    { tag: tag.toLowerCase() } as Record<string, string>
  );
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const allTags = await client.fetch<string[]>(
    `*[_type == "post" && defined(tags)].tags[]`
  );
  const tagCounts = new Map<string, number>();

  allTags.forEach((t) => {
    const normalizedTag = t.toLowerCase();
    tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Pagination functions
export async function getPaginatedPosts(
  page: number,
  perPage: number = POSTS_PER_PAGE
): Promise<PaginatedResult<PostMeta>> {
  const validPage = Math.max(1, page);
  const start = (validPage - 1) * perPage;

  const [items, totalCount] = await Promise.all([
    client.fetch(
      `*[_type == "post"] | order(date desc) ${postMetaProjection}[$start...$end]`,
      { start, end: start + perPage }
    ),
    client.fetch(`count(*[_type == "post"])`),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return {
    items,
    totalCount,
    currentPage: validPage,
    totalPages,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };
}

export async function getPaginatedPostsByCategory(
  category: string,
  page: number,
  perPage: number = POSTS_PER_PAGE
): Promise<PaginatedResult<PostMeta>> {
  const validPage = Math.max(1, page);
  const start = (validPage - 1) * perPage;

  const [items, totalCount] = await Promise.all([
    client.fetch(
      `*[_type == "post" && category == $category] | order(date desc) ${postMetaProjection}[$start...$end]`,
      { category, start, end: start + perPage }
    ),
    client.fetch(`count(*[_type == "post" && category == $category])`, { category }),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return {
    items,
    totalCount,
    currentPage: validPage,
    totalPages,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };
}

export async function getPaginatedPostsByTag(
  tag: string,
  page: number,
  perPage: number = POSTS_PER_PAGE
): Promise<PaginatedResult<PostMeta>> {
  const validPage = Math.max(1, page);
  const start = (validPage - 1) * perPage;
  const normalizedTag = tag.toLowerCase();

  const [items, totalCount] = await Promise.all([
    client.fetch<PostMeta[]>(
      `*[_type == "post" && $tag in tags[]{ "v": lower(@) }.v] | order(date desc) ${postMetaProjection}[$start...$end]`,
      { tag: normalizedTag, start, end: start + perPage } as Record<string, string | number>
    ),
    client.fetch<number>(`count(*[_type == "post" && $tag in tags[]{ "v": lower(@) }.v])`, { tag: normalizedTag } as Record<string, string>),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return {
    items,
    totalCount,
    currentPage: validPage,
    totalPages,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };
}

export async function getPaginatedPostsBySubcategory(
  category: string,
  keywords: string[],
  excludeKeywords: string[],
  page: number,
  perPage: number = POSTS_PER_PAGE
): Promise<PaginatedResult<PostMeta>> {
  const validPage = Math.max(1, page);
  const start = (validPage - 1) * perPage;

  const includeConditions = keywords.map((_, i) => `title match $kw${i}`).join(" || ");
  const excludeConditions = excludeKeywords.length > 0
    ? ` && !(${excludeKeywords.map((_, i) => `title match $ex${i}`).join(" || ")})`
    : "";

  const params: Record<string, string | number> = { category, start, end: start + perPage };
  keywords.forEach((kw, i) => { params[`kw${i}`] = `*${kw}*`; });
  excludeKeywords.forEach((kw, i) => { params[`ex${i}`] = `*${kw}*`; });

  const filter = `_type == "post" && category == $category && (${includeConditions})${excludeConditions}`;

  const [items, totalCount] = await Promise.all([
    client.fetch(
      `*[${filter}] | order(date desc) ${postMetaProjection}[$start...$end]`,
      params
    ),
    client.fetch(`count(*[${filter}])`, params),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return {
    items,
    totalCount,
    currentPage: validPage,
    totalPages,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };
}

// Related posts by tag similarity — uses targeted GROQ query instead of fetching all posts
export async function getRelatedPostsByTags(
  currentSlug: string,
  currentTags: string[],
  currentCategory: string,
  limit: number = 3
): Promise<PostMeta[]> {
  if (currentTags.length === 0) {
    // No tags — fall back to same-category posts
    return client.fetch<PostMeta[]>(
      `*[_type == "post" && slug.current != $slug && category == $category] | order(date desc) [0...$limit] ${postMetaProjection}`,
      { slug: currentSlug, category: currentCategory, limit }
    );
  }

  const normalizedTags = currentTags.map((t) => t.toLowerCase());

  // Fetch candidate posts that share a tag OR category with the current post
  const candidates = await client.fetch<PostMeta[]>(
    `*[_type == "post" && slug.current != $slug && (category == $category || count((tags[])[lower(@) in $tags]) > 0)] | order(date desc) [0...20] ${postMetaProjection}`,
    { slug: currentSlug, category: currentCategory, tags: normalizedTags }
  );

  // Score by tag similarity (JS-side on small set)
  const scored = candidates.map((post) => {
    const postTags = post.tags.map((t) => t.toLowerCase());
    const matchingTags = normalizedTags.filter((t) => postTags.includes(t));
    const sameCategory = post.category === currentCategory ? 0.5 : 0;
    return { post, score: matchingTags.length + sameCategory };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((r) => r.post);
}

// Popular posts (highest rated)
export async function getPopularPosts(limit: number = 4): Promise<PostMeta[]> {
  const posts = await client.fetch<PostMeta[]>(
    `*[_type == "post" && ratingCount > 0] | order(ratingAverage desc, ratingCount desc) [0...${limit}] ${postMetaProjection}`
  );

  // Fall back to latest posts if no ratings exist
  if (posts.length === 0) {
    return client.fetch<PostMeta[]>(
      `*[_type == "post"] | order(date desc) [0...${limit}] ${postMetaProjection}`
    );
  }

  return posts;
}

// Single latest post
export async function getLatestPost(): Promise<PostMeta | null> {
  const posts = await client.fetch<PostMeta[]>(
    `*[_type == "post"] | order(date desc) [0...1] ${postMetaProjection}`
  );
  return posts[0] || null;
}
