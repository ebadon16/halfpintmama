import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { rateLimit } from "@/lib/rate-limit";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

interface RatingData {
  postSlug: string;
  rating: number;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimit(ip, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const data: RatingData = await request.json();
    const { postSlug, rating } = data;

    // Validate inputs
    if (!postSlug || typeof postSlug !== "string" || !postSlug.trim()) {
      return NextResponse.json({ error: "Post slug is required" }, { status: 400 });
    }
    if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be an integer from 1 to 5" }, { status: 400 });
    }

    // Retry loop to handle concurrent rating updates
    const MAX_RETRIES = 3;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      // Get the post document ID, revision, and current rating data
      const post = await client.fetch(
        `*[_type == "post" && slug.current == $slug][0]{ _id, _rev, ratingAverage, ratingCount }`,
        { slug: postSlug.trim() }
      );

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      // Calculate new average
      const currentCount = post.ratingCount || 0;
      const currentAverage = post.ratingAverage || 0;
      const newCount = currentCount + 1;
      const newAverage = ((currentAverage * currentCount) + rating) / newCount;

      try {
        // Update with revision check to prevent race conditions
        await client
          .patch(post._id)
          .ifRevisionId(post._rev)
          .set({
            ratingAverage: Math.round(newAverage * 100) / 100,
            ratingCount: newCount,
          })
          .commit();

        return NextResponse.json({
          success: true,
          ratingAverage: Math.round(newAverage * 100) / 100,
          ratingCount: newCount,
        });
      } catch (err: unknown) {
        // If revision mismatch, retry; otherwise rethrow
        const message = err instanceof Error ? err.message : String(err);
        if (attempt < MAX_RETRIES - 1 && message.includes("revision")) {
          continue;
        }
        throw err;
      }
    }

    return NextResponse.json({ error: "Failed to submit rating after retries" }, { status: 500 });
  } catch (error) {
    console.error("Error submitting rating:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 }
    );
  }
}
