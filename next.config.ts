import type { NextConfig } from "next";
import path from "node:path";

// React and the dev bundler need eval() for source maps and error overlays in
// development only. Production keeps the strict policy.
const devEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devEval} https://va.vercel-scripts.com https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://*.sanity.io https://api.sanity.io https://cdn.sanity.io https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // The freezer-labels PDF is built on demand from assets that live outside
  // the bundle (brand fonts, Keegan's label artwork). Trace them into every
  // serverless function: the directory is a few hundred KB and keying this on
  // one route would silently break if the route ever moved.
  outputFileTracingIncludes: {
    "/**/*": ["./private/shop/**/*"],
  },
  async headers() {
    return [
      {
        source: "/((?!studio).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
      {
        // The printables are free and linked from indexable pages, but the PDFs
        // themselves should not compete with those pages in search results.
        source: "/downloads/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        // Studio is excluded from the relaxed CSP above, but must still not be
        // framable by third-party origins (clickjacking on the login).
        source: "/studio/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // robots.txt only blocks crawling; without noindex the studio URL can
          // still be indexed by reference.
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // The "Mama Life Guide" lead magnet was never produced (no asset, no
        // delivery automation), so the page promised a guide it couldn't send.
        // Point mama-life visitors at the real mama-life content instead.
        // Temporary (307) in case the guide ships later.
        source: "/mama-guide",
        destination: "/mama-life",
        permanent: false,
      },
      {
        source: "/travel",
        destination: "/mama-life/travel",
        permanent: true,
      },
      {
        source: "/diy",
        destination: "/mama-life/diy",
        permanent: true,
      },
      {
        source: "/lifestyle",
        destination: "/mama-life",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "halfpintmama.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
