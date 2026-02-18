import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SOURCES = ["website", "popup", "homepage", "post-mid", "post-bottom", "free-guide-hero", "mama-guide-hero", "shop-waitlist", "search-results", "footer"];
const VALID_SEGMENTS = ["kitchen", "mama-life"];

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimit(ip, 5, 60_000)) {
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
    } else if (KITCHEN_GROUP_ID !== MAILERLITE_GROUP_ID) {
      groups.push(KITCHEN_GROUP_ID);
    }

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
          source: VALID_SOURCES.includes(source) ? source : "website",
          segment: validSegment,
          ...(firstName && typeof firstName === "string" ? { name: firstName.trim().slice(0, 100) } : {}),
        },
      }),
    });

    const data = await response.json();

    if (response.ok || response.status === 200 || response.status === 201) {
      const successMessage = validSegment === "mama-life"
        ? "Welcome to the community! You'll get weekly mama tips and exclusive content."
        : "Welcome! Check your inbox for your free sourdough starter guide.";
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
