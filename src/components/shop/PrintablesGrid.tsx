import Image from "next/image";
import { Download } from "lucide-react";
import { PRINTABLES } from "@/lib/shop/printables";

// The four free downloads the book promises, as a row of compact cards. Used on
// /shop, which is the URL the book prints, and on /cookbook-resources.
//
// Laid out sideways on purpose. A full-width page preview above each title read
// as four screens of grey texture on a phone, roughly two thousand pixels of
// scrolling for four links, and the thumbnails are far too small at that size to
// tell one sheet from another anyway. A thumbnail beside the name does the one
// job it can do at this scale, which is to say "this is a printable page", and
// costs a fifth of the height.
export function PrintablesGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PRINTABLES.map((p) => (
        <a
          key={p.slug}
          href={p.file}
          download={`rest-and-rise-${p.slug}.pdf`}
          className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow flex gap-4 p-4 items-center"
        >
          <Image
            src={p.preview}
            alt=""
            width={695}
            height={900}
            sizes="88px"
            className="w-[68px] sm:w-[88px] h-auto rounded border border-warm-beige shadow-sm flex-shrink-0 bg-white"
          />
          <span className="min-w-0">
            <span className="block font-semibold text-charcoal leading-snug">{p.name}</span>
            {!compact && <span className="block text-charcoal/80 text-sm mt-1">{p.blurb}</span>}
            <span className="inline-flex items-center gap-1.5 text-terracotta group-hover:text-deep-sage text-sm font-medium transition-colors mt-2">
              <Download className="w-4 h-4" aria-hidden="true" />
              PDF, {p.pages === 1 ? "1 page" : `${p.pages} pages`}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
