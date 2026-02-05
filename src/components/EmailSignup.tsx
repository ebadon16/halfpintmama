"use client";

import { useState } from "react";

interface EmailSignupProps {
  source?: string;
  buttonText?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  layout?: "inline" | "stacked";
}

export function EmailSignup({
  source = "website",
  buttonText = "Subscribe",
  placeholder = "Your email",
  className = "",
  inputClassName = "",
  buttonClassName = "",
  layout = "inline",
}: EmailSignupProps) {
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
        body: JSON.stringify({ email, source }),
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
      <div className={`text-center ${className}`}>
        <div className="text-2xl mb-2">🎉</div>
        <p className="text-green-600 font-medium">{message}</p>
      </div>
    );
  }

  const isInline = layout === "inline";

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className={`flex ${isInline ? "flex-col sm:flex-row" : "flex-col"} gap-3`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          aria-label="Email address"
          disabled={status === "loading"}
          className={`flex-1 px-4 py-3 rounded-full border-2 border-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-charcoal disabled:opacity-50 ${inputClassName}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`px-6 py-3 font-semibold rounded-full transition-colors whitespace-nowrap disabled:opacity-50 ${buttonClassName}`}
        >
          {status === "loading" ? "..." : buttonText}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-500 text-sm mt-2">{message}</p>
      )}
    </form>
  );
}
