"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemedIcon } from "@/components/ThemedIcon";
import { PartyPopper, Wheat, Check, Calendar, Wrench, BookOpen } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

function SignupForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, source }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        trackEvent("email_signup", { source });
        // Show the API's message: it distinguishes new signup, already
        // subscribed, and the captured-but-not-yet-delivered fallback.
        setMessage(data.message || "You're in! Watch your inbox for your guides.");
        setEmail("");
        setFirstName("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-light-sage/30 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-2"><ThemedIcon icon={PartyPopper} size="md" color="sage" /></div>
        <p className="text-deep-sage font-semibold">You&apos;re in!</p>
        <p className="text-charcoal/80 text-sm mb-4">{message}</p>
        <div className="text-left space-y-2 text-sm">
          <p className="text-charcoal/80 font-medium">While you wait, check out:</p>
          <Link href="/posts/the-simple-no-stress-guide-to-your-first-artisan-sourdough-loaf" className="block text-terracotta hover:text-deep-sage transition-colors">
            &rarr; Next up: bake your first artisan loaf
          </Link>
          <Link href="/cooking/sourdough" className="block text-terracotta hover:text-deep-sage transition-colors">
            &rarr; All Sourdough Recipes
          </Link>
        </div>
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
          aria-label="Email address"
          required
          className="w-full px-4 py-3 border-2 border-warm-beige rounded-lg focus:outline-none focus:border-sage transition-colors"
        />
      </div>
      {status === "error" && (
        <p role="alert" className="text-red-500 text-sm">{message || "Something went wrong. Please try again."}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 gradient-cta text-white font-semibold rounded-lg hover:shadow-lg transition-all text-lg disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Me the Free Guides!"}
      </button>
    </form>
  );
}

interface FreeGuideContentProps {
  cookingPosts: number;
}

export function FreeGuideContent({ cookingPosts }: FreeGuideContentProps) {
  return (
    <>
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
                  <div className="flex justify-center mb-4"><ThemedIcon icon={Wheat} size="xl" color="terracotta" /></div>
                  <p className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-bold mb-2">
                    Sourdough Starter Guide
                  </p>
                  <p className="text-charcoal/80 text-sm">
                    Your Complete Beginner&apos;s Guide
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-charcoal/80">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Day-by-day starter creation guide
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/80">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Printable feeding schedule
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/80">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Troubleshooting FAQ
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/80">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    4 beginner-friendly recipes
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/80">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Video tutorial links
                  </div>
                </div>

                {/* The second guide is part of the deal, not a bonus: one
                    welcome email carries both PDFs. Not the printable freezer
                    labels, which are a preorder-only bonus with the book. */}
                <div className="mt-6 pt-5 border-t border-warm-beige text-center">
                  <p className="text-terracotta text-xs font-semibold uppercase tracking-wide mb-1">
                    Also included
                  </p>
                  <p className="font-[family-name:var(--font-crimson)] text-lg text-deep-sage font-bold mb-1">
                    Postpartum Freezer Prep Guide
                  </p>
                  <p className="text-charcoal/80 text-sm">
                    How to fill your freezer with nourishing meals before baby arrives. Both guides come in the same welcome email.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Signup Form */}
            <div className="md:w-1/2">
              <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
                Get Your Two Free Guides
              </h1>
              <p className="text-charcoal/80 text-sm mb-4 flex items-center justify-start gap-2">
                <span className="text-yellow-500">&#9733;</span>
                {cookingPosts}+ tested recipes on the blog &middot; Written by a Pediatric ER RN
              </p>
              <p className="text-charcoal/80 text-lg mb-6">
                Everything you need to create your first sourdough starter and bake your first loaf - even if you&apos;ve never baked bread before. Subscribing gets you both this and my Postpartum Freezer Prep Guide, free.
              </p>

              {/* Signup Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <SignupForm source="free-guide-hero" />
                <p className="text-charcoal/80 text-xs text-center mt-4">
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
            What&apos;s Inside the Sourdough Guide
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-terracotta" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Day-by-Day Guide</h3>
              <p className="text-charcoal/80 text-sm">
                Exactly what to do each day for 9 days. No guessing, just follow along.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-7 h-7 text-sage" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Troubleshooting Tips</h3>
              <p className="text-charcoal/80 text-sm">
                Starter not rising? Smells weird? I cover all the common problems and fixes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-soft-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wheat className="w-7 h-7 text-soft-pink" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Beginner Recipes</h3>
              <p className="text-charcoal/80 text-sm">
                4 recipes to try with your new starter, from simple loaves to sourdough pancakes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      {/* Journey next step: visible without submitting the form, so already-
          subscribed visitors aren't dead-ended here. Framed as read-ahead
          while the starter grows, not a skip past signing up. */}
      <section className="py-12 bg-cream">
        <div className="max-w-4xl mx-auto px-4">
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 border-2 border-terracotta/40 text-center">
            <p className="text-terracotta text-xs font-semibold uppercase tracking-wide mb-1">
              Next step
            </p>
            <h3 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-2">
              Bake Your First Loaf
            </h3>
            <p className="text-charcoal/80 text-sm mb-4">
              While your starter grows, read ahead so baking day is easy.
            </p>
            <Link
              href="/posts/the-simple-no-stress-guide-to-your-first-artisan-sourdough-loaf"
              className="inline-block px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-sm"
            >
              The No-Stress Artisan Loaf Guide
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-deep-sage/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-4">
            Coming Soon
          </h3>
          <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-md">
            <div className="flex justify-center mb-3"><ThemedIcon icon={BookOpen} size="lg" color="deep-sage" /></div>
            <h4 className="font-[family-name:var(--font-crimson)] text-lg font-semibold text-charcoal mb-2">
              Rest and Rise
            </h4>
            <p className="text-charcoal/80 text-sm mb-4">
              The post-partum cookbook. Real talk about the fourth trimester from a Pediatric ER RN and mama of three. Nurse-informed tips for recovery, feeding, and surviving those early days, plus easy freezer meals, sourdough recipes perfect for one-handed eating, and nourishing postpartum nutrition.
            </p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 border-2 border-deep-sage text-deep-sage text-sm font-semibold rounded-full hover:bg-deep-sage hover:text-white transition-all"
            >
              Join the Waitlist
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
