import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "keegan@halfpintmama.com";

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

    const postUrl = `https://halfpintmama.com/posts/${postSlug}#comments-section`;
    const ratingText = rating > 0 ? `${"⭐".repeat(rating)} (${rating}/5)` : "No rating";

    // Send notification to site owner
    await resend.emails.send({
      from: "Half Pint Mama <notifications@halfpintmama.com>",
      to: NOTIFICATION_EMAIL,
      subject: isReply
        ? `💬 New Reply on "${postTitle}"`
        : `⭐ New Review on "${postTitle}"`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #C4835F, #D4A894); padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">
              ${isReply ? "💬 New Reply" : "⭐ New Review"}
            </h1>
          </div>

          <div style="background: #FAF7F2; padding: 24px; border: 1px solid #E8DDD0; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #3D3D3D; margin: 0 0 16px;">
              <strong>${author}</strong> left a ${isReply ? "reply" : "review"} on <strong>"${postTitle}"</strong>
            </p>

            ${!isReply ? `
            <p style="color: #3D3D3D; margin: 0 0 16px;">
              <strong>Rating:</strong> ${ratingText}
            </p>
            ` : ""}

            ${isReply ? `
            <p style="color: #6B7F5F; margin: 0 0 8px; font-size: 14px;">
              In reply to ${replyToAuthor}:
            </p>
            ` : ""}

            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #9CAF88; margin: 16px 0;">
              <p style="color: #3D3D3D; margin: 0; line-height: 1.6;">
                "${content}"
              </p>
            </div>

            <p style="color: #666; font-size: 14px; margin: 16px 0 0;">
              <strong>From:</strong> ${author} (${email})
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
        subject: `${author} replied to your comment on Half Pint Mama`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #9CAF88, #6B7F5F); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">
                💬 Someone Replied to Your Comment!
              </h1>
            </div>

            <div style="background: #FAF7F2; padding: 24px; border: 1px solid #E8DDD0; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="color: #3D3D3D; margin: 0 0 16px;">
                Hi ${replyToAuthor}! <strong>${author}</strong> replied to your comment on <strong>"${postTitle}"</strong>
              </p>

              <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #9CAF88; margin: 16px 0;">
                <p style="color: #3D3D3D; margin: 0; line-height: 1.6;">
                  "${content}"
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
