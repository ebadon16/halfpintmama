import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { formatDate } from "@/lib/posts";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/http";

export const revalidate = 3600;

const SEARCH_RESULT_LIMIT = 50;

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimit(ip, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = (searchParams.get("q")?.trim().toLowerCase() || "").slice(0, 200);
  const category = (searchParams.get("category") || "").slice(0, 50);
  const startDate = (searchParams.get("startDate") || "").slice(0, 10);
  const endDate = (searchParams.get("endDate") || "").slice(0, 10);

  // Build dynamic GROQ filter
  const conditions: string[] = ['_type == "post"'];
  const params: Record<string, string> = {};

  if (query) {
    conditions.push(
      "(title match $qp || excerpt match $qp || category match $qp || count((tags[])[lower(@) match $qp]) > 0)"
    );
    params.qp = `*${query}*`;
  }

  if (category) {
    conditions.push("category == $category");
    params.category = category;
  }

  if (startDate) {
    conditions.push("date >= $startDate");
    params.startDate = startDate;
  }

  if (endDate) {
    conditions.push("date <= $endDate");
    params.endDate = endDate;
  }

  const filter = conditions.join(" && ");

  try {
    const results = await client.fetch<
      Array<{
        slug: string;
        title: string;
        excerpt: string;
        category: string;
        date: string;
        image: string;
        ratingAverage: number;
        ratingCount: number;
        readingTime: number;
      }>
    >(
      `*[${filter}] | order(date desc) [0...${SEARCH_RESULT_LIMIT}] {
        "slug": slug.current,
        title,
        excerpt,
        category,
        date,
        "image": coalesce(image.asset->url, ""),
        "ratingAverage": coalesce(ratingAverage, 0),
        "ratingCount": coalesce(ratingCount, 0),
        "readingTime": select(
          count(string::split(pt::text(body), " ")) >= 200 =>
            round(count(string::split(pt::text(body), " ")) / 200),
          1
        )
      }`,
      params
    );

    return NextResponse.json({
      results: results.map((r) => ({
        ...r,
        date: formatDate(r.date),
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
