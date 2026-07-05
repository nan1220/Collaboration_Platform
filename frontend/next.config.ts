import type { NextConfig } from "next";

// GitHub Pages project sites are served from https://<user>.github.io/<repo>/,
// so production builds need that path baked in as basePath/assetPrefix. Local
// dev (`next dev`) stays at the root so it's not confusing to develop against.
const REPO_BASE_PATH = "/Collaboration_Platform";
const isProdBuild = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProdBuild ? REPO_BASE_PATH : "",
  assetPrefix: isProdBuild ? REPO_BASE_PATH : "",
};

export default nextConfig;
