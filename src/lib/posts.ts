import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export interface RecipeInfo {
  servings?: number;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients?: string[];
  nutrition?: NutritionInfo;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  content: string;
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

export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        category: data.category || 'uncategorized',
        excerpt: data.excerpt || '',
        image: data.image || '',
        tags: data.tags || [],
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Build recipe info if any recipe fields exist
    const recipe: RecipeInfo | undefined = (data.servings || data.prepTime || data.cookTime || data.ingredients || data.nutrition)
      ? {
          servings: data.servings,
          prepTime: data.prepTime,
          cookTime: data.cookTime,
          totalTime: data.totalTime,
          ingredients: data.ingredients,
          nutrition: data.nutrition,
        }
      : undefined;

    return {
      slug,
      title: data.title || slug,
      date: data.date || '',
      category: data.category || 'uncategorized',
      excerpt: data.excerpt || '',
      image: data.image || '',
      tags: data.tags || [],
      recipe,
      content,
    };
  } catch {
    return null;
  }
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostsBySubcategory(category: string, keywords: string[], excludeKeywords: string[] = []): PostMeta[] {
  return getAllPosts().filter(post =>
    post.category === category &&
    keywords.some(keyword =>
      post.title.toLowerCase().includes(keyword.toLowerCase())
    ) &&
    !excludeKeywords.some(keyword =>
      post.title.toLowerCase().includes(keyword.toLowerCase())
    )
  );
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = [...new Set(posts.map((post) => post.category))];
  return categories;
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagCounts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const normalizedTag = tag.toLowerCase();
      tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
