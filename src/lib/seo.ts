export const SITE_URL = "https://halfpintmama.com";

// Default OG image served from /app/opengraph-image.tsx — 1200x630 branded card.
// Reference this in every page's openGraph.images so Next emits og:image meta.
// (Next 16 only auto-injects the file-convention image when openGraph is unset.)
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Half Pint Mama: Nourishing Motherhood From Scratch",
} as const;

export const DEFAULT_OG_IMAGE_ARRAY = [DEFAULT_OG_IMAGE];

// Append "?page=N" to a canonical URL when past page 1. Keeps pagination pages
// from competing with each other via duplicate canonicals pointing to page 1.
export function paginatedCanonical(basePath: string, currentPage: number): string {
  const base = `${SITE_URL}${basePath}`;
  return currentPage > 1 ? `${base}?page=${currentPage}` : base;
}

// "All Posts | Half Pint Mama" → "All Posts (Page 2) | Half Pint Mama"
export function paginatedTitle(baseTitle: string, currentPage: number): string {
  if (!(currentPage > 1)) return baseTitle;
  const parts = baseTitle.split(" | ");
  if (parts.length === 2) {
    return `${parts[0]} (Page ${currentPage}) | ${parts[1]}`;
  }
  return `${baseTitle} (Page ${currentPage})`;
}

// Shared author reference so post schemas link to the Person entity on /about.
export const AUTHOR_REF = { "@id": `${SITE_URL}/about#person` } as const;

// Full Person node; emit once on /about so other pages can @id-reference it.
export const AUTHOR_PERSON = {
  "@type": "Person",
  "@id": `${SITE_URL}/about#person`,
  name: "Keegan",
  url: `${SITE_URL}/about`,
} as const;

// Serialize an object for injection into a <script type="application/ld+json">
// tag. Plain JSON.stringify does NOT escape "<", so a CMS/URL-derived string
// containing "</script>" would break out of the tag and execute arbitrary JS.
// Escape the characters that can terminate the script context or be reparsed
// as HTML, plus U+2028/U+2029 which are invalid in raw <script> JSON.
export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/g,
    (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")
  );
}
