import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { formatDate } from "@/lib/posts";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim().toLowerCase() || "";
  const category = searchParams.get("category") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

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
    `*[${filter}] | order(date desc) {
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
}
