import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Accept secret from Authorization header (preferred) or query param (Sanity webhook default)
  const secret =
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    request.nextUrl.searchParams.get("secret");

  if (!process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = body?.slug?.current;
    const type = body?._type;
    const tags: string[] = Array.isArray(body?.tags) ? body.tags : [];

    // Revalidate specific post page if slug provided
    if (type === "post" && slug) {
      if (typeof slug !== "string" || !/^[a-z0-9][-a-z0-9]*$/.test(slug)) {
        return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
      }
      revalidatePath(`/posts/${slug}`);
    }

    // Revalidate listing pages
    revalidatePath("/");
    revalidatePath("/posts");
    revalidatePath("/cooking");
    revalidatePath("/cooking/sourdough");
    revalidatePath("/cooking/discard");
    revalidatePath("/cooking/desserts");
    revalidatePath("/cooking/snacks");
    revalidatePath("/mama-life");
    revalidatePath("/mama-life/parenting");
    revalidatePath("/mama-life/travel");
    revalidatePath("/mama-life/diy");
    revalidatePath("/mama-life/homesteading");
    revalidatePath("/tags");
    revalidatePath("/start-here");
    revalidatePath("/feed.xml");

    // Revalidate tag pages for this post's tags
    for (const tag of tags) {
      if (typeof tag === "string" && tag.trim()) {
        revalidatePath(`/tags/${encodeURIComponent(tag.toLowerCase().trim())}`);
      }
    }

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
  }
}
