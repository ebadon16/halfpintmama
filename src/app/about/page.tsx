import Link from "next/link";

export const metadata = {
  title: "About | Half Pint Mama",
  description: "Meet Keegan - a Pediatric ER RN and mama of two sharing real life in Central Texas.",
};

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-4">
          Hey, I&apos;m Keegan!
        </h1>
        <p className="text-sage text-xl italic mb-8">
          Living my best mom era in Central Texas
        </p>

        {/* Main Content */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
          <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
            I&apos;m a Pediatric ER RN and mama of two, sharing the beautiful chaos of life
            with my toddler Porter, baby Reese, and our chocolate lab Stout. This is where you&apos;ll
            find real talk about motherhood, my sourdough obsession, family travel adventures, and
            all the little things that make life sweet.
          </p>

          {/* Highlight Box */}
          <div className="bg-light-sage rounded-xl p-6 border-l-4 border-sage mb-6">
            <h3 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-deep-sage mb-4">
              A Few Things About Me:
            </h3>
            <ul className="space-y-3 text-charcoal">
              <li className="flex items-start gap-3">
                <span>🌿</span>
                <span>Can&apos;t function without my morning black coffee</span>
              </li>
              <li className="flex items-start gap-3">
                <span>🌿</span>
                <span>Would rather be outside than inside (always)</span>
              </li>
              <li className="flex items-start gap-3">
                <span>🌿</span>
                <span>Currently obsessed with homesteading in the suburbs</span>
              </li>
              <li className="flex items-start gap-3">
                <span>🌿</span>
                <span>Sourdough starter has a permanent spot on my counter</span>
              </li>
              <li className="flex items-start gap-3">
                <span>🌿</span>
                <span>That first sip of a cold beer? Chef&apos;s kiss</span>
              </li>
              <li className="flex items-start gap-3">
                <span>🌿</span>
                <span>Pretty chill mama (mostly) navigating two under two</span>
              </li>
            </ul>
          </div>

          <p className="text-charcoal/80 leading-relaxed mb-6">
            Half Pint Mama started as a way to document our family adventures and share what works
            (and what hilariously doesn&apos;t) in our house. Whether you&apos;re here for the sourdough
            recipes, travel tips, or just some real talk about mom life - I&apos;m so glad you&apos;re here!
          </p>

          <p className="text-sage italic text-lg">
            Thanks for following along! 💚
          </p>
        </div>

        {/* Connect Section */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-6">
            Let&apos;s Connect!
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href="https://www.instagram.com/halfpint.mama/"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-cta text-white text-center p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-2">📸</div>
              <div className="font-semibold">Instagram</div>
              <div className="text-sm text-white/80">@halfpint.mama</div>
            </a>

            <a
              href="https://www.facebook.com/HalfPintMama"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sage text-white text-center p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-2">👋</div>
              <div className="font-semibold">Facebook</div>
              <div className="text-sm text-white/80">Half Pint Mama</div>
            </a>

            <a
              href="https://www.tiktok.com/@halfpint.mama"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-deep-sage text-white text-center p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-2">🎵</div>
              <div className="font-semibold">TikTok</div>
              <div className="text-sm text-white/80">@halfpint.mama</div>
            </a>
          </div>

          <div className="text-center mt-8">
            <Link
              href="https://linktr.ee/Halfpintmama"
              target="_blank"
              className="inline-block px-6 py-3 border-2 border-sage text-deep-sage font-semibold rounded-full hover:bg-sage hover:text-white transition-all"
            >
              All My Links
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
