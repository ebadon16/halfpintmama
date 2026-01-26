"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/start-here", label: "New? Start Here!" },
  { href: "/cooking", label: "Recipes" },
  { href: "/mama-life", label: "Mama Life Blog" },
  { href: "/lifestyle", label: "Travel & DIY" },
  { href: "/products", label: "Favorite Products" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-cream">
      {/* Main Header with Banner */}
      <div className="relative">
        {/* Banner Background */}
        <div
          className="w-full h-48 md:h-56 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/banner.png')" }}
        />

        {/* Logo Overlay */}
        <Link href="/" className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Half Pint Mama"
            width={160}
            height={160}
            className="drop-shadow-lg hover:scale-105 transition-transform"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="bg-cream sticky top-0 z-50 shadow-sm">
        {/* Mobile menu button */}
        <div className="md:hidden flex justify-between items-center py-2 px-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="px-4 py-2 text-deep-sage font-semibold"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
          <Link
            href="/shop"
            className="px-4 py-2 gradient-cta text-white font-semibold text-sm rounded-full"
          >
            Shop
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex justify-center items-center gap-1 py-3 px-4 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all whitespace-nowrap ${
                isActive(link.href)
                  ? "bg-sage border-sage text-white"
                  : "border-light-sage text-deep-sage hover:bg-light-sage hover:border-sage"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* Shop button - highlighted */}
          <Link
            href="/shop"
            className={`px-5 py-2 font-semibold text-sm rounded-full transition-all whitespace-nowrap ml-2 ${
              isActive("/shop")
                ? "bg-deep-sage text-white"
                : "gradient-cta text-white hover:shadow-md"
            }`}
          >
            Shop
          </Link>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col items-center gap-2 py-4 px-4 bg-cream border-t border-light-sage">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-6 py-2 rounded-full border-2 font-semibold text-sm transition-all ${
                  isActive(link.href)
                    ? "bg-sage border-sage text-white"
                    : "border-light-sage text-deep-sage hover:bg-light-sage"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setIsMenuOpen(false)}
              className={`px-6 py-2 font-semibold text-sm rounded-full mt-2 ${
                isActive("/shop")
                  ? "bg-deep-sage text-white"
                  : "gradient-cta text-white"
              }`}
            >
              Shop
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
