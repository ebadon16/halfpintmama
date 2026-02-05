import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/sanitize";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = "keegan@halfpintmama.com";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Trim and length-limit fields
    const safeName = escapeHtml((typeof name === "string" ? name : "").trim().slice(0, 100));
    const safeEmail = escapeHtml(email.trim().slice(0, 254));
    const safeSubject = escapeHtml((typeof subject === "string" ? subject : "").trim().slice(0, 200));
    const safeMessage = escapeHtml(message.trim().slice(0, 5000));

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Half Pint Mama <noreply@halfpintmama.com>",
        to: CONTACT_EMAIL,
        reply_to: safeEmail,
        subject: `Contact Form: ${safeSubject || "New Message"}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName || "Not provided"}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject || "Not provided"}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
