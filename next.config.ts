import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack workspace root to this project so Next 16 doesn't walk
  // up to a stray lockfile in the home directory.
  turbopack: {
    root: path.resolve(),
  },
};

export default nextConfig;
