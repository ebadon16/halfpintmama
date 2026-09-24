import { Resend } from "resend";
import { NextRequest, NextResponse, after } from "next/server";
import { createClient } from "@sanity/client";
import { escapeHtml } from "@/lib/sanitize";
import { emailButton, emailEyebrow, emailP, emailPanel, emailQuote, emailShell, emailSmall } from "@/lib/email-theme";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/http";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not configured");
    _resend = new Resend(key);
  }
  return _resend;
}
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "keegan@halfpintmama.com";


// Read client for fetching comments
const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-12-01",
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
    apiVersion: "2025-12-01",
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
  website?: string; // honeypot
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
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = getClientIp(request);
    if (!rateLimit(`comments:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
    }

    const data: CommentData = await request.json();
    const { author, email, content, rating, postSlug, postTitle, isReply, parentId, replyToAuthor } = data;

    // Honeypot: the hidden "website" field is never filled by humans.
    // Pretend success so bots don't learn they were filtered.
    if (typeof data.website === "string" && data.website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

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
    // Replies store 0 for rating; reviews require 1-5
    if (isReply) {
      if (rating !== undefined && rating !== 0) {
        return NextResponse.json({ error: "Replies should not include a rating" }, { status: 400 });
      }
    } else {
      // 1-5 for reviews; 0 allowed so returning readers who already rated can
      // leave follow-up comments (aggregates filter rating > 0, so 0 is inert).
      if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 0 || rating > 5) {
        return NextResponse.json({ error: "Rating must be an integer from 1 to 5" }, { status: 400 });
      }
    }

    // Validate parentId for replies
    if (isReply && parentId) {
      if (typeof parentId !== "string" || !parentId.trim()) {
        return NextResponse.json({ error: "Invalid parent comment ID" }, { status: 400 });
      }
    }

    // Trim and length-limit values
    const safeAuthor = author.trim().slice(0, 100);
    const safeEmail = email.trim().slice(0, 254);
    const safeContent = content.trim().slice(0, 2000);
    const safePostSlug = postSlug.trim().slice(0, 200);

    // Verify the post exists before creating a comment
    const postExists = await readClient.fetch<number>(
      `count(*[_type == "post" && slug.current == $slug])`,
      { slug: safePostSlug }
    );
    if (postExists === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

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

    // Keep the post's aggregate rating in sync with its approved reviews.
    // Recompute from source (race-safe) rather than incrementing, then patch the
    // post document — otherwise ratingAverage/ratingCount never reflect reviews.
    if (!isReply) {
      try {
        const wc = getWriteClient();
        const post = await wc.fetch<{ _id: string } | null>(
          `*[_type == "post" && slug.current == $slug][0]{ _id }`,
          { slug: safePostSlug }
        );
        if (post?._id) {
          const stats = await wc.fetch<{ avg: number | null; count: number }>(
            `{ "avg": math::avg(*[_type == "comment" && postSlug == $s && approved == true && rating > 0].rating),
               "count": count(*[_type == "comment" && postSlug == $s && approved == true && rating > 0]) }`,
            { s: safePostSlug }
          );
          await wc
            .patch(post._id)
            .set({
              ratingAverage: stats.avg ? Math.round(stats.avg * 10) / 10 : 0,
              ratingCount: stats.count,
            })
            .commit();
        }
      } catch (err) {
        console.error("Failed to update post rating aggregate:", err);
      }
    }

    // Escape HTML for email bodies. Subject headers are plain text, so they
    // use the raw (newline-stripped) values instead of HTML entities.
    const rawPostTitle = postTitle.trim().slice(0, 200).replace(/[\r\n]+/g, " ");
    const rawAuthorSubject = safeAuthor.replace(/[\r\n]+/g, " ");
    const escapedAuthor = escapeHtml(safeAuthor);
    const escapedContent = escapeHtml(safeContent);
    const escapedPostTitle = escapeHtml(rawPostTitle);
    const escapedReplyToAuthor = replyToAuthor ? escapeHtml(String(replyToAuthor).trim().slice(0, 100)) : "";

    const postUrl = `https://halfpintmama.com/posts/${safePostSlug}#comments-section`;

    // Notifications are best-effort and must not delay the response. The comment
    // is already saved, so run all email sends after the response is flushed.
    after(async () => {
    // Keegan's copy: same shell as everything else, no sign-off (it is to her).
    try { await getResend().emails.send({
      from: "Half Pint Mama <notifications@halfpintmama.com>",
      to: NOTIFICATION_EMAIL,
      subject: isReply
        ? `💬 New reply on "${rawPostTitle}"`
        : `⭐ New review on "${rawPostTitle}"`,
      html: emailShell(
        isReply ? "New reply" : "New review",
        emailP(`<strong>${escapedAuthor}</strong> left a ${isReply ? "reply" : "review"} on <em>${escapedPostTitle}</em>${!isReply && rating > 0 ? ` and rated it ${rating}/5` : ""}.`) +
          (isReply && escapedReplyToAuthor ? emailSmall(`In reply to ${escapedReplyToAuthor}.`) : "") +
          emailPanel(emailEyebrow(isReply ? "Their reply" : "Their review") + emailQuote(escapedContent)) +
          emailSmall(`From ${escapedAuthor} (${escapeHtml(safeEmail)})`) +
          emailButton(postUrl, "View on the site"),
        { signOff: false, reason: "Sent to you because a reader wrote on halfpintmama.com." }
      ),
    }); } catch (emailErr) { console.error("Failed to send owner notification:", emailErr); }

    // If this is a reply, notify the parent commenter — but ONLY at an address
    // resolved server-side from the stored parent comment. Never trust a
    // client-supplied reply-to email (would let anyone send mail to arbitrary
    // recipients through our domain).
    if (isReply && parentId) {
      let parentEmail: string | undefined;
      try {
        const parentComment = await readClient.fetch<{ email?: string }>(
          `*[_type == "comment" && _id == $parentId][0]{ email }`,
          { parentId }
        );
        parentEmail = parentComment?.email;
      } catch { /* failed to fetch parent, skip notification */ }

      // Cooldown: comment IDs are public, so without a cap an attacker could
      // use replies to spam any past commenter from our domain. Max 3
      // notifications per parent comment per day.
      if (parentEmail && EMAIL_REGEX.test(parentEmail.trim()) && parentEmail !== safeEmail && rateLimit(`reply-notify:${parentId}`, 3, 24 * 60 * 60 * 1000)) {
      try { await getResend().emails.send({
        from: "Keegan at Half Pint Mama <notifications@halfpintmama.com>",
        to: parentEmail,
        subject: `${rawAuthorSubject} replied to your comment on Half Pint Mama`,
        html: emailShell(
          "Someone wrote back",
          emailP(`<strong>${escapedAuthor}</strong> replied to your comment on <em>${escapedPostTitle}</em>:`) +
            emailPanel(emailQuote(escapedContent)) +
            emailButton(postUrl, "Read the conversation") +
            emailSmall("I only send these when someone answers you, never for anything else."),
          { lede: `Hi ${escapedReplyToAuthor || "friend"}, Keegan here.`, reason: "You are receiving this because you left a comment on halfpintmama.com." }
        ),
      }); } catch (emailErr) { console.error("Failed to send reply notification:", emailErr); }
      }
    }
    });

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
