"use client";

import { useState, useEffect } from "react";

export function EmailPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
        body: JSON.stringify({ email, source: "popup" }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        localStorage.setItem("emailPopupDismissed", "true");
        // Auto-close after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
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
        {status === "success" ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-green-600 font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <p className="text-charcoal/70 text-center mb-4 text-sm">
              Join 1,000+ mamas who are baking with confidence. Get my step-by-step starter guide delivered straight to your inbox.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === "loading"}
              className="w-full px-4 py-3 rounded-full text-charcoal border-2 border-sage/50 focus:outline-none focus:border-sage mb-3 disabled:opacity-50"
            />

            {status === "error" && (
              <p className="text-red-500 text-sm mb-3 text-center">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send My Free Guide"}
            </button>

            <p className="text-charcoal/50 text-xs text-center mt-3">
              No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        )}

        {/* Maybe later link */}
        {status !== "success" && (
          <div className="pb-4 text-center">
            <button
              onClick={handleDismiss}
              className="text-charcoal/50 text-sm hover:text-charcoal transition-colors"
            >
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
