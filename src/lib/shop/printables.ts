// The free downloads the book points readers to at halfpintmama.com/shop.
// Book page 140: "Every fill-in page in this chapter is also a free printable
// at halfpintmama.com/shop. Download the prep day planner, both stock-up lists,
// and the freezer inventory checklist."
//
// That sentence is the whole list. These four are the fill-in pages from the
// book, pages 141 to 145, word for word. Nothing else belongs here: the labels
// the book names on pages 34 and 165 are the separate paid product, and the
// book promises no other download.
//
// The files carry hashed names and next.config.ts serves /downloads with
// X-Robots-Tag: noindex, so the pages that present them rank rather than the
// bare PDFs. The files are cut from Keegan's Canva chapter 11 design; see
// scripts/chapter11-printables/README.md for the refresh steps.

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
    file: "/downloads/rest-and-rise-prep-day-planner-6d34777c.pdf",
    preview: "/images/printables/prep-day-planner.png",
    pages: 2,
  },
  {
    slug: "postpartum-household-stock-up-list",
    name: "Postpartum Household Stock-Up List",
    blurb: "Kitchen consumables, equipment, recovery essentials, feeding supplies, baby basics, and the everyday household things to have before baby arrives.",
    file: "/downloads/rest-and-rise-postpartum-household-stock-up-list-d362b64b.pdf",
    preview: "/images/printables/postpartum-household-stock-up-list.png",
    pages: 1,
  },
  {
    slug: "pantry-staples-stock-up-list",
    name: "Pantry Staples Stock-Up List",
    blurb: "Every ingredient that shows up again and again in the book, so the weekly run only needs the fresh items.",
    file: "/downloads/rest-and-rise-pantry-staples-stock-up-list-3080694a.pdf",
    preview: "/images/printables/pantry-staples-stock-up-list.png",
    pages: 1,
  },
  {
    slug: "freezer-inventory-checklist",
    name: "Freezer Inventory Checklist",
    blurb: "Every recipe in the book with a quantity and date line. Fill it in as you finish each session, cross items off as you pull them out.",
    file: "/downloads/rest-and-rise-freezer-inventory-checklist-37797fa7.pdf",
    preview: "/images/printables/freezer-inventory-checklist.png",
    pages: 1,
  },
];
