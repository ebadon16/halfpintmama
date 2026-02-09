import Link from "next/link";
import { ThemedIcon } from "@/components/ThemedIcon";
import { Wheat, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6"><ThemedIcon icon={Wheat} size="xl" color="terracotta" /></div>
        <h1 className="font-[family-name:var(--font-crimson)] text-6xl text-deep-sage font-bold mb-4">
          404
        </h1>
        <h2 className="font-[family-name:var(--font-crimson)] text-2xl text-charcoal mb-4">
          Oops! This page got lost in the oven
        </h2>
        <p className="text-charcoal/70 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          But don&apos;t worry - there&apos;s plenty more to explore!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/"
            className="px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/cooking"
            className="px-6 py-3 border-2 border-sage text-deep-sage font-semibold rounded-full hover:bg-sage hover:text-white transition-all"
          >
            Browse Recipes
          </Link>
        </div>

        {/* Quick paths */}
        <div className="bg-white rounded-2xl p-6 shadow-md text-left mb-8">
          <p className="font-[family-name:var(--font-crimson)] text-lg text-deep-sage font-semibold mb-4 text-center">Popular Starting Points</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link href="/cooking/sourdough" className="text-terracotta hover:text-deep-sage transition-colors font-medium">
              Sourdough Recipes &rarr;
            </Link>
            <Link href="/cooking/discard" className="text-terracotta hover:text-deep-sage transition-colors font-medium">
              Discard Recipes &rarr;
            </Link>
            <Link href="/mama-life" className="text-sage hover:text-deep-sage transition-colors font-medium">
              Mama Life &rarr;
            </Link>
            <Link href="/free-guide" className="text-sage hover:text-deep-sage transition-colors font-medium">
              Free Starter Guide &rarr;
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-light-sage">
          <p className="text-charcoal/60 text-sm mb-4">Looking for something specific?</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-terracotta font-medium hover:text-deep-sage transition-colors"
          >
            <Search className="inline-block w-4 h-4" /> Try searching
          </Link>
        </div>
      </div>
    </div>
  );
}
