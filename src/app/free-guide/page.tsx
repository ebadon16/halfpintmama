import Link from "next/link";

export const metadata = {
  title: "Free Sourdough Starter Guide | Half Pint Mama",
  description: "Get my free step-by-step guide to creating and maintaining a healthy sourdough starter. Perfect for beginners!",
};

export default function FreeGuidePage() {
  return (
    <div className="bg-cream min-h-screen">
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
                    5 beginner-friendly recipes
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
                <form className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-charcoal mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Your first name"
                      className="w-full px-4 py-3 border-2 border-warm-beige rounded-lg focus:outline-none focus:border-sage transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border-2 border-warm-beige rounded-lg focus:outline-none focus:border-sage transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 gradient-cta text-white font-semibold rounded-lg hover:shadow-lg transition-all text-lg"
                  >
                    Send Me the Free Guide!
                  </button>
                </form>
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
                Exactly what to do each day for 7 days. No guessing, just follow along.
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
                5 recipes to try with your new starter, from simple loaves to sourdough pancakes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Social Proof */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-8 text-center">
            What Others Are Saying
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-terracotta">★</span>
                ))}
              </div>
              <p className="text-charcoal/70 mb-4 italic">
                &quot;I tried starting sourdough three times before finding this guide. Finally made my first successful loaf! The day-by-day format made it so easy to follow.&quot;
              </p>
              <p className="font-medium text-charcoal">- Sarah M.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-terracotta">★</span>
                ))}
              </div>
              <p className="text-charcoal/70 mb-4 italic">
                &quot;The troubleshooting section saved my starter! It was doing something weird and I found the exact answer in the guide. Now I bake every week.&quot;
              </p>
              <p className="font-medium text-charcoal">- Jessica T.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About the Author */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="md:flex items-center gap-8">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="text-8xl">👩‍🍳</div>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-3">
                Hi, I&apos;m Keegan!
              </h2>
              <p className="text-charcoal/70 mb-4">
                I&apos;m a former Pediatric ER nurse turned stay-at-home mama who fell in love with sourdough during my first maternity leave. Now I bake multiple loaves every week and share everything I&apos;ve learned with my community of 1,000+ home bakers.
              </p>
              <p className="text-charcoal/70">
                This guide is exactly what I wish I had when I started. No complicated techniques, no expensive equipment - just simple steps that work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-semibold mb-4">
            Ready to Start Your Sourdough Journey?
          </h2>
          <p className="text-charcoal/70 mb-8">
            Join 1,000+ home bakers who started with this free guide.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 border-2 border-warm-beige rounded-lg focus:outline-none focus:border-sage transition-colors"
              />
              <button
                type="submit"
                className="w-full py-4 gradient-cta text-white font-semibold rounded-lg hover:shadow-lg transition-all text-lg"
              >
                Get the Free Guide
              </button>
            </form>
          </div>

          <p className="text-charcoal/50 text-sm mt-6">
            Plus, you&apos;ll get my weekly newsletter with recipes and tips. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Waitlist for Future Products */}
      <section className="py-12 bg-deep-sage/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-2">
            Coming Soon
          </h3>
          <p className="text-charcoal/70 mb-4">
            Subscribe to be first to know when these launch:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-white px-4 py-2 rounded-full text-sm text-charcoal/70">
              Sourdough Masterclass Course
            </span>
            <span className="bg-white px-4 py-2 rounded-full text-sm text-charcoal/70">
              Premium Meal Plans
            </span>
            <span className="bg-white px-4 py-2 rounded-full text-sm text-charcoal/70">
              Half Pint Membership
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
