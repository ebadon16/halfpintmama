import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bloghalfpintmama.wordpress.com",
      },
      {
        protocol: "https",
        hostname: "halfpintmama.com",
      },
    ],
  },
};

export default nextConfig;
