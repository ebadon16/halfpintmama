// The printable freezer labels: a fillable PDF built per buyer.
//
// One page of the buyer's sheet = one Avery label sheet. Each label carries an
// editable recipe combo box (the book's recipes, or type anything), a date
// field, and a note field. Two fillable pages, then one page of blank labels
// to hand-write. The buyer's email is stamped in the footer of every page and
// in the document metadata — it survives the download, which is worth more
// than any link security.
//
// Artwork: Keegan designs ONE blank label at the Avery size and it lands at
// private/shop/label.png; tiling and fields are done here. Until it exists a
// simple typeset placeholder is drawn instead, so the pipeline can be proven
// end to end now. No border is ever drawn at the label edge — printer drift of
// a millimetre or two turns an edge border lopsided on every label.

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { BOOK_RECIPES } from "./recipes";

// Avery 5163 (2" x 4", 10 per US Letter sheet), the geometry assumed until
// Keegan confirms the freezer-safe product code. Points, 72 per inch.
// ⚠ Change ONLY here when the product code is confirmed.
export const LABEL_SHEET = {
  avery: "5163",
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

// Brand palette (matches globals.css --deep-sage / --sage / --charcoal).
const DEEP_SAGE = rgb(0x6b / 255, 0x7f / 255, 0x5f / 255);
const SAGE = rgb(0x9c / 255, 0xaf / 255, 0x88 / 255);
const CHARCOAL = rgb(0x3d / 255, 0x3d / 255, 0x3d / 255);
const MUTED = rgb(0x6b / 255, 0x6b / 255, 0x66 / 255);

interface Fonts {
  body: PDFFont;
  heading: PDFFont;
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
  const regular = await readFile(path.join(ASSET_DIR, "fonts", "CrimsonText-Regular.ttf"));
  const semibold = await readFile(path.join(ASSET_DIR, "fonts", "CrimsonText-SemiBold.ttf"));
  // subset:false — the fonts back editable fields, so every glyph a buyer might
  // type must be present, not just the ones we drew.
  return {
    body: await doc.embedFont(regular, { subset: false }),
    heading: await doc.embedFont(semibold, { subset: false }),
    stamp: await doc.embedFont(StandardFonts.Helvetica),
  };
}

// Field boxes inside a label, relative to the label's bottom-left.
function fieldBoxes(slot: Slot) {
  const s = LABEL_SHEET;
  const inset = s.safeInset;
  const innerW = s.labelWidth - inset * 2;
  const recipeH = 24;
  const smallH = 18;
  const recipeY = slot.y + s.labelHeight - inset - 30 - recipeH;
  const smallY = recipeY - 12 - smallH;
  return {
    recipe: { x: slot.x + inset, y: recipeY, width: innerW, height: recipeH },
    date: { x: slot.x + inset, y: smallY, width: innerW * 0.42, height: smallH },
    note: { x: slot.x + inset + innerW * 0.5, y: smallY, width: innerW * 0.5, height: smallH },
  };
}

// The stand-in for Keegan's artwork. Same layout the real design will follow.
function drawPlaceholderArt(page: PDFPage, slot: Slot, fonts: Fonts, handwrite: boolean) {
  const s = LABEL_SHEET;
  const inset = s.safeInset;
  const top = slot.y + s.labelHeight;
  page.drawText("Rest and Rise", {
    x: slot.x + inset,
    y: top - inset - 12,
    size: 12,
    font: fonts.heading,
    color: DEEP_SAGE,
  });
  page.drawText("from the freezer, with love", {
    x: slot.x + s.labelWidth - inset - 108,
    y: top - inset - 11,
    size: 8,
    font: fonts.body,
    color: MUTED,
  });
  page.drawLine({
    start: { x: slot.x + inset, y: top - inset - 19 },
    end: { x: slot.x + s.labelWidth - inset, y: top - inset - 19 },
    thickness: 0.75,
    color: SAGE,
  });

  const boxes = fieldBoxes(slot);
  const captions: Array<[string, { x: number; y: number; width: number }]> = [
    ["Recipe", boxes.recipe],
    ["Made on", boxes.date],
    ["Reheat / notes", boxes.note],
  ];
  for (const [label, box] of captions) {
    page.drawText(label, {
      x: box.x,
      y: box.y - 9,
      size: 7,
      font: fonts.body,
      color: MUTED,
    });
    // A faint baseline under each field: a writing line on the blank page, and
    // a visual cue for where the box sits on the fillable ones.
    page.drawLine({
      start: { x: box.x, y: box.y - 1 },
      end: { x: box.x + box.width, y: box.y - 1 },
      thickness: handwrite ? 0.6 : 0.4,
      color: handwrite ? CHARCOAL : SAGE,
      opacity: handwrite ? 0.6 : 0.8,
    });
  }
}

async function loadArtwork(doc: PDFDocument) {
  const file = path.join(ASSET_DIR, "label.png");
  if (!existsSync(file)) return null;
  return doc.embedPng(await readFile(file));
}

function stampFooter(page: PDFPage, fonts: Fonts, email: string) {
  const s = LABEL_SHEET;
  const text = `Licensed to ${email}  |  Rest and Rise by Half Pint Mama  |  halfpintmama.com  |  Avery ${s.avery}, print at 100% (actual size)`;
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
        drawPlaceholderArt(page, slot, fonts, !fillable);
      }
      if (!fillable) return;

      const boxes = fieldBoxes(slot);
      const n = `p${p + 1}_${i + 1}`;

      // addToPage with a font writes the field's default appearance (/DA);
      // setFontSize edits that entry, so it has to come after.
      const recipe = form.createDropdown(`recipe_${n}`);
      recipe.setOptions([...BOOK_RECIPES]);
      recipe.enableEditing(); // pick a book recipe OR type anything
      recipe.addToPage(page, { ...boxes.recipe, borderWidth: 0, font: fonts.heading });
      recipe.setFontSize(12);

      const date = form.createTextField(`date_${n}`);
      date.setMaxLength(24);
      date.addToPage(page, { ...boxes.date, borderWidth: 0, font: fonts.body });
      date.setFontSize(10);

      const note = form.createTextField(`note_${n}`);
      note.setMaxLength(40);
      note.addToPage(page, { ...boxes.note, borderWidth: 0, font: fonts.body });
      note.setFontSize(10);
    });

    stampFooter(page, fonts, email);
  }

  // Bake appearances with the brand font, or typed text renders in Helvetica.
  form.updateFieldAppearances(fonts.body);

  const when = createdAt ?? new Date();
  doc.setTitle("Rest and Rise Freezer Labels");
  doc.setAuthor("Half Pint Mama");
  doc.setSubject(`Licensed to ${email}`);
  doc.setProducer("halfpintmama.com");
  doc.setCreator("halfpintmama.com");
  doc.setCreationDate(when);
  doc.setModificationDate(when);

  return doc.save();
}
