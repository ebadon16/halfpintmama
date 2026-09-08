"use client";

import { useState } from "react";

export function RecoverForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/labels/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("done");
      setMessage(data.message);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <p className="text-deep-sage font-medium text-center" role="status">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="recover-email" className="block text-sm font-medium text-charcoal">
        Email used at checkout
      </label>
      <input
        id="recover-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full px-4 py-3 rounded-full border border-terracotta/30 focus:border-terracotta focus:ring-2 focus:ring-terracotta/30 outline-none text-charcoal"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-6 py-3 bg-terracotta text-white font-semibold rounded-full hover:bg-terracotta/90 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send my link"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
