/**
 * WordPress to Markdown Migration Script
 *
 * Fetches posts from saved URLs and converts them to markdown files.
 * Uses Wayback Machine since main domain is now on Vercel.
 * Run with: node scripts/migrate-wordpress.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const POST_URLS = require('./post-urls.json');
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Fetch URL content with redirect support
function fetchUrl(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error('Too many redirects'));
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const urlObj = new URL(url);
          redirectUrl = `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
        }
        fetchUrl(redirectUrl, redirectCount + 1).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Parse URL to extract date and slug
function parsePostUrl(url) {
  const match = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)/);
  if (match) {
    return {
      year: match[1],
      month: match[2],
      day: match[3],
      slug: match[4].replace(/\/$/, ''),
      date: `${match[1]}-${match[2]}-${match[3]}`,
    };
  }
  return null;
}

// Determine category from content/title
function guessCategory(title, content) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('sourdough') || lowerTitle.includes('recipe') ||
      lowerTitle.includes('cookie') || lowerTitle.includes('bread') ||
      lowerTitle.includes('granola') || lowerTitle.includes('crackers') ||
      lowerTitle.includes('cobbler') || lowerTitle.includes('cake') ||
      lowerTitle.includes('popsicle') || lowerTitle.includes('tortilla') ||
      lowerTitle.includes('donuts') || lowerTitle.includes('chocolate') ||
      lowerTitle.includes('stuffing') || lowerTitle.includes('chicken') ||
      lowerTitle.includes('truffle') || lowerTitle.includes('hot chocolate') ||
      lowerTitle.includes('brie') || lowerTitle.includes('pinwheel') ||
      lowerTitle.includes('pizza') || lowerTitle.includes('tres leches')) {
    return 'cooking';
  }
  if (lowerTitle.includes('travel') || lowerTitle.includes('banff') ||
      lowerTitle.includes('montana') || lowerTitle.includes('glacier') ||
      lowerTitle.includes('road trip')) {
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
      lowerTitle.includes('gripe water') || lowerTitle.includes('new year activities') ||
      lowerTitle.includes('thanksgiving crafts') || lowerTitle.includes('things i never expected')) {
    return 'mama-life';
  }
  return 'cooking'; // default
}

// Convert HTML to simple markdown
function htmlToMarkdown(html) {
  return html
    // Remove scripts and styles
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gis, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gis, '#### $1\n\n')
    // Paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
    // Bold and italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // Images - capture src
    .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)\n\n')
    // Figure captions
    .replace(/<figcaption[^>]*>(.*?)<\/figcaption>/gi, '*$1*\n\n')
    // Lists
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
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
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Extract content from WordPress page HTML
function extractPostContent(html) {
  // Try to extract title from og:title or title tag
  let title = '';
  const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i);
  if (ogTitleMatch) {
    title = ogTitleMatch[1];
  } else {
    const titleMatch = html.match(/<title>([^<|–-]+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }
  }

  // Try to extract the main content - WordPress.com uses entry-content
  let content = '';
  const contentMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<footer|<div[^>]*class="[^"]*(?:sharedaddy|post-meta|jp-relatedposts))/i);
  if (contentMatch) {
    content = contentMatch[1];
  } else {
    // Alternative pattern
    const altMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (altMatch) {
      content = altMatch[1];
    }
  }

  // Extract featured image from og:image
  let featuredImage = '';
  const imgMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
  if (imgMatch) {
    featuredImage = imgMatch[1];
  }

  // Extract excerpt/description
  let excerpt = '';
  const excerptMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i) ||
                       html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
  if (excerptMatch) {
    excerpt = excerptMatch[1];
  }

  return { title, content, featuredImage, excerpt };
}

// Create markdown file for a post
function createMarkdownFile(urlInfo, postData) {
  const { slug, date } = urlInfo;
  const { title, content, featuredImage, excerpt } = postData;

  const category = guessCategory(title, content);
  const markdownContent = htmlToMarkdown(content);

  // Clean the title for YAML
  const cleanTitle = title
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .trim();

  // Clean the excerpt for YAML
  const cleanExcerpt = (excerpt || '')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .substring(0, 200)
    .trim();

  const frontmatter = `---
title: "${cleanTitle}"
date: "${date}"
slug: "${slug}"
category: "${category}"
excerpt: "${cleanExcerpt}"
image: "${featuredImage || ''}"
---

${markdownContent}
`;

  const filename = `${slug}.md`;
  const filepath = path.join(CONTENT_DIR, filename);

  fs.writeFileSync(filepath, frontmatter);
  console.log(`  ✓ Created: ${filename}`);

  return { slug, category, title: cleanTitle };
}

// Try to fetch from Wayback Machine
async function fetchFromWayback(url) {
  // First check if there's a snapshot
  const checkUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;

  try {
    const checkResponse = await fetchUrl(checkUrl);
    const data = JSON.parse(checkResponse);

    if (data.archived_snapshots && data.archived_snapshots.closest) {
      const snapshotUrl = data.archived_snapshots.closest.url;
      console.log(`    Using Wayback: ${snapshotUrl.substring(0, 60)}...`);
      return await fetchUrl(snapshotUrl);
    }
  } catch (e) {
    // Wayback not available
  }

  return null;
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting WordPress migration...\n');
  console.log(`📋 Processing ${POST_URLS.length} posts\n`);

  const migrated = [];
  const failed = [];

  for (let i = 0; i < POST_URLS.length; i++) {
    const url = POST_URLS[i];
    const urlInfo = parsePostUrl(url);

    if (!urlInfo) {
      console.log(`✗ Skipped (invalid URL): ${url}`);
      failed.push({ url, reason: 'Invalid URL' });
      continue;
    }

    console.log(`[${i + 1}/${POST_URLS.length}] ${urlInfo.slug}`);

    try {
      // Try Wayback Machine first
      let html = await fetchFromWayback(url);

      if (!html) {
        console.log(`    No Wayback snapshot available`);
        failed.push({ url, reason: 'No Wayback snapshot' });
        continue;
      }

      const postData = extractPostContent(html);

      if (!postData.title) {
        console.log(`    ⚠ No title found, skipping`);
        failed.push({ url, reason: 'No title found' });
        continue;
      }

      const result = createMarkdownFile(urlInfo, postData);
      migrated.push(result);

      // Small delay to be nice to archive.org
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`    ✗ Error: ${error.message}`);
      failed.push({ url, reason: error.message });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Migration complete!');
  console.log(`   Migrated: ${migrated.length}`);
  console.log(`   Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\n⚠ Failed posts (you may need to recreate manually):');
    failed.forEach(({ url, reason }) => {
      const slug = url.split('/').filter(Boolean).pop();
      console.log(`  - ${slug}: ${reason}`);
    });
  }

  // Create index of categories
  const categories = {};
  migrated.forEach(post => {
    if (!categories[post.category]) {
      categories[post.category] = [];
    }
    categories[post.category].push(post);
  });

  console.log('\n📊 Posts by category:');
  Object.entries(categories).forEach(([cat, posts]) => {
    console.log(`   ${cat}: ${posts.length} posts`);
  });
}

migrate().catch(console.error);
