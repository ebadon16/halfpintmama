import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { escapeHtml } from "@/lib/sanitize";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "keegan@halfpintmama.com";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CommentData {
  author: string;
  email: string;
  content: string;
  rating: number;
  postSlug: string;
  postTitle: string;
  isReply?: boolean;
  replyToAuthor?: string;
  replyToEmail?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: CommentData = await request.json();
    const { author, email, content, rating, postSlug, postTitle, isReply, replyToAuthor, replyToEmail } = data;

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

    // Trim, length-limit, and escape all user-provided values
    const safeAuthor = escapeHtml(author.trim().slice(0, 100));
    const safeEmail = escapeHtml(email.trim().slice(0, 254));
    const safeContent = escapeHtml(content.trim().slice(0, 2000));
    const safePostSlug = escapeHtml(postSlug.trim().slice(0, 200));
    const safePostTitle = escapeHtml(postTitle.trim().slice(0, 200));
    const safeReplyToAuthor = replyToAuthor ? escapeHtml(String(replyToAuthor).trim().slice(0, 100)) : "";

    const postUrl = `https://halfpintmama.com/posts/${safePostSlug}#comments-section`;
    const ratingText = rating > 0 ? `${"⭐".repeat(rating)} (${rating}/5)` : "No rating";

    // Send notification to site owner
    await resend.emails.send({
      from: "Half Pint Mama <notifications@halfpintmama.com>",
      to: NOTIFICATION_EMAIL,
      subject: isReply
        ? `💬 New Reply on "${safePostTitle}"`
        : `⭐ New Review on "${safePostTitle}"`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #C4835F, #D4A894); padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">
              ${isReply ? "💬 New Reply" : "⭐ New Review"}
            </h1>
          </div>

          <div style="background: #FAF7F2; padding: 24px; border: 1px solid #E8DDD0; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #3D3D3D; margin: 0 0 16px;">
              <strong>${safeAuthor}</strong> left a ${isReply ? "reply" : "review"} on <strong>"${safePostTitle}"</strong>
            </p>

            ${!isReply ? `
            <p style="color: #3D3D3D; margin: 0 0 16px;">
              <strong>Rating:</strong> ${ratingText}
            </p>
            ` : ""}

            ${isReply ? `
            <p style="color: #6B7F5F; margin: 0 0 8px; font-size: 14px;">
              In reply to ${safeReplyToAuthor}:
            </p>
            ` : ""}

            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #9CAF88; margin: 16px 0;">
              <p style="color: #3D3D3D; margin: 0; line-height: 1.6;">
                "${safeContent}"
              </p>
            </div>

            <p style="color: #666; font-size: 14px; margin: 16px 0 0;">
              <strong>From:</strong> ${safeAuthor} (${safeEmail})
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
    });

    // If this is a reply, notify the original commenter
    if (isReply && replyToEmail && replyToEmail !== email) {
      await resend.emails.send({
        from: "Half Pint Mama <notifications@halfpintmama.com>",
        to: replyToEmail,
        subject: `${safeAuthor} replied to your comment on Half Pint Mama`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #9CAF88, #6B7F5F); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">
                💬 Someone Replied to Your Comment!
              </h1>
            </div>

            <div style="background: #FAF7F2; padding: 24px; border: 1px solid #E8DDD0; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="color: #3D3D3D; margin: 0 0 16px;">
                Hi ${safeReplyToAuthor}! <strong>${safeAuthor}</strong> replied to your comment on <strong>"${safePostTitle}"</strong>
              </p>

              <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #9CAF88; margin: 16px 0;">
                <p style="color: #3D3D3D; margin: 0; line-height: 1.6;">
                  "${safeContent}"
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
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending comment notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
