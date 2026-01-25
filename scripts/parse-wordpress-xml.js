/**
 * WordPress XML Export Parser
 *
 * Parses WordPress XML export and converts posts to markdown files.
 * Run with: node scripts/parse-wordpress-xml.js
 */

const fs = require('fs');
const path = require('path');

const XML_FILE = path.join(__dirname, 'wordpress-export.xml');
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Check if XML file exists
if (!fs.existsSync(XML_FILE)) {
  console.error('❌ Error: wordpress-export.xml not found!');
  console.log('\nPlease:');
  console.log('1. Go to https://wordpress.com/export/halfpintmama.com');
  console.log('2. Download the XML export');
  console.log('3. Save it as: scripts/wordpress-export.xml');
  process.exit(1);
}

// Simple XML parsing (good enough for WordPress exports)
function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = xml.match(regex);
  if (!match) return '';
  // Handle CDATA wrapped content
  const content = match[1].trim();
  return extractCDATA(content);
}

function extractCDATA(content) {
  if (!content) return '';
  const match = content.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return match ? match[1] : content;
}

function extractAllTags(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  const matches = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
}

// Extract items (posts) from XML
function extractItems(xml) {
  const items = [];
  const regex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    items.push(match[1]);
  }
  return items;
}

// Determine category from WordPress categories/tags
function determineCategory(categories) {
  const cats = categories.map(c => c.toLowerCase());

  if (cats.some(c => c.includes('cooking') || c.includes('baking') || c.includes('recipe') || c.includes('sourdough'))) {
    return 'cooking';
  }
  if (cats.some(c => c.includes('travel'))) {
    return 'travel';
  }
  if (cats.some(c => c.includes('diy'))) {
    return 'diy';
  }
  if (cats.some(c => c.includes('mama') || c.includes('parenting') || c.includes('baby') || c.includes('toddler'))) {
    return 'mama-life';
  }
  return 'cooking'; // default
}

// Guess category from title if no categories found
function guessCategoryFromTitle(title) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('sourdough') || lowerTitle.includes('recipe') ||
      lowerTitle.includes('cookie') || lowerTitle.includes('bread') ||
      lowerTitle.includes('granola') || lowerTitle.includes('crackers') ||
      lowerTitle.includes('cobbler') || lowerTitle.includes('cake') ||
      lowerTitle.includes('popsicle') || lowerTitle.includes('tortilla') ||
      lowerTitle.includes('donuts') || lowerTitle.includes('chocolate') ||
      lowerTitle.includes('stuffing') || lowerTitle.includes('chicken') ||
      lowerTitle.includes('truffle') || lowerTitle.includes('brie') ||
      lowerTitle.includes('pinwheel') || lowerTitle.includes('pizza')) {
    return 'cooking';
  }
  if (lowerTitle.includes('travel') || lowerTitle.includes('banff') ||
      lowerTitle.includes('montana') || lowerTitle.includes('glacier')) {
    return 'travel';
  }
  if (lowerTitle.includes('diy') || lowerTitle.includes('costume') ||
      lowerTitle.includes('craft') || lowerTitle.includes('selfie mirror') ||
      lowerTitle.includes('mario') || lowerTitle.includes('luigi')) {
    return 'diy';
  }
  if (lowerTitle.includes('toddler') || lowerTitle.includes('baby') ||
      lowerTitle.includes('mama') || lowerTitle.includes('breastfeeding') ||
      lowerTitle.includes('homesteading') || lowerTitle.includes('swaps') ||
      lowerTitle.includes('gripe water')) {
    return 'mama-life';
  }
  return 'cooking';
}

// Convert HTML to markdown
function htmlToMarkdown(html) {
  if (!html) return '';

  return html
    // Remove scripts and styles
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // WordPress blocks
    .replace(/<!-- wp:[^>]+ -->/g, '')
    .replace(/<!-- \/wp:[^>]+ -->/g, '')
    // Headers
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n')
    // Paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
    // Bold and italic
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    // Images with various attribute orders
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)\n\n')
    // Figure and figcaption
    .replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, '$1\n\n')
    .replace(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi, '*$1*\n\n')
    // Lists
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    // Blockquotes
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '> $1\n\n')
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Divs (remove but keep content)
    .replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\n')
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '...')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Parse a single item - handles WordPress XML namespace tags
function parseItem(itemXml) {
  // Helper to extract and unwrap CDATA from namespaced tags
  function getTagValue(xml, tag) {
    // Handle both regular and namespaced tags (wp:, content:, etc.)
    const regex = new RegExp(`<${tag.replace(':', ':')}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
    const match = xml.match(regex);
    if (!match) return '';
    const value = match[1].trim();
    // Unwrap CDATA if present
    const cdataMatch = value.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    return cdataMatch ? cdataMatch[1] : value;
  }

  const title = getTagValue(itemXml, 'title');
  const link = getTagValue(itemXml, 'link');
  const pubDate = getTagValue(itemXml, 'pubDate');
  const content = getTagValue(itemXml, 'content:encoded');
  const excerpt = getTagValue(itemXml, 'excerpt:encoded');
  const postType = getTagValue(itemXml, 'wp:post_type');
  const status = getTagValue(itemXml, 'wp:status');
  const postName = getTagValue(itemXml, 'wp:post_name');

  // Extract categories
  const categoryMatches = itemXml.match(/<category[^>]*><!\[CDATA\[([^\]]+)\]\]><\/category>/gi) || [];
  const categories = categoryMatches.map(m => {
    const match = m.match(/<!\[CDATA\[([^\]]+)\]\]>/);
    return match ? match[1] : '';
  }).filter(Boolean);

  return {
    title,
    link,
    pubDate,
    content,
    excerpt,
    postType,
    status,
    postName,
    categories,
  };
}

// Format date for frontmatter
function formatDate(pubDate) {
  if (!pubDate) return new Date().toISOString().split('T')[0];
  const date = new Date(pubDate);
  return date.toISOString().split('T')[0];
}

// Create markdown file
function createMarkdownFile(post) {
  const slug = post.postName || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const date = formatDate(post.pubDate);

  // Determine category
  let category = 'cooking';
  if (post.categories.length > 0) {
    category = determineCategory(post.categories);
  } else {
    category = guessCategoryFromTitle(post.title);
  }

  const markdownContent = htmlToMarkdown(post.content);
  const cleanExcerpt = htmlToMarkdown(post.excerpt).substring(0, 200);

  // Extract first image from content as featured image
  let featuredImage = '';
  const imgMatch = post.content.match(/src="([^"]*(?:jpg|jpeg|png|gif|webp)[^"]*)"/i);
  if (imgMatch) {
    featuredImage = imgMatch[1];
  }

  // Clean title for YAML
  const cleanTitle = post.title
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .trim();

  const frontmatter = `---
title: "${cleanTitle}"
date: "${date}"
slug: "${slug}"
category: "${category}"
excerpt: "${cleanExcerpt.replace(/"/g, '\\"').replace(/\n/g, ' ')}"
image: "${featuredImage}"
---

${markdownContent}
`;

  const filename = `${slug}.md`;
  const filepath = path.join(CONTENT_DIR, filename);

  fs.writeFileSync(filepath, frontmatter);
  console.log(`  ✓ ${filename} (${category})`);

  return { slug, category, title: cleanTitle };
}

// Main function
function main() {
  console.log('🚀 Parsing WordPress XML export...\n');

  const xml = fs.readFileSync(XML_FILE, 'utf8');
  const items = extractItems(xml);

  console.log(`📋 Found ${items.length} items in export\n`);

  const migrated = [];
  const skipped = [];

  for (const itemXml of items) {
    const post = parseItem(itemXml);

    // Only process published posts
    if (post.postType !== 'post' || post.status !== 'publish') {
      skipped.push({ title: post.title, reason: `${post.postType}/${post.status}` });
      continue;
    }

    // Skip posts without content
    if (!post.content || post.content.trim().length < 50) {
      skipped.push({ title: post.title, reason: 'No content' });
      continue;
    }

    try {
      const result = createMarkdownFile(post);
      migrated.push(result);
    } catch (error) {
      console.log(`  ✗ Error with "${post.title}": ${error.message}`);
      skipped.push({ title: post.title, reason: error.message });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Migration complete!');
  console.log(`   Posts migrated: ${migrated.length}`);
  console.log(`   Skipped: ${skipped.length}`);

  // Category breakdown
  const categories = {};
  migrated.forEach(post => {
    if (!categories[post.category]) {
      categories[post.category] = [];
    }
    categories[post.category].push(post);
  });

  console.log('\n📊 Posts by category:');
  Object.entries(categories).forEach(([cat, posts]) => {
    console.log(`   ${cat}: ${posts.length}`);
  });

  if (skipped.length > 0 && skipped.length < 20) {
    console.log('\n⏭️ Skipped items:');
    skipped.forEach(({ title, reason }) => {
      console.log(`   - ${title.substring(0, 40)}... (${reason})`);
    });
  }
}

main();
