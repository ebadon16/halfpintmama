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
                <Link href="/cooking" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  Cooking & Baking
                </Link>
              </li>
              <li>
                <Link href="/travel" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  Family Travel
                </Link>
              </li>
              <li>
                <Link href="/diy" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  DIY Projects
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-charcoal/80 hover:text-terracotta transition-colors">
                  Shop
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
        <div className="mt-12 pt-6 border-t border-charcoal/10 text-center">
          <p className="font-[family-name:var(--font-crimson)] text-charcoal/60 italic">
            Made with coffee and lots of sourdough discard
          </p>
          <p className="text-charcoal/50 text-sm mt-2">
            © {new Date().getFullYear()} Half Pint Mama
          </p>
        </div>
      </div>
    </footer>
  );
}
