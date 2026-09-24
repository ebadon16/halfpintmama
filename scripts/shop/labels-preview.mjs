// Renders two images from the same drawing as the buyer's PDF (fonts, geometry,
// card art), with static text so they are deterministic:
//   public/images/labels-preview.png        one filled sheet of six (delivery page,
//                                           and what the thumbnails open)
//   public/images/labels-preview-label.png  one label, close up (the shop and
//                                           resources thumbnails, where a whole
//                                           sheet reads as a blur)
// Re-run whenever the label design changes:
//   npx tsx scripts/shop/labels-preview.mjs
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PDFDocument } from "pdf-lib";

process.env.SHOP_TOKEN_SECRET ||= "x".repeat(48);
const { LABEL_SHEET, _internals, previewLabel } = await import(path.join(process.cwd(), "src/lib/shop/labels-pdf.ts"));
const { RECIPES, recipeMeta } = await import(path.join(process.cwd(), "src/lib/shop/recipes.ts"));

// Six recipes across the book's chapters, each with a plausible made-on date.
const SAMPLE = [
  ["Nesting Ziti", "Oct 14"],
  ["Honey Garlic Chicken", "Oct 14"],
  ["Sourdough English Muffins", "Oct 21"],
  ["Loaded Breakfast Tacos", "Oct 21"],
  ["The House Chili", "Oct 28"],
  ["Lactation Banana Bread", "Nov 4"],
];

const doc = await PDFDocument.create();
const fonts = await _internals.loadFonts(doc);
const page = doc.addPage([LABEL_SHEET.pageWidth, LABEL_SHEET.pageHeight]);
page.drawRectangle({ x: 0, y: 0, width: LABEL_SHEET.pageWidth, height: LABEL_SHEET.pageHeight, color: _internals.WHITE });
_internals.slots().forEach((slot, i) => {
  const [name, made] = SAMPLE[i];
  const r = RECIPES.find((x) => x.name === name);
  if (!r) throw new Error(`no recipe named ${name}`);
  _internals.drawLabelArt(page, slot, fonts, false);
  previewLabel(page, slot, fonts, r.name, made, recipeMeta(r), r.directions);
});
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "labels-preview-"));
const pdf = path.join(tmp, "sheet.pdf");
fs.writeFileSync(pdf, await doc.save());
// 695x900 keeps the site's existing <Image> dimensions. The close-up is the
// first label (top-left) at 3x, a 288x240pt die-cut, so 864x720.
const first = _internals.slots()[0];
const clip = { x0: first.x, y0: LABEL_SHEET.pageHeight - first.y - LABEL_SHEET.labelHeight, x1: first.x + LABEL_SHEET.labelWidth, y1: LABEL_SHEET.pageHeight - first.y };
execSync(
  `python3 -c "import fitz,sys,json; d=fitz.open(sys.argv[1]); p=d[0]; p.get_pixmap(matrix=fitz.Matrix(695/612, 900/792), alpha=False).save(sys.argv[2]); c=json.loads(sys.argv[3]); p.get_pixmap(matrix=fitz.Matrix(3,3), clip=fitz.Rect(c['x0'],c['y0'],c['x1'],c['y1']), alpha=False).save(sys.argv[4])" ` +
    `${JSON.stringify(pdf)} public/images/labels-preview.png ${JSON.stringify(JSON.stringify(clip))} public/images/labels-preview-label.png`
);
for (const f of ["public/images/labels-preview.png", "public/images/labels-preview-label.png"]) console.log("wrote", f, fs.statSync(f).size, "bytes");
