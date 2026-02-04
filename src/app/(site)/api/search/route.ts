import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, formatDate } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.toLowerCase() || "";
  const category = searchParams.get("category") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const allPosts = await getAllPosts();

  const results = allPosts
    .filter((post) => {
      // Text matching (includes tags)
      const textMatch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      // Category filter
      const categoryMatch = !category || post.category === category;

      // Date range filter
      const dateMatch =
        (!startDate || post.date >= startDate) &&
        (!endDate || post.date <= endDate);

      return textMatch && categoryMatch && dateMatch;
    })
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date: formatDate(post.date),
      image: post.image,
      tags: post.tags,
    }));

  return NextResponse.json({ results });
}
