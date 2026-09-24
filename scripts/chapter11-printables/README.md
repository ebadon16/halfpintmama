# Chapter 11 printables

The four free downloads the book promises at halfpintmama.com/shop (page 140):
the Prep Day Planner, both stock-up lists, and the Freezer Inventory Checklist.

Since September 23, 2026 these are cut straight out of the FINAL KDP interior PDF
(the exact file the printer receives), pages 141 to 145, so they cannot drift from the
printed book. Before that they came from a Canva export of the ch 11 design, which
drifted once (a Sep 22 text change never made it to the site) and whose folio
detection broke when Canva changed its bleed.

To refresh after the interior is rebuilt:

1. `python3 scripts/chapter11-printables/from-kdp-interior.py ~/Downloads/RestAndRise-INTERIOR-KDP-FINAL-300ppi.pdf`
   It writes four content-hashed PDFs to `public/downloads/` and four previews to
   `public/images/printables/`, and refuses if a heading, page size or folio is not
   where it expects.
2. Delete the superseded PDFs from `public/downloads/` and update the `file` fields in
   `src/lib/shop/printables.ts` (page counts are unchanged unless the book changes).
3. Verify: extract each PDF's text and diff it against the same book pages; the only
   difference should be nothing at all.

`next.config.ts` serves `/downloads` with `X-Robots-Tag: noindex`, so the pages that
present them rank rather than the bare PDFs.
