// Mirrors the basePath logic in next.config.ts. next/image's `unoptimized`
// mode (required for static export, since there's no image server) does not
// automatically prefix local `src`s with basePath the way _next/static
// assets are — so any asset referenced directly (e.g. from public/) needs
// this prefix applied by hand, or it 404s once deployed under
// /Collaboration_Platform/.
export const BASE_PATH = process.env.NODE_ENV === "production" ? "/Collaboration_Platform" : "";

export function withBasePath(path: string) {
  return `${BASE_PATH}${path}`;
}
