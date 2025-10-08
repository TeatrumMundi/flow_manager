import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75],
    unoptimized: true,
  },
};

export default nextConfig;
