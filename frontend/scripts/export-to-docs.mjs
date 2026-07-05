// Copies the static export (out/) into the repo-root docs/ folder, which is
// what GitHub Pages is configured to serve (gh-pages branch, /docs folder).
import { cpSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const frontendDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(frontendDir, "out");
const docsDir = path.join(frontendDir, "..", "docs");

rmSync(docsDir, { recursive: true, force: true });
cpSync(outDir, docsDir, { recursive: true });
writeFileSync(path.join(docsDir, ".nojekyll"), "");

console.log(`Copied ${outDir} -> ${docsDir}`);
