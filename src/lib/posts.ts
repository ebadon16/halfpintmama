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
}

// GROQ projections
const postMetaProjection = `{
  "slug": slug.current,
  title,
  date,
  category,
  excerpt,
  "image": coalesce(image.asset->url, externalImageUrl, ""),
  "tags": coalesce(tags, [])
}`;

const postFullProjection = `{
  "slug": slug.current,
  title,
  date,
  category,
  excerpt,
  "image": coalesce(image.asset->url, externalImageUrl, ""),
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
