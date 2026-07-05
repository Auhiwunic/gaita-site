import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 defaults to WebP only; add AVIF for a further size cut.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
