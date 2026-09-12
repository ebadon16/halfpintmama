"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { ProductId } from "@/lib/shop/catalog";

interface BuyButtonProps {
  product: ProductId;
  label: string;
  className?: string;
}

// Asks the server for a Stripe Checkout session and sends the browser there.
// The server decides what is purchasable; this only carries the click.
export function BuyButton({ product, label, className = "" }: BuyButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      let data: { url?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Could not start checkout. Please try again.");
      }
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout");
      // Fired only once Stripe has actually returned a session, so refused and
      // failed attempts cannot inflate the top of the funnel.
      trackEvent("begin_checkout", { product });
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className={`w-full px-6 py-4 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all text-lg disabled:opacity-60 ${className}`}
      >
        {busy ? "Taking you to checkout…" : label}
      </button>
      {error && (
        <p className="text-sm text-red-700 mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
