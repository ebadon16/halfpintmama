export default function Loading() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Skeleton header */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="h-8 w-48 bg-light-sage/50 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-72 bg-light-sage/30 rounded animate-pulse" />
      </div>

      {/* Skeleton cards grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-md"
            >
              {/* Image placeholder */}
              <div className="h-36 sm:h-40 bg-light-sage/40 animate-pulse" />
              {/* Content placeholder */}
              <div className="p-3">
                <div className="h-4 w-16 bg-light-sage/50 rounded-full animate-pulse mb-2" />
                <div className="h-5 w-full bg-light-sage/40 rounded animate-pulse mb-1" />
                <div className="h-5 w-3/4 bg-light-sage/40 rounded animate-pulse mb-2" />
                <div className="h-3 w-full bg-light-sage/30 rounded animate-pulse mb-1" />
                <div className="h-3 w-2/3 bg-light-sage/30 rounded animate-pulse mb-2" />
                <div className="h-3 w-20 bg-light-sage/30 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered spinner */}
      <div className="flex flex-col items-center gap-4 pb-12">
        <div className="w-10 h-10 border-4 border-light-sage border-t-sage rounded-full animate-spin" />
        <p className="text-charcoal/50 text-sm">Loading...</p>
      </div>
    </div>
  );
}
