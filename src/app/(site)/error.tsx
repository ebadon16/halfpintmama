"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6">🫠</div>
        <h1 className="font-[family-name:var(--font-crimson)] text-4xl text-deep-sage font-bold mb-4">
          Something went wrong
        </h1>
        <p className="text-charcoal/70 mb-8">
          We hit an unexpected bump in the road. Try again — it might just be a hiccup!
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 gradient-cta text-white font-semibold rounded-full hover:shadow-lg transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
