import path from "node:path";
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Repo root, so the client can import ../brandManifest.json
const REPO_ROOT = path.join(__dirname, "..");

const nextConfig: NextConfig = {
  turbopack: { root: REPO_ROOT },
  outputFileTracingRoot: REPO_ROOT,
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["@fortawesome/react-fontawesome"],
  },
};

export default withBundleAnalyzer(nextConfig);
