import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { escapeHtml } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "keegan@halfpintmama.com";

// Read client for fetching comments
const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

// Write client for creating comments
function getWriteClient() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error("SANITY_API_TOKEN is not configured");
  }
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CommentData {
  author: string;
  email: string;
  content: string;
  rating: number;
  postSlug: string;
  postTitle: string;
  isReply?: boolean;
  parentId?: string;
  replyToAuthor?: string;
  replyToEmail?: string;
}

// GET: Fetch comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get("postSlug");

    if (!postSlug) {
      return NextResponse.json({ error: "postSlug is required" }, { status: 400 });
    }

    const comments = await readClient.fetch(
      `*[_type == "comment" && postSlug == $postSlug && approved == true] | order(createdAt desc) {
        _id,
        author,
        content,
        rating,
        parentId,
        createdAt
      }`,
      { postSlug }
    );

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST: Create a new comment
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimit(ip, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const data: CommentData = await request.json();
    const { author, email, content, rating, postSlug, postTitle, isReply, parentId, replyToAuthor, replyToEmail } = data;

    // Validate required fields
    if (!author || typeof author !== "string" || !author.trim()) {
      return NextResponse.json({ error: "Author name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }
    if (!postSlug || typeof postSlug !== "string" || !postSlug.trim()) {
      return NextResponse.json({ error: "Post slug is required" }, { status: 400 });
    }
    if (!postTitle || typeof postTitle !== "string" || !postTitle.trim()) {
      return NextResponse.json({ error: "Post title is required" }, { status: 400 });
    }
    if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 0 || rating > 5) {
      return NextResponse.json({ error: "Rating must be an integer from 0 to 5" }, { status: 400 });
    }

    // Trim and length-limit values
    const safeAuthor = author.trim().slice(0, 100);
    const safeEmail = email.trim().slice(0, 254);
    const safeContent = content.trim().slice(0, 2000);
    const safePostSlug = postSlug.trim().slice(0, 200);

    // Create comment in Sanity
    const newComment = await getWriteClient().create({
      _type: "comment",
      postSlug: safePostSlug,
      author: safeAuthor,
      email: safeEmail,
      content: safeContent,
      rating: isReply ? 0 : rating,
      parentId: parentId || null,
      approved: true,
      createdAt: new Date().toISOString(),
    });

    // Escape HTML for email
    const escapedAuthor = escapeHtml(safeAuthor);
    const escapedContent = escapeHtml(safeContent);
    const escapedPostTitle = escapeHtml(postTitle.trim().slice(0, 200));
    const escapedReplyToAuthor = replyToAuthor ? escapeHtml(String(replyToAuthor).trim().slice(0, 100)) : "";

    const postUrl = `https://halfpintmama.com/posts/${safePostSlug}#comments-section`;
    const ratingText = rating > 0 ? `${"⭐".repeat(rating)} (${rating}/5)` : "No rating";

    // Send notification to site owner (non-blocking — comment is already saved)
    try { await resend.emails.send({
      from: "Half Pint Mama <notifications@halfpintmama.com>",
      to: NOTIFICATION_EMAIL,
      subject: isReply
        ? `💬 New Reply on "${escapedPostTitle}"`
        : `⭐ New Review on "${escapedPostTitle}"`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #C4835F, #D4A894); padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">
              ${isReply ? "💬 New Reply" : "⭐ New Review"}
            </h1>
          </div>

          <div style="background: #FAF7F2; padding: 24px; border: 1px solid #E8DDD0; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #3D3D3D; margin: 0 0 16px;">
              <strong>${escapedAuthor}</strong> left a ${isReply ? "reply" : "review"} on <strong>"${escapedPostTitle}"</strong>
            </p>

            ${!isReply ? `
            <p style="color: #3D3D3D; margin: 0 0 16px;">
              <strong>Rating:</strong> ${ratingText}
            </p>
            ` : ""}

            ${isReply ? `
            <p style="color: #6B7F5F; margin: 0 0 8px; font-size: 14px;">
              In reply to ${escapedReplyToAuthor}:
            </p>
            ` : ""}

            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #9CAF88; margin: 16px 0;">
              <p style="color: #3D3D3D; margin: 0; line-height: 1.6;">
                "${escapedContent}"
              </p>
            </div>

            <p style="color: #666; font-size: 14px; margin: 16px 0 0;">
              <strong>From:</strong> ${escapedAuthor} (${escapeHtml(safeEmail)})
            </p>

            <a href="${postUrl}" style="display: inline-block; background: linear-gradient(135deg, #C4835F, #D4A894); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; margin-top: 20px; font-weight: bold;">
              View on Site →
            </a>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
            Half Pint Mama | halfpintmama.com
          </p>
        </div>
      `,
    }); } catch (emailErr) { console.error("Failed to send owner notification:", emailErr); }

    // If this is a reply, look up parent comment email from Sanity and notify
    let resolvedReplyToEmail = replyToEmail;
    if (isReply && parentId) {
      try {
        const parentComment = await readClient.fetch<{ email?: string }>(
          `*[_type == "comment" && _id == $parentId][0]{ email }`,
          { parentId }
        );
        if (parentComment?.email) {
          resolvedReplyToEmail = parentComment.email;
        }
      } catch { /* failed to fetch parent — skip notification */ }
    }
    if (isReply && resolvedReplyToEmail && typeof resolvedReplyToEmail === "string" && EMAIL_REGEX.test(resolvedReplyToEmail.trim()) && resolvedReplyToEmail !== email) {
      try { await resend.emails.send({
        from: "Half Pint Mama <notifications@halfpintmama.com>",
        to: resolvedReplyToEmail,
        subject: `${escapedAuthor} replied to your comment on Half Pint Mama`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #9CAF88, #6B7F5F); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">
                💬 Someone Replied to Your Comment!
              </h1>
            </div>

            <div style="background: #FAF7F2; padding: 24px; border: 1px solid #E8DDD0; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="color: #3D3D3D; margin: 0 0 16px;">
                Hi ${escapedReplyToAuthor}! <strong>${escapedAuthor}</strong> replied to your comment on <strong>"${escapedPostTitle}"</strong>
              </p>

              <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #9CAF88; margin: 16px 0;">
                <p style="color: #3D3D3D; margin: 0; line-height: 1.6;">
                  "${escapedContent}"
                </p>
              </div>

              <a href="${postUrl}" style="display: inline-block; background: linear-gradient(135deg, #9CAF88, #6B7F5F); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; margin-top: 20px; font-weight: bold;">
                View the Conversation →
              </a>
            </div>

            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
              Half Pint Mama | halfpintmama.com
            </p>
          </div>
        `,
      }); } catch (emailErr) { console.error("Failed to send reply notification:", emailErr); }
    }

    return NextResponse.json({
      success: true,
      comment: {
        _id: newComment._id,
        author: safeAuthor,
        content: safeContent,
        rating: isReply ? 0 : rating,
        parentId: parentId || null,
        createdAt: newComment.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
