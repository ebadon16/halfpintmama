import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPosts();
  const baseUrl = "https://halfpintmama.com";

  const rssItems = posts
    .slice(0, 20) // Latest 20 posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/posts/${escapeXml(post.slug)}</link>
      <guid isPermaLink="true">${baseUrl}/posts/${escapeXml(post.slug)}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      ${post.image ? `<enclosure url="${escapeXml(post.image)}" type="image/jpeg" length="0"/>` : ""}
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Half Pint Mama</title>
    <link>${baseUrl}</link>
    <description>Nourishing Motherhood From Scratch — from-scratch recipes, sourdough baking, and honest motherhood from a Pediatric ER RN &amp; mama of two.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.jpg</url>
      <title>Half Pint Mama</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
