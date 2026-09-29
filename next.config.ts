import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Content lives in /content and is read at build time; every page is static.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
