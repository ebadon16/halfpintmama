"use client";

import { useState } from "react";
import { PartyPopper, MailOpen } from "lucide-react";

export function HomeEmailSignup({ segment = "kitchen" }: { segment?: "kitchen" | "mama-life" } = {}) {
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
        body: JSON.stringify({ email, source: "homepage", segment }),
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
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div role="status" className="gradient-cta rounded-2xl p-8 md:p-10 text-center text-white shadow-lg">
          <div className="flex justify-center mb-4"><PartyPopper className="w-10 h-10 text-white" /></div>
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl font-semibold mb-3">
            You&apos;re In!
          </h2>
          <p className="text-white/90 max-w-xl mx-auto">
            {message}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="gradient-cta rounded-2xl p-8 md:p-10 text-center text-white shadow-lg">
        <div className="flex justify-center mb-4"><MailOpen className="w-10 h-10 text-white" /></div>
        <h2 className="font-[family-name:var(--font-crimson)] text-2xl md:text-3xl font-semibold mb-3">
          Join the Half Pint Mama Community
        </h2>
        <p className="text-white/90 mb-6 max-w-xl mx-auto">
          {segment === "mama-life"
            ? "Honest parenting tips, real mama moments, and exclusive content — delivered straight to your inbox weekly."
            : "From-scratch recipes, honest mama moments, and a free sourdough starter guide — delivered straight to your inbox weekly."}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
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
            {status === "loading" ? "Sending..." : "Join Free"}
          </button>
        </form>
        {status === "error" && (
          <p role="alert" className="text-red-200 text-sm mt-3">{message}</p>
        )}
        <p className="text-white/80 text-xs mt-4">
          No spam, unsubscribe anytime. I respect your inbox.
        </p>
      </div>
    </section>
  );
}
