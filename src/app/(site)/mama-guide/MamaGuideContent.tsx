"use client";

import { useState } from "react";
import { ThemedIcon } from "@/components/ThemedIcon";
import { PartyPopper, Heart, Check, Baby, Shield, BookOpen } from "lucide-react";

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
        body: JSON.stringify({ email, firstName, source, segment: "mama" }),
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
        <div className="flex justify-center mb-2"><ThemedIcon icon={PartyPopper} size="md" color="sage" /></div>
        <p className="text-deep-sage font-semibold">Check your inbox!</p>
        <p className="text-charcoal/70 text-sm">Your free guide is on its way.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <p role="alert" className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 bg-sage text-white font-semibold rounded-lg hover:bg-deep-sage hover:shadow-lg transition-all text-lg disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Me the Free Guide!"}
      </button>
    </form>
  );
}

export function MamaGuideContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sage/10 to-cream py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="md:flex items-center gap-12">
            {/* Left: Guide Preview */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-sage/20 relative">
                <div className="absolute -top-4 -right-4 bg-sage text-white px-4 py-2 rounded-full font-semibold text-sm">
                  FREE!
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-4"><ThemedIcon icon={Heart} size="xl" color="deep-sage" /></div>
                  <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-bold mb-2">
                    The Mama Life Guide
                  </h2>
                  <p className="text-charcoal/60 text-sm">
                    Real Tips for Real Motherhood
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-charcoal/70">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Newborn survival tips from a PEDS ER RN
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/70">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Honest postpartum recovery guide
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/70">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Baby gear that actually matters
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/70">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Toddler stage survival strategies
                  </div>
                  <div className="flex items-center gap-3 text-sm text-charcoal/70">
                    <Check className="w-5 h-5 text-sage flex-shrink-0" />
                    Encouragement from a mama who gets it
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Signup Form */}
            <div className="md:w-1/2">
              <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
                Get Your Free Mama Life Guide
              </h1>
              <p className="text-charcoal/80 text-lg mb-6">
                Honest, practical tips for navigating motherhood — from a Pediatric ER RN and mama of two who&apos;s been in the trenches.
              </p>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <SignupForm source="mama-guide-hero" />
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
              <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Baby className="w-7 h-7 text-sage" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Newborn Essentials</h3>
              <p className="text-charcoal/70 text-sm">
                What you actually need (and don&apos;t) for those first weeks. From a nurse who&apos;s seen it all.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-deep-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-deep-sage" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Recovery & Wellness</h3>
              <p className="text-charcoal/70 text-sm">
                Honest postpartum tips that no one tells you. Practical recovery advice from experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-soft-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7 text-soft-pink" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Beyond Survival Mode</h3>
              <p className="text-charcoal/70 text-sm">
                How to find your rhythm as a mama — from surviving to thriving, one season at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-deep-sage/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-4">
            Why Trust This Guide?
          </h3>
          <p className="text-charcoal/70 mb-4">
            I spent years as a Pediatric ER nurse before becoming a mama myself. The Mama Life Guide combines clinical knowledge with real-world motherhood experience — no textbook fluff, just what actually helps.
          </p>
          <p className="text-charcoal/50 text-sm italic">
            This guide is for informational purposes only and is not a substitute for professional medical advice.
          </p>
        </div>
      </section>
    </>
  );
}
