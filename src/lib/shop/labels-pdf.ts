// The printable freezer labels: a fillable PDF built per buyer.
//
// Page 1 is the guide. Then FILLABLE_PAGES of label sheets and one page of
// hand-write labels. Each label carries a recipe dropdown (the book's 35, or
// type anything), a Made-on date, a best-by/yield line and the freezer
// directions. Picking a book recipe fills the best-by line and the directions
// automatically (document JavaScript, honoured by Acrobat Reader, Chrome, Edge
// and Firefox; Apple Preview shows the fields but does not run it, so the text
// can also be typed). The buyer's email is stamped on every page and in the
// document metadata: it survives the download, which is worth more than any
// link security.
//
// Design follows Keegan's Canva "freezer labels" draft (Sep 23 2026), which in
// turn follows the book: cream page, white rounded card, Lora throughout, the
// book's terracotta for the recipe name and its steel blue for the quiet
// lines. The book's display face (TAN Pearl) is a paid licence and is not
// embedded. No stock artwork anywhere (Canva Pro content cannot be sold as a
// downloadable file). No border is drawn at the die-cut edge: a millimetre of
// printer drift would make it lopsided on every label, so the card sits inset.

import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import {
  AcroChoiceFlags,
  PDFDocument,
  PDFFont,
  PDFName,
  PDFPage,
  PDFString,
  StandardFonts,
  rgb,
  type Color,
} from "pdf-lib";
import { RECIPES, recipeLabel, recipeMeta } from "./recipes";

// Avery 5164 (paper) / 5524 (waterproof film, the one to buy for a freezer):
// 4" x 3 1/3", 6 per US Letter sheet, 2 across and 3 down. Avery's published
// geometry: top margin 0.5", side margins 0.15625", horizontal pitch 4.1875",
// vertical pitch 3.3333", no vertical gap. Points, 72 per inch.
// ⚠ Change ONLY here if the layout ever moves.
export const LABEL_SHEET = {
  avery: "5164",
  averyWaterproof: "5524",
  size: '4" × 3⅓"',
  // Same size in characters Helvetica can encode, for the footer stamp.
  sizeAscii: '4 x 3-1/3 in',
  perSheet: 6,
  pageWidth: 612,
  pageHeight: 792,
  columns: 2,
  rows: 3,
  labelWidth: 288,
  labelHeight: 240,
  marginTop: 36,
  marginLeft: 11.25,
  gutterX: 13.5,
  gutterY: 0,
  // The white card sits this far inside the die-cut so drift never clips it
  // unevenly; the cream page colour fills the rest of the label.
  safeInset: 6,
} as const;

export const GUIDE_PAGES = 1;
export const FILLABLE_PAGES = 3;
export const BLANK_PAGES = 1;
export const TOTAL_PAGES = GUIDE_PAGES + FILLABLE_PAGES + BLANK_PAGES;
// What the guide tells the buyer to feed to the printer.
export const LABEL_PAGE_RANGE = `${GUIDE_PAGES + 1}–${TOTAL_PAGES}`;

const ASSET_DIR = path.join(process.cwd(), "private", "shop");

// The book's palette, sampled from the KDP interior and Keegan's label draft.
const INK = rgb(0x2d / 255, 0x3a / 255, 0x43 / 255);
const NAVY = rgb(0x27 / 255, 0x4f / 255, 0x6a / 255);
const STEEL = rgb(0x6f / 255, 0x94 / 255, 0xae / 255);
// Small text in the two accent colours is darkened a step from the book's
// values so it still reads when a buyer prints in black and white: the book's
// steel and terracotta both grey out to about 55% and vanish at 8pt.
const STEEL_TEXT = rgb(0x4f / 255, 0x78 / 255, 0x94 / 255);
const TERRACOTTA = rgb(0xb3 / 255, 0x6a / 255, 0x46 / 255);
const TINT = rgb(0xe0 / 255, 0xe9 / 255, 0xee / 255);
const CREAM = rgb(0xfb / 255, 0xf6 / 255, 0xec / 255);
const WHITE = rgb(1, 1, 1);

interface Fonts {
  body: PDFFont; // Lora Regular: field text, body copy
  bold: PDFFont; // Lora Bold: recipe names, headings
  italic: PDFFont; // Lora Italic
  boldItalic: PDFFont; // Lora Bold Italic: the guide title
  caps: PDFFont; // Lato Bold: small tracked captions
  stamp: PDFFont;
}

interface Slot {
  x: number;
  y: number; // bottom-left, PDF coordinates
}

function slots(): Slot[] {
  const s = LABEL_SHEET;
  const out: Slot[] = [];
  for (let row = 0; row < s.rows; row++) {
    for (let col = 0; col < s.columns; col++) {
      const x = s.marginLeft + col * (s.labelWidth + s.gutterX);
      const top = s.pageHeight - s.marginTop - row * (s.labelHeight + s.gutterY);
      out.push({ x, y: top - s.labelHeight });
    }
  }
  return out;
}

async function loadFonts(doc: PDFDocument): Promise<Fonts> {
  doc.registerFontkit(fontkit);
  const read = (name: string) => readFile(path.join(ASSET_DIR, "fonts", name));
  // The two field fonts embed unsubsetted: every glyph a buyer might type has
  // to be present, not just the ones we drew. Ligatures off, because viewers
  // rasterise field text glyph by glyph and "ffi" in Muffins otherwise gaps.
  const field = { subset: false, features: { liga: false, rlig: false, calt: false } };
  const draw = { subset: true, features: { liga: false, rlig: false, calt: false } };
  return {
    body: await doc.embedFont(await read("Lora-Regular.ttf"), field),
    bold: await doc.embedFont(await read("Lora-Bold.ttf"), field),
    italic: await doc.embedFont(await read("Lora-Italic.ttf"), field),
    boldItalic: await doc.embedFont(await read("Lora-BoldItalic.ttf"), draw),
    caps: await doc.embedFont(await read("Lato-Bold.ttf"), draw),
    stamp: await doc.embedFont(StandardFonts.Helvetica),
  };
}

// ---- drawing helpers ---------------------------------------------------------

function roundedRect(page: PDFPage, x: number, y: number, w: number, h: number, r: number, color: Color, border?: { color: Color; width: number; opacity?: number }) {
  // drawSvgPath takes y-down coordinates relative to (x, y) = top-left.
  const d = [
    `M ${r} 0`,
    `H ${w - r}`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `H ${r}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `V ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    "Z",
  ].join(" ");
  page.drawSvgPath(d, { x, y: y + h, color, borderWidth: border?.width ?? 0, borderColor: border?.color, borderOpacity: border?.opacity });
}

function tracked(page: PDFPage, text: string, x: number, y: number, size: number, font: PDFFont, color: Color, spacing: number) {
  let cx = x;
  for (const ch of text) {
    page.drawText(ch, { x: cx, y, size, font, color });
    cx += font.widthOfTextAtSize(ch, size) + spacing;
  }
  return cx - x - spacing;
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.split(" ");
    let line = "";
    for (const w of words) {
      const probe = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(probe, size) <= width) line = probe;
      else {
        if (line) lines.push(line);
        line = w;
      }
    }
    lines.push(line);
  }
  return lines;
}

function paragraph(page: PDFPage, text: string, x: number, y: number, width: number, size: number, font: PDFFont, color: Color, leading = size * 1.42): number {
  let cy = y;
  for (const line of wrap(text, font, size, width)) {
    page.drawText(line, { x, y: cy, size, font, color });
    cy -= leading;
  }
  return cy;
}

// ---- the label ---------------------------------------------------------------

// Everything inside one label, relative to its slot. The card is the white
// panel; content sits a further inset inside it.
function labelGeometry(slot: Slot) {
  const s = LABEL_SHEET;
  const card = { x: slot.x + s.safeInset, y: slot.y + s.safeInset, w: s.labelWidth - s.safeInset * 2, h: s.labelHeight - s.safeInset * 2 };
  const pad = 14;
  const x = card.x + pad;
  const w = card.w - pad * 2;
  const top = card.y + card.h;
  const title = { x, y: top - 12 - 17, width: w, height: 17 };
  const rowY = title.y - 18;
  const madeLabelW = 50;
  const made = { x: x + madeLabelW, y: rowY, width: 96, height: 14 };
  // Two lines: "Best by 3 months, use within 12 months · serves 6–8 · slow cooker".
  // Viewers set multiline text at about 1.5x the font size, so 30pt holds two
  // lines of 8.5pt with their padding.
  const meta = { x, y: rowY - 32, width: w, height: 30 };
  const dirTop = meta.y - 12; // leaves room for the caption
  const dir = { x, y: card.y + 16, width: w, height: dirTop - (card.y + 16) };
  return { card, x, w, top, title, made, meta, dir, madeLabelW };
}

function drawLabelArt(page: PDFPage, slot: Slot, fonts: Fonts, handwrite: boolean) {
  const g = labelGeometry(slot);
  roundedRect(page, g.card.x, g.card.y, g.card.w, g.card.h, 10, WHITE, { color: STEEL, width: 0.6, opacity: 0.55 });

  // Captions in the book's section-head style: Lato Bold, tracked, terracotta.
  tracked(page, "MADE ON", g.x, g.made.y + 4, 6.5, fonts.caps, TERRACOTTA, 1.2);
  tracked(page, "FROM THE FREEZER", g.x, g.dir.y + g.dir.height + 3, 6.5, fonts.caps, TERRACOTTA, 1.2);
  // Rules sit just BELOW each field box, where the field's white fill cannot
  // cover them: a writing line on the hand-write sheet, a "type here" cue on
  // the fillable ones.
  page.drawLine({ start: { x: g.made.x, y: g.made.y - 1.5 }, end: { x: g.made.x + g.made.width, y: g.made.y - 1.5 }, thickness: 0.8, color: INK, opacity: 0.85 });
  page.drawLine({ start: { x: g.x, y: g.title.y - 2 }, end: { x: g.x + g.w, y: g.title.y - 2 }, thickness: 0.6, color: STEEL, opacity: handwrite ? 0.8 : 0.45 });

  if (handwrite) {
    // Writing guides where the fields would be.
    page.drawLine({ start: { x: g.x, y: g.meta.y + 11 }, end: { x: g.x + g.w, y: g.meta.y + 11 }, thickness: 0.5, color: STEEL, opacity: 0.7, dashArray: [0.8, 1.6] });
    page.drawLine({ start: { x: g.x, y: g.meta.y - 1 }, end: { x: g.x + g.w, y: g.meta.y - 1 }, thickness: 0.5, color: STEEL, opacity: 0.7, dashArray: [0.8, 1.6] });
    const lines = Math.floor(g.dir.height / 15);
    for (let i = 1; i <= lines; i++) {
      const y = g.dir.y + g.dir.height - i * 15;
      page.drawLine({ start: { x: g.x, y }, end: { x: g.x + g.w, y }, thickness: 0.5, color: STEEL, opacity: 0.6, dashArray: [0.8, 1.6] });
    }
  }

  // Quiet footer, like the running foot of the book.
  const foot = "Rest & Rise  ·  halfpintmama.com";
  page.drawText(foot, { x: g.card.x + g.card.w - 12 - fonts.italic.widthOfTextAtSize(foot, 6.5), y: g.card.y + 6, size: 6.5, font: fonts.italic, color: STEEL_TEXT });
}

// Renders a recipe onto a hand-write label as static text (used only for the
// preview image, never in a buyer's file).
export function previewLabel(page: PDFPage, slot: Slot, fonts: Fonts, name: string, made: string, meta: string, directions: string) {
  const g = labelGeometry(slot);
  const upper = name.toUpperCase();
  const size = Math.min(11, (11 * g.w) / Math.max(g.w, fonts.bold.widthOfTextAtSize(upper, 11)));
  page.drawText(upper, { x: g.x, y: g.title.y + 5, size, font: fonts.bold, color: NAVY });
  page.drawText(made, { x: g.made.x + 3, y: g.made.y + 3, size: 9.5, font: fonts.body, color: INK });
  paragraph(page, meta, g.x, g.meta.y + g.meta.height - 9, g.w, 8.5, fonts.italic, STEEL_TEXT, 11.5);
  paragraph(page, directions, g.x, g.dir.y + g.dir.height - 9, g.w, 8, fonts.body, INK, 11.2);
}

function stampFooter(page: PDFPage, fonts: Fonts, email: string, note?: string) {
  const s = LABEL_SHEET;
  // The hand-write sheet says what it is instead of repeating the sheet spec,
  // which the guide already gives; the line has to fit the page.
  const text = note
    ? `${note}  |  Licensed to ${email}  |  Rest & Rise by Half Pint Mama  |  halfpintmama.com`
    : `Licensed to ${email}  |  Rest & Rise by Half Pint Mama  |  halfpintmama.com  |  Avery ${s.averyWaterproof} (or ${s.avery}) ${s.sizeAscii}, ${s.perSheet} per sheet, print at 100% (actual size)`;
  page.drawText(text, { x: s.marginLeft, y: 14, size: 6.5, font: fonts.stamp, color: STEEL_TEXT });
}

// ---- the guide page ----------------------------------------------------------

function drawGuide(page: PDFPage, fonts: Fonts, email: string) {
  const s = LABEL_SHEET;
  page.drawRectangle({ x: 0, y: 0, width: s.pageWidth, height: s.pageHeight, color: CREAM });
  const L = 60;
  const W = s.pageWidth - L * 2;
  let y = s.pageHeight - 78;

  const cx = s.pageWidth / 2;
  const title = "make-ahead freezer labels";
  page.drawText(title, { x: cx - fonts.boldItalic.widthOfTextAtSize(title, 30) / 2, y, size: 30, font: fonts.boldItalic, color: STEEL });
  y -= 26;
  const sub = "A printable companion to Rest & Rise";
  page.drawText(sub, { x: cx - fonts.body.widthOfTextAtSize(sub, 14) / 2, y, size: 14, font: fonts.body, color: INK });
  y -= 18;
  const by = "Half Pint Mama";
  page.drawText(by, { x: cx - fonts.italic.widthOfTextAtSize(by, 12) / 2, y, size: 12, font: fonts.italic, color: STEEL });
  y -= 18;
  // A quiet ornament in the book's two accent colours, drawn, not imported.
  for (let i = -3; i <= 3; i++) {
    page.drawCircle({ x: cx + i * 14, y, size: i === 0 ? 3.2 : 2.2, color: i % 2 === 0 ? TERRACOTTA : STEEL });
  }
  y -= 24;

  const intro =
    "You did the work of filling your freezer. These labels make sure none of it goes to waste. " +
    "Every label is built for the recipes in Rest & Rise, with the freezer directions already written out, " +
    "so future you, the one running on very little sleep, does not have to remember a thing. " +
    "Pull a meal from the freezer, read the label, and dinner takes care of itself.";
  y = paragraph(page, intro, L + 30, y, W - 60, 10.5, fonts.body, INK, 15);
  y -= 8;

  const section = (head: string, body: string[]) => {
    tracked(page, head.toUpperCase(), L, y, 9, fonts.caps, TERRACOTTA, 1.4);
    y -= 15;
    for (const b of body) {
      y = paragraph(page, b, L, y, W, 10, fonts.body, INK, 14);
      y -= 4;
    }
    y -= 8;
  };

  section("What you will need", [
    `Label sheets 4 by 3 1/3 inches, ${s.perSheet} to a page, in the Avery ${s.avery} layout. For the freezer choose the waterproof film version, Avery ${s.averyWaterproof}, so labels do not lift in the cold; plain paper ${s.avery} is fine for the pantry. Match the sheet to your printer: laser sheets in a laser printer, inkjet in an inkjet.`,
  ]);

  section("Filling them in", [
    `Open this file on a computer in Adobe Acrobat Reader (free), Chrome, Edge or Firefox. On each label, click the recipe box and pick a recipe from the book, or type your own. Then click anywhere outside the box (or press Tab): the best-by line and the freezer directions fill themselves in. Every box stays editable, so shorten or add to anything you like.`,
    `Apple Preview shows the boxes but will not fill them in for you; type the directions from the book instead, or use one of the readers above.`,
    `Write the date you made the meal. The best-by line fills itself in: most meals are best by three months and safe to use within twelve. Save a copy when you are done so your sheet is there next time.`,
  ]);

  section("Before you print", [
    `Print pages ${LABEL_PAGE_RANGE} only. This page is for you, not the label sheet.`,
    `Set your printer to Actual Size, or 100 percent. Never Fit to Page. This is the one setting that keeps the text lined up with the labels.`,
    `Do a test run on plain paper first, then hold it against a blank label sheet up to a window to check the alignment. Once it lines up, load your labels and print.`,
    `The last page is a hand-write sheet: the same card with writing lines, for your own recipes or anything not in the book.`,
  ]);

  section("On the bag", [
    `Stick the label on while the bag or foil is dry and flat, before it goes in the freezer. The directions are the book's from-frozen method, kept short to fit the label. For more detailed instructions, and for cooking from thawed and for leftovers, see the recipe page in Rest & Rise.`,
  ]);

  // Tinted note box, the book's Nurse's Note treatment.
  const noteH = 66;
  y -= 4;
  roundedRect(page, L, y - noteH + 14, W, noteH, 8, TINT);
  tracked(page, "FOR YOUR KITCHEN ONLY", L + 20, y - 6, 8.5, fonts.caps, NAVY, 1.3);
  paragraph(page, `These labels are made for ${email} and are for personal use. Please do not resell or share the file. Thank you for keeping this little shop running.`, L + 20, y - 25, W - 40, 9.5, fonts.body, INK, 14.5);
}

// ---- document JavaScript -----------------------------------------------------

// Escapes to ASCII so the script survives PDFDocEncoding untouched.
function jsString(value: string): string {
  return JSON.stringify(value).replace(/[\u007f-￿]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

function directionsScript(): string {
  const entries = RECIPES.map((r) => `${jsString(recipeLabel(r).toUpperCase())}:[${jsString(recipeMeta(r))},${jsString(r.directions)}]`);
  return (
    `var RR_LABELS = {${entries.join(",")}};\n` +
    // Called from each recipe box's validate action with the label's suffix.
    // Leaves the text alone when the buyer typed a recipe of their own.
    `function rrFill(value, n) {\n` +
    `  var r = RR_LABELS[String(value).toUpperCase()];\n` +
    `  if (!r) return;\n` +
    `  var m = this.getField("meta_" + n); if (m) m.value = r[0];\n` +
    `  var d = this.getField("dir_" + n); if (d) d.value = r[1];\n` +
    `}\n`
  );
}

// ---- build -------------------------------------------------------------------

export interface LabelsPdfOptions {
  email: string;
  // Fixed creation date so output is reproducible (and so a buyer's two
  // downloads of the same product are byte-identical). Defaults to now.
  createdAt?: Date;
  // QA only: recipe names to pre-select by label suffix ("p1_1"), so a review
  // can see the real appearance streams. Buyers' files never set this.
  prefill?: Record<string, string>;
}

export async function buildLabelsPdf({ email, createdAt, prefill }: LabelsPdfOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fonts = await loadFonts(doc);
  const form = doc.getForm();
  const s = LABEL_SHEET;
  // Recipe titles are set in capitals, as on the book's recipe pages.
  const options = RECIPES.map((r) => recipeLabel(r).toUpperCase());

  doc.addJavaScript("restAndRiseLabels", directionsScript());

  const guide = doc.addPage([s.pageWidth, s.pageHeight]);
  drawGuide(guide, fonts, email);
  stampFooter(guide, fonts, email);

  for (let p = 0; p < FILLABLE_PAGES + BLANK_PAGES; p++) {
    const fillable = p < FILLABLE_PAGES;
    // Label pages get no page colour: they print onto white label stock, and a
    // tinted page would just be toner over the whole sheet (and a grey wash in
    // black and white). The guide page keeps the book's cream.
    const page = doc.addPage([s.pageWidth, s.pageHeight]);

    slots().forEach((slot, i) => {
      drawLabelArt(page, slot, fonts, !fillable);
      if (!fillable) return;

      const g = labelGeometry(slot);
      const n = `p${p + 1}_${i + 1}`;

      // addToPage with a font writes the field's default appearance (/DA);
      // setFontSize edits that entry, so it has to come after.
      const recipe = form.createDropdown(`recipe_${n}`);
      recipe.setOptions(options);
      recipe.enableEditing(); // pick a book recipe OR type anything
      recipe.addToPage(page, { ...g.title, borderWidth: 0, backgroundColor: WHITE, textColor: NAVY, font: fonts.bold });
      // Auto-size (0): the longest book titles shrink to fit the box and a
      // buyer's own long name never clips.
      recipe.setFontSize(0);
      // Commit on selection so the auto-fill runs the moment a recipe is picked,
      // and run rrFill as the field's validate action.
      recipe.acroField.setFlagTo(AcroChoiceFlags.CommitOnSelChange, true);
      recipe.acroField.dict.set(
        PDFName.of("AA"),
        doc.context.obj({ V: { Type: "Action", S: "JavaScript", JS: PDFString.of(`rrFill(event.value, "${n}");`) } })
      );
      const pre = prefill?.[n] ? RECIPES.find((r) => r.name === prefill[n]) : undefined;
      if (pre) recipe.select(pre.name.toUpperCase());
      recipe.updateAppearances(fonts.bold);

      const made = form.createTextField(`made_${n}`);
      made.setMaxLength(16);
      made.addToPage(page, { ...g.made, borderWidth: 0, backgroundColor: WHITE, textColor: INK, font: fonts.body });
      made.setFontSize(9.5);
      if (pre) made.setText("Oct 14");
      made.updateAppearances(fonts.body);

      const meta = form.createTextField(`meta_${n}`);
      meta.enableMultiline();
      meta.setMaxLength(120);
      meta.addToPage(page, { ...g.meta, borderWidth: 0, backgroundColor: WHITE, textColor: STEEL_TEXT, font: fonts.italic });
      meta.setFontSize(8.5);
      if (pre) meta.setText(recipeMeta(pre));
      meta.updateAppearances(fonts.italic);

      const dir = form.createTextField(`dir_${n}`);
      dir.enableMultiline();
      dir.setMaxLength(420);
      dir.addToPage(page, { ...g.dir, borderWidth: 0, backgroundColor: WHITE, textColor: INK, font: fonts.body });
      dir.setFontSize(8);
      if (pre) dir.setText(pre.directions);
      dir.updateAppearances(fonts.body);
    });

    stampFooter(page, fonts, email, fillable ? undefined : "HAND-WRITE SHEET: for your own recipes or anything not in the book");
  }

  const when = createdAt ?? new Date();
  doc.setTitle("Rest & Rise Freezer Labels");
  doc.setAuthor("Half Pint Mama");
  doc.setSubject(`Licensed to ${email}`);
  doc.setProducer("halfpintmama.com");
  doc.setCreator("halfpintmama.com");
  doc.setCreationDate(when);
  doc.setModificationDate(when);

  // Appearances were baked per field with their own fonts above; a second pass
  // here would repaint them all in one font.
  return doc.save({ updateFieldAppearances: false });
}

// For the preview renderer: same fonts and geometry as the real file.
export const _internals = { loadFonts, slots, drawLabelArt, labelGeometry, CREAM, WHITE };
