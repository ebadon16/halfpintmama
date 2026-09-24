#!/usr/bin/env python3
"""Cut the four Chapter 11 printables out of the FINAL KDP interior PDF.

usage: python3 scripts/chapter11-printables/from-kdp-interior.py <RestAndRise-INTERIOR-KDP-*.pdf>

Takes pages 141-145 (page N of the file = printed folio N), checks each heading is
where it should be, strips the 0.125in KDP bleed (top, bottom and the outside edge:
right on a recto, left on a verso) so each page is the 7x10 trim, removes the printed
folio, and writes content-hashed PDFs to public/downloads plus 695x900 previews to
public/images/printables. Then update the `file` fields in src/lib/shop/printables.ts
and delete the superseded PDFs. Refuses if a page is not 513x738pt or a folio is not
found exactly once.
"""
import fitz, hashlib, os, sys

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PDF_DIR = os.path.join(ROOT, "public", "downloads")
PNG_DIR = os.path.join(ROOT, "public", "images", "printables")
WANT = {
    "prep-day-planner": ([141, 142], "YOUR PREP DAY PLANNER"),
    "postpartum-household-stock-up-list": ([143], "POSTPARTUM HOUSEHOLD STOCK-UP LIST"),
    "pantry-staples-stock-up-list": ([144], "PANTRY STAPLES STOCK-UP LIST"),
    "freezer-inventory-checklist": ([145], "FREEZER INVENTORY CHECKLIST"),
}
CREAM = (0.976, 0.965, 0.937)

d = fitz.open(SRC)
for slug, (pages, heading) in WANT.items():
    if heading not in d[pages[0] - 1].get_text().upper():
        sys.exit(f"{slug}: heading {heading!r} not on page {pages[0]}; the book moved, update WANT")
    out = fitz.open()
    for pg in pages:
        out.insert_pdf(d, from_page=pg - 1, to_page=pg - 1)
        q = out[-1]
        mb = q.mediabox
        if (round(mb.width), round(mb.height)) != (513, 738):
            sys.exit(f"page {pg} is {mb.width}x{mb.height}pt, expected the 7.125x10.25in KDP page")
        x0 = 0 if pg % 2 == 1 else 9
        trim = fitz.Rect(mb.x0 + x0, mb.y0 + 9, mb.x0 + x0 + 504, mb.y0 + 9 + 720)
        q.set_cropbox(trim)
        hits = 0
        for b in q.get_text("dict")["blocks"]:
            for l in b.get("lines", []):
                txt = "".join(s["text"] for s in l["spans"]).strip()
                r = fitz.Rect(l["bbox"])
                if txt == str(pg) and r.y1 > trim.y1 - 60:
                    # Pad sideways and downward only. The folio's line box touches
                    # the last text line above it (0.2pt apart on page 144), and a
                    # 2pt pad upward removed that line's first glyphs.
                    q.add_redact_annot(fitz.Rect(r.x0 - 2, r.y0 + 1, r.x1 + 2, r.y1 + 2), fill=CREAM)
                    hits += 1
        if hits != 1:
            sys.exit(f"page {pg}: found the folio {hits} times, expected once")
        q.apply_redactions(images=0, graphics=0, text=0)  # text=0 REMOVES the text in PyMuPDF
    raw = out.tobytes(garbage=4, deflate=True)
    name = f"rest-and-rise-{slug}-{hashlib.sha256(raw).hexdigest()[:8]}.pdf"
    open(os.path.join(PDF_DIR, name), "wb").write(raw)
    pm = fitz.open("pdf", raw)[0].get_pixmap(matrix=fitz.Matrix(695 / 504, 900 / 720), alpha=False)
    pm.save(os.path.join(PNG_DIR, f"{slug}.png"))
    print(f"{slug:36s} pages={len(pages)} -> {name}")
