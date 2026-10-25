import type { NextConfig } from "next";

// Static export: the site is plain files, so it can sit on any host or CDN.
const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  // This folder sits inside the wallet repo; it is its own project.
  turbopack: { root: process.cwd() },
};

export default config;
