import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

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

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const subscribersRef = collection(db, "subscribers");
    const q = query(subscribersRef, where("email", "==", normalizedEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json(
        { message: "You're already subscribed! Check your inbox for the latest updates." },
        { status: 200 }
      );
    }

    // Add new subscriber
    await addDoc(subscribersRef, {
      email: normalizedEmail,
      source: source || "website",
      subscribedAt: new Date().toISOString(),
      status: "active",
    });

    return NextResponse.json(
      { message: "Welcome to the Half Pint Mama family! Check your inbox for your free sourdough guide." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
