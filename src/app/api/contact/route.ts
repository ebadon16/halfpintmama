import { NextResponse } from "next/server";

const API_KEY = process.env.MAILERLITE_API_KEY;

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      console.error("MAILERLITE_API_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Add subscriber to MailerLite with contact form details in custom fields
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          fields: {
            name: name || "",
            last_name: "",
            company: subject || "Contact Form",
          },
          groups: ["177693621388051535"],
          status: "active",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // If subscriber already exists, that's okay for contact form
      if (data.message?.includes("already")) {
        // Still a success - they submitted the form
        console.log(`Contact form from existing subscriber: ${email}`);
      } else {
        console.error("MailerLite error:", data);
        return NextResponse.json(
          { error: "Failed to submit" },
          { status: 500 }
        );
      }
    }

    // Log the contact form submission for your records
    console.log("=== CONTACT FORM SUBMISSION ===");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log("================================");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
