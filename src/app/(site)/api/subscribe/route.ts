import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp, isSameOrigin } from "@/lib/http";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SOURCES = ["website", "popup", "homepage", "post-mid", "post-bottom", "free-guide-hero", "mama-guide-hero", "shop-waitlist", "search-results", "footer", "cookbook-checklist", "cookbook-resources"];
const VALID_SEGMENTS = ["kitchen", "mama-life"];

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "keegan@halfpintmama.com";

// When MailerLite rejects a signup (subscriber cap reached, outage, etc.), email
// the address to the site owner so no lead is silently lost. Returns true only if
// the alert was actually delivered — the caller shows the visitor a friendly
// "you're on the list" message ONLY when we've captured them somewhere.
async function captureFailedSignup(details: {
  email: string;
  source: string;
  segment: string;
  reason: string;
}): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Half Pint Mama <noreply@halfpintmama.com>",
        to: NOTIFICATION_EMAIL,
        subject: `⚠️ Signup could not be added to MailerLite — ${details.email}`,
        text:
          "A newsletter/waitlist signup failed to reach MailerLite and needs to be added manually.\n\n" +
          `Email:   ${details.email}\n` +
          `Source:  ${details.source}\n` +
          `Segment: ${details.segment}\n` +
          `Reason:  ${details.reason}\n\n` +
          "This usually means the MailerLite subscriber limit has been reached. " +
          "Upgrade the plan (or free up space), then add this person manually.",
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("Failed-signup capture email failed:", err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = getClientIp(request);
    if (!rateLimit(`subscribe:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
    }

    const { email, firstName, source, segment } = await request.json();

    // Validate email
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const API_KEY = process.env.MAILERLITE_API_KEY;

    if (!API_KEY) {
      console.error("MailerLite API key not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Add subscriber to MailerLite with group assignment
    const MAILERLITE_GROUP_ID = "177682078317413870"; // New Subscribers group
    const KITCHEN_GROUP_ID = process.env.MAILERLITE_KITCHEN_GROUP_ID || MAILERLITE_GROUP_ID;
    const MAMA_GROUP_ID = process.env.MAILERLITE_MAMA_GROUP_ID;

    // Route to correct group based on segment
    const validSegment = VALID_SEGMENTS.includes(segment) ? segment : "kitchen";
    const groups: string[] = [MAILERLITE_GROUP_ID]; // Always add to main group
    if (validSegment === "mama-life" && MAMA_GROUP_ID) {
      groups.push(MAMA_GROUP_ID);
    } else if (validSegment === "kitchen" && KITCHEN_GROUP_ID !== MAILERLITE_GROUP_ID) {
      groups.push(KITCHEN_GROUP_ID);
    }

    const normalizedSource = VALID_SOURCES.includes(source) ? source : "website";

    let failureReason = "";
    try {
      const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          groups,
          fields: {
            // "source" is a reserved MailerLite field name and gets silently dropped
            signup_source: normalizedSource,
            segment: validSegment,
            ...(firstName && typeof firstName === "string" ? { name: firstName.trim().slice(0, 100) } : {}),
          },
        }),
      });

      const data = await response.json();

      if (response.ok || response.status === 200 || response.status === 201) {
        const successMessage = validSegment === "mama-life"
          ? "Welcome to the community! You'll get weekly mama tips and exclusive content. If the welcome email is not in your inbox, check your spam or promotions folder."
          : "Welcome! Check your inbox for your free sourdough starter guide. If you don't see it, check your spam or promotions folder.";
        return NextResponse.json(
          { message: successMessage },
          { status: 201 }
        );
      }

      // Handle already subscribed
      if (response.status === 409 || data.message?.includes("already")) {
        return NextResponse.json(
          { message: "You're already subscribed! Check your inbox for the latest updates." },
          { status: 200 }
        );
      }

      console.error("MailerLite error:", data);
      failureReason = `HTTP ${response.status}: ${data?.message || "unknown error"}`;
    } catch (mlError) {
      console.error("MailerLite request failed:", mlError);
      failureReason = `Request failed: ${mlError instanceof Error ? mlError.message : "network error"}`;
    }

    // MailerLite couldn't take the subscriber. Capture the lead so it isn't lost,
    // and only tell the visitor they're in if we actually saved them somewhere.
    const captured = await captureFailedSignup({
      email: email.toLowerCase().trim(),
      source: normalizedSource,
      segment: validSegment,
      reason: failureReason,
    });
    if (captured) {
      return NextResponse.json(
        { message: "You're on the list! We'll be in touch soon." },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
