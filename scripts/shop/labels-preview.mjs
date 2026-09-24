// Renders public/images/labels-preview.png: one label sheet with six recipes
// filled in, so the shop, the delivery page and the emails can show what a
// finished sheet looks like (phones render the real form flat). Uses the same
// fonts, geometry and card art as the buyer's PDF; the text is drawn statically
// so the image is deterministic. Re-run whenever the label design changes:
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
page.drawRectangle({ x: 0, y: 0, width: LABEL_SHEET.pageWidth, height: LABEL_SHEET.pageHeight, color: _internals.CREAM });
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
// 695x900 keeps the site's existing <Image> dimensions.
execSync(`python3 -c "import fitz,sys; d=fitz.open(sys.argv[1]); d[0].get_pixmap(matrix=fitz.Matrix(695/612, 900/792), alpha=False).save(sys.argv[2])" ${JSON.stringify(pdf)} public/images/labels-preview.png`);
console.log("wrote public/images/labels-preview.png", fs.statSync("public/images/labels-preview.png").size, "bytes");
