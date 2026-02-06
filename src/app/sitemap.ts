import { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";

type ChangeFrequency = "daily" | "weekly" | "monthly" | "always" | "hourly" | "yearly" | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://halfpintmama.com";
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  // Static pages (excludes /favorites which is noindexed client-only)
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/posts",
    "/cooking",
    "/cooking/sourdough",
    "/cooking/discard",
    "/cooking/desserts",
    "/cooking/snacks",
    "/travel",
    "/diy",
    "/lifestyle",
    "/mama-life",
    "/start-here",
    "/about",
    "/contact",
    "/shop",
    "/products",
    "/search",
    "/free-guide",
    "/tags",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-02-06"),
    changeFrequency: (route === "" ? "daily" : "weekly") as ChangeFrequency,
    priority: route === "" ? 1 : route === "/posts" ? 0.9 : route.includes("/cooking") ? 0.9 : 0.8,
  }));

  // Dynamic post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.7,
  }));

  // Tag pages
  const tagPages: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(t.tag)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as ChangeFrequency,
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...tagPages];
}
