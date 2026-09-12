// The free downloads the book points readers to at halfpintmama.com/shop.
// Book page 140: "Every fill-in page in this chapter is also a free printable
// at halfpintmama.com/shop." That is every fill-in page from Chapter 11 (book
// pages 141-145), plus the one-page session checklist. The labels the book
// names on pages 34 and 165 are the separate paid product.
//
// The files carry hashed names and next.config.ts serves /downloads with
// X-Robots-Tag: noindex, so the pages that present them rank rather than the
// bare PDFs. Sources live in scripts/chapter11-printables and scripts/checklist-pdf.

export interface Printable {
  slug: string;
  name: string;
  blurb: string;
  file: string;
  preview: string;
  pages: number;
}

export const PRINTABLES: readonly Printable[] = [
  {
    slug: "prep-day-planner",
    name: "Your Prep Day Planner",
    blurb: "Map out any session before you start it: what you are making, what must be ready, and the rhythm of the day.",
    file: "/downloads/rest-and-rise-prep-day-planner-0e6bb83f.pdf",
    preview: "/images/printables/prep-day-planner.png",
    pages: 2,
  },
  {
    slug: "postpartum-household-stock-up-list",
    name: "Postpartum Household Stock-Up List",
    blurb: "Kitchen consumables, equipment, recovery essentials, feeding supplies, baby basics, and the everyday household things to have before baby arrives.",
    file: "/downloads/rest-and-rise-postpartum-household-stock-up-list-263d00eb.pdf",
    preview: "/images/printables/postpartum-household-stock-up-list.png",
    pages: 1,
  },
  {
    slug: "pantry-staples-stock-up-list",
    name: "Pantry Staples Stock-Up List",
    blurb: "Every ingredient that shows up again and again in the book, so the weekly run only needs the fresh items.",
    file: "/downloads/rest-and-rise-pantry-staples-stock-up-list-c3cf6c54.pdf",
    preview: "/images/printables/pantry-staples-stock-up-list.png",
    pages: 1,
  },
  {
    slug: "freezer-inventory-checklist",
    name: "Freezer Inventory Checklist",
    blurb: "Every recipe in the book with a quantity and date line. Fill it in as you finish each session, cross items off as you pull them out.",
    file: "/downloads/rest-and-rise-freezer-inventory-checklist-721713fd.pdf",
    preview: "/images/printables/freezer-inventory-checklist.png",
    pages: 1,
  },
  {
    slug: "freezer-prep-checklist",
    name: "The Freezer Prep Checklist",
    blurb: "The whole thirteen-session plan on one page, weeks 30 to 36, with a freezer inventory on the back.",
    file: "/downloads/rest-and-rise-checklist-2a418ce2.pdf",
    preview: "/images/freezer-prep-checklist-preview.png",
    pages: 2,
  },
];

export const CHECKLIST_PDF = PRINTABLES[4].file;
