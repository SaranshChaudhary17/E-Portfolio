/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei", "framer-motion"]
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    config.cache = false;
    config.snapshot = {
      ...(config.snapshot ?? {}),
      managedPaths: [],
      immutablePaths: []
    };
    return config;
  }
};

export default nextConfig;
