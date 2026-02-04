/**
 * Migration script: TinaCMS markdown → Sanity
 *
 * Usage:
 *   npx tsx scripts/migrate-to-sanity.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_TOKEN (Editor role)
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@sanity/client";

// ---------- Sanity client ----------
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

const postsDir = path.join(process.cwd(), "src/content/posts");

// ---------- Markdown → Portable Text ----------

interface PortableTextBlock {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

let keyCounter = 0;
function genKey(): string {
  return `k${Date.now().toString(36)}${(keyCounter++).toString(36)}`;
}

function markdownToPortableText(markdown: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Custom image comment: <!-- IMG: file | LAYOUT: x | SIZE: x -->
    const imgCommentMatch = line.match(
      /<!--\s*IMG:\s*([^|]+)\|\s*LAYOUT:\s*(\S+)\s*\|\s*SIZE:\s*(\S+)\s*-->/
    );
    if (imgCommentMatch) {
      const files = imgCommentMatch[1].split(",").map((f: string) => f.trim());
      const layout = imgCommentMatch[2].trim();
      const size = imgCommentMatch[3].trim();
      for (const file of files) {
        blocks.push({
          _type: "externalImage",
          _key: genKey(),
          url: `/images/${file}`,
          alt: "",
          layout,
          size,
        });
      }
      i++;
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      // Skip HR — they're decorative
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const style = level === 1 ? "h2" : level === 2 ? "h2" : level === 3 ? "h3" : "h4";
      blocks.push({
        _type: "block",
        _key: genKey(),
        style,
        children: parseInlineMarkdown(headingMatch[2]),
        markDefs: extractMarkDefs(headingMatch[2]),
      });
      i++;
      continue;
    }

    // Markdown image: ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (imgMatch) {
      blocks.push({
        _type: "externalImage",
        _key: genKey(),
        url: imgMatch[2],
        alt: imgMatch[1] || "",
        layout: "center",
        size: "medium",
      });
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^- /)) {
      const listItems: PortableTextBlock[] = [];
      while (i < lines.length && lines[i].match(/^- /)) {
        const text = lines[i].replace(/^- /, "");
        listItems.push({
          _type: "block",
          _key: genKey(),
          style: "normal",
          listItem: "bullet",
          level: 1,
          children: parseInlineMarkdown(text),
          markDefs: extractMarkDefs(text),
        });
        i++;
      }
      blocks.push(...listItems);
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      const listItems: PortableTextBlock[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        const text = lines[i].replace(/^\d+\.\s/, "");
        listItems.push({
          _type: "block",
          _key: genKey(),
          style: "normal",
          listItem: "number",
          level: 1,
          children: parseInlineMarkdown(text),
          markDefs: extractMarkDefs(text),
        });
        i++;
      }
      blocks.push(...listItems);
      continue;
    }

    // Regular paragraph — collect consecutive non-empty lines
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].match(/^#{1,4}\s/) &&
      !lines[i].match(/^- /) &&
      !lines[i].match(/^\d+\.\s/) &&
      !lines[i].match(/^---$/) &&
      !lines[i].match(/^!\[/) &&
      !lines[i].match(/<!--\s*IMG:/)
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(" ");
      blocks.push({
        _type: "block",
        _key: genKey(),
        style: "normal",
        children: parseInlineMarkdown(text),
        markDefs: extractMarkDefs(text),
      });
    }
  }

  return blocks;
}

interface InlineChild {
  _type: string;
  _key: string;
  text: string;
  marks: string[];
}

function parseInlineMarkdown(text: string): InlineChild[] {
  const children: InlineChild[] = [];

  // Regex to find bold, italic, links, and images inline
  // Process the text sequentially
  let remaining = text;

  while (remaining.length > 0) {
    // Find the next special token
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const imgMatch = remaining.match(/!\[([^\]]*)\]\(([^)]+)\)/);

    // Find earliest match
    const candidates: { type: string; index: number; match: RegExpMatchArray }[] = [];
    if (boldMatch && boldMatch.index !== undefined) candidates.push({ type: "bold", index: boldMatch.index, match: boldMatch });
    if (italicMatch && italicMatch.index !== undefined) candidates.push({ type: "italic", index: italicMatch.index, match: italicMatch });
    if (linkMatch && linkMatch.index !== undefined) candidates.push({ type: "link", index: linkMatch.index, match: linkMatch });
    if (imgMatch && imgMatch.index !== undefined) candidates.push({ type: "img", index: imgMatch.index, match: imgMatch });

    if (candidates.length === 0) {
      // No more special tokens — add remaining as plain text
      if (remaining) {
        children.push({ _type: "span", _key: genKey(), text: remaining, marks: [] });
      }
      break;
    }

    // Pick the earliest
    candidates.sort((a, b) => a.index - b.index);
    const first = candidates[0];

    // Add plain text before the match
    if (first.index > 0) {
      children.push({ _type: "span", _key: genKey(), text: remaining.substring(0, first.index), marks: [] });
    }

    if (first.type === "bold") {
      children.push({ _type: "span", _key: genKey(), text: first.match[1], marks: ["strong"] });
    } else if (first.type === "italic") {
      children.push({ _type: "span", _key: genKey(), text: first.match[1], marks: ["em"] });
    } else if (first.type === "img") {
      // Inline image in a paragraph — skip (images handled separately)
      // just add the alt text
      children.push({ _type: "span", _key: genKey(), text: first.match[1] || "", marks: [] });
    } else if (first.type === "link") {
      const markKey = genKey();
      children.push({ _type: "span", _key: genKey(), text: first.match[1], marks: [markKey] });
    }

    remaining = remaining.substring(first.index + first.match[0].length);
  }

  // If no children were added, add empty span
  if (children.length === 0) {
    children.push({ _type: "span", _key: genKey(), text: "", marks: [] });
  }

  return children;
}

interface MarkDef {
  _type: string;
  _key: string;
  href: string;
}

function extractMarkDefs(text: string): MarkDef[] {
  const markDefs: MarkDef[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  // We need to correlate mark keys with the ones generated in parseInlineMarkdown
  // Since we generate keys deterministically (counter-based), we need to pre-compute
  // Actually, we need a different approach: store the markDefs during parsing

  // Let's use a simpler approach: scan for links, create markDefs
  // The mark keys need to match what parseInlineMarkdown generates
  // This is a coordination problem — let's solve it by resetting counter

  while ((match = linkRegex.exec(text)) !== null) {
    // Skip image links
    if (match.index > 0 && text[match.index - 1] === "!") continue;

    markDefs.push({
      _type: "link",
      _key: genKey(),
      href: match[2],
    });
  }

  return markDefs;
}

// Better approach: parse inline text AND markDefs together
function parseInlineWithMarkDefs(text: string): {
  children: InlineChild[];
  markDefs: MarkDef[];
} {
  const children: InlineChild[] = [];
  const markDefs: MarkDef[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);
    const linkMatch = remaining.match(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/);

    const candidates: { type: string; index: number; match: RegExpMatchArray }[] = [];
    if (boldMatch && boldMatch.index !== undefined) candidates.push({ type: "bold", index: boldMatch.index, match: boldMatch });
    if (italicMatch && italicMatch.index !== undefined) candidates.push({ type: "italic", index: italicMatch.index, match: italicMatch });
    if (linkMatch && linkMatch.index !== undefined) candidates.push({ type: "link", index: linkMatch.index, match: linkMatch });

    if (candidates.length === 0) {
      if (remaining) {
        children.push({ _type: "span", _key: genKey(), text: remaining, marks: [] });
      }
      break;
    }

    candidates.sort((a, b) => a.index - b.index);
    const first = candidates[0];

    if (first.index > 0) {
      children.push({ _type: "span", _key: genKey(), text: remaining.substring(0, first.index), marks: [] });
    }

    if (first.type === "bold") {
      children.push({ _type: "span", _key: genKey(), text: first.match[1], marks: ["strong"] });
    } else if (first.type === "italic") {
      children.push({ _type: "span", _key: genKey(), text: first.match[1], marks: ["em"] });
    } else if (first.type === "link") {
      const markKey = genKey();
      children.push({ _type: "span", _key: genKey(), text: first.match[1], marks: [markKey] });
      markDefs.push({ _type: "link", _key: markKey, href: first.match[2] });
    }

    remaining = remaining.substring(first.index + first.match[0].length);
  }

  if (children.length === 0) {
    children.push({ _type: "span", _key: genKey(), text: "", marks: [] });
  }

  return { children, markDefs };
}

// Rewrite markdownToPortableText to use the combined parser
function markdownToPortableTextV2(markdown: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    // Custom image comment
    const imgCommentMatch = line.match(
      /<!--\s*IMG:\s*([^|]+)\|\s*LAYOUT:\s*(\S+)\s*\|\s*SIZE:\s*(\S+)\s*-->/
    );
    if (imgCommentMatch) {
      const files = imgCommentMatch[1].split(",").map((f: string) => f.trim());
      const layout = imgCommentMatch[2].trim();
      const size = imgCommentMatch[3].trim();
      for (const file of files) {
        blocks.push({
          _type: "externalImage",
          _key: genKey(),
          url: `/images/${file}`,
          alt: "",
          layout,
          size,
        });
      }
      i++;
      continue;
    }

    // HR
    if (line.trim() === "---") {
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const style = level <= 2 ? "h2" : level === 3 ? "h3" : "h4";
      const { children, markDefs } = parseInlineWithMarkDefs(headingMatch[2]);
      blocks.push({
        _type: "block",
        _key: genKey(),
        style,
        children,
        markDefs,
      });
      i++;
      continue;
    }

    // Full-line image
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (imgMatch) {
      blocks.push({
        _type: "externalImage",
        _key: genKey(),
        url: imgMatch[2],
        alt: imgMatch[1] || "",
        layout: "center",
        size: "medium",
      });
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^- /)) {
      while (i < lines.length && lines[i].match(/^- /)) {
        const text = lines[i].replace(/^- /, "");
        const { children, markDefs } = parseInlineWithMarkDefs(text);
        blocks.push({
          _type: "block",
          _key: genKey(),
          style: "normal",
          listItem: "bullet",
          level: 1,
          children,
          markDefs,
        });
        i++;
      }
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        const text = lines[i].replace(/^\d+\.\s/, "");
        const { children, markDefs } = parseInlineWithMarkDefs(text);
        blocks.push({
          _type: "block",
          _key: genKey(),
          style: "normal",
          listItem: "number",
          level: 1,
          children,
          markDefs,
        });
        i++;
      }
      continue;
    }

    // Paragraph
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].match(/^#{1,4}\s/) &&
      !lines[i].match(/^- /) &&
      !lines[i].match(/^\d+\.\s/) &&
      !lines[i].match(/^---$/) &&
      !lines[i].match(/^!\[/) &&
      !lines[i].match(/<!--\s*IMG:/)
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    if (paragraphLines.length > 0) {
      const text = paragraphLines.join(" ");
      const { children, markDefs } = parseInlineWithMarkDefs(text);
      blocks.push({
        _type: "block",
        _key: genKey(),
        style: "normal",
        children,
        markDefs,
      });
    }
  }

  return blocks;
}

// ---------- Build Sanity document ----------

interface FrontmatterData {
  title?: string;
  date?: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  image?: string;
  tags?: string[];
  servings?: number;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients?: string[];
  ingredientSections?: { title: string; items: string[] }[];
  instructions?: string[];
  instructionSections?: { title: string; steps: string[] }[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
  };
}

function buildSanityDoc(slug: string, data: FrontmatterData, body: PortableTextBlock[]) {
  const hasRecipe =
    data.servings ||
    data.prepTime ||
    data.cookTime ||
    data.ingredients ||
    data.ingredientSections ||
    data.instructions ||
    data.instructionSections ||
    data.nutrition;

  const doc: Record<string, unknown> = {
    _id: `post-${slug}`,
    _type: "post",
    title: data.title || slug,
    slug: { _type: "slug", current: slug },
    date: data.date || new Date().toISOString().split("T")[0],
    category: data.category || "uncategorized",
    excerpt: data.excerpt || "",
    tags: data.tags || [],
    body,
  };

  // Handle image — if it's an external URL, use externalImageUrl
  if (data.image) {
    if (data.image.startsWith("http")) {
      doc.externalImageUrl = data.image;
    }
    // Local images (starting with /) are left for the user to upload manually to Sanity
    // We store the URL in externalImageUrl as a fallback
    if (data.image.startsWith("/")) {
      doc.externalImageUrl = data.image;
    }
  }

  if (hasRecipe) {
    const recipe: Record<string, unknown> = {};
    if (data.servings) recipe.servings = data.servings;
    if (data.prepTime) recipe.prepTime = data.prepTime;
    if (data.cookTime) recipe.cookTime = data.cookTime;
    if (data.totalTime) recipe.totalTime = data.totalTime;
    if (data.ingredients) recipe.ingredients = data.ingredients;
    if (data.ingredientSections) {
      recipe.ingredientSections = data.ingredientSections.map((s) => ({
        _type: "object",
        _key: genKey(),
        title: s.title,
        items: s.items,
      }));
    }
    if (data.instructions) recipe.instructions = data.instructions;
    if (data.instructionSections) {
      recipe.instructionSections = data.instructionSections.map((s) => ({
        _type: "object",
        _key: genKey(),
        title: s.title,
        steps: s.steps,
      }));
    }
    if (data.nutrition) recipe.nutrition = data.nutrition;
    doc.recipe = recipe;
  }

  return doc;
}

// ---------- Main ----------

async function main() {
  console.log("Starting migration...\n");

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  console.log(`Found ${files.length} markdown files.\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(postsDir, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);

    try {
      const body = markdownToPortableTextV2(content);
      const doc = buildSanityDoc(slug, data as FrontmatterData, body);

      await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
      console.log(`  [OK] ${slug}`);
      successCount++;
    } catch (err) {
      console.error(`  [ERR] ${slug}:`, err);
      errorCount++;
    }
  }

  console.log(`\nMigration complete: ${successCount} succeeded, ${errorCount} failed.`);
}

main().catch(console.error);
