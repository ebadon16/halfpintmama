// The printable freezer labels: a fillable PDF built per buyer.
//
// One page of the buyer's sheet = one Avery label sheet. Each label carries an
// editable recipe combo box (the book's recipes, or type anything), a date
// field, and a note field. Two fillable pages, then one page of blank labels
// to hand-write. The buyer's email is stamped in the footer of every page and
// in the document metadata — it survives the download, which is worth more
// than any link security.
//
// Artwork: the label is drawn here from brand fonts and colours, so nothing
// on it is licensed from a stock library (Canva Pro content cannot be sold as a
// downloadable file). If a PNG ever lands at private/shop/label.png it is used
// instead. No border is ever drawn at the label edge — printer drift of a
// millimetre or two turns an edge border lopsided on every label.

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, degrees, rgb } from "pdf-lib";
import { BOOK_RECIPES } from "./recipes";

// Avery 5523: 2" x 4", 10 per US Letter sheet, waterproof polyester film.
// Same grid as the far more common 5163, but 5163 is plain paper and will not
// survive a freezer, so the buyer is pointed at the temperature-resistant
// version of the identical layout. Any 2x4 10-up sheet fits. Points, 72 per inch.
// ⚠ Change ONLY here if the layout ever moves.
export const LABEL_SHEET = {
  avery: "5523",
  pageWidth: 612,
  pageHeight: 792,
  columns: 2,
  rows: 5,
  labelWidth: 288,
  labelHeight: 144,
  marginTop: 36,
  marginLeft: 11.25,
  gutterX: 13.5,
  gutterY: 0,
  // Content stays this far inside the die-cut so drift never clips it.
  safeInset: 14,
} as const;

export const FILLABLE_PAGES = 2;
export const BLANK_PAGES = 1;

const ASSET_DIR = path.join(process.cwd(), "private", "shop");

// Brand palette (matches globals.css).
const DEEP_SAGE = rgb(0x6b / 255, 0x7f / 255, 0x5f / 255);
const SAGE = rgb(0x9c / 255, 0xaf / 255, 0x88 / 255);
const LIGHT_SAGE = rgb(0xd4 / 255, 0xe0 / 255, 0xcc / 255);
const TERRACOTTA = rgb(0xa0 / 255, 0x56 / 255, 0x2f / 255);
const CREAM = rgb(0xfa / 255, 0xf7 / 255, 0xf2 / 255);
const CHARCOAL = rgb(0x3d / 255, 0x3d / 255, 0x3d / 255);
const MUTED = rgb(0x6b / 255, 0x6b / 255, 0x66 / 255);

interface Fonts {
  body: PDFFont;
  heading: PDFFont;
  italic: PDFFont;
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
  // subset:false — the fonts back editable fields, so every glyph a buyer might
  // type must be present, not just the ones we drew.
  // Ligatures off: viewers rasterise form-field text glyph by glyph, and the
  // "ffi" in Muffins otherwise renders with a gap.
  const opts = { subset: false, features: { liga: false, rlig: false, calt: false } };
  return {
    body: await doc.embedFont(await read("CrimsonText-Regular.ttf"), opts),
    heading: await doc.embedFont(await read("CrimsonText-SemiBold.ttf"), opts),
    italic: await doc.embedFont(await read("CrimsonText-Italic.ttf"), opts),
    stamp: await doc.embedFont(StandardFonts.Helvetica),
  };
}

// Field boxes inside a label, relative to the label's bottom-left.
function fieldBoxes(slot: Slot) {
  const s = LABEL_SHEET;
  const inset = s.safeInset + 8;
  const innerW = s.labelWidth - inset * 2;
  const recipeH = 24;
  const smallH = 18;
  const recipeY = slot.y + s.labelHeight - inset - 34 - recipeH;
  const smallY = recipeY - 16 - smallH;
  return {
    recipe: { x: slot.x + inset, y: recipeY, width: innerW, height: recipeH },
    date: { x: slot.x + inset, y: smallY, width: innerW * 0.4, height: smallH },
    note: { x: slot.x + inset + innerW * 0.48, y: smallY, width: innerW * 0.52, height: smallH },
  };
}

// A small wheat sprig: a curved stem with paired grains, drawn from
// primitives so nothing on the label comes from a stock library.
function drawSprig(page: PDFPage, x: number, y: number, size: number) {
  const stemH = size;
  page.drawLine({ start: { x, y }, end: { x, y: y + stemH }, thickness: 0.8, color: SAGE });
  const grains = 5;
  for (let i = 0; i < grains; i++) {
    const gy = y + stemH * (0.35 + (0.65 * i) / grains);
    const scale = 1 - i * 0.08;
    for (const side of [-1, 1]) {
      page.drawEllipse({
        x: x + side * size * 0.11 * scale,
        y: gy + size * 0.06,
        xScale: size * 0.075 * scale,
        yScale: size * 0.13 * scale,
        rotate: degrees(side * -28),
        color: LIGHT_SAGE,
        borderColor: SAGE,
        borderWidth: 0.6,
      });
    }
  }
  page.drawEllipse({ x, y: y + stemH + size * 0.06, xScale: size * 0.07, yScale: size * 0.13, color: LIGHT_SAGE, borderColor: SAGE, borderWidth: 0.6 });
}

// The label design. Everything is drawn here from brand fonts and colours;
// no stock artwork. A cream panel sits well inside the die-cut so a
// millimetre of printer drift never shows as a crooked edge.
function drawLabelArt(page: PDFPage, slot: Slot, fonts: Fonts, handwrite: boolean) {
  const s = LABEL_SHEET;
  const inset = s.safeInset;
  const top = slot.y + s.labelHeight;
  const panel = { x: slot.x + inset, y: slot.y + inset, w: s.labelWidth - inset * 2, h: s.labelHeight - inset * 2 };

  page.drawRectangle({ x: panel.x, y: panel.y, width: panel.w, height: panel.h, color: CREAM, borderColor: LIGHT_SAGE, borderWidth: 0.75, borderDashArray: [1.5, 2.5] });

  // Header: title, tagline, sprig.
  const hx = panel.x + 10;
  const hy = top - inset - 22;
  page.drawText("Rest", { x: hx, y: hy, size: 14, font: fonts.heading, color: DEEP_SAGE });
  const restW = fonts.heading.widthOfTextAtSize("Rest", 14);
  page.drawText("&", { x: hx + restW + 4, y: hy, size: 14, font: fonts.italic, color: TERRACOTTA });
  const ampW = fonts.italic.widthOfTextAtSize("&", 14);
  page.drawText("Rise", { x: hx + restW + ampW + 8, y: hy, size: 14, font: fonts.heading, color: DEEP_SAGE });
  page.drawText("from the freezer, with love", { x: hx, y: hy - 12, size: 8, font: fonts.italic, color: MUTED });
  drawSprig(page, panel.x + panel.w - 16, hy - 12, 26);

  page.drawLine({ start: { x: hx, y: hy - 20 }, end: { x: panel.x + panel.w - 30, y: hy - 20 }, thickness: 0.6, color: SAGE });

  const boxes = fieldBoxes(slot);
  const captions: Array<[string, { x: number; y: number; width: number }]> = [
    ["RECIPE", boxes.recipe],
    ["MADE ON", boxes.date],
    ["REHEAT", boxes.note],
  ];
  for (const [label, box] of captions) {
    // Small-caps style caption with tracking, below the writing line.
    let cx = box.x;
    for (const ch of label) {
      page.drawText(ch, { x: cx, y: box.y - 9, size: 6, font: fonts.body, color: MUTED });
      cx += fonts.body.widthOfTextAtSize(ch, 6) + 1.1;
    }
    // A dotted writing line: a guide for handwriting on the blank page, a quiet
    // marker of where the box sits on the fillable ones.
    page.drawLine({
      start: { x: box.x, y: box.y - 1.5 },
      end: { x: box.x + box.width, y: box.y - 1.5 },
      thickness: handwrite ? 0.7 : 0.5,
      color: handwrite ? CHARCOAL : SAGE,
      opacity: handwrite ? 0.55 : 0.9,
      dashArray: [0.8, 1.6],
    });
  }

  const site = "halfpintmama.com";
  page.drawText(site, { x: panel.x + panel.w - 8 - fonts.italic.widthOfTextAtSize(site, 6.5), y: panel.y + 6, size: 6.5, font: fonts.italic, color: MUTED });
}

async function loadArtwork(doc: PDFDocument) {
  const file = path.join(ASSET_DIR, "label.png");
  if (!existsSync(file)) return null;
  return doc.embedPng(await readFile(file));
}

function stampFooter(page: PDFPage, fonts: Fonts, email: string) {
  const s = LABEL_SHEET;
  const text = `Licensed to ${email}  |  Rest & Rise by Half Pint Mama  |  halfpintmama.com  |  Avery ${s.avery} or any 2" x 4" 10-up label, print at 100% (actual size)`;
  page.drawText(text, {
    x: s.marginLeft,
    y: 14,
    size: 6.5,
    font: fonts.stamp,
    color: MUTED,
  });
}

export interface LabelsPdfOptions {
  email: string;
  // Fixed creation date so output is reproducible (and so a buyer's two
  // downloads of the same product are byte-identical). Defaults to now.
  createdAt?: Date;
}

export async function buildLabelsPdf({ email, createdAt }: LabelsPdfOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fonts = await loadFonts(doc);
  const art = await loadArtwork(doc);
  const form = doc.getForm();
  const s = LABEL_SHEET;

  const totalPages = FILLABLE_PAGES + BLANK_PAGES;
  for (let p = 0; p < totalPages; p++) {
    const fillable = p < FILLABLE_PAGES;
    const page = doc.addPage([s.pageWidth, s.pageHeight]);

    slots().forEach((slot, i) => {
      if (art) {
        page.drawImage(art, { x: slot.x, y: slot.y, width: s.labelWidth, height: s.labelHeight });
      } else {
        drawLabelArt(page, slot, fonts, !fillable);
      }
      if (!fillable) return;

      const boxes = fieldBoxes(slot);
      const n = `p${p + 1}_${i + 1}`;

      // addToPage with a font writes the field's default appearance (/DA);
      // setFontSize edits that entry, so it has to come after.
      const recipe = form.createDropdown(`recipe_${n}`);
      recipe.setOptions([...BOOK_RECIPES]);
      recipe.enableEditing(); // pick a book recipe OR type anything
      recipe.addToPage(page, { ...boxes.recipe, borderWidth: 0, backgroundColor: CREAM, font: fonts.heading });
      recipe.setFontSize(12);

      const date = form.createTextField(`date_${n}`);
      date.setMaxLength(24);
      date.addToPage(page, { ...boxes.date, borderWidth: 0, backgroundColor: CREAM, font: fonts.body });
      date.setFontSize(10);

      const note = form.createTextField(`note_${n}`);
      note.setMaxLength(40);
      note.addToPage(page, { ...boxes.note, borderWidth: 0, backgroundColor: CREAM, font: fonts.body });
      note.setFontSize(10);
    });

    stampFooter(page, fonts, email);
  }

  // Bake appearances with the brand font, or typed text renders in Helvetica.
  form.updateFieldAppearances(fonts.body);

  const when = createdAt ?? new Date();
  doc.setTitle("Rest & Rise Freezer Labels");
  doc.setAuthor("Half Pint Mama");
  doc.setSubject(`Licensed to ${email}`);
  doc.setProducer("halfpintmama.com");
  doc.setCreator("halfpintmama.com");
  doc.setCreationDate(when);
  doc.setModificationDate(when);

  return doc.save();
}
