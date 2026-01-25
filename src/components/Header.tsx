"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cooking", label: "Cooking" },
  { href: "/travel", label: "Travel" },
  { href: "/diy", label: "DIY" },
  { href: "/mama-life", label: "Mama Life" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="gradient-header text-cream">
      {/* Main Header */}
      <div className="text-center py-8 px-4 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-20 -right-10 w-64 h-64 bg-white/10 rounded-full blur-sm" />

        <Link href="/" className="relative z-10">
          <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl font-semibold text-[#FAF7F2] drop-shadow-sm">
            Half Pint Mama
          </h1>
          <p className="text-[#E8DDD0] italic mt-2">
            Where Mom Life Meets Real Life
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="bg-cream sticky top-0 z-50 shadow-sm">
        {/* Mobile menu button */}
        <div className="md:hidden flex justify-center py-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-4 py-2 text-deep-sage font-semibold"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex justify-center gap-1 py-3 px-4 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage hover:border-sage transition-all whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col items-center gap-2 py-4 px-4 bg-cream border-t border-light-sage">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-6 py-2 rounded-full border-2 border-light-sage text-deep-sage font-semibold text-sm hover:bg-light-sage transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
