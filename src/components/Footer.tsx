import Link from "next/link";

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
              Just a mama with sourdough on the counter, babies on my hip, and trying to make a good home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-deep-sage mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/start-here" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  Start Here
                </Link>
              </li>
              <li>
                <Link href="/cooking" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  Cooking & Baking
                </Link>
              </li>
              <li>
                <Link href="/lifestyle" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  Travel & DIY
                </Link>
              </li>
              <li>
                <Link href="/mama-life" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  Mama Life Blog
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
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-deep-sage mb-4">
              Connect
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/halfpint.mama/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal/80 hover:text-terracotta transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/HalfPintMama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal/80 hover:text-terracotta transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@halfpint.mama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal/80 hover:text-terracotta transition-colors"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://linktr.ee/Halfpintmama"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-charcoal/80 hover:text-terracotta transition-colors"
                >
                  All Links
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-charcoal/10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link href="/contact" className="text-charcoal/60 text-sm hover:text-terracotta transition-colors">
              Contact
            </Link>
            <span className="hidden sm:block text-charcoal/30">|</span>
            <Link href="/privacy" className="text-charcoal/60 text-sm hover:text-terracotta transition-colors">
              Privacy Policy
            </Link>
            <span className="hidden sm:block text-charcoal/30">|</span>
            <Link href="/terms" className="text-charcoal/60 text-sm hover:text-terracotta transition-colors">
              Terms of Service
            </Link>
            <span className="hidden sm:block text-charcoal/30">|</span>
            <a href="/feed.xml" className="text-charcoal/60 text-sm hover:text-terracotta transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z"/>
              </svg>
              RSS Feed
            </a>
          </div>
          <p className="font-[family-name:var(--font-crimson)] text-charcoal/60 italic text-center">
            Made with coffee and lots of sourdough discard
          </p>
          <p className="text-charcoal/50 text-sm mt-2 text-center">
            © {new Date().getFullYear()} Half Pint Mama. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
