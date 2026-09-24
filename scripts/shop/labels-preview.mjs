// Renders the two site images from the REAL buyer PDF, so the preview and the
// product cannot drift: it builds the labels through buildLabelsPdf with six
// recipes pre-selected (the same code path a buyer's viewer uses), then
// rasterises page 2:
//   public/images/labels-preview.png        the filled sheet of six (delivery
//                                           page, and what the thumbnails open)
//   public/images/labels-preview-label.png  slot one, close up (shop and
//                                           resources thumbnails)
// Re-run whenever the label design or a recipe changes:
//   npx tsx scripts/shop/labels-preview.mjs
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

process.env.SHOP_TOKEN_SECRET ||= "x".repeat(48);
const { buildLabelsPdf, LABEL_SHEET, GUIDE_PAGES } = await import(path.join(process.cwd(), "src/lib/shop/labels-pdf.ts"));

// Six recipes across the book's chapters.
const SAMPLE = ["Nesting Ziti", "Honey Garlic Chicken", "Sourdough English Muffins", "Loaded Breakfast Tacos", "The House Chili", "Lactation Banana Bread"];
const prefill = Object.fromEntries(SAMPLE.map((name, i) => [`p1_${i + 1}`, name]));
const bytes = await buildLabelsPdf({ email: "sample@halfpintmama.com", createdAt: new Date("2026-09-23T00:00:00Z"), prefill });

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "labels-preview-"));
const pdf = path.join(tmp, "labels.pdf");
fs.writeFileSync(pdf, bytes);
const s = LABEL_SHEET;
const page = GUIDE_PAGES; // 0-based index of the first label sheet
const slot1 = { x0: s.marginLeft, y0: s.marginTop, x1: s.marginLeft + s.labelWidth, y1: s.marginTop + s.labelHeight };
execSync(
  `python3 -c "import fitz,sys,json; d=fitz.open(sys.argv[1]); p=d[int(sys.argv[2])]; p.get_pixmap(matrix=fitz.Matrix(695/612, 900/792), alpha=False).save(sys.argv[3]); c=json.loads(sys.argv[4]); p.get_pixmap(matrix=fitz.Matrix(3,3), clip=fitz.Rect(c['x0'],c['y0'],c['x1'],c['y1']), alpha=False).save(sys.argv[5])" ` +
    `${JSON.stringify(pdf)} ${page} public/images/labels-preview.png ${JSON.stringify(JSON.stringify(slot1))} public/images/labels-preview-label.png`
);
for (const f of ["public/images/labels-preview.png", "public/images/labels-preview-label.png"]) console.log("wrote", f, fs.statSync(f).size, "bytes");
