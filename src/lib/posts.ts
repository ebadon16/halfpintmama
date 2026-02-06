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
  recipe
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
  const posts = await getPostsByCategory(category);
  return posts.filter(
    (post) =>
      keywords.some((kw) => post.title.toLowerCase().includes(kw.toLowerCase())) &&
      !excludeKeywords.some((kw) => post.title.toLowerCase().includes(kw.toLowerCase()))
  );
}

export async function getAllCategories(): Promise<string[]> {
  return client.fetch(
    `array::unique(*[_type == "post"].category)`
  );
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  return client.fetch<PostMeta[]>(
    `*[_type == "post" && $tag in tags] | order(date desc) ${postMetaProjection}`,
    { tag: tag.toLowerCase() } as Record<string, string>
  );
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts: PostMeta[] = await getAllPosts();
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((t) => {
      const normalizedTag = t.toLowerCase();
      tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
    });
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
      `*[_type == "post" && $tag in tags] | order(date desc) ${postMetaProjection}[$start...$end]`,
      { tag: normalizedTag, start, end: start + perPage } as Record<string, string | number>
    ),
    client.fetch<number>(`count(*[_type == "post" && $tag in tags])`, { tag: normalizedTag } as Record<string, string>),
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
  const allPosts = await getPostsBySubcategory(category, keywords, excludeKeywords);
  const validPage = Math.max(1, page);
  const start = (validPage - 1) * perPage;
  const totalCount = allPosts.length;
  const totalPages = Math.ceil(totalCount / perPage);

  return {
    items: allPosts.slice(start, start + perPage),
    totalCount,
    currentPage: validPage,
    totalPages,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };
}

// Related posts by tag similarity
export async function getRelatedPostsByTags(
  currentSlug: string,
  currentTags: string[],
  currentCategory: string,
  limit: number = 3
): Promise<PostMeta[]> {
  const allPosts = await getAllPosts();
  const otherPosts = allPosts.filter((p) => p.slug !== currentSlug);

  if (currentTags.length === 0) {
    // No tags — fall back to category
    return otherPosts.filter((p) => p.category === currentCategory).slice(0, limit);
  }

  const normalizedCurrentTags = currentTags.map((t) => t.toLowerCase());

  // Score posts by tag similarity
  const scored = otherPosts.map((post) => {
    const postTags = post.tags.map((t) => t.toLowerCase());
    const matchingTags = normalizedCurrentTags.filter((t) => postTags.includes(t));
    const sameCategory = post.category === currentCategory ? 0.5 : 0;
    return { post, score: matchingTags.length + sameCategory };
  });

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  // If no tag matches, fall back to category
  const topResults = scored.slice(0, limit);
  if (topResults.every((r) => r.score < 1)) {
    return otherPosts.filter((p) => p.category === currentCategory).slice(0, limit);
  }

  return topResults.map((r) => r.post);
}

// Popular posts (highest rated)
export async function getPopularPosts(limit: number = 4): Promise<PostMeta[]> {
  const posts = await client.fetch<PostMeta[]>(
    `*[_type == "post" && ratingCount > 0] | order(ratingAverage desc, ratingCount desc) ${postMetaProjection}[0...${limit}]`
  );

  // Fall back to latest posts if no ratings exist
  if (posts.length === 0) {
    return (await getAllPosts()).slice(0, limit);
  }

  return posts;
}

// Single latest post
export async function getLatestPost(): Promise<PostMeta | null> {
  const posts = await client.fetch<PostMeta[]>(
    `*[_type == "post"] | order(date desc) ${postMetaProjection}[0...1]`
  );
  return posts[0] || null;
}
