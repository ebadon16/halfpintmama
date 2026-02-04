import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, source } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
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

    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        groups: [MAILERLITE_GROUP_ID],
        fields: {
          source: source || "website",
        },
      }),
    });

    const data = await response.json();

    if (response.ok || response.status === 200 || response.status === 201) {
      return NextResponse.json(
        { message: "Welcome to the Half Pint Mama family! Check your inbox for your free sourdough guide." },
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
