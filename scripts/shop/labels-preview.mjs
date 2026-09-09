// Renders public/images/labels-preview.png: page one of the labels PDF with
// sample recipes filled in, so the delivery page can show what a finished
// sheet looks like (phones render the real form flat). Re-run whenever the
// label artwork or geometry changes:
//   npx tsx scripts/shop/labels-preview.mjs
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

process.env.SHOP_TOKEN_SECRET ||= "x".repeat(48);
const { buildLabelsPdf } = await import(path.join(process.cwd(), "src/lib/shop/labels-pdf.ts"));

const SAMPLE = [
  ["Nesting Ziti", "Oct 14", "350°F, 45 min"],
  ["The House Chili", "Oct 14", "Stovetop, low"],
  ["Aloha Meatballs", "Oct 21", "Crockpot, 3 hr"],
  ["Sourdough English Muffins", "Oct 21", "Toast from frozen"],
  ["Honey Garlic Chicken", "Oct 28", "Instant Pot, 12 min"],
  ["Lactation Banana Bread", "Oct 28", "Thaw overnight"],
  ["Freezer Waffles", "Nov 4", "Toaster"],
  ["Weeknight Butter Chicken", "Nov 4", "Stovetop, low"],
  ["Overnight French Toast Bake", "Nov 11", "350°F, 40 min"],
  ["Italian Mini Quiches", "Nov 11", "350°F, 15 min"],
];

const bytes = await buildLabelsPdf({ email: "you@example.com", createdAt: new Date("2026-01-01") });
const doc = await PDFDocument.load(bytes);
doc.registerFontkit(fontkit);
const form = doc.getForm();
const body = await doc.embedFont(fs.readFileSync("private/shop/fonts/CrimsonText-Regular.ttf"), { subset: false });
const heading = await doc.embedFont(fs.readFileSync("private/shop/fonts/CrimsonText-SemiBold.ttf"), { subset: false });
SAMPLE.forEach(([recipe, date, note], i) => {
  const n = `p1_${i + 1}`;
  const dd = form.getDropdown(`recipe_${n}`); dd.select(recipe); dd.updateAppearances(heading);
  const d = form.getTextField(`date_${n}`); d.setText(date); d.updateAppearances(body);
  const t = form.getTextField(`note_${n}`); t.setText(note); t.updateAppearances(body);
});
form.flatten();
const one = await PDFDocument.create();
const [page] = await one.copyPages(doc, [0]);
one.addPage(page);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "labels-preview-"));
const pdfPath = path.join(tmp, "preview.pdf");
fs.writeFileSync(pdfPath, await one.save());
execSync(`qlmanage -t -s 1200 -o "${tmp}" "${pdfPath}"`, { stdio: "ignore" });
const png = path.join(tmp, "preview.pdf.png");
execSync(`sips -Z 900 "${png}" --out public/images/labels-preview.png`, { stdio: "ignore" });
console.log("wrote public/images/labels-preview.png", fs.statSync("public/images/labels-preview.png").size, "bytes");
