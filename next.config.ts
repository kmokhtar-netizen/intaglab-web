import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '/tmp/makzonx-next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'graph.facebook.com',
      },
    ],
  },
};

export default nextConfig;
