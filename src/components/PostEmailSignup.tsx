"use client";

import { useState } from "react";
import { ThemedIcon } from "@/components/ThemedIcon";
import { PartyPopper, MailOpen, Mail } from "lucide-react";

export function PostEmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "post-mid" }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="my-10 p-6 bg-gradient-to-br from-light-sage/30 to-warm-beige/30 rounded-2xl">
        <div className="flex items-center gap-4">
          <ThemedIcon icon={PartyPopper} size="md" color="sage" />
          <p className="text-green-600 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 p-6 bg-gradient-to-br from-light-sage/30 to-warm-beige/30 rounded-2xl">
      <div className="flex items-start gap-4">
        <ThemedIcon icon={MailOpen} size="md" color="terracotta" />
        <div className="flex-1">
          <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-charcoal mb-2">
            Enjoying this post?
          </h3>
          <p className="text-charcoal/70 text-sm mb-4">
            Get more recipes, tips, and real mom moments delivered to your inbox weekly. Plus a free sourdough starter guide!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              aria-label="Email address"
              disabled={status === "loading"}
              className="flex-1 px-4 py-2 rounded-full border-2 border-sage focus:outline-none focus:ring-2 focus:ring-sage focus:border-deep-sage text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-4 py-2 gradient-cta text-white font-semibold rounded-full text-sm hover:shadow-md transition-all whitespace-nowrap disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
          {status === "error" && (
            <p role="alert" className="text-red-500 text-sm mt-2">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function BottomEmailCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "post-bottom" }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div role="status" className="gradient-cta rounded-2xl p-8 text-center text-white shadow-lg">
            <div className="flex justify-center mb-4"><PartyPopper className="w-10 h-10 text-white" /></div>
            <h2 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold mb-2">
              You&apos;re In!
            </h2>
            <p className="text-white/90 max-w-md mx-auto">
              {message}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="gradient-cta rounded-2xl p-8 text-center text-white shadow-lg">
          <div className="flex justify-center mb-4"><Mail className="w-10 h-10 text-white" /></div>
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold mb-2">
            Want More? Join My List!
          </h2>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            Weekly recipes, honest mom moments, and exclusive content. Plus get my free sourdough starter guide when you subscribe!
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              aria-label="Email address"
              disabled={status === "loading"}
              className="flex-1 px-4 py-3 rounded-full text-charcoal border-2 border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-deep-sage text-white font-semibold rounded-full hover:bg-charcoal transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Join Free"}
            </button>
          </form>
          {status === "error" && (
            <p role="alert" className="text-red-200 text-sm mt-3">{message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
