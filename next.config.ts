import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/travel",
        destination: "/mama-life",
        permanent: true,
      },
      {
        source: "/diy",
        destination: "/cooking",
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
