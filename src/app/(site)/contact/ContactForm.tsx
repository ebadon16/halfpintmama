"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemedIcon } from "@/components/ThemedIcon";
import { MailCheck, Camera, Hand, Music } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex justify-center mb-4"><ThemedIcon icon={MailCheck} size="xl" color="terracotta" /></div>
          <h2 className="font-[family-name:var(--font-crimson)] text-3xl text-deep-sage font-bold mb-4">
            Message Sent!
          </h2>
          <p className="text-charcoal/70 mb-6">
            Thank you for reaching out! I&apos;ll get back to you as soon as I can - usually within 48 hours.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Back to Home
          </Link>
          <div className="mt-6 pt-6 border-t border-warm-beige/50">
            <p className="text-charcoal/60 text-sm mb-3">While you wait for a reply:</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/cooking"
                className="text-terracotta hover:text-deep-sage font-medium text-sm transition-colors"
              >
                Browse recipes &rarr;
              </Link>
              <Link
                href="/mama-life"
                className="text-sage hover:text-deep-sage font-medium text-sm transition-colors"
              >
                Explore mama life &rarr;
              </Link>
              <Link
                href="/free-guide"
                className="text-terracotta hover:text-deep-sage font-medium text-sm transition-colors"
              >
                Get a free guide &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-bold mb-4">
          Get in Touch
        </h1>
        <p className="text-charcoal/70 text-lg max-w-2xl mx-auto">
          Have a question, collaboration idea, or just want to say hi? I&apos;d love to hear from you!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-light-sage rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-colors"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-light-sage rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-light-sage rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-colors"
                >
                  <option value="">Select a topic...</option>
                  <option value="general">General Question</option>
                  <option value="recipe">Recipe Question</option>
                  <option value="collaboration">Brand Collaboration</option>
                  <option value="press">Press Inquiry</option>
                  <option value="technical">Website Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-light-sage rounded-lg focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-colors resize-none"
                  placeholder="What's on your mind?"
                />
              </div>

              {error && (
                <p role="alert" className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 gradient-cta text-white font-semibold rounded-lg hover:shadow-lg transition-all text-lg disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-4">
              Quick Info
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-charcoal">Response Time</p>
                <p className="text-charcoal/70">Usually within 24-48 hours</p>
              </div>
              <div>
                <p className="font-medium text-charcoal">Location</p>
                <p className="text-charcoal/70">Central Texas</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="font-[family-name:var(--font-crimson)] text-xl text-deep-sage font-semibold mb-4">
              Connect on Social
            </h2>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/halfpint.mama/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-charcoal hover:text-terracotta transition-colors"
              >
                <Camera className="w-5 h-5 text-terracotta" />
                <span>@halfpint.mama</span>
              </a>
              <a
                href="https://www.facebook.com/HalfPintMama"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-charcoal hover:text-terracotta transition-colors"
              >
                <Hand className="w-5 h-5 text-terracotta" />
                <span>Half Pint Mama</span>
              </a>
              <a
                href="https://www.tiktok.com/@halfpint.mama"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-charcoal hover:text-terracotta transition-colors"
              >
                <Music className="w-5 h-5 text-terracotta" />
                <span>@halfpint.mama</span>
              </a>
            </div>
          </div>

          {/* FAQ Note */}
          <div className="bg-gradient-to-br from-light-sage/30 to-warm-beige/30 rounded-2xl p-6">
            <h2 className="font-[family-name:var(--font-crimson)] text-lg text-deep-sage font-semibold mb-2">
              Common Questions
            </h2>
            <p className="text-charcoal/70 text-sm mb-3">
              Check out the Start Here page for answers to frequently asked questions about sourdough, recipes, and more!
            </p>
            <Link
              href="/start-here"
              className="text-terracotta font-medium text-sm hover:text-deep-sage transition-colors"
            >
              Visit Start Here &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
