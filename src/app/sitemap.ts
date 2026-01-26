import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

type ChangeFrequency = "daily" | "weekly" | "monthly" | "always" | "hourly" | "yearly" | "never";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://halfpintmama.com";
  const posts = getAllPosts();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/cooking",
    "/cooking/sourdough",
    "/cooking/discard",
    "/cooking/desserts",
    "/cooking/snacks",
    "/lifestyle",
    "/mama-life",
    "/start-here",
    "/about",
    "/contact",
    "/shop",
    "/products",
    "/search",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as ChangeFrequency,
    priority: route === "" ? 1 : route.includes("/cooking") ? 0.9 : 0.8,
  }));

  // Dynamic post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages];
}
