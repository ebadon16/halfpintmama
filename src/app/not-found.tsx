import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6">🍞</div>
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

        <div className="mt-12 pt-8 border-t border-light-sage">
          <p className="text-charcoal/60 text-sm mb-4">Looking for something specific?</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-terracotta font-medium hover:text-deep-sage transition-colors"
          >
            <span>🔍</span> Try searching
          </Link>
        </div>
      </div>
    </div>
  );
}
