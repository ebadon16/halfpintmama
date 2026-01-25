"use client";

import { useState, useEffect } from "react";

export function EmailPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or subscribed
    const hasInteracted = localStorage.getItem("emailPopupDismissed");
    if (hasInteracted) {
      return;
    }

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("emailPopupDismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    handleDismiss();
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
      <div className="relative bg-cream rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal text-2xl leading-none z-10"
          aria-label="Close popup"
        >
          &times;
        </button>

        {/* Header gradient */}
        <div className="gradient-cta p-8 text-center text-white">
          <span className="text-5xl block mb-3">🍞</span>
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl font-semibold mb-2">
            Want My Free Sourdough Starter Guide?
          </h2>
          <p className="text-white/90 text-sm">
            Plus weekly recipes, mama tips, and exclusive content!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-charcoal/70 text-center mb-4 text-sm">
            Join 1,000+ mamas who are baking with confidence. Get my step-by-step starter guide delivered straight to your inbox.
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 rounded-full text-charcoal border-2 border-sage/50 focus:outline-none focus:border-sage mb-3"
          />

          <button
            type="submit"
            className="w-full px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Send My Free Guide
          </button>

          <p className="text-charcoal/50 text-xs text-center mt-3">
            No spam, ever. Unsubscribe anytime.
          </p>
        </form>

        {/* Maybe later link */}
        <div className="pb-4 text-center">
          <button
            onClick={handleDismiss}
            className="text-charcoal/50 text-sm hover:text-charcoal transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
