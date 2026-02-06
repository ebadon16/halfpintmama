import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const baseUrl = "https://halfpintmama.com";
  const posts = await getAllPosts();

  // Filter posts that have images
  const postsWithImages = posts.filter((post) => post.image);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${postsWithImages
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/posts/${escapeXml(post.slug)}</loc>
    <image:image>
      <image:loc>${escapeXml(post.image!)}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
      <image:caption>${escapeXml(post.excerpt || post.title)}</image:caption>
    </image:image>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
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
