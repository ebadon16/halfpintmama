import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SOURCES = ["website", "popup", "homepage", "post-mid", "post-bottom", "free-guide-hero", "mama-guide-hero"];
const VALID_SEGMENTS = ["kitchen", "mama", "both"];

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimit(ip, 5, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
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
    const MAMA_GROUP_ID = process.env.MAILERLITE_MAMA_GROUP_ID || MAILERLITE_GROUP_ID;

    // Determine groups based on segment
    const validSegment = VALID_SEGMENTS.includes(segment) ? segment : "both";
    const groups: string[] = [MAILERLITE_GROUP_ID]; // Always add to main group
    if (validSegment === "kitchen" || validSegment === "both") {
      if (KITCHEN_GROUP_ID !== MAILERLITE_GROUP_ID) groups.push(KITCHEN_GROUP_ID);
    }
    if (validSegment === "mama" || validSegment === "both") {
      if (MAMA_GROUP_ID !== MAILERLITE_GROUP_ID) groups.push(MAMA_GROUP_ID);
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
      const successMessages: Record<string, string> = {
        kitchen: "Welcome! Check your inbox for your free sourdough starter guide.",
        mama: "Welcome to the mama community! Check your inbox for what's coming next.",
        both: "Welcome to the Half Pint Mama family! Check your inbox for your free sourdough guide.",
      };
      return NextResponse.json(
        { message: successMessages[validSegment] || successMessages.both },
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
