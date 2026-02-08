import Link from "next/link";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Hand, Coffee, Leaf, Home, Wheat, BookOpen, Beer, Heart, Camera, Video, Music } from "lucide-react";

export const metadata = {
  title: "About Keegan | Half Pint Mama",
  description: "Meet Keegan - a Pediatric ER RN and mama of two sharing real food recipes, sourdough tips, and intentional living from Central Texas.",
  alternates: { canonical: "https://halfpintmama.com/about" },
  openGraph: {
    title: "About Keegan | Half Pint Mama",
    description: "Meet Keegan - a Pediatric ER RN and mama of two sharing real food recipes and intentional living.",
    url: "https://halfpintmama.com/about",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary",
    title: "About Keegan | Half Pint Mama",
    description: "Meet Keegan - a Pediatric ER RN and mama of two sharing real food recipes and intentional living.",
  },
};

// Person schema for author SEO
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Keegan",
  jobTitle: "Pediatric ER RN & Blogger",
  description: "A Pediatric ER RN and mama of two on a mission to get back to the basics with real food, simple recipes, and intentional living.",
  url: "https://halfpintmama.com/about",
  image: "https://halfpintmama.com/logo.jpg",
  sameAs: [
    "https://www.instagram.com/halfpint.mama",
    "https://www.youtube.com/@HalfPintMama",
    "https://www.tiktok.com/@halfpint.mama",
    "https://linktr.ee/Halfpintmama",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Half Pint Mama",
    url: "https://halfpintmama.com",
  },
  knowsAbout: [
    "Sourdough baking",
    "Pediatric nursing",
    "Family recipes",
    "Intentional living",
    "Motherhood",
  ],
};

export default function AboutPage() {
  return (
    <div className="bg-cream">
      {/* Person Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl md:text-5xl text-deep-sage font-semibold mb-2">
          Hey, I&apos;m Keegan
        </h1>
        <div className="mb-8">
          <ThemedIcon icon={Hand} size="lg" color="sage" />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
          <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
            I&apos;m a mama on a mission to get back to the basics—real food, simple recipes, and intentional living.
          </p>

          <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
            I&apos;m a Pediatric ER RN and a mama of two, sharing life&apos;s beautiful chaos with my kids and our chocolate lab. My nursing background shapes the way I approach the kitchen and home—thoughtful, practical, and rooted in what truly nourishes a family. Around here, you&apos;ll find honest conversations about motherhood, my deep love for sourdough, and the small, everyday rhythms that make a home feel steady and good.
          </p>

          {/* Highlight Box */}
          <div className="bg-light-sage rounded-xl p-6 border-l-4 border-sage mb-6">
            <h2 className="font-[family-name:var(--font-crimson)] text-xl font-semibold text-deep-sage mb-4">
              A Few Things About Me:
            </h2>
            <ul className="space-y-3 text-charcoal">
              <li className="flex items-start gap-3">
                <ThemedIcon icon={Coffee} size="sm" color="terracotta" bare />
                <span>I can&apos;t function without my morning black coffee</span>
              </li>
              <li className="flex items-start gap-3">
                <ThemedIcon icon={Leaf} size="sm" color="sage" bare />
                <span>I&apos;ll always choose outside over inside</span>
              </li>
              <li className="flex items-start gap-3">
                <ThemedIcon icon={Home} size="sm" color="deep-sage" bare />
                <span>Currently homesteading… in the suburbs</span>
              </li>
              <li className="flex items-start gap-3">
                <ThemedIcon icon={Wheat} size="sm" color="terracotta" bare />
                <span>My sourdough starter has a permanent place on the counter</span>
              </li>
              <li className="flex items-start gap-3">
                <ThemedIcon icon={BookOpen} size="sm" color="sage" bare />
                <span>You probably don&apos;t want to know what I&apos;m reading on my Kindle</span>
              </li>
              <li className="flex items-start gap-3">
                <ThemedIcon icon={Beer} size="sm" color="terracotta" bare />
                <span>That first sip of a cold beer? Absolute perfection</span>
              </li>
              <li className="flex items-start gap-3">
                <ThemedIcon icon={Heart} size="sm" color="deep-sage" bare />
                <span>Mostly a pretty chill mama, navigating life with a preschooler and a toddler</span>
              </li>
            </ul>
          </div>

          <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
            Half Pint Mama started as a place to share what&apos;s working in our home—real food, honest motherhood, and from-scratch recipes tested in the margins of real life. Whether you&apos;re just beginning your sourdough journey, looking for tried and true recipes, or navigating the beautiful chaos of raising littles — you&apos;ll find it all here, rooted in experience from both nursing and motherhood.
          </p>

          <p className="text-sage italic text-lg">
            Thanks so much for being here—I&apos;m really glad you found your way to my kitchen <Heart className="inline-block w-4 h-4 text-soft-pink align-middle" />
          </p>
        </div>

        {/* Free Sourdough Guide Section */}
        <div className="bg-gradient-to-br from-terracotta/10 to-soft-pink/10 rounded-2xl p-8 shadow-md mb-8 border-2 border-terracotta/20">
          <div className="text-center">
            <div className="mb-4"><ThemedIcon icon={Wheat} size="lg" color="terracotta" /></div>
            <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-4">
              Get My Free Sourdough Starter Guide
            </h2>
            <p className="text-charcoal/70 mb-6 max-w-lg mx-auto">
              Ready to start your sourdough journey? Sign up for my free guide with everything you need to create and maintain a healthy starter.
            </p>
            <Link
              href="/free-guide"
              className="inline-block px-8 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Get the Free Guide
            </Link>
          </div>
        </div>

        {/* Connect Section */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-deep-sage font-semibold mb-6">
            Let&apos;s Connect!
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href="https://www.instagram.com/Halfpint.mama"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-cta text-white text-center p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="mb-2"><Camera className="w-7 h-7 mx-auto" /></div>
              <div className="font-semibold">Instagram</div>
              <div className="text-sm text-white/80">@halfpint.mama</div>
            </a>

            <a
              href="https://www.youtube.com/@HalfPintMama"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sage text-white text-center p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="mb-2"><Video className="w-7 h-7 mx-auto" /></div>
              <div className="font-semibold">YouTube</div>
              <div className="text-sm text-white/80">Half Pint Mama</div>
            </a>

            <a
              href="https://www.tiktok.com/@halfpint.mama"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-deep-sage text-white text-center p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="mb-2"><Music className="w-7 h-7 mx-auto" /></div>
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
