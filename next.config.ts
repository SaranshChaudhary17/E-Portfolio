import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Explicitly allow mobile connections to access the dev server assets
    allowedDevOrigins: ["localhost:3000", "192.168.1.3:3000", "10.33.34.187:3000"],
  },
};

export default nextConfig;
