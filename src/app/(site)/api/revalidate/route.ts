import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (
    process.env.SANITY_REVALIDATE_SECRET &&
    secret !== process.env.SANITY_REVALIDATE_SECRET
  ) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = body?.slug?.current;
    const type = body?._type;

    // Revalidate specific post page if slug provided
    if (type === "post" && slug) {
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
    revalidatePath("/travel");
    revalidatePath("/diy");
    revalidatePath("/mama-life");
    revalidatePath("/tags");
    revalidatePath("/start-here");
    revalidatePath("/lifestyle");
    revalidatePath("/feed.xml");

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: "Error revalidating" }, { status: 500 });
  }
}
