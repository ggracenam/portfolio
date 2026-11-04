import type { NextConfig } from "next";

// GitHub Pages "project" sites live at https://<user>.github.io/<repo>, so the
// build needs a base path there (e.g. NEXT_PUBLIC_BASE_PATH=/portfolio).
// Leave it empty for Vercel, a custom domain, or a <user>.github.io repo.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static export: `next build` writes plain HTML/CSS/JS to ./out, which works
  // on GitHub Pages, Vercel, Netlify, or any static host.
  output: "export",
  trailingSlash: true,
  basePath,
  images: {
    // The built-in image optimizer needs a server, so it is off for static export.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "framerusercontent.com" }],
  },
};

export default nextConfig;
