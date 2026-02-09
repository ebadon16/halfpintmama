import Link from "next/link";
import { EmailSignup } from "@/components/EmailSignup";

export function Footer() {
  return (
    <footer className="bg-warm-beige mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-deep-sage mb-4">
              Half Pint Mama
            </h3>
            <p className="text-charcoal/80 text-sm leading-relaxed">
              Nourishing motherhood from scratch — real food, real recipes, and real talk about raising littles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-deep-sage mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cooking" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  From Scratch Kitchen
                </Link>
              </li>
              <li>
                <Link href="/mama-life" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  Mama Life
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  Favorite Products
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  My Saved Recipes
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-deep-sage mb-4">
              Connect
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/Halfpint.mama"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-charcoal/10 rounded-full flex items-center justify-center hover:bg-terracotta hover:text-white text-charcoal/70 transition-all"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/HalfPintMama"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-charcoal/10 rounded-full flex items-center justify-center hover:bg-terracotta hover:text-white text-charcoal/70 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@halfpint.mama"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-charcoal/10 rounded-full flex items-center justify-center hover:bg-terracotta hover:text-white text-charcoal/70 transition-all"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@HalfPintMama"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-charcoal/10 rounded-full flex items-center justify-center hover:bg-terracotta hover:text-white text-charcoal/70 transition-all"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.pinterest.com/halfpintmamakeegan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-charcoal/10 rounded-full flex items-center justify-center hover:bg-terracotta hover:text-white text-charcoal/70 transition-all"
                aria-label="Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
            <a
              href="https://linktr.ee/Halfpintmama"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-charcoal/80 hover:text-terracotta transition-colors"
            >
              All Links &rarr;
            </a>
            <a
              href="mailto:keegan@halfpintmama.com"
              className="flex items-center gap-2 mt-3 text-sm text-charcoal/80 hover:text-terracotta transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              keegan@halfpintmama.com
            </a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-charcoal/10 text-center">
          <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-deep-sage mb-2">
            Join the Half Pint Community
          </h3>
          <p className="text-charcoal/70 text-sm mb-4">
            Weekly recipes, mama tips, and a free sourdough starter guide.
          </p>
          <EmailSignup
            source="footer"
            buttonText="Subscribe"
            placeholder="Your email"
            className="max-w-md mx-auto"
            buttonClassName="gradient-cta text-white hover:shadow-lg"
            inputClassName="border-charcoal/20"
          />
          <p className="text-charcoal/50 text-xs mt-3">
            No spam, unsubscribe anytime.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-charcoal/10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link href="/contact" className="text-charcoal/80 text-sm hover:text-terracotta transition-colors">
              Contact
            </Link>
            <span className="hidden sm:block text-charcoal/30">|</span>
            <Link href="/privacy" className="text-charcoal/80 text-sm hover:text-terracotta transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:block text-charcoal/30">|</span>
            <Link href="/terms" className="text-charcoal/80 text-sm hover:text-terracotta transition-colors">
              Terms of Service
            </Link>
            <span className="hidden sm:block text-charcoal/30">|</span>
            <Link href="/disclaimer" className="text-charcoal/80 text-sm hover:text-terracotta transition-colors">
              Health Disclaimer
            </Link>
            <span className="hidden sm:block text-charcoal/30">|</span>
            <a href="/feed.xml" className="text-charcoal/80 text-sm hover:text-terracotta transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z"/>
              </svg>
              RSS Feed
            </a>
          </div>
          <p className="font-[family-name:var(--font-crimson)] text-charcoal/80 italic text-center">
            Made with coffee and lots of sourdough discard
          </p>
          <p className="text-charcoal/70 text-sm mt-2 text-center">
            © {new Date().getFullYear()} Half Pint Mama. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
