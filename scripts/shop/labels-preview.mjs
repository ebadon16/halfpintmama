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
  // Reheat notes match the book's STORAGE blocks (final interior, Sep 22 2026).
  ["Nesting Ziti", "Oct 14", "375°F, 90 min from frozen"],
  ["The House Chili", "Oct 14", "Thaw, slow cooker 6–8 h"],
  ["Aloha Meatballs", "Oct 21", "Thaw, slow cooker 4–6 h"],
  ["Sourdough English Muffins", "Oct 21", "Toaster, from frozen"],
  ["Honey Garlic Chicken", "Oct 28", "Pressure cooker, 15 min"],
  ["Lactation Banana Bread", "Oct 28", "Microwave 45–60 sec"],
  ["Freezer Waffles", "Nov 4", "Toaster, from frozen"],
  ["Weeknight Butter Chicken", "Nov 4", "Pressure cooker, 15 min"],
  ["Overnight Sourdough French Toast Bake", "Nov 11", "350°F, 8–10 min"],
  ["Italian Mini Quiches", "Nov 11", "350°F, 10–12 min"],
];

const bytes = await buildLabelsPdf({ email: "you@example.com", createdAt: new Date("2026-01-01") });
const doc = await PDFDocument.load(bytes);
doc.registerFontkit(fontkit);
const form = doc.getForm();
const opts = { subset: false, features: { liga: false, rlig: false, calt: false } };
const body = await doc.embedFont(fs.readFileSync("private/shop/fonts/CrimsonText-Regular.ttf"), opts);
const heading = await doc.embedFont(fs.readFileSync("private/shop/fonts/CrimsonText-SemiBold.ttf"), opts);
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
