import Image from "next/image";
import { Download } from "lucide-react";
import { PRINTABLES } from "@/lib/shop/printables";

// The four free downloads the book promises, as a grid of preview cards. Used
// on /shop, which is the URL the book prints, and on /cookbook-resources.
export function PrintablesGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-6 ${compact ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {PRINTABLES.map((p) => (
        <a
          key={p.slug}
          href={p.file}
          download={`rest-and-rise-${p.slug}.pdf`}
          className="group bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
        >
          <div className="bg-warm-beige/40 p-4">
            <Image
              src={p.preview}
              alt={`Page one of ${p.name}`}
              width={695}
              height={900}
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
              className="w-full h-auto rounded shadow border border-warm-beige bg-white"
            />
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-semibold text-charcoal mb-1">{p.name}</h3>
            {!compact && <p className="text-charcoal/80 text-sm mb-3 flex-1">{p.blurb}</p>}
            <span className="inline-flex items-center gap-1.5 text-terracotta group-hover:text-deep-sage text-sm font-medium transition-colors mt-auto">
              <Download className="w-4 h-4" aria-hidden="true" />
              PDF, {p.pages === 1 ? "1 page" : `${p.pages} pages`}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
