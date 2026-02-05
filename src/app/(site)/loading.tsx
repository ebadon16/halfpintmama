export default function Loading() {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-light-sage border-t-sage rounded-full animate-spin" />
        <p className="text-charcoal/50 text-sm">Loading...</p>
      </div>
    </div>
  );
}
