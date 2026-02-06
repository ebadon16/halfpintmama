"use client";

import { useState } from "react";

// FAQ Schema for SEO - common sourdough starter questions
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does it take to make a sourdough starter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It typically takes 7-10 days to create an active sourdough starter from scratch. The guide provides day-by-day instructions to help you through the process.",
      },
    },
    {
      "@type": "Question",
      name: "Why isn't my sourdough starter rising?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common reasons include using water that's too hot or too cold, not feeding often enough, or environmental temperature issues. The troubleshooting section covers all common problems and solutions.",
      },
    },
    {
      "@type": "Question",
      name: "What flour should I use for sourdough starter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All-purpose flour or bread flour work well for beginners. Whole wheat or rye flour can help establish a starter faster due to higher wild yeast content.",
      },
    },
    {
      "@type": "Question",
      name: "How often do I need to feed my sourdough starter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "During the initial creation phase, feed once or twice daily. Once established, a refrigerated starter only needs weekly feedings, or daily if kept at room temperature.",
      },
    },
  ],
};

function SignupForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, source }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setFirstName("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-light-sage/30 rounded-lg p-6 text-center">
        <span className="text-3xl block mb-2">🎉</span>
        <p className="text-deep-sage font-semibold">Check your inbox!</p>
        <p className="text-charcoal/70 text-sm">Your free guide is on its way.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {firstName !== undefined && (
        <div>
          <label htmlFor={`firstName-${source}`} className="block text-sm font-medium text-charcoal mb-1">
            First Name
          </label>
          <input
            type="text"
            id={`firstName-${source}`}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Your first name"
            className="w-full px-4 py-3 border-2 border-warm-beige rounded-lg focus:outline-none focus:border-sage transition-colors"
          />
        </div>
      )}
      <div>
        <label htmlFor={`email-${source}`} className="block text-sm font-medium text-charcoal mb-1">
          Email Address
        </label>
        <input
          type="email"
          id={`email-${source}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-3 border-2 border-warm-beige rounded-lg focus:outline-none focus:border-sage transition-colors"
        />
      </div>
      {status === "error" && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 gradient-cta text-white font-semibold rounded-lg hover:shadow-lg transition-all text-lg disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Me the Free Guide!"}
      </button>
    </form>
  );
}

export default function FreeGuidePage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-terracotta/10 to-cream py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="md:flex items-center gap-12">
            {/* Left: Guide Preview */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-terracotta/20 relative">
                <div className="absolute -top-4 -right-4 bg-terracotta text-white px-4 py-2 rounded-full font-semibold text-sm">
                  FREE!
                </div>
                <div className="text-center">
                  <span className="text-8xl block mb-4">🍞</span>
                  <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-bold mb-2">
                    Sourdough Starter Guide
                  </h2>
                  <p className="text-charcoal/60 text-sm">
                    Your Complete Beginner&apos;s Guide
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-charcoal/70">
                    <span className="text-sage text-lg">✓</span>
                    Day-by-day starter creation guide
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/70">
                    <span className="text-sage text-lg">✓</span>
                    Printable feeding schedule
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/70">
                    <span className="text-sage text-lg">✓</span>
                    Troubleshooting FAQ
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/70">
                    <span className="text-sage text-lg">✓</span>
                    4 beginner-friendly recipes
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/70">
                    <span className="text-sage text-lg">✓</span>
                    Video tutorial links
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Signup Form */}
            <div className="md:w-1/2">
              <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
                Get Your Free Sourdough Starter Guide
              </h1>
              <p className="text-charcoal/80 text-lg mb-6">
                Everything you need to create your first sourdough starter and bake your first loaf - even if you&apos;ve never baked bread before.
              </p>

              {/* Signup Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <SignupForm source="free-guide-hero" />
                <p className="text-charcoal/50 text-xs text-center mt-4">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 text-center">
            What&apos;s Inside the Guide
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Day-by-Day Guide</h3>
              <p className="text-charcoal/70 text-sm">
                Exactly what to do each day for 9 days. No guessing, just follow along.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Troubleshooting Tips</h3>
              <p className="text-charcoal/70 text-sm">
                Starter not rising? Smells weird? I cover all the common problems and fixes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-soft-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🥖</span>
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Beginner Recipes</h3>
              <p className="text-charcoal/70 text-sm">
                4 recipes to try with your new starter, from simple loaves to sourdough pancakes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-12 bg-deep-sage/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-4">
            Coming Soon
          </h3>
          <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-md">
            <span className="text-5xl block mb-3">📖</span>
            <h4 className="font-[family-name:var(--font-crimson)] text-lg font-semibold text-charcoal mb-2">
              The Postpartum Mama Book
            </h4>
            <p className="text-charcoal/70 text-sm">
              Real talk about the fourth trimester from a Pediatric ER RN and mama of two. Evidence-based tips for recovery, feeding, and surviving those early days—plus easy freezer meals, sourdough recipes perfect for one-handed eating, and nourishing postpartum nutrition.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
