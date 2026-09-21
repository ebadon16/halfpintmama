# Chapter 11 printables

The four free downloads the book promises at halfpintmama.com/shop (page 140):
the Prep Day Planner, both stock-up lists, and the Freezer Inventory Checklist.

Since September 21, 2026 these are Keegan's own pages, cut straight out of the
Canva "Rest & Rise- ch 11" design (pages 141 to 145 of the book), not a rebuilt
HTML copy. That way they can never drift from the printed book.

To refresh after Keegan edits the design:

1. Export the design as PDF (Print preset, no crop marks, no flatten), for example
   with `~/.research/_cv_export2.mjs DAHQU5HYCmU out.pdf`.
2. Run `python3 ~/.research/_hpm_printables_from_canva.py out.pdf <dir>`. It finds
   each page by its heading, trims any bleed to the 7 x 10 page, removes the printed
   page number, and writes one PDF per printable (content-hashed name) plus a
   695 x 900 page-one preview PNG.
3. Copy the PDFs into `public/downloads/` and the PNGs into
   `public/images/printables/`, delete the superseded PDFs, and update the `file`
   and `pages` fields in `src/lib/shop/printables.ts`.

`next.config.ts` serves `/downloads` with `X-Robots-Tag: noindex`, so the pages that
present them rank rather than the bare PDFs.
