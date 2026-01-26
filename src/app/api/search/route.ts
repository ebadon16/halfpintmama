import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, formatDate } from "@/lib/posts";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const allPosts = getAllPosts();

  const results = allPosts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(query);
    const excerptMatch = post.excerpt.toLowerCase().includes(query);
    const categoryMatch = post.category.toLowerCase().includes(query);

    return titleMatch || excerptMatch || categoryMatch;
  }).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    date: formatDate(post.date),
    image: post.image,
  }));

  return NextResponse.json({ results });
}
