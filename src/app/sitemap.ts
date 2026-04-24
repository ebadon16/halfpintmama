import { MetadataRoute } from "next";
import { getAllPosts, getAllTags, POSTS_PER_PAGE } from "@/lib/posts";

type ChangeFrequency = "daily" | "weekly" | "monthly" | "always" | "hourly" | "yearly" | "never";

// Emit /path, /path?page=2, ... up to totalPages. Pairs with self-canonicals
// on each paginated page so Google can crawl deeper archives.
function paginatedUrls(
  baseUrl: string,
  path: string,
  totalItems: number,
  lastMod: Date,
  changeFreq: ChangeFrequency,
  priority: number,
): MetadataRoute.Sitemap {
  const totalPages = Math.max(1, Math.ceil(totalItems / POSTS_PER_PAGE));
  return Array.from({ length: totalPages }, (_, i) => {
    const pageNum = i + 1;
    return {
      url: pageNum === 1 ? `${baseUrl}${path}` : `${baseUrl}${path}?page=${pageNum}`,
      lastModified: lastMod,
      changeFrequency: changeFreq,
      priority: pageNum === 1 ? priority : Math.max(0.3, priority - 0.2),
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://halfpintmama.com";
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  const cookingPosts = posts.filter((p) => p.category === "cooking");
  const mamaLifePosts = posts.filter((p) => p.category === "mama-life");
  const buildDate = new Date();

  // Static pages that don't paginate (excludes noindexed /favorites, /shop, /mama-guide)
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/start-here",
    "/about",
    "/contact",
    "/products",
    "/search",
    "/free-guide",
    "/disclaimer",
    "/tags",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: buildDate,
    changeFrequency: (route === "" ? "daily" : "weekly") as ChangeFrequency,
    priority: route === "" ? 1 : 0.8,
  }));

  // Paginated sections — emit /path?page=N for each page
  const paginatedSections: MetadataRoute.Sitemap = [
    ...paginatedUrls(baseUrl, "/posts", posts.length, buildDate, "daily", 0.9),
    ...paginatedUrls(baseUrl, "/cooking", cookingPosts.length, buildDate, "daily", 0.9),
    ...paginatedUrls(baseUrl, "/mama-life", mamaLifePosts.length, buildDate, "daily", 0.9),
  ];

  // Subcategory pages — just page 1; content count is title-match based and hard to count cheaply
  const subcategoryPages: MetadataRoute.Sitemap = [
    "/cooking/sourdough",
    "/cooking/discard",
    "/cooking/desserts",
    "/cooking/snacks",
    "/mama-life/parenting",
    "/mama-life/travel",
    "/mama-life/diy",
    "/mama-life/homesteading",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: buildDate,
    changeFrequency: "weekly" as ChangeFrequency,
    priority: 0.8,
  }));

  // Post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.7,
  }));

  // Tag pages — emit page 1 plus deeper pages for tags with >POSTS_PER_PAGE posts
  const tagPages: MetadataRoute.Sitemap = tags.flatMap((t) =>
    paginatedUrls(baseUrl, `/tags/${encodeURIComponent(t.tag)}`, t.count, buildDate, "weekly", 0.5)
  );

  return [...staticPages, ...paginatedSections, ...subcategoryPages, ...postPages, ...tagPages];
}
