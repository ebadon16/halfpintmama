Run an SEO audit on the Half Pint Mama site. Check:

1. **Meta tags** on all pages in `src/app/(site)/`:
   - Title exists and is descriptive (50-60 chars ideal)
   - Description exists and is 150-160 characters
   - Canonical URL is set
   - OpenGraph tags (title, description, image, url)
   - Twitter card tags

2. **Structured data** (JSON-LD):
   - Homepage: WebSite + Organization schemas
   - Post pages: Recipe OR BlogPosting + BreadcrumbList
   - DIY posts: HowTo schema
   - /about: Person schema
   - /free-guide: FAQPage schema

3. **Sitemaps**:
   - `/sitemap.xml` includes all public pages
   - `/image-sitemap.xml` includes recipe images
   - `/robots.ts` references both sitemaps

4. **Images**:
   - All `<Image>` components have `sizes` prop
   - Alt text is descriptive (not just title)

Report issues with file path, what's missing, and suggested fix.
If a specific page is mentioned (e.g., "/seo-check /cooking"), focus only on that page.
